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
