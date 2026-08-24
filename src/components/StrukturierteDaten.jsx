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
    legalName: 'Yawusa UG (haftungsbeschränkt)',
    // Ohne description bleibt der Identitaetsknoten fuer Auswerter
    // unvollstaendig: Name und Adresse sagen, wer wir sind, aber nicht,
    // wofuer. Genau danach fragen Agenten bei der Entitaetsaufloesung.
    description:
        'Ausschreibungsagenten.de findet öffentliche Ausschreibungen aus 17 Vergabequellen in '
        + 'Deutschland, der EU und dem Vereinigten Königreich und begründet jeden Treffer '
        + 'nachvollziehbar über CPV, Suchbegriffe, Ausschlüsse, Leistungsort, Auftragswert und Frist.',
    url: `${SITE_ORIGIN}/`,
    email: 'hi@ausschreibungsagenten.de',
    telephone: '+49 30 403665430',
    logo: `${SITE_ORIGIN}/brand/logo-mark.png`,
    // Dieselben Daten wie oben, zusaetzlich als contactPoint: KI-Assistenten
    // lesen bei "wie erreiche ich ..." diese Struktur aus, nicht die losen
    // Felder. Doppelt gefuehrt statt ersetzt, weil aeltere Auswerter
    // weiterhin email/telephone direkt am Organization-Objekt erwarten.
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'hi@ausschreibungsagenten.de',
        telephone: '+49 30 403665430',
        areaServed: 'DE',
        availableLanguage: ['de', 'en'],
    },
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

// Organization sagt, wer wir sind; Service sagt, was wir tun. Auswerter
// suchen den zweiten Knoten, wenn sie Leistung, Gebiet und Anbieter
// zusammenfuehren wollen. Bewusst ohne offers: solange der Online-
// Checkout aus ist, waere eine buchbare Offer eine Zusage, die die
// Website nicht einloest. Die Preise stehen in /pricing.md.
const DIENST = {
    '@type': 'Service',
    '@id': `${SITE_ORIGIN}/#dienst`,
    name: 'Ausschreibungs-Monitoring mit erklärbarem Profil-Matching',
    serviceType: 'Recherche und Überwachung öffentlicher Ausschreibungen',
    description:
        'Tägliche Auswertung von 17 Vergabequellen (TED, service.bund.de, Datenservice Öffentlicher '
        + 'Einkauf, DTVP, RIB, Landes- und Regionalportale, GB Find a Tender und Contracts Finder) '
        + 'mit erklärbarem Abgleich gegen das Firmenprofil und Zugriff über REST, MCP und A2A.',
    provider: { '@id': `${SITE_ORIGIN}/#organisation` },
    url: `${SITE_ORIGIN}/`,
    areaServed: [
        { '@type': 'Country', name: 'Deutschland' },
        { '@type': 'Country', name: 'Österreich' },
        { '@type': 'Country', name: 'Vereinigtes Königreich' },
        { '@type': 'AdministrativeArea', name: 'Europäische Union' },
    ],
    audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Kleine und mittlere Unternehmen, die sich an öffentlichen Vergaben beteiligen',
    },
    termsOfService: `${SITE_ORIGIN}/agb`,
}

export default function StrukturierteDaten({ path, faq }) {
    const route = routeByPath(path)
    if (!route) throw new Error(`Kein Manifest-Eintrag fuer ${path}`)

    const spur = [{ '@type': 'ListItem', position: 1, name: 'Start', item: `${SITE_ORIGIN}/` }]
    if (route.path !== '/') {
        spur.push({
            '@type': 'ListItem',
            position: 2,
            // Nur der eigentliche Seitenname, nicht der volle SEO-Titel -
            // die Brotkrume erscheint woertlich im Suchergebnis.
            name: route.title.split('|')[0].trim(),
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

    // Nur auf der Startseite: der Dienst ist einer, und ihn auf jeder
    // Unterseite zu wiederholen macht ihn nicht deutlicher.
    if (route.path === '/') {
        graph.push(DIENST)
    }

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
