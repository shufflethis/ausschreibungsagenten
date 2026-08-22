const API_ORIGIN = 'https://api.ausschreibungsagenten.de'

function operationId(method, path) {
    const clean = path
        .replace(/[{}]/g, '')
        .split('/')
        .filter(Boolean)
        .map((part) => part.replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase()))
        .map((part, index) => index ? part.charAt(0).toUpperCase() + part.slice(1) : part)
        .join('')
    return `${method.toLowerCase()}${clean.charAt(0).toUpperCase()}${clean.slice(1)}`
}

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD')
        return res.status(405).json({
            type: 'https://www.ausschreibungsagenten.de/problems/method-not-allowed',
            title: 'Method not allowed', status: 405, code: 'method_not_allowed',
            message: 'The OpenAPI document supports GET and HEAD only.',
            resolution: 'Send GET /openapi.json.',
        })
    }

    try {
        const upstream = await fetch(`${API_ORIGIN}/openapi.json`, { headers: { Accept: 'application/json' } })
        if (!upstream.ok) throw new Error(`upstream HTTP ${upstream.status}`)
        const spec = await upstream.json()
        spec.info = {
            ...spec.info,
            title: 'Ausschreibungsagenten Public API',
            description: 'Typed API for public tender search, source freshness, country coverage, company profiles, A2A and MCP.',
            license: { name: 'Proprietary', url: 'https://www.ausschreibungsagenten.de/agb' },
            'x-deprecation-policy': 'Incompatible removals are announced at least 12 months ahead with Deprecation and Sunset headers.',
        }
        spec.servers = [
            { url: API_ORIGIN, description: 'Production API' },
            { url: 'https://www.ausschreibungsagenten.de', description: 'Same-origin public aliases and proxy endpoints' },
        ]
        spec.security = []
        spec.externalDocs = { description: 'Developer documentation', url: 'https://www.ausschreibungsagenten.de/entwickler' }
        spec['x-deprecation-policy-url'] = 'https://www.ausschreibungsagenten.de/api-policy.md'
        spec['x-sandbox'] = {
            description: 'Anonymous public preview endpoints are read-only and safe for integration tests.',
            endpoints: ['/api/tenders-public', '/api/source-status', '/api/countries'],
        }

        const used = new Set()
        for (const [path, pathItem] of Object.entries(spec.paths || {})) {
            for (const method of ['get', 'post', 'put', 'patch', 'delete']) {
                const operation = pathItem?.[method]
                if (!operation) continue
                let id = operation.operationId || operationId(method, path)
                while (used.has(id)) id += 'Operation'
                used.add(id)
                operation.operationId = id
                operation.description ||= operation.summary || `${method.toUpperCase()} ${path}`
            }
        }

        res.setHeader('Content-Type', 'application/json; charset=utf-8')
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
        res.setHeader('Link', '</entwickler>; rel="service-doc", </.well-known/api-catalog>; rel="api-catalog"')
        return res.status(200).send(req.method === 'HEAD' ? '' : JSON.stringify(spec, null, 2))
    } catch (error) {
        console.error('OpenAPI proxy failed:', error)
        res.setHeader('Content-Type', 'application/problem+json; charset=utf-8')
        return res.status(502).json({
            type: 'https://www.ausschreibungsagenten.de/problems/upstream-unavailable',
            title: 'OpenAPI upstream unavailable', status: 502, code: 'upstream_unavailable',
            message: 'The canonical API specification could not be loaded.',
            resolution: 'Retry later or open https://api.ausschreibungsagenten.de/docs.',
        })
    }
}
