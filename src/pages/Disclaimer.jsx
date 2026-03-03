import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Disclaimer() {
    return (
        <div className="legal-page">
            <Helmet>
                <title>Disclaimer | Ausschreibungsagenten.de</title>
                <meta name="description" content="Haftungsausschluss und Disclaimer von ausschreibungsagenten.de." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Disclaimer – Haftungsausschluss</h1>

                <h2>Haftung für Inhalte</h2>
                <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir gemäß § 7 Abs. 1 DDG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 DDG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.</p>

                <h2>Haftung für Links</h2>
                <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.</p>

                <h2>Keine Rechtsberatung</h2>
                <p>Die auf dieser Webseite bereitgestellten Informationen zum Vergaberecht, zu Schwellenwerten, Fristen und Verfahrensarten dienen ausschließlich der allgemeinen Information und stellen keine Rechtsberatung dar. Für verbindliche Auskünfte zum Vergaberecht wenden Sie sich bitte an einen Fachanwalt für Vergaberecht.</p>

                <h2>Vergleichsinformationen</h2>
                <p>Die auf dieser Webseite dargestellten Vergleiche von Software-Tools und Plattformen basieren auf öffentlich zugänglichen Informationen und eigener Recherche. Preise, Funktionen und Verfügbarkeit können sich jederzeit ändern. Wir empfehlen, vor einer Kaufentscheidung die aktuellen Informationen direkt beim jeweiligen Anbieter zu prüfen.</p>

                <h2>Affiliate-Hinweis</h2>
                <p>Diese Webseite enthält Affiliate-Links. Das bedeutet: Wenn Sie über einen solchen Link ein Produkt oder eine Dienstleistung erwerben, erhalten wir möglicherweise eine Provision vom Anbieter. Für Sie entstehen dadurch keine zusätzlichen Kosten. Affiliate-Partnerschaften haben keinen Einfluss auf die redaktionelle Bewertung der vorgestellten Tools und Plattformen.</p>

                <h2>Urheberrecht</h2>
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            </div>
        </div>
    )
}
