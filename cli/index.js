import { parseArgs } from 'node:util'
import { ApiFehler, basis, laender, quellenStatus, sucheTender } from './api.js'
import { laenderZeilen, quellenZeilen, tenderZeilen } from './ausgabe.js'

const VERSION = '0.1.1'

const HILFE = `ausschreibungsagenten ${VERSION}
Oeffentliche Ausschreibungen aus 17 Vergabequellen in Deutschland, der EU und UK.

  ausschreibungsagenten suche <begriff> [optionen]
  ausschreibungsagenten quellen
  ausschreibungsagenten laender

Optionen fuer "suche":
  -l, --land <ISO-3>      Land des Auftraggebers, z. B. DEU, AUT, GBR (Standard: DEU)
      --cpv <code>        CPV-Code; kurze Praefixe treffen die ganze Abteilung
      --min-score <zahl>  Mindest-Relevanz der Quelle (0-100)
      --limit <zahl>      Anzahl Treffer (Standard: 10)
      --offset <zahl>     Treffer ueberspringen
      --sprache <de|en>   haengt eine gekennzeichnete KI-Kurzfassung an

Allgemein:
      --json              Rohantwort der API ausgeben
  -h, --help              diese Hilfe
  -v, --version           Version

Umgebung:
  AUSSCHREIBUNGSAGENTEN_API_KEY   optionaler Key, hebt das Limit von 60/Stunde
  AUSSCHREIBUNGSAGENTEN_API_BASE  andere Basis-Adresse (Standard: ${basis()})

Beispiele:
  npx ausschreibungsagenten suche Fassade --land DEU --limit 5
  npx ausschreibungsagenten suche "Website Relaunch" --cpv 72 --json | jq '.[].title'

Diese CLI liest nur. Sie gibt keine Angebote ab und ersetzt keine
Rechtsberatung; massgeblich ist immer die verlinkte Originalbekanntmachung.
`

const OPTIONEN = {
    land: { type: 'string', short: 'l' },
    cpv: { type: 'string' },
    'min-score': { type: 'string' },
    limit: { type: 'string' },
    offset: { type: 'string' },
    sprache: { type: 'string' },
    json: { type: 'boolean', default: false },
    help: { type: 'boolean', short: 'h', default: false },
    version: { type: 'boolean', short: 'v', default: false },
}

// Exit-Codes: 0 fertig, 1 die API hat abgelehnt, 2 der Aufruf war falsch.
// Ein Agent, der die CLI aufruft, soll die beiden Faelle unterscheiden
// koennen, ohne die Textausgabe zu lesen.
export async function fuehreAus(argv, schreibe = console.log, fehlerAus = console.error) {
    let werte
    let stellungen
    try {
        ({ values: werte, positionals: stellungen } = parseArgs({
            args: argv, options: OPTIONEN, allowPositionals: true,
        }))
    } catch (fehler) {
        fehlerAus(fehler.message)
        fehlerAus('Aufruf: ausschreibungsagenten --help')
        return 2
    }

    if (werte.version) { schreibe(VERSION); return 0 }
    if (werte.help) { schreibe(HILFE); return 0 }

    const befehl = stellungen[0]
    if (!befehl) {
        // Ohne Befehl ist der Aufruf unvollstaendig, also Hilfe nach
        // stderr und Exit 2. Auf stdout darf dann nichts stehen, sonst
        // pipet ein Aufrufer die Hilfe in seinen JSON-Parser.
        fehlerAus(HILFE)
        return 2
    }

    try {
        if (befehl === 'suche') {
            const begriff = stellungen.slice(1).join(' ')
            if (!begriff) {
                fehlerAus('Es fehlt der Suchbegriff: ausschreibungsagenten suche <begriff>')
                return 2
            }
            const treffer = await sucheTender({
                begriff,
                land: werte.land || 'DEU',
                cpv: werte.cpv,
                mindestScore: werte['min-score'],
                limit: werte.limit || '10',
                offset: werte.offset,
                sprache: werte.sprache,
            })
            schreibe(werte.json ? JSON.stringify(treffer, null, 2) : tenderZeilen(treffer).join('\n'))
            return 0
        }

        if (befehl === 'quellen') {
            const quellen = await quellenStatus()
            schreibe(werte.json ? JSON.stringify(quellen, null, 2) : quellenZeilen(quellen).join('\n'))
            return 0
        }

        if (befehl === 'laender') {
            const eintraege = await laender()
            schreibe(werte.json ? JSON.stringify(eintraege, null, 2) : laenderZeilen(eintraege).join('\n'))
            return 0
        }

        fehlerAus(`Unbekannter Befehl: ${befehl}`)
        fehlerAus('Bekannt sind: suche, quellen, laender')
        return 2
    } catch (fehler) {
        if (fehler instanceof ApiFehler) {
            fehlerAus(`API-Fehler ${fehler.status}${fehler.code ? ` (${fehler.code})` : ''}: ${fehler.message}`)
            if (fehler.resolution) fehlerAus(fehler.resolution)
            return 1
        }
        fehlerAus(`Netzwerkfehler: ${fehler.message}`)
        return 1
    }
}
