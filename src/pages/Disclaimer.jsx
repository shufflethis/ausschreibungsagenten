import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function Disclaimer() {
    return (
        <div className="legal-page">
            <Seo path="/disclaimer" />
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Disclaimer – Haftungsausschluss</h1>

                <h2>Haftung für Inhalte</h2>
                <p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Eine Gewähr für Richtigkeit, Vollständigkeit und Aktualität kann nur übernommen werden, soweit dies ausdrücklich vertraglich vereinbart oder gesetzlich zwingend vorgeschrieben ist. Für eigene Inhalte gelten die allgemeinen Gesetze; für fremde Inhalte und Links gelten die gesetzlichen Haftungsregelungen.</p>

                <h2>Haftung für Links</h2>
                <p>Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.</p>

                <h2>Keine Rechtsberatung</h2>
                <p>Die auf dieser Webseite bereitgestellten Informationen zum Vergaberecht, zu Schwellenwerten, Fristen und Verfahrensarten dienen ausschließlich der allgemeinen Information und stellen keine Rechtsberatung dar. Für verbindliche Auskünfte zum Vergaberecht wenden Sie sich bitte an einen Fachanwalt für Vergaberecht.</p>

                <h2>Vergleichsinformationen</h2>
                <p>Die auf dieser Webseite dargestellten Vergleiche von Software-Tools und Plattformen basieren auf öffentlich zugänglichen Informationen und eigener Recherche. Preise, Funktionen und Verfügbarkeit können sich jederzeit ändern. Wir empfehlen, vor einer Kaufentscheidung die aktuellen Informationen direkt beim jeweiligen Anbieter zu prüfen.</p>

                <h2>Urheberrecht</h2>
                <p>Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.</p>
            </div>
        </div>
    )
}
