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
        'Ausschreibungsagenten.de findet öffentliche Ausschreibungen aus 18 Vergabequellen in '
        + 'Deutschland, der EU, dem Vereinigten Königreich und den USA (SAM.gov) und begründet jeden Treffer '
        + 'nachvollziehbar über CPV, Suchbegriffe, Ausschlüsse, Leistungsort, Auftragswert und Frist.',
    url: `${SITE_ORIGIN}/`,
    email: 'hi@ausschreibungsagenten.de',
    telephone: '+49 30 403665430',
    // Als ImageObject mit Massen, nicht als blosse URL: Auswerter, die das
    // Logo weiterverwenden wollen, muessen sonst erst laden, um zu wissen,
    // was sie bekommen.
    logo: {
        '@type': 'ImageObject',
        url: `${SITE_ORIGIN}/brand/logo-mark.png`,
        width: 1024,
        height: 1024,
    },
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
    // Offizielle Profile derselben Entitaet. Verbindet Domain, Code, Pakete
    // und Kanaele fuer Suchmaschinen und KI-Auswerter zu einem Absender.
    sameAs: [
        'https://www.youtube.com/@ausschreibungsagenten',
        'https://github.com/shufflethis/ausschreibungsagenten',
        'https://github.com/shufflethis/ausschreibungsagenten-mcp',
        'https://www.npmjs.com/package/ausschreibungsagenten',
        'https://smithery.ai/servers/@agentifizierung/ausschreibungsagenten',
        'https://www.tender-agents.com',
        'https://www.agentifizierung.de',
    ],
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
        'Tägliche Auswertung von 18 Vergabequellen (TED, service.bund.de, Datenservice Öffentlicher '
        + 'Einkauf, DTVP, RIB, Landes- und Regionalportale, GB Find a Tender und Contracts Finder, US SAM.gov) '
        + 'mit erklärbarem Abgleich gegen das Firmenprofil und Zugriff über REST, MCP und A2A.',
    provider: { '@id': `${SITE_ORIGIN}/#organisation` },
    url: `${SITE_ORIGIN}/`,
    areaServed: [
        { '@type': 'Country', name: 'Deutschland' },
        { '@type': 'Country', name: 'Österreich' },
        { '@type': 'Country', name: 'Vereinigtes Königreich' },
        { '@type': 'Country', name: 'Vereinigte Staaten' },
        { '@type': 'AdministrativeArea', name: 'Europäische Union' },
    ],
    audience: {
        '@type': 'BusinessAudience',
        audienceType: 'Kleine und mittlere Unternehmen, die sich an öffentlichen Vergaben beteiligen',
    },
    termsOfService: `${SITE_ORIGIN}/agb`,
}

// Gleicht die Autorenangaben auf geo-tool.com ab, damit Suchmaschinen und
// KI-Systeme beide Profile als dieselbe Person zusammenfuehren. worksFor
// nennt zuerst die Betreiberin dieser Seite, dann famefact.
const GORDEN_WUEBBE = {
    '@type': 'Person',
    '@id': `${SITE_ORIGIN}/ueber-uns#gorden-wuebbe`,
    name: 'Gorden Wübbe',
    alternateName: 'Gorden Wuebbe',
    jobTitle: ['Geschäftsführer Technologie & KI', 'AI Search Evangelist'],
    description:
        'Geschäftsführer von Ausschreibungsagenten.de, Gründer von geo-tool.com und Mitgründer von famefact. '
        + 'Misst, ob KI-Systeme wie ChatGPT, Perplexity und Google AI Mode Unternehmen empfehlen.',
    image: `${SITE_ORIGIN}/team/gorden-wuebbe.webp`,
    url: `${SITE_ORIGIN}/ueber-uns`,
    founder: { '@type': 'Organization', name: 'geo-tool', url: 'https://geo-tool.com' },
    worksFor: [
        { '@id': `${SITE_ORIGIN}/#organisation` },
        { '@type': 'Organization', name: 'famefact', url: 'https://famefact.com' },
    ],
    knowsAbout: [
        'Generative Engine Optimization',
        'AI Search',
        'KI-Sichtbarkeit',
        'Agentic Commerce',
        'Öffentliche Ausschreibungen',
    ],
    sameAs: ['https://www.linkedin.com/in/wuebbe', 'https://x.com/wuebbe', 'https://geo-tool.com'],
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

    if (route.path === '/ueber-uns') {
        graph.push(GORDEN_WUEBBE)
    }

    if (route.article) {
        graph.push({
            '@type': 'Article',
            '@id': `${SITE_ORIGIN}${route.path}#artikel`,
            headline: route.title.split('|')[0].trim(),
            description: route.description,
            url: `${SITE_ORIGIN}${route.path}`,
            image: `${SITE_ORIGIN}${route.ogImage ?? '/og-image.png'}`,
            inLanguage: 'de-DE',
            author: {
                '@id': `${SITE_ORIGIN}/ueber-uns#gorden-wuebbe`,
                name: 'Gorden Wübbe',
                url: `${SITE_ORIGIN}/ueber-uns#gorden-wuebbe`,
            },
            publisher: { '@id': `${SITE_ORIGIN}/#organisation` },
            mainEntityOfPage: { '@id': `${SITE_ORIGIN}${route.path}#seite` },
            ...(route.published || route.lastmod ? { datePublished: route.published ?? route.lastmod } : {}),
            ...(route.lastmod ? { dateModified: route.lastmod } : {}),
        })
    }

    if (route.tool) {
        graph.push({
            '@type': 'WebApplication',
            '@id': `${SITE_ORIGIN}${route.path}#werkzeug`,
            name: route.title.split(':')[0].trim(),
            description: route.description,
            url: `${SITE_ORIGIN}${route.path}`,
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            inLanguage: 'de-DE',
            isAccessibleForFree: true,
            provider: { '@id': `${SITE_ORIGIN}/#organisation` },
        })
    }

    if (route.path === '/zahlen') {
        graph.push({
            '@type': 'Dataset',
            '@id': `${SITE_ORIGIN}/zahlen#datensatz`,
            name: 'EU-weite öffentliche Ausschreibungen deutscher Auftraggeber nach CPV-Division und Eignungskriterien (2025/2026)',
            description:
                'Reproduzierbare TED-API-v3-Auswertung von 88.817 EU-weiten Bekanntmachungen deutscher Auftraggeber '
                + '(August 2025 bis Juli 2026) nach CPV-Division sowie Korpus-Analyse von 7.179 eForms-Eignungskriterien '
                + '(Referenzen, Mindestumsatz, Versicherung, Zertifikate).',
            url: `${SITE_ORIGIN}/zahlen`,
            creator: { '@id': `${SITE_ORIGIN}/#organisation` },
            inLanguage: 'de-DE',
            temporalCoverage: '2025-08-01/2026-07-31',
            spatialCoverage: { '@type': 'Place', name: 'Deutschland' },
            measurementTechnique:
                'Abfrage der offiziellen EU-TED-API v3 je CPV-Division sowie deterministische Musterprüfung auf eForms-selection_criteria',
            isAccessibleForFree: true,
        })
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
