// Abschnitte der Startseite unterhalb des Sucharbeitsplatzes. Aus
// LandingPage.jsx herausgezogen; Markup und Verhalten sind unveraendert.
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/Icon'
import { BRANCHEN, FAQS, FEATURES, TOOLS } from './daten'

export function Prozess() {
    return (
        <section className="section workflow" id="prozess"><div className="container"><h2>Vom ersten Treffer zur klaren Entscheidung.</h2><div className="workflow__steps"><p><strong>01 · Finden</strong>Leistung und Region wählen. Direkt in den erfassten Quellen suchen.</p><p><strong>02 · Prüfen</strong>Leistungen, Risiken und Nachweise anhand der Originalangaben abgleichen.</p><p><strong>03 · Dranbleiben</strong>Suche speichern, Änderungen prüfen oder als E-Mail-Alert im Pilot übergeben.</p></div></div></section>
    )
}

const EINBLICK_TABS = [
    {
        id: 'digest',
        label: '1 · E-Mail-Digest & Begründung',
        eyebrow: 'Beispielansicht · Täglicher Pilot-Digest',
        titel: 'Jeder Treffer kommt mit nachvollziehbarer Begründung statt nackter Prozentzahl',
        hinweis: 'Der E-Mail-Digest wird im begleiteten Pilot gemeinsam mit Ihrem Suchprofil abgestimmt und danach täglich oder wöchentlich zugestellt.',
    },
    {
        id: 'gaeb',
        label: '2 · GAEB X83 / X84 Struktur',
        eyebrow: 'Beispielansicht · Lesende GAEB-DA-XML-Analyse',
        titel: 'Leistungsverzeichnisse in Sekunden überblicken, bevor die Kalkulation Zeit investiert',
        hinweis: 'Nur lesende Strukturierung von GAEB DA XML (X83/X84) inklusive CSV-/XLSX-Export – keine automatische Bepreisung oder Angebotsabgabe.',
    },
    {
        id: 'team',
        label: '3 · Team-Entscheidung & Übergabe',
        eyebrow: 'Beispielansicht · Pilot-Dashboard & Export',
        titel: 'Go/No-Go-Status, interne Notizen und strukturierter Export an einer Stelle',
        hinweis: 'Export als versioniertes JSON, CSV oder XLSX sowie optional signierter Webhook und direkter Zugriff über MCP/REST.',
    },
]

export function ProduktEinblick() {
    const [aktiv, setAktiv] = useState('digest')
    const aktuellerTab = EINBLICK_TABS.find((tab) => tab.id === aktiv) || EINBLICK_TABS[0]

    return (
        <section className="section section--alt" id="einblick">
            <div className="container">
                <span className="section__label">
                    <span className="pulse"></span> Blick in den Pilotbetrieb
                </span>
                <h2 className="section__title">
                    So arbeitet Ihr <span className="gradient-text">Ausschreibungsagent</span> im Alltag
                </h2>
                <p className="section__subtitle">
                    Keine Blackbox-Versprechen: Sehen Sie anhand realistischer Musterdaten, wie Treffer-Digest,
                    lesende GAEB-Vorprüfung und Team-Übergabe im geschützten Pilotbereich aufgebaut sind.
                </p>

                <div className="product-preview">
                    <div className="product-preview__tabs" role="tablist" aria-label="Einblicke in den Pilotbetrieb">
                        {EINBLICK_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                role="tab"
                                id={`tab-${tab.id}`}
                                aria-selected={aktiv === tab.id}
                                aria-controls={`panel-${tab.id}`}
                                className={`product-preview__tab ${aktiv === tab.id ? 'is-active' : ''}`}
                                onClick={() => setAktiv(tab.id)}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div
                        className="product-preview__panel"
                        role="tabpanel"
                        id={`panel-${aktuellerTab.id}`}
                        aria-labelledby={`tab-${aktuellerTab.id}`}
                    >
                        <div className="product-preview__copy">
                            <span className="profile-lead__eyebrow">{aktuellerTab.eyebrow}</span>
                            <h3>{aktuellerTab.titel}</h3>
                            <p>{aktuellerTab.hinweis}</p>
                            <a href="#profil" className="btn btn--primary">Für Ihr Gewerk im Pilot testen →</a>
                        </div>

                        <div className="product-preview__stage">
                            {aktiv === 'digest' && (
                                <div className="preview-card">
                                    <div className="preview-card__top">
                                        <span className="badge badge--yes">Firmen-Fit: 4 Gründe dafür · 0 Ausschlüsse</span>
                                        <span>Quelle: OEFFENTLICHEVERGABE.DE</span>
                                    </div>
                                    <h4>Neubau Berufsschulzentrum – Los 14: Pfosten-Riegel-Fassade &amp; Sonnenschutz</h4>
                                    <p className="preview-card__meta">Landkreis Esslingen · Angebotsfrist: 28 Tage · 2 Lose · Geschätzter Wert: 480.000 €</p>
                                    <ul className="preview-reasons">
                                        <li className="is-plus">+ Haupt-CPV 45443000 (Fassadenarbeiten) im Suchprofil enthalten</li>
                                        <li className="is-plus">+ Leistungsbegriffe „Pfosten-Riegel" und „Aluminiumfenster" im Bekanntmachungstext</li>
                                        <li className="is-plus">+ Leistungsort Baden-Württemberg liegt in Ihrer Zielregion</li>
                                        <li className="is-neutral">· Geforderter Nachweis: 3 vergleichbare Referenzen der letzten 5 Jahre</li>
                                    </ul>
                                </div>
                            )}

                            {aktiv === 'gaeb' && (
                                <div className="preview-card">
                                    <div className="preview-card__top">
                                        <span className="badge badge--partial">GAEB DA XML · Austauschphase X83</span>
                                        <span>Export: CSV · XLSX</span>
                                    </div>
                                    <table className="preview-table">
                                        <thead>
                                            <tr>
                                                <th>OZ</th>
                                                <th>Kurztext</th>
                                                <th>Menge</th>
                                                <th>Einheit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>01.02.0010</td>
                                                <td>Alu-Pfosten-Riegel-Fassade, thermisch getrennt, 3-fach-Isolierglas</td>
                                                <td>340</td>
                                                <td>m²</td>
                                            </tr>
                                            <tr>
                                                <td>01.02.0040</td>
                                                <td>Alu-Brandschutzfenster EI30 inkl. Beschlag und Montage</td>
                                                <td>18</td>
                                                <td>Stk</td>
                                            </tr>
                                            <tr>
                                                <td>01.03.0020</td>
                                                <td>Außenraffstoreanlage motorisch, Windwächter-Anbindung</td>
                                                <td>210</td>
                                                <td>m²</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {aktiv === 'team' && (
                                <div className="preview-card">
                                    <div className="preview-card__top">
                                        <span className="badge badge--yes">Entscheidung: GO</span>
                                        <span>Übergabe: XLSX · Signierter Webhook · MCP</span>
                                    </div>
                                    <h4>Freigabeprotokoll im Mandanten-Dashboard</h4>
                                    <ul className="preview-reasons">
                                        <li className="is-plus">✓ Referenznachweise vorhanden (Projekt Realschule 2024 zugeordnet)</li>
                                        <li className="is-plus">✓ Kalkulationsnotiz: „Montagefenster Sommerferien passt in Kapazitätsplanung – Bieterfrage zu Glasaufbau bis Freitag klären."</li>
                                        <li className="is-neutral">→ Strukturierter Datensatz inkl. Original-URL als XLSX für die Kalkulation bereitgestellt</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export function Vergleich() {
    return (
        <section className="section section--alt" id="vergleich">
            <div className="container">
                <span className="section__label section__label--amber">
                    <span className="pulse"></span> Marktüberblick 2026
                </span>
                <h2 className="section__title">
                    Alle <span className="gradient-text--amber">Ausschreibungstools</span> im Vergleich
                </h2>
                <p className="section__subtitle">
                    Eine redaktionelle Orientierung anhand öffentlich zugänglicher Anbieterangaben. Funktionsumfang,
                    Editionen und Preise können sich ändern; maßgeblich ist immer die verlinkte Anbieterseite.
                </p>

                <div className="comparison-wrapper">
                    <table className="comparison-table">
                        <thead>
                            <tr>
                                <th>Tool</th>
                                <th>Preis</th>
                                <th>KI-Features</th>
                                <th>Portal-Abdeckung</th>
                                <th>Fokus</th>
                                <th>GAEB-Support</th>
                                <th>Alerts</th>
                                <th>Free Tier</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOOLS.map((tool, i) => (
                                <tr key={i} className={tool.own ? 'comparison-table__own' : ''}>
                                    <td className="tool-name">
                                        {tool.own ? (
                                            <a href={tool.url}>{tool.name}</a>
                                        ) : (
                                            <a href={tool.url} target="_blank" rel="nofollow noopener noreferrer">{tool.name}</a>
                                        )}
                                    </td>
                                    <td>{tool.price}</td>
                                    <td><span className={`badge ${tool.ai ? 'badge--yes' : 'badge--no'}`}>{tool.ai ? '✓ Ja' : '✗ Nein'}</span></td>
                                    <td>{tool.portals}</td>
                                    <td>{tool.focus}</td>
                                    <td><span className={`badge ${tool.gaeb ? 'badge--yes' : 'badge--no'}`}>{tool.gaeb ? '✓' : '✗'}</span></td>
                                    <td><span className={`badge ${tool.alerts ? 'badge--yes' : 'badge--no'}`}>{tool.alerts ? '✓' : '✗'}</span></td>
                                    <td><span className={`badge ${tool.free ? 'badge--yes' : 'badge--no'}`}>{tool.free ? '✓' : '✗'}</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    Stand: 16. Juli 2026. Anbieterangaben wurden nicht in allen Fällen vertraglich verifiziert.
                    <br />Haben wir ein Tool vergessen? <a href="#kontakt">Schreiben Sie uns</a> – wir ergänzen es gerne.
                </p>
            </div>
        </section>
    )
}

export function Preise() {
    return (
        <section className="section" id="preise">
            <div className="container">
                <span className="section__label section__label--violet">
                    <span className="pulse"></span> Preise
                </span>
                <h2 className="section__title">
                    Jetzt <span className="gradient-text">kostenfrei</span> in die Pilotphase
                </h2>
                <p className="section__subtitle">
                    Wir suchen aktuell weitere Partner für eine kostenfreie Pilotphase.
                    Die durchgestrichenen Preise sind eine Orientierung für den späteren Regelbetrieb —
                    im Pilot zahlen Sie nichts. Der Online-Checkout wird erst nach erfolgreicher
                    Pilotphase freigeschaltet; Pilot und Vertrag werden persönlich abgestimmt.
                </p>

                <div className="pricing-strip">
                    <article>
                        <strong>Pro</strong>
                        <span><s>149 EUR/Monat</s> Kostenfrei in der Pilotphase</span>
                        <p>Suchprofil, Alerts, Volltextsuche und wöchentliche Trefferliste.</p>
                        <a href="#profil" className="btn btn--outline">Kostenfreien Pilotzugang anfragen</a>
                    </article>
                    <article>
                        <strong>Agent</strong>
                        <span><s>499 EUR/Monat</s> Kostenfrei in der Pilotphase</span>
                        <p>Höhere API-Limits, Volltextsuche, Agent API, A2A/MCP und Priorisierung.</p>
                        <a href="#profil" className="btn btn--outline">Kostenfreien Pilotzugang anfragen</a>
                    </article>
                    <article>
                        <strong>Verfahren</strong>
                        <span><s>1.499 EUR einmalig</s> Kostenfrei für Pilotpartner</span>
                        <p>Konkrete Ausschreibung prüfen, Anforderungen strukturieren, Angebotsfahrplan bauen.</p>
                        <a href="#kontakt" className="btn btn--outline">Beratung anfragen</a>
                    </article>
                </div>
            </div>
        </section>
    )
}

export function Funktionen() {
    return (
        <section className="section" id="funktionen">
            <div className="container">
                <span className="section__label section__label--violet">
                    <span className="pulse"></span> Funktionen
                </span>
                <h2 className="section__title">
                    Was unser <span className="gradient-text">Pilot-Agent</span> heute kann
                </h2>
                <p className="section__subtitle">
                    Der aktuelle Funktionsumfang ist bewusst konkret: öffentliche Feeds und APIs,
                    CPV-/Regel-/Keyword-Matching, sichere Dokumentanalyse und standardisierte Exporte.
                </p>

                <div className="features-grid">
                    {FEATURES.map((f, i) => (
                        <div className={`glass-card ${i === 0 ? 'glass-card--featured' : ''}`} key={i}>
                            <div className={`glass-card__icon${f.color ? ' glass-card__icon' + f.color : ''}`}><Icon name={f.icon} /></div>
                            <h3 className="glass-card__title">{f.title}</h3>
                            <p className="glass-card__text">{f.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function Branchen({ tenderVertical, setTenderVertical }) {
    return (
        <section className="section section--alt" id="branchen">
            <div className="container">
                <span className="section__label">
                    <span className="pulse"></span> Branchen
                </span>
                <h2 className="section__title">
                    Aktive <span className="gradient-text">Pilot-Verticals</span>
                </h2>
                <p className="section__subtitle">
                    Kuratiert mit eigenen Regeln: Fenster/Fassade, Architektur/Planung und Marketing/Digital.
                    Bauleistungen insgesamt durchsuchen Sie nach CPV-Gruppe – breiter, aber ohne
                    zusätzliche Schlagwortregeln. Mehr dazu: <Link to="/bauauftraege-finden">Bauaufträge nach Gewerk und Region finden</Link>.
                </p>

                <div className="branchen-grid">
                    {BRANCHEN.map((b, i) => (
                        <div className="glass-card branche-card" key={i}>
                            <span className="branche-card__emoji"><Icon name={b.emoji} size={30} /></span>
                            <h3 className="glass-card__title">{b.name}</h3>
                            <p className="glass-card__text">{b.desc}</p>
                            {b.gewerke && (
                                <div className="branche-card__gewerke" role="group" aria-label="Bau-Gewerk in der Suche wählen">
                                    {b.gewerke.map((g) => (
                                        <button type="button" className="source-trigger" key={g.value} aria-pressed={tenderVertical === g.value} onClick={() => { setTenderVertical(g.value); document.getElementById('ergebnisse')?.scrollIntoView({ behavior: 'smooth' }) }}>
                                            {g.label.replace(/^Bau: /, '')}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function Wissen() {
    return (
        <section className="section" id="wissen">
            <div className="container" style={{ maxWidth: '800px' }}>
                <span className="section__label section__label--violet">
                    <span className="pulse"></span> Wissen
                </span>
                <h2 className="section__title">
                    Der vollständige Leitfaden zu <span className="gradient-text">öffentlichen Ausschreibungen</span>
                </h2>

                <div style={{ marginTop: '2rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Öffentliche Beschaffung in Deutschland: großer, dezentraler Markt
                    </h3>
                    <p>
                        Eine häufig zitierte <a href="https://www.oecd.org/de/publications/offentliche-vergabe-in-deutschland_48df1474-de.html" target="_blank" rel="noopener noreferrer">OECD-Schätzung</a> beziffert die öffentliche Beschaffung in Deutschland auf rund 15 Prozent des Bruttoinlandsprodukts. Die <a href="https://www.destatis.de/DE/Themen/Staat/Oeffentliche-Finanzen/Vergabestatistik/_inhalt.html" target="_blank" rel="noopener noreferrer">amtliche Vergabestatistik von Destatis</a> weist für 2024 199.334 gemeldete Zuschläge mit einem Volumen von 135,2 Milliarden Euro aus. Diese Statistik hat Erfassungs- und Meldegrenzen und ist nicht mit der Zahl aller veröffentlichten Bekanntmachungen gleichzusetzen.
                    </p>
                    <p>
                        Genau hier liegt die Chance für Unternehmen, die Ausschreibungssuche systematisch zu unterstützen: Unser Pilot bündelt aktuell 18 Live-Quellen – von TED und service.bund.de über den Datenservice Öffentlicher Einkauf, DTVP und RIB bis zu den Landes- und Regionalportalen –, gleicht Bekanntmachungen mit einem strukturierten Firmenprofil ab und verlinkt immer auf die Originalquelle. Deutsche eVergabe und evergabe.de sind dokumentierte Ausbaupunkte.
                    </p>

                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Vergaberecht verstehen: Schwellenwerte und Verfahrensarten
                    </h3>
                    <p>
                        Das deutsche Vergaberecht unterscheidet zwischen nationalen und EU-weiten Verfahren. Für 2026/2027 gelten je nach Auftraggeber unterschiedliche EU-Schwellenwerte, unter anderem 140.000 Euro für Liefer- und Dienstleistungen zentraler Regierungsbehörden, 216.000 Euro für andere öffentliche Auftraggeber und 5.404.000 Euro für Bauaufträge. Maßgeblich sind die <a href="https://eur-lex.europa.eu/eli/reg_del/2025/2152" target="_blank" rel="noopener noreferrer">aktuellen amtlichen EU-Werte</a> und die konkrete Vergabeunterlage.
                    </p>
                    <p>
                        Die häufigsten Verfahrensarten sind das offene Verfahren (jeder kann ein Angebot abgeben), das nicht offene Verfahren (nur ausgewählte Unternehmen werden zur Angebotsabgabe aufgefordert) und das Verhandlungsverfahren (für besonders komplexe Leistungen). Ein guter Ausschreibungsagent klassifiziert die Verfahrensart automatisch und hilft Ihnen, die Anforderungen des jeweiligen Verfahrens zu verstehen.
                    </p>

                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Die Rolle der Künstlichen Intelligenz in der Ausschreibungssuche
                    </h3>
                    <p>
                        Traditionelle Ausschreibungstools arbeiten mit Keyword-basierten Suchfiltern – Sie geben Begriffe wie „Sanitärinstallation" oder „IT-Sicherheitsberatung" ein und erhalten eine Liste aller Treffer. Das Problem: Ausschreibungstexte verwenden oft unterschiedliche Formulierungen für die gleiche Leistung. „Sanitärtechnische Anlagen" statt „Sanitärinstallation", „Cyber Security Consulting" statt „IT-Sicherheitsberatung".
                    </p>
                    <p>
                        Unser aktueller Agent löst das transparent mit CPV-Klassifikation, positiven und negativen Begriffen sowie Regeln für Region, Auftragswert und Frist. Das ist nachvollziehbar und gut prüfbar. Semantische Modelle können später ergänzt werden, werden aber nicht als bereits produktiver Funktionsumfang ausgegeben.
                    </p>

                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Datenschutz und KI: bewusst europäisch
                    </h3>
                    <p>
                        Wer Vergabeunterlagen, Firmenprofile und Angebotsstrategien in ein Werkzeug legt, gibt
                        mehr preis als eine E-Mail-Adresse. Deshalb gilt bei uns: Die Plattform wird in
                        Deutschland gehostet, und wo KI-Modelle zum Einsatz kommen, laufen sie bei europäischen
                        Anbietern innerhalb der Europäischen Union – aktuell Mistral AI. Ihre Daten verlassen
                        die EU nicht, und es findet keine Verarbeitung bei US-Hyperscalern statt.
                    </p>
                    <p>
                        Das ist nicht nur eine Rechtsfrage nach DSGVO, sondern auch eine Vertrauensfrage:
                        Suchprofile verraten, welche Aufträge ein Unternehmen sucht und welche es ausschließt.
                        Diese Information gehört nicht in fremde Jurisdiktionen.
                    </p>

                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Vom Treffer zum Team: Merkliste, Notizen und Export
                    </h3>
                    <p>
                        Eine gefundene Ausschreibung ist erst der Anfang. Im Pilot-Dashboard behalten Sie den
                        Überblick: Jeder Treffer zeigt Auftraggeber, Leistungsort, Frist, geschätzten Wert,
                        die einzelnen Match-Gründe und die Originalquelle. Status und interne Notizen machen
                        den Vorgang im Team bearbeitbar – vom ersten Fund bis zur Go/No-Go-Entscheidung.
                    </p>
                    <p>
                        Für Kollegen ohne Zugang, für das Archiv oder für die Übergabe an ein ERP exportieren
                        Sie Treffer als versioniertes JSON, CSV oder XLSX. Ein signierter Webhook ist
                        konfigurierbar; konkrete ERP-Connectoren folgen erst nach Herstellerklärung – auch das
                        kennzeichnen wir bewusst als Ausbau statt als Versprechen.
                    </p>

                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Tipps für eine erfolgreiche Angebotsabgabe
                    </h3>
                    <p>
                        Die beste Ausschreibung nützt nichts, wenn das Angebot nicht überzeugt. Die häufigsten
                        Ausschlussgründe sind formal, nicht inhaltlich: nicht belegte Eignungskriterien, ein
                        unvollständig bepreistes Leistungsverzeichnis, versäumte Fristen, ungenutzte Nebenangebote
                        und Unklarheiten, die niemand per Bieterfrage geklärt hat. Ausführlich stehen die fünf
                        Punkte auf <Link to="/ki-angebot-ausschreibung">KI und Angebot</Link>.
                    </p>

                    <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                        Zum Weiterlesen
                    </h3>
                    <ul className="inhalt__liste">
                        <li>
                            <Link to="/ausschreibungssuche-automatisieren">Ausschreibungssuche automatisieren</Link>{' '}
                            – welche Portalebenen es gibt, was beim Profil zählt und woran sich eine brauchbare Lösung erkennen lässt.
                        </li>
                        <li>
                            <Link to="/ki-angebot-ausschreibung">KI und Angebot</Link>{' '}
                            – wobei maschinelle Unterstützung beim Angebot tatsächlich hilft und wo die Grenze liegt.
                        </li>
                        <li>
                            <Link to="/semantische-suche-ausschreibungen">Semantische Suche bei Ausschreibungen</Link>{' '}
                            – was der Begriff meint und warum wir stattdessen mit begründbaren Regeln arbeiten.
                        </li>
                    </ul>
                </div>
            </div>
        </section>
    )
}

export function Faq() {
    const [openFaq, setOpenFaq] = useState(null)
    return (
        <section className="section section--alt" id="faq">
            <div className="container">
                <span className="section__label">
                    <span className="pulse"></span> Häufige Fragen
                </span>
                <h2 className="section__title" style={{ textAlign: 'center' }}>
                    FAQ – Alles über <span className="gradient-text">Ausschreibungsagenten</span>
                </h2>
                <p className="section__subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>
                    Die wichtigsten Fragen und Antworten rund um öffentliche Ausschreibungen,
                    KI-Agenten und die richtige Tool-Auswahl.
                </p>

                <div className="faq-list">
                    {FAQS.map((faq, i) => (
                        <div className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} key={i}>
                            <button className="faq-item__question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                {faq.q}
                                <span className="arrow">▼</span>
                            </button>
                            <div className="faq-item__answer">
                                <p>{faq.a}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export function Kontakt({ formData, setFormData, invalidField, setInvalidField, formStatus, sending, handleSubmit }) {
    return (
        <section className="section section--alt" id="kontakt">
            <div className="container">
                <span className="section__label section__label--violet">
                    <span className="pulse"></span> Kontakt
                </span>
                <h2 className="section__title">
                    Lassen Sie uns über <span className="gradient-text">Ihre Ausschreibungsstrategie</span> sprechen
                </h2>
                <p className="section__subtitle">
                    Ob Beratung zur Tool-Auswahl, individuelle Agenten-Konfiguration oder
                    Enterprise-Lösungen – wir helfen Ihnen, das Maximum aus öffentlichen
                    Ausschreibungen herauszuholen.
                </p>

                <div className="contact-grid">
                    <form className="contact-form" onSubmit={handleSubmit} onInvalid={(e) => setInvalidField((current) => current ?? e.target.id)} onInput={(e) => { if (e.target.id === invalidField) setInvalidField(null) }}>
                        <input className="form-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contact-name">Name *</label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    type="text"
                                    autoComplete="name"
                                    aria-invalid={invalidField === 'contact-name'}
                                    aria-describedby={invalidField === 'contact-name' ? 'contact-name-error' : undefined}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Max Mustermann"
                                    required
                                />
                                {invalidField === 'contact-name' && <span id="contact-name-error" className="field-error">Bitte geben Sie Ihren Namen an.</span>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-email">E-Mail *</label>
                                <input
                                    id="contact-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    aria-invalid={invalidField === 'contact-email'}
                                    aria-describedby={invalidField === 'contact-email' ? 'contact-email-hint contact-email-error' : 'contact-email-hint'}
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="max@firma.de"
                                    required
                                />
                                <span id="contact-email-hint" className="field-hint">Wir antworten an diese Adresse.</span>
                                {invalidField === 'contact-email' && <span id="contact-email-error" className="field-error">Bitte geben Sie eine gültige E-Mail-Adresse an.</span>}
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contact-company">Unternehmen</label>
                                <input
                                    id="contact-company"
                                    name="company"
                                    type="text"
                                    autoComplete="organization"
                                    value={formData.company}
                                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    placeholder="Mustermann GmbH"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contact-branche">Branche</label>
                                <select
                                    id="contact-branche"
                                    name="branche"
                                    autoComplete="off"
                                    value={formData.branche}
                                    onChange={(e) => setFormData({ ...formData, branche: e.target.value })}
                                >
                                    <option value="">Bitte wählen...</option>
                                    <option value="Handwerk">Handwerk</option>
                                    <option value="Bau">Bauunternehmen</option>
                                    <option value="IT">IT-Dienstleistung</option>
                                    <option value="Ingenieurbuero">Ingenieurbüro</option>
                                    <option value="Beratung">Beratung / Consulting</option>
                                    <option value="Facility">Facility Management</option>
                                    <option value="Catering">Catering / Gastronomie</option>
                                    <option value="Sonstiges">Sonstiges</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="contact-message">Nachricht *</label>
                            <textarea
                                id="contact-message"
                                name="message"
                                autoComplete="off"
                                aria-invalid={invalidField === 'contact-message'}
                                aria-describedby={invalidField === 'contact-message' ? 'contact-message-error' : undefined}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                placeholder="Wie können wir Ihnen helfen? Beschreiben Sie Ihre aktuelle Situation bei der Ausschreibungssuche..."
                                required
                            />
                            {invalidField === 'contact-message' && <span id="contact-message-error" className="field-error">Bitte schreiben Sie eine Nachricht.</span>}
                        </div>

                        <button type="submit" className="btn btn--primary" disabled={sending}>
                            {sending ? 'Wird gesendet...' : 'Anfrage absenden →'}
                        </button>

                        {formStatus === 'success' && (
                            <div className="form-status form-status--success">
                                ✓ Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                            </div>
                        )}
                        {formStatus === 'error' && (
                            <div className="form-status form-status--error" role="alert">
                                Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie an hi@ausschreibungsagenten.de.
                            </div>
                        )}
                    </form>

                    <div className="contact-info">
                        <div className="glass-card contact-info__item">
                            <h3><Icon name="mail" size={18} /> E-Mail</h3>
                            <p><a href="mailto:hi@ausschreibungsagenten.de">hi@ausschreibungsagenten.de</a></p>
                        </div>
                        <div className="glass-card contact-info__item">
                            <h3><Icon name="phone" size={18} /> Telefon</h3>
                            <p><a href="tel:+4930403665430">030 – 403 665 430</a></p>
                        </div>
                        <div className="glass-card contact-info__item">
                            <h3><Icon name="pin" size={18} /> Standort</h3>
                            <p>Yawusa UG (haftungsbeschränkt)<br />Schliemannstraße 23, 10437 Berlin</p>
                        </div>
                        <div className="glass-card contact-info__item">
                            <h3><Icon name="zap" size={18} /> Antwortzeit</h3>
                            <p>In der Regel antworten wir innerhalb von 24 Stunden an Werktagen.</p>
                        </div>
                        <div className="glass-card contact-info__item">
                            <h3><Icon name="target" size={18} /> Für wen?</h3>
                            <p>Handwerk, Bau, IT, Beratung, Facility Management und alle Unternehmen, die öffentliche Aufträge gewinnen möchten.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
