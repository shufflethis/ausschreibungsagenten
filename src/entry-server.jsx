// Rendert eine Route ohne Browser. Aufgerufen vom Prerender-Skript nach
// dem Vite-Build und von den Tests.
//
// Zum Zusammenspiel mit react-helmet-async: ab React 19 ist die Bibliothek
// bewusst ein Durchreicher. HelmetProvider rendert nur noch ein Fragment
// und fuellt den Server-Context nicht mehr (siehe isReact19 in
// node_modules/react-helmet-async/lib/index.esm.js). Stattdessen zieht
// React 19 title-, meta- und link-Elemente selbst nach vorne und gibt sie
// am Anfang der gerenderten Zeichenkette aus. Genau dort holen wir sie ab
// und setzen sie in den Kopfbereich der Seite.
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import { routeByPath, SITE_ORIGIN } from './routes'
import { SsrKontext } from './components/SsrKontext'

// title, meta, link und JSON-LD gehoeren in den Kopfbereich, nie in den
// Rumpf. Im Rumpf gibt es keine gueltige Verwendung dieser Elemente,
// deshalb ist das Herausloesen gefahrlos.
const KOPF_TAGS =
    /<title>[\s\S]*?<\/title>|<meta\b[^>]*?\/?>|<link\b[^>]*?\/?>|<script type="application\/ld\+json">[\s\S]*?<\/script>/g

export async function render(url) {
    const markup = renderToString(
        <SsrKontext.Provider value={true}>
            <HelmetProvider>
                <StaticRouter location={url}>
                    <App />
                </StaticRouter>
            </HelmetProvider>
        </SsrKontext.Provider>,
    )

    const kopf = markup.match(KOPF_TAGS) ?? []
    const rumpf = markup.replace(KOPF_TAGS, '')

    // Kanonische Adresse und Indexierbarkeit stehen im Manifest und werden
    // ergaenzt, falls die Seite sie nicht selbst gesetzt hat.
    const route = routeByPath(url)
    if (route) {
        if (!kopf.some((tag) => tag.includes('rel="canonical"'))) {
            kopf.push(`<link rel="canonical" href="${SITE_ORIGIN}${route.path}"/>`)
        }
        if (!route.index && !kopf.some((tag) => tag.includes('name="robots"'))) {
            kopf.push('<meta name="robots" content="noindex, follow"/>')
        }
    }

    return { html: rumpf, head: kopf.join('\n    ') }
}
