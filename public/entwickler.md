# Ausschreibungsagenten developer resources

## When to use

Use these resources to integrate current public tender search, source freshness, country coverage, explainable matching, A2A or MCP.

- OpenAPI: https://www.ausschreibungsagenten.de/openapi.json
- Anonymous preview: https://www.ausschreibungsagenten.de/api/tenders-public
- MCP Streamable HTTP: https://www.ausschreibungsagenten.de/mcp
- A2A card: https://www.ausschreibungsagenten.de/.well-known/agent-card.json
- API catalog: https://www.ausschreibungsagenten.de/.well-known/api-catalog
- Authentication: https://www.ausschreibungsagenten.de/auth.md
- Pricing: https://www.ausschreibungsagenten.de/pricing.md

The linked original procurement notice always prevails over a platform summary.

## CLI

```bash
npx ausschreibungsagenten suche Fassade --land DEU --limit 5
npx ausschreibungsagenten quellen
npx ausschreibungsagenten laender --json
```

Read-only, ohne Abhängigkeiten, `--json` liefert die Rohantwort der API.
Exit-Codes: 0 erfolgreich, 1 die API hat abgelehnt, 2 falscher Aufruf.
Paket: https://www.npmjs.com/package/ausschreibungsagenten

## Versionierung

Die kanonische REST-Fläche ist `https://api.ausschreibungsagenten.de/api/v1/…`
und die einzige, die in der OpenAPI-Beschreibung steht. Die unversionierten
`/api/…`-Adressen bleiben ein dauerhafter Alias derselben Operationen; sie sind
nicht abgekündigt. Protokolladressen (`/mcp`, `/api/a2a`,
`/.well-known/agent-card.json`) tragen keine eigene Version.

Vollständig: https://www.ausschreibungsagenten.de/api-policy.md

## OAuth 2.0

```bash
curl -s -X POST https://api.ausschreibungsagenten.de/oauth/token \
  -d grant_type=client_credentials -d client_id=<key id> -d client_secret=sk_...
```

`client_id` ist die Kennung des Schlüssels aus `GET /api/v1/me/keys`,
`client_secret` der Schlüssel selbst. Das Token gilt eine Stunde und nennt
seinen Umfang. Scopes: `tenders:read`, `profiles:read`, `fulltext:read` (ab
Pro), `webhooks:write` (ab Pro). Wird der Schlüssel widerrufen, tragen seine
Tokens sofort nicht mehr.

Metadaten: `/.well-known/oauth-protected-resource` (RFC 9728) und
`/.well-known/oauth-authorization-server` (RFC 8414).

## Zwei MCP-Flächen

`https://api.ausschreibungsagenten.de/mcp` — alle 17 Quellen.

`https://api.ausschreibungsagenten.de/mcp/open-data` — dieselben Werkzeuge,
aber nur die fünf Quellen mit einer vom Betreiber dafür bereitgestellten
Schnittstelle: TED, service.bund.de, Datenservice Öffentlicher Einkauf, GB Find
a Tender, GB Contracts Finder. Gedacht für Umgebungen, die sich fremden
Nutzungsbedingungen stellen müssen. Der Quellenstatus meldet dort nur diese
fünf — die Fläche behauptet keine Abdeckung, die sie nicht hat.
