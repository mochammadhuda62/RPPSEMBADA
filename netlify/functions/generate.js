/* eslint-disable no-undef */

// Ini adalah "Penjaga Gerbang" (Serverless Function) di Netlify.
// Ini berjalan di server, bukan di browser.

exports.handler = async (event) => {
    // 1. Ambil Kunci API Rahasia dari Netlify (yang akan kita atur nanti)
    // process.env.GEMINI_API_KEY adalah cara aman mengakses kunci.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API Key tidak diatur di server." }),
        };
    }
    
    // 2. Tentukan URL Google API yang sebenarnya
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

    // 3. Ambil 'payload' yang dikirim dari index.html
    // event.body adalah string, jadi kita parse dulu
    const body = JSON.parse(event.body);

    try {
        // 4. Panggil Google API dari server
        const response = await fetch(googleApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body) // Teruskan payload dari index.html
        });

        const data = await response.json();

        if (!response.ok) {
            // Jika Google API error, kirim error itu kembali ke browser
            return {
                statusCode: response.status,
                body: JSON.stringify(data),
            };
        }

        // 5. Kirim respons sukses dari Google kembali ke index.html
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};