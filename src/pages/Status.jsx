import { useEffect, useState } from 'react'
import Seo from '../components/Seo'

const SOURCE_LABELS = {
    ted: 'TED (EU-Amtsblatt, api.ted.europa.eu)',
    bund: 'service.bund.de',
    bw: 'Landesportal Baden-Württemberg',
    bremen: 'Landesportal Bremen',
    sachsen: 'Landesportal Sachsen',
    mv: 'Landesportal Mecklenburg-Vorpommern',
    hessen: 'Landesportal Hessen',
    rlp: 'Landesportal Rheinland-Pfalz',
    fts: 'GB Find a Tender (OCDS)',
    cf: 'GB Contracts Finder (unterschwellig, OCDS)',
    doe: 'Datenservice Öffentlicher Einkauf (eForms-DE, Ober- + Unterschwelle)',
    bayern: 'Landesportal Bayern',
    nrw: 'Landesportal Nordrhein-Westfalen',
    mrn: 'Metropolregion Rhein-Neckar',
    vpbw: 'Vergabeportal Baden-Württemberg',
    dtvp: 'DTVP Deutsches Vergabeportal',
    rib: 'RIB / iTWO tender',
}

const COUNTRY_NAMES = {
    DEU: 'Deutschland', FRA: 'Frankreich', POL: 'Polen', SWE: 'Schweden', AUT: 'Österreich',
    BEL: 'Belgien', CZE: 'Tschechien', NLD: 'Niederlande', ESP: 'Spanien', ITA: 'Italien',
    LUX: 'Luxemburg', FIN: 'Finnland', IRL: 'Irland', HRV: 'Kroatien', EST: 'Estland',
    DNK: 'Dänemark', GRC: 'Griechenland', BGR: 'Bulgarien', HUN: 'Ungarn', LTU: 'Litauen',
    MLT: 'Malta', ROU: 'Rumänien', SVN: 'Slowenien', SVK: 'Slowakei', LVA: 'Lettland',
    PRT: 'Portugal', CYP: 'Zypern', GBR: 'Vereinigtes Königreich',
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
                            Wir behaupten keine Abdeckung, wir zeigen sie: jede Quelle mit letztem
                            erfolgreichem Abruf und jedes Land mit tatsächlicher Tender-Zahl im Index.
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
                        Portale und ihr <span className="gradient-text">letzter Abruf</span>
                    </h2>
                    {loading && <p className="section__subtitle">Status wird geladen...</p>}
                    {!loading && sources.length === 0 && (
                        <p className="section__subtitle">Der Status konnte gerade nicht geladen werden — bitte später erneut versuchen.</p>
                    )}
                    {sources.length > 0 && (
                        <div className="comparison-wrapper">
                            <table className="comparison-table">
                                <thead>
                                    <tr>
                                        <th>Quelle</th>
                                        <th>Status</th>
                                        <th>Letzter erfolgreicher Abruf</th>
                                        <th>Zuletzt geholt / gespeichert</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sources.map((s) => (
                                        <tr key={s.source}>
                                            <td>{SOURCE_LABELS[s.source] || s.source.toUpperCase()}</td>
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
                    )}
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
                        Oberhalb der EU-Schwellenwerte über TED; deutsche Unterschwellen-Verfahren
                        zusätzlich über Bund, den Datenservice Öffentlicher Einkauf, DTVP, RIB und
                        zehn Landes- und Regionalportale. Die Zahlen sind der aktuelle Live-Bestand
                        aktiver Verfahren unserer Verticals.
                    </p>
                    {countries.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem' }}>
                            {countries.map((c) => (
                                <span className="badge badge--yes" key={c.country} title={COUNTRY_NAMES[c.country] || c.country}>
                                    {COUNTRY_NAMES[c.country] || c.country}: {new Intl.NumberFormat('de-DE').format(c.count)}
                                </span>
                            ))}
                        </div>
                    )}
                    <p style={{ marginTop: '2rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        Maschinenlesbar: <a href="/api/source-status">/api/source-status</a> · <a href="/api/countries">/api/countries</a> · Für Agenten: <a href="/entwickler">API & MCP</a>
                    </p>
                </div>
            </section>
        </>
    )
}
