export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const baseUrl = process.env.AGENTLEADS_API_BASE
    if (!baseUrl) {
        return res.status(503).json({ error: 'AgentLeads API is not configured' })
    }

    const upstreamUrl = new URL('/api/public/tenders', baseUrl)
    const allowedParams = [
        'country', 'search', 'cpv', 'vertical', 'performance_region',
        'minimum_value_eur', 'maximum_value_eur', 'deadline_within_days',
        'only_active', 'min_score', 'limit', 'offset', 'summary_lang', 'ids',
    ]
    for (const key of allowedParams) {
        const value = req.query[key]
        if (Array.isArray(value)) {
            value.forEach((item) => upstreamUrl.searchParams.append(key, item))
        } else if (value !== undefined) {
            upstreamUrl.searchParams.set(key, value)
        }
    }

    try {
        const upstream = await fetch(upstreamUrl.toString(), {
            headers: { Accept: 'application/json' },
            signal: AbortSignal.timeout(15000),
        })
        const body = await upstream.text()

        res.setHeader('Cache-Control', upstream.ok
            ? 's-maxage=60, stale-while-revalidate=120'
            : 'no-store')
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
        return res.status(upstream.status).send(body)
    } catch (err) {
        console.error('AgentLeads public tender proxy failed:', err)
        res.setHeader('Cache-Control', 'no-store')
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
