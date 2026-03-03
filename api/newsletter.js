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

    const { email } = req.body

    if (!email) {
        return res.status(400).json({ error: 'E-Mail ist erforderlich.' })
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
            text: { type: 'plain_text', text: '📬 Newsletter-Anmeldung: Ausschreibungsagenten.de', emoji: true }
        },
        {
            type: 'section',
            fields: [
                { type: 'mrkdwn', text: `*E-Mail:*\n${email}` },
            ]
        },
        {
            type: 'context',
            elements: [
                { type: 'mrkdwn', text: `📍 Quelle: ausschreibungsagenten.de Newsletter | ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}` }
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
                text: `Newsletter-Anmeldung: ${email} via ausschreibungsagenten.de`,
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
