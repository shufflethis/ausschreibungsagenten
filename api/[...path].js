export default function handler(req, res) {
    res.setHeader('Content-Type', 'application/problem+json; charset=utf-8')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('RateLimit-Limit', '600')
    res.setHeader('RateLimit-Remaining', '599')
    res.setHeader('RateLimit-Reset', '3600')
    return res.status(404).json({
        type: 'https://www.ausschreibungsagenten.de/problems/route-not-found',
        title: 'API route not found',
        status: 404,
        code: 'route_not_found',
        message: `No public API operation exists at ${req.url}.`,
        detail: `No public API operation exists at ${req.url}.`,
        instance: req.url,
        resolution: 'Read /openapi.json or /entwickler and call a documented endpoint.',
    })
}
