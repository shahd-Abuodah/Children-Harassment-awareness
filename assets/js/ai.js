// Unified AI caller — the ONE place the app talks to the model.
// It automatically works in two environments:
//
//   1) LOCAL DEV: if a token exists in config.js (window.AI_TOKEN), it calls
//      GitHub Models directly from the browser.
//
//   2) DEPLOYED (e.g. Vercel): there is NO token in the browser. It calls the
//      serverless proxy at /api/ai, which holds the token as a secret server
//      environment variable. The visitor never sees the token.
//
// Returns the assistant's text, or throws on failure (callers handle fallback).
window.callAI = async function (messages, options) {
    options = options || {};
    const payload = {
        model: window.AI_MODEL || 'openai/gpt-4.1-nano',
        messages: messages,
        temperature: options.temperature != null ? options.temperature : 0.7,
        max_tokens: options.max_tokens || 800
    };

    const hasLocalToken = window.AI_TOKEN && window.AI_TOKEN.indexOf('PASTE_YOUR') !== 0;

    let res;
    if (hasLocalToken) {
        // Local development: call GitHub Models directly with the token.
        res = await fetch('https://models.github.ai/inference/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.AI_TOKEN
            },
            body: JSON.stringify(payload)
        });
    } else {
        // Deployed: call our own serverless proxy (token stays on the server).
        res = await fetch('/api/ai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    }

    if (!res.ok) {
        const errText = await res.text().catch(() => '');
        throw new Error('AI HTTP ' + res.status + ': ' + errText);
    }

    const data = await res.json();
    const text = data && data.choices && data.choices[0] &&
        data.choices[0].message && data.choices[0].message.content;
    if (!text) throw new Error('AI: empty response');
    return text;
};
