function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
}

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const baseUrl = process.env.AGENTLEADS_API_BASE
    if (!baseUrl) {
        return res.status(503).json({ error: 'AgentLeads API is not configured' })
    }

    const { email, website } = req.body || {}

    // Honeypot: Bots füllen das versteckte Feld — Anfrage still verwerfen.
    if (clean(website, 200)) {
        return res.status(200).json({ ok: true })
    }

    const cleanEmail = clean(email, 320)
    if (!validEmail(cleanEmail)) {
        return res.status(400).json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' })
    }

    try {
        const upstream = await fetch(new URL('/api/signup', baseUrl), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email: cleanEmail, tier: 'free' }),
        })
        const body = await upstream.text()
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
        return res.status(upstream.status).send(body)
    } catch (err) {
        console.error('AgentLeads signup proxy failed:', err)
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
