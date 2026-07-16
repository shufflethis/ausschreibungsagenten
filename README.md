# Ausschreibungsagenten.de

Marketing-Website und öffentliche Vorschau für den privaten AgentLeads-Tender-Index.

## Architektur

Dieses Repository enthält **nicht** den Tender-Scraper und nicht die AgentLeads-Datenbank. Es enthält:

- die React/Vite-Website für [ausschreibungsagenten.de](https://www.ausschreibungsagenten.de/),
- Vercel Functions für Kontakt-, Newsletter-, Profil- und Checkout-Anfragen,
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
| Host | `152.53.160.189` |
| Projektpfad auf dem Host | `~/agentleads` |
| Docker-Container | `agentleads` |
| Portbindung | `127.0.0.1:8767 -> 8000/tcp` |
| Anwendung | FastAPI, SQLAlchemy, Jinja2/HTMX |

Die Bindung an `127.0.0.1` ist beabsichtigt: Port 8767 soll nicht direkt aus dem Internet erreichbar sein. Der öffentliche Zugriff erfolgt über den vorgeschalteten Reverse Proxy beziehungsweise die in `AGENTLEADS_API_BASE` konfigurierte HTTPS-Adresse.

Das Backend aggregiert öffentliche Vergabe-Bekanntmachungen für zwei aktive Verticals: Digital/Marketing/Web sowie Fenster/Fassade/Glas/Metallbau. Der Quellen-Relevance-Score klassifiziert den Index; ein davon getrennter Firmen-Fit berücksichtigt CPV, Begriffe, Ausschlüsse, Leistungsort, Auftragswert und Frist und erklärt seine Einzelkomponenten.

Quellenstatus:

- TED über `api.ted.europa.eu`: aktiv
- `service.bund.de` RSS: aktiv
- Landesportale Bayern, Nordrhein-Westfalen und Baden-Württemberg: derzeit nur vorbereitet/Stubs; Details und Blocker stehen in `BLOCKERS.md` des privaten Backend-Repositories

Das private Backend enthält außerdem Stripe-Checkout, öffentliche Tender-Matches, Volltextsuche, einen A2A-JSON-RPC-Agent-Endpunkt und Agent-Discovery-Metadaten. Diese Funktionen sind nicht Teil dieses Website-Repositories.

Pilotumfang: geschütztes Profil-Dashboard, täglicher/wöchentlicher E-Mail-Digest, nur lesende GAEB-DA-XML-Analyse für X83/X84 sowie Tender-Export als JSON, CSV, XLSX und optional signierter Webhook. Konkrete ERP-Connectoren, WhatsApp und Push sind nicht produktiv.

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

Die Checkout-Success-Seite bestätigt bewusst keine Aktivierung. Nur der Stripe-Webhook des Backends ist dafür autoritativ.
