import { routeByPath, SITE_ORIGIN } from '../routes'

// JSON-LD muss woertlich im script-Tag stehen, deshalb kein Text-Kind
// (React wuerde Anfuehrungszeichen als &quot; maskieren und das JSON
// unlesbar machen). Damit kein Inhalt aus dem Tag ausbrechen kann, wird
// jedes "<" als Unicode-Escape geschrieben - JSON-seitig gleichwertig,
// aber "</script>" kann so nicht mehr entstehen.
function alsJsonLd(daten) {
    return JSON.stringify(daten).replace(/</g, '\\u003c')
}

// Ersetzt den festen JSON-LD-Block, der in der index.html stand und auf
// jeder Unterseite eine einstufige Brotkrumenspur behauptet hat.
const ORGANISATION = {
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organisation`,
    name: 'Ausschreibungsagenten.de',
    legalName: 'Yawusa UG (haftungsbeschränkt) i.G.',
    url: `${SITE_ORIGIN}/`,
    email: 'hi@ausschreibungsagenten.de',
    // Offizielle Profile derselben Entitaet. Verbindet Domain und Kanal
    // fuer Suchmaschinen zu einem Absender.
    sameAs: ['https://www.youtube.com/@ausschreibungsagenten'],
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Schliemannstraße 23',
        postalCode: '10437',
        addressLocality: 'Berlin',
        addressCountry: 'DE',
    },
}

export default function StrukturierteDaten({ path, faq }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const spur = [{ '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE_ORIGIN}/` }]
    if (route.path !== '/') {
        spur.push({
            '@type': 'ListItem',
            position: 2,
            name: route.title,
            item: `${SITE_ORIGIN}${route.path}`,
        })
    }

    const graph = [
        ORGANISATION,
        { '@type': 'BreadcrumbList', itemListElement: spur },
        {
            '@type': 'WebPage',
            '@id': `${SITE_ORIGIN}${route.path}#seite`,
            url: `${SITE_ORIGIN}${route.path}`,
            name: route.title,
            description: route.description,
            isPartOf: { '@id': `${SITE_ORIGIN}/#organisation` },
        },
    ]

    if (faq?.length) {
        graph.push({
            '@type': 'FAQPage',
            mainEntity: faq.map((eintrag) => ({
                '@type': 'Question',
                name: eintrag.frage,
                acceptedAnswer: { '@type': 'Answer', text: eintrag.antwort },
            })),
        })
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: alsJsonLd({ '@context': 'https://schema.org', '@graph': graph }),
            }}
        />
    )
}
