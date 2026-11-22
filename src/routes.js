// Gemeinsame Quelle fuer Routing, Prerendering, Meta-Daten und Sitemap.
// Bewusst reines JavaScript ohne JSX, damit die Build-Skripte es direkt
// importieren koennen.

export const SITE_ORIGIN = 'https://www.ausschreibungsagenten.de'

export const routes = [
    {
        path: '/',
        component: 'LandingPage',
        title: 'Ausschreibungsagenten.de – Ausschreibungen automatisch finden',
        description:
            'Öffentliche Ausschreibungen aus 18 Live-Quellen finden: TED, Bund, DTVP und Landesportale. Erklärbares Profil-Matching mit Begründung je Treffer.',
        prerender: true,
        index: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/preise',
        component: 'Preise',
        title: 'Preise & kostenfreie Pilotphase | Ausschreibungsagenten.de',
        description:
            'Alle Tarife und API-Limits im Überblick: kostenfreie Pilotphase (0 €), Free API-Key, Pro (149 €/Monat), Agent (499 €/Monat) und Verfahrensbegleitung.',
        prerender: true,
        index: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/ueber-uns',
        component: 'UeberUns',
        title: 'Über uns – Team aus Berlin | Ausschreibungsagenten.de',
        description:
            'Die drei Geschäftsführer hinter Ausschreibungsagenten.de (Yawusa UG, Berlin): EU-Hosting, 18 belegte Quellen und persönliche Pilotbetreuung.',
        ogImage: '/hero/team-ausschreibungsagenten-im-austausch.webp',
        prerender: true,
        index: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/entwickler',
        component: 'Entwickler',
        title: 'Ausschreibungsagenten API-Dokumentation – REST, MCP & A2A',
        description:
            'Öffentliche Ausschreibungen per API und KI-Agent abfragen: REST, MCP, A2A Agent Card und OpenAPI. 18 Live-Quellen, Free-API-Key und klare Limits.',
        ogImage: '/hero/entwickler-arbeitet-an-ausschreibungs-api.webp',
        prerender: true,
        index: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/status',
        component: 'Status',
        title: 'Quellenstatus & EU-Abdeckung | Ausschreibungsagenten.de',
        description:
            'Live-Status aller 18 angebundenen Vergabeportale: letzter Abruf, Anbindungsart und Tender-Zahlen je Land. Transparent statt pauschaler Zahlen.',
        prerender: true,
        index: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungssuche-automatisieren',
        component: 'AusschreibungssucheAutomatisieren',
        title: 'Ausschreibungssuche automatisieren | Ausschreibungsagenten',
        description:
            'So automatisieren Sie die Ausschreibungssuche über 18 Quellen von TED bis Landesportal: CPV-Codes, Ausschlüsse, Region und Begründung je Treffer.',
        ogImage: '/hero/ausschreibungssuche-automatisieren-laptop.webp',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-14',
        lastmod: '2026-11-22',
    },
    {
        path: '/ki-angebot-ausschreibung',
        component: 'KiAngebotAusschreibung',
        title: 'KI und Ausschreibungen: was beim Angebot wirklich hilft',
        description:
            'Wo KI bei Ausschreibungen wirklich hilft: Anforderungen prüfen, Nachweise zuordnen, Go/No-Go und GAEB X83/X84 – ohne Risiko beim Angebotstext.',
        ogImage: '/hero/ki-angebot-ausschreibung-planung.webp',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-14',
        lastmod: '2026-11-22',
    },
    {
        path: '/semantische-suche-ausschreibungen',
        component: 'SemantischeSucheAusschreibungen',
        title: 'Semantische Suche bei Ausschreibungen – Grenzen & Regeln',
        description:
            'Was semantische Suche bei Ausschreibungen leistet, wo Ähnlichkeitswerte versagen und wie erklärbares Matching über CPV und Ausschlüsse arbeitet.',
        ogImage: '/hero/semantische-suche-ausschreibungen-besprechung.webp',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-14',
        lastmod: '2026-11-22',
    },
    {
        path: '/vergabepilot-alternative',
        component: 'VergabepilotAlternative',
        title: 'Vergabepilot Alternative: erklärbares Matching statt KI-Score',
        description:
            'Vergabepilot-Alternative gesucht? CPV-Codes, Regeln und Ausschlüsse statt Ähnlichkeitswert – mit Begründung je Treffer, 18 Quellen und EU-Hosting.',
        ogImage: '/hero/vergabepilot-alternative-besprechung.webp',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-18',
        lastmod: '2026-11-22',
    },
    {
        path: '/dtad-alternative',
        component: 'DtadAlternative',
        title: 'DTAD Alternative: offene Preise & erklärbares Matching',
        description:
            'DTAD-Alternative für öffentliche Ausschreibungen: 18 belegte Quellen, Begründung je Treffer, offene Tarife ab 149 € (Pilot 0 €), REST-API & MCP.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/vergabe24-alternative',
        component: 'Vergabe24Alternative',
        title: 'Vergabe24 Alternative: erklärbares Matching & offene Preise',
        description:
            'Vergabe24-Alternative gesucht? 18 belegte Quellen im Quellenstatus, Begründung je Treffer, GAEB-Viewer, REST-API & MCP – ab 149 € (Pilot 0 €).',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ibau-alternative',
        component: 'IbauAlternative',
        title: 'ibau Alternative: öffentliche Bauaufträge mit klaren Preisen',
        description:
            'ibau-Alternative für öffentliche Bauaufträge: 18 Live-Quellen, CPV-Filter (Abteilung 45), kostenloser GAEB-Viewer & offene Tarife ab 149 €.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/vergabefix-alternative',
        component: 'VergabefixAlternative',
        title: 'Vergabefix Alternative: 18 belegte Quellen mit Begründung',
        description:
            'Vergabefix-Alternative mit erklärbarem Matching: 18 benannte Quellen mit offenem Abrufstand, Begründung je Treffer und kostenfreie Pilotphase.',
        ogImage: '/hero/vergabefix-alternative-team.webp',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-18',
        lastmod: '2026-11-22',
    },
    {
        path: '/tenderflow-alternative',
        component: 'TenderflowAlternative',
        title: 'Tenderflow Alternative: Begründung statt Prozentversprechen',
        description:
            'Tenderflow-Alternative gesucht? 18 belegte Quellen, Go/No-Go-Gründe je Treffer ohne pauschale Aufwandsversprechen, EU-Hosting, Pilot 0 €.',
        ogImage: '/hero/tenderflow-alternative-laptop.webp',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-18',
        lastmod: '2026-11-22',
    },
    {
        path: '/zahlen',
        component: 'Zahlen',
        title: 'Vergabemarkt Deutschland in Zahlen & Statistik 2026',
        description:
            'Belegte Zahlen zum deutschen Vergabemarkt: 500 Mrd. € (OECD), 135,2 Mrd. € (Destatis 2024), 88.817 EU-Verfahren und Eignungskriterien-Auswertung.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-08-14',
        lastmod: '2026-11-22',
    },
    {
        path: '/partner',
        component: 'Partnerprogramm',
        title: 'Partnerprogramm: 20 % wiederkehrend | Ausschreibungsagenten',
        description:
            '20 % netto wiederkehrend, 60 Tage Zuordnung (First-Touch), 30 Tage Sperrfrist. Faire Bedingungen ohne Klick-Vergütung – offen dokumentiert.',
        prerender: true,
        index: true,
        lastmod: '2026-08-20',
    },
    {
        path: '/beste-software-automatische-ausschreibungssuche',
        component: 'BesteSoftwareAutomatischeAusschreibungssuche',
        title: 'Beste Software für automatische Ausschreibungssuche (2026)',
        description:
            'Welche Ausschreibungssoftware passt zu welchem Use Case? DTAD, Vergabepilot, Patterno, TED, ibau, subreport und Ausschreibungsagenten.de im Vergleich.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-10-08',
        lastmod: '2026-11-22',
    },
    {
        path: '/bauauftraege-finden',
        component: 'BauauftraegeFinden',
        title: 'Bauaufträge finden: Ausschreibungen nach Gewerk & Region',
        description:
            'Öffentliche Bauaufträge nach CPV-Gewerk und Leistungsort finden: Hochbau bis Elektro/SHK, Fachlose für Handwerk und Subunternehmer, 18 Live-Quellen.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-05',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-it',
        component: 'AusschreibungenIt',
        title: 'IT-Ausschreibungen finden: Software, Cloud & Beratung',
        description:
            'Öffentliche IT- & Software-Ausschreibungen (CPV 72 & 48) aus 18 Live-Quellen: EVB-IT, EU-Schwellenwerte 2026/27, Eignungsnachweise & API/MCP.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-architektur',
        component: 'AusschreibungenArchitektur',
        title: 'Ausschreibungen Architektur & Ingenieurbüros (CPV 71, VgV)',
        description:
            'Architektur- & Planungs-Ausschreibungen (CPV 71) über 18 Live-Quellen: VgV-Teilnahmefristen, Objektplanung, Tragwerk, TGA & Eignungskriterien.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-marketing',
        component: 'AusschreibungenMarketing',
        title: 'Ausschreibungen Marketing, PR & Digital-Agenturen (CPV 79)',
        description:
            'Öffentliche Marketing-, PR- & Web-Ausschreibungen (CPV 79 & 7240) aus 18 Live-Quellen: Qualitätskriterien, Rahmenverträge & erklärbare Gründe.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-elektro-shk',
        component: 'AusschreibungenElektroShk',
        title: 'Ausschreibungen Elektro, SHK & TGA-Handwerk (CPV 453)',
        description:
            'Öffentliche Aufträge für Elektro, Heizung, Sanitär, Lüftung & Dämmung (CPV 453) aus 18 Live-Quellen – mit Fachlosen & GAEB-X83/X84-Viewer.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-nrw',
        component: 'AusschreibungenNrw',
        title: 'Ausschreibungen NRW: Vergabemarktplatz, TED & Kommunen',
        description:
            'Öffentliche Ausschreibungen in Nordrhein-Westfalen: Landesportal NRW, Datenservice Öffentlicher Einkauf, DTVP & TED – nach Leistungsort & CPV.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-bayern',
        component: 'AusschreibungenBayern',
        title: 'Ausschreibungen Bayern: Landesportal, TED & Kommunen',
        description:
            'Öffentliche Ausschreibungen in Bayern finden: Landesportal Bayern, TED, DTVP, RIB & Bund in 18 Live-Quellen – nach Gewerk, CPV & Region.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-berlin',
        component: 'AusschreibungenBerlin',
        title: 'Ausschreibungen Berlin: Land, Bund & EU-Verfahren finden',
        description:
            'Öffentliche Ausschreibungen in Berlin: Bundesbehörden (140.000 € Schwelle), Datenservice Öffentlicher Einkauf, DTVP & TED – inkl. BerlAVG-Infos.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-hessen',
        component: 'AusschreibungenHessen',
        title: 'Ausschreibungen Hessen: HAD, Landesportal & TED finden',
        description:
            'Öffentliche Ausschreibungen in Hessen: Landesportal Hessen, Rhein-Neckar, TED, DTVP & Bund in 18 Live-Quellen – nach Leistungsort & HVTG.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/ausschreibungen-baden-wuerttemberg',
        component: 'AusschreibungenBadenWuerttemberg',
        title: 'Ausschreibungen Baden-Württemberg: Landesportale & TED',
        description:
            'Öffentliche Ausschreibungen in Baden-Württemberg: beide BW-Landesportale, Rhein-Neckar, TED & Bund in 18 Live-Quellen – nach CPV & Region.',
        prerender: true,
        index: true,
        article: true,
        published: '2026-11-22',
        lastmod: '2026-11-22',
    },
    {
        path: '/gaeb-viewer',
        component: 'GaebViewer',
        title: 'GAEB-Viewer kostenlos: X83 & X84 im Browser öffnen',
        description:
            'Kostenloser GAEB-Viewer für X81, X83, X84 und X86: Leistungsverzeichnisse 100 % lokal im Browser öffnen, filtern und als Excel-CSV exportieren.',
        prerender: true,
        index: true,
        tool: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/cpv-code-suche',
        component: 'CpvSuche',
        title: 'CPV-Code-Suche: CPV-Codes nach Gewerk & Branche finden',
        description:
            'CPV-Codes schnell nach Gewerk oder Code finden – von Bau (45) über Architektur (71) bis IT (72) – mit direktem Sprung in 18 Live-Quellen.',
        prerender: true,
        index: true,
        tool: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/eu-schwellenwerte',
        component: 'EuSchwellenwerte',
        title: 'EU-Schwellenwerte 2026/2027: Tabelle & Rechner (netto)',
        description:
            'Aktuelle EU-Schwellenwerte 2026/2027 im Vergaberecht: 5.404.000 € Bau, 216.000 € klassisch, 140.000 € Bund, 432.000 € Sektoren – mit Rechner.',
        prerender: true,
        index: true,
        tool: true,
        lastmod: '2026-11-22',
    },
    {
        path: '/brandkit',
        component: 'Brandkit',
        title: 'Brandkit – Logo, Farben & Schreibweise | Ausschreibungsagenten',
        description:
            'Logo-Dateien (SVG/PNG), Farbpalette, Typografie und Schreibweise von Ausschreibungsagenten.de zum Download für Presse, Partner und Integrationen.',
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
        title: 'Checkout abgeschlossen | Ausschreibungsagenten.de',
        description:
            'Sie sind von Stripe zurückgekehrt. Den verbindlichen Abostatus zeigt das Kundenkonto nach Verarbeitung der Zahlungsbestätigung.',
        prerender: false,
        index: false,
    },
    {
        path: '/login',
        component: 'Login',
        title: 'Login | Ausschreibungsagenten.de',
        description: 'Anmeldung über einen Anmeldelink per E-Mail.',
        prerender: false,
        index: false,
    },
    {
        path: '/login/postfach',
        component: 'CheckEmail',
        title: 'Postfach prüfen | Ausschreibungsagenten.de',
        description: 'Hinweis auf die versendete Anmelde-E-Mail.',
        prerender: false,
        index: false,
    },
    {
        path: '/login/abgelaufen',
        component: 'MagicHandoffExpired',
        title: 'Link abgelaufen | Ausschreibungsagenten.de',
        description: 'Der Anmeldelink ist abgelaufen.',
        prerender: false,
        index: false,
    },
    {
        path: '/anmeldung-bestaetigen',
        component: 'MagicHandoff',
        title: 'Anmeldung bestätigen | Ausschreibungsagenten.de',
        description: 'Übergabe der Anmeldung an den geschützten Bereich.',
        prerender: false,
        index: false,
    },
    {
        path: '/konto',
        component: 'KontoRedirect',
        title: 'Kundenkonto öffnen | Ausschreibungsagenten.de',
        description: 'Weiterleitung in den geschützten Bereich.',
        prerender: false,
        index: false,
    },
    {
        path: '/abrechnung',
        component: 'AbrechnungRedirect',
        title: 'Abrechnung öffnen | Ausschreibungsagenten.de',
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
