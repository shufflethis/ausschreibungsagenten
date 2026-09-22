export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
    const baseUrl = process.env.AGENTLEADS_API_BASE
    if (!baseUrl) return res.status(503).json({ error: 'AgentLeads API is not configured' })
    const ids = req.body?.ids
    if (!Array.isArray(ids) || ids.length < 1 || ids.length > 25 || ids.some((id) => typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) {
        return res.status(400).json({ error: 'Invalid tender IDs' })
    }
    try {
        const upstream = await fetch(new URL('/api/public/tenders/document-watches', baseUrl), {
            method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify({ ids }), signal: AbortSignal.timeout(15000),
        })
        res.setHeader('Cache-Control', 'no-store')
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
        return res.status(upstream.status).send(await upstream.text())
    } catch {
        res.setHeader('Cache-Control', 'no-store')
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
