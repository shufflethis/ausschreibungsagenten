import { Link } from 'react-router-dom'
import Icon from './Icon'

// Der Footer trug 24 Links in einer einzigen Reihe. Gruppiert nach dem,
// wonach jemand tatsaechlich sucht: Inhalte zum Thema, Vergleiche mit
// anderen Anbietern, die Maschinenflaechen fuer Entwickler und Agenten,
// und das Unternehmen. Die Rechtstexte stehen unten neben dem Copyright,
// wo man sie erwartet.
const SPALTEN = [
    {
        // Diese Abschnitte der Startseite stehen nicht mehr in der oberen
        // Navigation. Ohne diese Spalte waeren sie von Unterseiten aus nur
        // ueber den Umweg Startseite und Scrollen erreichbar.
        titel: 'Produkt',
        eintraege: [
            { href: '/#funktionen', text: 'Funktionen' },
            { href: '/#branchen', text: 'Branchen' },
            { href: '/#vergleich', text: 'Vergleich' },
            { href: '/#preise', text: 'Preise' },
            { href: '/#faq', text: 'FAQ' },
        ],
    },
    {
        titel: 'Wissen',
        eintraege: [
            { zu: '/ausschreibungssuche-automatisieren', text: 'Suche automatisieren' },
            { zu: '/ki-angebot-ausschreibung', text: 'KI und Angebot' },
            { zu: '/semantische-suche-ausschreibungen', text: 'Semantische Suche' },
        ],
    },
    {
        titel: 'Alternativen',
        eintraege: [
            { zu: '/vergabepilot-alternative', text: 'Vergabepilot Alternative' },
            { zu: '/vergabefix-alternative', text: 'Vergabefix Alternative' },
            { zu: '/tenderflow-alternative', text: 'Tenderflow Alternative' },
        ],
    },
    {
        titel: 'API & Agenten',
        eintraege: [
            { zu: '/entwickler', text: 'Entwickler-Portal' },
            // Direkt auf die Spezifikation, nicht nur auf die Erklaerseite:
            // Agenten und Entwickler suchen die Referenz, und von der
            // Startseite aus war sie bisher gar nicht erreichbar.
            { href: 'https://api.ausschreibungsagenten.de/docs', extern: true, text: 'API-Referenz' },
            { href: '/openapi.json', text: 'OpenAPI' },
            { href: '/agents.md', text: 'Agent Instructions' },
            { href: '/.well-known/api-catalog', text: 'API Catalog' },
            { href: '/.well-known/mcp/server-card.json', text: 'MCP Server Card' },
            { href: '/pricing.md', text: 'Preise (Markdown)' },
        ],
    },
    {
        titel: 'Unternehmen',
        eintraege: [
            { zu: '/ueber-uns', text: 'Über uns' },
            { zu: '/zahlen', text: 'Zahlen & Statistik' },
            { zu: '/status', text: 'Quellenstatus' },
            {
                href: 'https://status.ausschreibungsagenten.de/status/ausschreibungsagenten',
                extern: true,
                text: 'System-Status',
            },
            { zu: '/partner', text: 'Partnerprogramm' },
            { zu: '/brandkit', text: 'Brandkit' },
        ],
    },
]

const RECHTLICHES = [
    { zu: '/impressum', text: 'Impressum' },
    { zu: '/agb', text: 'AGB' },
    { zu: '/datenschutz', text: 'Datenschutz' },
    { zu: '/disclaimer', text: 'Disclaimer' },
]

function Eintrag({ eintrag }) {
    if (eintrag.zu) return <Link to={eintrag.zu}>{eintrag.text}</Link>
    return (
        <a
            href={eintrag.href}
            {...(eintrag.extern ? { target: '_blank', rel: 'noreferrer' } : {})}
        >
            {eintrag.text}
        </a>
    )
}

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__spalten">
                    <div className="footer__marke">
                        <div className="footer__wortmarke">Ausschreibungsagenten.de</div>
                        <p>
                            Öffentliche Ausschreibungen aus 17 Quellen in Deutschland, der EU und
                            Großbritannien — mit nachvollziehbaren Treffergründen.
                        </p>
                        <p className="footer__service">
                            Ein Service von{' '}
                            <a href="https://www.agentifizierung.de/" target="_blank" rel="noreferrer">
                                <strong>Agentifizierung</strong>
                            </a>
                        </p>
                        <a className="footer__chatgpt" href="https://chatgpt.com/plugins/plugin_asdk_app_6a90f63dcf008191ba50c89d48d0fb85?open_in_app" target="_blank" rel="noopener noreferrer">
                            <Icon name="chatgpt" size={24} />
                            <span>Unser ChatGPT-Plugin <span aria-hidden="true">↗</span></span>
                        </a>
                    </div>

                    {SPALTEN.map((spalte) => (
                        <nav className="footer__spalte" key={spalte.titel} aria-label={spalte.titel}>
                            <h2>{spalte.titel}</h2>
                            {spalte.eintraege.map((eintrag) => (
                                <Eintrag eintrag={eintrag} key={eintrag.text} />
                            ))}
                        </nav>
                    ))}
                </div>

                <div className="footer__abschluss">
                    <a className="footer__readiness" href="https://webmcp-tool.com/check/www.ausschreibungsagenten.de" target="_blank" rel="noopener noreferrer">
                        <img src="https://webmcp-tool.com/badge/www.ausschreibungsagenten.de.svg" alt="Aktueller Agent Readiness Score für Ausschreibungsagenten.de, gemessen von webmcp-tool.com" width="208" height="40" loading="lazy" decoding="async" />
                    </a>
                    <nav className="footer__rechtliches" aria-label="Rechtliches">
                        {RECHTLICHES.map((eintrag) => (
                            <Eintrag eintrag={eintrag} key={eintrag.text} />
                        ))}
                    </nav>
                    <div className="footer__copy">
                        © {new Date().getFullYear()} Yawusa UG (haftungsbeschränkt). Alle Rechte
                        vorbehalten. · Ausschreibungsagenten.de – KI-Agenten für öffentliche
                        Ausschreibungen
                    </div>
                </div>
            </div>
        </footer>
    )
}
