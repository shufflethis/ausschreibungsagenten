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

Bewusst ohne Klickprognose. Aus Impressionen und Durchschnittsposition lässt sich eine
Klickzahl nur über angenommene CTR-Kurven herleiten, die für diese Nische nicht belegt sind — eine
solche Zahl steht in einer Spec-Tabelle schnell als Zusage da, obwohl sie geraten ist. Gemessen
wird an der tatsächlichen Entwicklung: Klicks, Impressionen und Position je neuer Seite, monatlich
in der Search Console, Ausgangswert 48 Klicks bei 6.133 Impressionen über 90 Tage.

## Technisches Fundament

**Prerendering über einen eigenen Build-Schritt.** Nach `vite build` rendert ein Node-Skript jede
Route mit `renderToString`, `StaticRouter` und `HelmetProvider` und schreibt das Ergebnis als
`dist/<route>/index.html`. React, React Router, die bestehenden Vitest-Tests und das Vercel-Setup
bleiben unverändert.

Der naheliegende Fertigbaustein `vite-react-ssg` scheidet aus, geprüft am 2026-08-11:

```
npm view vite-react-ssg version peerDependencies
→ 0.9.2, react-router-dom: ^6.14.1
installiert: react-router-dom 7.18.1, react 19.2.4, vite 7.3.6
```

React 19 und Vite 7 wären abgedeckt, React Router 7 nicht — das Paket ist bei Router 6 stehen
geblieben, auch in der neuesten Version. Ein Downgrade des Routers wäre ein Rückschritt am
laufenden Routing, nur um ein Hilfspaket zu bedienen. Die benötigten Bausteine liegen dagegen
bereits im Projekt: `StaticRouter` ist in der installierten `react-router-dom@7.18.1` vorhanden,
`react-helmet-async` ist ebenfalls schon Abhängigkeit. Der eigene Build-Schritt kostet damit rund
fünfzig Zeilen und keine neue Abhängigkeit.

Zweite Möglichkeit, falls sich Komponenten der Server-Ausführung entziehen: ein
Headless-Browser-Durchlauf über die gebaute Anwendung (`@prerenderer/rollup-plugin`). Der ist
Router-unabhängig, verlangt aber Chromium im Vercel-Build und verlängert ihn deutlich. Nur als
Rückfallebene vorgesehen.

Konkret:

- `src/App.jsx` behält seine Routen; die Routenliste wird zusätzlich als Datei exportiert, damit
  Build-Schritt, Sitemap und interne Navigation dieselbe Quelle nutzen.
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

Priorisiert nach **Impressionen zuerst, Position als Beschleuniger** — nicht nach Wunschbegriffen.

Wichtig beim Lesen der Tabelle: Eine Durchschnittsposition über wenige Impressionen ist Rauschen.
`/alternativen/tenderflow` steht auf Position 1,0 — bei **einer** Impression. `/vergleich` zeigt
Position 2,0 bei 27 Impressionen. Solche Werte begründen keine Reihenfolge. Die Alternativen- und
Vergleichsseiten werden gebaut, weil die Kaufabsicht dahinter die höchste im gesamten Datensatz
ist, nicht weil die Positionszahl gut aussieht.

Belastbar ist die Reihenfolge erst ab etwa 200 Impressionen. Danach sind die Volumenträger:
`/ausschreibungssuche-automatisieren` (~900), `/ki-angebot-ausschreibung` (~600),
`/ausschreibungen-benachrichtigung` (~400) und `/semantische-suche-ausschreibungen` (292, größte
Einzelanfrage des Kontos).

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

**Sonderfall `/semantische-suche-ausschreibungen`.** Mit 292 Impressionen die größte Einzelanfrage
des Kontos — aber das Produkt betreibt keine semantische Vektorsuche, sondern nachvollziehbares
Abgleichen über CPV-Codes, Stichwörter, Ausschlüsse, Leistungsort, Auftragswert und Frist mit
Einzelbegründung je Treffer. Die Seite darf deshalb nichts anderes behaupten. Ihre Leitfrage
lautet: was „semantische Suche" bei Ausschreibungen bedeutet, wo sie an Vergabesprache scheitert
und warum hier begründete Einzelkriterien stehen. Diese Kante ist kein Nachteil, sondern der
Grund, aus dem die Seite überhaupt zitierfähig wird — sie folgt derselben Regel wie
„Abgrenzung statt Superlative" weiter unten.

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
