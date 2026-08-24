// Schreibt fuer jede vorgerenderte Route eine eigene index.html mit
// echtem Inhalt. Laeuft nach dem Client- und dem Server-Build.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const distVerzeichnis = join(wurzel, 'dist')

const { render } = await import(join(distVerzeichnis, 'server', 'entry-server.js'))
const { routes } = await import(join(wurzel, 'src', 'routes.js'))

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
        .replace('<!--ssg-head-->', head)
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

console.log(`${vorgerendert} Routen vorgerendert, ${geruest} Geruest-Seiten geschrieben.`)
