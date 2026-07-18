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

- [ ] **Matching-Bug Backend:** Suche „marketing" liefert „Schreinerarbeiten" (Treffer über
      `buyer_name` „Ahrtal Marketing GmbH"). Volltextsuche auf Titel/CPV/Beschreibung beschränken
      oder Felder gewichten. Sichtbar auf der Startseite → höchste Priorität. *(privates Backend-Repo)*
- [ ] **Canonical-Fix:** `index.html` canonical zeigt auf Apex, Apex 308-redirected aber auf `www.`
      → Canonical (und og:url) auf `https://www.ausschreibungsagenten.de/` umstellen.
- [ ] **`/llms.txt` + `/llms-full.txt`:** Produkt, API-Fähigkeiten, Quellenliste, Preise — damit
      LLMs/Answer-Engines korrekt zitieren. Statisch in `public/`.
- [ ] **A2A Agent Card:** `/.well-known/agent-card.json` live schalten (Discovery-Metadaten existieren
      laut README bereits im Backend; ggf. via Vercel-Function proxien oder statisch spiegeln).
- [ ] **Pricing als permanente Sektion** auf der Landingpage — aktuell erscheint die Pricing-Strip
      erst nach Profil-Submit (`profileResult`-Conditional in `LandingPage.jsx`).
- [ ] **Hero-CTA tauschen:** Primär „Live-Suche testen" (Anker `#suche`), sekundär „Beratung anfragen".
      Vergleichstabelle unter den Fold; Konkurrenzlinks auf `rel="nofollow noopener"`.
- [ ] **Hero-Stats stärken:** „5.000+ indexierte Ausschreibungen · Datenstand heute" aus der
      source-status-API statt „2 Pilot-Verticals".
- [ ] **„i.G." entfernen**, sobald die UG eingetragen ist (Landingpage, Impressum, AGB, Footer).

### P1 — Agent-Readiness (Wochen; Uniqueness-Hebel Nr. 1)

- [ ] **Öffentlicher MCP-Server mit Free-Tier** (z. B. 10 Abfragen/Tag, API-Key für mehr):
      Tools `search_tenders`, `get_tender`, `get_source_status`, `explain_fit`.
      Auf npm/PyPI + MCP-Registries listen. Free-Tier = Self-Serve-Funnel in den Agent-Tarif.
- [ ] **OpenAPI-Spec öffentlich** (`/api/openapi.json`) + Doku-Seite `/entwickler`
      (zugleich SEO-Seite „Ausschreibungen API Deutschland").
- [ ] **Rate-Limiting auf `/api/tenders-public`** bevor Agent-Traffic eingeladen wird.
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
