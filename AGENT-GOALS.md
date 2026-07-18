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
- [ ] **A4 — Infrastruktur-Gate:** Wenn DB > 500 MB oder Poll > 15 Min oder Lock-Fehler häufen:
      Migration SQLite → Postgres vorbereiten (Alembic existiert). Entscheidung + Plan als
      NEEDS-HUMAN loggen, nicht eigenmächtig migrieren.
- [ ] **A5 — Nicht-TED-Quellen scopen (nur Analyse, kein Bau):** GB Find-a-Tender (OCDS),
      CH simap, NO Doffin: API-Zugang, Datenmodell, Aufwand je Connector dokumentieren.
      *Abnahme: Scoping-Doc `docs/SOURCES-INTL.md` im Backend-Repo.*
- [ ] **A6 — Länder-Facette ausspielen:** `country`-Parameter in /entwickler-Doku + llms.txt
      mit Liste der tatsächlich indexierten Länder (dynamisch halten oder bei jedem
      Rollout-Schritt aktualisieren). Agent Card Beschreibung „German and EU" prüfen.

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
- [ ] **B3 — Firmen-Fit sprachneutral:** Firmenprofil-Matching (Begriffe/Ausschlüsse) prüfen:
      wo matchen deutsche Kundenbegriffe gegen fremdsprachige Titel? Lösung dokumentieren und
      umsetzen: CPV-first, Begriffe nur auf Notices der Profilsprache(n), optional
      TED-Mehrsprachfelder (TED liefert Titel oft in mehreren Sprachen — nutzen!).
      *Abnahme: Rossmanith-Profil bekommt AT-Treffer korrekt, keine False-Positives aus FR/PL.*
- [ ] **B4 — FTS mehrsprachig:** Volltextsuche auf Sprach-Handling prüfen (Stemming/Analyzer);
      mindestens: Suche findet Original-Titel jeder Sprache; dokumentieren, was (noch) nicht geht.
- [ ] **B5 — Anzeige-/Digest-Übersetzung (Experiment, klar gelabelt):** Für fremdsprachige
      Treffer im Digest/Dashboard eine deutsche Kurzzusammenfassung erzeugen (LLM-Aufruf,
      Kosten prüfen → wenn API-Kosten nötig: NEEDS-HUMAN). Immer mit „maschinell übersetzt"-Label
      und Link zur Originalquelle.
      *Das ist das Verkaufsargument: „EU-Aufträge ohne Sprachbarriere".*

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
- [ ] **C3 — ESPD verstehen:** Analyse: Welche Eignungsnachweise (ESPD-Struktur) lassen sich
      aus Bekanntmachungen extrahieren? Als strukturiertes „Anforderungen"-Feld am Tender
      (z. B. Umsatz-Mindestgrenzen, Referenzen, Zertifikate) — das füttert Go/No-Go-Karten.
      *Abnahme: Scoping-Doc + Extraktion für die häufigsten 3 Anforderungsarten.*
- [ ] **C4 — OCDS-Kompetenz:** OCDS-Datenmodell (GB, international) dokumentieren und
      Mapping OCDS→Tender-Modell entwerfen (Vorarbeit für GB-Connector aus A5).
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
- [ ] **D3 — /status-Seite:** Öffentliche Statusseite aus source-status (Transparenz-Moat,
      steht schon in GOALS.md P2) — inkl. Länderliste aus Track A.
- [ ] **D4 — llms.txt/Agent Card aktuell halten:** Nach jedem Track-A/B/C-Meilenstein prüfen.

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
