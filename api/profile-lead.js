function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
}

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320
}

async function notifyByEmail(lead) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return false
    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'hi@ausschreibungsagenten.de'
    const sender = process.env.RESEND_FROM || 'Ausschreibungsagenten <no-reply@ausschreibungsagenten.de>'
    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
            from: sender,
            to: [recipient],
            reply_to: lead.email,
            subject: `Neue Pilotanfrage: ${lead.company}`,
            text: [
                'Neue Anfrage für einen Ausschreibungsagenten.',
                '',
                `Unternehmen: ${lead.company}`,
                `E-Mail: ${lead.email}`,
                `Branche: ${lead.industry || '–'}`,
                `Region: ${lead.region || '–'}`,
                `Ziel-Auftragsvolumen: ${lead.budget || '–'}`,
                `Bisherige Teilnahme: ${lead.frequency || '–'}`,
                `Zeitpunkt: ${lead.receivedAt}`,
                '',
                'Gesuchte Leistungen:',
                lead.services,
                '',
                'Hinweis: Ein Kundenkonto wird ausschließlich intern vorbereitet und per Magic Link freigegeben.',
            ].join('\n'),
        }),
    })
    if (!response.ok) throw new Error(`Resend profile notification failed (${response.status})`)
    return true
}

async function notifyBySlack(lead) {
    const token = process.env.SLACK_BOT_TOKEN
    const channel = process.env.SLACK_CHANNEL_ID
    if (!token || !channel) return false
    const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            channel,
            text: [
                `Neue Pilotanfrage: ${lead.company}`,
                `E-Mail: ${lead.email}`,
                `Branche: ${lead.industry || '–'} · Region: ${lead.region || '–'}`,
                `Volumen: ${lead.budget || '–'} · Erfahrung: ${lead.frequency || '–'}`,
                `Leistungen: ${lead.services}`,
            ].join('\n'),
        }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.ok) throw new Error(`Slack profile notification failed: ${data.error || response.status}`)
    return true
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.ausschreibungsagenten.de')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    if (req.method === 'OPTIONS') return res.status(204).end()
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

    const honeypot = clean(req.body?.website, 100)
    if (honeypot) return res.status(200).json({ success: true })
    const lead = {
        email: clean(req.body?.email, 320).toLowerCase(),
        company: clean(req.body?.company, 300),
        industry: clean(req.body?.industry, 120),
        region: clean(req.body?.region, 200),
        services: clean(req.body?.services, 4000),
        budget: clean(req.body?.budget, 120),
        frequency: clean(req.body?.frequency, 120),
        receivedAt: new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' }),
    }
    if (!lead.company || !lead.services || !validEmail(lead.email)) {
        return res.status(400).json({ error: 'E-Mail, Unternehmen und Leistungen sind erforderlich.' })
    }

    const deliveries = []
    if (process.env.RESEND_API_KEY) deliveries.push(notifyByEmail(lead))
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) deliveries.push(notifyBySlack(lead))
    if (!deliveries.length) return res.status(500).json({ error: 'Server configuration error' })
    const results = await Promise.allSettled(deliveries)
    results.forEach((result) => {
        if (result.status === 'rejected') console.error('Profile notification failed:', result.reason)
    })
    if (results.every((result) => result.status === 'rejected')) {
        return res.status(502).json({ error: 'Pilotanfrage konnte nicht zugestellt werden.' })
    }
    return res.status(200).json({ success: true, email: lead.email, company: lead.company })
}
