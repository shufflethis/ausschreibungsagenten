import { useState } from 'react'
import Seo from '../components/Seo'

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
        path: 'www.ausschreibungsagenten.de/api/countries',
        desc: 'Tatsächlich indexierte Länder (ISO-3) mit Tender-Zahl — alle 27 EU-Länder.',
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
        method: 'POST',
        path: 'api.ausschreibungsagenten.de/mcp',
        desc: 'MCP-Server (JSON-RPC): search_tenders frei, fulltext_search ab Pro/Agent-Key.',
        auth: 'Ohne Key: 60/Stunde · mit API-Key: Tarif-Limit',
    },
    {
        method: 'CLI',
        path: 'npx ausschreibungsagenten suche <begriff>',
        desc: 'Kommandozeilen-Client für Suche, Quellenstatus und Länderabdeckung; --json liefert die Rohantwort.',
        auth: 'Keine · optionaler Key hebt das Limit',
    },
    {
        method: 'POST',
        path: 'www.ausschreibungsagenten.de/api/signup',
        desc: 'Free API-Key anfordern (wird einmalig angezeigt und per E-Mail zugestellt).',
        auth: 'Keine · 10 Anfragen/Stunde',
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
    const [signupEmail, setSignupEmail] = useState('')
    const [signupHoneypot, setSignupHoneypot] = useState('')
    const [signupStatus, setSignupStatus] = useState(null)
    const [signupKey, setSignupKey] = useState(null)
    const [signupSending, setSignupSending] = useState(false)

    const handleSignup = async (e) => {
        e.preventDefault()
        setSignupSending(true)
        setSignupStatus(null)
        setSignupKey(null)
        try {
            const res = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: signupEmail, website: signupHoneypot }),
            })
            const data = await res.json().catch(() => ({}))
            if (res.ok && data.api_key) {
                setSignupStatus('success')
                setSignupKey(data.api_key)
                setSignupEmail('')
            } else if (res.status === 409) {
                setSignupStatus('exists')
            } else if (res.status === 429) {
                setSignupStatus('ratelimited')
            } else {
                setSignupStatus('error')
            }
        } catch {
            setSignupStatus('error')
        }
        setSignupSending(false)
    }

    return (
        <>
            <Seo path="/entwickler" />

            <section className="hero" id="api">
                <img
                    className="hero-foto"
                    src="/hero/entwickler-arbeitet-an-ausschreibungs-api.webp"
                    alt="Entwickler bindet die Ausschreibungs-API am Laptop an"
                    fetchPriority="high"
                />
                <div className="hero-foto__schleier" aria-hidden="true"></div>
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s ease-in-out infinite' }}></span>
                            MCP + A2A Agent Card + OpenAPI live
                        </div>
                        <h1 className="hero__title">
                            Ausschreibungsagenten <span className="gradient-text">API-Dokumentation</span>
                        </h1>
                        <p className="hero__description">
                            17 öffentliche Live-Quellen, erklärbares Matching und eine Agent-Anbindung, die
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
                            <h3 className="glass-card__title">1 · Ohne eine Zeile Code: die CLI</h3>
                            <pre style={codeStyle}>{`npx ausschreibungsagenten suche Fassade --land DEU --limit 5
npx ausschreibungsagenten quellen
npx ausschreibungsagenten laender --json`}</pre>
                            <p className="glass-card__text" style={{ marginTop: '.75rem' }}>
                                Das npm-Paket <code>ausschreibungsagenten</code> liest dieselbe öffentliche API,
                                ohne Anmeldung und ohne Abhängigkeiten. <code>--json</code> gibt die Rohantwort
                                aus; die Exit-Codes trennen abgelehnte Anfrage (1) von falschem Aufruf (2),
                                damit Skripte und Agenten die Fälle unterscheiden können.{' '}
                                <a href="https://www.npmjs.com/package/ausschreibungsagenten" rel="noopener">
                                    Paket auf npm
                                </a>
                            </p>
                        </div>

                        <div className="glass-card">
                            <h3 className="glass-card__title">2 · Tender-Vorschau per REST</h3>
                            <pre style={codeStyle}>{`curl "https://www.ausschreibungsagenten.de/api/tenders-public?search=fassade&country=DEU&min_score=50&limit=5"`}</pre>
                            <p className="glass-card__text" style={{ marginTop: '.75rem' }}>
                                Liefert ein JSON-Array mit Titel, Auftraggeber, CPV, Frist, geschätztem Wert,
                                Notice-Sprachen (ISO-639-3), Losen, Zuschlagskriterien, Rahmenvereinbarungs-
                                und GPA-Kennzeichen, Vertical, Relevanz-Score und der Originalquelle.
                                <code> country</code> akzeptiert alle 27 EU-Länder (ISO-3, z. B. FRA, ITA, POL).
                            </p>
                        </div>

                        <div className="glass-card">
                            <h3 className="glass-card__title">3 · Agent Card entdecken (A2A)</h3>
                            <pre style={codeStyle}>{`curl https://www.ausschreibungsagenten.de/.well-known/agent-card.json`}</pre>
                            <p className="glass-card__text" style={{ marginTop: '.75rem' }}>
                                Die Card beschreibt Skills, Protokoll-Bindings und Endpunkte maschinenlesbar —
                                A2A-fähige Agenten konfigurieren sich damit selbst.
                            </p>
                        </div>

                        <div className="glass-card">
                            <h3 className="glass-card__title">4 · Suche per A2A JSON-RPC</h3>
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

            <section className="section section--alt" id="api-key">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <span className="section__label">
                        <span className="pulse"></span> Free API-Key
                    </span>
                    <h2 className="section__title">
                        Kostenlosen <span className="gradient-text">API-Key</span> anfordern
                    </h2>
                    <p className="section__subtitle">
                        Der Free-Tier umfasst 60 Anfragen pro Stunde auf die Vorschau-Endpunkte und den
                        MCP-Server (search_tenders). Der Key wird einmalig angezeigt und zusätzlich per
                        E-Mail zugestellt.
                    </p>

                    <div className="glass-card">
                        <form onSubmit={handleSignup}>
                            <input className="form-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={signupHoneypot} onChange={(e) => setSignupHoneypot(e.target.value)} />
                            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                <label htmlFor="api-key-email" className="profile-lead__field" style={{ flex: '1 1 260px' }}>Geschäftliche E-Mail *
                                <input
                                    id="api-key-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    value={signupEmail}
                                    onChange={(e) => setSignupEmail(e.target.value)}
                                    required
                                />
                                </label>
                                <button type="submit" className="btn btn--primary" disabled={signupSending}>
                                    {signupSending ? 'Key wird erstellt...' : 'Free API-Key erstellen'}
                                </button>
                            </div>
                            {signupStatus === 'success' && signupKey && (
                                <div style={{ marginTop: '1.25rem' }}>
                                    <p className="form-status form-status--success">
                                        Ihr API-Key — bitte jetzt sicher speichern, er wird nur einmal angezeigt
                                        (Kopie geht an Ihre E-Mail):
                                    </p>
                                    <pre style={codeStyle}>{signupKey}</pre>
                                </div>
                            )}
                            {signupStatus === 'exists' && (
                                <p className="form-status form-status--error" role="alert">
                                    Diese E-Mail ist bereits registriert. Bei Key-Verlust schreiben Sie an hi@ausschreibungsagenten.de.
                                </p>
                            )}
                            {signupStatus === 'ratelimited' && (
                                <p className="form-status form-status--error" role="alert">
                                    Zu viele Anfragen. Bitte versuchen Sie es in einer Stunde erneut.
                                </p>
                            )}
                            {signupStatus === 'error' && (
                                <p className="form-status form-status--error" role="alert">
                                    Der Key konnte nicht erstellt werden. Bitte später erneut versuchen oder an hi@ausschreibungsagenten.de schreiben.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </section>

            <section className="section">
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
                                Vorschau-Suche, Quellenstatus, Agent Card, OpenAPI, die lesenden
                                A2A-Aktionen und die MCP-Tendersuche — mit transparenten Limits
                                (Header <code>x-ratelimit-*</code>). Die Daten stammen aus öffentlichen
                                Bekanntmachungen; jeder Treffer verlinkt auf die kostenlose Originalquelle.
                            </p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Agent-Tarif — kostenfrei in der Pilotphase</h3>
                            <p className="glass-card__text">
                                API-Key mit höheren Limits (3.600/h), MCP-Volltextsuche, erklärbarer
                                Firmen-Fit mit Einzelgründen, Priorisierung sowie A2A-Profilaktionen.
                                Wir suchen aktuell weitere Pilotpartner; im Pilot fallen keine Kosten an
                                (später geplant: <s>499 EUR/Monat</s>). Der Zugang wird persönlich
                                eingerichtet; ein Online-Checkout ist noch nicht freigeschaltet.
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
