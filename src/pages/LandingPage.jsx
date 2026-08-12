import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import VideoAbschnitt from '../components/VideoAbschnitt'
import { VIDEO_BESCHREIBUNG, VIDEO_TITEL, VIDEO_TRANSKRIPT } from '../data/videoTranskript'

const TOOLS = [
    { name: 'DTVP', url: 'https://www.dtvp.de', price: '€49/Mon. Professional', ai: false, portals: 'DTVP', focus: 'Offizielles Portal', gaeb: false, alerts: true, free: true },
    { name: 'aumass', url: 'https://www.aumass.de', price: 'Anbieterangabe', ai: false, portals: 'Herstellerangabe', focus: 'Breite Abdeckung', gaeb: false, alerts: true, free: true },
    { name: 'GAEB.ai', url: 'https://gaeb.ai', price: 'Anbieterangabe', ai: true, portals: 'Herstellerangabe', focus: 'Elektro/Bau', gaeb: true, alerts: true, free: true },
    { name: 'Vergabe24', url: 'https://www.vergabe24.de', price: 'Anbieterangabe', ai: false, portals: 'Herstellerangabe', focus: 'Regional', gaeb: false, alerts: true, free: false },
    { name: 'TenderWolf', url: 'https://www.tenderwolf.com', price: 'Anbieterangabe', ai: true, portals: 'EU-weit', focus: 'Europa', gaeb: false, alerts: true, free: true },
    { name: 'Jorpex', url: 'https://www.jorpex.com', price: 'Anbieterangabe', ai: true, portals: 'Global', focus: 'International', gaeb: false, alerts: true, free: false },
    { name: 'Bidfix', url: 'https://bidfix.ai', price: 'k.A.', ai: true, portals: 'DACH', focus: 'DACH-Markt', gaeb: false, alerts: true, free: false },
    { name: 'Hermix', url: 'https://hermix.com', price: 'Enterprise', ai: true, portals: 'EU', focus: 'Öffentl. Sektor', gaeb: false, alerts: true, free: true },
]

const FEATURES = [
    { icon: '🔍', title: '17 Live-Quellen', text: 'TED, service.bund.de, der Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale Bayern, NRW, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen Quellen Find a Tender und Contracts Finder werden regelmäßig abgefragt. Deutsche eVergabe und evergabe.de befinden sich im Ausbau.', color: '' },
    { icon: '🎯', title: 'Erklärbares Matching', text: 'CPV-Codes, Leistungsbegriffe, Ausschlusswörter, Leistungsort, Auftragswert und Frist ergeben einen transparenten Firmen-Fit mit einzelnen Score-Gründen.', color: '--violet' },
    { icon: '✉️', title: 'E-Mail-Digest', text: 'Der E-Mail-Digest wird im begleiteten Pilot gemeinsam getestet und anschließend je Profil täglich oder wöchentlich freigeschaltet. WhatsApp und Push sind nicht produktiv.', color: '--amber' },
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
    { q: 'Was sind öffentliche Ausschreibungen und warum sind sie wichtig?', a: 'Öffentliche Ausschreibungen sind Vergabeverfahren, mit denen Behörden, Kommunen und öffentliche Einrichtungen Aufträge an Unternehmen vergeben. Die OECD beziffert die öffentliche Beschaffung in Deutschland in einer häufig zitierten Schätzung auf rund 15 Prozent des Bruttoinlandsprodukts. Die amtliche Vergabestatistik erfasst gemeldete Zuschläge und ist nicht mit einer vollständigen Zahl aller veröffentlichten Verfahren gleichzusetzen.' },
    { q: 'Welche Vergabeportale gibt es in Deutschland?', a: 'Zu den wichtigen Quellen gehören DTVP, eVergabe, service.bund.de, die Landesportale und für EU-Verfahren TED. Unser eigener Pilot indexiert aktuell 17 Quellen: TED, service.bund.de, den Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale Bayern, NRW, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen Quellen Find a Tender und Contracts Finder. Deutsche eVergabe und evergabe.de sind im Ausbau.' },
    { q: 'Was macht der Ausschreibungsagent konkret?', a: 'Der aktuelle Agent ordnet Bekanntmachungen über CPV-Codes und Regeln Branchen zu. Anschließend vergleicht er Firmenprofil, Keywords, Ausschlüsse, Leistungsort, Auftragswert und Frist. Jeder Fit-Score wird mit nachvollziehbaren Einzelgründen angezeigt; semantisches KI-Matching wird nicht als bereits produktiv behauptet.' },
    { q: 'Wie viel kostet ein Ausschreibungsagent?', a: 'Preise hängen von Quellenabdeckung, Nutzerzahl, Suchprofilen, Exporten und Integrationen ab. Unser geplanter Pro-Tarif kostet 149 EUR pro Monat, der Agent-Tarif 499 EUR pro Monat und die Begleitung eines einzelnen Verfahrens 1.499 EUR. Der Online-Checkout ist noch nicht freigeschaltet; Pilot und Vertrag werden persönlich abgestimmt.' },
    { q: 'Ab welchem Auftragsvolumen lohnt sich die Suche nach öffentlichen Ausschreibungen?', a: 'Eine allgemeingültige Untergrenze gibt es nicht. Entscheidend sind Auftragswert, Angebotsaufwand und Gewinnwahrscheinlichkeit. Für 2026/2027 gelten je nach Auftraggeber unterschiedliche EU-Schwellenwerte; unter anderem 140.000 EUR für Liefer- und Dienstleistungen zentraler Regierungsbehörden, 216.000 EUR für andere öffentliche Auftraggeber und 5.404.000 EUR für Bauaufträge. Maßgeblich sind immer die aktuellen amtlichen Werte und Vergabeunterlagen.' },
    { q: 'Welche GAEB-Funktion ist verfügbar?', a: 'Der Pilot liest GAEB DA XML X83 und X84 nur lesend ein und zeigt Metadaten, Bereiche, Positionen, Texte, Mengen, Einheiten und vorhandene Preise. CSV- und XLSX-Export sind möglich. Automatische Kalkulation, Preisempfehlung und Angebotsabgabe gehören nicht zum aktuellen Umfang.' },
    { q: 'Wie viele Ausschreibungen werden täglich veröffentlicht?', a: 'Eine vollständige tagesaktuelle Gesamtzahl für alle deutschen Portale existiert nicht. Bekanntmachungen sind auf EU-, Bundes-, Landes- und weiteren Vergabeplattformen verteilt. Genau deshalb weist unser Quellenstatus transparent aus, welche Portale tatsächlich abgefragt werden und wann der letzte erfolgreiche Abruf erfolgte.' },
    { q: 'Welche Branchen profitieren am meisten von Ausschreibungsagenten?', a: 'Besonders stark profitieren das Baugewerbe, Handwerksbetriebe, IT-Dienstleister, Ingenieurbüros und Facility-Management-Unternehmen. Aber auch Catering, Reinigung, Beratung, Schulung und viele weitere Branchen finden regelmäßig passende öffentliche Aufträge. Grundsätzlich gilt: Jedes Unternehmen, das Dienstleistungen oder Produkte an den öffentlichen Sektor verkaufen kann, sollte Ausschreibungsagenten nutzen.' },
    { q: 'Kann ich auch als kleines Unternehmen an öffentlichen Ausschreibungen teilnehmen?', a: 'Ja, unbedingt! Das Vergaberecht fördert sogar explizit die Beteiligung kleiner und mittlerer Unternehmen (KMU). Viele Aufträge werden in Lose aufgeteilt, um auch kleineren Betrieben die Teilnahme zu ermöglichen. Kommunale Ausschreibungen sind oft besonders KMU-freundlich. Ein KI-Agent hilft Ihnen, genau die Ausschreibungen zu finden, die zu Ihrer Unternehmensgröße und Ihren Kapazitäten passen.' },
    { q: 'Wie unterscheidet sich ausschreibungsagenten.de von anderen Plattformen?', a: 'Neben dem Marktüberblick erproben wir einen eigenen, transparenten Ausschreibungsagenten. Im aktuellen Pilot sind 17 öffentliche Quellen, erklärbares Profil-Matching, strukturierte Go/No-Go-Karten, GAEB X83/X84 und Standardexporte verfügbar. E-Mail-Digests werden im begleiteten Pilot getestet; weitere Portale und Hersteller-Connectoren kennzeichnen wir als Ausbau.' },
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
    const [formData, setFormData] = useState({ name: '', email: '', company: '', branche: '', message: '', website: '' })
    const [formStatus, setFormStatus] = useState(null)
    const [sending, setSending] = useState(false)
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
        website: '',
    })
    const [profileStatus, setProfileStatus] = useState(null)
    const [profileSending, setProfileSending] = useState(false)
    const [profileResult, setProfileResult] = useState(null)
    const [selectedTender, setSelectedTender] = useState(null)

    const indexedTotal = sourceStatus.reduce((sum, source) => sum + (Number(source.stored) || 0), 0)
    const latestSuccessAt = sourceStatus.reduce(
        (latest, source) => (source.last_success_at && (!latest || source.last_success_at > latest) ? source.last_success_at : latest),
        null,
    )

    // Die Inhaltsseiten verlinken das Kontaktformular mit "?thema=...".
    // Damit steht im Nachrichtenfeld schon, worum es geht, und die Anfrage
    // laesst sich zuordnen. Bewusst nur vorbelegen, wenn das Feld leer ist -
    // sonst wuerde eine bereits getippte Nachricht ueberschrieben.
    useEffect(() => {
        const thema = new URLSearchParams(window.location.search).get('thema')
        if (!thema) return
        setFormData((bisher) =>
            bisher.message ? bisher : { ...bisher, message: `Ich interessiere mich für: ${thema}\n\n` },
        )
    }, [])

    // Der Browser springt beim Laden zum Anker, danach laedt die
    // Trefferliste nach und schiebt das Formular weiter nach unten - man
    // landet ueber tausend Pixel darueber. Deshalb nach dem Nachladen
    // einmal nachfassen, aber nur solange der Anker noch gilt und niemand
    // selbst gescrollt hat.
    useEffect(() => {
        if (tendersLoading || window.location.hash !== '#kontakt') return
        const ziel = document.getElementById('kontakt')
        if (!ziel) return
        const abstand = Math.abs(ziel.getBoundingClientRect().top)
        if (abstand > 100) ziel.scrollIntoView()
    }, [tendersLoading])

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
                setFormData({ name: '', email: '', company: '', branche: '', message: '', website: '' })
            } else {
                setFormStatus('error')
            }
        } catch {
            setFormStatus('error')
        }
        setSending(false)
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
                    website: '',
                })
            } else {
                setProfileStatus('error')
            }
        } catch {
            setProfileStatus('error')
        }
        setProfileSending(false)
    }

    return (
        <>
            <Seo path="/" faq={FAQS.map((eintrag) => ({ frage: eintrag.q, antwort: eintrag.a }))} />

            {/* ===== HERO ===== */}
            <section className="hero" id="start">
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 2s ease-in-out infinite' }}></span>
                            17 öffentliche Quellen live – von TED bis zu den Landesportalen
                        </div>

                        <h1 className="hero__title">
                            Nie wieder<br />
                            <span className="gradient-text">Ausschreibungen verpassen</span>
                        </h1>

                        <p className="hero__description">
                            Unser Pilot durchsucht 17 öffentliche Quellen – von TED über service.bund.de und den
                            Datenservice Öffentlicher Einkauf bis zu den Landes- und Regionalportalen – und bewertet
                            Ausschreibungen nachvollziehbar nach Ihrem Firmenprofil. Weitere Portale werden schrittweise angebunden.
                        </p>

                        <div className="hero__actions">
                            <a href="#suche" className="btn btn--primary btn--lg">Live-Suche testen →</a>
                            <a href="#kontakt" className="btn btn--outline btn--lg">Beratung anfragen</a>
                        </div>

                        <div className="hero__stats">
                            <div className="hero__stat">
                                <span className="hero__stat-value">
                                    {indexedTotal > 0 ? `${new Intl.NumberFormat('de-DE').format(indexedTotal)}+` : '5.000+'}
                                </span>
                                <span className="hero__stat-label">
                                    {latestSuccessAt
                                        ? `Indexierte Ausschreibungen · Datenstand ${formatDate(latestSuccessAt)}`
                                        : 'Indexierte Ausschreibungen'}
                                </span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#8b5cf6' }}>0–100</span>
                                <span className="hero__stat-label">Erklärbarer Firmen-Fit</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#f59e0b' }}>
                                    {sourceStatus.length > 0 ? sourceStatus.filter((s) => s.implementation_status === 'live').length : 17}
                                </span>
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
                            <div className="problem-card__number">Viele</div>
                            <h3 className="glass-card__title">Zeitverlust</h3>
                            <p className="glass-card__text">
                                Bekanntmachungen sind über EU-, Bundes-, Landes- und weitere Vergabeportale verteilt. Wer mehrere Quellen manuell kontrolliert, bindet Zeit, die für Eignungsprüfung und Angebotserstellung fehlt.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">Zu viele</div>
                            <h3 className="glass-card__title">Informationsflut</h3>
                            <p className="glass-card__text">
                                Breite Stichwörter liefern auch unpassende Gewerke, Regionen und Auftragsgrößen. Ein Firmenprofil macht sichtbar, warum ein Treffer passt oder ausgeschlossen wird.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">Kurz</div>
                            <h3 className="glass-card__title">Verpasste Fristen</h3>
                            <p className="glass-card__text">
                                Angebotsfristen hängen von Verfahrensart und Bekanntmachung ab. Je später ein passendes Verfahren erkannt wird, desto weniger Zeit bleibt für Unterlagen, Partner und Kalkulation.
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
                                Der Agent fragt alle 17 Live-Quellen regelmäßig ab – TED, service.bund.de, den Datenservice
                                Öffentlicher Einkauf, DTVP, RIB, die Landes- und Regionalportale sowie die britischen Quellen
                                Find a Tender und Contracts Finder. Jede neue Ausschreibung wird
                                über CPV, Regeln, Keywords, Region, Wert und Frist mit Ihrem Profil abgeglichen.
                                Deutsche eVergabe und evergabe.de sind als nächste Quellen geplant.
                            </p>
                        </div>
                        <div className="glass-card step-card">
                            <div className="step-card__number">3</div>
                            <h3 className="glass-card__title">Angebot abgeben</h3>
                            <p className="glass-card__text">
                            Im begleiteten Pilot testen wir den E-Mail-Digest gemeinsam; danach kann er je Profil täglich oder wöchentlich freigeschaltet werden.
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
                            Alle 17 angebundenen Quellen sind live: TED, service.bund.de, der Datenservice Öffentlicher Einkauf, DTVP, RIB,
                            die Landesportale Bayern, Nordrhein-Westfalen, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen
                            und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen
                            Quellen Find a Tender und Contracts Finder. Deutsche eVergabe und evergabe.de sind als nächste Quellen geplant.
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
                                <input className="form-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} />
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
                                        Anfrage angekommen. Ein Zugang wird nach Prüfung ausschließlich per Magic Link freigegeben.
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
                                        <span className="profile-lead__eyebrow">Pilotanfrage eingegangen</span>
                                        <h3>Der nächste Schritt ist ein geschützter Magic-Link-Zugang</h3>
                                        <p>
                                            Wir prüfen das Suchprofil für {profileResult.company} und bereiten den passenden Mandanten vor.
                                            Es wird kein öffentlicher Pilot-Link erzeugt. Nach der Abstimmung erhält die freigegebene
                                            E-Mail-Adresse einen einmalig verwendbaren Anmeldelink.
                                        </p>
                                    </div>
                                </div>

                                <div className="pricing-strip">
                                    <article>
                                        <strong>Pro</strong>
                                        <span>149 EUR/Monat</span>
                                        <p>Suchprofil, Alerts, Fulltext-Suche und wöchentliche Trefferliste.</p>
                                        <small>Checkout folgt nach Pilotabstimmung.</small>
                                    </article>
                                    <article>
                                        <strong>Agent</strong>
                                        <span>499 EUR/Monat</span>
                                        <p>Höhere API-Limits, Volltextsuche, Agent API, A2A/MCP und Priorisierung.</p>
                                        <small>Checkout folgt nach Pilotabstimmung.</small>
                                    </article>
                                    <article>
                                        <strong>Verfahren</strong>
                                        <span>1.499 EUR einmalig</span>
                                        <p>Konkrete Ausschreibung prüfen, Anforderungen strukturieren, Angebotsfahrplan bauen.</p>
                                        <small>Checkout folgt nach Pilotabstimmung.</small>
                                    </article>
                                </div>
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
                            <span>Die Preise sind sichtbar; der Checkout wird erst nach erfolgreichem Pilot freigeschaltet.</span>
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
                                    <tr key={i}>
                                        <td className="tool-name">
                                            <a href={tool.url} target="_blank" rel="nofollow noopener noreferrer">{tool.name}</a>
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

            {/* ===== PREISE ===== */}
            <section className="section" id="preise">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Preise
                    </span>
                    <h2 className="section__title">
                        Transparente <span className="gradient-text">Tarife</span> ohne Kleingedrucktes
                    </h2>
                    <p className="section__subtitle">
                        Die Preise gelten als Orientierung. Der Online-Checkout wird erst nach erfolgreicher
                        Pilotphase freigeschaltet; Pilot und Vertrag werden persönlich abgestimmt.
                    </p>

                    <div className="pricing-strip">
                        <article>
                            <strong>Pro</strong>
                            <span>149 EUR/Monat</span>
                            <p>Suchprofil, Alerts, Volltextsuche und wöchentliche Trefferliste.</p>
                            <a href="#profil" className="btn btn--outline">Pilotzugang anfragen</a>
                        </article>
                        <article>
                            <strong>Agent</strong>
                            <span>499 EUR/Monat</span>
                            <p>Höhere API-Limits, Volltextsuche, Agent API, A2A/MCP und Priorisierung.</p>
                            <a href="#profil" className="btn btn--outline">Pilotzugang anfragen</a>
                        </article>
                        <article>
                            <strong>Verfahren</strong>
                            <span>1.499 EUR einmalig</span>
                            <p>Konkrete Ausschreibung prüfen, Anforderungen strukturieren, Angebotsfahrplan bauen.</p>
                            <a href="#kontakt" className="btn btn--outline">Beratung anfragen</a>
                        </article>
                    </div>
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

            {/* ===== ERKLAERVIDEO ===== */}
            <VideoAbschnitt
                titel={VIDEO_TITEL}
                beschreibung={VIDEO_BESCHREIBUNG}
                transkript={VIDEO_TRANSKRIPT}
                quelle={{
                    art: 'datei',
                    url: '/video/ausschreibungsagenten-erklaervideo.mp4',
                    poster: '/video/ausschreibungsagenten-erklaervideo-poster.jpg',
                    // Gemessene Laufzeit der Datei: 549,94 Sekunden.
                    dauer: 'PT9M10S',
                    // Veroeffentlichung auf dem eigenen Kanal. Bewusst ohne
                    // Uhrzeit - sie ist nicht bekannt und wird nicht geraten.
                    hochgeladenAm: '2026-08-12',
                    // Dieselbe Aufnahme liegt auf dem eigenen Kanal.
                    auchAuf: ['https://www.youtube.com/watch?v=GXD2qj7njVk'],
                }}
            />

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
                            Öffentliche Beschaffung in Deutschland: großer, dezentraler Markt
                        </h3>
                        <p>
                            Eine häufig zitierte <a href="https://www.oecd.org/de/publications/offentliche-vergabe-in-deutschland_48df1474-de.html" target="_blank" rel="noopener noreferrer">OECD-Schätzung</a> beziffert die öffentliche Beschaffung in Deutschland auf rund 15 Prozent des Bruttoinlandsprodukts. Die <a href="https://www.destatis.de/DE/Themen/Staat/Oeffentliche-Finanzen/Vergabestatistik/_inhalt.html" target="_blank" rel="noopener noreferrer">amtliche Vergabestatistik von Destatis</a> weist für 2024 199.334 gemeldete Zuschläge mit einem Volumen von 135,2 Milliarden Euro aus. Diese Statistik hat Erfassungs- und Meldegrenzen und ist nicht mit der Zahl aller veröffentlichten Bekanntmachungen gleichzusetzen.
                        </p>
                        <p>
                            Genau hier liegt die Chance für Unternehmen, die Ausschreibungssuche systematisch zu unterstützen: Unser Pilot bündelt aktuell 17 Live-Quellen – von TED und service.bund.de über den Datenservice Öffentlicher Einkauf, DTVP und RIB bis zu den Landes- und Regionalportalen –, gleicht Bekanntmachungen mit einem strukturierten Firmenprofil ab und verlinkt immer auf die Originalquelle. Deutsche eVergabe und evergabe.de sind dokumentierte Ausbaupunkte.
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
                            <input className="form-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
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
                                <h4>📞 Telefon</h4>
                                <p><a href="tel:+4930403665430">030 – 403 665 430</a></p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>📍 Standort</h4>
                                <p>Yawusa UG (haftungsbeschränkt)<br />Schliemannstraße 23, 10437 Berlin</p>
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
