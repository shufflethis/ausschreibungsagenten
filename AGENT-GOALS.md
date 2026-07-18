# AGENT-GOALS — Autonomes Arbeitsprogramm Richtung 100k MRR

> Stand: 2026-07-18 · Dieses Dokument ist der **Master-Prompt für autonome Sessions**.
> Es ist selbsttragend: eine frische Claude-Code-Session ohne Chat-Historie kann hiermit
> sofort produktiv arbeiten. Fortschritt wird HIER (Checkboxen) und in `PROGRESS.md`
> (Log, append-only) festgehalten.

## Mission

**100.000 € MRR** mit der Tender-Intelligence-Plattform (Marken: ausschreibungsagenten.de
DACH + tender-agents.com EU/international). Der Weg dahin läuft über **Fähigkeiten**:

1. **Alle relevanten EU-Ausschreibungen im Index** (nicht nur DE/AT)
2. **Sprachagnostisches Matching-Framework** — die Sprache einer Bekanntmachung ist egal
3. **Standards verstehen und erfüllen** — eForms, CPV/NUTS, ESPD, OCDS, GAEB/ÖNORM
4. Distribution über den Agent-Funnel (MCP/A2A/llms.txt) und SEO

MRR-Mathematik als Kompass: 50× Agent (499 €) + 300× Pro (149 €) + Rest über
Verfahrensbegleitung (1.499 €) und internationale Kunden ≈ 100k. Jede Fähigkeit muss auf
eines davon einzahlen, sonst ist sie Spielerei.

## Systemzustand (2026-07-18 — bei Abweichung: dieses Dokument aktualisieren!)

- **Site-Repo:** `/home/admin/ausschreibungsagenten-site` (React/Vite, Vercel, master → Auto-Deploy)
- **Backend-Repo:** `/home/admin/agentleads-account` (FastAPI, Branch `feat/account-platform-mvp`,
  Container `agentleads` via `docker compose build app && docker compose up -d app`,
  SQLite `/data/agentleads.db` im Container, Tests: `.venv/bin/python -m pytest -q`)
- **Live:** 8 Quellen (TED DE+AT, bund, 6 Landesportale), ~5.700 Tender (5.165 DE + 516 AT),
  MCP + A2A + Agent Card + OpenAPI öffentlich, Self-Serve Free-Keys, Tier-Rate-Limits,
  Vercel-Proxys auf `www.` (`api/*.js`)
- **Kunden/Keys:** famefact 2× agent-Tier, Rossmanith (Fassade-Pilot) 1× pro-Tier
- **Geparkt (NICHT autonom anfassen):** Stripe/Checkout-Freischaltung, Preisänderungen,
  E-Mail-Kampagnen, Kundenkommunikation

## Regeln für autonome Sessions

1. **Ehrlichkeitsprinzip:** Nichts als live/produktiv behaupten, was es nicht ist — im Code,
   in Texten, in llms.txt, überall. Das ist Markenkern.
2. **Verifikation vor Abhaken:** Jedes Ziel hat Abnahmekriterien. Erst grüne Tests + Live-Check
   (curl gegen Prod), dann Checkbox + `PROGRESS.md`-Eintrag (Datum, was, Beweis/Commit).
3. **Tests immer:** Backend `pytest` (aktuell 162), Site `npm test && npm run build` (aktuell 16).
   Neue Features bekommen neue Tests.
4. **Deploy-Disziplin:** Backend = Container-Rebuild + Health-Check + Smoke-Test. Site = push
   auf master + Live-Verifikation des neuen Bundles. Bei rotem Zustand: zurückrollen, loggen.
5. **Kleine Commits** mit aussagekräftigen Messages, Push nach jedem abgeschlossenen Ziel
   (Site: master; Backend: `feat/account-platform-mvp`).
6. **Menschliche Freigabe nötig für:** alles unter „Geparkt", DNS/Domain-Änderungen,
   Löschen von Kundendaten, neue externe Accounts/Registrierungen mit Identität,
   Ausgaben jeglicher Art. Solche Punkte in `PROGRESS.md` unter „NEEDS-HUMAN" sammeln.
7. **Secrets:** niemals in Git. Env-Änderungen in `.env` (Backend) dokumentieren in
   `PROGRESS.md` (Name, nicht Wert).
8. **Bei Widerspruch zwischen diesem Dokument und der Realität:** Realität prüfen,
   Dokument korrigieren, weiterarbeiten.

## Session-Protokoll (jede autonome Session)

1. Lies `AGENT-GOALS.md` (dies) + letzte 30 Zeilen `PROGRESS.md`.
2. Prüfe Systemgesundheit: Container healthy? Letzte Polls ok (`/api/source-status`)?
   Site live? — Störungen haben Vorrang vor neuen Zielen.
3. Wähle das **oberste unerledigte Ziel** des am wenigsten fortgeschrittenen aktiven Tracks
   (Reihenfolge unten). Ein Ziel pro Arbeitszyklus ganz fertig machen statt drei anfangen.
4. Implementieren → testen → deployen → live verifizieren → abhaken → loggen → committen.
5. Session-Ende: `PROGRESS.md`-Eintrag mit Stand, nächstem sinnvollen Schritt, offenen Fragen.

---

## Track A — EU-Datenbasis: alle Ausschreibungen der EU

*These: TED ist die eine Quelle für alle 27 EU-Länder oberhalb der Schwellen. Der Rollout ist
seit AT (Env-Variable, CPV trägt sprachneutral) validiert. Risiko ist nur Volumen/Last.*

- [x] **A1 — Messbasis** *(2026-07-18)*: Deckel-Analyse ergab EU27 = 19.029 ACTIVE-Notices
      > 15.000er-TED-Pagination-Deckel → Gruppen-Split zwingend. Kennzahlen in PROGRESS.md.
      Nebenbei behoben (Vorrang Störung): SQLite-Lock-Inzident — Batch-Commits,
      Poll-Serialisierung (`_POLL_LOCK`), Scheduler `misfire_grace_time=3600` (`b9fbdf5`).
- [x] **A2/A3 — EU27 komplett** *(2026-07-18)*: `COUNTRIES` auf alle 27 EU-Länder (Rollout kam
      parallel aus dem tender-agents-Fenster); TED pollt je 3er-Ländergruppe unter dem Deckel
      mit Warnung ab 14k/Gruppe (`4c31f1d`). Verifiziert: 12.229 Tender aus 27 Ländern,
      10/10 Quellen fehlerfrei, FR-Treffer live auf beiden Domains.
      *Rest offen → A4-Beobachtung: größte Gruppe FRA+DEU+GRC=11.837 wächst Richtung Deckel.*
- [x] **A4 — Postgres-Migration** *(2026-07-19, alle 6 Pflicht-Schritte)*: Backup+Restore-Test ✓,
      dialekt-portabler Code (Upserts, FTS5↔tsvector+unaccent) ✓, postgres:16 Compose-Service ✓,
      Datenmigration verifiziert (20 Tabellen, 12.231 Tender, Counts+Stichproben identisch) ✓,
      Cutover via DATABASE_URL ✓, Smoke-Tests grün (Polls/API/MCP-FTS/Prod, 0 Fehler) ✓.
      SQLite bleibt als Fallback. Befund unterwegs: performance_location → Text (`f2a6c8d9`).
      Backend `0a33531`+`abdd165`. *Follow-up: DB-URL (inkl. Passwort) erscheint im
      db.ready-Log — maskieren.*
- [ ] **A7 — GB-Connector `fts`** *(FREIGEGEBEN von Gorden 2026-07-19, inkl. Markenentscheid
      „EU + UK")*: Connector nach Mapping in `docs/SOURCES-INTL.md` (OCDS, CPV nativ).
      GBP→EUR deterministisch über konfigurierbaren Kurs (`GBP_EUR_RATE` Env, dokumentiert)
      — keine Live-Kurs-Abhängigkeit im Poll-Pfad. `languages=["eng"]`. Quelle in
      source-status registrieren; nach Launch Doku-Sync (llms, Agent Card, /status,
      /entwickler, tender-agents-Hinweis „EU + UK").
- [x] **A5 — Nicht-TED-Quellen gescoped** *(2026-07-18)*: `docs/SOURCES-INTL.md` im Backend
      mit Live-Probes. Kernbefund: **GB Find a Tender ist offen (kein Key) und nutzt weiter
      CPV** → Connector-Aufwand M ohne Mapping-Projekt; OCDS→Tender-Mapping als C4-Entwurf
      enthalten. Doffin: kostenloser Key nötig (NEEDS-HUMAN). simap: Zugang unklar (L).
      ÖNORM A 2063 (C5): Normkauf-Entscheid nötig.
- [x] **A6 — Länder-Facette ausgespielt** *(2026-07-18)*: `/api/countries` liefert die Liste
      dynamisch (kein Doku-Drift möglich); in /entwickler (Endpunkt-Tabelle + country-Hinweis),
      llms-full.txt und /status ausgespielt. Agent Card + Skill-Beschreibung auf „all 27 EU
      countries" präzisiert (Backend `6948a2b`).

## Track B — Sprachagnostisches Matching-Framework

*These: CPV/NUTS sind die sprachneutrale Wirbelsäule (funktioniert bereits, AT-Beweis).
Sprache betrifft nur: Keywords, Volltextsuche, Anzeige. Kein ML-Hype: erst deterministisch
mehrsprachig, semantik später als klar gekennzeichnetes Experiment.*

- [x] **B1 — Sprachfeld** *(2026-07-18)*: `Tender.languages` (JSON, ISO-639-3) aus den
      Sprachschlüsseln der mehrsprachigen TED-Felder; deutsche Portale → `deu`.
      Alembic-Migration `c4e8f2a91b07` mit raw_data-Backfill: 12.229 Rows, 0 leer
      (deu 5.775, fra 2.890, pol 684 …). In TenderOut/PublicTenderOut ausgegeben,
      live verifiziert (FRA→fra, DEU→deu). Backend `8e7ae87`.
- [x] **B2 — Mehrsprachige Vertical-Keywords** *(2026-07-18)*: `keywords_i18n` je Vertical
      (deu/eng/fra/spa/ita/nld/pol, eng-Fallback), `relevance_score` wählt per Notice-Sprache.
      Wirkung nach Rescoring: FRA ≥80 von 13→117, NLD 6→31, ESP 0→30; DEU stabil (990).
      FR/DE-Paritäts-Test + 4 weitere. Backend `0477049`. Live verifiziert
      (FR-Fassaden-Tender Score 100).
      *Beobachtung: Rest-Gap DEU Ø53 vs FRA Ø34 teils strukturell (bund/landes sind
      keyword-klassifiziert); weitere Sprachen nach Bedarf kuratieren.*
- [x] **B3 — Firmen-Fit sprachneutral** *(2026-07-18)*: Begriffe/Ausschlüsse nur auf Notices
      der Profilsprache(n) (`PROFILE_LANGUAGES`, aktuell deu; Profil-Feld folgt mit ersten
      internationalen Kunden). Fremdsprachige Notices: expliziter Reason statt stiller
      Fehlwertung; CPV-Ausschlüsse bleiben sprachneutral. Mehrsprachige Notices mit deu
      voll bewertbar (Titel wird deu-bevorzugt gewählt). Live mit echtem Rossmanith-Profil
      verifiziert: 8 Matches (85–90), 0 False-Positives. 4 Tests. Backend s. git log.
      *NEEDS-HUMAN: Rossmanith `target_countries` um AUT erweitern? (Kundenkonfiguration —
      Gordens Aussage von heute spricht dafür, Profil-Regionen BW/RLP/HE eher dagegen.)*
- [x] **B4 — FTS mehrsprachig geprüft** *(2026-07-18)*: 100 % Index-Abdeckung; Diakritika-
      Faltung verifiziert (façade=facade, ślusarka=slusarka) → Original-Titel jeder Sprache
      auffindbar (Abnahme erfüllt). Grenzen dokumentiert (`docs/FTS-I18N.md`, Backend
      `3881d28`): deutsche Komposita brauchen Prefix-Syntax (`fassade*` → 1.195 statt 603);
      Ausbaustufe Query-Expansion über B2-Sets notiert.
- [x] **B5 — Digest-Übersetzung** *(2026-07-19, gebaut & deployt, Flag AUS)*: `translation_de`
      am Tender (Migration `a1d5f7c3`), claude-haiku-4-5 via anthropic-SDK mit strukturierter
      Ausgabe, Caching je Tender, best-effort (Digest nie blockiert), Label
      „KI-Übersetzung — Original maßgeblich" im Digest, 7 gemockte Tests (196 gesamt).
      **NEEDS-HUMAN: `ANTHROPIC_API_KEY` in Backend-.env setzen + `TRANSLATION_ENABLED=true`
      → Feature geht ohne Codeänderung live.** Backend-Commit s. git log.

## Track C — Standards verstehen & erfüllen

*These: Wer die Vergabestandards maschinenlesbar beherrscht, baut den Moat, den Aggregatoren
nicht haben. Reihenfolge: erst verstehen (lesen/extrahieren), dann erfüllen (Bieter helfen).*

- [x] **C1 — eForms-Tiefe** *(2026-07-18)*: TED-Feldkatalog inventarisiert (1.830 Felder,
      empirisch via API). Fünf Go/No-Go-Felder extrahiert: `lot_count`, `award_criteria`
      (type/weight/name), `framework_agreement`, `gpa_covered`, `selection_criteria`
      (Eignungsanforderungen Klartext — nur authentifizierte API, Freemium-Grenze).
      Migration `d7b3e5f80a21`; nach erstem Scan: 11.960/7.174/2.583 befüllt.
      Backend `6fc03e7`; Verfahrensart war bereits vorhanden. → Direktes Futter für C6.
- [x] **C2 — Fristen-Vollständigkeit** *(2026-07-18)*: Messung ergab 68 % der TED-Tender ohne
      `deadline_at` (zweistufige Verfahren nennen nur die Teilnahmefrist). Fallback-Kette über
      die eForms-Fristenfelder (Angebots- → Teilnahme- → Interessensfrist, früheste je Los).
      Nach Rescan: **2 % ohne Frist** (209/12.132). Backend `fa13f28`, 4 Tests.
- [x] **C3 — ESPD verstehen** *(2026-07-18)*: Korpus-Analyse (7.179 Texte) → 4 häufigste
      Typen extrahiert (references/turnover/insurance/certificate) mit Beleg-Snippets,
      `Tender.requirements` (JSON) mit Migration-Backfill: 5.255 strukturiert. Scoping-Doc
      `docs/ESPD-SCOPING.md` im Backend (inkl. Nicht-Ziele: Schwellenwert-Parsing, ESPD-XML).
      Backend-Commit s. git log (`feat: structured eligibility requirements`). → C6-ready.
- [x] **C4 — OCDS-Kompetenz** *(2026-07-18)*: OCDS→Tender-Mapping entworfen (A5-Doc) und
      **empirisch über 100 echte FTS-Releases validiert**: CPV/Titel/Frist/Buyer 100 %,
      NUTS/Lose 99 %, Wert 70 % (einheitlich GBP). Bau-fertig; offene Punkte nur
      GBP→EUR-Kursquelle + Markenentscheid. `docs/SOURCES-INTL.md` im Backend.
- [ ] **C5 — GAEB/ÖNORM:** GAEB X83/X84 läuft (DE). ÖNORM A 2063 (AT-Pendant) scopen:
      Format, Beispieldateien, Aufwand. *Abnahme: Scoping-Abschnitt in `docs/SOURCES-INTL.md`.*
- [ ] **C6 — „Standards erfüllen"-Produktstory:** Aus C1–C3 eine Go/No-Go-Karte v2 bauen:
      Anforderungen des Verfahrens vs. Firmenprofil, mit Lückenliste („fehlender Nachweis: X").
      *Das ist der Kern des 1.499-€-Verfahrens-Produkts — skaliert es, skaliert der Umsatz.*

## Track D — Distribution & Funnel (autonom erlaubte Teile)

- [x] **D1 — MCP-Discovery** *(2026-07-18)*: `docs/DISTRIBUTION.md` mit Registry-Landschaft
      (offizielles Registry, awesome-mcp-servers, mcpservers.org, mcp.so, Smithery, Glama,
      PulseMCP), fertigen PR-/Submission-Texten und Metadaten-Block. Vorarbeit erledigt:
      `server.json` registry-konform (Reverse-DNS `de.ausschreibungsagenten/tenders`) und
      öffentlich via nginx. Submissions selbst = NEEDS-HUMAN (DNS-TXT + mcp-publisher, PR).
- [ ] **D2 — SEO-Länderseiten (nach A2):** Statische Landingpages je indexiertem Land/Region
      aus dem Index generieren (setzt Prerender/SSG voraus — zuerst SSG-Ziel aus GOALS.md P3).
- [x] **D3 — /status-Seite** *(2026-07-18)*: live unter /status — Quellen mit letztem
      erfolgreichem Abruf + 27-Länder-Abdeckung mit echten Zahlen (neuer Backend-Endpunkt
      `/api/public/countries` `9e1e86f`, Site `2a235e7`). In Footer/Sitemap/llms.txt verlinkt.
- [x] **D4 — llms.txt/Agent Card aktuell** *(2026-07-18, laufende Pflicht)*: Sync-Pass —
      requirements + /api/countries + Fristen-Abdeckung in llms-full.txt, Agent Card EU27.
      Bleibt Session-Protokoll-Pflicht nach jedem Meilenstein.

---

## Kickoff-Prompt für autonome Sessions (kopierfertig)

```text
Lies /home/admin/ausschreibungsagenten-site/AGENT-GOALS.md vollständig und die letzten
30 Zeilen von PROGRESS.md (falls vorhanden; sonst anlegen). Folge dem Session-Protokoll:
Gesundheitscheck, dann das oberste unerledigte Ziel des am wenigsten fortgeschrittenen
Tracks (A vor B vor C vor D) komplett umsetzen — implementieren, testen, deployen, live
verifizieren, abhaken, in PROGRESS.md loggen, committen und pushen.
Halte dich strikt an die Regeln (Ehrlichkeit, Verifikation, Geparktes nicht anfassen,
NEEDS-HUMAN sammeln statt raten). Arbeite so lange weiter, wie Ziele sauber abschließbar
sind; brich ein Ziel lieber kontrolliert ab und logge den Stand, statt Halbfertiges zu
deployen.
```

*Betriebsarten: einmalig (Prompt in neue Session pasten), wiederkehrend (`/ralph-loop` im
Site-Repo mit diesem Prompt) oder geplant (Cloud-Routine). Für unbeaufsichtigte Läufe gilt
Regel 6 besonders streng.*
