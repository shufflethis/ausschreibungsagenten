# Ausschreibungsagenten.de

Marketing-Website und öffentliche Vorschau für den privaten AgentLeads-Tender-Index.

## Architektur

Dieses Repository enthält **nicht** den Tender-Scraper und nicht die AgentLeads-Datenbank. Es enthält:

- die React/Vite-Website für [ausschreibungsagenten.de](https://www.ausschreibungsagenten.de/),
- Vercel Functions für Kontakt- und Pilotprofil-Anfragen,
- den öffentlichen Tender-Proxy `api/tenders-public.js`.

Der Tender-Proxy liest `AGENTLEADS_API_BASE` aus den Vercel Environment Variables und leitet Anfragen an das private AgentLeads-Backend weiter:

```text
Browser
  -> ausschreibungsagenten.de (Vercel)
  -> /api/tenders-public
  -> ${AGENTLEADS_API_BASE}/api/public/tenders
  -> AgentLeads-Datenbank
```

`AGENTLEADS_API_BASE` und alle Tokens/Secrets dürfen nicht in Git eingecheckt werden.

Der Kundenlogin startet unter `/login`, navigiert dann aber per direktem Browser-POST auf die eindeutige App-Origin aus `VITE_APP_BASE_URL` (empfohlen `https://app.ausschreibungsagenten.de`). Bestätigung, Session, Konto und Abrechnung bleiben vollständig auf dieser Origin. Dadurch sind weder ein Vercel-Auth-Proxy noch Cross-Origin-Cookies notwendig; das Backend sieht den tatsächlichen Client am vertrauenswürdigen Reverse Proxy. `/konto` und `/abrechnung` leiten in den geschützten Appbereich weiter.

## Privates AgentLeads-Backend

Produktionsbetrieb:

| Bestandteil | Wert |
| --- | --- |
| Host | `159.195.43.209` |
| Projektpfad auf dem Host | `~/agentleads-account` |
| Docker-Container | `agentleads` |
| Portbindung | `127.0.0.1:8767 -> 8000/tcp` |
| Anwendung | FastAPI, SQLAlchemy, Jinja2/HTMX |

Die Bindung an `127.0.0.1` ist beabsichtigt: Port 8767 soll nicht direkt aus dem Internet erreichbar sein. Der öffentliche Zugriff erfolgt über den vorgeschalteten Reverse Proxy beziehungsweise die in `AGENTLEADS_API_BASE` konfigurierte HTTPS-Adresse.

Das Backend aggregiert öffentliche Vergabe-Bekanntmachungen für zwei aktive Verticals: Digital/Marketing/Web sowie Fenster/Fassade/Glas/Metallbau. Der Quellen-Relevance-Score klassifiziert den Index; ein davon getrennter Firmen-Fit berücksichtigt CPV, Begriffe, Ausschlüsse, Leistungsort, Auftragswert und Frist und erklärt seine Einzelkomponenten.

Quellenstatus:

- TED über `api.ted.europa.eu`: aktiv
- `service.bund.de` RSS: aktiv
- Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz: angebunden
- Landesportale Bayern und Nordrhein-Westfalen: vorbereitet/Stubs; Details und Blocker stehen in `BLOCKERS.md` des privaten Backend-Repositories

Das private Backend enthält außerdem Stripe-Code, Volltextsuche, einen A2A-JSON-RPC-Agent-Endpunkt und Agent-Discovery-Metadaten. Öffentliche Profilerstellung, Signup, Checkout, MCP und schreibende A2A-Profilaktionen sind im Produktionsbetrieb deaktiviert. Pilotzugänge werden intern vorbereitet und ausschließlich per Magic Link freigegeben.

Pilotumfang: geschütztes Profil-Dashboard, kontrollierter E-Mail-Digest-Test, nur lesende GAEB-DA-XML-Analyse für X83/X84 sowie Tender-Export als JSON, CSV, XLSX und optional signierter Webhook. Der automatische Digest wird erst nach erfolgreichem Pilottest freigeschaltet. Konkrete ERP-Connectoren, WhatsApp und Push sind nicht produktiv.

## Betrieb prüfen

Nach Anmeldung auf dem Backend-Host:

```bash
cd ~/agentleads
docker ps --filter name=agentleads
docker inspect --format '{{json .State.Health}}' agentleads | jq .
docker logs --tail 200 agentleads
git log --oneline -10
```

Für einen vollständigen Datenfluss zusätzlich prüfen:

1. letzten erfolgreichen TED- und Bund-Poll in den Container-Logs,
2. Anzahl und jüngstes Veröffentlichungsdatum in der AgentLeads-Datenbank,
3. `AGENTLEADS_API_BASE` im Vercel-Projekt,
4. öffentliche Vorschau über `/api/tenders-public`.

## Deployment

Die Website wird über das Vercel-Projekt `trackys-projects-6c71603f/ausschreibungsagenten` bereitgestellt. Änderungen am Scraper oder Poll-Zeitplan werden ausschließlich im privaten AgentLeads-Backend vorgenommen; Änderungen an der Darstellung oder am Proxy gehören in dieses Repository.

Erforderliche Vercel-Konfiguration:

- `VITE_APP_BASE_URL=https://app.ausschreibungsagenten.de` ist öffentlich und enthält kein Secret.
- `AGENTLEADS_API_BASE` bleibt eine serverseitige Variable für die vorhandenen Vercel Functions.
- DNS/TLS und Reverse Proxy der App-Origin werden im Backend-Runbook konfiguriert.

Lokale Abnahme:

```bash
npm test
npm run build
npm audit --audit-level=high
```

## CLI-Paket unter `cli/`

`cli/` ist ein eigenes npm-Paket (`ausschreibungsagenten`, MIT, publiziert vom
npm-Account `agentification`). Es liest ausschließlich die öffentlichen,
anonymen Endpunkte und hat keine Abhängigkeiten.

```bash
node cli/bin.js suche Fassade --limit 3   # lokal
npx ausschreibungsagenten laender          # aus dem Registry
cd cli && npm version patch && npm publish # neue Fassung
```

Die Tests liegen unter `cli/cli.test.js` und laufen im normalen `npm test` mit.
Der Einstiegspunkt ist `cli/bin.js` — `cli/index.js` ist ein reines Modul und
darf nie selbst entscheiden, ob es "als Programm" läuft: npm legt für `bin`
einen Symlink an, und jede Namensprüfung scheitert dort still.

Der MCP-Server ist zusätzlich bei Smithery gelistet:
`@agentifizierung/ausschreibungsagenten` (externer Release, zeigt auf
`https://api.ausschreibungsagenten.de/mcp` — Smithery hostet nichts).

## 404-Seite und Auffang-Rewrite

Der letzte Eintrag unter `rewrites` in der `vercel.json` fängt jede Adresse ab,
die weder eine Datei noch eine andere Function trifft, und leitet sie an
`api/not-found.js`. `/api/…` ist per Negativ-Lookahead ausgenommen: dort
antwortet `api/[...path].js` mit `application/problem+json`, und diese Function
würde der Auffang sonst überholen. Diese Function antwortet immer mit HTTP 404 und verhandelt
den Rumpf: Markdown mit Linkliste für Agenten (`Accept: text/markdown`,
`?mode=agent` oder bekannter Bot-User-Agent), sonst die gestaltete HTML-Seite.
Die Erkennung teilt sie sich mit der `middleware.js` über
`lib/agentenErkennung.js`.

Zwei Folgen davon:

- `public/404.html` gibt es nicht mehr. Die HTML-Fassung steht als Konstante in
  `api/not-found.js`; `scripts/prerender.mjs` schreibt daraus beim Build
  `dist/404.html`. Diese Datei greift, wenn der Auffang-Rewrite oder die
  Function einmal fehlt — nicht bei einem Laufzeitfehler der Function, der
  liefert 500.
- Jeder 404 ist jetzt ein Function-Aufruf statt einer statischen Datei. Bei
  diesem Traffic-Volumen unkritisch, bei einem Bot-Sturm auf geratene Adressen
  im Blick behalten.

Neue Routen brauchen weiterhin eine eigene Datei im `dist` — `check-prerender`
erzwingt das. Ohne sie liefert der Auffang-Rewrite jetzt 404 statt der
Startseite.

## Partnerprogramm und Tender-Suche — bevor du hier etwas änderst

Zwei Stellen dieser Website hängen an Entscheidungen, die im Backend-Repo dokumentiert sind
(`docs/HANDOVER-2026-08-20.md`, Merkregeln 3 und 10). Kurz:

- **`/partner`** nennt 20 % netto wiederkehrend, 60 Tage Zuordnung, 30 Tage Sperrfrist. Diese
  Zahlen stehen identisch in Numok und zusätzlich in der Meta-Beschreibung der Route in
  `src/routes.js`. Wer sie ändert, muss alle drei Stellen nachziehen — die Meta-Beschreibung
  lief schon einmal auseinander und versprach im Suchergebnis andere Konditionen als die Seite.
- **Die Tender-Suche auf der Landingpage ist entprellt** (350 ms, `src/pages/LandingPage.jsx`).
  Ohne das feuert sie je Tastendruck, und weil das Backend pro Aufruf bis zu fünf KI-Kurzfassungen
  erzeugt, bringt ein getipptes Wort 30–50 Modellaufrufe und läuft ins Ratelimit. `abort()`
  genügt nicht: es stoppt nur den Browser, nicht die Vercel Function und nicht das Backend.

Preise werden auf der Website als Orientierung angezeigt. Ein Checkout wird erst nach vollständiger Stripe-Live-Konfiguration und Webhook-Abnahme wieder freigeschaltet.
