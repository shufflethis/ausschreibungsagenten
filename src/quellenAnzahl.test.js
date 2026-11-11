import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { expect, it } from 'vitest'

// Die Zahl der angebundenen Quellen steht als Prosa in ueber zwanzig
// Dateien. Kommt eine Quelle dazu: diese Konstante aendern, der Test nennt
// jede Stelle, die noch die alte Zahl traegt. Vorher sagten die Website 18
// und Agentenansicht, 404-Seite, og:image und CLI noch 17.
const QUELLEN_ANZAHL = 18

// Bewusst ausgenommen: das Transkript muss zum aufgenommenen Video passen,
// docs/ und die Protokolle halten historische Staende fest.
const AUSGENOMMEN = /^(docs\/|PROGRESS\.md|GOALS\.md|AGENT-GOALS\.md|TENDER-AGENTS-PLAN\.md|src\/data\/videoTranskript\.js|package-lock\.json|public\/feeds\/|.*\.test\.jsx?$)/

const MUSTER = /\b(\d{1,2})\s+(?:(?:Live-|Vergabe)[Qq]uellen|Quellen\b|öffentliche Quellen|angebundenen? Quellen|connected sources|sources\b)/g

it(`nennt ueberall ${QUELLEN_ANZAHL} Quellen`, () => {
    const dateien = execSync('git ls-files', { encoding: 'utf8' }).split('\n')
        .filter((pfad) => /\.(jsx?|mjs|md|txt|json|html)$|webmcp$/.test(pfad) && !AUSGENOMMEN.test(pfad))
    const abweichungen = []
    for (const pfad of dateien) {
        const inhalt = readFileSync(pfad, 'utf8')
        for (const treffer of inhalt.matchAll(MUSTER)) {
            if (Number(treffer[1]) !== QUELLEN_ANZAHL) abweichungen.push(`${pfad}: "${treffer[0]}"`)
        }
    }
    expect(abweichungen).toEqual([])
})
