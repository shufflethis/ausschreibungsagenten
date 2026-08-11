// Schreibt fuer jede vorgerenderte Route eine eigene index.html mit
// echtem Inhalt. Laeuft nach dem Client- und dem Server-Build.
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const distVerzeichnis = join(wurzel, 'dist')

const { render } = await import(join(distVerzeichnis, 'server', 'entry-server.js'))
const { prerenderRoutes } = await import(join(wurzel, 'src', 'routes.js'))

const vorlage = await readFile(join(distVerzeichnis, 'index.html'), 'utf8')
if (!vorlage.includes('<!--ssg-head-->')) {
    throw new Error('Marker <!--ssg-head--> fehlt in dist/index.html')
}

for (const route of prerenderRoutes) {
    const { html, head } = await render(route.path)

    const seite = vorlage
        .replace(/<title>[\s\S]*?<\/title>\s*/, '')
        .replace('<!--ssg-head-->', head)
        .replace('<div id="root"></div>', `<div id="root">${html}</div>`)

    const zielVerzeichnis = route.path === '/' ? distVerzeichnis : join(distVerzeichnis, route.path)
    await mkdir(zielVerzeichnis, { recursive: true })
    await writeFile(join(zielVerzeichnis, 'index.html'), seite, 'utf8')
    console.log(`vorgerendert: ${route.path}`)
}

console.log(`${prerenderRoutes.length} Routen vorgerendert.`)
