# Inhaltsseiten Phase 2 — Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Die drei nachfragestärksten Themen aus der Search Console bekommen je eine eigene Seite, gebaut auf dem Fundament aus Phase 1.

**Architecture:** Inhalte liegen als strukturierte Daten je Seite (`src/inhalte/<slug>.js`) und werden von einer gemeinsamen Schablone `InhaltsSeite` gerendert. Die Schablone erzwingt die Reihenfolge aus der Spec: Direktantwort, Faktenblock, Hauptteil, Abgrenzung, FAQ, Handlungsaufforderung, Querverweise. Routen, Prerendering, Sitemap, Meta-Daten und Wächter aus Phase 1 greifen automatisch.

**Tech Stack:** wie Phase 1 — React 19, react-router-dom 7, Vite 7, Vitest 4.

## Abweichung von der Spec

Die Spec sah Markdown mit Frontmatter vor. Stattdessen strukturierte Daten, aus zwei Gründen:

1. Die Seitenschablone hat eine **feste Form** (Direktantwort in 40–60 Wörtern, Faktentabelle mit Datenstand, FAQ mit drei bis fünf Einträgen). Strukturierte Daten machen diese Form prüfbar — ein Test kann die Wortzahl der Direktantwort und die Zahl der FAQ-Einträge erzwingen. Freies Markdown kann das nicht.
2. Markdown bräuchte einen Parser als zusätzliche Abhängigkeit. Phase 1 kam ohne neue Abhängigkeit aus; das bleibt so.

Die FAQ-Einträge fließen zusätzlich in das `FAQPage`-Schema, das `StrukturierteDaten` bereits kann.

## Global Constraints

- Repo `/home/admin/ausschreibungsagenten-site`, Branch `feat/seo-inhaltsseiten`. Merge nach `master` deployt live und ist eine eigene Entscheidung.
- Keine neue Laufzeit-Abhängigkeit.
- Deutsch in Texten, Kommentaren und Commit-Nachrichten; Commit-Nachrichten ohne Umlaute.
- **Nur behaupten, was das Produkt kann.** Belegt aus dem App-Repo: Anforderungen aus Vergabeunterlagen herauslesen (`requirement_mining`), Nachweismatrix mit Belegen und **unverbindlichem** Vorbefüll-Entwurf (`bid_readiness`), deterministische Go/No-Go-Karten (`go_no_go`), GAEB X83/X84 **nur lesend** (`gaeb`), 17 Live-Quellen, erklärbares Matching über CPV, Stichwörter, Ausschlüsse, Ort, Wert, Frist.
- **Nicht im Umfang, also auch nicht in den Texten:** Angebotstexte schreiben, Kalkulation, Preisempfehlung, Angebotsabgabe, semantische Vektorsuche.
- Zahlen mit Quelle und Datenstand: 135,2 Mrd. Euro bei 199.334 gemeldeten Zuschlägen 2024 (Destatis-Vergabestatistik), rund 15 Prozent des Bruttoinlandsprodukts (OECD-Schätzung), EU-Schwellenwerte 140.000 / 216.000 / 5.404.000 Euro.
- Alle Handlungsaufforderungen führen auf das Pilot-Formular mit vorbelegtem Seitenkontext.

## Seiten

| URL | Leitfrage | Zielanfragen | Impressionen |
|---|---|---|---|
| `/ausschreibungssuche-automatisieren` | Wie automatisiere ich die Suche nach öffentlichen Ausschreibungen? | automatische ausschreibungssuche · ausschreibungssuche automatisieren möglichkeiten · software die viele ausschreibungsportale durchsucht | ~900 |
| `/ki-angebot-ausschreibung` | Was kann KI beim Angebot wirklich — und was nicht? | konzeptschreiber ki ausschreibung · chatgpt für ausschreibungen · ausschreibung beantworten ki | ~600 |
| `/semantische-suche-ausschreibungen` | Was bedeutet semantische Suche bei Ausschreibungen? | semantische suche ausschreibungen | 292 |

Die dritte Seite ist der Sonderfall aus der Spec: Das Produkt betreibt **keine** Vektorsuche. Die Seite erklärt den Begriff, benennt, woran semantische Verfahren bei Vergabesprache scheitern, und stellt das regelbasierte Vorgehen daneben. Sie wirbt nicht mit einer Fähigkeit, die nicht existiert.

## Tasks

### Task 1: Datenformat und Schablone

**Files:** Create `src/components/InhaltsSeite.jsx`, `src/inhaltsSeite.test.jsx`

- [ ] Test schreibt fest: Direktantwort erscheint vor allen anderen Abschnitten, FAQ-Einträge landen im `FAQPage`-Schema, Querverweise werden gerendert, fehlende Pflichtfelder werfen.
- [ ] Schablone rendert `<Seo path faq>`, `<h1>`, Direktantwort, optionalen Faktenblock als Tabelle mit Datenstand, Abschnitte mit `<h2>`, Abgrenzungsblock, FAQ als `<details>`, Handlungsaufforderung, Querverweise.
- [ ] Commit.

### Task 2: Inhaltsprüfung als Test

**Files:** Create `src/inhalte/`, `src/inhalte.test.js`

- [ ] Test über alle Inhaltsdateien: Direktantwort 40–60 Wörter, drei bis fünf FAQ-Einträge, mindestens zwei Querverweise, Abgrenzungsblock vorhanden, Faktentabelle mit Datenstand.
- [ ] Commit zusammen mit der ersten Inhaltsdatei.

### Task 3–5: Die drei Seiten

Je Seite: Inhaltsdatei, Manifest-Eintrag, Seitenkomponente, Test grün, Build grün, Commit.

### Task 6: Verlinkung

- [ ] Querverweise zwischen den drei Seiten und von der Startseite in den Wissensblock.
- [ ] Navigation im Footer ergänzen.

### Task 7: Prüfung und Übergabe

- [ ] `npm test`, `npm run build`, Browser-Konsole auf allen drei Seiten ohne Fehler.
- [ ] Sitemap enthält sieben indexierbare Adressen.
- [ ] Bericht; Merge nach `master` bleibt eine eigene Entscheidung.
