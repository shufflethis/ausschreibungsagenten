// Bricht den Build ab, wenn eine Route ohne sichtbaren Text ausgeliefert
// wuerde. Genau dieser Zustand war der Ausgangspunkt: alle Routen lieferten
// dasselbe leere Geruest von 6.392 Byte.
//
// Seit jede Seite ihre Meta-Daten aus dem Manifest bezieht, verlangt die
// Pruefung zusaetzlich einen eindeutigen Titel und eine Description je
// Route. Doppelte Titel bedeuten in aller Regel: auf einer Seite fehlt
// der Seo-Aufruf.
import { readFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const { prerenderRoutes, routes } = await import(join(wurzel, 'src', 'routes.js'))

const MINDEST_TEXTLAENGE = 500
const fehler = []
const gesehenerTitel = new Map()

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

    const titel = inhalt.match(/<title>([\s\S]*?)<\/title>/)?.[1]?.trim()
    if (!titel) {
        fehler.push(`${route.path}: kein <title>`)
    } else if (gesehenerTitel.has(titel)) {
        fehler.push(`${route.path}: gleicher <title> wie ${gesehenerTitel.get(titel)}`)
    } else {
        gesehenerTitel.set(titel, route.path)
    }

    if (!/<meta name="description"/.test(inhalt)) {
        fehler.push(`${route.path}: keine Description`)
    }

    const text = sichtbarerText(inhalt)
    if (text.length < MINDEST_TEXTLAENGE) {
        fehler.push(
            `${route.path}: nur ${text.length} Zeichen sichtbarer Text (mindestens ${MINDEST_TEXTLAENGE})`,
        )
    }
}

// Nicht vorgerenderte Routen brauchen eine eigene Datei mit leerem
// Wurzelelement. Fehlt sie, greift der Auffang-Rewrite aus der vercel.json
// und liefert die Startseite aus - der Browser hydriert dann die Startseite
// gegen Login oder Konto. Ist das Wurzelelement dagegen gefuellt, wuerde
// dieselbe Verwechslung auf dieser Route entstehen.
for (const route of routes.filter((r) => !r.prerender)) {
    const pfad = join(wurzel, 'dist', route.path, 'index.html')
    let inhalt
    try {
        inhalt = await readFile(pfad, 'utf8')
    } catch {
        fehler.push(`${route.path}: Geruest-Datei fehlt (${pfad}) - Auffang-Rewrite wuerde die Startseite ausliefern`)
        continue
    }
    if (!/<div id="root"><\/div>/.test(inhalt)) {
        fehler.push(`${route.path}: Wurzelelement ist nicht leer, obwohl die Route nicht vorgerendert wird`)
    }
}

if (fehler.length) {
    console.error('Prerender-Pruefung fehlgeschlagen:')
    for (const zeile of fehler) console.error(`  - ${zeile}`)
    process.exit(1)
}

console.log(`Prerender-Pruefung bestanden: ${prerenderRoutes.length} Routen mit Inhalt, ${routes.length - prerenderRoutes.length} Geruest-Seiten.`)
