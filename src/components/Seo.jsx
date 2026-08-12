import { useContext, useEffect } from 'react'
import { routeByPath, SITE_ORIGIN } from '../routes'
import StrukturierteDaten from './StrukturierteDaten'
import { SsrKontext } from './SsrKontext'

// Kein react-helmet-async: ab React 19 ist die Bibliothek ein Durchreicher
// (siehe Kommentar in entry-server.jsx). Beim Prerendering gibt diese
// Komponente die Kopf-Elemente aus, im Browser haelt sie den Titel per
// Effekt nach - fuer Seitenwechsel innerhalb der Anwendung und fuer den
// Entwicklungsmodus, in dem nicht vorgerendert wird.
export default function Seo({ path, title, description, faq }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const seitenTitel = title ?? route.title
    const seitenText = description ?? route.description
    const adresse = `${SITE_ORIGIN}${route.path}`
    const beimServerRendern = useContext(SsrKontext)

    useEffect(() => {
        if (document.title !== seitenTitel) document.title = seitenTitel
    }, [seitenTitel])

    if (!beimServerRendern) return null

    return (
        <>
            <title>{seitenTitel}</title>
            <meta name="description" content={seitenText} />
            <link rel="canonical" href={adresse} />
            <meta property="og:title" content={seitenTitel} />
            <meta property="og:description" content={seitenText} />
            <meta property="og:url" content={adresse} />
            <meta property="og:type" content="website" />
            <StrukturierteDaten path={path} faq={faq} />
        </>
    )
}
