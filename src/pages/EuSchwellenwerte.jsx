import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { EU_SCHWELLENWERTE } from '../lib/vergabe'
import { trackEvent } from '../lib/tracking'

// Offizielle EU-Schwellenwerte 2026/2027 (Delegierte Verordnungen (EU) 2025/2150–2152,
// gueltig seit 1. Januar 2026, jeweils Netto-Auftragswert ohne Umsatzsteuer).
const SCHWELLEN_2026 = [
    {
        id: 'bauauftrag',
        bezeichnung: 'Bauaufträge (klassisch & Sektoren)',
        wert: EU_SCHWELLENWERTE.bauauftrag.wert,
        vorperiode: 5538000,
        regelwerk: 'GWB / VOB/A-EU bzw. SektVO',
        hinweis: 'Darunter nationale Vergabe nach VOB/A Abschnitt 1; Fachlose nach § 97 Abs. 4 GWB.',
    },
    {
        id: 'konzession',
        bezeichnung: 'Bau- und Dienstleistungskonzessionen',
        wert: 5404000,
        vorperiode: 5538000,
        regelwerk: 'GWB / KonzVgV',
        hinweis: 'Einheitlicher EU-Schwellenwert für sämtliche Konzessionsvergaben.',
    },
    {
        id: 'sektoren',
        bezeichnung: 'Liefer- & Dienstleistungen: Sektoren / Verteidigung',
        wert: 432000,
        vorperiode: 443000,
        regelwerk: 'GWB / SektVO bzw. VSVgV',
        hinweis: 'Gilt für Trinkwasser, Energie, Verkehr sowie Verteidigung und Sicherheit.',
    },
    {
        id: 'oeffentlicher_auftraggeber',
        bezeichnung: 'Liefer- & Dienstleistungen: Länder, Kommunen & sonstige',
        wert: EU_SCHWELLENWERTE.oeffentlicher_auftraggeber.wert,
        vorperiode: 221000,
        regelwerk: 'GWB / VgV',
        hinweis: 'Standard-Schwelle für Städte, Gemeinden, Landkreise, Hochschulen und Landesbehörden.',
    },
    {
        id: 'zentrale_regierungsbehoerde',
        bezeichnung: 'Liefer- & Dienstleistungen: oberste/obere Bundesbehörden',
        wert: EU_SCHWELLENWERTE.zentrale_regierungsbehoerde.wert,
        vorperiode: 143000,
        regelwerk: 'GWB / VgV',
        hinweis: 'Gilt u. a. für Bundesministerien und nachgeordnete obere Bundesbehörden.',
    },
    {
        id: 'soziale_dienste',
        bezeichnung: 'Soziale und andere besondere Dienstleistungen (klassisch)',
        wert: 750000,
        vorperiode: 750000,
        regelwerk: 'GWB / VgV (Anhang XIV)',
        hinweis: 'Im Sektorenbereich liegt der unveränderte Schwellenwert bei 1.000.000 €.',
    },
]

const EUR = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
})

const SCHWELLEN_FAQS = [
    {
        frage: 'Wie hoch sind die EU-Schwellenwerte 2026 und 2027 in Deutschland?',
        antwort:
            'Seit dem 1. Januar 2026 gelten netto ohne Umsatzsteuer: 5.404.000 Euro für Bauaufträge und Konzessionen, 216.000 Euro für Liefer- und Dienstleistungen klassischer öffentlicher Auftraggeber (Länder, Kommunen), 140.000 Euro für oberste und obere Bundesbehörden sowie 432.000 Euro im Sektoren- und Verteidigungsbereich.',
    },
    {
        frage: 'Warum sind die EU-Schwellenwerte 2026 gegenüber 2024/2025 gesunken?',
        antwort:
            'Die Europäische Kommission passt die Schwellenwerte alle zwei Jahre automatisch an die Wechselkursentwicklung des Euro gegenüber den Sonderziehungsrechten (SZR) im WTO-Beschaffungsübereinkommen (GPA) an. Deshalb liegen die Werte 2026/2027 leicht unter denen von 2024/2025.',
    },
    {
        frage: 'Zählt der Netto- oder der Brutto-Auftragswert?',
        antwort:
            'Maßgeblich ist immer der geschätzte Netto-Gesamtauftragswert ohne Umsatzsteuer nach § 3 VgV – einschließlich etwaiger Optionen, Vertragsverlängerungen und bei zusammenhängenden Leistungen über alle Lose hinweg.',
    },
    {
        frage: 'Wo erscheinen Ausschreibungen oberhalb und unterhalb der EU-Schwellenwerte?',
        antwort:
            'Verfahren ab dem EU-Schwellenwert müssen EU-weit auf TED (Tenders Electronic Daily) bekannt gemacht werden. Verfahren darunter erscheinen national auf dem Bundesportal, dem Datenservice Öffentlicher Einkauf sowie auf Landes- und E-Vergabe-Portalen – Ausschreibungsagenten.de durchsucht beide Ebenen über 18 Live-Quellen.',
    },
]

export default function EuSchwellenwerte() {
    const [kategorieId, setKategorieId] = useState('oeffentlicher_auftraggeber')
    const [betragText, setBetragText] = useState('250000')

    const gewaehlt = SCHWELLEN_2026.find((s) => s.id === kategorieId) || SCHWELLEN_2026[3]
    const betrag = Number(String(betragText).replace(/[^\d]/g, ''))
    const hatBetrag = Number.isFinite(betrag) && betrag > 0
    const istOberschwelle = hatBetrag ? betrag >= gewaehlt.wert : null
    const differenz = hatBetrag ? Math.abs(betrag - gewaehlt.wert) : null

    return (
        <>
            <Seo path="/eu-schwellenwerte" faq={SCHWELLEN_FAQS} />

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Vergaberecht 2026 / 2027 · Kostenloser Rechner
                    </span>
                    <h1 className="section__title">
                        EU-Schwellenwerte 2026/2027: <span className="gradient-text">Tabelle &amp; Rechner</span>
                    </h1>
                    <p className="section__subtitle">
                        Prüfen Sie in Sekunden, ob ein öffentlicher Auftrag EU-weit (Oberschwelle nach GWB/VgV/VOB-EU)
                        oder national (Unterschwelle nach UVgO/VOB-A) ausgeschrieben werden muss. Grundlage sind die
                        seit 1. Januar 2026 geltenden EU-Schwellenwerte (Netto-Auftragswert ohne Umsatzsteuer).
                    </p>

                    <div className="glass-card" style={{ marginTop: '2rem' }}>
                        <div className="profile-lead__grid">
                            <label htmlFor="schwelle-kategorie" className="profile-lead__field">
                                Auftragsart &amp; Auftraggeber
                                <select
                                    id="schwelle-kategorie"
                                    value={kategorieId}
                                    onChange={(e) => {
                                        setKategorieId(e.target.value)
                                        trackEvent('Schwellenwert-Rechner-Genutzt', { kategorie: e.target.value })
                                    }}
                                    style={{
                                        padding: '0.85rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid var(--glass-border)',
                                        background: 'rgba(10, 14, 26, 0.82)',
                                        color: 'var(--text-primary)',
                                        font: 'inherit',
                                    }}
                                >
                                    {SCHWELLEN_2026.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.bezeichnung} ({EUR.format(s.wert)})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label htmlFor="schwelle-betrag" className="profile-lead__field">
                                Geschätzter Netto-Auftragswert (EUR)
                                <input
                                    id="schwelle-betrag"
                                    type="text"
                                    inputMode="numeric"
                                    value={betragText}
                                    onChange={(e) => setBetragText(e.target.value)}
                                    placeholder="z. B. 250000"
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
                        </div>

                        {hatBetrag ? (
                            <div
                                style={{
                                    marginTop: '1.5rem',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: `1px solid ${istOberschwelle ? 'rgba(59, 130, 246, 0.45)' : 'rgba(16, 185, 129, 0.45)'}`,
                                    background: istOberschwelle ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                                }}
                                aria-live="polite"
                            >
                                <span className={`badge ${istOberschwelle ? 'badge--yes' : 'badge--partial'}`}>
                                    {istOberschwelle ? 'Oberschwelle · EU-weite Ausschreibung (TED)' : 'Unterschwelle · Nationale Vergabe'}
                                </span>
                                <p style={{ marginTop: '0.75rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                                    {EUR.format(betrag)} liegt{' '}
                                    {istOberschwelle
                                        ? `${EUR.format(differenz)} oberhalb bzw. auf`
                                        : `${EUR.format(differenz)} unterhalb`}{' '}
                                    des EU-Schwellenwerts von {EUR.format(gewaehlt.wert)} ({gewaehlt.bezeichnung}).
                                </p>
                                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                    {istOberschwelle
                                        ? `Rechtsrahmen: ${gewaehlt.regelwerk}. EU-weite Bekanntmachung auf TED verpflichtend; Mindestangebotsfrist im offenen Verfahren in der Regel 35 Tage (30 Tage bei elektronischer Übermittlung).`
                                        : 'Nationale Vergabe nach UVgO bzw. VOB/A Abschnitt 1 (je nach Bundesland). Bekanntmachung erfolgt auf Bundes-, Landes- und E-Vergabe-Portalen, nicht auf TED.'}
                                </p>
                            </div>
                        ) : null}

                        <p className="field-hint" style={{ marginTop: '1rem' }}>
                            Orientierungshilfe ohne Rechtsberatung. Maßgeblich sind die amtlichen{' '}
                            <a href="https://eur-lex.europa.eu/eli/reg_del/2025/2152" target="_blank" rel="noopener noreferrer">
                                Delegierten Verordnungen (EU) 2025/2150–2152
                            </a>{' '}
                            sowie die Auftragswertschätzung nach § 3 VgV.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Amtliche Übersicht
                    </span>
                    <h2 className="section__title">
                        Alle EU-Schwellenwerte <span className="gradient-text">2026/2027 im Vergleich zu 2024/2025</span>
                    </h2>
                    <div className="comparison-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Bereich / Auftraggeber</th>
                                    <th>2026 / 2027 (netto)</th>
                                    <th>2024 / 2025 (netto)</th>
                                    <th>Regelwerk</th>
                                </tr>
                            </thead>
                            <tbody>
                                {SCHWELLEN_2026.map((s) => (
                                    <tr key={s.id}>
                                        <td><strong>{s.bezeichnung}</strong></td>
                                        <td><strong>{EUR.format(s.wert)}</strong></td>
                                        <td>{EUR.format(s.vorperiode)}</td>
                                        <td>{s.regelwerk}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                        Wie sich Ober- und Unterschwelle auf das deutsche Auftragsvolumen verteilen (88 % der
                        Verfahren unterschwellig, rund drei Viertel des Volumens oberschwellig), zeigt{' '}
                        <Link to="/zahlen">Vergabemarkt Deutschland in Zahlen</Link>. Weitere kostenlose Tools:{' '}
                        <Link to="/foerder-und-auftrags-planer">Auftrags- &amp; Förder-Planer 2027</Link>,{' '}
                        <Link to="/cpv-code-suche">CPV-Code-Suche</Link> und{' '}
                        <Link to="/gaeb-viewer">GAEB-Viewer (X83/X84)</Link>.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Häufige Fragen zu EU-Schwellenwerten
                    </span>
                    <h2 className="section__title">Schwellenwerte in der Praxis</h2>
                    <div className="about-faq__list">
                        {SCHWELLEN_FAQS.map((eintrag) => (
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
