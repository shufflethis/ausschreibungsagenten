export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const baseUrl = process.env.AGENTLEADS_API_BASE
    if (!baseUrl) {
        return res.status(503).json({ error: 'AgentLeads API is not configured' })
    }

    try {
        const upstream = await fetch(new URL('/api/source-status', baseUrl), {
            headers: { Accept: 'application/json' },
        })
        const body = await upstream.text()
        res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
        return res.status(upstream.status).send(body)
    } catch (err) {
        console.error('AgentLeads source status proxy failed:', err)
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
