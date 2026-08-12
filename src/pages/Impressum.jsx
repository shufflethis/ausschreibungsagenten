import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function Impressum() {
    return (
        <div className="legal-page">
            <Seo path="/impressum" />
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Impressum</h1>

                <h2>Angaben gemäß § 5 DDG</h2>
                <p>
                    Yawusa UG (haftungsbeschränkt) i.G.<br />
                    Schliemannstraße 23<br />
                    10437 Berlin<br />
                    Deutschland
                </p>

                <h2>Geschäftsführer</h2>
                <p>Tobias Sander, Thilo Jansen und Gorden Wübbe</p>

                <h2>Kontakt</h2>
                <p>
                    Telefon: <a href="tel:+4930403665430">030 – 403 665 430</a><br />
                    E-Mail: <a href="mailto:hi@ausschreibungsagenten.de">hi@ausschreibungsagenten.de</a>
                </p>

                <h2>Handelsregister</h2>
                <p>
                    Die Gesellschaft befindet sich in Gründung (i.G.). Die Eintragung in das
                    Handelsregister beim Amtsgericht Berlin-Charlottenburg ist beantragt; die
                    Handelsregisternummer wird nach erfolgter Eintragung ergänzt.
                </p>

                <h2>Umsatzsteuer-ID</h2>
                <p>
                    Eine Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG wird nach Erteilung
                    durch das Finanzamt ergänzt.
                </p>

                <h2>Verantwortlich für journalistisch-redaktionelle Inhalte gemäß § 18 Abs. 2 MStV</h2>
                <p>
                    Thilo Jansen<br />
                    Schliemannstraße 23<br />
                    10437 Berlin
                </p>
            </div>
        </div>
    )
}
