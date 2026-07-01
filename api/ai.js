// Serverless proxy for GitHub Models (runs on Vercel/Netlify functions).
// It keeps the AI token SECRET on the server so it never reaches the browser.
//
// Setup on Vercel:
//   Project -> Settings -> Environment Variables -> add:
//     Name:  AI_TOKEN   Value: <your GitHub Models token>
//   (optional) AI_MODEL = openai/gpt-4.1-nano
//
// This file contains NO secret, so it is safe to commit to GitHub.

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.AI_TOKEN;
    if (!token) {
        return res.status(500).json({ error: 'AI_TOKEN is not configured on the server' });
    }

    try {
        // req.body is auto-parsed JSON on Vercel. Forward it, but pin a default model.
        const body = req.body || {};
        if (!body.model) body.model = process.env.AI_MODEL || 'openai/gpt-4.1-nano';

        const upstream = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(body)
        });

        const data = await upstream.json();
        return res.status(upstream.status).json(data);
    } catch (err) {
        return res.status(500).json({ error: String(err) });
    }
}
