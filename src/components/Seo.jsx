import { useContext, useEffect } from 'react'
import { routeByPath, SITE_ORIGIN } from '../routes'
import StrukturierteDaten from './StrukturierteDaten'
import { SsrKontext } from './SsrKontext'

const STANDARD_OG_BILD = '/og-image.png'

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
    const bildPfad = route.ogImage ?? STANDARD_OG_BILD
    const bildUrl = `${SITE_ORIGIN}${bildPfad}`
    const bildBreite = route.ogImage ? '1920' : '1200'
    const bildHoehe = route.ogImage ? '1280' : '630'
    const bildAlt = route.ogImage
        ? seitenTitel
        : 'Erklärbare Ausschreibungssuche – 18 öffentliche Quellen live'
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
        setzeKopfAttribut('meta[property="og:image"]', 'content', bildUrl)
        setzeKopfAttribut('meta[property="og:image:width"]', 'content', bildBreite)
        setzeKopfAttribut('meta[property="og:image:height"]', 'content', bildHoehe)
        setzeKopfAttribut('meta[property="og:image:alt"]', 'content', bildAlt)
        setzeKopfAttribut('meta[name="twitter:image"]', 'content', bildUrl)
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
    }, [seitenTitel, seitenText, adresse, seitenTyp, bildUrl, bildBreite, bildHoehe, bildAlt, robotsWert])

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
            <meta property="og:image" content={bildUrl} />
            <meta property="og:image:width" content={bildBreite} />
            <meta property="og:image:height" content={bildHoehe} />
            <meta property="og:image:alt" content={bildAlt} />
            <meta name="twitter:image" content={bildUrl} />
            <StrukturierteDaten path={path} faq={faq} />
        </>
    )
}
