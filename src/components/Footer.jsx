import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__brand">
                        Ein Service von{' '}
                        <a href="https://www.agentifizierung.de/" target="_blank" rel="noreferrer">
                            <strong>Agentifizierung</strong>
                        </a>
                    </div>
                    <div className="footer__links">
                        <Link to="/ausschreibungssuche-automatisieren">Suche automatisieren</Link>
                        <Link to="/ki-angebot-ausschreibung">KI und Angebot</Link>
                        <Link to="/semantische-suche-ausschreibungen">Semantische Suche</Link>
                        <Link to="/vergabepilot-alternative">Vergabepilot Alternative</Link>
                        <Link to="/vergabefix-alternative">Vergabefix Alternative</Link>
                        <Link to="/tenderflow-alternative">Tenderflow Alternative</Link>
                        <Link to="/ueber-uns">Über uns</Link>
                        <Link to="/entwickler">API & Agenten</Link>
                        <Link to="/zahlen">Zahlen &amp; Statistik</Link>
                        <Link to="/status">Quellenstatus</Link>
                        <a
                            href="https://status.ausschreibungsagenten.de/status/ausschreibungsagenten"
                            target="_blank"
                            rel="noreferrer"
                        >
                            System-Status
                        </a>
                        <Link to="/brandkit">Brandkit</Link>
                        <Link to="/impressum">Impressum</Link>
                        <Link to="/agb">AGB</Link>
                        <Link to="/datenschutz">Datenschutz</Link>
                        <Link to="/disclaimer">Disclaimer</Link>
                    </div>
                </div>
                <div className="footer__copy">
                    © {new Date().getFullYear()} Yawusa UG (haftungsbeschränkt) Alle Rechte vorbehalten. | Ausschreibungsagenten.de – KI-Agenten für Öffentliche Ausschreibungen
                </div>
            </div>
        </footer>
    )
}
