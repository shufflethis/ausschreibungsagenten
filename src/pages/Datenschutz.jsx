import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

export default function Datenschutz() {
    return (
        <div className="legal-page">
            <Helmet>
                <title>Datenschutzerklärung | Ausschreibungsagenten.de</title>
                <meta name="description" content="Datenschutzerklärung von ausschreibungsagenten.de." />
                <meta name="robots" content="noindex, follow" />
            </Helmet>
            <div className="container">
                <Link to="/" className="back-link">← Zurück zur Startseite</Link>
                <h1>Datenschutzerklärung</h1>

                <h2>1. Datenschutz auf einen Blick</h2>
                <h3>Allgemeine Hinweise</h3>
                <p>Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Webseite besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.</p>

                <h3>Datenerfassung auf dieser Webseite</h3>
                <p><strong>Wer ist verantwortlich für die Datenerfassung auf dieser Webseite?</strong></p>
                <p>Die Datenverarbeitung auf dieser Webseite erfolgt durch den Webseitenbetreiber: track by track GmbH, Schliemannstr. 23, 10437 Berlin. E-Mail: info@famefact.com.</p>

                <h2>2. Hosting</h2>
                <p>Diese Webseite wird bei Vercel Inc. gehostet. Die Server befinden sich in der EU. Vercel verarbeitet Daten im Auftrag und gemäß unseren Weisungen (Auftragsverarbeitung).</p>

                <h2>3. Allgemeine Hinweise und Pflichtinformationen</h2>
                <h3>Datenschutz</h3>
                <p>Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.</p>

                <h3>Hinweis zur verantwortlichen Stelle</h3>
                <p>Die verantwortliche Stelle für die Datenverarbeitung auf dieser Webseite ist:</p>
                <p>
                    track by track GmbH<br />
                    Schliemannstr. 23<br />
                    10437 Berlin<br />
                    E-Mail: info@famefact.com
                </p>

                <h2>4. Datenerfassung auf dieser Webseite</h2>

                <h3>Kontaktformular</h3>
                <p>Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert und an unseren Slack-Workspace weitergeleitet. Diese Daten geben wir nicht ohne Ihre Einwilligung weiter.</p>

                <h3>Newsletter</h3>
                <p>Wenn Sie den auf der Webseite angebotenen Newsletter beziehen möchten, benötigen wir von Ihnen eine E-Mail-Adresse. Diese Daten verwenden wir ausschließlich für den Versand der angeforderten Informationen. Eine Weitergabe an Dritte erfolgt nicht. Die erteilte Einwilligung zur Speicherung der Daten und ihrer Nutzung zum Newsletterversand können Sie jederzeit widerrufen.</p>

                <h3>Analyse-Tools</h3>
                <p>Diese Webseite nutzt Plausible Analytics, einen datenschutzfreundlichen Webanalyse-Dienst. Plausible verwendet keine Cookies und erhebt keine personenbezogenen Daten. Es werden keine Daten an Dritte weitergegeben. Die Verarbeitung erfolgt auf der Grundlage von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der statistischen Analyse des Nutzerverhaltens).</p>

                <h2>5. Affiliate-Links</h2>
                <p>Diese Webseite enthält Links zu externen Webseiten Dritter (Affiliate-Links). Bei Klick auf einen solchen Link wird die IP-Adresse des Nutzers an den jeweiligen Drittanbieter übermittelt. Eine Cookie-basierte Nachverfolgung durch den Anbieter dieser Webseite findet nicht statt.</p>

                <h2>6. Ihre Rechte</h2>
                <p>Sie haben jederzeit das Recht auf Auskunft über die bei uns gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten. Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.</p>
            </div>
        </div>
    )
}
