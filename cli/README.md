# ausschreibungsagenten

CLI für öffentliche Ausschreibungen aus 17 Vergabequellen in Deutschland, der
EU und dem Vereinigten Königreich. Sie liest die öffentliche API von
[ausschreibungsagenten.de](https://www.ausschreibungsagenten.de/entwickler) —
ohne Anmeldung, ohne Abhängigkeiten.

```bash
npx ausschreibungsagenten suche Fassade --land DEU --limit 5
```

## Befehle

| Befehl | Zweck |
| --- | --- |
| `suche <begriff>` | offene Verfahren zu einem Gewerk, Stichwort oder CPV-Code |
| `quellen` | Datenstand je Vergabeportal, inklusive letzter Fehler |
| `laender` | Zahl offener Verfahren je Land im Index |

Optionen für `suche`: `--land <ISO-3>` (Standard `DEU`), `--cpv <code>`,
`--min-score <0-100>`, `--limit`, `--offset`, `--sprache <de|en>` (hängt gecachte,
gekennzeichnete KI-Kurzfassungen an). `--json` gibt bei jedem Befehl die
Rohantwort der API aus.

## Für Agenten

Die CLI ist bewusst read-only: sie gibt keine Angebote ab und verändert nichts.

- `--json` liefert exakt die API-Antwort, ohne Umformung.
- Exit-Codes: `0` erfolgreich, `1` die API hat abgelehnt (Meldung und
  Auflösungshinweis stehen auf stderr), `2` der Aufruf war falsch.
- Ohne Befehl geht die Hilfe nach stderr, damit stdout für Pipes sauber bleibt.

```bash
npx ausschreibungsagenten suche "Website Relaunch" --cpv 72 --json | jq '.[].title'
```

## Limits und Key

Anonym sind 60 Anfragen pro Stunde frei. Ein Key hebt das Limit und wird über
die Umgebung gesetzt:

```bash
export AUSSCHREIBUNGSAGENTEN_API_KEY=sk_...  # kostenlos unter /entwickler
export AUSSCHREIBUNGSAGENTEN_API_BASE=...    # optional, andere Basis-Adresse
```

Der Key geht als `Authorization: Bearer <key>` an die API — das ist der einzige
Header, den sie auswertet.

## Andere Zugänge

REST, OpenAPI, MCP über Streamable HTTP und eine A2A Agent Card sind unter
[ausschreibungsagenten.de/entwickler](https://www.ausschreibungsagenten.de/entwickler)
beschrieben; die Kurzfassung für Agenten steht in
[llms.txt](https://www.ausschreibungsagenten.de/llms.txt) und
[agents.md](https://www.ausschreibungsagenten.de/agents.md).

Maßgeblich ist immer die verlinkte Originalbekanntmachung, nicht diese
Aufbereitung. Keine Rechtsberatung zum Vergaberecht.
