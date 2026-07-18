# GOALS — ausschreibungsagenten.de

> Stand: 2026-07-18 · Basis: vollständiger Produkt-/Tech-/Markt-Review (Code, Live-API, Wettbewerb).
> Dieses Dokument ist als **Goal-Prompt** nutzbar: Abschnitt „Agent-Prompt" unten direkt an eine
> Claude-Code-Session geben, um die Ziele der Reihe nach abzuarbeiten.

## Strategische Leitlinie

**Nicht** das Abdeckungs-Rennen gegen Generalisten (Vergabepilot „300+ Portale", DTAD, Bidfix) fahren.
Gewinnstrategie:

1. **Vertikale Tiefe:** Bau / Fenster / Fassade mit GAEB X83/X84 als Hero-Story.
2. **Agent-native API als Erster im DACH-Markt:** MCP + A2A öffentlich auffindbar machen.
3. **Radikale Transparenz als Marke:** erklärbarer Fit-Score + öffentlicher Quellenstatus.

Schwestermarke: **tender-agents.com** = internationale/EU-Ausweitung (siehe `TENDER-AGENTS-PLAN.md`).
Arbeitsteilung: `.de` = deutsche Vertikal-Marke mit Vertrauen/GAEB, `.com` = agent-native EU-Datenplattform.

## Review-Scorecard (2026-07-18)

| Dimension | Note | Kernbefund |
|---|---|---|
| Tech & Ehrlichkeit | 8/10 | Sauber, getestet, Live-Daten, transparent |
| UI/UX | 7/10 | Modern & konsistent, aber konversionsschwach |
| Uniqueness | 6/10 | Erklärbarkeit + GAEB + Transparenz echt, aber unter-vermarktet |
| Kommerzielle Operationalität | 4/10 | Kein Checkout, kein Self-Serve, alles Magic-Link-gated |
| Moat | 3/10 | Öffentliche Daten, replizierbarer Scraper — Moat muss gebaut werden |
| Agent-Readiness | 3/10 | Im 499-€-Tarif versprochen (A2A/MCP), öffentlich nicht auffindbar |

## Ziele

### P0 — Quick Wins (Tage, teils in diesem Repo umsetzbar)

- [x] **Matching-Bug Backend** *(2026-07-18)*: `buyer_name` aus der Freitextsuche entfernt und
      Titel-Treffer vor reine Description-Treffer gerankt (`services/tenders.py`, Backend-Commit
      `985d265`, Container neu deployt, 161 Tests grün). Live verifiziert: „marketing" liefert
      keine Schreinerarbeiten mehr in den Top-Treffern.
      *Nebenbefund offen: „Leadagentur Thüringen" erscheint doppelt (Syndikations-Duplikat).*
- [x] **Canonical-Fix** *(2026-07-18)*: canonical, og:url, og:image, twitter:image und JSON-LD-URLs
      in `index.html` auf `https://www.ausschreibungsagenten.de/` umgestellt (konsistent mit Sitemap).
- [x] **`/llms.txt` + `/llms-full.txt`** *(2026-07-18)*: in `public/` — Produkt, Quellen, API-Vorschau,
      Preise, Ehrlichkeitshinweise für KI-Assistenten.
- [x] **A2A Agent Card** *(2026-07-18)*: Backend serviert die Card bereits öffentlich unter
      `api.ausschreibungsagenten.de/.well-known/agent-card.json` (inkl. A2A JSON-RPC, OpenAPI, Docs).
      Vercel-Rewrite ergänzt: Hauptdomain `/.well-known/agent-card.json` → API-Subdomain.
      llms.txt/llms-full.txt um Agent-Anbindung (A2A, OpenAPI, Docs) erweitert.
- [x] **Pricing als permanente Sektion** *(2026-07-18)*: neue Sektion `#preise` nach der
      Vergleichstabelle (Pro/Agent/Verfahren, ehrlicher Checkout-Hinweis), Nav-Link „Preise" im Header.
- [x] **Hero-CTA getauscht** *(2026-07-18)*: primär „Live-Suche testen" (`#suche`), sekundär Beratung;
      Konkurrenzlinks in der Vergleichstabelle auf `rel="nofollow noopener noreferrer"`.
- [x] **Hero-Stats gestärkt** *(2026-07-18)*: dynamisch „N+ Indexierte Ausschreibungen · Datenstand X"
      aus der source-status-API (Summe `stored`, jüngstes `last_success_at`), Fallback „5.000+".
- [ ] **„i.G." entfernen**, sobald die UG eingetragen ist (Landingpage, Impressum, AGB, Footer).

### P1 — Agent-Readiness (Wochen; Uniqueness-Hebel Nr. 1)

- [x] **Öffentlicher MCP-Server mit Free-Tier** *(2026-07-18)*: `api.ausschreibungsagenten.de/mcp`
      live (`MCP_ENABLED=true`) — `search_tenders` frei (60/h ohne Key), `fulltext_search` nur mit
      Pro/Agent-Key; tier-basiertes Rate-Limit; Agent Card listet MCP automatisch.
      Self-Serve-Signup aktiv (`PUBLIC_SIGNUP_ENABLED=true`): Free-Key-Formular auf `/entwickler`
      (Vercel-Proxy `api/signup.js`, 10/h Limit, Key per Mail via Resend).
      Bestandskunden eingerichtet: famefact 2× agent-Tier-Key (GEO-Tool + gw), Rossmanith 1× pro-Key.
      *Offen: MCP-Registry-/npm-Listing für Discovery.*
- [x] **OpenAPI-Spec öffentlich + `/entwickler`-Seite** *(2026-07-18)*: OpenAPI/Swagger waren auf
      `api.ausschreibungsagenten.de` bereits live; neue Seite `/entwickler` mit Endpunkt-Tabelle,
      Schnellstart (REST, Agent Card, A2A JSON-RPC) und Fair-Use/Agent-Tarif-Abgrenzung.
      In Header („API"), Footer, Sitemap und llms.txt verlinkt.
- [x] **Rate-Limiting** *(2026-07-18)*: `/public/tenders` und `/source-status` 600/h je IP
      (großzügig, weil die Landingpage über wenige Vercel-Egress-IPs proxied), `/api/a2a`
      tier-basiert (free: 60/h, per API-Key mehr). Backend-Commit `c6d15d8`, live verifiziert
      (`x-ratelimit-*`-Header).
- [x] **Suchtreffer-Dedup** *(2026-07-18)*: syndizierte/berichtigte Bekanntmachungen werden über
      kanonischen (Titel, Auftraggeber)-Schlüssel kollabiert; jüngste Notice gewinnt.
      Nebenbefund aus P0 damit erledigt („Leadagentur Thüringen" erschien doppelt).
- [ ] **JSON-LD ausbauen:** `Dataset` (Tender-Index), `Offer`/`PriceSpecification` (3 Tarife),
      `FAQPage` (FAQ-Sektion).
- [ ] **Claim:** „Die erste deutsche Ausschreibungsplattform, die Ihr KI-Agent direkt anbinden kann
      (MCP & A2A)." — derzeit von niemandem im DACH-Markt besetzt.

### P2 — Kommerzielle Operationalität

- [ ] **Self-Serve Pro-Checkout** freischalten (Stripe-Code liegt laut README fertig im Backend);
      Zwischenschritt: 14-Tage-Trial mit manueller Aktivierung binnen 24 h.
- [ ] **Social Proof:** 1–2 anonymisierte Pilot-Ergebnisse als Zahlen
      („Pilot Fassadenbau: 14 relevante Treffer in 30 Tagen, 2 Angebote abgegeben").
- [ ] **Öffentliche `/status`-Seite** aus der source-status-API — Transparenz als Marke,
      verlinkbar, Backlink-Magnet.

### P3 — SEO & vertikale Tiefe

- [ ] **Prerender/SSG** für Wissens- & FAQ-Content (aktuell SPA-only; SEO-Asset wird
      client-seitig gerendert). `vite-plugin-prerender` oder SSG-Migration.
- [ ] **Programmatic SEO:** Landingpages je Bundesland („Ausschreibungen Hessen") und je
      Gewerk/CPV („Fassadenbau-Ausschreibungen") aus dem Index generieren. Setzt SSG voraus.
- [ ] **Vertikal führen:** Fenster/Fassade/GAEB als Hero-Story statt drittes Kartenelement.
- [ ] **UI-Zielgruppen-Check:** helles Theme oder Toggle prüfen; Emoji-Icons durch echte Icons
      ersetzen (Zielgruppe Handwerk/Bau erwartet Seriosität).

### P4 — Moat aufbauen (laufend)

- [ ] **Feedback-Datenschatz:** Go/No-Go-Entscheidungen + Gewonnen/Verloren-Status der Kunden
      systematisch erfassen — proprietäres Trainingsmaterial, das kein Aggregator hat.
- [ ] **Workflow-Lock-in:** Status + Notizen + signierter Webhook + ERP-Export vertiefen.
- [ ] **Backend-Resilienz:** Single-VPS = SPOF; vor Self-Serve-Launch Backup-/Failover-Plan.

## Agent-Prompt

> Kopierfertig für eine Claude-Code-Session in diesem Repo:

```text
Lies GOALS.md. Arbeite die unerledigten P0-Ziele ab, die in DIESEM Repo umsetzbar sind
(Canonical-Fix, llms.txt, Pricing-Sektion, Hero-CTA, Hero-Stats, nofollow).
Backend-Ziele (Matching-Bug, MCP, Rate-Limiting) nur notieren, nicht hier versuchen.
Regeln: bestehende Design-Tokens und den ehrlichen Ton beibehalten; keine Features behaupten,
die nicht produktiv sind; nach jeder Änderung npm test && npm run build; Hake erledigte
Checkboxen in GOALS.md ab. Committe erst nach meiner Freigabe.
```

## Referenzen

- Wettbewerb: vergabepilot.ai, bidfix.ai, procuris.eu, patterno.de, blackswanai.de, dtad.de, Leto AI (ab 245 €/Mon.)
- Agent-Ökosystem: GovSpend MCP-Server (US, Juni 2026), Ansvar-Systems/public-procurement-mcp (Recht/CPV, kein Live-Tender-Daten-MCP für DE/EU)
- EU-Expansion: `TENDER-AGENTS-PLAN.md`
