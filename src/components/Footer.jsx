import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer__inner">
                    <div className="footer__brand">
                        Ein Service von <strong>famefact</strong> | track by track GmbH, Berlin
                    </div>
                    <div className="footer__links">
                        <Link to="/impressum">Impressum</Link>
                        <Link to="/agb">AGB</Link>
                        <Link to="/datenschutz">Datenschutz</Link>
                        <Link to="/disclaimer">Disclaimer</Link>
                    </div>
                </div>
                <div className="footer__copy">
                    © {new Date().getFullYear()} track by track GmbH. Alle Rechte vorbehalten. | Ausschreibungsagenten.de – KI-Agenten für Öffentliche Ausschreibungen
                </div>
            </div>
        </footer>
    )
}
