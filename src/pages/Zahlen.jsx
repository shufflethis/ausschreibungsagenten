import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

// Alle Zahlen auf dieser Seite sind belegt. Quellen und Erhebungswege stehen
// unten auf der Seite; die TED-Zählung ist eine eigene, reproduzierbare
// Abfrage der offiziellen EU-API (Parameter im Methodik-Kasten).

const DATENSTAND_TED = '14. August 2026'
const TED_ZEITRAUM = '1. August 2025 bis 31. Juli 2026'
const TED_GESAMT = 88817

const topKategorien = [
    { cpv: '45', name: 'Bauarbeiten', n: 34117 },
    { cpv: '71', name: 'Architektur- und Ingenieurleistungen', n: 14962 },
    { cpv: '90', name: 'Abwasser, Abfall, Reinigung, Umwelt', n: 5591 },
    { cpv: '34', name: 'Fahrzeuge und Transportmittel', n: 5196 },
    { cpv: '79', name: 'Unternehmensdienstleistungen: Marketing, Werbung, PR, Recht', n: 4027 },
    { cpv: '72', name: 'IT-Dienstleistungen: Beratung, Entwicklung, Betrieb', n: 4025 },
    { cpv: '48', name: 'Software und Informationssysteme', n: 3056 },
    { cpv: '33', name: 'Medizinische Geräte und Erzeugnisse', n: 2683 },
    { cpv: '44', name: 'Baumaterial und Baubedarf', n: 2450 },
    { cpv: '39', name: 'Möbel und Ausstattung', n: 2041 },
    { cpv: '30', name: 'Büro- und EDV-Geräte', n: 1984 },
    { cpv: '50', name: 'Reparatur und Wartung', n: 1887 },
    { cpv: '42', name: 'Industriemaschinen', n: 1689 },
    { cpv: '32', name: 'Rundfunk- und Telekommunikationstechnik', n: 1581 },
    { cpv: '80', name: 'Aus- und Weiterbildung', n: 1531 },
    { cpv: '60', name: 'Transport- und Verkehrsdienste', n: 1500 },
    { cpv: '31', name: 'Elektrotechnische Maschinen und Geräte', n: 1440 },
    { cpv: '38', name: 'Labor-, Mess- und Präzisionstechnik', n: 1374 },
    { cpv: '09', name: 'Energie, Brenn- und Kraftstoffe', n: 1314 },
    { cpv: '77', name: 'Land-, Forst- und Gartenbau', n: 1284 },
]

const faq = [
    {
        frage: 'Wie groß ist der öffentliche Beschaffungsmarkt in Deutschland?',
        antwort:
            'Die OECD schätzt das jährliche Volumen der öffentlichen Beschaffung in Deutschland auf rund 500 Milliarden Euro, etwa 15 Prozent des Bruttoinlandsprodukts. Die amtliche Vergabestatistik, die Vergaben ab 25.000 Euro erfasst, meldet für 2024 rund 199.000 Vergaben mit 135,2 Milliarden Euro Auftragsvolumen.',
    },
    {
        frage: 'Welche Branchen werden in Deutschland am häufigsten ausgeschrieben?',
        antwort:
            'Nach Anzahl der EU-weiten Bekanntmachungen deutscher Auftraggeber führen Bauarbeiten (CPV 45) mit rund 38 Prozent, gefolgt von Architektur- und Ingenieurleistungen (CPV 71) mit rund 17 Prozent. Danach folgen Umwelt- und Entsorgungsdienste, Fahrzeuge, Unternehmensdienstleistungen wie Marketing und PR sowie IT-Dienstleistungen und Software.',
    },
    {
        frage: 'Wie viele Vergaben laufen unterhalb der EU-Schwellenwerte?',
        antwort:
            'Rund 88 Prozent der in der Vergabestatistik 2024 gemeldeten Verfahren liegen unterhalb der EU-Schwellenwerte und werden damit nur national ausgeschrieben. Beim Volumen kehrt sich das Bild um: Etwa drei Viertel des gemeldeten Auftragswerts entfallen auf die vergleichsweise wenigen oberschwelligen, EU-weit ausgeschriebenen Verfahren.',
    },
    {
        frage: 'Woher stammen die Zahlen auf dieser Seite?',
        antwort:
            'Aus drei Quellen: der amtlichen Vergabestatistik des Statistischen Bundesamts (Berichtsjahr 2024), der OECD-Studie zur öffentlichen Vergabe in Deutschland (2019) und einer eigenen, reproduzierbaren Abfrage der offiziellen TED-API der EU über zwölf Monate. Jede Zahl ist mit Quelle und Datenstand ausgewiesen; eigene Abfragen sind mit ihren Parametern dokumentiert.',
    },
]

const nf = new Intl.NumberFormat('de-DE')

export default function Zahlen() {
    const maxN = topKategorien[0].n
    return (
        <>
            <Seo path="/zahlen" faq={faq} />

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Zahlen &amp; Statistik
                    </span>
                    <h1 className="section__title">
                        Der deutsche <span className="gradient-text">Vergabemarkt</span> in Zahlen
                    </h1>
                    <p className="section__subtitle">
                        Die öffentliche Hand in Deutschland beschafft pro Jahr Waren und Leistungen für rund
                        500 Milliarden Euro — etwa 15 Prozent des Bruttoinlandsprodukts (OECD-Schätzung).
                        Die amtliche Vergabestatistik erfasste für 2024 insgesamt 199.334 Vergaben mit
                        135,2 Milliarden Euro Auftragsvolumen. EU-weit schrieben deutsche Auftraggeber
                        zwischen August 2025 und Juli 2026 zudem 88.817 Verfahren aus — die größte
                        Kategorie sind Bauarbeiten mit 38 Prozent.
                    </p>

                    <div className="zahlen-kacheln">
                        <div className="glass-card zahlen-kachel">
                            <strong>≈ 500 Mrd. €</strong>
                            <span>Öffentliche Beschaffung pro Jahr, ca. 15 % des BIP</span>
                            <small>OECD, 2019</small>
                        </div>
                        <div className="glass-card zahlen-kachel">
                            <strong>135,2 Mrd. €</strong>
                            <span>Gemeldetes Auftragsvolumen 2024 (ab 25.000 €)</span>
                            <small>Destatis, Vergabestatistik 2024</small>
                        </div>
                        <div className="glass-card zahlen-kachel">
                            <strong>199.334</strong>
                            <span>Gemeldete Vergaben und Konzessionen 2024</span>
                            <small>Destatis, Vergabestatistik 2024</small>
                        </div>
                        <div className="glass-card zahlen-kachel">
                            <strong>88.817</strong>
                            <span>EU-weite Ausschreibungen deutscher Auftraggeber in 12 Monaten</span>
                            <small>Eigene TED-Abfrage, {TED_ZEITRAUM}</small>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Top-Kategorien
                    </span>
                    <h2 className="section__title">
                        Was deutsche Auftraggeber <span className="gradient-text">EU-weit ausschreiben</span>
                    </h2>
                    <p className="section__subtitle">
                        Anzahl der Wettbewerbsbekanntmachungen je CPV-Division, Käuferland Deutschland,
                        {' '}{TED_ZEITRAUM}. Quelle: eigene Abfrage der offiziellen TED-API der EU
                        ({nf.format(TED_GESAMT)} Bekanntmachungen gesamt). Eine Bekanntmachung kann mehrere
                        CPV-Codes tragen; die Anteile summieren sich deshalb nicht exakt auf 100 Prozent.
                    </p>

                    <div className="table-scroll">
                        <table className="zahlen-tabelle">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">CPV</th>
                                    <th scope="col">Kategorie</th>
                                    <th scope="col" className="zahlen-tabelle__zahl">Bekanntmachungen</th>
                                    <th scope="col" className="zahlen-tabelle__balkenspalte">Anteil</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topKategorien.map((k, i) => {
                                    const pct = (100 * k.n) / TED_GESAMT
                                    return (
                                        <tr key={k.cpv}>
                                            <td>{i + 1}</td>
                                            <td><code>{k.cpv}</code></td>
                                            <td>{k.name}</td>
                                            <td className="zahlen-tabelle__zahl">{nf.format(k.n)}</td>
                                            <td className="zahlen-tabelle__balkenspalte">
                                                <div className="zahlen-balken" role="presentation">
                                                    <span style={{ width: `${(100 * k.n) / maxN}%` }}></span>
                                                </div>
                                                <span className="zahlen-balken__wert">{pct.toLocaleString('de-DE', { maximumFractionDigits: 1 })} %</span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                    <p className="muted zahlen-fussnote">
                        Datenstand: {DATENSTAND_TED}. TED enthält die EU-weit (oberschwellig) ausgeschriebenen
                        Verfahren; nationale, unterschwellige Vergaben sind hier nicht enthalten.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Volumen
                    </span>
                    <h2 className="section__title">
                        Viele kleine Verfahren, <span className="gradient-text">großes Geld oberschwellig</span>
                    </h2>
                    <p className="section__subtitle">
                        Rund 88 Prozent der 2024 gemeldeten Verfahren liegen unterhalb der EU-Schwellenwerte —
                        beim Auftragswert entfallen aber rund drei Viertel der 135,2 Milliarden Euro auf die
                        EU-weit ausgeschriebenen, oberschwelligen Verfahren (102,2 Milliarden Euro).
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Oberschwellig 2024 nach Auftragsart</h3>
                            <ul className="zahlen-liste">
                                <li><strong>40,7 Mrd. €</strong> Dienstleistungen (13.832 Aufträge)</li>
                                <li><strong>40,6 Mrd. €</strong> Lieferungen (8.858 Aufträge)</li>
                                <li><strong>20,9 Mrd. €</strong> Bauleistungen (897 Aufträge)</li>
                            </ul>
                            <p className="glass-card__text muted">Quelle: Destatis-Vergabestatistik 2024, Auswertung cosinex.</p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Oberschwellig 2024 nach Auftraggeberebene</h3>
                            <ul className="zahlen-liste">
                                <li><strong>45,1 Mrd. €</strong> Bund</li>
                                <li><strong>21,1 Mrd. €</strong> Länder</li>
                                <li><strong>21,1 Mrd. €</strong> Kommunen</li>
                                <li><strong>14,9 Mrd. €</strong> Sonstige Auftraggeber</li>
                            </ul>
                            <p className="glass-card__text muted">Quelle: Destatis-Vergabestatistik 2024, Auswertung cosinex.</p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Wer gewinnt die Aufträge?</h3>
                            <ul className="zahlen-liste">
                                <li><strong>96,5 %</strong> des oberschwelligen Volumens gingen 2024 an Bieter aus Deutschland</li>
                                <li><strong>2,9 %</strong> an Bieter aus anderen EU-Staaten</li>
                                <li><strong>0,5 %</strong> an Bieter aus Drittstaaten</li>
                            </ul>
                            <p className="glass-card__text muted">Quelle: Destatis-Vergabestatistik 2024, Auswertung cosinex.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Häufige Fragen
                    </span>
                    <h2 className="section__title">Fragen zu den Zahlen</h2>
                    <div style={{ display: 'grid', gap: '1rem', marginTop: '2rem', maxWidth: '860px' }}>
                        {faq.map((eintrag) => (
                            <div className="glass-card" key={eintrag.frage}>
                                <h3 className="glass-card__title">{eintrag.frage}</h3>
                                <p className="glass-card__text">{eintrag.antwort}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Quellen &amp; Methodik
                    </span>
                    <h2 className="section__title">Jede Zahl mit Quelle</h2>
                    <div className="glass-card" style={{ maxWidth: '860px', marginTop: '2rem' }}>
                        <ul className="zahlen-liste zahlen-liste--quellen">
                            <li>
                                <a href="https://www.destatis.de/DE/Themen/Staat/Oeffentliche-Finanzen/Vergabestatistik/_inhalt.html" target="_blank" rel="noopener noreferrer">
                                    Statistisches Bundesamt: Vergabestatistik
                                </a>{' '}
                                — 199.334 Vergaben mit 135,2 Mrd. € Volumen im Berichtsjahr 2024. Meldepflicht ab 25.000 € Auftragswert.
                            </li>
                            <li>
                                <a href="https://blog.cosinex.de/2026/05/22/vergabestatistik-2021-2024-auswertung/" target="_blank" rel="noopener noreferrer">
                                    cosinex-Auswertung der Vergabestatistik 2021–2024
                                </a>{' '}
                                — Aufschlüsselung des oberschwelligen Volumens 2024 nach Auftragsart, Ebene und Bieterherkunft (Basis: Destatis-Tabelle 79994).
                            </li>
                            <li>
                                <a href="https://www.oecd.org/de/publications/offentliche-vergabe-in-deutschland_48df1474-de/full-report.html" target="_blank" rel="noopener noreferrer">
                                    OECD: Öffentliche Vergabe in Deutschland (2019)
                                </a>{' '}
                                — Gesamtmarkt-Schätzung von rund 500 Mrd. € pro Jahr, etwa 15 % des BIP.
                            </li>
                            <li>
                                <a href="https://ted.europa.eu/" target="_blank" rel="noopener noreferrer">
                                    TED — Tenders Electronic Daily (EU)
                                </a>{' '}
                                — eigene Abfrage der offiziellen TED-API v3: Wettbewerbsbekanntmachungen
                                (Standard- und Sozialregime), Käuferland Deutschland, veröffentlicht
                                {' '}{TED_ZEITRAUM}, gezählt je CPV-Division. Abfragedatum: {DATENSTAND_TED}.
                            </li>
                        </ul>
                    </div>
                    <div className="zahlen-cta">
                        <p>
                            Diese Verfahren sind keine abstrakte Statistik — unser Agent findet die, die zu Ihrem
                            Firmenprofil passen, mit Begründung je Treffer.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link to="/?thema=Zahlen%20%26%20Statistik#profil" className="btn btn--primary">Kostenfreien Pilotzugang anfragen</Link>
                            <Link to="/status" className="btn btn--outline">Live-Quellenstatus ansehen</Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
