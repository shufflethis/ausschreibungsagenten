import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function AGB() {
    return (
        <div className="legal-page">
            <Helmet>
                <title>AGB | Ausschreibungsagenten.de</title>
                <meta name="description" content="Allgemeine Geschäftsbedingungen von ausschreibungsagenten.de." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Allgemeine Geschäftsbedingungen (AGB)</h1>

                <h2>§ 1 Geltungsbereich</h2>
                <p>Diese Allgemeinen Geschäftsbedingungen gelten für die Nutzung der Webseite ausschreibungsagenten.de, betrieben von der track by track GmbH, Schliemannstr. 23, 10437 Berlin (nachfolgend „Anbieter"). Mit der Nutzung der Webseite erkennt der Nutzer diese AGB an.</p>

                <h2>§ 2 Leistungsbeschreibung</h2>
                <p>Der Anbieter stellt auf ausschreibungsagenten.de Informationen, Vergleiche und redaktionelle Inhalte zum Thema öffentliche Ausschreibungen und Vergabe-Software zur Verfügung. Die Webseite dient als Informationsportal und kann auf Produkte und Dienstleistungen Dritter verweisen.</p>

                <h2>§ 3 Vertragsschluss</h2>
                <p>Die auf der Webseite dargestellten Informationen stellen kein verbindliches Angebot dar. Durch die Nutzung von Kontaktformularen oder Newsletter-Anmeldungen kommt kein Vertrag über kostenpflichtige Leistungen zustande, sofern nicht ausdrücklich anders vereinbart.</p>

                <h2>§ 4 Affiliate-Links und Provisionen</h2>
                <p>Die Webseite kann Links zu Produkten und Dienstleistungen Dritter enthalten. Für Vermittlungen über solche Links kann der Anbieter eine Provision erhalten. Dies beeinflusst nicht die redaktionelle Unabhängigkeit der Inhalte und Vergleiche.</p>

                <h2>§ 5 Newsletter</h2>
                <p>Mit der Anmeldung zum Newsletter erklärt sich der Nutzer damit einverstanden, regelmäßig E-Mails mit Informationen zu öffentlichen Ausschreibungen und verwandten Themen zu erhalten. Die Abmeldung ist jederzeit über den Link in jeder E-Mail möglich.</p>

                <h2>§ 6 Haftungsbeschränkung</h2>
                <p>Die Inhalte der Webseite werden mit größtmöglicher Sorgfalt erstellt. Der Anbieter übernimmt jedoch keine Gewähr für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen, insbesondere der Vergleichsdaten zu Drittanbieter-Tools. Für Schäden, die durch die Nutzung der Webseite entstehen, haftet der Anbieter nur bei Vorsatz und grober Fahrlässigkeit.</p>

                <h2>§ 7 Urheberrecht</h2>
                <p>Alle Inhalte der Webseite unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des Anbieters.</p>

                <h2>§ 8 Datenschutz</h2>
                <p>Die Erhebung und Verarbeitung personenbezogener Daten erfolgt gemäß unserer <Link to="/datenschutz">Datenschutzerklärung</Link>.</p>

                <h2>§ 9 Schlussbestimmungen</h2>
                <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin. Sollten einzelne Bestimmungen dieser AGB unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen davon unberührt.</p>
            </div>
        </div>
    )
}
