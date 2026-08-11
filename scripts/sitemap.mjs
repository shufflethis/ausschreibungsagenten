// Erzeugt die Sitemap aus dem Routen-Manifest. Vorher war sie von Hand
// gepflegt und lief mit dem Routing auseinander: sie listete acht
// Adressen, darunter vier Rechtsseiten, die auf noindex stehen.
import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..')
const { indexableRoutes, SITE_ORIGIN } = await import(join(wurzel, 'src', 'routes.js'))

const eintraege = indexableRoutes
    .map((route) => `  <url><loc>${SITE_ORIGIN}${route.path}</loc></url>`)
    .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${eintraege}
</urlset>
`

await writeFile(join(wurzel, 'dist', 'sitemap.xml'), xml, 'utf8')
console.log(`Sitemap mit ${indexableRoutes.length} Adressen geschrieben.`)
