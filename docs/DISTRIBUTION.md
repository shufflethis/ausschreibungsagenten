# DISTRIBUTION — MCP-Registry- & Listing-Playbook (D1)

> Stand: 2026-07-18. Vorbereitete Einträge für alle relevanten MCP-Verzeichnisse.
> Submissions, die Accounts/Identität brauchen, sind NEEDS-HUMAN (Gorden) — die Texte
> hier sind copy-paste-fertig. Voraussetzungen sind erledigt:
> `https://api.ausschreibungsagenten.de/server.json` ist live und am offiziellen
> Registry-Schema orientiert (Reverse-DNS-Name `de.ausschreibungsagenten/tenders`).

## Wiederverwendbarer Metadaten-Block (für alle Formulare)

- **Name:** Ausschreibungsagenten — EU Public Tenders
- **Reverse-DNS:** `de.ausschreibungsagenten/tenders`
- **Endpoint (streamable-http):** `https://api.ausschreibungsagenten.de/mcp`
- **server.json:** `https://api.ausschreibungsagenten.de/server.json`
- **Agent Card (A2A):** `https://www.ausschreibungsagenten.de/.well-known/agent-card.json`
- **Docs:** `https://www.ausschreibungsagenten.de/entwickler` · OpenAPI: `https://api.ausschreibungsagenten.de/openapi.json`
- **Auth:** ohne Key nutzbar (60 req/h); Free-Key per Self-Serve; Volltext ab Pro/Agent-Key (Bearer)
- **Tools:** `agentleads.search_tenders` (frei), `agentleads.fulltext_search` (Pro/Agent)
- **Kurzbeschreibung (EN):** EU public tender search for AI agents: live data from all 27 EU
  countries via TED plus German federal and state portals. Explainable relevance scoring,
  lots/award-criteria/framework fields, links to the free original notice. Free tier, no signup needed.
- **Beispiel-Config (Claude/Cursor etc.):**
  ```json
  { "mcpServers": { "tenders": { "url": "https://api.ausschreibungsagenten.de/mcp" } } }
  ```

## Verzeichnisse & Status

| Verzeichnis | Weg | Account nötig? | Status |
|---|---|---|---|
| [Offizielles MCP Registry](https://registry.modelcontextprotocol.io) | `mcp-publisher`-CLI, Namespace per **Domain-Verifikation** (DNS-TXT) für `de.ausschreibungsagenten` | Ja (Domain-Nachweis) | **NEEDS-HUMAN**: DNS-TXT setzen, `mcp-publisher publish` |
| [punkpeye/awesome-mcp-servers](https://github.com/punkpeye/awesome-mcp-servers) | PR gegen main (PR-Text unten) | GitHub-Account (shufflethis existiert) | **NEEDS-HUMAN**: PR abschicken |
| [mcpservers.org/submit](https://mcpservers.org/submit) | Formular, erzeugt GitHub-Issue upstream | Nein/gering | **NEEDS-HUMAN** (5 Min, Formular) |
| [mcp.so](https://mcp.so/) | Submission-Formular | Ja | NEEDS-HUMAN |
| [Smithery](https://smithery.ai) | Account + Listing | Ja | NEEDS-HUMAN, niedrigere Prio (Fokus lokale Server) |
| [Glama](https://glama.ai/mcp) | crawlt GitHub + Submission | Ja | NEEDS-HUMAN |
| PulseMCP | crawlt das offizielle Registry | — | folgt automatisch aus Registry-Eintrag |

**Empfohlene Reihenfolge:** 1) Offizielles Registry (PulseMCP & Co. crawlen es) →
2) awesome-mcp-servers-PR → 3) mcpservers.org-Formular. Rest nach Bedarf.

## Fertiger PR-Text für awesome-mcp-servers

Kategorie: „Finance" passt nicht — „Search" oder „Government/Legal" (je nach Listenstruktur,
alphabetisch einsortieren). Zeile:

```markdown
- [Ausschreibungsagenten](https://api.ausschreibungsagenten.de/server.json) 🌐 ☁️ — EU public
  tender (procurement) search across all 27 EU countries via TED plus German portals.
  Explainable relevance scores, lots & award criteria, free tier without signup.
```

PR-Beschreibung:

```text
Add Ausschreibungsagenten — remote MCP server (streamable-http) for EU public tender search.

- Endpoint: https://api.ausschreibungsagenten.de/mcp (no signup required, rate-limited free tier)
- server.json: https://api.ausschreibungsagenten.de/server.json
- Tools: search_tenders (free), fulltext_search (API key)
- Data: TED (all 27 EU countries) + German federal/state portals, links to the free original notices
- Docs: https://www.ausschreibungsagenten.de/entwickler
```

## Offizielles Registry — Ablauf für Gorden (NEEDS-HUMAN)

1. DNS-TXT-Record für die Domain-Verifikation von `ausschreibungsagenten.de` setzen
   (genauen Record zeigt `mcp-publisher login dns` an).
2. `mcp-publisher publish` mit der live `server.json` (liegt schon im richtigen Format vor).
3. Eintrag erscheint im Registry; PulseMCP & Co. übernehmen automatisch.

## Nach jedem Listing

- llms.txt beider Domains um „Listed in: …" ergänzen (Vertrauenssignal für LLM-Zitate).
- tender-agents.com: sobald `api.tender-agents.com`-Alias entschieden ist (offener
  NEEDS-HUMAN aus PROGRESS.md), zweites Listing unter `com.tender-agents/*` erwägen —
  vorher klären, ob Doppel-Listing derselben Infrastruktur in den Registries erwünscht ist.
