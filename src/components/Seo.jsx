import { routeByPath, SITE_ORIGIN } from '../routes'

// Kein react-helmet-async: ab React 19 werden title-, meta- und
// link-Elemente aus dem Baum selbst in den Kopfbereich gehoben. Beim
// Prerendering holt entry-server.jsx sie am Anfang der gerenderten
// Zeichenkette ab.
export default function Seo({ path, title, description, faq }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const seitenTitel = title ?? route.title
    const seitenText = description ?? route.description
    const adresse = `${SITE_ORIGIN}${route.path}`

    return (
        <>
            <title>{seitenTitel}</title>
            <meta name="description" content={seitenText} />
            <link rel="canonical" href={adresse} />
            <meta property="og:title" content={seitenTitel} />
            <meta property="og:description" content={seitenText} />
            <meta property="og:url" content={adresse} />
            <meta property="og:type" content="website" />
        </>
    )
}
