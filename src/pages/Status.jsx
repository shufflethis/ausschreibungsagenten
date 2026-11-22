import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

// Feste Stammdaten aller 18 produktiv angebundenen Quellen, damit auch
// Crawler ohne JavaScript-Ausfuehrung (Such- und KI-Bots) die vollstaendige
// Quellenliste samt Anbindungsart und Abdeckung sehen statt einer leeren
// Ladeanzeige. Live-Abrufzeitpunkte und Trefferzahlen laedt der Browser
// anschliessend ueber /api/source-status und /api/countries nach.
const ANGEBUNDENE_QUELLEN = [
    { source: 'ted', label: 'TED (EU-Amtsblatt, api.ted.europa.eu)', iface: 'official_api', ebene: 'EU (alle 27 Mitgliedstaaten, Oberschwelle)' },
    { source: 'doe', label: 'Datenservice Öffentlicher Einkauf (eForms-DE, Ober- + Unterschwelle)', iface: 'official_api', ebene: 'Deutschland (Bund, Länder, Kommunen)' },
    { source: 'bund', label: 'service.bund.de', iface: 'official_api', ebene: 'Deutschland (Bundesbehörden)' },
    { source: 'fts', label: 'GB Find a Tender (OCDS)', iface: 'official_api', ebene: 'Vereinigtes Königreich (Oberschwelle)' },
    { source: 'cf', label: 'GB Contracts Finder (unterschwellig, OCDS)', iface: 'official_api', ebene: 'Vereinigtes Königreich (ab £12k)' },
    { source: 'sam', label: 'US SAM.gov Contract Opportunities (Bund, JSON-API)', iface: 'official_api', ebene: 'USA (US-Bundesbehörden)' },
    { source: 'dtvp', label: 'DTVP Deutsches Vergabeportal', iface: 'portal', ebene: 'Deutschland (E-Vergabe-Plattform)' },
    { source: 'rib', label: 'RIB / iTWO tender', iface: 'portal', ebene: 'Deutschland (E-Vergabe-Plattform)' },
    { source: 'bayern', label: 'Landesportal Bayern', iface: 'portal', ebene: 'Bayern' },
    { source: 'nrw', label: 'Landesportal Nordrhein-Westfalen', iface: 'portal', ebene: 'Nordrhein-Westfalen' },
    { source: 'bw', label: 'Landesportal Baden-Württemberg', iface: 'portal', ebene: 'Baden-Württemberg' },
    { source: 'vpbw', label: 'Vergabeportal Baden-Württemberg', iface: 'portal', ebene: 'Baden-Württemberg' },
    { source: 'bremen', label: 'Landesportal Bremen', iface: 'portal', ebene: 'Bremen' },
    { source: 'sachsen', label: 'Landesportal Sachsen', iface: 'portal', ebene: 'Sachsen' },
    { source: 'mv', label: 'Landesportal Mecklenburg-Vorpommern', iface: 'portal', ebene: 'Mecklenburg-Vorpommern' },
    { source: 'hessen', label: 'Landesportal Hessen', iface: 'portal', ebene: 'Hessen' },
    { source: 'rlp', label: 'Landesportal Rheinland-Pfalz', iface: 'portal', ebene: 'Rheinland-Pfalz' },
    { source: 'mrn', label: 'Metropolregion Rhein-Neckar', iface: 'portal', ebene: 'Metropolregion Rhein-Neckar' },
]

const SOURCE_LABELS = Object.fromEntries(ANGEBUNDENE_QUELLEN.map((q) => [q.source, q.label]))

const COUNTRY_NAMES = {
    DEU: 'Deutschland', FRA: 'Frankreich', POL: 'Polen', SWE: 'Schweden', AUT: 'Österreich',
    BEL: 'Belgien', CZE: 'Tschechien', NLD: 'Niederlande', ESP: 'Spanien', ITA: 'Italien',
    LUX: 'Luxemburg', FIN: 'Finnland', IRL: 'Irland', HRV: 'Kroatien', EST: 'Estland',
    DNK: 'Dänemark', GRC: 'Griechenland', BGR: 'Bulgarien', HUN: 'Ungarn', LTU: 'Litauen',
    MLT: 'Malta', ROU: 'Rumänien', SVN: 'Slowenien', SVK: 'Slowakei', LVA: 'Lettland',
    PRT: 'Portugal', CYP: 'Zypern', GBR: 'Vereinigtes Königreich', USA: 'USA', NOR: 'Norwegen',
}

const formatDateTime = (value) => {
    if (!value) return '–'
    return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    }).format(new Date(value))
}

export default function Status() {
    const [sources, setSources] = useState([])
    const [countries, setCountries] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const controller = new AbortController()
        Promise.allSettled([
            fetch('/api/source-status', { signal: controller.signal }).then((r) => (r.ok ? r.json() : [])),
            fetch('/api/countries', { signal: controller.signal }).then((r) => (r.ok ? r.json() : [])),
        ]).then(([s, c]) => {
            if (s.status === 'fulfilled' && Array.isArray(s.value)) setSources(s.value)
            if (c.status === 'fulfilled' && Array.isArray(c.value)) setCountries(c.value)
            setLoading(false)
        })
        return () => controller.abort()
    }, [])

    const totalTenders = countries.reduce((sum, c) => sum + (c.count || 0), 0)

    return (
        <>
            <Seo path="/status" />

            <section className="hero">
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s ease-in-out infinite' }}></span>
                            Live aus der Produktionsdatenbank
                        </div>
                        <h1 className="hero__title">
                            Quellenstatus — <span className="gradient-text">volle Transparenz</span>
                        </h1>
                        <p className="hero__description">
                            Wir behaupten keine pauschale Portalzahl, wir zeigen sie: alle 18 produktiv
                            angebundenen Quellen – sechs über offizielle Schnittstellen und zwölf per
                            Portal-Auslese – mit letztem erfolgreichem Abruf und Länderabdeckung im Index.
                        </p>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Datenquellen
                    </span>
                    <h2 className="section__title">
                        18 angebundene Portale und ihr <span className="gradient-text">letzter Abruf</span>
                    </h2>
                    {sources.length > 0 ? (
                        <div className="comparison-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Quelle</th>
                                        <th>Anbindung</th>
                                        <th>Status</th>
                                        <th>Letzter erfolgreicher Abruf</th>
                                        <th>Zuletzt geholt / gespeichert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sources.map((s) => (
                                        <tr key={s.source}>
                                            <td>{SOURCE_LABELS[s.source] || s.source.toUpperCase()}</td>
                                            {/* official_api: vom Betreiber fuer Maschinen bereitgestellt
                                                (API/RSS/OCDS). portal: aus dem HTML des Portals gelesen.
                                                Der Unterschied gehoert auf die Seite, die Transparenz
                                                verspricht - nicht nur in die API-Antwort. */}
                                            <td>{s.interface === 'official_api' ? 'Offizielle Schnittstelle' : 'Portal-Auslese'}</td>
                                            <td>
                                                <span className={`badge ${s.implementation_status === 'live' ? 'badge--yes' : 'badge--no'}`}>
                                                    {s.implementation_status === 'live' ? (s.last_error ? 'live · Fehler beim letzten Lauf' : 'live') : 'im Ausbau'}
                                                </span>
                                            </td>
                                            <td>{formatDateTime(s.last_success_at)}</td>
                                            <td>{s.implementation_status === 'live' ? `${s.fetched ?? 0} / ${s.stored ?? 0}` : '–'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <>
                            <p className="section__subtitle">
                                {loading
                                    ? 'Aktuelle Live-Abrufzeitpunkte werden geladen — die vollständige Liste der 18 angebundenen Quellen steht direkt darunter (maschinenlesbar als JSON unter /api/source-status).'
                                    : 'Die Live-Zeitpunkte konnten gerade nicht geladen werden. Die 18 produktiv angebundenen Quellen im Überblick:'}
                            </p>
                            <div className="comparison-wrapper">
                                <table className="comparison-table">
                                    <thead>
                                        <tr>
                                            <th>Quelle</th>
                                            <th>Anbindung</th>
                                            <th>Abdeckung</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ANGEBUNDENE_QUELLEN.map((q) => (
                                            <tr key={q.source}>
                                                <td>{q.label}</td>
                                                <td>{q.iface === 'official_api' ? 'Offizielle Schnittstelle' : 'Portal-Auslese'}</td>
                                                <td>{q.ebene}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    <p style={{ marginTop: '1.25rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        Geplante Erweiterungen (noch nicht produktiv): Deutsche eVergabe und evergabe.de.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> EU-Abdeckung
                    </span>
                    <h2 className="section__title">
                        {totalTenders > 0
                            ? <>{new Intl.NumberFormat('de-DE').format(totalTenders)} Ausschreibungen aus <span className="gradient-text">{countries.length} Ländern</span></>
                            : <>Ausschreibungen je <span className="gradient-text">Land</span></>}
                    </h2>
                    <p className="section__subtitle">
                        Oberhalb der EU-Schwellenwerte über TED (alle 27 EU-Mitgliedstaaten); deutsche
                        Unterschwellen-Verfahren zusätzlich über Bund, den Datenservice Öffentlicher Einkauf,
                        DTVP, RIB und zehn Landes- und Regionalportale, ergänzt um Großbritannien und
                        US-Bundesbehörden (SAM.gov). Die Zahlen zählen gespeicherte Bekanntmachungen unserer
                        Verticals, einschließlich abgelaufener Verfahren und möglicher Mehrfachveröffentlichungen.
                        Sie sind keine Zahl aktuell offener Aufträge.
                    </p>
                    {countries.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
                            {countries.map((c) => (
                                <span className="badge badge--yes" key={c.country} title={COUNTRY_NAMES[c.country] || c.country}>
                                    {COUNTRY_NAMES[c.country] || c.country}: {new Intl.NumberFormat('de-DE').format(c.count)}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
                            {Object.entries(COUNTRY_NAMES).map(([code, name]) => (
                                <span className="badge badge--yes" key={code} title={code}>
                                    {name} ({code})
                                </span>
                            ))}
                        </div>
                    )}
                    <p style={{ marginTop: '2rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        Maschinenlesbar: <a href="/api/source-status">/api/source-status</a> ·{' '}
                        <a href="/api/countries">/api/countries</a> · Für Agenten:{' '}
                        <Link to="/entwickler">API &amp; MCP</Link> · Marktzahlen:{' '}
                        <Link to="/zahlen">Vergabemarkt in Zahlen</Link> ·{' '}
                        <Link to="/preise">Preise &amp; Pilotphase</Link>
                        <br />Bundesländer:{' '}
                        <Link to="/ausschreibungen-nrw">NRW</Link> ·{' '}
                        <Link to="/ausschreibungen-bayern">Bayern</Link> ·{' '}
                        <Link to="/ausschreibungen-baden-wuerttemberg">Baden-Württemberg</Link> ·{' '}
                        <Link to="/ausschreibungen-hessen">Hessen</Link> ·{' '}
                        <Link to="/ausschreibungen-berlin">Berlin</Link>
                    </p>
                </div>
            </section>
        </>
    )
}
