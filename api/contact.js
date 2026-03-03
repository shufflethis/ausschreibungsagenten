export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method === 'OPTIONS') {
        return res.status(200).end()
    }

    const { name, email, company, branche, message } = req.body

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, E-Mail und Nachricht sind erforderlich.' })
    }

    const token = process.env.SLACK_BOT_TOKEN
    const channel = process.env.SLACK_CHANNEL_ID

    if (!token || !channel) {
        console.error('Missing SLACK_BOT_TOKEN or SLACK_CHANNEL_ID')
        return res.status(500).json({ error: 'Server configuration error' })
    }

    const blocks = [
        {
            type: 'header',
            text: { type: 'plain_text', text: '📢 Neue Anfrage: Ausschreibungsagenten.de', emoji: true }
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*Name:*\n${name}` },
                { type: 'mrkdwn', text: `*E-Mail:*\n${email}` },
            ]
        },
        ...(company || branche ? [{
            type: 'section',
            fields: [
                ...(company ? [{ type: 'mrkdwn', text: `*Unternehmen:*\n${company}` }] : []),
                ...(branche ? [{ type: 'mrkdwn', text: `*Branche:*\n${branche}` }] : []),
            ]
        }] : []),
        {
            type: 'section',
            text: { type: 'mrkdwn', text: `*Nachricht:*\n${message}` }
        },
        {
            type: 'context',
            elements: [
                { type: 'mrkdwn', text: `📍 Quelle: ausschreibungsagenten.de | ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}` }
            ]
        }
    ]

    try {
        const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                channel,
                blocks,
                text: `Neue Anfrage von ${name} (${email}) via ausschreibungsagenten.de`,
            }),
        })

        const data = await slackRes.json()

        if (!data.ok) {
            console.error('Slack API error:', data.error)
            return res.status(500).json({ error: 'Failed to send message' })
        }

        return res.status(200).json({ success: true })
    } catch (err) {
        console.error('Slack request failed:', err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}
