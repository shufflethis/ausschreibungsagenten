// Schreibt fuer jede vorgerenderte Route eine eigene index.html mit
// echtem Inhalt. Laeuft nach dem Client- und dem Server-Build.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const distVerzeichnis = join(wurzel, 'dist')

const { render } = await import(join(distVerzeichnis, 'server', 'entry-server.js'))
const { routes } = await import(join(wurzel, 'src', 'routes.js'))
const { seitenDateien } = await import(join(wurzel, 'src', 'seitenDateien.js'))

// Jede Seite ist ein eigener Baustein. Ohne Ankuendigung erfaehrt der
// Browser erst nach dem Ausfuehren des Startbausteins, welchen er noch
// braucht - eine zusaetzliche Runde, bevor die Seite bedienbar ist. Das
// Manifest von Vite nennt Datei und Abhaengigkeiten je Seite.
const manifestPfad = join(distVerzeichnis, '.vite', 'manifest.json')
const manifest = JSON.parse(await readFile(manifestPfad, 'utf8'))
const startBaustein = Object.keys(manifest).find((schluessel) => manifest[schluessel].isEntry)

function bausteine(schluessel, gesehen = new Set()) {
    if (!manifest[schluessel] || schluessel === startBaustein || gesehen.has(schluessel)) return gesehen
    gesehen.add(schluessel)
    for (const abhaengigkeit of manifest[schluessel].imports ?? []) bausteine(abhaengigkeit, gesehen)
    return gesehen
}

function vorabLaden(route) {
    const schluessel = `src/pages/${seitenDateien[route.component].datei}.jsx`
    if (!manifest[schluessel]) throw new Error(`Kein Baustein im Manifest fuer ${schluessel}`)
    return [...bausteine(schluessel)]
        .map((eintrag) => `<link rel="modulepreload" crossorigin href="/${manifest[eintrag].file}"/>`)
        .join('\n    ')
}

const vorlage = await readFile(join(distVerzeichnis, 'index.html'), 'utf8')
if (!vorlage.includes('<!--ssg-head-->')) {
    throw new Error('Marker <!--ssg-head--> fehlt in dist/index.html')
}

let vorgerendert = 0
let geruest = 0

for (const route of routes) {
    // Auch Routen ohne Prerendering bekommen eine eigene Datei, nur mit
    // leerem Wurzelelement. Sonst greift der Auffang-Rewrite aus der
    // vercel.json und liefert ihnen die dist/index.html - und die traegt
    // seit dem Prerendering die vollstaendige Startseite. Der Browser
    // wuerde dann die Startseite gegen die Login-Seite hydrieren: Fehler
    // in der Konsole und ein sichtbares Aufblitzen der falschen Seite.
    // Mit eigener Datei greift das Dateisystem, das Wurzelelement bleibt
    // leer, und main.jsx rendert normal statt zu hydrieren.
    const { html, head } = await render(route.path)
    const rumpf = route.prerender ? html : ''

    const seite = vorlage
        .replace(/<title>[\s\S]*?<\/title>\s*/, '')
        .replace('<!--ssg-head-->', `${head}\n    ${vorabLaden(route)}`)
        .replace('<div id="root"></div>', `<div id="root">${rumpf}</div>`)

    const zielVerzeichnis = route.path === '/' ? distVerzeichnis : join(distVerzeichnis, route.path)
    await mkdir(zielVerzeichnis, { recursive: true })
    await writeFile(join(zielVerzeichnis, 'index.html'), seite, 'utf8')

    if (route.prerender) {
        vorgerendert += 1
        console.log(`vorgerendert: ${route.path}`)
    } else {
        geruest += 1
        console.log(`Geruest mit Kopfdaten: ${route.path}`)
    }
}

// Die 404-Seite kommt aus derselben Quelle wie die Antwort der
// Auffang-Function: die HTML-Fassung steht in api/not-found.js. Die Datei
// hier ist nur das Netz fuer den Fall, dass die Function ausfaellt - dann
// liefert Vercel wenigstens die gestaltete Seite statt seiner eigenen.
const { HTML: seiteNichtGefunden } = await import(join(wurzel, 'api', 'not-found.js'))
await writeFile(join(distVerzeichnis, '404.html'), seiteNichtGefunden, 'utf8')

// Das Manifest ist ein Bauartefakt und gehoert nicht ins Netz.
await rm(join(distVerzeichnis, '.vite'), { recursive: true })

console.log(`${vorgerendert} Routen vorgerendert, ${geruest} Geruest-Seiten geschrieben.`)
