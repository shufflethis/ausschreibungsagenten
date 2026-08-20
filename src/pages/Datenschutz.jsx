import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function Datenschutz() {
    return (
        <div className="legal-page">
            <Seo path="/datenschutz" />
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Datenschutzerklärung</h1>
                <p><strong>Stand: 20. August 2026</strong></p>

                <h2>1. Verantwortlicher</h2>
                <p>
                    Yawusa UG (haftungsbeschränkt)<br />
                    Schliemannstraße 23, 10437 Berlin<br />
                    E-Mail: <a href="mailto:hi@ausschreibungsagenten.de">hi@ausschreibungsagenten.de</a>
                </p>

                <h2>2. Hosting und Serverprotokolle</h2>
                <p>
                    Die öffentliche Website wird über Vercel Inc. bereitgestellt. Beim Abruf können insbesondere
                    IP-Adresse, Zeitpunkt, aufgerufene Ressource, Referrer, Browser- und Geräteinformationen in
                    technischen Protokollen verarbeitet werden. Vercel ist ein US-Anbieter; eine Verarbeitung in
                    oder Übermittlung in Drittländer kann nicht ausgeschlossen werden. Grundlage sind Art. 6 Abs. 1
                    lit. f DSGVO sowie die mit dem Dienstleister vereinbarten Datenschutzgarantien.
                </p>
                <p>
                    Das geschützte Kundenportal und der Ausschreibungsindex werden auf einem getrennten VPS in
                    Deutschland betrieben. Dort werden technische Zugriffs- und Fehlerprotokolle zur Sicherheit,
                    Fehleranalyse und Stabilität verarbeitet. Protokolle werden nur so lange aufbewahrt, wie dies für
                    diese Zwecke oder gesetzliche Nachweise erforderlich ist.
                </p>

                <h2>3. Kontakt- und Pilotanfragen</h2>
                <p>
                    Bei Kontakt- oder Pilotanfragen verarbeiten wir die eingegebenen Kontakt-, Unternehmens- und
                    Leistungsdaten zur Bearbeitung und Vertragsanbahnung nach Art. 6 Abs. 1 lit. b DSGVO. Anfragen
                    werden per Resend übermittelt und können zusätzlich in unserem Slack-Workspace eingehen. Resend
                    und Slack sind US-Anbieter; dabei können Daten unter Einsatz geeigneter Garantien, insbesondere
                    EU-Standardvertragsklauseln, in Drittländer übermittelt werden. Über das öffentliche Formular wird
                    kein Kundenkonto und kein öffentlich zugänglicher Pilot-Link erzeugt.
                </p>

                <h2>4. Kundenkonto und Magic Link</h2>
                <p>
                    Für freigegebene Pilot- und Kundenkonten verarbeiten wir geschäftliche E-Mail-Adresse,
                    Organisations- und Rollenbezug, Suchprofile, Einstellungen sowie Anmelde-, Sitzungs- und
                    Sicherheitsereignisse. Magic Links sind kurzlebig und einmal verwendbar; Token und Sessions
                    werden nur als Hashwerte gespeichert. Service-E-Mails werden über Resend versendet. Die
                    Verarbeitung erfolgt zur Vertragsdurchführung und Systemsicherheit nach Art. 6 Abs. 1 lit. b und
                    lit. f DSGVO.
                </p>

                <h2>5. Suchprofile, Ausschreibungen und Dokumente</h2>
                <p>
                    Im Kundenportal können Leistungsprofile, Regionen, Referenzen, Präqualifikationsangaben,
                    Go/No-Go-Regeln, interne Notizen und Entscheidungen gespeichert werden. Hochgeladene GAEB-Dateien
                    werden zur angeforderten Analyse verarbeitet; eine dauerhafte Speicherung der Originaldatei ist
                    nicht vorgesehen. Bitte laden Sie keine nicht erforderlichen personenbezogenen oder vertraulichen
                    Daten hoch.
                </p>

                <h2>6. E-Mail-Digests</h2>
                <p>
                    Treffer-Digests werden nur für freigegebene Pilotnutzer und konfigurierte Empfänger versendet.
                    Häufigkeit und Empfänger können im Kundenkonto geändert werden. Service-Digests dienen der
                    Durchführung des Pilot- oder Kundenvertrags und sind keine allgemeine Newsletter-Anmeldung.
                </p>

                <h2>7. Zahlungsabwicklung</h2>
                <p>
                    Der Online-Checkout ist derzeit nicht freigeschaltet. Bei späterer Aktivierung erfolgt die
                    Zahlungsabwicklung über Stripe Payments Europe Ltd. Wir erhalten keine vollständigen Karten- oder
                    Bankdaten, sondern nur die für Vertrag, Tarif, Zahlung und Rechnungszugriff erforderlichen
                    Referenzen und Statusinformationen. Vor Aktivierung werden diese Hinweise bei Bedarf aktualisiert.
                </p>

                <h2>8. Partnerprogramm und Empfehlungslinks</h2>
                <p>
                    Partner unseres Empfehlungsprogramms verlinken auf diese Website mit einem Parameter
                    <code>?via=</code>, der ihre Partnerkennung enthält. Nur wenn dieser Parameter in der
                    aufgerufenen Adresse steht, fragen wir Sie, ob wir die Kennung speichern dürfen. Ohne
                    Partnerlink erscheint diese Abfrage nicht, und es wird kein Cookie gesetzt.
                </p>
                <p>
                    Stimmen Sie zu, speichern wir ein Cookie mit dem Namen <code>aa_partner</code>. Es enthält
                    ausschließlich die Partnerkennung — keine Angaben zu Ihrem Verhalten auf der Website. Das
                    Cookie gilt für ausschreibungsagenten.de einschließlich der Unterdomains und wird nach
                    60 Tagen automatisch ungültig. Ist bereits eine Kennung gespeichert, bleibt diese erhalten
                    und wird nicht durch eine spätere ersetzt. Zusätzlich hinterlegen wir Ihre Entscheidung —
                    Zustimmung wie Ablehnung — im lokalen Speicher Ihres Browsers unter dem Schlüssel
                    <code>aa_partner_einwilligung</code>, damit wir Sie nicht erneut fragen.
                </p>
                <p>
                    Zweck ist allein die Zuordnung eines späteren Vertragsabschlusses zu dem Partner, der Sie
                    empfohlen hat, damit dieser seine Provision erhält. Kommt ein Vertrag zustande, geben wir
                    die Kennung als Referenz an die Zahlungsabwicklung weiter und verarbeiten sie in unserer
                    Partnerverwaltung zur Provisionsabrechnung. Rechtsgrundlage ist Ihre Einwilligung nach
                    § 25 Abs. 1 TDDDG und Art. 6 Abs. 1 lit. a DSGVO.
                </p>
                <p>
                    Sie können Ihre Einwilligung jederzeit mit Wirkung für die Zukunft widerrufen, indem Sie
                    das Cookie und den genannten Eintrag im lokalen Speicher über die Einstellungen Ihres
                    Browsers löschen. Eine bereits erfolgte Zuordnung bleibt davon unberührt, soweit sie für
                    die Abrechnung mit dem Partner erforderlich ist.
                </p>

                <h2>9. Externe Quellen und Links</h2>
                <p>
                    Das Portal verlinkt auf öffentliche Vergabeplattformen und weitere externe Websites. Erst beim
                    Öffnen eines solchen Links gelten die Datenschutzbestimmungen des jeweiligen Anbieters. Auf der
                    öffentlichen Website sind derzeit weder externe Google Fonts noch ein Webanalyse-Skript eingebunden.
                </p>

                <h2>10. Speicherdauer und Löschung</h2>
                <p>
                    Wir speichern personenbezogene Daten nur so lange, wie sie für Anfrage, Pilot, Vertrag,
                    Systemsicherheit oder gesetzliche Aufbewahrungspflichten benötigt werden. Löschanfragen für ein
                    Kundenkonto werden geprüft und anschließend in den betroffenen Produktiv-, Protokoll- und
                    Sicherungssystemen nach den geltenden Fristen umgesetzt.
                </p>

                <h2>11. Ihre Rechte</h2>
                <p>
                    Sie haben nach den gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Löschung,
                    Einschränkung, Datenübertragbarkeit und Widerspruch. Eine erteilte Einwilligung kann mit Wirkung
                    für die Zukunft widerrufen werden. Außerdem besteht ein Beschwerderecht bei einer zuständigen
                    Datenschutzaufsichtsbehörde. Anfragen richten Sie an die oben genannte Kontaktadresse.
                </p>
            </div>
        </div>
    )
}
