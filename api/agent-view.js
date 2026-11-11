const body = `---
mode: agent
authentication: anonymous_or_api_key
auth: /auth.md
pricing: /pricing.md
rate_limits: response_headers
sandbox: anonymous_public_preview
openapi: /openapi.json
mcp: /mcp
a2a: /api/a2a
llms: /llms.txt
capabilities: [tender_search, source_status, country_coverage, explainable_matching, gaeb_x83_x84_readonly]
---

# Ausschreibungsagenten.de

Find current public procurement notices from 18 connected sources across Germany, the EU, the United Kingdom and US federal agencies (SAM.gov).
Deutschsprachige B2B-Plattform zum automatischen Finden und nachvollziehbaren Prüfen öffentlicher Ausschreibungen mit Begründung je Treffer.

## Product & Pricing (Deutsch / English)

- **Quellen / Coverage:** 18 Live-Quellen — TED (alle 27 EU-Staaten), Datenservice Öffentlicher Einkauf (DE Ober- & Unterschwelle), service.bund.de, DTVP, RIB, Landes- und Regionalportale (Bayern, NRW, BW, Bremen, Sachsen, MV, Hessen, RLP, Rhein-Neckar), UK Find a Tender & Contracts Finder, US SAM.gov.
- **Matching & GAEB:** Erklärbares Profil-Matching über CPV-Codes, Leistungsbegriffe, Ausschlüsse, Leistungsort, Auftragswert und Frist (keine Blackbox-Prozentwerte). GAEB DA XML X83/X84 wird im Pilot lesend strukturiert.
- **Verticals:** Kuratiert für Fenster/Fassade/Glas/Metallbau, Architektur/Planung und Marketing/Digital; Bauleistungen insgesamt über CPV-Gruppen (Haupt-CPV 45).
- **Datenschutz / Hosting:** Betreiberin ist die Yawusa UG (haftungsbeschränkt) in Berlin; Hosting in Deutschland, KI-Verarbeitung in der EU (Mistral AI).
- **Preise / Pricing:** Begleitete Pilotphase aktuell kostenfrei (Zugang per Magic Link nach Abstimmung). Preisorientierung für den Regelbetrieb: Pro 149 EUR/Monat · Agent 499 EUR/Monat (höhere API-Limits, Agent API, A2A/MCP) · Verfahrensbegleitung 1.499 EUR einmalig. Details: /pricing.md.

## Authentication

Public preview search is anonymous. Higher limits and protected tools use HTTP Bearer authentication:
send \`Authorization: Bearer <key>\`. Keys start with sk_ and are documented in /auth.md.

## Capabilities

- Search tenders by keyword, CPV code, country, score, value and deadline.
- Inspect source freshness and indexed country coverage.
- Return explainable match reasons and the original notice URL.
- Query through REST, A2A JSON-RPC or MCP Streamable HTTP.

## Machine endpoints & guides

- OpenAPI: /openapi.json
- Public search: /api/tenders-public
- Source status: /api/source-status
- Countries: /api/countries
- MCP: /mcp
- A2A Agent Card: /.well-known/agent-card.json
- Developer docs: /entwickler
- API catalog: /.well-known/api-catalog
- LLM navigation index: /llms.txt · /llms-full.txt
- Guides & comparisons: /ausschreibungssuche-automatisieren · /bauauftraege-finden · /ki-angebot-ausschreibung · /beste-software-automatische-ausschreibungssuche · /zahlen

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
