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

    const { email, company, industry, region, services, budget, frequency } = req.body

    if (!email || !company || !services) {
        return res.status(400).json({ error: 'E-Mail, Unternehmen und Leistungen sind erforderlich.' })
    }

    const agentleadsBase = process.env.AGENTLEADS_API_BASE
    if (!agentleadsBase) {
        console.error('Missing AGENTLEADS_API_BASE')
        return res.status(500).json({ error: 'AgentLeads API is not configured' })
    }

    try {
        const profileUrl = new URL('/api/public/company-profiles', agentleadsBase)
        const profileRes = await fetch(profileUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, company, industry, region, services, budget, frequency, source: 'website-profile' }),
        })

        const profile = await profileRes.json().catch(() => null)
        if (!profileRes.ok) {
            console.error('AgentLeads profile API error:', profile)
            return res.status(profileRes.status).json(profile || { error: 'Failed to store company profile' })
        }

        const token = process.env.SLACK_BOT_TOKEN
        const channel = process.env.SLACK_CHANNEL_ID
        if (token && channel) {
            const blocks = [
                {
                    type: 'header',
                    text: { type: 'plain_text', text: '🎯 Neues Firmenprofil: Ausschreibungsagenten.de', emoji: true },
                },
                {
                    type: 'section',
                    fields: [
                        { type: 'mrkdwn', text: `*Profil-ID:*\n${profile.id}` },
                        { type: 'mrkdwn', text: `*Unternehmen:*\n${company}` },
                        { type: 'mrkdwn', text: `*E-Mail:*\n${email}` },
                        { type: 'mrkdwn', text: `*Branche:*\n${industry || 'Nicht angegeben'}` },
                        { type: 'mrkdwn', text: `*Region:*\n${region || 'Deutschlandweit / offen'}` },
                        { type: 'mrkdwn', text: `*Auftragsvolumen:*\n${budget || 'Nicht angegeben'}` },
                        { type: 'mrkdwn', text: `*Vergabe-Frequenz:*\n${frequency || 'Nicht angegeben'}` },
                    ],
                },
                {
                    type: 'section',
                    text: { type: 'mrkdwn', text: `*Leistungen / Suchprofil:*\n${services}` },
                },
                {
                    type: 'context',
                    elements: [
                        { type: 'mrkdwn', text: `Quelle: AgentLeads ${profile.source} | ${new Date().toLocaleString('de-DE', { timeZone: 'Europe/Berlin' })}` },
                    ],
                },
            ]

            const slackRes = await fetch('https://slack.com/api/chat.postMessage', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    channel,
                    blocks,
                    text: `Neues Ausschreibungsprofil: ${company} (${email})`,
                }),
            })
            const data = await slackRes.json()
            if (!data.ok) {
                console.error('Slack API error:', data.error)
            }
        }

        return res.status(200).json({ success: true, profile_id: profile.id })
    } catch (err) {
        console.error('Profile lead request failed:', err)
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
