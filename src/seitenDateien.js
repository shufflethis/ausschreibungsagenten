// Welche Datei unter src/pages welche Seite liefert - die eine Quelle fuer
// drei Verbraucher: das Server-Rendern (alle Seiten fest eingebunden), den
// Browser (jede Seite als eigener, nachgeladener Baustein) und das
// Prerender-Skript (modulepreload fuer den Baustein der jeweiligen Route).
// Bewusst reines JavaScript ohne JSX, wie routes.js.
//
// `name` waehlt einen benannten Export, `props` gibt feste Eigenschaften mit.
const inhalt = (name) => ({ datei: 'Inhaltsseiten', name })

export const seitenDateien = {
    LandingPage: { datei: 'LandingPage' },
    UeberUns: { datei: 'UeberUns' },
    Entwickler: { datei: 'Entwickler' },
    Status: { datei: 'Status' },
    Brandkit: { datei: 'Brandkit' },
    Zahlen: { datei: 'Zahlen' },
    AusschreibungssucheAutomatisieren: inhalt('AusschreibungssucheAutomatisieren'),
    KiAngebotAusschreibung: inhalt('KiAngebotAusschreibung'),
    SemantischeSucheAusschreibungen: inhalt('SemantischeSucheAusschreibungen'),
    VergabepilotAlternative: inhalt('VergabepilotAlternative'),
    VergabefixAlternative: inhalt('VergabefixAlternative'),
    TenderflowAlternative: inhalt('TenderflowAlternative'),
    Partnerprogramm: inhalt('Partnerprogramm'),
    BesteSoftwareAutomatischeAusschreibungssuche: inhalt('BesteSoftwareAutomatischeAusschreibungssuche'),
    BauauftraegeFinden: inhalt('BauauftraegeFinden'),
    Impressum: { datei: 'Impressum' },
    AGB: { datei: 'AGB' },
    Datenschutz: { datei: 'Datenschutz' },
    Disclaimer: { datei: 'Disclaimer' },
    CheckoutSuccess: { datei: 'CheckoutSuccess' },
    Login: { datei: 'Login' },
    CheckEmail: { datei: 'CheckEmail' },
    MagicHandoffExpired: { datei: 'MagicHandoff', props: { expired: true } },
    MagicHandoff: { datei: 'MagicHandoff' },
    KontoRedirect: { datei: 'AppRedirect', props: { path: '/app', title: 'Kundenkonto öffnen' } },
    AbrechnungRedirect: { datei: 'AppRedirect', props: { path: '/app/billing', title: 'Abrechnung öffnen' } },
}

export const seitenPfad = (datei) => `./pages/${datei}.jsx`
