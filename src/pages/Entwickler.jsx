import { Helmet } from 'react-helmet-async'

const ENDPOINTS = [
    {
        method: 'GET',
        path: 'www.ausschreibungsagenten.de/api/tenders-public',
        desc: 'Öffentliche Tender-Vorschau: Freitext, Land, CPV, Score, Limit (max. 25).',
        auth: 'Keine · 600 Anfragen/Stunde',
    },
    {
        method: 'GET',
        path: 'www.ausschreibungsagenten.de/api/source-status',
        desc: 'Live-Quellenstatus mit letztem erfolgreichem Abruf je Portal.',
        auth: 'Keine · 600 Anfragen/Stunde',
    },
    {
        method: 'GET',
        path: 'www.ausschreibungsagenten.de/.well-known/agent-card.json',
        desc: 'A2A Agent Card: Discovery-Metadaten, Skills und Endpunkte für Agenten.',
        auth: 'Keine',
    },
    {
        method: 'POST',
        path: 'api.ausschreibungsagenten.de/api/a2a',
        desc: 'A2A JSON-RPC (message/send): status und search_tenders.',
        auth: 'Ohne Key: 60/Stunde · mit API-Key: Tarif-Limit',
    },
    {
        method: 'GET',
        path: 'api.ausschreibungsagenten.de/openapi.json',
        desc: 'Vollständige OpenAPI-Spezifikation der API.',
        auth: 'Keine',
    },
    {
        method: 'GET',
        path: 'api.ausschreibungsagenten.de/docs',
        desc: 'Interaktive API-Dokumentation (Swagger UI).',
        auth: 'Keine',
    },
]

const codeStyle = {
    background: 'rgba(0, 0, 0, 0.35)',
    border: '1px solid var(--glass-border)',
    borderRadius: 'var(--glass-radius)',
    padding: '1rem 1.25rem',
    overflowX: 'auto',
    fontSize: 'var(--font-size-sm)',
    lineHeight: 1.6,
    color: 'var(--text-secondary)',
}

export default function Entwickler() {
    return (
        <>
            <Helmet>
                <title>API & Agent-Anbindung | Ausschreibungen API Deutschland – Ausschreibungsagenten.de</title>
                <meta
                    name="description"
                    content="Öffentliche Ausschreibungen per API und KI-Agent abfragen: REST-Vorschau, A2A Agent Card, JSON-RPC und OpenAPI. Acht Live-Quellen, erklärbares Matching, transparente Limits."
                />
                <link rel="canonical" href="https://www.ausschreibungsagenten.de/entwickler" />
            </Helmet>

            <section className="hero" id="api">
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 2s ease-in-out infinite' }}></span>
                            A2A Agent Card + OpenAPI live
                        </div>
                        <h1 className="hero__title">
                            Ausschreibungen für <span className="gradient-text">Ihre Agenten</span>
                        </h1>
                        <p className="hero__description">
                            Acht öffentliche Live-Quellen, erklärbares Matching und eine Agent-Anbindung, die
                            Ihr KI-Agent selbst entdecken kann. Die Vorschau-API ist ohne Anmeldung nutzbar;
                            höhere Limits, Volltextsuche und Firmen-Fit gehören zum Agent-Tarif.
                        </p>
                        <div className="hero__actions">
                            <a href="https://api.ausschreibungsagenten.de/docs" target="_blank" rel="noopener noreferrer" className="btn btn--primary btn--lg">API-Docs öffnen →</a>
                            <a href="/#profil" className="btn btn--outline btn--lg">Agent-Tarif anfragen</a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Endpunkte
                    </span>
                    <h2 className="section__title">
                        Öffentliche <span className="gradient-text">Schnittstellen</span>
                    </h2>
                    <p className="section__subtitle">
                        Alle Vorschau-Endpunkte sind ohne Registrierung nutzbar und transparent limitiert.
                        Antworten verlinken immer auf die kostenlose Originalquelle.
                    </p>

                    <div className="comparison-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Methode</th>
                                    <th>Endpunkt</th>
                                    <th>Beschreibung</th>
                                    <th>Auth & Limit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ENDPOINTS.map((e, i) => (
                                    <tr key={i}>
                                        <td><span className="badge badge--yes">{e.method}</span></td>
                                        <td style={{ fontFamily: 'monospace', fontSize: 'var(--font-size-xs)' }}>{e.path}</td>
                                        <td>{e.desc}</td>
                                        <td>{e.auth}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Schnellstart
                    </span>
                    <h2 className="section__title">
                        In einer Minute zum <span className="gradient-text">ersten Treffer</span>
                    </h2>

                    <div style={{ display: 'grid', gap: '2rem', marginTop: '2rem' }}>
                        <div className="glass-card">
                            <h3 className="glass-card__title">1 · Tender-Vorschau per REST</h3>
                            <pre style={codeStyle}>{`curl "https://www.ausschreibungsagenten.de/api/tenders-public?search=fassade&country=DEU&min_score=50&limit=5"`}</pre>
                            <p className="glass-card__text" style={{ marginTop: '.75rem' }}>
                                Liefert ein JSON-Array mit Titel, Auftraggeber, CPV, Frist, geschätztem Wert,
                                Vertical, Relevanz-Score und der Originalquelle.
                            </p>
                        </div>

                        <div className="glass-card">
                            <h3 className="glass-card__title">2 · Agent Card entdecken (A2A)</h3>
                            <pre style={codeStyle}>{`curl https://www.ausschreibungsagenten.de/.well-known/agent-card.json`}</pre>
                            <p className="glass-card__text" style={{ marginTop: '.75rem' }}>
                                Die Card beschreibt Skills, Protokoll-Bindings und Endpunkte maschinenlesbar —
                                A2A-fähige Agenten konfigurieren sich damit selbst.
                            </p>
                        </div>

                        <div className="glass-card">
                            <h3 className="glass-card__title">3 · Suche per A2A JSON-RPC</h3>
                            <pre style={codeStyle}>{`curl -X POST https://api.ausschreibungsagenten.de/api/a2a \\
  -H "Content-Type: application/json" \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {"message": {"parts": [{"text": "search_tenders fassade"}]}}
  }'`}</pre>
                            <p className="glass-card__text" style={{ marginTop: '.75rem' }}>
                                Öffentlich verfügbar sind <code>status</code> und <code>search_tenders</code>.
                                Schreibende Profilaktionen sind im Produktionsbetrieb bewusst deaktiviert
                                und werden erst nach Pilotfreigabe je Mandant geöffnet.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="section section--alt">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Fair Use & Ausbau
                    </span>
                    <h2 className="section__title">
                        Was frei ist — und was zum <span className="gradient-text--amber">Agent-Tarif</span> gehört
                    </h2>
                    <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Frei nutzbar</h3>
                            <p className="glass-card__text">
                                Vorschau-Suche, Quellenstatus, Agent Card, OpenAPI und die lesenden
                                A2A-Aktionen — mit transparenten Limits (Header <code>x-ratelimit-*</code>).
                                Die Daten stammen aus öffentlichen Bekanntmachungen; jeder Treffer
                                verlinkt auf die kostenlose Originalquelle.
                            </p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Agent-Tarif (499 EUR/Monat)</h3>
                            <p className="glass-card__text">
                                API-Key mit höheren Limits, Volltextsuche, erklärbarer Firmen-Fit mit
                                Einzelgründen, Priorisierung sowie A2A-Profilaktionen. MCP ist Bestandteil
                                des Agent-Tarifs und öffentlich noch nicht freigeschaltet — der Zugang wird
                                im Pilot gemeinsam eingerichtet.
                            </p>
                            <div style={{ marginTop: '1rem' }}>
                                <a href="/#profil" className="btn btn--primary">Pilotzugang anfragen</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
