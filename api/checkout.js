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

    const { email, plan, profile_id } = req.body || {}
    if (!email || !plan) {
        return res.status(400).json({ error: 'E-Mail und Plan sind erforderlich.' })
    }

    const agentleadsBase = process.env.AGENTLEADS_API_BASE
    if (!agentleadsBase) {
        console.error('Missing AGENTLEADS_API_BASE')
        return res.status(500).json({ error: 'AgentLeads API is not configured' })
    }

    try {
        const checkoutUrl = new URL('/api/billing/checkout', agentleadsBase)
        const checkoutRes = await fetch(checkoutUrl.toString(), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ email, plan, profile_id }),
        })
        const data = await checkoutRes.json().catch(() => null)
        if (!checkoutRes.ok) {
            console.error('AgentLeads checkout API error:', data)
            return res.status(checkoutRes.status).json(data || { error: 'Checkout konnte nicht erstellt werden.' })
        }
        return res.status(200).json(data)
    } catch (err) {
        console.error('Checkout request failed:', err)
        return res.status(502).json({ error: 'Checkout API ist gerade nicht erreichbar.' })
    }
}
