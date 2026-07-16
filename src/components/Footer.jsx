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
                        <Link to="/ueber-uns">Über uns</Link>
                        <Link to="/impressum">Impressum</Link>
                        <Link to="/agb">AGB</Link>
                        <Link to="/datenschutz">Datenschutz</Link>
                        <Link to="/disclaimer">Disclaimer</Link>
                    </div>
                </div>
                <div className="footer__copy">
                    © {new Date().getFullYear()} Agentifizierung UG (haftungsbeschränkt) i.G. Alle Rechte vorbehalten. | Ausschreibungsagenten.de – KI-Agenten für Öffentliche Ausschreibungen
                </div>
            </div>
        </footer>
    )
}
