# OpenAI-Plugin: Einreichungsmappe

Stand: 01.09.2026. **Eingereicht wird unter der deutschen Marke
Ausschreibungsagenten**, mit klarem DACH-Fokus. Die technische Plugin-Fläche
ist produktiv bereit; offen sind nur noch Draft, Domain-Token und Absenden im
OpenAI-Portal.

Die internationale Marke Tender Agents war kurz im Gespräch. Dagegen sprach:
Das Plugin hat gar keine deutsche Oberfläche — Werkzeugnamen, Beschreibungen
und Antworten sind ohnehin englisch. Der einzige Unterschied wäre der Name
gewesen, bei identischem Endpunkt und identischen Werkzeugen. **Zwei Listings
derselben Firma auf denselben Server** hätten wie ein Duplikat ausgesehen, und
die Richtlinie verbietet unter „Purpose and originality" ausdrücklich
*copycat designs* und *spam*. Der DACH-Bezug steckt jetzt in der Beschreibung
statt in einem zweiten Namen — das Modell wählt Plugins ohnehin über die
Werkzeugbeschreibungen, nicht über den Anzeigenamen.

Praktischer Nebeneffekt: die deutsche Fläche existiert bereits und der Server
meldet dort schon den richtigen Namen. Die drei übrigen Backend-Punkte wurden
am 01.09. produktiv ausgerollt. Auch die Challenge-Route ist vorbereitet; ihr
Token entsteht erst beim Anlegen des Drafts im OpenAI-Portal.

Quelle der Anforderungen: `developers.openai.com/plugins/app-guidelines`,
gelesen am 28.08.2026.

> **Namensänderung:** OpenAI nennt das inzwischen **Plugins**, nicht mehr Apps.
> Die alte URL `developers.openai.com/apps-sdk/app-developer-guidelines` leitet
> auf `/plugins/app-guidelines` um. Das Verzeichnis ist jetzt gemeinsam für
> ChatGPT **und Codex**.

## Was eingereicht wird

| Feld | Wert |
| --- | --- |
| Name | **Ausschreibungsagenten.de** |
| Untertitel | „German & EU public tenders" (26 von max. 30 Zeichen) |
| MCP-Endpunkt | `https://api.ausschreibungsagenten.de/mcp/open-data` — existiert, HTTP 200 |
| Transport | Streamable HTTP |
| Auth | keine erforderlich (anonym, 60 Anfragen/Stunde) |
| Datenschutz | https://www.ausschreibungsagenten.de/datenschutz |
| Nutzungsbedingungen | https://www.ausschreibungsagenten.de/agb |
| Support | hi@ausschreibungsagenten.de |
| Anbieter | yawusa UG (haftungsbeschränkt), Schliemannstraße 23, 10437 Berlin |

Zum Namen: die Richtlinie warnt vor *„overly generic names, especially
single-word dictionary terms that aren't explicitly tied to your brand"*.
„Ausschreibungsagenten.de" ist weder generisch noch ein Wörterbuchbegriff und
deckt sich mit der Domain — das trägt deutlich.

Die Schreibweise folgt dem eigenen [Brandkit](https://www.ausschreibungsagenten.de/brandkit):
großes A, mit „.de". Das „.de" signalisiert im weltweiten Verzeichnis
nebenbei den Markt.

Die Betreiberin ist bei beiden Marken dieselbe yawusa UG. Die Nennung einer
„Agentifizierung UG" im `TENDER-AGENTS-PLAN.md` ist überholt.

**Wichtig: eingereicht wird `/mcp/open-data`, nicht `/mcp`.** Die eingeschränkte
Fläche liefert nur aus Quellen mit einer vom Betreiber dafür bereitgestellten
Schnittstelle. Grund unten unter „Das Risiko".

## Werkzeuge

Fünf, alle read-only, alle mit vollständigen Annotationen.

| Werkzeug | Zweck |
| --- | --- |
| `search_tenders` | Suche nach Stichwort, Land, CPV, Frist, Auftragswert |
| `get_tender` | eine Bekanntmachung per id |
| `summarize_tender` | gekennzeichnete KI-Kurzfassung, de/en |
| `source_status` | Datenstand je Portal, optional gefiltert |
| `countries` | Verfahren je Land, optional ab Mindestzahl |

`fulltext_search` bleibt auf der bezahlten Fläche `/mcp`, wird auf der
eingereichten Fläche `/mcp/open-data` aber weder gelistet noch ausgeführt.

### Begründung der Annotationen

Die Richtlinie verlangt sie neuerdings ausdrücklich: *„provide a detailed
justification for each when submitting the plugin"*. Falsche Annotationen
nennt sie *„a common cause of rejection"*. Für alle Werkzeuge gilt derselbe
Satz Werte — hier die Begründung, die in die Einreichung gehört:

| Annotation | Wert | Begründung |
| --- | --- | --- |
| `readOnlyHint` | `true` | Alle Werkzeuge lesen ausschließlich. Es wird nichts angelegt, geändert oder gelöscht; außerhalb der Unterhaltung ändert sich kein Zustand. |
| `destructiveHint` | `false` | Folgt aus read-only: es gibt nichts, was zerstört werden könnte. |
| `idempotentHint` | `true` | Ein wiederholter Aufruf hat keine zusätzliche Wirkung und ändert keinen Zustand. Der Inhalt kann sich ändern, wenn der Index zwischen zwei Aufrufen wächst; das macht den Lesevorgang nicht weniger idempotent. |
| `openWorldHint` | `false` | OpenAI definiert den Wert **enger als die allgemeine MCP-Spec**: `true` nur, wenn ein Werkzeug *„can change publicly visible internet state or external third-party systems, such as sending emails or messages, posting/publishing content"*. Keines unserer Werkzeuge schreibt irgendwo hin — sie lesen aus unserem eigenen Index. Damit ist `false` nach ihrer eigenen Definition eindeutig richtig, nicht nur vertretbar. |

Die drei vom Import-Schema verlangten Begründungen (`readOnlyHint`,
`openWorldHint`, `destructiveHint`) stehen wortgleich in
`chatgpt-app-submission.json`. `idempotentHint` wird live vom MCP-Server
geliefert, ist aber kein Feld des aktuellen Import-Schemas.

## Anforderungen gegen unseren Stand

| Anforderung | Stand |
| --- | --- |
| Klare, zutreffende Werkzeugnamen | ✅ Server liefert `search_tenders` usw. ohne den internen `agentleads.`-Codenamen. Am 28.08. auch im öffentlichen MCP-Repo nachgezogen, dort stand er noch in der Werkzeugtabelle |
| Beschreibungen entsprechen dem Verhalten | ✅ fünf Werkzeuge; `summarize_tender` nennt auf dieser Fläche ausdrücklich Cache und Fallback |
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
| Keine Werbung, keine Abo-Bewerbung | ✅ `fulltext_search` ist nicht erreichbar; auch der Summary-Fallback enthält weder Tarif noch Signup-Link |
| Fehler mit klarer Meldung abgefangen | ✅ Eingaben werden vor jedem Werkzeug zentral gegen dessen veröffentlichtes Schema geprüft und als JSON-RPC `-32602` beantwortet |

## Die Formulardatei

Das Formular verlangt eine `chatgpt-app-submission.json`, erzeugt vom Skill
`chatgpt-app-submission` des OpenAI-Developers-Plugins. Der Skill liegt
öffentlich: `github.com/openai/plugins`. Die Datei wurde nach seinem
Output-Contract gebaut und liegt im MCP-Repo:

- `chatgpt-app-submission.json` — fünf Werkzeuge mit allen drei Hints und je
  einer Begründung, fünf positive und drei negative Testfälle
- `brand/plugin-icon-512.png` — quadratisch, 512×512, ohne Wortmarke

Die Datei verwendet das aktuelle Schema
`developers.openai.com/plugins/schemas/chatgpt-app-submission.v1.json`. Am
01.09. wurde sie dagegen validiert und automatisch mit dem Live-Server
verglichen: dieselben fünf Werkzeugnamen und dieselben Annotationen.

### Befunde aus der Prüfung, die der Skill verlangt

1. **Kein Werkzeug deklariert `outputSchema`.** Kein Blocker, aber der Skill
   verlangt den Hinweis: *„Add an outputSchema so models can use this tool's
   results more reliably."* Betrifft alle fünf. Lohnt sich, weil die Modelle
   die Ergebnisse dann verlässlicher weiterverarbeiten.
2. **`summarize_tender` trägt `readOnlyHint: true` nur, weil die Fläche anonym
   ist.** Im Code, in Tests und live geprüft: anonyme Aufrufer bekommen
   ausschließlich gecachte Kurzfassungen. Ohne Cache verweist eine klare
   Fehlermeldung auf `get_tender`; es gibt weder einen LLM-Lauf noch einen
   Schreibvorgang.
3. **Keine sensiblen Eingabefelder.** Kein Werkzeug fragt nach Zugangsdaten,
   Ausweisnummern, Gesundheits- oder Zahlungsdaten. Kein Standortfeld.
4. **Werkzeugnamen decken sich mit dem Verhalten.** `fulltext_search` gehört
   nicht mehr zur anonymen Open-Data-Werkzeugliste.

### Icon

Verwendet wird die **wortmarkenfreie A-Marke** aus `public/brand/logo-mark.png`
auf dem Markenhintergrund, 512×512.

Naheliegend wäre `web-app-manifest-512x512.png` gewesen — das vorhandene
App-Icon. Zwei Gründe dagegen:

1. Es trägt einen Schriftzug. Verzeichnisse zeigen Icons in etwa 48 bis 64
   Pixel an; der Schriftzug wäre dort unlesbarer Brei. Icons in
   App-Verzeichnissen sind eine Marke, keine Wortmarke.
2. Der Schriftzug lautet „AusschreibungsAgenten" — **genau die Schreibweise,
   die das eigene [Brandkit](https://www.ausschreibungsagenten.de/brandkit)
   unter „Bitte nicht" führt** (richtig wäre „Ausschreibungsagenten.de").

Die gewählte A-Marke auf Nachtblau `#050b1a` entspricht dagegen der
Brandkit-Regel „Dunkler Grund, blaue Akzente: Die Marke lebt auf Nachtblau".

> **Nebenbefund für die Website:** Dass `web-app-manifest-512x512.png` und
> `apple-touch-icon.png` die verbotene Schreibweise tragen, betrifft nicht nur
> diese Einreichung — das ist das Icon, das Besucher beim Anlegen einer
> Verknüpfung auf dem Homescreen sehen. Nicht dringend, aber irgendwann
> nachziehen.

## Der behobene Blocker: `fulltext_search`

Vor dem Fix antwortete das Werkzeug auf der anonymen Fläche:

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

Seit 01.09. ist `fulltext_search` von `/mcp/open-data` ganz entfernt. Ein
direkter Aufruf liefert `Unknown tool: fulltext_search`; fünf Werkzeuge, die
anonym funktionieren, werden gelistet. Auf `/mcp` (bezahlte Fläche) blieb es
unverändert.

Das liegt im privaten AgentLeads-Backend, nicht in diesem Repo und nicht im
öffentlichen MCP-Repo — beide enthalten nur Doku und Discovery-Metadaten.

## Fehlerbehandlung

Richtlinie: *„Errors, including unexpected ones, must be handled with clear
messaging or fallback behaviors."* Am 28.08. auf `/mcp/open-data` abgeklopft.
Sauber sind: unbekanntes Werkzeug (`Unknown tool: …`), unsinniger Ländercode
(leeres Ergebnis statt Fehler), unbekannte Tender-id (`Tender not found`).

Die beiden damaligen Lücken sind behoben:

1. **`countries` mit falschem Argumenttyp** (`min_count: "viele"`) liefert jetzt
   JSON-RPC `-32602`: `Invalid argument 'min_count': expected integer.`
2. **`get_tender` ohne `id`** liefert JSON-RPC `-32602`:
   `Missing required argument: id`.

Die gemeinsame Ursache war fehlende Schema-Prüfung an der MCP-Grenze. Deshalb
wurde nicht nur für diese Beispiele gepatcht: Alle veröffentlichten
Werkzeugschemas werden nun vor der Dispatch-Logik an einer Stelle geprüft.

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

## Technischer Stand und Restpunkte

Am 01.09. gegen Produktion geprüft und erledigt:

1. `/mcp/open-data` listet exakt fünf Werkzeuge, ohne `fulltext_search`.
2. Ungültige und fehlende Argumente liefern klare JSON-RPC-Fehler.
3. Die Quellengrenze gilt für Suche, Einzelabruf, Summary, Länderaggregation
   und Quellenstatus. Auch eine bekannte ID aus einer HTML-Quelle liefert auf
   dieser Fläche nur `Tender not found`.
4. Die Challenge-Route und die Compose-Weitergabe von
   `OPENAI_APPS_CHALLENGE` sind vorbereitet.
5. Die anonyme Fläche ignoriert auch einen mitgesendeten Pro-Bearer-Token und
   bleibt dadurch tatsächlich read-only.

Offen bleibt nur der Portalablauf: Draft anlegen, erzeugten Challenge-Token in
die Produktions-`.env` übernehmen, App-Container neu erstellen, Domain
verifizieren und absenden. Ohne gesetzten Token liefert die Route absichtlich
404.

Die beiden Punkte zur internationalen Marke — `/mcp/open-data` auf
`api.tender-agents.com` und ein markengerechtes `serverInfo` dort — sind mit
der Entscheidung für die deutsche Marke **entfallen**.

Dazu, unabhängig von der Einreichung: die **rechtliche Einordnung** der zwölf
HTML-Quellen, falls das Plugin später auf das Vollprodukt erweitert werden soll.

## Was zu erwarten ist

Aus dem OpenAI-Entwicklerforum, gelesen am 28.08.2026: Reviews dauern
mehrere Wochen (ein Bericht: über sechs), Anforderungen ändern sich währenddessen,
und Ablehnungen kommen oft ohne konkrete Begründung. Häufigste konkrete
Ablehnungsgründe in den Berichten: Business-Verifizierung und Bildmaterial —
beides bei uns erledigt beziehungsweise nicht anwendbar.

## So wird eingereicht

Quelle: `developers.openai.com/plugins/deploy/submission`, gelesen am 28.08.2026.
Eingereicht wird im **Plugin Submission Portal** der OpenAI Platform, nicht per
E-Mail und nicht über das Verzeichnis.

### Reihenfolge

1. **Backend bereit — erledigt.** Siehe
   [`backend-auftrag-openai-plugin.md`](backend-auftrag-openai-plugin.md). Das
   Portal scannt jetzt fünf anonyme, read-only Werkzeuge.
2. **Rolle prüfen.** Der Einreichende braucht in der Organisation die Berechtigung
   **Apps Management = Write**. Organisationsinhaber haben sie automatisch,
   alle anderen nicht. Einzustellen unter den Rollen-Einstellungen der Platform.
3. **Entwickleridentität auswählen.** Die Verifizierung der yawusa UG ist erledigt;
   im Formular muss sie im Feld **Developer Identity** ausgewählt werden. Wichtig:
   aus **derselben Organisation** einreichen, in der verifiziert wurde — sonst
   findet das Formular die Identität nicht.
4. **Draft anlegen:** „Create plugin" → Typ **With MCP** (wir haben einen
   MCP-Server, keine Skills, keine UI).
5. **Domain-Verifizierung** — siehe unten, das ist der zweite Backend-Schritt.
6. **Scan Tools** laufen lassen, entdeckte Werkzeuge und Metadaten prüfen.
7. Formular füllen, Attestierungen bestätigen, **Submit for Review**.

Nach der Freigabe wird **nicht automatisch veröffentlicht** — du entscheidest im
Portal, wann das Plugin live geht.

### Domain-Verifizierung

Das Portal erzeugt einen Token, der unter dieser Adresse abrufbar sein muss:

```
https://api.ausschreibungsagenten.de/.well-known/openai-apps-challenge
```

Ohne gesetzten Portal-Token: absichtlich 404. Die Route ist implementiert,
getestet und produktiv erreichbar; Docker Compose reicht
`OPENAI_APPS_CHALLENGE` in den App-Container durch. Die Regel lautet
„MCP-Hostname oder ein **Parent**-Hostname".

- `api.ausschreibungsagenten.de` — der Standardweg, **Backend**.
- `ausschreibungsagenten.de` — wäre als Parent zulässig und liegt bei Vercel,
  leitet aber vollständig auf `www` um. Ein Redirect statt des nackten Tokens
  ist riskant, und Pfade werden laut Doku ignoriert.
- `www.ausschreibungsagenten.de` — **scheidet aus**: `www` ist ein Geschwister
  von `api`, kein Parent.

Also: Backend. Der Endpunkt muss **nur den Token** zurückgeben — kein JSON,
keine Liste, kein Redirect. Der Token existiert erst, wenn der Draft angelegt
ist; das ist deshalb ein Zwischenschritt, kein Vorbereitungsschritt.

### Felder, die die Datei nicht abdeckt

Die `chatgpt-app-submission.json` füllt Listing, Annotationen und Testfälle
vor. Diese Felder verlangt das Formular zusätzlich:

**Kurzbeschreibung** (knapp halten):

> Search current public tenders from Germany, the EU and the UK — with the
> deadline, CPV code and buyer for every hit.

**Starter-Prompts** — sollen realistische Arbeitsabläufe zeigen:

> - „Find facade tenders in Germany that close in the next three weeks."
> - „Which IT procurement notices are open in Austria right now, and what are the deadlines?"
> - „Summarise this tender and tell me whether the award is on price alone."
> - „Which procurement portals do you cover, and how current is the data?"

**Release Notes** (Erstabgabe):

> Initial submission. MCP-only plugin, no UI, no authentication. Read-only
> search over public procurement notices from five sources with official
> interfaces: TED (all 27 EU member states), service.bund.de and Datenservice
> Öffentlicher Einkauf (German federal, above and below threshold), Find a
> Tender and Contracts Finder (UK). Five tools, all read-only. No test
> credentials needed — all tools are callable anonymously; summaries return a
> cached result or a clear fallback to the full notice.

**Verfügbarkeit (Länder):** Empfehlung **Deutschland, Österreich, Schweiz**.
Die Richtlinie sagt: nur dort auswählen, wo *„publisher, product, support
process, and legal terms are ready"*. AGB und Datenschutz sind deutsch, der
Support ist deutschsprachig. Später erweitern ist möglich, umgekehrt sieht es
schlecht aus.

**CSP:** entfällt — die verlangt das Formular nur für Plugins mit UI.

**Demo-Zugangsdaten:** entfallen, der Server ist anonym nutzbar. Genau das
nennt die Doku als häufige Ablehnungsursache bei anderen.

### Zwei Sätze aus der Doku, die uns betreffen

> *„You cannot submit a plugin that references an existing, already-published
> integration."*

Betrifft uns nicht: Der Server steht zwar in der MCP-Registry und auf Smithery,
ist aber keine veröffentlichte OpenAI-Integration. Eingereicht wird die
Server-URL direkt.

> *„Add output schemas when they help reviewers and models understand what the
> tool returns."*

Damit ist der `outputSchema`-Punkt aus der Skill-Prüfung nicht nur eine
Empfehlung des Skills, sondern steht auch in der Einreichungsdoku. Weiterhin
kein Blocker.

## Prüfbefehle

```bash
# 1. Werkzeugliste der eingereichten Flaeche — genau fuenf, ohne fulltext_search
curl -sX POST https://api.ausschreibungsagenten.de/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# 2. Nur die fuenf offiziellen Quellen
curl -sX POST https://api.ausschreibungsagenten.de/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"source_status","arguments":{}}}'

# 3. Entferntes Werkzeug: "unknown tool", keine Tarifwerbung
curl -sX POST https://api.ausschreibungsagenten.de/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fulltext_search","arguments":{"query":"Fassade"}}}'

# 4. Sauberer Fehler statt 500er
curl -sX POST https://api.ausschreibungsagenten.de/mcp/open-data \
  -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"countries","arguments":{"min_count":"viele"}}}'
```

Die internationale Fläche `api.tender-agents.com/mcp` bleibt bestehen und
funktioniert; sie ist nur nicht Gegenstand dieser Einreichung.
