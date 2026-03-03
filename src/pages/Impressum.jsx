import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Impressum() {
    return (
        <div className="legal-page">
            <Helmet>
                <title>Impressum | Ausschreibungsagenten.de</title>
                <meta name="description" content="Impressum von ausschreibungsagenten.de – Ein Service von famefact / track by track GmbH, Berlin." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Impressum</h1>

                <h2>Angaben gemäß § 5 DDG</h2>
                <p>
                    track by track GmbH<br />
                    Schliemannstr. 23<br />
                    10437 Berlin
                </p>

                <h2>Vertreten durch</h2>
                <p>Tobias Sander</p>

                <h2>Kontakt</h2>
                <p>
                    E-Mail: <a href="mailto:info@famefact.com">info@famefact.com</a>
                </p>

                <h2>Registereintrag</h2>
                <p>
                    Eintragung im Handelsregister.<br />
                    Registergericht: Amtsgericht Berlin-Charlottenburg<br />
                    Registernummer: HRB 129805 B
                </p>

                <h2>Umsatzsteuer</h2>
                <p>
                    Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:<br />
                    DE814954842
                </p>

                <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p>
                    Tobias Sander<br />
                    Schliemannstr. 23<br />
                    10437 Berlin
                </p>
            </div>
        </div>
    )
}
