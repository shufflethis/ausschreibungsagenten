import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { BEISPIEL_GAEB_X83, gaebZuCsv, parseGaebXml } from '../lib/gaeb'
import { trackEvent } from '../lib/tracking'

const MAX_DATEIGROESSE = 15 * 1024 * 1024

const EUR = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})

const ZAHL = new Intl.NumberFormat('de-DE', { maximumFractionDigits: 3 })

const PHASEN = [
    ['X81', 'Leistungsbeschreibung', 'Neutrales Leistungsverzeichnis ohne Mengen und Preise'],
    ['X82', 'Kostenansatz', 'Leistungsverzeichnis mit Mengen und geschätzten Einheitspreisen'],
    ['X83', 'Angebotsaufforderung', 'Ausschreibungs-LV mit Mengen – die häufigste Datei in Vergabeunterlagen'],
    ['X84', 'Angebotsabgabe', 'Bepreistes Leistungsverzeichnis mit Einheitspreisen und Gesamtbeträgen'],
    ['X86', 'Auftragserteilung', 'Verbindliches Auftrags-LV nach Zuschlag'],
]

const GAEB_FAQS = [
    {
        frage: 'Werden meine GAEB-Dateien auf einen Server hochgeladen?',
        antwort:
            'Nein. Der GAEB-Viewer liest Ihre X81-, X82-, X83-, X84- oder X86-Datei vollständig lokal im Browser. Es findet kein Upload statt, und weder Vergabeunterlagen noch Kalkulationspreise verlassen Ihr Gerät.',
    },
    {
        frage: 'Wie wandle ich eine GAEB-X83-Datei kostenlos in Excel um?',
        antwort:
            'Öffnen Sie die X83-Datei oben im Viewer und klicken Sie auf „Als Excel-CSV herunterladen“. Die erzeugte CSV-Datei nutzt UTF-8 mit BOM und Semikolon-Trennung, sodass Microsoft Excel und LibreOffice Umlaute, Mengen und Dezimalstellen direkt richtig darstellen.',
    },
    {
        frage: 'Welche GAEB-Formate werden unterstützt – und welche nicht?',
        antwort:
            'Unterstützt wird GAEB DA XML (Versionen 3.1, 3.2 und 3.3), also XML-Dateien mit den Endungen .x81, .x82, .x83, .x84, .x86 oder .xml. Ältere zeilenbasierte GAEB-90- oder GAEB-2000-Dateien (.d83, .p83) müssen vorab in einem AVA-Programm als GAEB DA XML gespeichert werden.',
    },
    {
        frage: 'Kann ich mit dem Viewer Preise eintragen oder ein Angebot abgeben?',
        antwort:
            'Nein. Der Viewer arbeitet bewusst nur lesend für die schnelle Vorprüfung von Leistungsverzeichnissen und den Export nach CSV/Excel. Die verbindliche Kalkulation und die Abgabe einer X84-Datei bleiben in Ihrer AVA- oder Kalkulationssoftware.',
    },
]

export default function GaebViewer() {
    const [ergebnis, setErgebnis] = useState(null)
    const [fehler, setFehler] = useState('')
    const [filter, setFilter] = useState('')

    const gefiltert = useMemo(() => {
        if (!ergebnis) return []
        const q = filter.trim().toLowerCase()
        if (!q) return ergebnis.positionen
        return ergebnis.positionen.filter(
            (p) =>
                p.oz.toLowerCase().includes(q)
                || p.kurztext.toLowerCase().includes(q)
                || p.bereich.toLowerCase().includes(q),
        )
    }, [ergebnis, filter])

    function verarbeiteText(xmlText, dateiname, quelle = 'upload') {
        setFehler('')
        try {
            const parsed = parseGaebXml(xmlText, dateiname)
            setErgebnis(parsed)
            setFilter('')
            trackEvent('GAEB-Datei-Geoeffnet', {
                phase: parsed.meta.phase,
                quelle,
                positionen: parsed.statistik.positionenGesamt,
            })
        } catch (err) {
            setErgebnis(null)
            setFehler(err instanceof Error ? err.message : 'Die GAEB-Datei konnte nicht gelesen werden.')
        }
    }

    async function beiDateiwahl(datei) {
        if (!datei) return
        if (datei.size > MAX_DATEIGROESSE) {
            setFehler('Die Datei ist größer als 15 MB. Bitte prüfen Sie eine kleinere GAEB-DA-XML-Datei.')
            return
        }
        const text = await datei.text()
        verarbeiteText(text, datei.name, 'upload')
    }

    function ladeBeispiel() {
        verarbeiteText(BEISPIEL_GAEB_X83, 'beispiel-fassade.x83', 'beispiel')
    }

    function exportiereCsv() {
        if (!ergebnis) return
        const csv = gaebZuCsv(ergebnis)
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${ergebnis.meta.dateiname.replace(/\.[^.]+$/, '') || 'leistungsverzeichnis'}.csv`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
        trackEvent('GAEB-CSV-Exportiert', { phase: ergebnis.meta.phase })
    }

    return (
        <>
            <Seo path="/gaeb-viewer" faq={GAEB_FAQS} />

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Kostenloses Werkzeug · 100 % lokal im Browser
                    </span>
                    <h1 className="section__title">
                        GAEB-Viewer kostenlos: <span className="gradient-text">X83 &amp; X84 im Browser öffnen</span>
                    </h1>
                    <p className="section__subtitle">
                        Öffnen Sie GAEB-DA-XML-Leistungsverzeichnisse (X81, X82, X83, X84, X86) sofort ohne
                        Installation und exportieren Sie alle Positionen als Excel-kompatible CSV-Datei.
                        <strong> Ihre Datei verlässt den Browser nicht</strong> – kein Upload, keine Anmeldung.
                    </p>

                    <div className="glass-card" style={{ marginTop: '2rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label htmlFor="gaeb-datei" className="btn btn--primary" style={{ cursor: 'pointer' }}>
                                GAEB-Datei wählen (.x83, .x84, .xml)
                                <input
                                    id="gaeb-datei"
                                    type="file"
                                    accept=".x81,.x82,.x83,.x84,.x86,.xml,application/xml,text/xml"
                                    style={{ display: 'none' }}
                                    onChange={(e) => beiDateiwahl(e.target.files?.[0])}
                                />
                            </label>
                            <button type="button" className="btn btn--outline" onClick={ladeBeispiel}>
                                Beispiel-LV (Fassade, X83) laden
                            </button>
                            {ergebnis ? (
                                <button type="button" className="btn btn--outline" onClick={exportiereCsv}>
                                    Als Excel-CSV herunterladen ↓
                                </button>
                            ) : null}
                        </div>

                        <p className="field-hint" style={{ marginTop: '0.85rem' }}>
                            Unterstützt GAEB DA XML 3.1 / 3.2 / 3.3 (X81–X86, bis 15 MB). Nur lesend – keine Preisempfehlung, keine Kalkulation.
                        </p>

                        {fehler ? (
                            <p className="form-status form-status--error" role="alert" style={{ marginTop: '1rem' }}>
                                {fehler}
                            </p>
                        ) : null}
                    </div>

                    {ergebnis ? (
                        <div style={{ marginTop: '2rem' }}>
                            <div className="zahlen-kacheln">
                                <div className="glass-card zahlen-kachel">
                                    <strong>{ergebnis.meta.phase}</strong>
                                    <span>Austauschphase (GAEB {ergebnis.meta.version})</span>
                                    <small>{ergebnis.meta.dateiname}</small>
                                </div>
                                <div className="glass-card zahlen-kachel">
                                    <strong>{ergebnis.statistik.positionenGesamt}</strong>
                                    <span>Positionen in {ergebnis.statistik.bereicheGesamt} Bereichen</span>
                                    <small>{ergebnis.meta.projekt}</small>
                                </div>
                                <div className="glass-card zahlen-kachel">
                                    <strong>{ergebnis.statistik.positionenMitPreis}</strong>
                                    <span>Positionen mit Preisangabe</span>
                                    <small>Währung: {ergebnis.meta.waehrung}</small>
                                </div>
                                <div className="glass-card zahlen-kachel">
                                    <strong>
                                        {ergebnis.statistik.gesamtsumme !== null
                                            ? EUR.format(ergebnis.statistik.gesamtsumme)
                                            : 'Ohne Preise'}
                                    </strong>
                                    <span>Summe ausgewiesener Positionen</span>
                                    <small>{ergebnis.meta.datum || 'Nur lesend ausgewertet'}</small>
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                <label htmlFor="gaeb-filter" className="sr-only">Positionen filtern</label>
                                <input
                                    id="gaeb-filter"
                                    type="search"
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    placeholder="Positionen nach OZ, Bereich oder Kurztext filtern …"
                                    style={{
                                        flex: '1 1 280px',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(10, 14, 26, 0.82)',
                                        color: 'var(--text-primary)',
                                        font: 'inherit',
                                    }}
                                />
                                <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                                    {gefiltert.length} von {ergebnis.positionen.length} Positionen sichtbar
                                </span>
                            </div>

                            <div className="comparison-wrapper" style={{ marginTop: '1rem' }}>
                                <table className="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>OZ</th>
                                            <th>Bereich</th>
                                            <th>Kurztext</th>
                                            <th>Menge</th>
                                            <th>Einheit</th>
                                            <th>EP</th>
                                            <th>GP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gefiltert.map((p) => (
                                            <tr key={`${p.oz}-${p.kurztext.slice(0, 20)}`}>
                                                <td><code>{p.oz}</code></td>
                                                <td>{p.bereich || '–'}</td>
                                                <td>{p.kurztext}</td>
                                                <td>{p.menge !== null ? ZAHL.format(p.menge) : '–'}</td>
                                                <td>{p.einheit || '–'}</td>
                                                <td>{p.einheitspreis !== null ? EUR.format(p.einheitspreis) : '–'}</td>
                                                <td>{p.gesamtpreis !== null ? EUR.format(p.gesamtpreis) : '–'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : null}
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> GAEB-Austauschphasen im Überblick
                    </span>
                    <h2 className="section__title">
                        Was bedeuten <span className="gradient-text">X81, X83 und X84</span>?
                    </h2>
                    <p className="section__subtitle">
                        GAEB (Gemeinsamer Ausschuss Elektronik im Bauwesen) standardisiert den Austausch von
                        Leistungsverzeichnissen bei öffentlichen und privaten Bauausschreibungen. Die Ziffer
                        nennt den Stand im Vergabeprozess:
                    </p>
                    <div className="comparison-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Phase</th>
                                    <th>Bezeichnung</th>
                                    <th>Typischer Einsatz in der Ausschreibung</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PHASEN.map(([phase, name, text]) => (
                                    <tr key={phase}>
                                        <td><code>{phase}</code></td>
                                        <td><strong>{name}</strong></td>
                                        <td>{text}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                        Passende Bau-Ausschreibungen schon vor dem LV-Download finden? Nutzen Sie unseren{' '}
                        <Link to="/bauauftraege-finden">Leitfaden für Bauaufträge nach Gewerk</Link>, die{' '}
                        <Link to="/cpv-code-suche">CPV-Code-Suche</Link>, den{' '}
                        <Link to="/eu-schwellenwerte">EU-Schwellenwerte-Rechner 2026/2027</Link> oder testen
                        Sie die GAEB-Analyse direkt im{' '}
                        <Link to="/preise">kostenfreien Pilot von Ausschreibungsagenten.de</Link>.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Häufige Fragen zum GAEB-Viewer
                    </span>
                    <h2 className="section__title">Fragen zu GAEB-Dateien &amp; Excel-Export</h2>
                    <div className="about-faq__list">
                        {GAEB_FAQS.map((eintrag) => (
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
