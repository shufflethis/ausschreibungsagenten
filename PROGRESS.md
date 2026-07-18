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
