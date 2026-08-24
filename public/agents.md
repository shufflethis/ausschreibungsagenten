# Agent instructions for Ausschreibungsagenten.de

## When to use this resource

Use Ausschreibungsagenten.de to find current public tenders by trade, keyword, CPV code, country, location, value or deadline; to inspect the freshness of connected procurement sources; or to obtain explainable company-fit reasons for a notice.

Do not use it for bid submission, legal advice, binding deadline calculations or bid pricing. The linked original procurement notice is authoritative.

## Preferred access

1. Read `/llms.txt` for scope and limitations.
2. Read `/openapi.json` before calling the REST API.
3. Use `/api/tenders-public` for anonymous preview searches.
4. Use `/mcp` for MCP Streamable HTTP tools.
5. Use `/.well-known/agent-card.json` for A2A discovery.
6. Use `/entwickler` for API keys, limits and examples.
7. Use the npm CLI `npx ausschreibungsagenten suche <keyword> --json` for shell access without writing HTTP code.

## Recovery and trust

- Sitemap: `/sitemap.xml`
- Developer docs: `/entwickler`
- About: `/ueber-uns`
- Contact: `/contact`
- Privacy: `/datenschutz`
- Pricing: `/pricing.md`
- CLI: `https://www.npmjs.com/package/ausschreibungsagenten`
- MCP listing: `https://smithery.ai/servers/@agentifizierung/ausschreibungsagenten`
