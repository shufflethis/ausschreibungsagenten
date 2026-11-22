import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { trackEvent } from '../lib/tracking'

// Alle Preise und Limits laufen synchron zu public/pricing.md und /entwickler.
// Solange der Online-Checkout aus ist, erfolgt jede kostenpflichtige Vereinbarung
// erst nach schriftlicher Abstimmung; im Pilot fallen 0 EUR an.
const TARIFE = [
    {
        name: 'Öffentliche Vorschau',
        pilotPreis: '0 € · ohne Anmeldung',
        regelPreis: null,
        kurz: 'Live-Suche auf der Website, Quellenstatus, Länderabdeckung und Entscheidungskarten direkt im Browser.',
        ctaText: 'Live-Suche öffnen',
        ctaHref: '/#suche',
        extern: false,
        intern: false,
    },
    {
        name: 'Free API-Key',
        pilotPreis: '0 € · dauerhaft frei',
        regelPreis: null,
        kurz: '60 Anfragen/Stunde per REST und MCP (search_tenders), sofortige Selbstregistrierung ohne Zahlungsdaten.',
        ctaText: 'Free API-Key erstellen',
        ctaHref: '/entwickler#api-key',
        extern: false,
        intern: false,
    },
    {
        name: 'Pro',
        pilotPreis: '0 € in der Pilotphase',
        regelPreis: '149 €/Monat (Regelbetrieb)',
        kurz: 'Persönliches Suchprofil, E-Mail-Digest, Volltextsuche, Pilot-Dashboard, GAEB X83/X84 lesend und Exporte.',
        ctaText: 'Kostenfreien Pilot anfragen',
        ctaHref: '/?thema=Pro-Tarif%20(Pilot)#profil',
        extern: false,
        intern: false,
    },
    {
        name: 'Agent',
        pilotPreis: '0 € in der Pilotphase',
        regelPreis: '499 €/Monat (Regelbetrieb)',
        kurz: 'Bis 3.600 API-Anfragen/Stunde, MCP-Volltextsuche, erklärbarer Firmen-Fit, A2A-Anbindung und Priorisierung.',
        ctaText: 'Agent-Pilot anfragen',
        ctaHref: '/?thema=Agent-Tarif%20(Pilot)#profil',
        extern: false,
        intern: false,
    },
]

const LIMIT_ZEILEN = [
    ['Preis in der Pilotphase', '0 €', '0 €', '0 € (nach Freigabe)', '0 € (nach Freigabe)'],
    ['Geplanter Regelpreis (netto)', '0 €', '0 €', '149 €/Monat', '499 €/Monat'],
    ['Angebundene Quellen', '18 Live-Quellen', '18 Live-Quellen', '18 Live-Quellen', '18 Live-Quellen'],
    ['API-Rate-Limit', '600/h (Vorschau)', '60/h (Key)', '600/h', '3.600/h'],
    ['Volltextsuche & strukturierte Anforderungen', 'Nein', 'Nein', 'Ja', 'Ja'],
    ['Persönliches Profil & E-Mail-Digest', 'Browser-Suche (lokal)', 'Nein', 'Ja (täglich/wöchentlich)', 'Ja + Priorisierung'],
    ['GAEB DA XML X83/X84 (lesend) & Export', 'Nein', 'Nein', 'JSON, CSV, XLSX', 'JSON, CSV, XLSX, Webhook'],
    ['MCP & A2A', 'search_tenders frei', 'search_tenders (Key)', 'inkl. fulltext_search', 'inkl. Profilaktionen nach Freigabe'],
    ['Zahlungsdaten / automatische Verlängerung', 'Keine', 'Keine', 'Keine im Pilot', 'Keine im Pilot'],
]

const PREISE_FAQS = [
    {
        frage: 'Was kostet die Pilotphase bei Ausschreibungsagenten.de?',
        antwort:
            'Die begleitete Pilotphase ist kostenfrei (0 Euro) und unverbindlich. Sie geben keine Zahlungsdaten an und schließen kein automatisches Abonnement ab. Wir richten Ihr Suchprofil gemeinsam ein und schalten den Zugang per Anmeldelink frei.',
    },
    {
        frage: 'Wann gelten die Preise von 149 Euro und 499 Euro im Monat?',
        antwort:
            '149 Euro netto im Monat (Pro) und 499 Euro netto im Monat (Agent) sind die offen genannten Orientierungspreise für den anschließenden Regelbetrieb. Der Online-Checkout ist bewusst noch deaktiviert; ein kostenpflichtiger Vertrag beginnt erst nach ausdrücklicher schriftlicher Abstimmung.',
    },
    {
        frage: 'Was beinhaltet die einmalige Verfahrensbegleitung für 1.499 Euro?',
        antwort:
            'Bei der Verfahrensbegleitung (1.499 Euro netto einmalig, für ausgewählte Pilotpartner im Rahmen des Piloten kostenfrei) prüfen wir eine konkrete Ausschreibung mit Ihnen: Anforderungen aus den Unterlagen, Nachweismatrix und strukturierter Angebotsfahrplan. Angebotstext, Kalkulation und Abgabe bleiben bei Ihrem Unternehmen.',
    },
    {
        frage: 'Gibt es dauerhaft kostenlose Zugänge für Entwickler und KI-Agenten?',
        antwort:
            'Ja. Die öffentliche Vorschau auf der Website sowie der Free API-Key mit 60 Anfragen pro Stunde für REST und MCP (search_tenders) sind dauerhaft kostenfrei und ohne Kreditkarte nutzbar. Details und Registrierung stehen im Entwickler-Portal.',
    },
]

export default function Preise() {
    return (
        <>
            <Seo path="/preise" faq={PREISE_FAQS} />

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Preise &amp; Pilotphase
                    </span>
                    <h1 className="section__title">
                        Preise, Tarife und <span className="gradient-text">kostenfreie Pilotphase</span>
                    </h1>
                    <p className="section__subtitle">
                        Alle Tarife und API-Limits auf einer Seite: In der laufenden Pilotphase zahlen
                        freigeschaltete Pilotpartner <strong>0 €</strong> – ohne Zahlungsdaten und ohne
                        automatisches Abo. Die genannten Beträge sind die transparente Orientierung für
                        den späteren Regelbetrieb.
                    </p>

                    <div className="pricing-strip pricing-strip--vier">
                        {TARIFE.map((tarif) => (
                            <article key={tarif.name}>
                                <strong>{tarif.name}</strong>
                                <span>
                                    {tarif.regelPreis ? <s>{tarif.regelPreis}</s> : null}
                                    {tarif.pilotPreis}
                                </span>
                                <p>{tarif.kurz}</p>
                                <a
                                    href={tarif.ctaHref}
                                    className="btn btn--outline"
                                    onClick={() => trackEvent('Preise-CTA-Geklickt', { tarif: tarif.name })}
                                >
                                    {tarif.ctaText}
                                </a>
                            </article>
                        ))}
                    </div>

                    <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                        <h2 className="glass-card__title">Einmalige Verfahrensbegleitung</h2>
                        <p className="glass-card__text">
                            <strong>1.499 € netto einmalig</strong> (im Rahmen ausgewählter Piloten kostenfrei,
                            stets erst nach schriftlicher Leistungsbeschreibung): Wir prüfen eine konkrete
                            Ausschreibung, strukturieren Anforderungen und Nachweise und erstellen einen
                            Angebotsfahrplan. Angebotstext, Preiskalkulation und Abgabe bleiben bei Ihnen.{' '}
                            <a href="/?thema=Verfahrensbegleitung#kontakt">Unverbindlich anfragen →</a>
                        </p>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Funktions- &amp; Limit-Vergleich
                    </span>
                    <h2 className="section__title">
                        Alle Stufen nach <span className="gradient-text">denselben Kriterien</span>
                    </h2>
                    <p className="section__subtitle">
                        Sämtliche Angaben entsprechen der maschinenlesbaren Fassung unter{' '}
                        <a href="/pricing.md">/pricing.md</a>. Alle 18 Live-Quellen sind im{' '}
                        <Link to="/status">Quellenstatus</Link> einzeln mit Abrufzeitpunkt einsehbar.
                    </p>

                    <div className="comparison-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Merkmal</th>
                                    <th>Vorschau</th>
                                    <th>Free API</th>
                                    <th>Pro</th>
                                    <th>Agent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {LIMIT_ZEILEN.map((zeile) => (
                                    <tr key={zeile[0]}>
                                        <th scope="row">{zeile[0]}</th>
                                        <td>{zeile[1]}</td>
                                        <td>{zeile[2]}</td>
                                        <td>{zeile[3]}</td>
                                        <td>{zeile[4]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        Alle Preisangaben verstehen sich netto zzgl. gesetzlicher Umsatzsteuer. Sie möchten
                        Ausschreibungsagenten.de mit anderen Anbietern vergleichen? Zum{' '}
                        <Link to="/beste-software-automatische-ausschreibungssuche">
                            Software-Vergleich nach Use Case
                        </Link>{' '}
                        oder zum <Link to="/partner">Partnerprogramm (20 % wiederkehrend)</Link>.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Häufige Fragen zu Preisen &amp; Pilot
                    </span>
                    <h2 className="section__title">Klare Konditionen vor dem Start</h2>
                    <div className="about-faq__list">
                        {PREISE_FAQS.map((eintrag) => (
                            <details className="about-faq__item" key={eintrag.frage}>
                                <summary>{eintrag.frage}</summary>
                                <p>{eintrag.antwort}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
