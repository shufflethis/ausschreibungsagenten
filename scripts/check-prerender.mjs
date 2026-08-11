// Bricht den Build ab, wenn eine Route ohne sichtbaren Text ausgeliefert
// wuerde. Genau dieser Zustand war der Ausgangspunkt: alle Routen lieferten
// dasselbe leere Geruest von 6.392 Byte.
//
// Die Pruefung waechst mit den Zusagen: hier nur Vorhandensein und
// Textmenge. Eindeutige Titel und Descriptions kommen dazu, sobald jede
// Seite eigene Meta-Daten aus dem Manifest bezieht.
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const { prerenderRoutes } = await import(join(wurzel, 'src', 'routes.js'))

const MINDEST_TEXTLAENGE = 500
const fehler = []

function sichtbarerText(html) {
    const rumpf = html.split('<body')[1] ?? ''
    return rumpf
        .replace(/<script[\s\S]*?<\/script>/g, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
}

for (const route of prerenderRoutes) {
    const pfad = join(wurzel, 'dist', route.path === '/' ? '' : route.path, 'index.html')
    let inhalt
    try {
        inhalt = await readFile(pfad, 'utf8')
    } catch {
        fehler.push(`${route.path}: Datei fehlt (${pfad})`)
        continue
    }

    const text = sichtbarerText(inhalt)
    if (text.length < MINDEST_TEXTLAENGE) {
        fehler.push(
            `${route.path}: nur ${text.length} Zeichen sichtbarer Text (mindestens ${MINDEST_TEXTLAENGE})`,
        )
    }
}

if (fehler.length) {
    console.error('Prerender-Pruefung fehlgeschlagen:')
    for (const zeile of fehler) console.error(`  - ${zeile}`)
    process.exit(1)
}

console.log(`Prerender-Pruefung bestanden: ${prerenderRoutes.length} Routen mit Textinhalt.`)
