# OpenAI-Plugin: Einreichungsmappe

Stand: 28.08.2026. **Eingereicht wird unter der internationalen Marke Tender
Agents**, nicht unter Ausschreibungsagenten — das Verzeichnis ist weltweit, und
„Ausschreibungsagenten Tender Search" ist für englischsprachige Nutzer kein
lesbarer Name.

Diese Entscheidung kostet drei Backend-Änderungen, siehe „Offen". Ohne sie ist
die Einreichung unter der neuen Marke nicht möglich: `api.tender-agents.com`
liefert die eingereichte Fläche heute nicht aus und meldet sich mit dem
deutschen Namen.

Quelle der Anforderungen: `developers.openai.com/plugins/app-guidelines`,
gelesen am 28.08.2026.

> **Namensänderung:** OpenAI nennt das inzwischen **Plugins**, nicht mehr Apps.
> Die alte URL `developers.openai.com/apps-sdk/app-developer-guidelines` leitet
> auf `/plugins/app-guidelines` um. Das Verzeichnis ist jetzt gemeinsam für
> ChatGPT **und Codex**.

## Was eingereicht wird

| Feld | Wert |
| --- | --- |
| Name | **Tender Agents** |
| MCP-Endpunkt | `https://api.tender-agents.com/mcp/open-data` — **existiert noch nicht, siehe „Offen"** |
| Transport | Streamable HTTP |
| Auth | keine erforderlich (anonym, 60 Anfragen/Stunde) |
| Datenschutz | https://www.tender-agents.com/privacy |
| Nutzungsbedingungen | https://www.tender-agents.com/terms |
| Support | hi@tender-agents.com |
| Anbieter | yawusa UG (haftungsbeschränkt), Schliemannstraße 23, 10437 Berlin |

Die Betreiberin ist bei beiden Marken dieselbe — laut Imprint von
tender-agents.com die yawusa UG. Die Nennung einer „Agentifizierung UG" im
`TENDER-AGENTS-PLAN.md` ist überholt.

Zum Namen: die Richtlinie warnt vor *„overly generic names, especially
single-word dictionary terms that aren't explicitly tied to your brand"*.
„Tender Agents" ist zweiteilig und deckt sich mit Domain und
Organization-Eintrag — das trägt.

**Wichtig: eingereicht wird `/mcp/open-data`, nicht `/mcp`.** Die eingeschränkte
Fläche liefert nur aus Quellen mit einer vom Betreiber dafür bereitgestellten
Schnittstelle. Grund unten unter „Das Risiko".

## Werkzeuge

Sechs, alle read-only, alle mit vollständigen Annotationen. Nach dem Fix unten
sollen es **fünf** sein.

| Werkzeug | Zweck |
| --- | --- |
| `search_tenders` | Suche nach Stichwort, Land, CPV, Frist, Auftragswert |
| `get_tender` | eine Bekanntmachung per id |
| `summarize_tender` | gekennzeichnete KI-Kurzfassung, de/en |
| `source_status` | Datenstand je Portal, optional gefiltert |
| `countries` | Verfahren je Land, optional ab Mindestzahl |
| ~~`fulltext_search`~~ | **entfernen** — scheitert anonym, siehe unten |

### Begründung der Annotationen

Die Richtlinie verlangt sie neuerdings ausdrücklich: *„provide a detailed
justification for each when submitting the plugin"*. Falsche Annotationen
nennt sie *„a common cause of rejection"*. Für alle Werkzeuge gilt derselbe
Satz Werte — hier die Begründung, die in die Einreichung gehört:

| Annotation | Wert | Begründung |
| --- | --- | --- |
| `readOnlyHint` | `true` | Alle Werkzeuge lesen ausschließlich. Es wird nichts angelegt, geändert oder gelöscht; außerhalb der Unterhaltung ändert sich kein Zustand. |
| `destructiveHint` | `false` | Folgt aus read-only: es gibt nichts, was zerstört werden könnte. |
| `idempotentHint` | `true` | Dieselben Argumente liefern dieselbe Antwort. Ein wiederholter Aufruf hat keine zusätzliche Wirkung. Dass der Index zwischen zwei Aufrufen wächst, ändert daran nichts — die Wirkung des Aufrufs bleibt null. |
| `openWorldHint` | `false` | OpenAI definiert den Wert **enger als die allgemeine MCP-Spec**: `true` nur, wenn ein Werkzeug *„can change publicly visible internet state or external third-party systems, such as sending emails or messages, posting/publishing content"*. Keines unserer Werkzeuge schreibt irgendwo hin — sie lesen aus unserem eigenen Index. Damit ist `false` nach ihrer eigenen Definition eindeutig richtig, nicht nur vertretbar. |

Diese Begründungen stehen wortgleich in `chatgpt-app-submission.json`.

## Anforderungen gegen unseren Stand

| Anforderung | Stand |
| --- | --- |
| Klare, zutreffende Werkzeugnamen | ✅ Server liefert `search_tenders` usw. ohne den internen `agentleads.`-Codenamen. Am 28.08. auch im öffentlichen MCP-Repo nachgezogen, dort stand er noch in der Werkzeugtabelle |
| Beschreibungen entsprechen dem Verhalten | ⚠️ gilt für fünf Werkzeuge; `fulltext_search` nicht, siehe Blocker |
| Korrekte Annotationen | ✅ vollständig gesetzt, Begründung siehe oben; Karte wird aus der Werkzeugliste erzeugt und kann nicht abweichen |
| Minimale, zweckgebundene Eingaben | ✅ keine personenbezogenen Felder, keine Standortfelder |
| Antwortminimierung | ✅ keine Session-, Trace- oder Request-IDs. `source_status` gibt Zeitstempel zurück — das ist der Zweck des Werkzeugs (Datenstand), nicht Telemetrie |
| Keine zusätzlichen Login-Schritte | ✅ anonym nutzbar — ihr häufigster Ablehnungsgrund entfällt |
| Testzugang mit Beispieldaten | ✅ nicht nötig, weil kein Auth. Die Richtlinie verlangt Testzugänge nur für authentifizierte Server |
| Veröffentlichte Datenschutzerklärung | ✅ |
| Keine Zahlungsdaten, Gesundheitsdaten, Ausweise, Zugangsdaten | ✅ wir erheben nichts davon |
| Kein Zugriff auf Chatverläufe | ✅ nur die übergebenen Argumente |
| Support-Kontakt | ✅ |
| Entwickler-Verifizierung | ✅ Yawusa UG registriert |
| Screenshots | ✅ **entfallen** — die Richtlinie sagt: *„Don't submit screenshots for plugins without UI."* Unser Server hat keine UI-Komponenten |
| Keine Werbung, keine Abo-Bewerbung | ⚠️ siehe Blocker — die Fehlermeldung von `fulltext_search` bewirbt Tarife |
| Fehler mit klarer Meldung abgefangen | ⚠️ zwei Lücken, siehe „Fehlerbehandlung" |

## Die Formulardatei

Das Formular verlangt eine `chatgpt-app-submission.json`, erzeugt vom Skill
`chatgpt-app-submission` des OpenAI-Developers-Plugins. Der Skill liegt
öffentlich: `github.com/openai/plugins`. Die Datei wurde nach seinem
Output-Contract gebaut und liegt im MCP-Repo:

- `chatgpt-app-submission.json` — fünf Werkzeuge mit allen drei Hints und je
  einer Begründung, fünf positive und drei negative Testfälle
- `brand/tender-agents-icon-512.png` — quadratisch, 512×512, ohne Wortmarke

**Die Datei führt fünf Werkzeuge, der Server liefert sechs.** Sie passt erst,
wenn `fulltext_search` von der Fläche genommen ist. Vorher nicht hochladen.

### Befunde aus der Prüfung, die der Skill verlangt

1. **Kein Werkzeug deklariert `outputSchema`.** Kein Blocker, aber der Skill
   verlangt den Hinweis: *„Add an outputSchema so models can use this tool's
   results more reliably."* Betrifft alle sechs. Lohnt sich, weil die Modelle
   die Ergebnisse dann verlässlicher weiterverarbeiten.
2. **`summarize_tender` trägt `readOnlyHint: true` nur, weil die Fläche anonym
   ist.** Anonyme Aufrufer bekommen ausschließlich gecachte Kurzfassungen. Ließe
   sich dort eine neue erzeugen, wäre das ein Schreibvorgang plus LLM-Lauf, und
   der Wert wäre falsch. Vor dem Absenden gegen das Backend gegenprüfen.
3. **Keine sensiblen Eingabefelder.** Kein Werkzeug fragt nach Zugangsdaten,
   Ausweisnummern, Gesundheits- oder Zahlungsdaten. Kein Standortfeld.
4. **Werkzeugnamen decken sich mit dem Verhalten** — mit der bekannten Ausnahme
   `fulltext_search`, dessen Beschreibung verschweigt, dass es anonym scheitert.

### Icon

`web-app-manifest-512x512.png` von tender-agents.com wäre **ungeeignet**: es
trägt den Schriftzug „AusschreibungsAgenten — WIR FINDEN. DU GEWINNST." und
hätte den deutschen Namen ins weltweite Verzeichnis getragen. Verwendet wird
stattdessen die wortmarkenfreie A-Marke auf dem Markenhintergrund.

## Der offene Blocker: `fulltext_search`

Anonym aufgerufen — und die Einreichung ist anonym — antwortet das Werkzeug:

```
fulltext_search requires an API key with a paid tier (Pro/Agent).
Free preview: use agentleads.search_tenders or request a key at …/entwickler
```

Vier Verstöße in einer Zeile:

1. **Es funktioniert in der eingereichten Konfiguration nie.** Ein Reviewer
   läuft garantiert hinein. Richtlinie: *„Plugins must behave predictably and
   reliably."*
2. **Die Beschreibung sagt das nicht** („Full-text search over stored tender
   titles, descriptions, and buyers."). Richtlinie: *„If a tool's behavior is
   unclear or incomplete from its description, the plugin may be rejected."*
3. **Die Fehlermeldung bewirbt bezahlte Tarife mit Link.** Richtlinie:
   *„Selling digital products or services — including subscriptions … whether
   offered directly or indirectly (for example, through freemium upsells)"* und
   *„must not display subscription plans … or promote upgrades."*
4. **Sie nennt `agentleads.search_tenders`** — den internen Codenamen, den es
   auf dem Server nicht gibt. Der Reviewer sieht einen Werkzeugnamen ins Leere
   zeigen.

**Empfehlung: `fulltext_search` von `/mcp/open-data` ganz entfernen.** Fünf
Werkzeuge, die alle funktionieren, sind besser als sechs, von denen eines immer
scheitert. Auf `/mcp` (bezahlte Fläche) bleibt es unverändert.

Das liegt im privaten AgentLeads-Backend, nicht in diesem Repo und nicht im
öffentlichen MCP-Repo — beide enthalten nur Doku und Discovery-Metadaten.

## Fehlerbehandlung

Richtlinie: *„Errors, including unexpected ones, must be handled with clear
messaging or fallback behaviors."* Am 28.08. auf `/mcp/open-data` abgeklopft.
Sauber sind: unbekanntes Werkzeug (`Unknown tool: …`), unsinniger Ländercode
(leeres Ergebnis statt Fehler), unbekannte Tender-id (`Tender not found`).

Zwei Lücken, beide im Backend:

1. **`countries` mit falschem Argumenttyp** (`min_count: "viele"`) antwortet mit
   nacktem `Internal Server Error` — kein JSON-RPC, kein Hinweis, was falsch
   war. Ein Reviewer, der die Eingaben abklopft, landet hier.
2. **`get_tender` ohne `id`** antwortet `Tender not found`. Das ist irreführend:
   gesucht wurde nichts, es fehlte das Pflichtargument. Richtig wäre eine
   Meldung, die das benennt.

## Das Risiko, das man kennen muss

Die Richtlinie schließt *„unauthorized scraping or unofficial API connectors"*
aus. Von den 17 Quellen des Vollprodukts haben **fünf** eine offizielle
Schnittstelle; **zwölf** werden aus HTML gelesen:

- **Offiziell:** TED (`api.ted.europa.eu`), service.bund.de (RSS),
  Datenservice Öffentlicher Einkauf (`/api/notices`), GB Find a Tender (OCDS),
  GB Contracts Finder (OCDS).
- **HTML-Parsing:** DTVP, Vergabeportal BW, Bremen, Baden-Württemberg, Hessen,
  Rhein-Neckar, Mecklenburg-Vorpommern, Sachsen, Bayern, NRW, Rheinland-Pfalz,
  RIB.

Deshalb die eingeschränkte Fläche. Sie ist kein Rumpf: alle 27 EU-Länder über
TED, der deutsche Bund, deutsche Ober- **und** Unterschwelle über den
Datenservice, dazu UK ober- und unterschwellig. Geprüft am 28.08.: alle fünf
Quellen live, `interface: official_api`.

Die zwölf Landesportale bleiben im bezahlten Produkt, wo die Kundenbeziehung
direkt ist. Ob deren Nutzungsbedingungen das Lesen erlauben, ist eine
rechtliche Frage und in dieser Mappe **nicht** beantwortet.

### Die zweite Klausel im selben Absatz

Direkt hinter dem Scraping-Verbot steht: *„We cannot approve plugins that
primarily function as unofficial connectors to third-party services, **including
pass-through intermediary software layers**."* Ein Reviewer kann die
Open-Data-Fläche genau so lesen — fünf öffentliche Quellen, durchgereicht.

Das Gegenargument gehört ausdrücklich in die Einreichung, sonst zählt der erste
Eindruck:

- **Ein Schema über fünf unvereinbare Formate.** TED liefert sein eigenes
  Format, service.bund.de RSS, der Datenservice eigenes JSON, die beiden
  britischen Quellen OCDS. Wir normalisieren auf eine Struktur mit CPV,
  Leistungsort, NUTS, Frist, Auftragswert, Losen, Zuschlagskriterien.
- **Quellenübergreifend beantwortbar.** „Welche deutschen Fassaden-Verfahren
  laufen in den nächsten drei Wochen aus?" beantwortet keine der fünf Quellen
  allein — TED kennt die deutsche Unterschwelle nicht, der Datenservice nicht
  die anderen 26 EU-Länder.
- **Relevanz mit nachvollziehbaren Gründen**, nicht nur Volltextsuche.
- **Gekennzeichnete KI-Kurzfassungen**, gecacht, mit dem ausdrücklichen Hinweis,
  dass die Originalbekanntmachung maßgeblich ist.
- **Datenstand je Quelle** über `source_status` — wir behaupten keine
  Vollständigkeit, sondern weisen sie nach.
- **Jeder Treffer verlinkt die Originalbekanntmachung.** Wir ersetzen die Quelle
  nicht, wir führen zu ihr.

## Was das Plugin nicht kann

Ihre Handelsregeln erlauben nur physische Waren — **keine digitalen Produkte,
keine Abonnements**, Checkout ausschließlich extern. Das Plugin kann den Pro-
oder Agent-Tarif also nicht verkaufen, und es darf Tarife auch nicht anzeigen
oder bewerben. Es ist ein Entdeckungs- und Lead-Kanal.

## Offen

Alles im privaten AgentLeads-Backend. Am 28.08. gegen die Live-Hosts geprüft.

**Aus der Markenentscheidung:**

1. **`/mcp/open-data` auf `api.tender-agents.com` ausliefern.** Heute
   antwortet der Host dort mit einem nginx-404; nur `/mcp` ist erreichbar.
   Ohne diesen Endpunkt gibt es nichts einzureichen.
2. **`serverInfo` je Host brandgerecht melden.** `api.tender-agents.com/mcp`
   antwortet heute mit `name: "ausschreibungsagenten"` und
   `title: "Ausschreibungsagenten Tender Search"`. MCP-Clients zeigen diesen
   Titel den Nutzern an — der deutsche Name stünde also genau dort, wo wir ihn
   loswerden wollten. Auf dem internationalen Host gehört „Tender Agents"
   hinein.

**Unabhängig von der Marke:**

3. **`fulltext_search`** von `/mcp/open-data` entfernen. Der Ablehnungsgrund.
4. **`countries`** darf bei falschem Argumenttyp keinen nackten
   `Internal Server Error` liefern.
5. **`get_tender`** ohne `id` soll das fehlende Argument benennen, nicht
   `Tender not found` melden.

Dazu, unabhängig von der Einreichung: die **rechtliche Einordnung** der zwölf
HTML-Quellen, falls das Plugin später auf das Vollprodukt erweitert werden soll.

## Was zu erwarten ist

Aus dem OpenAI-Entwicklerforum, gelesen am 28.08.2026: Reviews dauern
mehrere Wochen (ein Bericht: über sechs), Anforderungen ändern sich währenddessen,
und Ablehnungen kommen oft ohne konkrete Begründung. Häufigste konkrete
Ablehnungsgründe in den Berichten: Business-Verifizierung und Bildmaterial —
beides bei uns erledigt beziehungsweise nicht anwendbar.

## Prüfbefehle

Nach dem Umzug auf die internationale Marke gegen `api.tender-agents.com`
laufen zu lassen. Bis Punkt 1 erledigt ist, antwortet der Host dort mit 404 —
das ist derzeit der erwartete Befund.

```bash
# 1. Gibt es die eingereichte Flaeche ueberhaupt? (heute: 404)
curl -sX POST https://api.tender-agents.com/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# 2. Meldet sich der Server unter der richtigen Marke?
#    Erwartet nach dem Fix: title "Tender Agents", nicht "Ausschreibungsagenten ..."
curl -sX POST https://api.tender-agents.com/mcp \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"p","version":"1"}}}'

# 3. Nur die fuenf offiziellen Quellen
curl -sX POST https://api.tender-agents.com/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"source_status","arguments":{}}}'

# 4. Der Blocker: muss nach dem Fix "unknown tool" liefern, nicht die Tarifwerbung
curl -sX POST https://api.tender-agents.com/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fulltext_search","arguments":{"query":"facade"}}}'
```

Die deutsche Fläche `api.ausschreibungsagenten.de/mcp/open-data` bleibt
unverändert bestehen und funktioniert; sie ist nur nicht mehr die eingereichte.
