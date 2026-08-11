// Gemeinsame Quelle fuer Routing, Prerendering, Meta-Daten und Sitemap.
// Bewusst reines JavaScript ohne JSX, damit die Build-Skripte es direkt
// importieren koennen.

export const SITE_ORIGIN = 'https://www.ausschreibungsagenten.de'

export const routes = [
    {
        path: '/',
        component: 'LandingPage',
        title: 'Ausschreibungsagenten.de – KI-Agenten für öffentliche Ausschreibungen',
        description:
            'Öffentliche Ausschreibungen aus 17 Live-Quellen finden und nachvollziehbar filtern: TED, oeffentlichevergabe.de, service.bund.de, DTVP, RIB und die Landesportale.',
        prerender: true,
        index: true,
    },
    {
        path: '/ueber-uns',
        component: 'UeberUns',
        title: 'Über uns – die Menschen hinter den Ausschreibungsagenten',
        description:
            'Wer hinter Ausschreibungsagenten.de steht: Team, Haltung und warum Entscheidungen über Ausschreibungen nachvollziehbar bleiben müssen.',
        prerender: true,
        index: true,
    },
    {
        path: '/entwickler',
        component: 'Entwickler',
        title: 'Entwickler – Agent API, A2A und MCP für Ausschreibungsdaten',
        description:
            'Schnittstellen für Entwickler: Agent API, A2A Agent Card und MCP-Anbindung an die Ausschreibungssuche über 17 Quellen.',
        prerender: true,
        index: true,
    },
    {
        path: '/status',
        component: 'Status',
        title: 'Systemstatus – Datenstand aller 17 Ausschreibungsquellen',
        description:
            'Live-Status jeder angebundenen Quelle mit letztem erfolgreichem Abruf: TED, oeffentlichevergabe.de, service.bund.de, DTVP, RIB und die Landesportale.',
        prerender: true,
        index: true,
    },
    {
        path: '/impressum',
        component: 'Impressum',
        title: 'Impressum – Yawusa UG (haftungsbeschränkt) i.G.',
        description:
            'Anbieterkennzeichnung nach § 5 DDG für Ausschreibungsagenten.de, betrieben von der Yawusa UG (haftungsbeschränkt) i.G. in Berlin.',
        prerender: true,
        index: true,
    },
    {
        path: '/agb',
        component: 'AGB',
        title: 'Allgemeine Geschäftsbedingungen',
        description:
            'Die Geschäftsbedingungen für die Nutzung von Ausschreibungsagenten.de: Leistungsumfang, Laufzeit, Vergütung und Pflichten beider Seiten.',
        prerender: true,
        index: true,
    },
    {
        path: '/datenschutz',
        component: 'Datenschutz',
        title: 'Datenschutzerklärung',
        description:
            'Welche Daten Ausschreibungsagenten.de verarbeitet, auf welcher Rechtsgrundlage, wie lange sie gespeichert werden und welche Rechte Ihnen zustehen.',
        prerender: true,
        index: true,
    },
    {
        path: '/disclaimer',
        component: 'Disclaimer',
        title: 'Haftungsausschluss',
        description:
            'Grenzen der Angaben auf Ausschreibungsagenten.de: Bekanntmachungsdaten stammen aus fremden Quellen und ersetzen keine Rechtsberatung.',
        prerender: true,
        index: true,
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
