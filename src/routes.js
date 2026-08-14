// Gemeinsame Quelle fuer Routing, Prerendering, Meta-Daten und Sitemap.
// Bewusst reines JavaScript ohne JSX, damit die Build-Skripte es direkt
// importieren koennen.

export const SITE_ORIGIN = 'https://www.ausschreibungsagenten.de'

export const routes = [
    {
        path: '/',
        component: 'LandingPage',
        title: 'Ausschreibungsagenten.de – Ausschreibungen aus TED, Bund und Landesportalen filtern',
        description:
            'Öffentliche Ausschreibungen aus 17 Live-Quellen finden: TED, Bund, DTVP und Landesportale. Erklärbares Profil-Matching mit Begründung je Treffer.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/ueber-uns',
        component: 'UeberUns',
        title: 'Über uns – Team aus Berlin hinter dem Ausschreibungsagenten | Ausschreibungsagenten.de',
        description:
            'Das Team hinter Ausschreibungsagenten.de: drei Geschäftsführer der Yawusa UG aus Berlin – Technologie & KI, Strategie & Produkt, Qualität & Prozesse. Datenverarbeitung in der EU, persönliche Pilotbetreuung.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/entwickler',
        component: 'Entwickler',
        title: 'API & Agent-Anbindung | Ausschreibungen API Deutschland – Ausschreibungsagenten.de',
        description:
            'Öffentliche Ausschreibungen per API und KI-Agent abfragen: REST-Vorschau, A2A Agent Card, JSON-RPC und OpenAPI. 17 Live-Quellen, erklärbares Matching, transparente Limits.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/status',
        component: 'Status',
        title: 'Quellenstatus & Abdeckung | Ausschreibungsagenten.de',
        description:
            'Live-Status aller Datenquellen: welche Vergabeportale wir wann zuletzt erfolgreich abgefragt haben und wie viele Ausschreibungen je EU-Land im Index sind. Volle Transparenz statt Behauptungen.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/ausschreibungssuche-automatisieren',
        component: 'AusschreibungssucheAutomatisieren',
        title: 'Ausschreibungssuche automatisieren – so funktioniert es | Ausschreibungsagenten.de',
        description:
            'So automatisieren Sie die Ausschreibungssuche: 17 Quellen von EU bis Landesportal, Abgleich über CPV, Ort, Wert und Frist – mit Begründung je Treffer.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/ki-angebot-ausschreibung',
        component: 'KiAngebotAusschreibung',
        title: 'KI und Ausschreibungen: was beim Angebot wirklich hilft | Ausschreibungsagenten.de',
        description:
            'Wobei KI bei öffentlichen Ausschreibungen tatsächlich hilft: Anforderungen aus Vergabeunterlagen herauslesen, Nachweise zuordnen, Go/No-Go einschätzen. Und wo die Grenze liegt: Angebotstext und Kalkulation.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/semantische-suche-ausschreibungen',
        component: 'SemantischeSucheAusschreibungen',
        title: 'Semantische Suche bei Ausschreibungen – Begriff und Grenzen | Ausschreibungsagenten.de',
        description:
            'Was semantische Suche bei Ausschreibungen bedeutet, warum Ähnlichkeit bei Vergabeunterlagen kein Nachweis ist und wie erklärbares Matching über CPV, Ausschlüsse und harte Regeln stattdessen arbeitet.',
        prerender: true,
        index: true,
        lastmod: '2026-08-14',
    },
    {
        path: '/impressum',
        component: 'Impressum',
        title: 'Impressum | Ausschreibungsagenten.de',
        description:
            'Anbieterkennzeichnung für ausschreibungsagenten.de, betrieben von der Yawusa UG (haftungsbeschränkt) in Berlin.',
        prerender: true,
        // Rechtsseiten stehen bewusst auf noindex und gehoeren damit auch
        // nicht in die Sitemap.
        index: false,
    },
    {
        path: '/agb',
        component: 'AGB',
        title: 'AGB | Ausschreibungsagenten.de',
        description:
            'Allgemeine Geschäftsbedingungen von ausschreibungsagenten.de: Leistungsumfang, Laufzeit, Vergütung und Pflichten beider Seiten.',
        prerender: true,
        index: false,
    },
    {
        path: '/datenschutz',
        component: 'Datenschutz',
        title: 'Datenschutzerklärung | Ausschreibungsagenten.de',
        description:
            'Datenschutzerklärung von ausschreibungsagenten.de: welche Daten wir verarbeiten, auf welcher Rechtsgrundlage und welche Rechte Ihnen zustehen.',
        prerender: true,
        index: false,
    },
    {
        path: '/disclaimer',
        component: 'Disclaimer',
        title: 'Disclaimer | Ausschreibungsagenten.de',
        description:
            'Haftungsausschluss von ausschreibungsagenten.de: Bekanntmachungsdaten stammen aus fremden Quellen und ersetzen keine Rechtsberatung.',
        prerender: true,
        index: false,
    },
    {
        path: '/checkout-erfolg',
        component: 'CheckoutSuccess',
        title: 'Zahlung abgeschlossen',
        description: 'Bestätigung nach abgeschlossener Zahlung.',
        prerender: false,
        index: false,
    },
    {
        path: '/login',
        component: 'Login',
        title: 'Anmelden',
        description: 'Anmeldung über einen geschützten Magic-Link.',
        prerender: false,
        index: false,
    },
    {
        path: '/login/postfach',
        component: 'CheckEmail',
        title: 'Postfach prüfen',
        description: 'Hinweis auf die versendete Anmelde-E-Mail.',
        prerender: false,
        index: false,
    },
    {
        path: '/login/abgelaufen',
        component: 'MagicHandoffExpired',
        title: 'Link abgelaufen',
        description: 'Der Anmeldelink ist abgelaufen.',
        prerender: false,
        index: false,
    },
    {
        path: '/anmeldung-bestaetigen',
        component: 'MagicHandoff',
        title: 'Anmeldung bestätigen',
        description: 'Übergabe der Anmeldung an den geschützten Bereich.',
        prerender: false,
        index: false,
    },
    {
        path: '/konto',
        component: 'KontoRedirect',
        title: 'Kundenkonto öffnen',
        description: 'Weiterleitung in den geschützten Bereich.',
        prerender: false,
        index: false,
    },
    {
        path: '/abrechnung',
        component: 'AbrechnungRedirect',
        title: 'Abrechnung öffnen',
        description: 'Weiterleitung zur Abrechnung im geschützten Bereich.',
        prerender: false,
        index: false,
    },
]

export const prerenderRoutes = routes.filter((route) => route.prerender)
export const indexableRoutes = routes.filter((route) => route.index)

export function routeByPath(path) {
    return routes.find((route) => route.path === path)
}
