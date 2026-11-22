import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { CPV_KATALOG, filtereCpv } from '../data/cpvKatalog'
import { trackEvent } from '../lib/tracking'

const KATEGORIEN = [...new Set(CPV_KATALOG.map((e) => e.kategorie))]

const CPV_FAQS = [
    {
        frage: 'Was ist ein CPV-Code bei öffentlichen Ausschreibungen?',
        antwort:
            'Das Common Procurement Vocabulary (CPV) ist ein EU-weit einheitlicher, achtstelliger Zahlencode zur Beschreibung von Bau-, Liefer- und Dienstleistungen in öffentlichen Ausschreibungen. Jede Bekanntmachung trägt mindestens einen Haupt-CPV-Code, wodurch Verfahren unabhängig von der Formulierung der Vergabestelle auffindbar sind.',
    },
    {
        frage: 'Wie ist ein achtstelliger CPV-Code aufgebaut?',
        antwort:
            'Die ersten beiden Ziffern nennen die Abteilung (z. B. 45 für Bauarbeiten, 71 für Architektur und Ingenieurleistungen, 72 für IT-Dienste). Die dritte Stelle grenzt die Gruppe ein (453 für Bauinstallation), die vierte die Klasse (4531 für Elektroinstallation) und die fünfte die Kategorie. Nachfolgende Nullen kennzeichnen Oberbegriffe.',
    },
    {
        frage: 'Reicht ein einzelner CPV-Code für die Ausschreibungssuche?',
        antwort:
            'In der Praxis selten. Vergabestellen wählen häufig eine übergeordnete Gruppe oder ergänzen weitere Leistungen als Zusatz-CPV. Zuverlässige Suchprofile kombinieren deshalb die passende CPV-Gruppe mit fachlichen Leistungsbegriffen und Ausschlusswörtern.',
    },
    {
        frage: 'Wie finde ich aktuelle Ausschreibungen zu meinem CPV-Code?',
        antwort:
            'Klicken Sie in der Tabelle oben neben dem passenden CPV-Code auf „Ausschreibungen suchen“. Die Live-Suche von Ausschreibungsagenten.de öffnet direkt passende Bekanntmachungen aus 18 angebundenen Quellen in Deutschland, der EU, Großbritannien und den USA.',
    },
]

function suchZiel(eintrag) {
    const params = new URLSearchParams()
    if (eintrag.gewerk) params.set('gewerk', eintrag.gewerk)
    if (eintrag.suche) params.set('suche', eintrag.suche)
    const query = params.toString()
    return query ? `/?${query}#ergebnisse` : '/#suche'
}

export default function CpvSuche() {
    const [anfrage, setAnfrage] = useState('')
    const [kategorie, setKategorie] = useState('')

    const treffer = useMemo(() => filtereCpv(anfrage, kategorie), [anfrage, kategorie])

    return (
        <>
            <Seo path="/cpv-code-suche" faq={CPV_FAQS} />

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Kostenloses Werkzeug · CPV-Verzeichnis
                    </span>
                    <h1 className="section__title">
                        CPV-Code-Suche: <span className="gradient-text">Codes nach Gewerk &amp; Branche finden</span>
                    </h1>
                    <p className="section__subtitle">
                        Finden Sie den passenden CPV-Code (Common Procurement Vocabulary) für Ihr Gewerk
                        oder Ihre Dienstleistung – und springen Sie mit einem Klick direkt in aktuelle
                        öffentliche Ausschreibungen aus 18 Live-Quellen.
                    </p>

                    <div className="glass-card" style={{ marginTop: '2rem' }}>
                        <label htmlFor="cpv-eingabe" className="profile-lead__field">
                            CPV-Code oder Leistung suchen
                            <input
                                id="cpv-eingabe"
                                type="search"
                                value={anfrage}
                                onChange={(e) => setAnfrage(e.target.value)}
                                placeholder="z. B. 4544, Fassade, Elektro, Architektur, IT, Reinigung …"
                                style={{
                                    padding: '0.85rem 1rem',
                                    borderRadius: '10px',
                                    border: '1px solid var(--glass-border)',
                                    background: 'rgba(10, 14, 26, 0.82)',
                                    color: 'var(--text-primary)',
                                    font: 'inherit',
                                }}
                            />
                        </label>

                        <div className="tender-search__presets" role="group" aria-label="Kategorie wählen" style={{ marginBottom: 0 }}>
                            <button
                                type="button"
                                className={kategorie === '' ? 'is-active' : ''}
                                onClick={() => setKategorie('')}
                            >
                                Alle ({CPV_KATALOG.length})
                            </button>
                            {KATEGORIEN.map((kat) => (
                                <button
                                    key={kat}
                                    type="button"
                                    className={kategorie === kat ? 'is-active' : ''}
                                    onClick={() => setKategorie(kat)}
                                >
                                    {kat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <p style={{ marginTop: '1.25rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        {treffer.length} von {CPV_KATALOG.length} häufig nachgefragten CPV-Codes angezeigt.
                    </p>

                    <div className="comparison-wrapper" style={{ marginTop: '0.75rem' }}>
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>CPV-Code</th>
                                    <th>Bezeichnung</th>
                                    <th>Bereich</th>
                                    <th>Live-Suche</th>
                                </tr>
                            </thead>
                            <tbody>
                                {treffer.map((eintrag) => (
                                    <tr key={eintrag.code}>
                                        <td><code>{eintrag.code}</code></td>
                                        <td><strong>{eintrag.titel}</strong></td>
                                        <td>{eintrag.kategorie}</td>
                                        <td>
                                            <Link
                                                to={suchZiel(eintrag)}
                                                onClick={() => trackEvent('CPV-Live-Suche-Geklickt', { cpv: eintrag.code })}
                                            >
                                                Ausschreibungen suchen →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                        Die 20 am häufigsten ausgeschriebenen CPV-Abteilungen in Deutschland (88.817 EU-Verfahren)
                        stehen unter <Link to="/zahlen">Vergabemarkt Deutschland in Zahlen</Link>. Weitere
                        kostenlose Werkzeuge: <Link to="/gaeb-viewer">GAEB-Viewer (X83/X84)</Link> und{' '}
                        <Link to="/eu-schwellenwerte">EU-Schwellenwerte-Rechner 2026/2027</Link>.
                    </p>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Häufige Fragen zu CPV-Codes
                    </span>
                    <h2 className="section__title">CPV-Systematik richtig nutzen</h2>
                    <div className="about-faq__list">
                        {CPV_FAQS.map((eintrag) => (
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
