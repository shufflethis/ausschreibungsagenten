# Backend-Auftrag: Plugin-Einreichung freimachen

Zum Einfügen in eine Sitzung im Repo des MCP-/API-Backends (das, was
`api.ausschreibungsagenten.de` und `api.tender-agents.com` ausliefert).

Nicht das richtige Repo sind: `shufflethis/ausschreibungsagenten` (Website),
`shufflethis/tender-agents` (internationales Frontend),
`shufflethis/ausschreibungsagenten-mcp` (nur Doku),
`shufflethis/ausschreibungsagent` (Vorläufer: nur `ted.py`, `bund.py`,
`landes/`, keine MCP-Werkzeuge). Das richtige Repo erkennst du daran, dass
`grep -r search_tenders` anschlägt.

---

## Prompt

> Du arbeitest im Backend, das den MCP-Server hinter
> `api.ausschreibungsagenten.de` und `api.tender-agents.com` ausliefert.
>
> **Hintergrund:** Wir reichen die eingeschränkte Fläche
> `https://api.ausschreibungsagenten.de/mcp/open-data` als Plugin im
> OpenAI-Verzeichnis ein, unter der Marke **Ausschreibungsagenten**. Die
> Einreichung ist anonym, ohne API-Key. Drei Punkte stehen dem im Weg. Alle
> sind unten mit dem heute beobachteten Ist-Zustand belegt; bitte jeden vor der
> Änderung selbst nachstellen, statt mir zu glauben.
>
> **Nicht anfassen:** die bezahlte Fläche `/mcp`. Sie funktioniert und bleibt
> wie sie ist. Punkt 1 betrifft ausschließlich `/mcp/open-data`.
>
> ### 1. `fulltext_search` von `/mcp/open-data` entfernen
>
> ```bash
> curl -s -X POST https://api.ausschreibungsagenten.de/mcp/open-data \
>   -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
>   -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fulltext_search","arguments":{"query":"x"}}}'
> # heute:
> # "fulltext_search requires an API key with a paid tier (Pro/Agent).
> #  Free preview: use agentleads.search_tenders or request a key at .../entwickler"
> ```
>
> Vier Probleme in einer Antwort:
> - Das Werkzeug **funktioniert anonym nie** — und die Einreichung ist anonym.
>   Ein Reviewer läuft garantiert hinein.
> - Seine Beschreibung sagt das nicht („Full-text search over stored tender
>   titles, descriptions, and buyers.").
> - Die Fehlermeldung **bewirbt bezahlte Tarife mit Link**. Die Handelsregeln
>   von OpenAI untersagen das ausdrücklich, auch indirekt als Freemium-Upsell.
> - Sie nennt `agentleads.search_tenders` — einen internen Codenamen, den es
>   auf dem Server nicht gibt.
>
> Bitte das Werkzeug auf `/mcp/open-data` gar nicht erst registrieren. Danach
> muss ein Aufruf `Unknown tool: fulltext_search` liefern, nicht die
> Tarifmeldung. Auf `/mcp` bleibt es unverändert.
>
> Prüfe bei der Gelegenheit, ob `agentleads.` noch in weiteren Fehlertexten
> oder Meldungen steckt: `grep -rn "agentleads\."` über die Meldungstexte. Die
> Werkzeuge heißen nach außen `search_tenders`, `get_tender` und so weiter.
>
> ### 2. `countries` wirft bei falschem Argumenttyp einen nackten 500er
>
> ```bash
> curl -s -X POST https://api.ausschreibungsagenten.de/mcp/open-data \
>   -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
>   -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"countries","arguments":{"min_count":"viele"}}}'
> # heute: Internal Server Error   (reiner Text, kein JSON-RPC)
> ```
>
> Die Richtlinie verlangt: *„Errors, including unexpected ones, must be handled
> with clear messaging or fallback behaviors."* Erwartet wird eine
> JSON-RPC-Fehlerantwort, die sagt, welches Argument welchen Typ braucht. Bitte
> auch die übrigen Werkzeuge auf denselben Fall abklopfen — ich habe nur
> `countries` durchprobiert.
>
> ### 3. `get_tender` ohne `id` meldet irreführend „Tender not found"
>
> ```bash
> curl -s -X POST https://api.ausschreibungsagenten.de/mcp/open-data \
>   -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' \
>   -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_tender","arguments":{}}}'
> # heute: {"error":{"code":-32602,"message":"Tender not found"}}
> ```
>
> Gesucht wurde nichts — es fehlte das Pflichtargument. Die Meldung soll das
> benennen, damit ein Agent sich selbst korrigieren kann, statt eine falsche id
> zu vermuten.
>
> ### Optional, kein Blocker
>
> Kein einziges Werkzeug deklariert `outputSchema`. Der Einreichungs-Skill von
> OpenAI empfiehlt es ausdrücklich: Modelle verarbeiten die Ergebnisse damit
> verlässlicher. Falls es ohne großen Umbau geht, gern mitnehmen — sonst
> notieren und später.
>
> ### Eine Frage, die ich nicht beantworten kann
>
> Erzeugt `summarize_tender` auf der **anonymen** Fläche jemals eine *neue*
> Kurzfassung, oder liefert es dort ausschließlich gecachte aus? Wir haben in
> der Einreichung `readOnlyHint: true` angegeben. Das stimmt nur, wenn anonym
> nichts erzeugt und nichts geschrieben wird — sonst wäre es ein Schreibvorgang
> plus LLM-Lauf, und der Wert wäre falsch. Bitte im Code nachsehen und mir
> Bescheid geben.
>
> ### Abnahme
>
> Wenn alles sitzt, müssen diese drei Zeilen stimmen:
>
> ```bash
> A=https://api.ausschreibungsagenten.de/mcp/open-data
> H='-H Content-Type:application/json -H Accept:application/json,text/event-stream'
> # 1. fuenf Werkzeuge, fulltext_search nicht mehr dabei
> curl -s -X POST $A $H -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | grep -c fulltext_search   # 0
> # 2. Aufruf des entfernten Werkzeugs: "Unknown tool", keine Tarifwerbung
> curl -s -X POST $A $H -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"fulltext_search","arguments":{"query":"Fassade"}}}'
> # 3. sauberer Fehler statt 500er
> curl -s -X POST $A $H -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"countries","arguments":{"min_count":"viele"}}}'   # JSON-RPC-Fehler
> ```
>
> Sag mir am Ende, was du geändert hast und was du nicht anfassen wolltest.

---

## Warum das zusammen erledigt gehört

Die fertige `chatgpt-app-submission.json` liegt in
`shufflethis/ausschreibungsagenten-mcp` und führt **fünf** Werkzeuge. Solange
der Server sechs ausliefert, widerspricht die Einreichung dem Server — und das
ist die Art Mismatch, die einen Review kostet. Punkt 1 ist deshalb das
eigentliche Tor; 2 und 3 sind billig und fallen einem Reviewer auf, der die
Eingaben abklopft.

Zwei frühere Punkte sind entfallen, seit die Einreichung unter der deutschen
Marke läuft: `/mcp/open-data` existiert auf `api.ausschreibungsagenten.de`
bereits, und der Server meldet dort schon den richtigen Namen.

Vollständiger Zusammenhang: [`openai-plugin-einreichung.md`](openai-plugin-einreichung.md).
