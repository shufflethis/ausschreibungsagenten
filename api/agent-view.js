const body = `---
mode: agent
authentication: anonymous_or_api_key
openapi: /openapi.json
mcp: /mcp
a2a: /api/a2a
pricing: /pricing.md
capabilities: [tender_search, source_status, country_coverage, explainable_matching]
---

# Ausschreibungsagenten.de

Find current public procurement notices from 17 connected sources across Germany, the EU and the United Kingdom.

## Authentication

Public preview search is anonymous. Higher limits and protected tools use an X-API-Key documented in /auth.md.

## Capabilities

- Search tenders by keyword, CPV code, country, score, value and deadline.
- Inspect source freshness and indexed country coverage.
- Return explainable match reasons and the original notice URL.
- Query through REST, A2A JSON-RPC or MCP Streamable HTTP.

## Machine endpoints

- OpenAPI: /openapi.json
- Public search: /api/tenders-public
- Source status: /api/source-status
- Countries: /api/countries
- MCP: /mcp
- A2A Agent Card: /.well-known/agent-card.json
- Developer docs: /entwickler
- API catalog: /.well-known/api-catalog

## Rate limits

Anonymous and authenticated limits are published in response headers and documented on /entwickler.

## Error handling

REST errors are JSON with a machine-readable code, human-readable message and resolution hint. A2A and MCP use JSON-RPC errors.

## Safety

The linked original procurement notice is authoritative. This service does not submit bids or provide legal advice.
`

export default function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        res.setHeader('Allow', 'GET, HEAD')
        return res.status(405).json({
            type: 'https://www.ausschreibungsagenten.de/problems/method-not-allowed',
            title: 'Method not allowed',
            status: 405,
            code: 'method_not_allowed',
            message: 'The agent view supports GET and HEAD only.',
            resolution: 'Send a GET request or read /openapi.json.',
        })
    }
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
    res.setHeader('Vary', 'Accept, Accept-Encoding, User-Agent')
    res.setHeader('Link', '</index.md>; rel="alternate"; type="text/markdown", </openapi.json>; rel="service-desc", </.well-known/api-catalog>; rel="api-catalog"')
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    return res.status(200).send(req.method === 'HEAD' ? '' : body)
}
