import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function AGB() {
    return (
        <div className="legal-page">
            <Seo path="/agb" />
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Allgemeine Geschäftsbedingungen für Pilot- und Geschäftskunden</h1>
                <p><strong>Stand: 16. Juli 2026</strong></p>

                <h2>§ 1 Anbieter, Geltungsbereich und Zielgruppe</h2>
                <p>
                    Anbieter ist die Yawusa UG (haftungsbeschränkt) i.G., Schliemannstraße 23,
                    10437 Berlin. Diese Bedingungen gelten für die Website sowie individuell vereinbarte Pilot- und
                    Softwareleistungen von Ausschreibungsagenten.de. Das Angebot richtet sich ausschließlich an
                    Unternehmer, juristische Personen des öffentlichen Rechts und öffentlich-rechtliche Sondervermögen.
                    Abweichende Vereinbarungen im individuellen Angebot oder Vertrag gehen diesen AGB vor.
                </p>

                <h2>§ 2 Leistungen und Pilotstatus</h2>
                <p>
                    Der Dienst sammelt Bekanntmachungen aus den jeweils ausgewiesenen öffentlichen Quellen, filtert
                    sie anhand konfigurierter Profile und stellt Treffer, Originalquellen, Fit-Gründe, Go/No-Go-Hilfen,
                    Exporte und freigeschaltete Zusatzfunktionen bereit. Quellenabdeckung und Datenstand werden im
                    Produkt ausgewiesen. Noch nicht produktive Portale, Integrationen und Benachrichtigungskanäle sind
                    nicht geschuldet. Pilotfunktionen können sich während der gemeinsamen Erprobung ändern.
                </p>

                <h2>§ 3 Kein Ersatz für Vergabeprüfung</h2>
                <p>
                    Ergebnisse und Bewertungen sind Arbeitshilfen. Der Dienst garantiert weder Vollständigkeit aller
                    Vergabeplattformen noch Eignung, Zuschlagschance oder rechtzeitige Teilnahme. Maßgeblich sind immer
                    die Originalbekanntmachung, Vergabeunterlagen und Mitteilungen der Vergabestelle. Der Kunde prüft
                    Fristen, Eignung, Anforderungen und Angebotsunterlagen eigenverantwortlich. Rechtsberatung ist nicht
                    Bestandteil der Leistung.
                </p>

                <h2>§ 4 Vertragsschluss und Preise</h2>
                <p>
                    Website, Preisübersicht und Kontaktformulare sind kein verbindliches Vertragsangebot. Der
                    Online-Checkout ist derzeit deaktiviert. Ein kostenpflichtiger Vertrag entsteht nur durch ein
                    individuelles Angebot und dessen Annahme oder eine gesonderte Vereinbarung. Angezeigte Preise
                    verstehen sich netto zuzüglich gesetzlicher Umsatzsteuer, soweit nicht anders angegeben.
                </p>

                <h2>§ 5 Zugang und berechtigte Nutzer</h2>
                <p>
                    Kundenkonten werden durch den Anbieter freigegeben. Die Anmeldung erfolgt per Magic Link an eine
                    autorisierte geschäftliche E-Mail-Adresse. Der Kunde hält sein E-Mail-Konto sicher, verwendet den
                    Zugang nur für berechtigte Personen und meldet vermuteten Missbrauch unverzüglich. Interne
                    Administratoren dürfen den Kundenmandanten zu Support- und Pilotzwecken in einer gekennzeichneten
                    Vorschau einsehen.
                </p>

                <h2>§ 6 Mitwirkung des Kunden</h2>
                <p>
                    Der Kunde stellt zutreffende Profil-, Referenz- und Eignungsangaben bereit, prüft Treffer und hält
                    seine Einstellungen aktuell. Er lädt nur Dateien und Daten hoch, zu deren Verarbeitung er berechtigt
                    ist. Unzulässig sind missbräuchliche Automatisierung, Umgehung technischer Grenzen, Weitergabe von
                    Zugängen und rechtswidrige Inhalte.
                </p>

                <h2>§ 7 Laufzeit, Vergütung und Kündigung</h2>
                <p>
                    Laufzeit, Pilotende, Vergütung, Abrechnungszeitraum und Kündigung richten sich nach dem individuellen
                    Angebot. Ohne abweichende Vereinbarung verlängert sich ein kostenloser Pilot nicht automatisch in
                    einen kostenpflichtigen Vertrag. Gesetzliche Rechte zur außerordentlichen Kündigung bleiben unberührt.
                </p>

                <h2>§ 8 Verfügbarkeit und Änderungen</h2>
                <p>
                    Eine bestimmte Verfügbarkeit wird nur geschuldet, wenn sie ausdrücklich vereinbart ist. Wartung,
                    Sicherheitsmaßnahmen sowie Störungen oder Änderungen externer Vergabequellen können den Dienst
                    vorübergehend einschränken. Wesentliche Änderungen eines bezahlten Leistungsumfangs werden
                    rechtzeitig mitgeteilt.
                </p>

                <h2>§ 9 Datenschutz und Auftragsverarbeitung</h2>
                <p>
                    Es gilt die <Link to="/datenschutz">Datenschutzerklärung</Link>. Soweit der Anbieter
                    personenbezogene Daten im Auftrag des Kunden verarbeitet, schließen die Parteien vor Beginn der
                    betreffenden Verarbeitung eine Vereinbarung nach Art. 28 DSGVO.
                </p>

                <h2>§ 10 Haftung</h2>
                <p>
                    Der Anbieter haftet unbeschränkt bei Vorsatz und grober Fahrlässigkeit, bei Verletzung von Leben,
                    Körper oder Gesundheit sowie nach zwingenden gesetzlichen Vorschriften. Bei leicht fahrlässiger
                    Verletzung wesentlicher Vertragspflichten ist die Haftung auf den vertragstypischen, vorhersehbaren
                    Schaden begrenzt. Im Übrigen ist die Haftung bei leichter Fahrlässigkeit ausgeschlossen.
                </p>

                <h2>§ 11 Schlussbestimmungen</h2>
                <p>
                    Es gilt deutsches Recht. Ist der Kunde Kaufmann, juristische Person des öffentlichen Rechts oder
                    öffentlich-rechtliches Sondervermögen, ist Berlin Gerichtsstand. Änderungen und ergänzende
                    Vereinbarungen bedürfen mindestens der Textform, soweit nicht zwingendes Recht eine andere Form verlangt.
                </p>
            </div>
        </div>
    )
}
