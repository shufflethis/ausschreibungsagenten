# TENDER-AGENTS.COM — EU/International Expansion Plan

> Stand: 2026-07-18 · Schwesterprojekt zu ausschreibungsagenten.de (siehe `GOALS.md`).
> Domain vorhanden: tender-agents.com (HTTPS via Vercel einrichten, nie http verlinken).

## Markenstrategie: zwei Marken, ein Backend

| | ausschreibungsagenten.de | tender-agents.com |
|---|---|---|
| Markt | Deutschland (DACH) | EU / international |
| Sprache | Deutsch | Englisch zuerst, dann fr/es/it/pl/nl |
| Positionierung | Vertikale Tiefe (Bau/Fassade, GAEB), Vertrauen, Transparenz | **Agent-native EU tender data platform** — „The tender API for AI agents. MCP & A2A native." |
| Zielkunde | KMU/Handwerk/Agenturen, die Aufträge gewinnen wollen | Entwickler, Agent-Builder, Bid-Teams, internationale SaaS-Integrationen |
| Funnel | Pilot → Magic Link → Pro/Agent | API-Key Self-Serve → Free Tier → Usage-Pricing |

> **Fortschritt 2026-07-18:** Österreich ist live (`COUNTRIES=DEU,AUT`, 516 AT-Tender im ersten
> Poll, CPV-Klassifikation greift sprachneutral). Der Weg zu EU-weit ist damit validiert.

**Warum das funktioniert:** TED (api.ted.europa.eu) ist bereits die EU-weite Quelle und wird vom
AgentLeads-Backend schon gepollt — der DEU-Filter ist nur ein Query-Parameter. Der schnellste Weg zu
„EU-Abdeckung" ist also kein neuer Scraper, sondern das Öffnen des bestehenden TED-Index für alle
Mitgliedsstaaten + Länder-Facetten. Nationale Portale (BOAMP FR, PLACSP ES, TenderNed NL, …) kommen
danach — genau wie bei .de die Landesportale.

## Architektur-Entscheidung (empfohlen)

**EIN privates AgentLeads-Backend, ZWEI Frontends.**

```text
tender-agents.com (Vercel, neues Repo/Folder)   ausschreibungsagenten.de (bestehend)
        \                                              /
         -> ${AGENTLEADS_API_BASE}/api/public/tenders (country=* statt DEU)
                    -> AgentLeads-DB (TED EU-weit bereits vorhanden)
```

- Kein Daten-Fork, kein zweiter Scraper, kein doppelter Betrieb.
- Backend-Erweiterungen: `country`-Facette öffnen, `lang`-Feld, Markt-/Mandanten-Flag,
  Rate-Limiting + API-Keys (braucht P1 von GOALS.md sowieso).
- Frontend: neues Repo `tender-agents` als Klon dieses Repos, dann i18n + Rebranding.

## Phasen

### P0 — Klon & Fundament (Woche 1)
1. Repo klonen → neuer Folder auf diesem VPS, neues GitHub-Repo (privat), neues Vercel-Projekt.
2. Rebranding: Name, Logo-Wortmarke, Farbwelt kann bleiben (Design-Tokens sind sauber), alle
   Texte Englisch. Impressum/Legal: gleiche Betreiberin (Agentifizierung UG), aber englische
   Legal-Pages (Imprint, Privacy — GDPR bleibt Pflicht).
3. i18n-Gerüst von Anfang an (en als Default; Struktur so, dass de/fr/es später Locale-Routen sind).
4. `country`-Filter im Tender-Proxy parametrisieren (Default: alle EU statt DEU).
5. Deutsche Spezifika raus: GAEB-Sektion (DE-only Standard) → durch „Document analysis" ersetzen
   oder als „Germany only" kennzeichnen; Bundesland-FAQ → EU-Schwellenwerte/Verfahren nach
   EU-Richtlinie 2014/24/EU formulieren.

### P1 — Agent-native Kern (Woche 2–3) — das Alleinstellungsmerkmal
1. `/.well-known/agent-card.json`, `/llms.txt`, OpenAPI-Doku unter `/developers` — **vor** dem
   Marketing-Feinschliff, denn die Positionierung IST das Produkt.
2. Öffentlicher MCP-Server (`tender-agents` auf npm), Free Tier mit API-Key.
3. Landingpage-Story: „Plug EU tenders into your AI agent in 5 minutes" mit Code-Beispielen
   (MCP-Config, curl, Python) statt deutscher Pilot-Prosa.
4. Ein Backend-MCP/A2A-Stack bedient BEIDE Marken (nur Branding/Host unterscheidet sich).

### P2 — EU-Daten sichtbar machen (Woche 3–4)
1. Länder-Facette in der Live-Suche (Flaggen-Filter: DE, FR, ES, IT, NL, PL, AT, …).
2. Quellenstatus-Seite `/status` EU-weit (TED live; nationale Portale als „planned" — dieselbe
   ehrliche Transparenz wie auf .de, sie ist Markenkern).
3. Programmatic SEO: `/tenders/germany`, `/tenders/france`, … je Land aus dem Index (SSG!).

### P3 — Monetarisierung (Monat 2)
1. Stripe Self-Serve von Tag 1 der Öffnung (EUR, Multi-Currency später), Preise in USD/EUR:
   z. B. Free (API 10 req/day) → Pro €149 → Agent €499 (Parität zur .de, ein Preissystem).
2. Usage-basiertes API-Pricing für Agent-Traffic erwägen (per 1k Abfragen) — internationale
   Agent-Builder erwarten das.
3. Nationale Portale nach Nachfrage priorisieren (welche Länder fragen Kunden an?).

### P4 — Lokalisierung & Vertrieb (Monat 3+)
1. Locale-Routen fr/es/it/pl/nl mit lokalisierten SEO-Seiten.
2. Listings: MCP-Registries, RapidAPI-artige Marktplätze, GitHub-Awesome-Listen, Product Hunt.
3. Partnerschaften mit Bid-Management-Tools (die brauchen Discovery-Daten; ihr habt die API).

## Offene Entscheidungen (vor P0 klären)

- [ ] Neues GitHub-Repo unter `shufflethis/tender-agents` oder Org? (Empfehlung: gleiches Konto, privat)
- [ ] Backend: Markt-Flag/Mandant im AgentLeads-Backend oder nur Query-Parameter? (Empfehlung: erst Query-Parameter, Mandanten später)
- [ ] GAEB auf .com zeigen? (Empfehlung: ja, als „Germany: GAEB X83/X84 supported" — Differenzierung auch international)
- [ ] Preisparität .de/.com? (Empfehlung: ja, ein Preissystem, sonst Arbitrage/Verwirrung)

---

## Kickoff-Prompt für den neuen Folder

> Auf diesem VPS: `mkdir ~/tender-agents-site && cd ~/tender-agents-site`, dann `claude` starten
> und diesen Prompt geben (er ist selbst-erklärend für eine frische Session):

```text
Wir bauen tender-agents.com — die internationale/EU-Schwester von ausschreibungsagenten.de.

AUSGANGSLAGE
- Vorlage: /home/admin/ausschreibungsagenten-site (React 19 + Vite SPA, Vercel Functions,
  deployt via Vercel). Kopiere den Code von dort als Basis in diesen Folder (frisches git init,
  KEINE .git-Historie übernehmen, node_modules/dist nicht kopieren).
- Lies dort zuerst README.md, GOALS.md und TENDER-AGENTS-PLAN.md — der Plan in
  TENDER-AGENTS-PLAN.md ist die Roadmap für dieses Projekt, Phase P0 zuerst.
- Backend bleibt das private AgentLeads-Backend; Zugriff NUR über die Env-Variable
  AGENTLEADS_API_BASE in Vercel Functions (Proxy-Muster wie in api/tenders-public.js der
  Vorlage). Keine Backend-IPs, Tokens oder Secrets in Git.

ZIEL P0 (dieser Auftrag)
1. Klon lauffähig machen: npm install, npm test, npm run build müssen grün sein.
2. Rebranding auf "tender-agents.com": Paketname, Titles, Meta, Header/Footer, Manifest,
   Schema.org. Betreiberin bleibt Agentifizierung UG (haftungsbeschränkt), Schliemannstraße 23,
   10437 Berlin.
3. Komplette UI-Sprache Englisch (professionelles B2B-Englisch). Legal-Pages als englische
   Fassungen (Imprint, Privacy Policy GDPR-konform, Terms) — als Entwurf kennzeichnen,
   juristische Prüfung folgt.
4. Positionierung umschreiben: "EU public tenders for AI agents and bid teams. TED-wide
   coverage, explainable matching, MCP & A2A native." Zielgruppe: Agent-Builder, Entwickler,
   internationale Bid-Teams. Die deutsche Pilot-Prosa nicht übersetzen, sondern die Story neu
   auf API/Agent-first schreiben; Code-Beispiele (MCP-Config, curl) statt Branchen-Emojis.
5. Tender-Proxy: country-Parameter konfigurierbar machen (Default: alle EU-Länder statt DEU);
   Länder-Facette in der Live-Suche (mind. DE, FR, ES, IT, NL, PL, AT).
6. Deutsche Spezifika anpassen: GAEB als "Germany: GAEB X83/X84" kennzeichnen; FAQ auf
   EU-Schwellenwerte und EU-Richtlinie 2014/24/EU umschreiben; Bundesland-Bezüge raus.
7. /llms.txt und /.well-known/agent-card.json (statischer Erstentwurf) von Anfang an ausliefern.
8. Ehrlichkeitsprinzip der Vorlage übernehmen: nichts als live behaupten, was nicht live ist
   (nationale Portale außer den 8 bestehenden Quellen sind "planned").

REGELN
- Design-Tokens/CSS-System der Vorlage weiterverwenden (keine Neuerfindung), aber Emojis in
  Feature-Karten durch schlichte Inline-SVG-Icons ersetzen.
- Nach jedem Schritt npm test && npm run build.
- Neues privates GitHub-Repo und Vercel-Projekt erst nach meiner Freigabe anlegen; Domain
  tender-agents.com wird in Vercel verbunden (HTTPS, www vs. apex: eine kanonische Variante
  wählen und konsequent verwenden).
- Am Ende: Zusammenfassung was fertig ist + offene Entscheidungen aus TENDER-AGENTS-PLAN.md.
```

## Betriebshinweise

- Vercel: eigenes Projekt (nicht das bestehende `ausschreibungsagenten`), gleiche Env-Struktur
  (`AGENTLEADS_API_BASE` serverseitig, `VITE_APP_BASE_URL` später für app.tender-agents.com).
- DNS: apex → Vercel A/ALIAS, `www` CNAME; Canonical-Entscheidung dokumentieren (Lehre aus dem
  Canonical-Mismatch der .de, siehe GOALS.md P0).
- Der öffentliche Tender-Proxy braucht Rate-Limiting BEVOR die Agent-Doku live geht.
