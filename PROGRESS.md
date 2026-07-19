# PROGRESS — Log der autonomen Arbeit (append-only, neueste unten)

## 2026-07-18 · Session 0 (interaktiv) — Fundament gelegt

**Erledigt heute (interaktiv, mit Gorden):**
- P0 komplett: Canonical www, llms.txt/llms-full.txt, Preise-Sektion, Hero-CTA/Stats,
  nofollow, Agent Card auf Hauptdomain (Site-Commits bis `f82e2db`)
- Backend: Such-Bug (buyer_name) gefixt, Titel-Ranking, Suchtreffer-Dedup
  (kanonischer Titel+Buyer-Key), Rate-Limits (public 600/h, a2a/mcp tier-basiert,
  signup 10/h), MCP live + FTS-Gate, Self-Serve-Signup live, Key-Mail-Branding
  (Backend-Commits bis `21fec1b` auf `feat/account-platform-mvp`)
- Keys gemintet: famefact 2× agent, Rossmanith 1× pro (Werte nur im Terminal angezeigt)
- Track A gestartet: **AT live** — COUNTRIES=DEU,AUT, erster Poll 516 AT-Tender,
  CPV-Klassifikation greift sprachneutral (Beweis für EU-Rollout)
- /entwickler-Seite live mit Free-Key-Formular

**Kennzahlen-Snapshot (Basis für A1):**
- Index: 5.165 DEU + 516 AUT ≈ 5.681 Tender
- TED-Poll (DE+AT, Full-Scan ACTIVE): fetched ~6.000–6.500, Quelle „gesund"
- Tests: Backend 162, Site 16 — alle grün

**NEEDS-HUMAN (offen):**
- Stripe/Checkout-Abnahme (geparkt auf Wunsch Gorden, 2026-07-18)
- MCP-Registry-Listings, die Accounts brauchen (D1)
- famefact/Rossmanith-Keys sicher verteilen (nur Gorden hat sie im Terminal gesehen)

**Nächster sinnvoller Schritt:** A1 (Messbasis + TED-Pagination-Deckel-Analyse), dann A2 Welle 1.

## 2026-07-18 · Cross-Repo-Sync-Notiz (tender-agents.com)

tender-agents.com ist LIVE (anderes Fenster, Repo `~/tender-agents-site`, Commits bis `57292ea`):
englischer Rebrand, EU-Länder-Facetten (DE/FR/ES/IT/NL/PL/AT), eigene llms.txt/agent-card.

**Sync-Punkte für kommende Sessions:**
1. FR/ES/IT/NL/PL-Facetten liefern leer, bis Track A Welle 1/2 die Länder indexiert →
   Track A ist dadurch noch dringlicher; nach jedem Länder-Rollout auch die
   tender-agents-Doku (llms.txt „rollout in progress"-Liste) aktualisieren.
2. tender-agents llms.txt nennt API-Keys/MCP/A2A „planned" — sie sind seit 2026-07-18 LIVE
   (api.ausschreibungsagenten.de). NEEDS-HUMAN: api.tender-agents.com als nginx-Alias auf
   dasselbe Backend (Zertifikat/DNS) ODER .com verlinkt die bestehende API-Domain;
   danach deren llms.txt/agent-card korrigieren.

## 2026-07-18 · Ralph-Loop Iteration 1 — Track A: EU27 komplett + Lock-Inzident behoben

**Störung (Vorrang):** bund-Poll scheiterte mit "database is locked".
Dreistufige Ursache + Fix (Backend `b9fbdf5`):
1. TED-Full-Scan hielt EINE minutenlange Write-Transaktion → Batch-Commit alle 200 Upserts
2. Writer-Starvation trotz Batches → Poll-Serialisierung via modul-weitem asyncio-Lock
3. Landes-Jobs wurden still verworfen (APScheduler misfire_grace_time Default 1s,
   Event-Loop beim TED-Parsen kurz blockiert) → misfire_grace_time=3600 + coalesce überall

**Track A (A1–A3 erledigt):**
- A1: EU27 = 19.029 ACTIVE-Notices > 15.000er-TED-Deckel → Split nötig (Messung via TED-API)
- COUNTRIES=EU27 kam parallel aus dem tender-agents-Fenster (.env.bak-20260718-1515);
  dadurch lief der Deckel-Verlust bereits live (fetched nur 10.619 von 19.054)
- A2/A3: TED pollt jetzt je 3er-Ländergruppe (`4c31f1d`), alle 9 Gruppen unter Deckel,
  Warnlog ab 14k/Gruppe. Ergebnis: fetched 14.599 (+~4.000 zurückgeholt), stored 12.106

**Kennzahlen:** 12.229 Tender / 27 Länder (Top: DEU 5.166, FRA 2.762, POL 697, SWE 659,
AUT 516). DB ~165 MB + ~70 MB WAL. TED-Gruppen-Scan ~4 Min, alle 10 Quellen seriell OK.
Tests: Backend 165 (+3 Gruppen-Tests), Site 16. FR-Treffer live auf beiden Domains
verifiziert — die tender-agents.com-Länderfacetten sind jetzt gefüllt.

**Beobachten (A4-Nähe):** Größte Gruppe FRA+DEU+GRC=11.837 → bei Wachstum COUNTRY_GROUP_SIZE
auf 2 senken. DB-Größe im Auge behalten (Postgres-Gate bei >500 MB).

**Nächster Schritt:** A5 (Nicht-TED-Quellen scopen) oder A6/D4 (Länder-Doku ausspielen);
B1 (Sprachfeld) ist der Einstieg in Track B.

## 2026-07-18 · Ralph-Loop Iteration 2 — B1: Sprachfeld live

Gesundheitscheck: alles grün (Container healthy, 0 Quellen-Fehler, beide Sites 200).
B1 umgesetzt (Backend `8e7ae87`): Tender.languages (ISO-639-3) aus TED-Sprachschlüsseln,
deutsche Portale defaulten auf deu, Alembic-Backfill über raw_data (0 leere Werte),
Feld in beiden API-Schemas. Sprachverteilung: deu 5.775, fra 2.890, pol 684, swe 651,
nld 425, ces 339, eng 291, spa 238. Tests: Backend 167 (+2).

**Nächster Schritt:** B2 (mehrsprachige Vertical-Keywords — languages-Feld ist jetzt da),
danach B3 (Firmen-Fit sprachneutral absichern, Rossmanith-Profil als Testfall).

## 2026-07-18 · Ralph-Loop Iteration 3 — Störung: Migrations-Race bei Fremd-Restart

Gesundheitscheck fand ted-Fehler "no column named languages": Das ANDERE Fenster hat
den Container 17:47 neu gestartet, bevor im neuen Prozess die Migration sichergestellt
war — der Startup-Poll schrieb gegen die alte Spaltenliste. Root-Cause-Fix (Backend
`docker-compose.yml`): `alembic upgrade head` läuft jetzt VOR uvicorn im Container-
Command. Verifiziert: Neustart → Migration am Boot → TED-Poll 14.603/12.113 fehlerfrei,
Quellenstatus sauber.

**Koordinations-Hinweis für beide Fenster:** Der agentleads-Container ist geteilte
Infrastruktur. Restarts bitte nur mit aktuellem Image-Build aus dem aktuellen Repo-Stand
(git pull vor docker compose build); Migrationen laufen jetzt automatisch.

**Nächster Schritt:** C1 (eForms-Feldtiefe: Lose, Zuschlagskriterien, Rahmenvereinbarung
in Modell+API) — Track C ist der am wenigsten fortgeschrittene.

## 2026-07-18 · Ralph-Loop Iteration 4 — C1: eForms-Go/No-Go-Felder live

Gesundheitscheck grün. TED-Feldkatalog empirisch inventarisiert (1.830 verfügbare Felder,
via 400-Response der API). Fünf Felder extrahiert und deployt (Backend `6fc03e7`,
Migration `d7b3e5f80a21`, läuft seit Iteration 3 automatisch beim Boot):
- lot_count (11.960 befüllt), award_criteria mit type/weight/name,
  framework_agreement (none 9.063 / fa-wo-rc 2.035 / fa-w-rc 323 / fa-mix 225),
  gpa_covered, selection_criteria (7.174 Tender mit Eignungsanforderungen im KLARTEXT)
- Freemium-Grenze: selection_criteria nur in der authentifizierten API (TenderOut),
  Public-Preview zeigt Lose/Kriterien/Framework/GPA
- Tests: Backend 170 (+3). Live verifiziert (Public-API DEU/fassade).

**Produktbedeutung:** selection_criteria + award_criteria sind der Rohstoff für die
Go/No-Go-Karte v2 (C6) = Kern des 1.499-EUR-Verfahrens-Produkts und des Agent-Tarifs.

**Nächster Schritt:** B2 (mehrsprachige Vertical-Keywords) oder C2 (Fristen-Abdeckung
messen); C6 wird greifbar, sobald B3 (Firmen-Fit sprachneutral) steht.

## 2026-07-18 · Ralph-Loop Iteration 5 — D1: MCP-Distribution vorbereitet

Gesundheitscheck grün. D1 erledigt (Site-Commit folgt, Backend `a7357df`):
- server.json registry-konform umgebaut (Reverse-DNS `de.ausschreibungsagenten/tenders`,
  remotes streamable-http, Schema-Referenz) und via nginx öffentlich geschaltet
  (Location ergänzt; Backup: /etc/nginx/sites-available/ausschreibungsagenten.bak-*)
- docs/DISTRIBUTION.md: Registry-Landschaft mit Prioritäten, wiederverwendbarem
  Metadaten-Block, fertigem awesome-mcp-servers-PR-Text und Registry-Ablauf

**NEEDS-HUMAN (neu, alles copy-paste-fertig in docs/DISTRIBUTION.md):**
1. DNS-TXT für Domain-Verifikation + `mcp-publisher publish` (offizielles MCP Registry;
   PulseMCP etc. crawlen das automatisch)
2. awesome-mcp-servers-PR abschicken (Text liegt bereit)
3. mcpservers.org/submit-Formular (~5 Min)

**Nächster Schritt:** B2 (mehrsprachige Vertical-Keywords) — Track B ist wieder der
am wenigsten fortgeschrittene (1/5 vs. A 3/6, C 1/6 mit C1, D 1/4).

## 2026-07-18 · Ralph-Loop Iteration 6 — B2: sprachagnostisches Scoring live

Der Keyword-Boost im relevance_score kannte nur deutsche Begriffe — nicht-deutsche
Tender waren systematisch untergescored (Baseline: FRA Ø26 mit 13 Tendern >=80,
ITA Ø24 mit 0, gegen DEU Ø52 mit 984). Fix (Backend `0477049`): kuratierte
keywords_i18n je Vertical (deu/eng/fra/spa/ita/nld/pol, eng-Fallback), Scoring
wählt per Notice-Sprache (B1-Feld), CPV bleibt Hauptsignal.

**Wirkung nach Rescoring-Scan (14.597 fetched, 0 Fehler):**
- FRA: Ø26→34, >=80: 13→117 (9x) · NLD: 6→31 · ESP: 0→30 · POL: 0→19 · ITA: 0→3
- DEU stabil 984→990 (keine Regression)
- Live: FR-Fassaden-Tender mit Score 100 in der Public-API

Tests: Backend 175 (+5, inkl. FR/DE-Paritätstest). Damit ist die Kern-These des
sprachagnostischen Frameworks bewiesen: CPV + Sprachfeld + kuratierte Sets je
Sprache = gleichwertige Treffer-Qualität EU-weit.

**Nächster Schritt:** B3 (Firmen-Fit sprachneutral — Rossmanith-Profil gegen
AT/FR-Treffer testen) oder C2 (Fristen-Abdeckung); A5/A6 bleiben offen.

## 2026-07-18 · Ralph-Loop Iteration 7 — C2: Fristen-Abdeckung 32% → 98%

Messung: 68% der TED-Tender ohne deadline_at — Ursache: nur deadline-date-lot wurde
gelesen; zweistufige Verfahren (nicht offen/Verhandlung) nennen in der Bekanntmachung
nur die TEILNAHMEfrist. Fix (Backend `fa13f28`): Fallback-Kette Angebotsfrist →
Teilnahmefrist → Interessensfrist (+ generisches deadline-Feld), bei mehreren Losen
zählt die früheste. Nach Rescan: 209/12.132 ohne Frist (2%). Tests: Backend 179 (+4).

Fürs Produkt: Fristenkalender/Digest sind damit EU-weit belastbar; der "Verpasste
Fristen"-Pitch der Landingpage hat jetzt 98% Datendeckung.

**Nächster Schritt:** B3 (Firmen-Fit sprachneutral) oder A5/A6; Track-Stand
A 3/6 · B 2/5 · C 2/6 · D 1/4.

## 2026-07-18 · Ralph-Loop Iteration 8 — D3: /status-Seite live

D2 (SEO-Länderseiten) ist durch die SSG-Voraussetzung blockiert (kein Headless-Chrome
auf dem VPS für Prerender) — als blockiert markiert, D3 vorgezogen.
D3 erledigt: /status zeigt live Quellen (letzter Abruf, fetched/stored) und die
EU-Abdeckung je Land mit echten Zahlen. Neuer öffentlicher Endpunkt
/api/public/countries (Backend `9e1e86f`) + Vercel-Proxy /api/countries — der
nützt auch den tender-agents-Facetten. Site `2a235e7`, live verifiziert (200,
27 Länder). Tests: Backend 180, Site 16.

**Nächster Schritt:** B3 (Firmen-Fit sprachneutral, Rossmanith als Testfall) oder
A5 (GB/CH-Scoping). D2 wartet auf SSG-Entscheidung (NEEDS-HUMAN: Prerender-Ansatz
wählen — Build-Zeit-SSG in Vercel statt lokalem Chrome wäre der saubere Weg).

## 2026-07-18 · Ralph-Loop Iteration 9 — C3: strukturierte Eignungsanforderungen

Korpus-Analyse über 7.179 selection_criteria-Texte: Referenzen 56%, Umsatz 49%,
Versicherung 41%, Zertifikate 33%. Deterministischer Extraktor (mehrsprachige Muster
+ Beleg-Snippet, KEIN LLM, kein Schwellenwert-Parsing — bewusste Nicht-Ziele in
docs/ESPD-SCOPING.md dokumentiert). Tender.requirements (JSON) beim Upsert +
Migration-Backfill: 5.255 Tender strukturiert. Nur authentifizierte API.
Backend `de1dfc6`, Tests 185 (+5).

Damit liegt der komplette Rohstoff für die Go/No-Go-Karte v2 (C6) vor:
Anforderungstyp + Beleg aus der Bekanntmachung, bereit für den Abgleich
mit dem Firmenprofil.

**Track-Stand:** A 3/6 · B 2/5 · C 3/6 · D 2/4 (D2 blockiert auf SSG).
**Nächster Schritt:** B3 (Firmen-Fit sprachneutral) — dann ist der Weg zu C6 frei.

## 2026-07-18 · Ralph-Loop Iteration 10 — B3: Firmen-Fit sprachneutral

Drei Sprachlecks im Company-Fit behoben (Backend `4c3ee64`): deutsche Ausschlusswörter
griffen auf fremdsprachigen Texten nicht (stilles Risiko), Leistungsbegriffe verloren
stumm bis zu 20 Punkte, beides ohne Erklärung. Jetzt: Begriffe/Ausschlüsse nur auf
Notices der Profilsprache(n) (PROFILE_LANGUAGES=deu als Konstante, Profil-Feld folgt
bei internationalen Kunden), expliziter Reason auf fremdsprachigen Notices,
CPV-Ausschlüsse bleiben sprachneutral. Mehrsprachige Notices mit deu voll bewertbar.

Verifiziert: echtes Rossmanith-Profil read-only → 8 Matches (85–90), 0 False-Positives;
Tests 189 (+4, inkl. AT-Parität und FR-Robustheit gegen Teilwort-Fehlgriffe).

**NEEDS-HUMAN:** Rossmanith target_countries um AUT erweitern? (Kundenkonfig; Gordens
"Rossmanith kann AT-Tender bekommen" von heute spricht dafür, die gepflegten Regionen
BW/RLP/HE dagegen — bitte mit Kunde klären.)

**Track-Stand:** A 3/6 · B 3/5 · C 3/6 · D 2/4. Mit B1+B2+B3+C1+C3 ist das Fundament
für C6 (Go/No-Go-Karte v2 = 1.499-EUR-Produkt) komplett.
**Nächster Schritt:** C4 (OCDS-Mapping, Vorarbeit GB) oder A5 (GB/CH-Scoping) —
oder direkt C6, wenn Priorität auf Produkt statt Protokoll-Reihenfolge liegt.

## 2026-07-18 · Ralph-Loop Iteration 11 — A5: GB/NO/CH gescoped

Live-Probes (Backend-Doc `docs/SOURCES-INTL.md`, Commit `eb7a210`):
- GB Find a Tender: OFFEN (kein Key), OCDS 1.1 mit EU-Profil, **CPV weiterhin in
  Nutzung**, UK-NUTS-Regionen → Connector-Aufwand M, kein Mapping-Projekt.
  OCDS→Tender-Feldmapping dokumentiert (erledigt C4 im Entwurf gleich mit).
  Offen nur GBP→EUR-Umrechnung + Markenentscheid (.com, Nicht-EU).
- Doffin (NO): 401 — kostenloser API-Key nötig → NEEDS-HUMAN (5-Min-Registrierung).
- simap (CH): kein offener Endpunkt, Zugang über Betreiber klären → NEEDS-HUMAN.
- ÖNORM A 2063 (C5-Notiz): GAEB-Pendant, Normkauf nötig → NEEDS-HUMAN, nachfragegetrieben.

**Track-Stand:** A 4/6 · B 3/5 · C 3/6 · D 2/4.
**Nächster Schritt:** A6 (Länder-Doku ausspielen) oder C4 formal abhaken via GB-Connector-
Entscheid; C6 (Go/No-Go v2) ist bereit, sobald Gorden priorisiert.

## 2026-07-18 · Ralph-Loop Iteration 12 — C4: OCDS-Mapping empirisch validiert

Das in A5 entworfene OCDS→Tender-Mapping über 100 echte GB-FTS-Releases geprüft
(Backend-Doc erweitert): CPV/Titel/Frist/Buyer/Verfahren 100%, NUTS/Lose 99%,
cpv_additional 85%, Wert 70% (einheitlich GBP — eine Kursquelle genügt).
GB-Fristen-Abdeckung schlägt sogar TED. Der fts-Connector ist damit bau-fertig
und die OCDS-Blaupause steht für weitere Publisher (Doffin nach Key).

**Track-Stand:** A 4/6 · B 3/5 · C 4/6 · D 2/4.
Verbleibende Ziele sind überwiegend gated: B4 (FTS-Analyse), B5 (LLM-Kosten →
NEEDS-HUMAN), C5 (Normkauf), C6 (Produkt-Build, bereit), D2 (SSG), D4 (laufend),
A4 (Gate), A6 (Doku-Hygiene). Die Loop nimmt als Nächstes B4 oder A6.

## 2026-07-18 · Ralph-Loop Iteration 13 — A6+D4: Doku-Sync (Länder, Felder, Agent Card)

Kombinierter Hygiene-Pass (beide Ziele überlappen): Agent Card + search_tenders-Skill
präzisiert ("all 27 EU countries", country/CPV-Filter, Backend `6948a2b`);
llms-full.txt um /api/countries, requirements-Feld und 98%-Fristen-Abdeckung ergänzt;
/entwickler um countries-Endpunkt und die neuen Response-Felder erweitert.
Länderliste bleibt via /api/countries dynamisch — kein Doku-Drift möglich.

**Track-Stand: A 5/6 · B 3/5 · C 4/6 · D 3/4 = 15/21.**
Verbleibend ungegated: B4 (FTS-Mehrsprachigkeit analysieren). Alles andere wartet
auf NEEDS-HUMAN-Entscheidungen (siehe Liste in Iteration 12) bzw. Gates (A4).

## 2026-07-18 · Ralph-Loop Iteration 14 — B4: FTS-Mehrsprachigkeit auditiert

Empirischer Audit gegen den Live-Index (Backend-Doc docs/FTS-I18N.md, `3881d28`):
- 100% Abdeckung (12.231/12.231), Diakritika-Faltung funktioniert quer durch alle
  Sprachen (façade=facade 169, fenêtre=fenetres 16, ślusarka=slusarka 6) —
  B4-Abnahme "Original-Titel jeder Sprache auffindbar" erfüllt, ohne Codeänderung.
- Dokumentierte Grenze: deutsche Komposita/Flexion (fassade 603 / fassaden 224 /
  fassadenarbeiten 353 getrennt) — Workaround Prefix-Syntax fassade* (1.195 Treffer),
  in FTS-I18N.md für API-Nutzer ausgewiesen. Ausbaustufe: Query-Expansion über
  B2-Keyword-Sets (M) statt Tokenizer-Bastelei.

**Track-Stand: A 5/6 · B 4/5 · C 4/6 · D 3/4 = 16/21.**
**Die Loop hat damit alle ungegateten Ziele abgearbeitet.** Verbleibend: B5 (LLM-Budget),
C5 (Normkauf), C6 (Produkt-Build — bereit, wartet auf Prio), D2 (SSG-Entscheid),
A4 (Infrastruktur-Gate, noch nicht ausgelöst) + NEEDS-HUMAN-Liste aus Iteration 12.
Empfehlung: Loop stoppen oder mit expliziter C6-Freigabe neu füttern.

## 2026-07-18 · Ralph-Loop Iteration 15 — Heartbeat (keine ungegateten Ziele)

Gesundheitscheck: Container healthy, 0 Quellen-Fehler, beide Sites 200, 0 Lock-Fehler.
A4-Gate-Messung: DB 283 MB (Gate 500 MB — Achtung Trend: mittags 165 MB, die
eForms-Felder in raw_data kosten Platz; bei diesem Tempo Gate in Tagen erreicht →
Postgres-Plan aus A4 zeitnah entscheiden). TED-Poll 4m20s (Gate 15 min) OK.

Keine ungegateten Ziele mehr — Loop wartet auf Entscheidungen (Liste s. Iteration 12/14).

## 2026-07-18 · Ralph-Loop kontrolliert beendet (nach Iteration 22)

Alle ungegateten Ziele erledigt (16/21), Iterationen 15-20 waren Leerlauf-Heartbeats
(System durchgehend grün). Loop gemäß Protokoll beendet — Neustart jederzeit:
/ralph-loop:ralph-loop mit dem Kickoff-Prompt aus AGENT-GOALS.md.
Offene Entscheidungen: siehe NEEDS-HUMAN-Listen (Iteration 12/14/15) —
Kurzfassung: C6-Freigabe, GB-Entscheid, Postgres (DB-Trend!), SSG, Registry-Submissions.

## 2026-07-19 · Freigaben von Gorden — Loop-Neustart

Freigegeben: A4 Postgres-Migration (mit Pflicht-Backup/Verifikations-Reihenfolge),
A7 GB-Connector fts (inkl. Markenentscheid "EU + UK", GBP_EUR_RATE-Env),
B5 Digest-Übersetzung (Claude API claude-haiku-4-5, Caching, Flag; Key ggf. NEEDS-HUMAN).
C6 bleibt bewusst geparkt (Fähigkeiten vor Produkt). Loop neu gestartet.

## 2026-07-19 · Ralph-Loop (neu) Iteration 1 — A4 Schritte 1–3: Postgres vorbereitet

Freigegebene A4-Migration begonnen, risikofreie Hälfte fertig (Backend `0a33531`):
1. Konsistentes Online-Backup (sqlite3.backup) + Restore-Test: integrity ok,
   12.231 Tender, 26 Tabellen → ~/backups/agentleads-migration/
2. Code dialekt-portabel: Upserts (sqlite/pg on_conflict), FTS abstrahiert
   (FTS5 ↔ tsvector 'simple' + unaccent mit immutable-Wrapper), Treiber + alembic-URLs
3. postgres:16-alpine läuft healthy (127.0.0.1:5433, pgdata-Volume, .env-Passwort)
4. Migrationsskript mit FK-sicherer Kopie, fts-Rebuild, Count-+Stichproben-Verifikation

App läuft unverändert auf SQLite (Tests 189 grün, healthy). **Nächste Iteration =
Cutover:** App stoppen → alembic upgrade gegen PG → Migration ausführen →
DATABASE_URL umstellen → Start → Smoke-Tests (Polls/API/MCP/Auth). Kurze Downtime
(~2–5 Min) nötig; SQLite bleibt als Fallback unangetastet.

## 2026-07-19 · Ralph-Loop Iteration 2 — A4 KOMPLETT: Produktion läuft auf Postgres

Cutover erfolgreich (Downtime ~7 Min, Backend `abdd165`):
- Frisches Backup vor Cutover, Schema via create_all + alembic stamp (bewusst NICHT
  die SQLite-spezifischen Alt-Migrationen auf PG abgespielt)
- Einziger Datenbefund: performance_location bis 1.076 Zeichen > VARCHAR(500) →
  Modell auf Text geweitet (Migration f2a6c8d9); sonst alle 20 Tabellen 1:1
- Verifikation: alle Counts identisch (12.231 Tender), 5 Stichproben feldgleich,
  fts neu aufgebaut (12.231)
- Smoke auf PG: FR-Suche mit Diakritika ✓, 27-Länder-Endpoint ✓, MCP-fulltext via
  tsvector('simple')+unaccent ✓, Startup-Full-Scan 14.604/12.112 mit 0 Fehlern,
  Prod via Vercel ✓
- Rollback-Pfad: DATABASE_URL-Zeile aus .env entfernen → SQLite (unangetastet)

**Follow-ups:** (1) db.ready-Log maskiert die DB-URL nicht (Passwort im Log) — fixen;
(2) SQLite-Fallback nach 1 Woche stabiler PG-Laufzeit archivieren; (3) Offsite-Backup-
Skript (backup_db.py) auf pg_dump umstellen — als Nächstes prüfen.

**Nächster Schritt:** A7 GB-Connector oder B5 Digest-Übersetzung.

## 2026-07-19 · Ralph-Loop (neu) Iteration 3 — B5: Digest-Übersetzung gebaut (Flag aus)

B5 komplett implementiert und deployt (Backend `cbad3ec`, Migration a1d5f7c3):
- services/translation.py: claude-haiku-4-5 (freigegebenes Modell) via offiziellem
  anthropic-SDK, strukturierte JSON-Ausgabe (title_de + max. 2-Satz-summary_de)
- Caching am Tender (translation_de, ein API-Call je Tender), best effort —
  API-Fehler blockieren den Digest-Versand nie
- Digest zeigt "Deutsch: … [KI-Übersetzung — Original maßgeblich]" + Kurzfassung
  NUR bei fremdsprachigen Treffern; deutsche Tender unverändert
- TRANSLATION_ENABLED default aus; 7 gemockte Tests, Suite 196 grün; Prod healthy,
  Verhalten unverändert (Flag aus)

**NEEDS-HUMAN (1 Minute):** ANTHROPIC_API_KEY in ~/agentleads-account/.env +
TRANSLATION_ENABLED=true + docker compose up -d app → Feature live.

**Nächster Schritt:** A7 GB-Connector (letztes freigegebenes Ziel).

## 2026-07-19 · Ralph-Loop (neu) Iteration 4 — A7: GB Find a Tender LIVE 🇬🇧

Letztes freigegebenes Ziel erledigt (Backend `960118e`):
- OCDS-Connector nach validierter Spezifikation: offene API, Cursor-Pagination,
  30-Tage-Rolling-Window, CPV nativ, UK-NUTS, GBP→EUR via GBP_EUR_RATE (1.17)
- Echtwelt-Fix im ersten Lauf: FTS-Daten enthalten Infinity/NaN → _sanitize_json
  (Postgres-JSON lehnt das ab; TED war davon nie betroffen)
- Erster voller Poll: 190 Releases, 18 Vertical-Matches, 0 Fehler; GBR-Tender
  live in Public-API mit B2-Scores (englische Keyword-Sets greifen: 60–75)
- Quelle als 'live' in Health/source-status; Scheduler 6h; Tests 200 gesamt
- Doku-Sync: llms.txt/llms-full ("Neun Quellen", GBR), /status (Quelle + Ländername)

**Positionierung jetzt: EU + UK.** Sync-Punkt fürs tender-agents-Fenster:
llms.txt/Facetten drüben um GBR erweitern ("EU + UK coverage").

**Damit sind ALLE freigegebenen Ziele abgearbeitet** (A4 Postgres ✓, A7 GB ✓,
B5 Übersetzung ✓ hinter Flag). Verbleibend nur NEEDS-HUMAN: ANTHROPIC_API_KEY,
MCP-Registry-Submissions, C6-Freigabe, SSG-Entscheid, Doffin-Key, Rossmanith+AUT.

## 2026-07-19 · Ralph-Loop beendet (alle Freigaben abgearbeitet)

A4 Postgres ✓, A7 GB-Connector ✓, B5 Übersetzung ✓ (Flag aus, wartet auf Key).
System grün (9 Quellen, 0 Fehler, 28 Länder). Loop beendet — Neustart:
/ralph-loop:ralph-loop mit Kickoff-Prompt aus AGENT-GOALS.md, idealerweise
nach neuen Freigaben (C6, SSG, Registry-Keys — Liste s. o.).

## 2026-07-19 · OpenRouter-Umstellung (B5) + globaler Quellen-Katalog

Auf Gordens Wunsch: Übersetzung läuft jetzt standardmäßig über OpenRouter
(OpenAI-kompatibel, Modell frei wählbar, default google/gemini-2.0-flash-001);
Anthropic-Direktpfad bleibt als TRANSLATION_PROVIDER=anthropic erhalten.
Backend `211250d`, 202 Tests grün. WICHTIG: Env gehört in die BACKEND-.env
(~/agentleads-account/.env), NICHT in Vercel — der Digest läuft im Container.

Gordens kuratierter Welt-Katalog freier Quellen gespeichert:
~/agentleads-account/docs/SOURCES-GLOBAL.json (Ring 1-3 + Ausschlüsse +
Build-Hinweise). Abgleich: TED ✓ live, uk_fts ✓ live; die Build-Hinweise
(Raw-Payload behalten ✓, Dedup nicht über Titel ✓ [wir: Titel+Buyer — Hinweis
Buyer+Deadline+Wert prüfen!], health_status je Quelle ✓) decken sich mit dem
Gebauten. Größte Quick-Wins als Vorschläge annotiert:
- A8 (VORSCHLAG): de_doe Datenservice Öffentlicher Einkauf — OCDS/eForms-DE,
  CC0, Ober- UND Unterschwelle deutschlandweit → würde die 6 Landesportale
  massiv ergänzen; höchster DE-Hebel im Katalog
- A9 (VORSCHLAG): uk_cf Contracts Finder — UK-Unterschwelle, OCDS-Parser
  vom fts-Connector wiederverwendbar
Warten auf Freigabe.

## 2026-07-19 · A8 + A9 gebaut (Freigabe „bau A8 und A9")

**A8 `doe` — Datenservice Öffentlicher Einkauf (oeffentlichevergabe.de), LIVE.**
Ein Endpoint (`/api/notice-exports?pubDay=…`), Tages-ZIPs. Hybrid: OCDS-ZIP
für Struktur + eForms-XML-ZIP nur für die Angebotsfrist (BT-131), weil der
OCDS-Konverter des Dienstes tenderPeriod komplett weglässt (0/762 empirisch).
Stems der Dateinamen verknüpfen beide ZIPs. Echtwelt-Befund: Unterschwellen-
Notices nutzen andere XML-Namespace-Präfixe (ns2: statt cac:) → prefix-
agnostischer Regex, Deadline-Map 114→370/Tag. Erster Poll: 1.987 fetched,
76 gespeichert (Vertical-Match), 91 % mit Deadline, 0 Fehler. Damit ist die
deutsche UNTERSCHWELLE erstmals drin — genau die KMU-Aufträge (Beispiel aus
dem ersten Poll: „Innentüren Metall, Kreishaus Lauenburg", Score 100,
Direktlink subreport.de).

**A9 `cf` — GB Contracts Finder (£12k-Unterschwelle England), LIVE.**
Erbt den fts-OCDS-Parser komplett (neue Hooks `_initial_url`/`_notice_id`
in FindTenderSource); nur Fenster-Query (publishedFrom/To, 14 Tage) und
Notice-URL (Versions-Suffix strippen) sind eigen. Erster Poll: 181 fetched,
2 gespeichert, 0 Fehler.

Infrastruktur: `request_bytes` in AbstractSource (ZIP-Downloads mit Retry),
Scheduler-Jobs poll-doe (12 h)/poll-cf (6 h), Registry+/status+llms auf
**11 Live-Quellen**. Tests 202→213. Backend deployt & verifiziert (beide
Polls grün in Prod-Postgres). Katalog-Annotationen auf LIVE gestellt.
