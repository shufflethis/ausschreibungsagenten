import { useContext, useEffect } from 'react'
import { routeByPath, SITE_ORIGIN } from '../routes'
import StrukturierteDaten from './StrukturierteDaten'
import { SsrKontext } from './SsrKontext'

function setzeKopfAttribut(selektor, attribut, wert) {
    const element = document.head?.querySelector(selektor)
    if (element && element.getAttribute(attribut) !== wert) {
        element.setAttribute(attribut, wert)
    }
}

// Einzige Stelle fuer Kopf-Metadaten aller Routen (react-helmet-async ist
// entfallen). Beim Prerendering gibt diese Komponente die Kopf-Elemente aus;
// im Browser gibt sie null zurueck (damit die Hydration im #root sauber
// bleibt) und haelt Titel, Description, Canonical und Open-Graph-Felder bei
// Client-Seitenwechseln direkt in document.head nach.
export default function Seo({ path, title, description, faq, robots }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const seitenTitel = title ?? route.title
    const seitenText = description ?? route.description
    const adresse = `${SITE_ORIGIN}${route.path}`
    const robotsWert = robots ?? (!route.index ? 'noindex, follow' : null)
    const seitenTyp = route.article ? 'article' : 'website'
    const beimServerRendern = useContext(SsrKontext)

    useEffect(() => {
        if (document.title !== seitenTitel) document.title = seitenTitel
        setzeKopfAttribut('meta[name="description"]', 'content', seitenText)
        setzeKopfAttribut('link[rel="canonical"]', 'href', adresse)
        setzeKopfAttribut('meta[property="og:title"]', 'content', seitenTitel)
        setzeKopfAttribut('meta[property="og:description"]', 'content', seitenText)
        setzeKopfAttribut('meta[property="og:url"]', 'content', adresse)
        setzeKopfAttribut('meta[property="og:type"]', 'content', seitenTyp)
        const robotsMeta = document.head?.querySelector('meta[name="robots"]')
        if (robotsWert) {
            if (robotsMeta) robotsMeta.setAttribute('content', robotsWert)
            else if (document.head) {
                const neu = document.createElement('meta')
                neu.setAttribute('name', 'robots')
                neu.setAttribute('content', robotsWert)
                document.head.appendChild(neu)
            }
        } else {
            robotsMeta?.remove()
        }
    }, [seitenTitel, seitenText, adresse, seitenTyp, robotsWert])

    if (!beimServerRendern) return null

    return (
        <>
            <title>{seitenTitel}</title>
            <meta name="description" content={seitenText} />
            {robotsWert ? <meta name="robots" content={robotsWert} /> : null}
            <link rel="canonical" href={adresse} />
            <meta property="og:title" content={seitenTitel} />
            <meta property="og:description" content={seitenText} />
            <meta property="og:url" content={adresse} />
            <meta property="og:type" content={seitenTyp} />
            <StrukturierteDaten path={path} faq={faq} />
        </>
    )
}
