import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

const TOOLS = [
    { name: 'DTVP', url: 'https://www.dtvp.de', price: 'ab €39/Mon.', ai: false, portals: '~100%', focus: 'Offizielles Portal', gaeb: false, alerts: true, free: true },
    { name: 'aumass', url: 'https://www.aumass.de', price: '€39–79/Mon.', ai: false, portals: 'Alle', focus: 'Breite Abdeckung', gaeb: false, alerts: true, free: true },
    { name: 'GAEB.ai', url: 'https://gaeb.ai', price: 'Individuell', ai: true, portals: '8+', focus: 'Elektro/Bau', gaeb: true, alerts: true, free: true },
    { name: 'Vergabe24', url: 'https://www.vergabe24.de', price: '~€50–100/Mon.', ai: false, portals: '500.000+/Jahr', focus: 'Regional', gaeb: false, alerts: true, free: false },
    { name: 'TenderWolf', url: 'https://www.tenderwolf.com', price: '€80–150/Mon.', ai: true, portals: 'EU-weit', focus: 'Europa', gaeb: false, alerts: true, free: true },
    { name: 'Jorpex', url: 'https://www.jorpex.com', price: '$49–149/Mon.', ai: true, portals: 'Global', focus: 'International', gaeb: false, alerts: true, free: false },
    { name: 'Bidfix', url: 'https://bidfix.ai', price: 'k.A.', ai: true, portals: 'DACH', focus: 'DACH-Markt', gaeb: false, alerts: true, free: false },
    { name: 'Hermix', url: 'https://hermix.com', price: 'Enterprise', ai: true, portals: 'EU', focus: 'Öffentl. Sektor', gaeb: false, alerts: true, free: true },
]

const FEATURES = [
    { icon: '🔍', title: 'Acht Live-Quellen', text: 'TED, service.bund.de sowie Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz werden regelmäßig abgefragt. DTVP, eVergabe, Bayern und NRW befinden sich im Ausbau.', color: '' },
    { icon: '🎯', title: 'Erklärbares Matching', text: 'CPV-Codes, Leistungsbegriffe, Ausschlusswörter, Leistungsort, Auftragswert und Frist ergeben einen transparenten Firmen-Fit mit einzelnen Score-Gründen.', color: '--violet' },
    { icon: '✉️', title: 'E-Mail-Digest', text: 'Im Pilot erhalten Profile neue, noch nicht versendete Treffer täglich oder wöchentlich per E-Mail. WhatsApp und Push sind noch nicht produktiv.', color: '--amber' },
    { icon: '📄', title: 'GAEB X83/X84 lesen', text: 'GAEB-DA-XML-Dateien der Austauschphasen X83 und X84 werden nur lesend strukturiert: Bereiche, Positionen, Mengen, Einheiten und optionale Preise. Keine Kalkulationsautomatik.', color: '--green' },
    { icon: '📊', title: 'Pilot-Dashboard', text: 'Aktive Treffer, Fit-Gründe, Fristen, Auftragswerte, Originalquelle, Status und interne Notizen in einer geschützten Profilansicht.', color: '' },
    { icon: '↗️', title: 'Standardisierter ERP-Export', text: 'Tender lassen sich als versioniertes JSON, CSV oder XLSX exportieren. Ein signierter Webhook ist konfigurierbar; konkrete ERP-Connectoren folgen erst nach Herstellerklärung.', color: '--violet' },
]

const BRANCHEN = [
    { emoji: '🏗️', name: 'Fenster & Fassade', desc: 'Im Pilot aktiv: Fenster, Türen, Fassaden, Verglasung, Metallbau, Sonnenschutz und ausgewählte Brandschutz-Gewerke.' },
    { emoji: '📣', name: 'Marketing & Digital', desc: 'Weiterhin aktiv: Marketing, Werbung, PR, Webdesign, Grafik und ausgewählte digitale Dienstleistungen.' },
    { emoji: '🧭', name: 'Weitere Branchen', desc: 'Weitere Branchen werden nach CPV-Katalog und Pilotbedarf konfiguriert. Eine vollständige Abdeckung aller Gewerke behaupten wir derzeit nicht.' },
]

const FAQS = [
    { q: 'Was sind öffentliche Ausschreibungen und warum sind sie wichtig?', a: 'Öffentliche Ausschreibungen sind Vergabeverfahren, mit denen Behörden, Kommunen und öffentliche Einrichtungen Aufträge an Unternehmen vergeben. Mit einem jährlichen Volumen von rund 500 Milliarden Euro allein in Deutschland sind sie eine der größten Auftragsquellen für Unternehmen jeder Größe. Öffentliche Aufträge bieten Planungssicherheit, faire Konditionen und regelmäßige Zahlungen.' },
    { q: 'Welche Vergabeportale gibt es in Deutschland?', a: 'Zu den wichtigen Quellen gehören DTVP, eVergabe, service.bund.de, die Landesportale und für EU-Verfahren TED. Unser eigener Pilot indexiert aktuell TED, service.bund.de sowie Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz. Weitere Portale sind im Ausbau.' },
    { q: 'Was macht der Ausschreibungsagent konkret?', a: 'Der aktuelle Agent ordnet Bekanntmachungen über CPV-Codes und Regeln Branchen zu. Anschließend vergleicht er Firmenprofil, Keywords, Ausschlüsse, Leistungsort, Auftragswert und Frist. Jeder Fit-Score wird mit nachvollziehbaren Einzelgründen angezeigt; semantisches KI-Matching wird nicht als bereits produktiv behauptet.' },
    { q: 'Wie viel kostet ein Ausschreibungsagent?', a: 'Die Preise variieren je nach Anbieter und Funktionsumfang. Einstiegsangebote beginnen bei ca. 39 €/Monat für Basis-Funktionen (z. B. aumass Start). Professionelle Tools mit KI-Features liegen zwischen 80 und 200 €/Monat. Enterprise-Lösungen mit API-Zugang und White-Label-Optionen werden individuell bepreist. Angesichts des Potenzials öffentlicher Aufträge amortisiert sich die Investition oft schon mit einem einzigen gewonnenen Auftrag.' },
    { q: 'Ab welchem Auftragsvolumen lohnt sich die Suche nach öffentlichen Ausschreibungen?', a: 'Grundsätzlich gibt es keine Untergrenze. Bereits Kleinstaufträge ab wenigen tausend Euro werden öffentlich ausgeschrieben, insbesondere auf kommunaler Ebene. Für die meisten Unternehmen lohnt sich der Einstieg ab einem anvisierten Jahresauftragsvolumen von 50.000 €. Die Vergaberechts-Schwellenwerte liegen aktuell bei 143.000 € für Liefer- und Dienstleistungsaufträge und 5.538.000 € für Bauaufträge (EU-weite Vergabe).' },
    { q: 'Welche GAEB-Funktion ist verfügbar?', a: 'Der Pilot liest GAEB DA XML X83 und X84 nur lesend ein und zeigt Metadaten, Bereiche, Positionen, Texte, Mengen, Einheiten und vorhandene Preise. CSV- und XLSX-Export sind möglich. Automatische Kalkulation, Preisempfehlung und Angebotsabgabe gehören nicht zum aktuellen Umfang.' },
    { q: 'Wie viele Ausschreibungen werden täglich veröffentlicht?', a: 'In Deutschland werden täglich mehrere tausend neue Ausschreibungen auf den verschiedenen Vergabeportalen veröffentlicht. Allein das DTVP (Deutsches Vergabeportal) verzeichnet über 500.000 Bekanntmachungen pro Jahr. Ohne automatisierte Suche ist es praktisch unmöglich, alle relevanten Ausschreibungen manuell zu erfassen – insbesondere, wenn man mehrere Portale und Bundesländer abdecken möchte.' },
    { q: 'Welche Branchen profitieren am meisten von Ausschreibungsagenten?', a: 'Besonders stark profitieren das Baugewerbe, Handwerksbetriebe, IT-Dienstleister, Ingenieurbüros und Facility-Management-Unternehmen. Aber auch Catering, Reinigung, Beratung, Schulung und viele weitere Branchen finden regelmäßig passende öffentliche Aufträge. Grundsätzlich gilt: Jedes Unternehmen, das Dienstleistungen oder Produkte an den öffentlichen Sektor verkaufen kann, sollte Ausschreibungsagenten nutzen.' },
    { q: 'Kann ich auch als kleines Unternehmen an öffentlichen Ausschreibungen teilnehmen?', a: 'Ja, unbedingt! Das Vergaberecht fördert sogar explizit die Beteiligung kleiner und mittlerer Unternehmen (KMU). Viele Aufträge werden in Lose aufgeteilt, um auch kleineren Betrieben die Teilnahme zu ermöglichen. Kommunale Ausschreibungen sind oft besonders KMU-freundlich. Ein KI-Agent hilft Ihnen, genau die Ausschreibungen zu finden, die zu Ihrer Unternehmensgröße und Ihren Kapazitäten passen.' },
    { q: 'Wie unterscheidet sich ausschreibungsagenten.de von anderen Plattformen?', a: 'Neben dem Marktüberblick erproben wir einen eigenen, transparenten Ausschreibungsagenten. Im aktuellen Pilot sind acht öffentliche Quellen, erklärbares Profil-Matching, strukturierte Go/No-Go-Karten, E-Mail-Digests, GAEB X83/X84 und Standardexporte verfügbar. Portale und Hersteller-Connectoren im Ausbau kennzeichnen wir ausdrücklich.' },
    { q: 'Welche Fristen gelten bei öffentlichen Ausschreibungen?', a: 'Die Angebotsfristen variieren je nach Verfahrensart. Bei offenen Verfahren oberhalb der EU-Schwellenwerte beträgt die Mindestfrist 35 Tage (mit elektronischer Bekanntmachung: 30 Tage). Unterhalb der Schwellenwerte und bei nationalen Verfahren gelten oft kürzere Fristen von 10–15 Werktagen. Ein Ausschreibungsagent mit Fristenkalender sorgt dafür, dass Sie keine Deadline verpassen.' },
    { q: 'Ist die Nutzung der Vergabeportale kostenlos?', a: 'Die Einsicht in Bekanntmachungen ist auf den meisten offiziellen Portalen kostenlos. Die Teilnahme an elektronischen Vergabeverfahren über das DTVP ist ebenfalls kostenfrei. Erweiterte Funktionen wie Suchprofile, automatische Benachrichtigungen und Export-Funktionen sind bei vielen Portalen premium-pflichtig. Drittanbieter-Tools wie aumass, TenderWolf oder GAEB.ai bieten Mehrwert-Features gegen monatliche Gebühren.' },
]

const TENDER_PRESETS = [
    { label: 'Fassade', value: 'fassade' },
    { label: 'Fenster', value: 'fenster' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Webdesign', value: 'website' },
    { label: 'IT', value: 'software' },
    { label: 'PR', value: 'öffentlichkeitsarbeit' },
]

const formatDate = (value) => {
    if (!value) return 'Keine Frist genannt'
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
}

const formatCurrency = (value) => {
    if (!value) return null
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Number(value))
}

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null)
    const [formData, setFormData] = useState({ name: '', email: '', company: '', branche: '', message: '' })
    const [formStatus, setFormStatus] = useState(null)
    const [sending, setSending] = useState(false)
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [newsletterStatus, setNewsletterStatus] = useState(null)
    const [tenderQuery, setTenderQuery] = useState('marketing')
    const [tenders, setTenders] = useState([])
    const [tendersLoading, setTendersLoading] = useState(true)
    const [tendersError, setTendersError] = useState(null)
    const [sourceStatus, setSourceStatus] = useState([])
    const [profileData, setProfileData] = useState({
        email: '',
        company: '',
        industry: '',
        region: '',
        services: '',
        budget: '',
        frequency: '',
    })
    const [profileStatus, setProfileStatus] = useState(null)
    const [profileSending, setProfileSending] = useState(false)
    const [profileResult, setProfileResult] = useState(null)
    const [selectedTender, setSelectedTender] = useState(null)
    const [checkoutPlan, setCheckoutPlan] = useState(null)
    const [checkoutError, setCheckoutError] = useState(null)

    useEffect(() => {
        const controller = new AbortController()
        const loadTenders = async () => {
            setTendersLoading(true)
            setTendersError(null)
            try {
                const params = new URLSearchParams({
                    country: 'DEU',
                    search: tenderQuery,
                    min_score: '50',
                    limit: '6',
                })
                const res = await fetch(`/api/tenders-public?${params.toString()}`, {
                    signal: controller.signal,
                })
                if (!res.ok) {
                    throw new Error('Tender search failed')
                }
                const data = await res.json()
                setTenders(Array.isArray(data) ? data : [])
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setTendersError('Aktuelle Ausschreibungen konnten gerade nicht geladen werden.')
                }
            } finally {
                if (!controller.signal.aborted) {
                    setTendersLoading(false)
                }
            }
        }

        loadTenders()
        return () => controller.abort()
    }, [tenderQuery])

    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/source-status', { signal: controller.signal })
            .then((response) => response.ok ? response.json() : [])
            .then((data) => setSourceStatus(Array.isArray(data) ? data : []))
            .catch(() => {})
        return () => controller.abort()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        setFormStatus(null)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setFormStatus('success')
                setFormData({ name: '', email: '', company: '', branche: '', message: '' })
            } else {
                setFormStatus('error')
            }
        } catch {
            setFormStatus('error')
        }
        setSending(false)
    }

    const handleNewsletter = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newsletterEmail }),
            })
            if (res.ok) {
                setNewsletterStatus('success')
                setNewsletterEmail('')
            } else {
                setNewsletterStatus('error')
            }
        } catch {
            setNewsletterStatus('error')
        }
    }

    const handleProfileSubmit = async (e) => {
        e.preventDefault()
        setProfileSending(true)
        setProfileStatus(null)
        setProfileResult(null)
        try {
            const res = await fetch('/api/profile-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileData),
            })
            if (res.ok) {
                const data = await res.json()
                setProfileStatus('success')
                setProfileResult(data)
                setProfileData({
                    email: '',
                    company: '',
                    industry: '',
                    region: '',
                    services: '',
                    budget: '',
                    frequency: '',
                })
            } else {
                setProfileStatus('error')
            }
        } catch {
            setProfileStatus('error')
        }
        setProfileSending(false)
    }

    const startCheckout = async (plan) => {
        const email = profileResult?.email
        if (!email) {
            setCheckoutError('Bitte zuerst das Agentenprofil mit geschäftlicher E-Mail anlegen.')
            document.getElementById('profil')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            return
        }

        setCheckoutPlan(plan)
        setCheckoutError(null)
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    plan,
                    profile_id: profileResult?.profile_id,
                }),
            })
            const data = await res.json().catch(() => null)
            if (!res.ok || !data?.checkout_url) {
                throw new Error(data?.detail || data?.error || 'Checkout konnte nicht erstellt werden.')
            }
            window.location.href = data.checkout_url
        } catch (err) {
            setCheckoutError(err.message || 'Checkout konnte nicht gestartet werden.')
            setCheckoutPlan(null)
        }
    }

    return (
        <>
            <Helmet>
                <title>Ausschreibungsagenten.de – Ausschreibungen aus TED, Bund und Landesportalen filtern</title>
                <meta name="description" content="Öffentliche Ausschreibungen aus TED, service.bund.de sowie sechs Landesportalen finden. Erklärbares Profil-Matching, Go/No-Go-Karten, E-Mail-Digest, GAEB X83/X84 und Standardexport." />
            </Helmet>

            {/* ===== HERO ===== */}
            <section className="hero" id="start">
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 2s ease-in-out infinite' }}></span>
                            TED + Bund + sechs Landesportale live
                        </div>

                        <h1 className="hero__title">
                            Nie wieder<br />
                            <span className="gradient-text">Ausschreibungen verpassen</span>
                        </h1>

                        <p className="hero__description">
                            Unser Pilot durchsucht TED, service.bund.de sowie sechs Landesportale und bewertet Ausschreibungen
                            nachvollziehbar nach Ihrem Firmenprofil. Weitere Portale werden schrittweise angebunden.
                        </p>

                        <div className="hero__actions">
                            <a href="#vergleich" className="btn btn--primary btn--lg">Tools vergleichen →</a>
                            <a href="#kontakt" className="btn btn--outline btn--lg">Beratung anfragen</a>
                        </div>

                        <div className="hero__stats">
                            <div className="hero__stat">
                                <span className="hero__stat-value">€500 Mrd.</span>
                                <span className="hero__stat-label">Öffentliches Beschaffungsvolumen/Jahr</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#8b5cf6' }}>500.000+</span>
                                <span className="hero__stat-label">Ausschreibungen pro Jahr in DE</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#f59e0b' }}>6</span>
                                <span className="hero__stat-label">Produktive öffentliche Quellen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PROBLEM ===== */}
            <section className="section section--alt" id="problem">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Das Problem
                    </span>
                    <h2 className="section__title">
                        Warum <span className="gradient-text--amber">manuelle Suche</span> Sie Aufträge kostet
                    </h2>
                    <p className="section__subtitle">
                        Jeden Tag werden tausende neue Ausschreibungen veröffentlicht – verteilt auf Dutzende Portale.
                        Wer manuell sucht, verliert systematisch Aufträge an die Konkurrenz.
                    </p>

                    <div className="problem-grid">
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">73%</div>
                            <h3 className="glass-card__title">Zeitverlust</h3>
                            <p className="glass-card__text">
                                Durchschnittlich verbringen Unternehmen 5–8 Stunden pro Woche mit der manuellen Suche auf verschiedenen Vergabeportalen. Zeit, die für die Angebotserstellung und Kernarbeit fehlt. Mitarbeiter klicken sich durch DTVP, eVergabe, Bund.de und Landesportale – ohne Garantie, alle relevanten Ausschreibungen zu finden.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">85%</div>
                            <h3 className="glass-card__title">Informationsflut</h3>
                            <p className="glass-card__text">
                                Die meisten Suchergebnisse sind irrelevant. Ohne intelligentes Filtering wühlen Sie sich durch hunderte unpassende Ausschreibungen, um die wenigen relevanten Treffer zu finden. Falsche Region, falsches Gewerk, zu hohes Auftragsvolumen – die Trefferquote manueller Suche liegt unter 15%.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">40%</div>
                            <h3 className="glass-card__title">Verpasste Fristen</h3>
                            <p className="glass-card__text">
                                Angebotsfristen bei öffentlichen Vergaben sind oft knapp bemessen – zwischen 10 und 35 Tagen. Wer eine Ausschreibung erst nach einer Woche entdeckt, hat kaum noch Zeit für eine qualitativ hochwertige Angebotserstellung. Verspätete Angebote werden ausnahmslos ausgeschlossen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="section" id="prozess">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> So funktioniert's
                    </span>
                    <h2 className="section__title">
                        In 3 Schritten zum <span className="gradient-text">passenden Auftrag</span>
                    </h2>
                    <p className="section__subtitle">
                        Richten Sie Ihren persönlichen KI-Agenten ein und erhalten Sie ab sofort nur noch relevante
                        Ausschreibungen – automatisch und tagesaktuell.
                    </p>

                    <div className="steps-grid">
                        <div className="glass-card step-card">
                            <div className="step-card__number">1</div>
                            <h3 className="glass-card__title">Profil anlegen</h3>
                            <p className="glass-card__text">
                                Definieren Sie Ihr Firmenprofil: Gewerke, Leistungsbereiche, bevorzugte Regionen,
                                Auftragsvolumen und Eignungskriterien. Je präziser Ihr Profil, desto besser die
                                Trefferqualität Ihres KI-Agenten. Die Einrichtung dauert nur wenige Minuten.
                            </p>
                        </div>
                        <div className="glass-card step-card">
                            <div className="step-card__number">2</div>
                            <h3 className="glass-card__title">Agent arbeitet</h3>
                            <p className="glass-card__text">
                                Der Agent fragt TED, service.bund.de, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz regelmäßig ab. Jede neue Ausschreibung wird
                                über CPV, Regeln, Keywords, Region, Wert und Frist mit Ihrem Profil abgeglichen.
                                DTVP, eVergabe sowie die Portale Bayern und NRW sind als nächste Quellen geplant.
                            </p>
                        </div>
                        <div className="glass-card step-card">
                            <div className="step-card__number">3</div>
                            <h3 className="glass-card__title">Angebot abgeben</h3>
                            <p className="glass-card__text">
                                Neue, noch nicht versendete Treffer kommen täglich oder wöchentlich per E-Mail.
                                Das Pilot-Dashboard zeigt Auftraggeber, Leistungsort, Frist, Wert, Match-Gründe und
                                Originalquelle. Push und WhatsApp sind noch nicht produktiv.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== LIVE SEARCH ===== */}
            <section className="section section--alt" id="suche">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Live-Suche
                    </span>
                    <h2 className="section__title">
                        Aktuelle <span className="gradient-text--amber">Ausschreibungen</span> aus dem Agenten-Index
                    </h2>
                    <p className="section__subtitle">
                        Diese Treffer kommen direkt aus AgentLeads. Die freie Vorschau zeigt ausgewählte Ergebnisse;
                        ein Pilotprofil ergänzt Firmen-Fit, Status, Notizen, Digest, GAEB und Exporte.
                    </p>

                    <div className="glass-card" style={{ marginBottom: '2rem' }}>
                        <h3 className="glass-card__title">Quellenstatus</h3>
                        <p className="glass-card__text">
                            TED, service.bund.de, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz sind live. DTVP, eVergabe sowie die
                            Landesportale Bayern und Nordrhein-Westfalen sind noch nicht produktiv angebunden.
                        </p>
                        {sourceStatus.length > 0 && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.75rem', marginTop: '1rem' }}>
                                {sourceStatus.map((source) => (
                                    <span className={`badge ${source.implementation_status === 'live' ? 'badge--yes' : 'badge--no'}`} key={source.source}>
                                        {source.source.toUpperCase()}: {source.implementation_status === 'live' ? 'live' : 'im Ausbau'}
                                        {source.implementation_status === 'live' && source.last_success_at
                                            ? ` · Datenstand ${formatDate(source.last_success_at)}`
                                            : source.last_attempt_at
                                                ? ` · zuletzt geprüft ${formatDate(source.last_attempt_at)}`
                                                : ''}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="tender-search">
                        <form className="tender-search__form" onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="tender-query">Leistung suchen</label>
                            <div className="tender-search__input-row">
                                <input
                                    id="tender-query"
                                    type="search"
                                    value={tenderQuery}
                                    onChange={(e) => setTenderQuery(e.target.value)}
                                    placeholder="z. B. Fassade, Fenster, Webdesign, PR"
                                />
                                <a href="#kontakt" className="btn btn--amber">Profil anlegen</a>
                            </div>
                        </form>

                        <div className="tender-search__presets" aria-label="Beispielsuchen">
                            {TENDER_PRESETS.map((preset) => (
                                <button
                                    key={preset.value}
                                    type="button"
                                    className={tenderQuery === preset.value ? 'is-active' : ''}
                                    onClick={() => setTenderQuery(preset.value)}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {tendersLoading && (
                            <div className="tender-state">Aktuelle Ausschreibungen werden geladen...</div>
                        )}
                        {tendersError && (
                            <div className="tender-state tender-state--error">{tendersError}</div>
                        )}
                        {!tendersLoading && !tendersError && tenders.length === 0 && (
                            <div className="tender-state">
                                Keine passenden Vorschau-Treffer gefunden. Mit einem Firmenprofil kann der Agent breiter suchen.
                            </div>
                        )}

                        {!tendersLoading && !tendersError && tenders.length > 0 && (
                            <div className="tender-grid">
                                {tenders.map((tender) => {
                                    const value = formatCurrency(tender.estimated_value_eur)
                                    return (
                                        <article className="tender-card" key={tender.id}>
                                            <div className="tender-card__meta">
                                                <span>{tender.source.toUpperCase()}</span>
                                                <span>Score {tender.relevance_score}</span>
                                            </div>
                                            <h3>{tender.title}</h3>
                                            <dl>
                                                <div>
                                                    <dt>Auftraggeber</dt>
                                                    <dd>{tender.buyer_name || 'Nicht angegeben'}</dd>
                                                </div>
                                                <div>
                                                    <dt>Frist</dt>
                                                    <dd>{formatDate(tender.deadline_at)}</dd>
                                                </div>
                                                {value && (
                                                    <div>
                                                        <dt>Wert</dt>
                                                        <dd>{value}</dd>
                                                    </div>
                                                )}
                                            </dl>
                                            <button
                                                type="button"
                                                className="source-trigger"
                                                onClick={() => setSelectedTender(tender)}
                                            >
                                                Quelle öffnen
                                            </button>
                                        </article>
                                    )
                                })}
                            </div>
                        )}

                        <div className="profile-lead" id="profil">
                            <div>
                                <span className="profile-lead__eyebrow">Nächster Schritt</span>
                                <h3>Persönlichen Ausschreibungsagenten vorbereiten</h3>
                                <p>
                                    Hinterlegen Sie Ihr Suchprofil. Wir prüfen passende Branchen, Regionen und
                                    Auftragsgrößen und melden uns mit den nächsten konkreten Treffern.
                                </p>
                            </div>
                            <form className="profile-lead__form" onSubmit={handleProfileSubmit}>
                                <div className="profile-lead__grid">
                                    <input
                                        type="text"
                                        placeholder="Unternehmen *"
                                        value={profileData.company}
                                        onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                                        required
                                    />
                                    <input
                                        type="email"
                                        placeholder="Geschäftliche E-Mail *"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        required
                                    />
                                    <select
                                        value={profileData.industry}
                                        onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                                    >
                                        <option value="">Branche wählen</option>
                                        <option value="Handwerk">Handwerk</option>
                                        <option value="Bau">Bau</option>
                                        <option value="IT">IT / Software</option>
                                        <option value="Marketing">Marketing / PR</option>
                                        <option value="Beratung">Beratung</option>
                                        <option value="Facility">Facility Management</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Region, z. B. NRW, Berlin, DACH"
                                        value={profileData.region}
                                        onChange={(e) => setProfileData({ ...profileData, region: e.target.value })}
                                    />
                                    <select
                                        value={profileData.budget}
                                        onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}
                                    >
                                        <option value="">Ziel-Auftragsvolumen</option>
                                        <option value="Bis 25.000 EUR">Bis 25.000 EUR</option>
                                        <option value="25.000-100.000 EUR">25.000-100.000 EUR</option>
                                        <option value="100.000-500.000 EUR">100.000-500.000 EUR</option>
                                        <option value="500.000+ EUR">500.000+ EUR</option>
                                    </select>
                                    <select
                                        value={profileData.frequency}
                                        onChange={(e) => setProfileData({ ...profileData, frequency: e.target.value })}
                                    >
                                        <option value="">Teilnahme bisher</option>
                                        <option value="Noch nie">Noch nie</option>
                                        <option value="1-3 pro Jahr">1-3 pro Jahr</option>
                                        <option value="Monatlich">Monatlich</option>
                                        <option value="Regelmäßig / Team vorhanden">Regelmäßig / Team vorhanden</option>
                                    </select>
                                </div>
                                <textarea
                                    placeholder="Welche Leistungen sollen Agenten für Sie suchen? *"
                                    value={profileData.services}
                                    onChange={(e) => setProfileData({ ...profileData, services: e.target.value })}
                                    required
                                />
                                <button type="submit" className="btn btn--primary" disabled={profileSending}>
                                    {profileSending ? 'Profil wird gesendet...' : 'Agentenprofil anfragen'}
                                </button>
                                {profileStatus === 'success' && (
                                    <p className="form-status form-status--success">
                                        Profil angekommen. Ihr Agent hat die ersten Treffer berechnet.
                                    </p>
                                )}
                                {profileStatus === 'error' && (
                                    <p className="form-status form-status--error">
                                        Das Profil konnte nicht gesendet werden. Bitte nutzen Sie das Kontaktformular unten.
                                    </p>
                                )}
                            </form>
                        </div>

                        {profileResult && (
                            <div className="agent-offer" aria-live="polite">
                                <div className="agent-offer__header">
                                    <div>
                                        <span className="profile-lead__eyebrow">Sofort-Auswertung</span>
                                        <h3>Ihr Ausschreibungsagent ist vorbereitet</h3>
                                        <p>
                                            Profil-ID {profileResult.profile_id}. Die kostenlose Vorschau zeigt erste Treffer;
                                            im geschützten Pilot-Dashboard können Sie Fit-Gründe, Status, Notizen, GAEB und Exporte prüfen.
                                        </p>
                                        {profileResult.pilot_url && (
                                            <a className="btn btn--outline" href={profileResult.pilot_url} rel="noreferrer">Pilot-Dashboard öffnen</a>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        className="btn btn--primary"
                                        onClick={() => startCheckout('agent')}
                                        disabled={checkoutPlan !== null}
                                    >
                                        {checkoutPlan === 'agent' ? 'Stripe wird geöffnet...' : 'Agent-Plan aktivieren'}
                                    </button>
                                </div>

                                {profileResult.matches?.length > 0 ? (
                                    <div className="match-grid">
                                        {profileResult.matches.map((match) => {
                                            const tender = match.tender || {}
                                            return (
                                                <article className="match-card" key={tender.id || tender.source_url}>
                                                    <div className="match-card__score">{match.match_score}% Fit</div>
                                                    <h4>{tender.title}</h4>
                                                    <p>{tender.buyer_name || 'Auftraggeber nicht angegeben'}</p>
                                                    <ul>
                                                        {(match.reasons || []).slice(0, 2).map((reason) => (
                                                            <li key={reason}>{reason}</li>
                                                        ))}
                                                    </ul>
                                                    {tender.source_url && (
                                                        <button
                                                            type="button"
                                                            className="source-trigger"
                                                            onClick={() => setSelectedTender(tender)}
                                                        >
                                                            Ausschreibung öffnen
                                                        </button>
                                                    )}
                                                </article>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="tender-state">
                                        Noch keine starken Sofort-Treffer im aktuellen TED-/bund.de-Index. Wir schärfen mit Ihnen
                                        CPVs, Begriffe, Ausschlüsse, Regionen und Zielwerte für den Pilot.
                                    </div>
                                )}

                                <div className="pricing-strip">
                                    <article>
                                        <strong>Pro</strong>
                                        <span>149 EUR/Monat</span>
                                        <p>Suchprofil, Alerts, Fulltext-Suche und wöchentliche Trefferliste.</p>
                                        <button
                                            type="button"
                                            className="btn btn--secondary"
                                            onClick={() => startCheckout('pro')}
                                            disabled={checkoutPlan !== null}
                                        >
                                            {checkoutPlan === 'pro' ? 'Stripe wird geöffnet...' : 'Pro starten'}
                                        </button>
                                    </article>
                                    <article>
                                        <strong>Agent</strong>
                                        <span>499 EUR/Monat</span>
                                        <p>Höhere API-Limits, Volltextsuche, Agent API, A2A/MCP und Priorisierung.</p>
                                        <button
                                            type="button"
                                            className="btn btn--primary"
                                            onClick={() => startCheckout('agent')}
                                            disabled={checkoutPlan !== null}
                                        >
                                            {checkoutPlan === 'agent' ? 'Stripe wird geöffnet...' : 'Super Agent starten'}
                                        </button>
                                    </article>
                                    <article>
                                        <strong>Verfahren</strong>
                                        <span>1.499 EUR einmalig</span>
                                        <p>Konkrete Ausschreibung prüfen, Anforderungen strukturieren, Angebotsfahrplan bauen.</p>
                                        <button
                                            type="button"
                                            className="btn btn--amber"
                                            onClick={() => startCheckout('procedure')}
                                            disabled={checkoutPlan !== null}
                                        >
                                            {checkoutPlan === 'procedure' ? 'Stripe wird geöffnet...' : 'Verfahren-Check buchen'}
                                        </button>
                                    </article>
                                </div>
                                {checkoutError && (
                                    <p className="form-status form-status--error">{checkoutError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {selectedTender && (
                <div className="source-modal" role="dialog" aria-modal="true" aria-labelledby="source-modal-title">
                    <button
                        type="button"
                        className="source-modal__backdrop"
                        aria-label="Dialog schließen"
                        onClick={() => setSelectedTender(null)}
                    />
                    <div className="source-modal__panel">
                        <button
                            type="button"
                            className="source-modal__close"
                            aria-label="Dialog schließen"
                            onClick={() => setSelectedTender(null)}
                        >
                            ×
                        </button>
                        <span className="profile-lead__eyebrow">Jetzt starten</span>
                        <h3 id="source-modal-title">{selectedTender.title}</h3>
                        <dl className="source-modal__facts">
                            <div>
                                <dt>Auftraggeber</dt>
                                <dd>{selectedTender.buyer_name || 'Nicht angegeben'}</dd>
                            </div>
                            <div>
                                <dt>Frist</dt>
                                <dd>{formatDate(selectedTender.deadline_at)}</dd>
                            </div>
                            <div>
                                <dt>Wert</dt>
                                <dd>{formatCurrency(selectedTender.estimated_value_eur) || 'Nicht genannt'}</dd>
                            </div>
                            <div>
                                <dt>Score</dt>
                                <dd>{selectedTender.relevance_score || selectedTender.match_score || 'n/a'}</dd>
                            </div>
                        </dl>
                        <p>
                            Öffnen Sie die Quelle kostenlos. Wenn Sie daraus systematisch Angebote machen wollen,
                            legt der Ausschreibungsagent ein strukturiertes Suchprofil mit Fit-Gründen und E-Mail-Digest an.
                        </p>
                        <div className="source-modal__actions">
                            <a
                                className="btn btn--primary"
                                href="#profil"
                                onClick={() => setSelectedTender(null)}
                            >
                                Agentenprofil vorbereiten
                            </a>
                            <a
                                className="btn btn--secondary"
                                href={selectedTender.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setSelectedTender(null)}
                            >
                                Quelle kostenlos öffnen
                            </a>
                        </div>
                        <div className="source-modal__plans">
                            <span>Pro: Alerts und strukturierte Suchprofile</span>
                            <span>Agent: höhere Limits sowie A2A/MCP</span>
                            <span>Der verbindliche Preis wird serverseitig im Stripe-Checkout angezeigt.</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== COMPARISON TABLE ===== */}
            <section className="section section--alt" id="vergleich">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Marktüberblick 2026
                    </span>
                    <h2 className="section__title">
                        Alle <span className="gradient-text--amber">Ausschreibungstools</span> im Vergleich
                    </h2>
                    <p className="section__subtitle">
                        Der unabhängige Überblick über die wichtigsten Plattformen und Tools zur automatischen
                        Ausschreibungssuche in Deutschland und Europa. Finden Sie die Lösung, die zu Ihrem
                        Unternehmen passt.
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
                                    <tr key={i}>
                                        <td className="tool-name">
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer">{tool.name}</a>
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
                        Stand: März 2026. Alle Angaben ohne Gewähr. Preise zzgl. MwSt. wo nicht anders angegeben.
                        <br />Haben wir ein Tool vergessen? <a href="#kontakt">Schreiben Sie uns</a> – wir ergänzen es gerne.
                    </p>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
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
                                <div className={`glass-card__icon${f.color ? ' glass-card__icon' + f.color : ''}`}>{f.icon}</div>
                                <h3 className="glass-card__title">{f.title}</h3>
                                <p className="glass-card__text">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BRANCHEN ===== */}
            <section className="section section--alt" id="branchen">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Branchen
                    </span>
                    <h2 className="section__title">
                        Aktive <span className="gradient-text">Pilot-Verticals</span>
                    </h2>
                    <p className="section__subtitle">
                        Der Index ist konfigurierbar, aber noch nicht universell. Produktiv gepflegt werden
                        derzeit Fenster/Fassade sowie Marketing/Digital.
                    </p>

                    <div className="branchen-grid">
                        {BRANCHEN.map((b, i) => (
                            <div className="glass-card branche-card" key={i}>
                                <span className="branche-card__emoji">{b.emoji}</span>
                                <h3 className="glass-card__title">{b.name}</h3>
                                <p className="glass-card__text">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SEO CONTENT BLOCK ===== */}
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
                            Öffentliche Beschaffung in Deutschland: Ein €500-Milliarden-Markt
                        </h3>
                        <p>
                            Die öffentliche Beschaffung in Deutschland umfasst ein jährliches Volumen von rund 500 Milliarden Euro – das entspricht etwa 15 Prozent des Bruttoinlandsprodukts. Damit ist Deutschland einer der größten öffentlichen Beschaffungsmärkte in Europa. Dieser Markt ist hochgradig dezentralisiert: Rund 58 Prozent aller Vergaben erfolgen auf kommunaler Ebene, 30 Prozent auf Länderebene und nur 12 Prozent auf Bundesebene. Das bedeutet: Die meisten Aufträge werden von Städten, Gemeinden und Landkreisen vergeben – oft ohne dass überregionale Unternehmen davon erfahren.
                        </p>
                        <p>
                            Genau hier liegt die Chance für Unternehmen, die Ausschreibungssuche systematisch zu unterstützen: Unser Pilot bündelt aktuell TED, service.bund.de sowie Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, gleicht Bekanntmachungen mit einem strukturierten Firmenprofil ab und verlinkt immer auf die Originalquelle. DTVP, eVergabe, Bayern und NRW sind dokumentierte Ausbaupunkte.
                        </p>

                        <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                            Vergaberecht verstehen: Schwellenwerte und Verfahrensarten
                        </h3>
                        <p>
                            Das deutsche Vergaberecht unterscheidet zwischen nationalen und EU-weiten Verfahren. Die jeweils geltenden EU-Schwellenwerte ändern sich regelmäßig; prüfen Sie deshalb für ein konkretes Verfahren die aktuellen amtlichen Werte und Vergabeunterlagen. Oberhalb der einschlägigen Schwellen werden Aufträge EU-weit bekannt gemacht, darunter gelten die jeweiligen nationalen Regelungen.
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
                            Tipps für eine erfolgreiche Angebotsabgabe
                        </h3>
                        <p>
                            Die beste Ausschreibung nützt nichts, wenn das Angebot nicht überzeugt. Hier unsere fünf wichtigsten Tipps für eine erfolgreiche Angebotsabgabe bei öffentlichen Vergaben:
                        </p>
                        <p>
                            <strong>1. Eignungskriterien sorgfältig prüfen:</strong> Prüfen Sie vor der Angebotserstellung, ob Ihr Unternehmen alle formalen Anforderungen erfüllt – Umsatzgröße, Referenzen, Zertifizierungen, Versicherungsnachweise.
                        </p>
                        <p>
                            <strong>2. Leistungsverzeichnis vollständig ausfüllen:</strong> Jede Position muss bepreist werden. Fehlende Positionen führen zum Ausschluss. GAEB-Tools helfen, automatisch alle Positionen zu erfassen und strukturiert zu kalkulieren.
                        </p>
                        <p>
                            <strong>3. Fristen einhalten:</strong> Verspätete Angebote werden ausnahmslos ausgeschlossen. Planen Sie Puffer ein und nutzen Sie den Fristenkalender Ihres Ausschreibungsagenten.
                        </p>
                        <p>
                            <strong>4. Nebenangebote nutzen:</strong> Wenn die Vergabestelle Nebenangebote zulässt, nutzen Sie die Chance, innovative oder kostengünstigere Alternativen anzubieten. Das kann einen Wettbewerbsvorteil verschaffen.
                        </p>
                        <p>
                            <strong>5. Nachfragen stellen:</strong> Bei Unklarheiten im Leistungsverzeichnis nutzen Sie die Bieterfragen. Diese sind über das jeweilige Vergabeportal möglich und werden allen Bietern anonymisiert zur Verfügung gestellt.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
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

            {/* ===== NEWSLETTER ===== */}
            <section className="section newsletter-section" id="newsletter">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Newsletter
                    </span>
                    <h2 className="section__title" style={{ textAlign: 'center' }}>
                        Wöchentlicher <span className="gradient-text--amber">Ausschreibungs-Report</span>
                    </h2>
                    <p className="section__subtitle" style={{ textAlign: 'center', margin: '0 auto 0.5rem' }}>
                        Erhalten Sie jeden Montag die wichtigsten neuen Ausschreibungen, Tool-Updates
                        und Vergabe-Tipps direkt in Ihr Postfach. Kostenlos und jederzeit abbestellbar.
                    </p>

                    <form className="newsletter-form" onSubmit={handleNewsletter}>
                        <input
                            type="email"
                            placeholder="Ihre geschäftliche E-Mail-Adresse"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn--amber">Anmelden</button>
                    </form>
                    {newsletterStatus === 'success' && (
                        <p className="form-status form-status--success" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
                            ✓ Erfolgreich angemeldet! Prüfen Sie Ihr Postfach.
                        </p>
                    )}
                    {newsletterStatus === 'error' && (
                        <p className="form-status form-status--error" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
                            Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
                        </p>
                    )}
                </div>
            </section>

            {/* ===== CONTACT ===== */}
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
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-name">Name *</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Max Mustermann"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-email">E-Mail *</label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="max@firma.de"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-company">Unternehmen</label>
                                    <input
                                        id="contact-company"
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Mustermann GmbH"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-branche">Branche</label>
                                    <select
                                        id="contact-branche"
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
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Wie können wir Ihnen helfen? Beschreiben Sie Ihre aktuelle Situation bei der Ausschreibungssuche..."
                                    required
                                />
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
                                <div className="form-status form-status--error">
                                    Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie an hi@ausschreibungsagenten.de.
                                </div>
                            )}
                        </form>

                        <div className="contact-info">
                            <div className="glass-card contact-info__item">
                                <h4>📧 E-Mail</h4>
                                <p><a href="mailto:hi@ausschreibungsagenten.de">hi@ausschreibungsagenten.de</a></p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>📍 Standort</h4>
                                <p>track by track GmbH<br />Schliemannstr. 23, 10437 Berlin</p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>⚡ Antwortzeit</h4>
                                <p>In der Regel antworten wir innerhalb von 24 Stunden an Werktagen.</p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>🎯 Für wen?</h4>
                                <p>Handwerk, Bau, IT, Beratung, Facility Management und alle Unternehmen, die öffentliche Aufträge gewinnen möchten.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
