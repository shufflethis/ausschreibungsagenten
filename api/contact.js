function cleanHeader(value) {
    return String(value || '').replace(/[\r\n]+/g, ' ').trim().slice(0, 160)
}

async function sendResendNotification({ name, email, company, branche, message, receivedAt }) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) return false

    const recipient = process.env.CONTACT_NOTIFICATION_EMAIL || 'hi@ausschreibungsagenten.de'
    const sender = process.env.RESEND_FROM || 'Ausschreibungsagenten <no-reply@ausschreibungsagenten.de>'
    const safeName = cleanHeader(name)
    const safeCompany = cleanHeader(company)
    const subjectSuffix = safeCompany ? `${safeName} · ${safeCompany}` : safeName
    const text = [
        'Eine neue Kontaktanfrage wurde über ausschreibungsagenten.de gesendet.',
        '',
        `Name: ${name}`,
        `E-Mail: ${email}`,
        `Unternehmen: ${company || '–'}`,
        `Branche: ${branche || '–'}`,
        `Zeitpunkt: ${receivedAt}`,
        '',
        'Nachricht:',
        message,
    ].join('\n')

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            from: sender,
            to: [recipient],
            reply_to: email,
            subject: `Neue Kontaktanfrage: ${subjectSuffix}`,
            text,
        }),
    })

    if (!response.ok) {
        const error = await response.text().catch(() => '')
        throw new Error(`Resend API error (${response.status}): ${error.slice(0, 300)}`)
    }
    return true
}

async function sendSlackNotification({ name, email, company, branche, message, receivedAt }) {
    const token = process.env.SLACK_BOT_TOKEN
    const channel = process.env.SLACK_CHANNEL_ID
    if (!token || !channel) return false

    const blocks = [
        {
            type: 'header',
            text: { type: 'plain_text', text: '📢 Neue Anfrage: Ausschreibungsagenten.de', emoji: true },
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*Name:*\n${name}` },
                { type: 'mrkdwn', text: `*E-Mail:*\n${email}` },
            ],
        },
        ...(company || branche ? [{
            type: 'section',
            fields: [
                ...(company ? [{ type: 'mrkdwn', text: `*Unternehmen:*\n${company}` }] : []),
                ...(branche ? [{ type: 'mrkdwn', text: `*Branche:*\n${branche}` }] : []),
            ],
        }] : []),
        {
            type: 'section',
            text: { type: 'mrkdwn', text: `*Nachricht:*\n${message}` },
        },
        {
            type: 'context',
            elements: [
                { type: 'mrkdwn', text: `📍 Quelle: ausschreibungsagenten.de | ${receivedAt}` },
            ],
        },
    ]

    const response = await fetch('https://slack.com/api/chat.postMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            channel,
            blocks,
            text: `Neue Anfrage von ${name} (${email}) via ausschreibungsagenten.de`,
        }),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.ok) {
        throw new Error(`Slack API error: ${data.error || response.status}`)
    }
    return true
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const { name, email, company, branche, message } = req.body || {}
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind erforderlich.' })
    }

    const receivedAt = new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })
    const deliveries = []
    if (process.env.RESEND_API_KEY) {
        deliveries.push({
            channel: 'resend',
            promise: sendResendNotification({ name, email, company, branche, message, receivedAt }),
        })
    }
    if (process.env.SLACK_BOT_TOKEN && process.env.SLACK_CHANNEL_ID) {
        deliveries.push({
            channel: 'slack',
            promise: sendSlackNotification({ name, email, company, branche, message, receivedAt }),
        })
    }

    if (!deliveries.length) {
        console.error('Neither Resend nor Slack is configured for contact notifications')
        return res.status(500).json({ error: 'Server configuration error' })
    }

    const results = await Promise.allSettled(deliveries.map(({ promise }) => promise))
    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            console.error(`${deliveries[index].channel} contact notification failed:`, result.reason)
        }
    })

    if (results.every((result) => result.status === 'rejected')) {
        return res.status(502).json({ error: 'Failed to send notification' })
    }
    return res.status(200).json({ success: true })
}
