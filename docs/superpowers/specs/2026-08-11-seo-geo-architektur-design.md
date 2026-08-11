# SEO/GEO-Architektur für ausschreibungsagenten.de

Stand: 2026-08-11 · Datengrundlage: Google Search Console, 10.05.–09.08.2026

## Ausgangslage

Die Website ist eine reine Client-SPA (Vite + React Router, kein SSR, kein Prerendering).
Jede Route liefert dasselbe leere Gerüst:

```
curl https://www.ausschreibungsagenten.de/          → 6.392 B, <body> ohne Textinhalt
curl https://www.ausschreibungsagenten.de/ueber-uns → identische 6.392 B, identischer <title>
curl https://www.ausschreibungsagenten.de/entwickler → identische 6.392 B, identischer <title>
```

Googlebot rendert JavaScript und kommt verzögert durch. GPTBot, PerplexityBot, ClaudeBot und
Bingbot tun das überwiegend nicht — für die KI-Suche existiert die Seite inhaltlich nicht. Die
vorhandene `llms.txt` ist richtig gedacht, ersetzt aber kein crawlbares HTML und wird von Google
nicht ausgewertet.

Search-Console-Befund über 90 Tage: **164 Suchanfragen, 6.133 Impressionen, 48 Klicks,
Ø Position 37,7** — verteilt auf faktisch **eine** URL. Von acht Einträgen in der Sitemap sind
sechs Rechts- und Statusseiten.

Daraus folgt die Kernthese dieser Spec: Der begrenzende Faktor ist nicht Textqualität, sondern
fehlende Auslieferung und fehlende Seiten. Beides wird hier behoben.

## Ziel und Erfolgskriterien

1. **Auslieferung** — jede Content-Route liefert ohne JavaScript einen thematisch eigenen
   HTML-Body sowie eigenen `<title>` und eigene Description. Prüfbar per `curl`, ohne Browser.
2. **Abdeckung** — die Suchanfragen, die heute auf Position 2–13 stehen und null Klicks bringen,
   haben je eine eigene Zielseite.
3. **Zitierbarkeit** — jede Content-Seite beantwortet ihre Leitfrage in den ersten 60 Wörtern,
   trägt strukturierte Daten und mindestens eine datierte Faktentabelle.
4. **Conversion** — alle Handlungsaufforderungen führen auf das Pilot-Formular, mit dem
   Seitenkontext vorbelegt.

Kennzahl für Phase 2: die Zielanfragen der drei ersten Seiten summieren sich auf rund 1.400
Impressionen im Messzeitraum bei bestehenden Positionen zwischen 2,0 und 12,2. Wird dieses
Positionsniveau gehalten und mit einer passenden Seite bedient, liegt ein Korridor von grob 70–110
Klicks pro Monat im Bereich des Erreichbaren. Das ist eine Annahme auf Basis üblicher
CTR-Kurven, keine Zusage — gemessen wird an der tatsächlichen Entwicklung in der Search Console.

## Technisches Fundament

**Prerendering mit `vite-react-ssg`.** Erzeugt zur Build-Zeit statisches HTML je Route und behält
React, React Router, die bestehenden Vitest-Tests und das Vercel-Setup. Astro oder Next.js wären
für rund 25 Seiten ein unnötiger Umbau des gesamten Gerüsts.

Konkret:

- `src/App.jsx` behält seine Routenliste; die Routen werden zusätzlich als Datenliste exportiert,
  damit Build, Sitemap und interne Navigation dieselbe Quelle nutzen.
- `react-helmet-async` bleibt und liefert je Route Title, Description und Canonical — nach dem
  Prerendering landen diese im ausgelieferten HTML statt erst nach dem Rendern im Browser.
- `public/sitemap.xml` wird nicht mehr von Hand gepflegt, sondern beim Build aus der Routenliste
  erzeugt. Die heutige Sitemap listet acht URLs, von denen zwei Inhalt tragen.

**Inhalte als Markdown.** Content-Seiten werden nicht als JSX geschrieben, sondern als Markdown
mit Frontmatter (Titel, Description, Zielanfragen, Direktantwort, FAQ-Einträge), geladen per
`import.meta.glob` und gerendert durch eine gemeinsame Seitenschablone. Grund: 25 Seiten als
handgeschriebene React-Komponenten sind weder schreib- noch pflegbar, und Markdown erzeugt
sauberes, flaches HTML — genau das, was Sprachmodelle gut verwerten.

**Content-Security-Policy.** Die aktuelle CSP in `vercel.json` setzt `default-src 'self'` und
definiert weder `frame-src` noch `media-src`. Beide fallen damit auf `'self'` zurück. Ein
YouTube-Embed würde blockiert; ein selbst ausgeliefertes `<video>` funktioniert. Die Entscheidung
über die Videoquelle steht noch aus (siehe unten) und bestimmt, ob `frame-src
https://www.youtube-nocookie.com` ergänzt werden muss.

## Seitenarchitektur

Priorisiert nach bestehender Position, nicht nach Wunschbegriffen. Seiten, die heute schon auf
Position 2–13 stehen, gewinnen Klicks am schnellsten.

| URL | Zielanfragen (Auswahl) | Impressionen | Beste Position |
|---|---|---|---|
| `/ausschreibungssuche-automatisieren` | automatische ausschreibungssuche · ausschreibungssuche automatisieren möglichkeiten · wie kann ich die suche nach öffentlichen ausschreibungen automatisieren? | ~900 | 4,0 |
| `/vergleich` | ki gestützte vergabeportale vergleich · beste plattform für ki-gestütztes ausschreibungsmanagement | ~200 | 2,0 |
| `/semantische-suche-ausschreibungen` | semantische suche ausschreibungen | 292 | 43,8 |
| `/ki-angebot-ausschreibung` | konzeptschreiber ki ausschreibung · chatgpt für ausschreibungen · ausschreibung beantworten ki | ~600 | 2,0 |
| `/ausschreibungen-benachrichtigung` | ausschreibungen benachrichtigung ki · öffentliche ausschreibungen verpassen | ~400 | 5,0 |
| `/eignungskriterien-nachweise` | welche ki kann eignungskriterien aus ausschreibungen extrahieren? · vorqualifizierung ausschreibungen ki | ~70 | 15,5 |
| `/fristen-und-deadlines` | welches tool zeigt mir fristen und deadlines für laufende ausschreibungen? | 11 | 13,5 |
| `/alternativen/vergabefix` | vergabefix alternative | 50 | 39,2 |
| `/alternativen/vergabepilot` | vergabepilot alternative | 18 | 65,2 |
| `/alternativen/tenderflow` | tenderflow alternative · günstigere tenderflow alternative | 2 | 1,0 |
| `/alternativen/bidfix` | bidfix alternative für ki-ausschreibungsmanagement · bidfix vs vergabepilot | 2 | 2,0 |
| `/alternativen/dtvp` | dtvp alternative | 2 | 8,0 |
| `/alternativen/tender-service` | tender service alternative | 1 | 51,0 |
| `/branchen/it-dienstleister` | öffentliche ausschreibungen it dienstleister | 23 | 55,0 |
| `/branchen/agenturen` | ausschreibung werbeagentur · ausschreibungen agenturen | 29 | 24,6 |
| `/branchen/bau-und-handwerk` | welche tools helfen mir bei bauausschreibungen? | 7 | 7,9 |
| `/branchen/ingenieur-und-planungsbueros` | ki-gestützte ausschreibungssoftware für ingenieurbüros vergleich | 3 | 8,0 |
| `/branchen/beratung` | ausschreibung beratungsprojekte | 3 | 70,0 |
| `/ki-ausschreibungen` (Pillar) | ki für ausschreibungen · ki ausschreibung · ausschreibungen ki | ~800 | 78,6 |
| `/quellen` | keine Zielanfrage — Zitier-Asset | — | — |
| `/glossar` | keine Zielanfrage — Zitier-Asset | — | — |
| `/schwellenwerte` | keine Zielanfrage — Zitier-Asset | — | — |

Der Pillar `/ki-ausschreibungen` steht bewusst spät: Die zugehörigen Kopfbegriffe stehen auf
Position 74–90. Er gewinnt seine Kraft aus den internen Verweisen der Spokes, nicht umgekehrt.

### Seitenschablone

Jede Content-Seite folgt derselben Reihenfolge:

1. `H1` mit der Leitfrage oder dem Zielbegriff
2. Direktantwort in 40–60 Wörtern, vor jeder Verkaufsaussage
3. Faktenblock oder Tabelle mit sichtbarem Datenstand
4. Erklärender Hauptteil mit `H2`-Zwischenüberschriften, die echte Fragen abbilden
5. Abgrenzung: was das Produkt an dieser Stelle **nicht** leistet
6. FAQ mit drei bis fünf Einträgen aus dem Suchdatenbestand
7. Handlungsaufforderung auf das Pilot-Formular, vorbelegt mit dem Seitenkontext
8. Verweise auf Pillar und zwei thematisch benachbarte Seiten

## GEO-Anforderungen

Ein großer Teil der Suchanfragen sind vollständige Fragen, die auf Position 2–6 stehen und null
Klicks erzeugen — das sind KI-Antwortflächen. Dort gewinnt man nicht durch Rangfolge, sondern
durch Zitierbarkeit.

- **Strukturierte Daten** je Seite: `FAQPage`, `Article`, `BreadcrumbList`, dazu einmalig
  `Organization` und `SoftwareApplication`.
- **Datierte Fakten.** `/api/source-status` liefert den Datenstand je Quelle. Als Build-Snapshot
  auf `/quellen` ausgespielt und täglich neu gebaut, entsteht ein belegter, aktueller Faktenblock,
  den kein Wettbewerber in dieser Form hat.
- **Abgrenzung statt Superlative.** Bei „KI schreibt mein Angebot" wird ausdrücklich benannt, was
  nicht zum Umfang gehört — Preisempfehlung und Angebotsabgabe stehen bereits heute als
  Einschränkung auf der Landingpage. Quellen, die Grenzen benennen, werden von Sprachmodellen
  überdurchschnittlich zitiert.
- **`llms.txt`** wird auf die neue Seitenstruktur erweitert.

## Video

Das Video wird nachgeliefert, ein zweites folgt. Vorgesehen ist ein eigener Abschnitt unterhalb
des Nutzenteils und oberhalb der Preise.

Verbindlich unabhängig von der Quelle: **sichtbares Transkript auf der Seite** und
`VideoObject`-Auszeichnung. KI-Crawler werten kein Bewegtbild aus; ohne Transkript ist das Video
für die KI-Suche wertlos, mit Transkript wird es zur textstärksten Passage der Seite.

Offen: Selbstauslieferung oder YouTube. Selbst ausgeliefert läuft ohne CSP-Änderung, kostet aber
Bandbreite und bietet keine adaptive Qualität. YouTube (`youtube-nocookie.com`) braucht den
zusätzlichen `frame-src`-Eintrag. Die Video-Komponente wird so gebaut, dass beide Quellen
unterstützt werden; die Entscheidung fällt, sobald die Datei vorliegt, und blockiert keine andere
Arbeit.

## Bewusst nicht im Umfang

- **Seiten für kommunale Vergabestellen.** „beste ki-ausschreibungssoftware für kommunale
  beschaffer" (28 Impressionen, Position 7,7) und verwandte Anfragen bedienen die Gegenseite des
  Marktes. Das Produkt richtet sich an Bieter. Dafür zu bauen zieht Besucher an, die nicht kaufen.
- **Regionsseiten.** „öffentliche ausschreibungen nrw" und „…niedersachsen" stehen auf Position 4,
  jeweils mit einer einzigen Impression. Regionsseiten lohnen erst, wenn die Kernseiten stehen —
  vorher entstehen dünne, austauschbare Seiten.
- **Automatische Kalkulation, Preisempfehlung, Angebotsabgabe.** Nicht im Produktumfang, also auch
  nicht in den Texten.

## Reihenfolge

| Phase | Inhalt | Ergebnis |
|---|---|---|
| 1 | Prerendering, Meta je Route, Sitemap aus Routen, Schema-Grundgerüst, CSP-Entscheidung, Video mit Transkript | Seite ist für Crawler überhaupt lesbar |
| 2 | `/ausschreibungssuche-automatisieren`, `/vergleich`, `/semantische-suche-ausschreibungen` | die drei besten Positionen bekommen eine Zielseite |
| 3 | sechs Alternativen-Seiten | höchste Kaufabsicht wird bedient |
| 4 | fünf Branchenseiten, danach der Pillar | Breite und interne Verlinkung |
| 5 | `/quellen`, `/glossar`, `/schwellenwerte`, täglicher Rebuild | Zitier-Assets für KI-Suche |

Phase 1 ist Voraussetzung für alles Weitere: Ohne ausgeliefertes HTML wirkt kein einziger neuer
Text.

## Risiken

- **Prerendering bricht bestehende Seiten.** Komponenten, die auf `window` oder `document`
  zugreifen, laufen beim Build ins Leere. Gegenmaßnahme: bestehende Vitest-Suite bleibt grün, und
  jede Route wird nach dem Build per `curl` auf eigenen Title und nicht-leeren Body geprüft.
- **Wettbewerbervergleiche.** Aussagen über fremde Preise und Funktionen werden mit Datum und
  Quelle versehen und auf nachprüfbare, öffentlich einsehbare Angaben beschränkt.
- **Auslieferung auf `master` deployt live.** Vercel baut aus `master`. Die Arbeit läuft deshalb
  auf einem Feature-Branch; der Wechsel auf Produktion ist eine eigene, ausdrückliche
  Entscheidung.

## Messung

Search Console, monatlich, drei Größen je neuer Seite: Impressionen, Position, Klicks. Zusätzlich
nach jedem Deploy die technische Prüfung, dass jede Route ohne JavaScript eigenen Titel und
Textinhalt liefert.
