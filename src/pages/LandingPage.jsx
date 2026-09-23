import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Icon from '../components/Icon'
import Entscheidungskarte from '../components/Entscheidungskarte'
import VideoAbschnitt from '../components/VideoAbschnitt'
import { VIDEO_BESCHREIBUNG, VIDEO_TITEL, VIDEO_TRANSKRIPT } from '../data/videoTranskript'
import { stelleWerkzeugeBereit, warteAuf, werkzeugAntwort, werkzeugFehler } from '../lib/webmcp'
import { eintragAnlegen, MERKLISTE_GRENZE, merklisteLesen, merklisteSchreiben } from '../lib/merkliste'
import { artAusCpv, EU_SCHWELLENWERTE, fitGruende, fristText, GEWERKE, gruendeBilanz, quellenUrl, schwellenwertPruefung } from '../lib/vergabe'
import { neuerSuchauftrag, SUCHAUFTRAEGE_LIMIT, suchauftragLesen, suchauftragSchreiben, suchauftragVergleichen, suchkriterien, suchparameter } from '../lib/suchauftraege'
import { spracheErmitteln, STANDARDSPRACHE } from '../lib/sprache'
import { tafelTexte } from '../lib/tafelTexte'

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
    { icon: 'search', title: '17 Live-Quellen', text: 'TED, service.bund.de, der Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale Bayern, NRW, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen Quellen Find a Tender und Contracts Finder werden regelmäßig abgefragt. Deutsche eVergabe und evergabe.de befinden sich im Ausbau.', color: '' },
    { icon: 'target', title: 'Erklärbares Matching', text: 'CPV-Codes, Leistungsbegriffe, Ausschlusswörter, Leistungsort, Auftragswert und Frist ergeben einen transparenten Firmen-Fit mit einzelnen Score-Gründen.', color: '--violet' },
    { icon: 'mail', title: 'E-Mail-Digest', text: 'Der E-Mail-Digest wird im begleiteten Pilot gemeinsam getestet und anschließend je Profil täglich oder wöchentlich freigeschaltet. WhatsApp und Push sind nicht produktiv.', color: '--amber' },
    { icon: 'doc', title: 'GAEB X83/X84 lesen', text: 'GAEB-DA-XML-Dateien der Austauschphasen X83 und X84 werden nur lesend strukturiert: Bereiche, Positionen, Mengen, Einheiten und optionale Preise. Keine Kalkulationsautomatik.', color: '--green' },
    { icon: 'dashboard', title: 'Pilot-Dashboard', text: 'Aktive Treffer, Fit-Gründe, Fristen, Auftragswerte, Originalquelle, Status und interne Notizen in einer geschützten Profilansicht.', color: '' },
    { icon: 'export', title: 'Standardisierter ERP-Export', text: 'Tender lassen sich als versioniertes JSON, CSV oder XLSX exportieren. Ein signierter Webhook ist konfigurierbar; konkrete ERP-Connectoren folgen erst nach Herstellerklärung.', color: '--violet' },
]

const BRANCHEN = [
    { emoji: 'crane', name: 'Fenster & Fassade', desc: 'Im Pilot aktiv: Fenster, Türen, Fassaden, Verglasung, Metallbau, Sonnenschutz und ausgewählte Brandschutz-Gewerke.' },
    { emoji: 'target', name: 'Architektur & Ingenieurbüros', desc: 'Neu konfiguriert: Objektplanung, Tragwerksplanung, TGA-Planung, Bauleitung, Vermessung und Bauleitplanung (CPV 71) — nach unserer TED-Auswertung die zweitgrößte Kategorie deutscher EU-Ausschreibungen.' },
    { emoji: 'megaphone', name: 'Marketing & Digital', desc: 'Weiterhin aktiv: Marketing, Werbung, PR, Webdesign, Grafik und ausgewählte digitale Dienstleistungen.' },
    { emoji: 'compass', name: 'Weitere Branchen', desc: 'Weitere Branchen werden nach CPV-Katalog und Pilotbedarf konfiguriert. Eine vollständige Abdeckung aller Gewerke behaupten wir derzeit nicht.' },
]

const FAQS = [
    { q: 'Was sind öffentliche Ausschreibungen und warum sind sie wichtig?', a: 'Öffentliche Ausschreibungen sind Vergabeverfahren, mit denen Behörden, Kommunen und öffentliche Einrichtungen Aufträge an Unternehmen vergeben. Die OECD beziffert die öffentliche Beschaffung in Deutschland in einer häufig zitierten Schätzung auf rund 15 Prozent des Bruttoinlandsprodukts. Die amtliche Vergabestatistik erfasst gemeldete Zuschläge und ist nicht mit einer vollständigen Zahl aller veröffentlichten Verfahren gleichzusetzen.' },
    { q: 'Welche Vergabeportale gibt es in Deutschland?', a: 'Zu den wichtigen Quellen gehören DTVP, eVergabe, service.bund.de, die Landesportale und für EU-Verfahren TED. Unser eigener Pilot indexiert aktuell 17 Quellen: TED, service.bund.de, den Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale Bayern, NRW, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen Quellen Find a Tender und Contracts Finder. Deutsche eVergabe und evergabe.de sind im Ausbau.' },
    { q: 'Was macht der Ausschreibungsagent konkret?', a: 'Der aktuelle Agent ordnet Bekanntmachungen über CPV-Codes und Regeln Branchen zu. Anschließend vergleicht er Firmenprofil, Keywords, Ausschlüsse, Leistungsort, Auftragswert und Frist. Jeder Fit-Score wird mit nachvollziehbaren Einzelgründen angezeigt; semantisches KI-Matching wird nicht als bereits produktiv behauptet.' },
    { q: 'Wie viel kostet ein Ausschreibungsagent?', a: 'Aktuell suchen wir weitere Partner für eine kostenfreie Pilotphase — im Pilot fallen keine Kosten an. Als Orientierung für den späteren Regelbetrieb: Der geplante Pro-Tarif liegt bei 149 EUR pro Monat, der Agent-Tarif bei 499 EUR pro Monat und die Begleitung eines einzelnen Verfahrens bei 1.499 EUR. Der Online-Checkout ist noch nicht freigeschaltet; Pilot und Vertrag werden persönlich abgestimmt.' },
    { q: 'Ab welchem Auftragsvolumen lohnt sich die Suche nach öffentlichen Ausschreibungen?', a: 'Eine allgemeingültige Untergrenze gibt es nicht. Entscheidend sind Auftragswert, Angebotsaufwand und Gewinnwahrscheinlichkeit. Für 2026/2027 gelten je nach Auftraggeber unterschiedliche EU-Schwellenwerte; unter anderem 140.000 EUR für Liefer- und Dienstleistungen zentraler Regierungsbehörden, 216.000 EUR für andere öffentliche Auftraggeber und 5.404.000 EUR für Bauaufträge. Maßgeblich sind immer die aktuellen amtlichen Werte und Vergabeunterlagen.' },
    { q: 'Welche GAEB-Funktion ist verfügbar?', a: 'Der Pilot liest GAEB DA XML X83 und X84 nur lesend ein und zeigt Metadaten, Bereiche, Positionen, Texte, Mengen, Einheiten und vorhandene Preise. CSV- und XLSX-Export sind möglich. Automatische Kalkulation, Preisempfehlung und Angebotsabgabe gehören nicht zum aktuellen Umfang.' },
    { q: 'Wie viele Ausschreibungen werden täglich veröffentlicht?', a: 'Eine vollständige tagesaktuelle Gesamtzahl für alle deutschen Portale existiert nicht. Bekanntmachungen sind auf EU-, Bundes-, Landes- und weiteren Vergabeplattformen verteilt. Genau deshalb weist unser Quellenstatus transparent aus, welche Portale tatsächlich abgefragt werden und wann der letzte erfolgreiche Abruf erfolgte.' },
    { q: 'Welche Branchen profitieren am meisten von Ausschreibungsagenten?', a: 'Besonders stark profitieren das Baugewerbe, Handwerksbetriebe, IT-Dienstleister, Ingenieurbüros und Facility-Management-Unternehmen. Aber auch Catering, Reinigung, Beratung, Schulung und viele weitere Branchen finden regelmäßig passende öffentliche Aufträge. Grundsätzlich gilt: Jedes Unternehmen, das Dienstleistungen oder Produkte an den öffentlichen Sektor verkaufen kann, sollte Ausschreibungsagenten nutzen.' },
    { q: 'Kann ich auch als kleines Unternehmen an öffentlichen Ausschreibungen teilnehmen?', a: 'Ja, unbedingt! Das Vergaberecht fördert sogar explizit die Beteiligung kleiner und mittlerer Unternehmen (KMU). Viele Aufträge werden in Lose aufgeteilt, um auch kleineren Betrieben die Teilnahme zu ermöglichen. Kommunale Ausschreibungen sind oft besonders KMU-freundlich. Ein KI-Agent hilft Ihnen, genau die Ausschreibungen zu finden, die zu Ihrer Unternehmensgröße und Ihren Kapazitäten passen.' },
    { q: 'Wie unterscheidet sich ausschreibungsagenten.de von anderen Plattformen?', a: 'Neben dem Marktüberblick erproben wir einen eigenen, transparenten Ausschreibungsagenten. Im aktuellen Pilot sind 17 öffentliche Quellen, erklärbares Profil-Matching, strukturierte Go/No-Go-Karten, GAEB X83/X84 und Standardexporte verfügbar. E-Mail-Digests werden im begleiteten Pilot getestet; weitere Portale und Hersteller-Connectoren kennzeichnen wir als Ausbau.' },
    { q: 'Welche Fristen gelten bei öffentlichen Ausschreibungen?', a: 'Die Angebotsfristen variieren je nach Verfahrensart. Bei offenen Verfahren oberhalb der EU-Schwellenwerte beträgt die Mindestfrist 35 Tage (mit elektronischer Bekanntmachung: 30 Tage). Unterhalb der Schwellenwerte und bei nationalen Verfahren gelten oft kürzere Fristen von 10–15 Werktagen. Ein Ausschreibungsagent mit Fristenkalender sorgt dafür, dass Sie keine Deadline verpassen.' },
    { q: 'Ist die Nutzung der Vergabeportale kostenlos?', a: 'Die Einsicht in Bekanntmachungen ist auf den meisten offiziellen Portalen kostenlos. Die Teilnahme an elektronischen Vergabeverfahren über das DTVP ist ebenfalls kostenfrei. Erweiterte Funktionen wie Suchprofile, automatische Benachrichtigungen und Export-Funktionen sind bei vielen Portalen premium-pflichtig. Drittanbieter-Tools wie aumass, TenderWolf oder GAEB.ai bieten Mehrwert-Features gegen monatliche Gebühren.' },
    { q: 'Wo werden meine Daten verarbeitet – und welche KI steckt dahinter?', a: 'Der Sitz der Yawusa UG ist Berlin, die Plattform wird in Deutschland gehostet und die eingesetzten KI-Modelle laufen bei europäischen Anbietern innerhalb der Europäischen Union (aktuell Mistral AI). Kundendaten verlassen die EU nicht. Verarbeitet wird, was für Suchprofil, Matching und Digest nötig ist; Details stehen in der Datenschutzerklärung.' },
    { q: 'Kann ich Treffer im Team bearbeiten – Merkliste, Notizen, Status?', a: 'Ja. Das Pilot-Dashboard zeigt je Treffer Auftraggeber, Leistungsort, Frist, Wert, Match-Gründe und Originalquelle und erlaubt Status und interne Notizen im Team. Für Kollegen ohne Zugang oder fürs Archiv lassen sich Treffer als JSON, CSV oder XLSX exportieren; ein signierter Webhook ist konfigurierbar.' },
]

const TENDER_PRESETS = [
    { label: 'Fassade', value: 'fassade' },
    { label: 'Fenster', value: 'fenster' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Webdesign', value: 'website' },
    { label: 'IT', value: 'software' },
    { label: 'PR', value: 'öffentlichkeitsarbeit' },
]

const formatDate = (value, sprache = 'de') => {
    if (!value || !Number.isFinite(Date.parse(value))) return sprache === 'en' ? 'No deadline stated' : 'Keine Frist genannt'
    return new Intl.DateTimeFormat(sprache === 'en' ? 'en-GB' : 'de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(new Date(value))
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
    const [tenderQuery, setTenderQuery] = useState('')
    const [tenderRegion, setTenderRegion] = useState('')
    const [tenderVertical, setTenderVertical] = useState('')
    const [exclusions, setExclusions] = useState('')
    const [minimumDays, setMinimumDays] = useState(0)
    const [tenderLand, setTenderLand] = useState('DEU')
    const [tenderMindestScore, setTenderMindestScore] = useState(0)
    const [tenderAnzahl, setTenderAnzahl] = useState(12)
    const [hasMore, setHasMore] = useState(false)
    const [moreLoading, setMoreLoading] = useState(false)
    const [moreError, setMoreError] = useState('')
    const searchVersion = useRef(0)
    const nextOffset = useRef(0)
    const [savedSearches, setSavedSearches] = useState([])
    const [checkingSearches, setCheckingSearches] = useState(false)
    const [savingSearch, setSavingSearch] = useState(false)
    const [searchRetry, setSearchRetry] = useState(0)
    const savedCheckController = useRef(null)
    const [searchNotice, setSearchNotice] = useState('')
    const [searchErrors, setSearchErrors] = useState({})
    const [watchCoverage, setWatchCoverage] = useState({})
    const dialogRef = useRef(null)
    // Der Erstaufruf soll nicht entprellt werden, jede weitere Eingabe schon.
    const ersterTenderLauf = useRef(true)
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
    // Die gemeinsame Go/No-Go-Tafel. Menschen legen Treffer per Klick
    // darauf, Agenten ueber die WebMCP-Werkzeuge - beide arbeiten auf
    // derselben Liste, und beide sehen, was die andere Seite getan hat.
    const [merkliste, setMerkliste] = useState([])
    // Die Tafel folgt der Browsersprache. Serverseitig steht kein
    // `navigator` zur Verfuegung, deshalb startet sie deutsch und wird
    // nach dem Mounten nachgezogen - ein Wechsel danach ist folgenlos,
    // weil zu dem Zeitpunkt noch nichts darauf liegt.
    const [sprache, setSprache] = useState(STANDARDSPRACHE)
    const texte = tafelTexte(sprache)

    const criteria = suchkriterien({ search: tenderQuery, region: tenderRegion, vertical: tenderVertical, country: tenderLand, exclusions, minimumDays })
    const latestSuccessAt = sourceStatus.reduce(
        (latest, source) => (source.last_success_at && (!latest || source.last_success_at > latest) ? source.last_success_at : latest),
        null,
    )

    useEffect(() => {
        if (!selectedTender || !dialogRef.current) return
        const previous = document.activeElement
        const dialog = dialogRef.current
        if (typeof dialog.showModal === 'function') dialog.showModal()
        else dialog.setAttribute('open', '')
        return () => { if (typeof dialog.close === 'function') dialog.close(); previous?.focus?.() }
    }, [selectedTender?.id])

    function savedSearchesWrite(rows) {
        setSavedSearches((previous) => {
            const next = typeof rows === 'function' ? rows(previous) : rows
            if (!suchauftragSchreiben(next)) setSearchNotice('Ihr Browser konnte die Suche nicht dauerhaft speichern. Sie bleibt nur in dieser Sitzung verfügbar.')
            return next
        })
    }

    async function registerDocumentWatches(snapshots, signal) {
        if (!snapshots.length) return { supported: 0, total: 0 }
        const response = await fetch('/api/tender-document-watches', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ids: snapshots.map((row) => row.id) }), signal,
        })
        if (!response.ok) throw new Error('Die Unterlagenüberwachung ist derzeit nicht erreichbar')
        const data = await response.json()
        if (!Array.isArray(data.supported_ids) || typeof data.enabled !== 'boolean') throw new Error('Die Unterlagenüberwachung ist derzeit nicht erreichbar')
        return { supported: data.supported_ids.length, total: snapshots.length, enabled: data.enabled }
    }

    async function checkSavedSearches(rows, signal) {
        if (!rows.length) return
        if (!signal) {
            savedCheckController.current?.abort()
            savedCheckController.current = new AbortController()
            signal = savedCheckController.current.signal
        }
        setCheckingSearches(true)
        const errors = {}
        const coverage = {}
        const watchRequests = []
        const checked = []
        for (const saved of rows) {
            if (signal?.aborted) return
            try {
                const res = await fetch(`/api/tenders-public?${suchparameter(saved.criteria)}`, { signal })
                if (!res.ok) throw new Error('Suche nicht erreichbar')
                const current = await res.json()
                if (!Array.isArray(current)) throw new Error('Ungültige Antwort')
                let watched = []
                if (saved.snapshots.length) {
                    const ids = saved.snapshots.map((row) => row.id).join(',')
                    const previous = await fetch(`/api/tenders-public?${new URLSearchParams({ ids })}`, { signal })
                    if (!previous.ok) throw new Error('Gespeicherte Treffer konnten nicht geprüft werden')
                    watched = await previous.json()
                    if (!Array.isArray(watched)) throw new Error('Ungültige Antwort')
                    if (watched.some((row) => !saved.snapshots.some((old) => old.id === row.id) || !Array.isArray(row.deadline_details))) throw new Error('Der Änderungsvergleich ist derzeit nicht verfügbar')
                }
                const updated = suchauftragVergleichen(saved, current, watched)
                checked.push(updated)
                watchRequests.push(registerDocumentWatches(updated.snapshots, signal)
                    .then((result) => { coverage[saved.id] = result })
                    .catch((error) => { coverage[saved.id] = { error: error.message } }))
            } catch (error) {
                if (signal?.aborted) return
                errors[saved.id] = error.message
                checked.push(saved)
            }
        }
        await Promise.all(watchRequests)
        if (!signal?.aborted) {
            savedSearchesWrite((previous) => previous.map((row) => checked.find((item) => item.id === row.id) || row))
            setSearchErrors(errors)
            setWatchCoverage(coverage)
            setCheckingSearches(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()
        const saved = suchauftragLesen()
        setSavedSearches(saved)
        checkSavedSearches(saved, controller.signal)
        return () => { controller.abort(); savedCheckController.current?.abort() }
    }, [])

    async function saveSearch() {
        if (tendersLoading || tendersError || checkingSearches || savingSearch) return
        const existing = savedSearches.find((row) => JSON.stringify(row.criteria) === JSON.stringify(criteria))
        if (existing) { setSearchNotice('Diese Suche ist bereits gespeichert.'); return }
        if (savedSearches.length >= SUCHAUFTRAEGE_LIMIT) { setSearchNotice(`Sie können ${SUCHAUFTRAEGE_LIMIT} Suchen speichern. Entfernen Sie zuerst eine nicht mehr benötigte Suche.`); return }
        setSavingSearch(true)
        try {
            // Capture the same 25-result baseline used by every later comparison.
            // The visible first page may only contain twelve results.
            const response = await fetch(`/api/tenders-public?${suchparameter(criteria)}`)
            if (!response.ok) throw new Error()
            const baseline = await response.json()
            if (!Array.isArray(baseline)) throw new Error()
            const saved = neuerSuchauftrag(criteria, baseline)
            savedSearchesWrite((previous) => [...previous, saved])
            try {
                const coverage = await registerDocumentWatches(saved.snapshots)
                setWatchCoverage((previous) => ({ ...previous, [saved.id]: coverage }))
                setSearchNotice(coverage.enabled ? 'Suche gespeichert. Neue Treffer und Änderungen werden beim nächsten Besuch oder beim Aktualisieren verglichen.' : 'Suche gespeichert. Neue Treffer und Fristen werden verglichen; die automatische Unterlagenprüfung ist derzeit deaktiviert.')
            } catch {
                setWatchCoverage((previous) => ({ ...previous, [saved.id]: { error: 'Die Unterlagenüberwachung ist derzeit nicht erreichbar' } }))
                setSearchNotice('Suche gespeichert. Die Unterlagenüberwachung ist derzeit nicht erreichbar; Treffer und Fristen werden weiterhin verglichen.')
            }
        } catch { setSearchNotice('Die Suche konnte gerade nicht gespeichert werden. Bitte versuchen Sie es erneut.') }
        finally { setSavingSearch(false) }
    }

    function openSavedSearch(saved) {
        const c = saved.criteria
        setTenderQuery(c.search); setTenderRegion(c.region); setTenderVertical(c.vertical)
        setTenderLand(c.country); setTenderMindestScore(0); setExclusions(c.exclusions); setMinimumDays(c.minimumDays)
        document.getElementById('suche')?.scrollIntoView({ behavior: 'smooth' })
    }

    async function loadMore() {
        const version = searchVersion.current
        setMoreLoading(true); setMoreError('')
        try {
            const params = suchparameter(criteria, { limit: tenderAnzahl, offset: nextOffset.current })
            params.set('min_score', String(tenderMindestScore))
            const res = await fetch(`/api/tenders-public?${params}`)
            if (!res.ok) throw new Error()
            const rows = await res.json()
            if (!Array.isArray(rows)) throw new Error()
            if (searchVersion.current === version) {
                nextOffset.current += rows.length
                setTenders((old) => [...old, ...rows.filter((row) => !old.some((t) => t.id === row.id))])
                setHasMore(rows.length === tenderAnzahl)
            }
        } catch { if (searchVersion.current === version) setMoreError('Weitere Treffer konnten nicht geladen werden. Bitte erneut versuchen.') }
        finally { if (searchVersion.current === version) setMoreLoading(false) }
    }

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
        searchVersion.current += 1
        setTendersLoading(true)
        setMoreLoading(false); setMoreError('')
        const loadTenders = async () => {
            setTendersLoading(true)
            setTendersError(null)
            try {
                const params = new URLSearchParams({
                    country: tenderLand,
                    search: tenderQuery,
                    min_score: String(tenderMindestScore),
                    limit: String(tenderAnzahl),
                })
                if (tenderRegion.trim()) params.set('performance_region', tenderRegion.trim())
                if (tenderVertical) params.set('vertical', tenderVertical)
                // Gecachte KI-Kurzfassung je Treffer (Backend labelt sie, das
                // Original bleibt massgeblich). Ausgelassen wird nur der
                // Bereich von ein bis zwei Zeichen: solche Zwischenstaende
                // beim Tippen liefern beliebige Treffer, fuer die das Backend
                // je Aufruf bis zu fuenf neue Kurzfassungen erzeugen wuerde.
                // Die leere Suche ist dagegen der haeufigste Zustand der
                // Seite, stabil und nach dem ersten Aufruf gecacht.
                const suchbegriff = tenderQuery.trim()
                if (suchbegriff.length === 0 || suchbegriff.length >= 3) {
                    params.set('summary_lang', 'de')
                }
                const res = await fetch(`/api/tenders-public?${params.toString()}`, {
                    signal: controller.signal,
                })
                if (!res.ok) {
                    throw new Error('Tender search failed')
                }
                const data = await res.json()
                if (controller.signal.aborted) return
                setTenders(Array.isArray(data) ? data : [])
                nextOffset.current = Array.isArray(data) ? data.length : 0
                setHasMore(Array.isArray(data) && data.length === tenderAnzahl)
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

        // Der Erstaufruf geht sofort raus: er kann nicht Teil einer Tippfolge
        // sein, und 350 ms Verzoegerung waeren hier reine Wartezeit fuer jeden
        // Besucher.
        if (ersterTenderLauf.current) {
            ersterTenderLauf.current = false
            loadTenders()
            return () => controller.abort()
        }

        // Danach erst 350 ms nach dem letzten Tastendruck laden. Ohne diese
        // Wartezeit ging je Buchstabe ein Request raus; abort() stoppt nur den
        // Browser-Fetch, die Vercel Function und das Backend laufen weiter und
        // erzeugten trotzdem ihre Kurzfassungen — ein getipptes Wort brachte so
        // 30-50 Mistral-Aufrufe und lief in dessen Ratelimit.
        const timer = setTimeout(loadTenders, 350)
        return () => {
            clearTimeout(timer)
            controller.abort()
        }
    }, [tenderQuery, tenderLand, tenderMindestScore, tenderAnzahl, tenderRegion, tenderVertical, searchRetry])

    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/source-status', { signal: controller.signal })
            .then((response) => response.ok ? response.json() : [])
            .then((data) => setSourceStatus(Array.isArray(data) ? data : []))
            .catch(() => {})
        return () => controller.abort()
    }, [])

    useEffect(() => {
        setSprache(spracheErmitteln())
    }, [])

    useEffect(() => {
        const gespeichert = merklisteLesen()
        if (gespeichert.length === 0) return
        setMerkliste(gespeichert.map((eintrag) => ({ ...eintrag, gruende: fitGruende(eintrag.tender, { sprache }) })))
        // Absichtlich nur beim Mounten: der Sprachwechsel weiter unten
        // rechnet die Gruende ohnehin neu.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Wechselt die Sprache, werden die Gruende neu erzeugt. Sie liegen als
    // fertige Saetze im Zustand, nicht als Schluessel - eine halb deutsche,
    // halb englische Tafel waere schlimmer als gar keine Uebersetzung.
    useEffect(() => {
        setMerkliste((bisher) =>
            bisher.length === 0
                ? bisher
                : bisher.map((eintrag) => ({
                      ...eintrag,
                      gruende: fitGruende(eintrag.tender, { suchbegriff: eintrag.suchbegriff, sprache }),
                  })),
        )
    }, [sprache])

    // Geschrieben wird in der Aenderung selbst statt in einem Effekt auf
    // `merkliste`. Ein Effekt liefe beim ersten Rendern mit der noch
    // leeren Liste und ueberschriebe das Gespeicherte, bevor es geladen
    // ist. Der Seiteneffekt im Updater laeuft unter StrictMode zweimal -
    // zweimal denselben Wert zu schreiben ist folgenlos.
    const merklisteAendern = (aenderung) => {
        setMerkliste((bisher) => {
            const neu = aenderung(bisher)
            merklisteSchreiben(neu)
            return neu
        })
    }

    // Ein Treffer landet mit seinen Gruenden auf der Tafel. Schon
    // vorhandene Eintraege werden aktualisiert statt verdoppelt - sonst
    // haette eine zweite Agentenrunde die Liste verdoppelt.
    const merklisteAufnehmen = (tender, { notiz, suchbegriff } = {}) => {
        const gruende = fitGruende(tender, { suchbegriff, sprache })
        merklisteAendern((bisher) => {
            const vorhanden = bisher.find((eintrag) => eintrag.id === String(tender.id))
            if (vorhanden) {
                return bisher.map((eintrag) =>
                    eintrag.id === vorhanden.id
                        ? { ...eintrag, tender, gruende, suchbegriff, notiz: notiz ?? eintrag.notiz }
                        : eintrag,
                )
            }
            if (bisher.length >= MERKLISTE_GRENZE) return bisher
            return [...bisher, { ...eintragAnlegen(tender, { notiz: notiz ?? '' }), gruende, suchbegriff, criteria }]
        })
        return gruende
    }

    const merklisteLeeren = () => merklisteAendern(() => [])

    const aufTafel = (id) => merkliste.some((eintrag) => eintrag.id === String(id))

    const merklisteEntfernen = (id) =>
        merklisteAendern((bisher) => bisher.filter((eintrag) => eintrag.id !== String(id)))

    const entscheidungSetzen = (id, entscheidung, begruendung) =>
        merklisteAendern((bisher) =>
            bisher.map((eintrag) =>
                eintrag.id === String(id)
                    ? { ...eintrag, entscheidung, notiz: begruendung ?? eintrag.notiz }
                    : eintrag,
            ),
        )

    function nachweisSetzen(tender, type, value) {
        if (!aufTafel(tender.id) && merkliste.length >= MERKLISTE_GRENZE) return
        if (!aufTafel(tender.id)) merklisteAufnehmen(tender, { suchbegriff: tenderQuery })
        merklisteAendern((rows) => rows.map((row) => row.id === String(tender.id)
            ? { ...row, evidence: { ...row.evidence, [type]: value } } : row))
    }

    // ===== WebMCP =====
    //
    // Werkzeuge fuer Agenten, die *diese geoeffnete Seite* bedienen. Der
    // MCP-Server unter /mcp bleibt davon unberuehrt: dort ruft ein Agent
    // das Backend ohne Browser auf. Hier aendern schreibende Aufrufe den
    // sichtbaren Zustand; lesende Aufrufe geben genau diesen Zustand zurueck.
    // Der Mensch davor sieht, was der Agent tut, und der Agent muss die Karten
    // nicht aus dem DOM zusammenkratzen.
    //
    // Ohne unterstuetzenden Browser passiert hier nichts (siehe
    // src/lib/webmcp.js). Heute ist das jeder Besucher ausser Chrome 149+
    // im Origin Trial.
    const zustand = useRef({})
    useEffect(() => {
        // Registriert wird einmal beim Mounten, aufgerufen wird spaeter.
        // Die Werkzeuge lesen den Zustand deshalb ueber diese Referenz und
        // nicht aus ihrer Closure - sonst antworteten sie mit der
        // Trefferliste von vor dem ersten Tastendruck.
        zustand.current = {
            tenders,
            tendersLoading,
            tendersError,
            tenderQuery,
            tenderLand,
            tenderRegion,
            tenderVertical,
            tenderMindestScore,
            tenderAnzahl,
            sourceStatus,
            merkliste,
            sprache,
            merklisteAufnehmen,
            merklisteEntfernen,
            entscheidungSetzen,
        }
    })

    useEffect(() => {
        const zumAnker = (id) => {
            if (typeof document === 'undefined') return
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }

        const alsTreffer = (liste) =>
            (Array.isArray(liste) ? liste : []).map((tender) => ({
                id: tender.id,
                title: tender.title,
                buyer: tender.buyer_name || null,
                deadline: tender.deadline_at || null,
                estimated_value_eur: tender.estimated_value_eur ?? null,
                relevance_score: tender.relevance_score ?? null,
                source: tender.source,
                source_url: tender.source_url,
                summary: tender.summary?.summary || null,
            }))

        // Ein Agent kennt ids aus der Trefferliste *und* von der Tafel.
        // Beide Orte zu durchsuchen erspart ihm die Regel, welche id woher
        // stammt.
        const tenderFinden = (id) => {
            const jetzt = zustand.current
            const ausTreffern = (Array.isArray(jetzt.tenders) ? jetzt.tenders : []).find(
                (tender) => String(tender.id) === String(id),
            )
            if (ausTreffern) return ausTreffern
            return (jetzt.merkliste ?? []).find((eintrag) => eintrag.id === String(id))?.tender ?? null
        }

        const alsGruende = (gruende) =>
            (gruende ?? []).map((grund) => ({ key: grund.kennung, weight: grund.bewertung, text: grund.text }))

        const alsTafel = (liste) =>
            (liste ?? []).map((eintrag) => ({
                id: eintrag.id,
                title: eintrag.tender?.title ?? null,
                decision: eintrag.entscheidung ?? 'open',
                note: eintrag.notiz || null,
                source_url: eintrag.tender?.source_url ?? null,
                balance: gruendeBilanz(eintrag.gruende),
                reasons: alsGruende(eintrag.gruende),
            }))

        // Antwortet erst, wenn die Tafel den Stand auch zeigt.
        const tafelAbwarten = (istFertig) => warteAuf(istFertig, { grenzeMs: 3000 })

        const trefferAntwort = (liste, begriff, land) => {
            const treffer = alsTreffer(liste)
            const text = treffer.length === 0
                ? `No preview results for "${begriff}" in ${land}. Try a different keyword or a lower min_score; the anonymous preview only shows part of the index.`
                : `${treffer.length} tender(s) for "${begriff}" in ${land} are now displayed on the page. The linked original notice always prevails over these summaries.`
            return werkzeugAntwort(text, { query: begriff, country: land, performance_region: zustand.current.tenderRegion, vertical: zustand.current.tenderVertical, count: treffer.length, tenders: treffer })
        }

        const werkzeuge = [
            {
                name: 'search_tenders',
                title: 'Ausschreibungen suchen',
                annotations: { readOnlyHint: true, untrustedContentHint: true },
                description:
                    'Search current public tender notices and show the results on this page. Filters by keyword, ISO alpha-3 buyer country and minimum relevance score.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        search: { type: 'string', description: 'Keyword or trade, for example "Fassade" or "Webdesign"' },
                        country: { type: 'string', description: 'ISO alpha-3 buyer country, for example DEU, AUT or GBR' },
                        performance_region: { type: 'string', description: 'Place of performance, e.g. Berlin or NRW. Empty string clears the region.' },
                        vertical: { type: 'string', enum: GEWERKE.map((item) => item.value), description: 'Trade filter. Empty string clears the trade.' },
                        min_score: { type: 'number', description: 'Minimum relevance score from 0 to 100' },
                        limit: { type: 'integer', description: 'Number of results to display, 1 to 20' },
                    },
                    required: ['search'],
                    additionalProperties: false,
                },
                execute: async ({ search, country, performance_region: region, vertical, min_score: minScore, limit } = {}) => {
                    const jetzt = zustand.current
                    const begriff = typeof search === 'string' ? search.trim() : jetzt.tenderQuery
                    const land = typeof country === 'string' && country.trim()
                        ? country.trim().toUpperCase()
                        : jetzt.tenderLand
                    if (!/^[A-Z]{3}$/.test(land)) {
                        return werkzeugFehler(`"${country}" is not an ISO alpha-3 country code. Expected for example DEU, AUT or GBR.`)
                    }
                    const score = minScore === undefined ? jetzt.tenderMindestScore : Number(minScore)
                    if (!Number.isFinite(score) || score < 0 || score > 100) {
                        return werkzeugFehler('min_score must be a number between 0 and 100.')
                    }
                    const anzahl = limit === undefined ? jetzt.tenderAnzahl : Number(limit)
                    if (!Number.isInteger(anzahl) || anzahl < 1 || anzahl > 20) {
                        return werkzeugFehler('limit must be a whole number between 1 and 20.')
                    }
                    const ort = typeof region === 'string' ? region.trim().slice(0, 160) : jetzt.tenderRegion
                    const gewerk = vertical === undefined ? jetzt.tenderVertical : vertical
                    if (!GEWERKE.some((item) => item.value === gewerk)) return werkzeugFehler('Unknown trade filter.')

                    const unveraendert =
                        begriff === jetzt.tenderQuery &&
                        land === jetzt.tenderLand &&
                        ort === jetzt.tenderRegion &&
                        gewerk === jetzt.tenderVertical &&
                        score === jetzt.tenderMindestScore &&
                        anzahl === jetzt.tenderAnzahl
                    if (unveraendert && !jetzt.tendersLoading) {
                        return trefferAntwort(jetzt.tenders, begriff, land)
                    }

                    // Der Ladezustand wird schon hier gesetzt und nicht erst
                    // im entprellten Lade-Effekt: sonst haelt warteAuf() die
                    // noch unveraenderte Liste faelschlich fuer das Ergebnis.
                    setTendersLoading(true)
                    setTenderQuery(begriff)
                    setTenderLand(land)
                    setTenderRegion(ort)
                    setTenderVertical(gewerk)
                    setTenderMindestScore(score)
                    setTenderAnzahl(anzahl)
                    zumAnker('suche')

                    const fertig = await warteAuf(() => {
                        const spaeter = zustand.current
                        return (
                            !spaeter.tendersLoading &&
                            spaeter.tenderQuery === begriff &&
                            spaeter.tenderLand === land &&
                            spaeter.tenderRegion === ort &&
                            spaeter.tenderVertical === gewerk &&
                            spaeter.tenderMindestScore === score &&
                            spaeter.tenderAnzahl === anzahl
                        )
                    })
                    if (!fertig) {
                        return werkzeugFehler('The tender search did not respond in time. Try again in a few seconds.')
                    }
                    const danach = zustand.current
                    if (danach.tendersError) {
                        return werkzeugFehler('The tender search failed. Try again in a few seconds.')
                    }
                    return trefferAntwort(danach.tenders, begriff, land)
                },
            },
            {
                name: 'list_visible_tenders',
                title: 'Angezeigte Treffer lesen',
                annotations: { readOnlyHint: true, untrustedContentHint: true },
                description: 'Return the tenders currently displayed on this page, without changing the search.',
                inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                execute: () => {
                    const jetzt = zustand.current
                    if (jetzt.tendersLoading) {
                        return werkzeugFehler('The result list is still loading. Try again in a few seconds.')
                    }
                    return trefferAntwort(jetzt.tenders, jetzt.tenderQuery, jetzt.tenderLand)
                },
            },
            {
                name: 'open_tender',
                title: 'Ausschreibung oeffnen',
                annotations: { readOnlyHint: true, untrustedContentHint: true },
                description:
                    'Open one of the tenders currently displayed and show its details on the page, including the link to the original notice.',
                inputSchema: {
                    type: 'object',
                    properties: { id: { type: 'string', description: 'Tender id from search_tenders or list_visible_tenders' } },
                    required: ['id'],
                    additionalProperties: false,
                },
                execute: ({ id } = {}) => {
                    const liste = Array.isArray(zustand.current.tenders) ? zustand.current.tenders : []
                    if (liste.length === 0) {
                        return werkzeugFehler('No tenders are displayed right now. Call search_tenders first.')
                    }
                    const treffer = liste.find((tender) => String(tender.id) === String(id))
                    if (!treffer) {
                        return werkzeugFehler(
                            `No displayed tender has the id "${id}". Available ids: ${liste.map((tender) => tender.id).join(', ')}.`,
                        )
                    }
                    setSelectedTender(treffer)
                    return werkzeugAntwort(
                        `"${treffer.title}" is now open on the page. The linked original notice prevails over this summary.`,
                        alsTreffer([treffer])[0],
                    )
                },
            },
            {
                name: 'source_status',
                title: 'Quellenstatus',
                annotations: { readOnlyHint: true },
                description:
                    'List the connected procurement sources with implementation status, last successful poll and stored notice count.',
                inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                execute: () => {
                    const quellen = Array.isArray(zustand.current.sourceStatus) ? zustand.current.sourceStatus : []
                    if (quellen.length === 0) {
                        return werkzeugFehler('The source status has not loaded yet. Try again in a few seconds.')
                    }
                    const gespeichert = quellen.reduce((summe, quelle) => summe + (Number(quelle.stored) || 0), 0)
                    return werkzeugAntwort(
                        `${quellen.length} connected sources holding ${gespeichert} stored notices in total.`,
                        { total_stored: gespeichert, sources: quellen },
                    )
                },
            },
            {
                name: 'prefill_pilot_profile',
                title: 'Pilotanfrage vorausfuellen',
                annotations: { readOnlyHint: false },
                description:
                    'Prefill the pilot request form on this page with company details. The form is only filled in, never submitted: the request sends an email to a real team, so the user has to review it and press the button themselves.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        company: { type: 'string', description: 'Company name' },
                        email: { type: 'string', description: 'Business email address' },
                        industry: { type: 'string', description: 'Trade or industry, for example "Fassadenbau"' },
                        region: { type: 'string', description: 'Region or service area' },
                        services: { type: 'string', description: 'Services offered, free text' },
                        budget: { type: 'string', description: 'Typical order value' },
                        frequency: { type: 'string', description: 'Desired digest frequency' },
                    },
                    additionalProperties: false,
                },
                execute: (eingaben = {}) => {
                    const felder = ['company', 'email', 'industry', 'region', 'services', 'budget', 'frequency']
                    const uebernommen = {}
                    for (const feld of felder) {
                        const wert = eingaben[feld]
                        if (typeof wert === 'string' && wert.trim()) uebernommen[feld] = wert.trim()
                    }
                    if (Object.keys(uebernommen).length === 0) {
                        return werkzeugFehler(`No fillable field was passed. Available fields: ${felder.join(', ')}.`)
                    }
                    // `website` fehlt in der Liste mit Absicht: das ist das
                    // Honeypot-Feld der Spamabwehr. Ein gefuelltes Feld liesse
                    // api/profile-lead.js die Anfrage stillschweigend verwerfen.
                    setProfileData((bisher) => ({ ...bisher, ...uebernommen }))
                    zumAnker('profil')
                    return werkzeugAntwort(
                        `Prefilled: ${Object.keys(uebernommen).join(', ')}. The form was deliberately not submitted - ask the user to review it and press the button.`,
                        { prefilled_fields: Object.keys(uebernommen), submitted: false },
                    )
                },
            },
            {
                name: 'shortlist_tender',
                title: 'Auf die Go/No-Go-Tafel legen',
                annotations: { readOnlyHint: false, untrustedContentHint: true },
                description:
                    'Put a tender on the shared go/no-go board on this page and compute its fit reasons from the notice fields (CPV division, place of performance, days to deadline, value against the EU threshold, award criteria, lots, framework agreement, GPA coverage). The board is visible to the user, who can override every decision. Reason texts follow the browser language so the user and agent read the same board.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Tender id from search_tenders, list_visible_tenders or list_shortlist' },
                        note: { type: 'string', description: 'Optional note shown on the board card' },
                    },
                    required: ['id'],
                    additionalProperties: false,
                },
                execute: async ({ id, note } = {}) => {
                    const tender = tenderFinden(id)
                    if (!tender) {
                        return werkzeugFehler(
                            `No tender with id "${id}" is displayed or on the board. Call search_tenders first.`,
                        )
                    }
                    // Die Grenze gilt fuer neue Eintraege. Einen bereits
                    // liegenden Treffer zu aktualisieren laesst die Tafel
                    // nicht wachsen und darf deshalb nicht scheitern.
                    const schonDrauf = (zustand.current.merkliste ?? []).some(
                        (eintrag) => eintrag.id === String(id),
                    )
                    if (!schonDrauf && (zustand.current.merkliste ?? []).length >= MERKLISTE_GRENZE) {
                        return werkzeugFehler(
                            `The board holds the maximum of ${MERKLISTE_GRENZE} tenders. Call remove_from_shortlist before adding another.`,
                        )
                    }
                    const gruende = zustand.current.merklisteAufnehmen(tender, {
                        notiz: note,
                        suchbegriff: zustand.current.tenderQuery,
                    })
                    await tafelAbwarten(() =>
                        (zustand.current.merkliste ?? []).some((eintrag) => eintrag.id === String(id)),
                    )
                    zumAnker('tafel')
                    const bilanz = gruendeBilanz(gruende)
                    return werkzeugAntwort(
                        `"${tender.title}" is on the board with ${bilanz.dafuer} argument(s) in favour and ${bilanz.dagegen} against. No decision has been made - present the reasons and let the user decide, or call set_decision with their answer.`,
                        { id: String(id), decision: 'open', balance: bilanz, reasons: alsGruende(gruende) },
                    )
                },
            },
            {
                name: 'explain_fit',
                title: 'Passung begruenden',
                annotations: { readOnlyHint: true, untrustedContentHint: true },
                description:
                    'Explain why a tender does or does not fit, as individual weighted reasons derived from the notice. Does not change the board. Use shortlist_tender when the reasons should stay visible to the user.',
                inputSchema: {
                    type: 'object',
                    properties: { id: { type: 'string', description: 'Tender id' } },
                    required: ['id'],
                    additionalProperties: false,
                },
                execute: ({ id } = {}) => {
                    const tender = tenderFinden(id)
                    if (!tender) {
                        return werkzeugFehler(`No tender with id "${id}" is displayed or on the board. Call search_tenders first.`)
                    }
                    const gruende = fitGruende(tender, {
                        suchbegriff: zustand.current.tenderQuery,
                        sprache: zustand.current.sprache,
                    })
                    const bilanz = gruendeBilanz(gruende)
                    return werkzeugAntwort(
                        `${bilanz.dafuer} argument(s) in favour, ${bilanz.dagegen} against, ${bilanz.neutral} neutral. These are arguments, not a recommendation - the go/no-go call is the user's.`,
                        { id: String(id), balance: bilanz, reasons: alsGruende(gruende) },
                    )
                },
            },
            {
                name: 'set_decision',
                title: 'Go/No-Go setzen',
                annotations: { readOnlyHint: false },
                description:
                    'Record the go/no-go decision the user made for a tender on the board, together with their reasoning. Only call this with a decision the user actually expressed - never decide on their behalf. Use "open" to take a decision back.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Tender id on the board' },
                        decision: { type: 'string', enum: ['go', 'no_go', 'open'], description: 'The decision the user made' },
                        reason: { type: 'string', description: "The user's reasoning, shown on the board card" },
                    },
                    required: ['id', 'decision'],
                    additionalProperties: false,
                },
                execute: async ({ id, decision, reason } = {}) => {
                    if (!['go', 'no_go', 'open'].includes(decision)) {
                        return werkzeugFehler('decision must be one of: go, no_go, open.')
                    }
                    const vorhanden = (zustand.current.merkliste ?? []).some((eintrag) => eintrag.id === String(id))
                    if (!vorhanden) {
                        return werkzeugFehler(`Tender "${id}" is not on the board. Call shortlist_tender first.`)
                    }
                    const gesetzt = decision === 'open' ? null : decision
                    zustand.current.entscheidungSetzen(id, gesetzt, reason)
                    await tafelAbwarten(() =>
                        (zustand.current.merkliste ?? []).some(
                            (eintrag) => eintrag.id === String(id) && eintrag.entscheidung === gesetzt,
                        ),
                    )
                    zumAnker('tafel')
                    return werkzeugAntwort(
                        `Decision "${decision}" is now shown on the board for tender ${id}. The user can change it there at any time.`,
                        { id: String(id), decision, note: reason ?? null },
                    )
                },
            },
            {
                name: 'remove_from_shortlist',
                title: 'Von der Tafel nehmen',
                annotations: { readOnlyHint: false },
                description: 'Remove a tender from the shared board.',
                inputSchema: {
                    type: 'object',
                    properties: { id: { type: 'string', description: 'Tender id on the board' } },
                    required: ['id'],
                    additionalProperties: false,
                },
                execute: async ({ id } = {}) => {
                    if (!(zustand.current.merkliste ?? []).some((eintrag) => eintrag.id === String(id))) {
                        return werkzeugFehler(`Tender "${id}" is not on the board.`)
                    }
                    zustand.current.merklisteEntfernen(id)
                    await tafelAbwarten(() =>
                        !(zustand.current.merkliste ?? []).some((eintrag) => eintrag.id === String(id)),
                    )
                    return werkzeugAntwort(`Tender ${id} was removed from the board.`, { id: String(id), removed: true })
                },
            },
            {
                name: 'list_shortlist',
                title: 'Tafel lesen',
                annotations: { readOnlyHint: true, untrustedContentHint: true },
                description:
                    'Return the shared go/no-go board as the user currently sees it, including decisions the user made by hand.',
                inputSchema: { type: 'object', properties: {}, additionalProperties: false },
                execute: () => {
                    const tafel = alsTafel(zustand.current.merkliste)
                    if (tafel.length === 0) {
                        return werkzeugAntwort('The board is empty. Call shortlist_tender to put a tender on it.', {
                            count: 0,
                            entries: [],
                        })
                    }
                    const offen = tafel.filter((eintrag) => eintrag.decision === 'open').length
                    return werkzeugAntwort(
                        `${tafel.length} tender(s) on the board, ${offen} still undecided.`,
                        { count: tafel.length, undecided: offen, entries: tafel },
                    )
                },
            },
            {
                name: 'check_eu_threshold',
                title: 'EU-Schwellenwert pruefen',
                annotations: { readOnlyHint: true },
                description:
                    'Check a contract value against the EU procurement thresholds for 2026/2027. Above the threshold an EU-wide procedure with longer minimum deadlines applies. The official values and the procurement documents of the individual procedure always prevail.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        value_eur: { type: 'number', description: 'Contract value in euro' },
                        contract_type: {
                            type: 'string',
                            enum: ['bauauftrag', 'oeffentlicher_auftraggeber', 'zentrale_regierungsbehoerde'],
                            description: 'Works, other public buyers, or central government bodies. Derived from the CPV division when omitted.',
                        },
                        cpv: { type: 'string', description: 'CPV code used to derive the contract type when contract_type is omitted' },
                    },
                    required: ['value_eur'],
                    additionalProperties: false,
                },
                execute: ({ value_eur: wert, contract_type: art, cpv } = {}) => {
                    if (!Number.isFinite(Number(wert)) || Number(wert) <= 0) {
                        return werkzeugFehler('value_eur must be a positive number in euro.')
                    }
                    const gewaehlt = art || (cpv ? artAusCpv(cpv) : 'oeffentlicher_auftraggeber')
                    const pruefung = schwellenwertPruefung(wert, gewaehlt, 'en')
                    return werkzeugAntwort(
                        `${Number(wert)} EUR is ${pruefung.oberhalb ? 'at or above' : 'below'} the ${pruefung.schwelle} EUR threshold for ${pruefung.text}. The official values and the procurement documents prevail.`,
                        {
                            value_eur: Number(wert),
                            contract_type: pruefung.art,
                            threshold_eur: pruefung.schwelle,
                            above_threshold: pruefung.oberhalb,
                            all_thresholds: EU_SCHWELLENWERTE,
                        },
                    )
                },
            },
        ]

        return stelleWerkzeugeBereit(werkzeuge, (name, fehler) => {
            // Haeufigste Ursachen laut Spec: fehlende Origin-Isolation und
            // eine Permissions Policy ohne `tools`. Beides waere sonst
            // unsichtbar - die Werkzeuge fehlten einfach.
            console.warn(`WebMCP: Werkzeug ${name} nicht angemeldet`, fehler)
        })
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

            <section className="search-hero" id="start">
                <div className="container">
                    <span className="search-hero__eyebrow">Öffentliche Aufträge. Eine klare Vorauswahl.</span>
                    <h1>Den passenden Auftrag finden.<br /><span className="gradient-text">Die richtige Entscheidung treffen.</span></h1>
                    <p>Leistung und Region eingeben. Treffer mit Originalquelle prüfen. Interessante Verfahren im Blick behalten.</p>
                    <form className="entry-search" id="suche" onSubmit={(event) => { event.preventDefault(); document.getElementById('ergebnisse')?.scrollIntoView({ behavior: 'smooth' }) }}>
                        <div className="entry-search__fields">
                            <label htmlFor="tender-query">Welche Leistung bieten Sie an?
                                <input id="tender-query" type="search" placeholder="z. B. Fenster, Fassaden, Marketing …" value={tenderQuery} onChange={(event) => setTenderQuery(event.target.value)} maxLength={160} />
                            </label>
                            <label htmlFor="tender-gewerk">Gewerk
                                <select id="tender-gewerk" value={tenderVertical} onChange={(event) => setTenderVertical(event.target.value)}>{GEWERKE.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
                            </label>
                            <label htmlFor="tender-region">Leistungsregion
                                <input id="tender-region" placeholder="Bundesweit oder z. B. Berlin" list="regionen" value={tenderRegion} onChange={(event) => setTenderRegion(event.target.value)} maxLength={160} />
                                <datalist id="regionen">{['Berlin', 'Brandenburg', 'Bayern', 'Baden-Württemberg', 'Hamburg', 'Hessen', 'Nordrhein-Westfalen', 'Sachsen', 'Niedersachsen'].map((region) => <option key={region} value={region} />)}</datalist>
                            </label>
                            <button className="btn btn--primary" type="submit">Aufträge finden <span aria-hidden="true">↓</span></button>
                        </div>
                        <div className="entry-search__bottom">
                            <span>Kostenlos suchen · Ohne Anmeldung</span>
                            <details className="search-options"><summary>Land & Entscheidungskriterien</summary>
                                <div className="search-options__fields">
                                    <label htmlFor="tender-country">Land<select id="tender-country" value={tenderLand} onChange={(event) => setTenderLand(event.target.value)}><option value="DEU">Deutschland</option><option value="AUT">Österreich</option><option value="CHE">Schweiz</option><option value="GBR">Großbritannien</option></select></label>
                                    <label htmlFor="tender-exclusions">Ausschlussbegriffe<input id="tender-exclusions" placeholder="z. B. Personalüberlassung, Winterdienst" value={exclusions} onChange={(event) => setExclusions(event.target.value)} maxLength={300} /></label>
                                    <label htmlFor="tender-days">Mindestvorlauf in Tagen<input id="tender-days" type="number" min="0" max="90" value={minimumDays} onChange={(event) => setMinimumDays(Math.min(90, Math.max(0, Number(event.target.value))))} /></label>
                                </div>
                                <p>Ausschlussbegriffe und Vorlauf markieren Risiken in der Entscheidungskarte. Sie blenden keine Treffer aus.</p>
                            </details>
                        </div>
                    </form>
                    <div className="search-hero__footer"><span>Aktuell erfasst: Fenster & Fassade, Planung, Marketing & Digital.</span><Link to="/status">Quellen & Abdeckung ↗</Link></div>
                </div>
            </section>

            <section className="section workspace" id="ergebnisse">
                <div className="container">
                    <div className="tender-search">
                        <div className="workspace__heading">
                            <div><span className="section__label">Ihre Vorauswahl</span><h2>Aufträge, die Sie weiterbringen.</h2><p>{tendersLoading ? 'Treffer werden gesucht …' : `${tenders.length} Treffer geladen`}{tenderRegion ? ` · ${tenderRegion}` : ' · Alle Leistungsregionen'}{latestSuccessAt ? ` · Letzter Quellenabruf ${formatDate(latestSuccessAt)}` : ''}</p></div>
                            <button className="btn btn--outline" type="button" onClick={saveSearch} disabled={tendersLoading || moreLoading || !!tendersError || checkingSearches || savingSearch}>{savingSearch ? 'Suche wird gespeichert …' : 'Suche speichern'}</button>
                        </div>
                        <div className="tender-search__presets" aria-label="Beispielsuchen">{TENDER_PRESETS.map((preset) => <button type="button" key={preset.value} className={tenderQuery === preset.value ? 'is-active' : ''} onClick={() => { setTenderQuery(preset.value); setTenderVertical('') }}>{preset.label}</button>)}</div>
                        {searchNotice && <p className="workspace-notice" role="status">{searchNotice}</p>}
                        {tendersLoading && <div className="result-skeleton" role="status"><span className="sr-only">Aktuelle Ausschreibungen werden geladen …</span>{[1, 2, 3].map((item) => <div key={item} />)}</div>}
                        {tendersError && <div className="tender-state tender-state--error" role="alert">{tendersError} <button type="button" className="source-trigger" onClick={() => setSearchRetry((value) => value + 1)}>Erneut versuchen</button></div>}
                        {!tendersLoading && !tendersError && tenders.length === 0 && <div className="tender-state"><h3>Für diese Kombination gibt es gerade keinen Treffer.</h3><p>Probieren Sie einen allgemeineren Leistungsbegriff oder erweitern Sie die Region. Unbekannte Leistungsorte werden bei einer Regionssuche nicht einbezogen.</p><button type="button" className="source-trigger" onClick={() => { setTenderRegion(''); setTenderVertical(''); setTenderQuery('') }}>Filter zurücksetzen</button></div>}
                        {!tendersLoading && !tendersError && tenders.length > 0 && <div className="tender-grid">
                            {tenders.map((tender) => <article className="tender-card opportunity" key={tender.id}>
                                <div className="tender-card__meta"><span>{(tender.source || '').toUpperCase()}</span><span>{tender.deadline_at ? 'Frist erfasst' : 'Frist offen'}</span></div>
                                <h3><button type="button" onClick={() => setSelectedTender(tender)}>{tender.title}</button></h3>
                                <p className="opportunity__buyer">{tender.buyer_name || 'Auftraggeber nicht angegeben'}</p>
                                <p className="opportunity__description">{tender.description ? `${tender.description.slice(0, 220)}${tender.description.length > 220 ? ' …' : ''}` : 'Leistungsumfang in der Originalbekanntmachung prüfen.'}</p>
                                <dl><div><dt>Leistungsort</dt><dd>{tender.performance_location || (tender.performance_nuts?.length ? `NUTS ${tender.performance_nuts.join(', ')}` : 'Noch ungeklärt')}</dd></div><div><dt>Frist</dt><dd className={!tender.deadline_at ? 'is-uncertain' : ''}>{fristText(tender)}</dd></div><div><dt>Auftragswert</dt><dd>{formatCurrency(tender.estimated_value_eur) || 'Nicht veröffentlicht'}</dd></div></dl>
                                <div className="tender-card__aktionen"><button type="button" className="btn btn--primary" onClick={() => setSelectedTender(tender)}>Entscheidung prüfen</button><button type="button" className="source-trigger" disabled={!aufTafel(tender.id) && merkliste.length >= MERKLISTE_GRENZE} onClick={() => merklisteAufnehmen(tender, { suchbegriff: tenderQuery })}>{aufTafel(tender.id) ? '✓ Gemerkt' : 'Merken'}</button></div>
                                {quellenUrl(tender.source_url) && <a className="opportunity__source" href={quellenUrl(tender.source_url)} target="_blank" rel="noopener noreferrer">Originalquelle direkt öffnen ↗</a>}
                            </article>)}
                        </div>}
                        {!tendersLoading && !tendersError && <div className="workspace__pagination">{hasMore ? <button type="button" className="btn btn--outline" disabled={moreLoading} onClick={loadMore}>{moreLoading ? 'Weitere Aufträge werden geladen …' : 'Weitere Aufträge laden ↓'}</button> : tenders.length > 0 && <p>Alle Treffer dieser Suche geladen.</p>}{moreError && <p role="alert">{moreError}</p>}</div>}

                        <section className="saved-searches" id="gespeichert" aria-labelledby="saved-title">
                            <div className="workspace__heading"><div><span className="section__label">Dranbleiben</span><h3 id="saved-title">Ihre gespeicherten Suchen</h3><p>Auf diesem Gerät gespeichert. Beim Öffnen und Aktualisieren vergleichen wir neue Treffer, Fristen und bereits erfasste Unterlagen.</p></div><button type="button" className="source-trigger" disabled={checkingSearches || !savedSearches.length} onClick={() => checkSavedSearches(savedSearches)}>{checkingSearches ? 'Wird geprüft …' : 'Jetzt aktualisieren ↻'}</button></div>
                            {!savedSearches.length && <p className="saved-searches__empty">Eine gute Suche muss man nicht zweimal bauen. Speichern Sie Ihre Auswahl oben – Änderungen erscheinen hier.</p>}
                            {savedSearches.map((saved) => <article className="saved-search" key={saved.id}>
                                <div className="saved-search__heading"><div><h4>{saved.criteria.search || GEWERKE.find((g) => g.value === saved.criteria.vertical)?.label || 'Alle Leistungen'}</h4><p>{saved.criteria.region || 'Alle Regionen'} · {saved.criteria.country} · {saved.checkedAt ? `Geprüft ${formatDate(saved.checkedAt)}` : 'Noch nicht geprüft'}</p></div><div className="saved-search__actions"><button type="button" className="source-trigger" onClick={() => openSavedSearch(saved)}>Suche öffnen</button><button type="button" className="source-trigger" disabled={checkingSearches} onClick={() => savedSearchesWrite(savedSearches.filter((row) => row.id !== saved.id))}>Entfernen</button></div></div>
                                {searchErrors[saved.id] && <p role="alert">{searchErrors[saved.id]}. Der letzte geprüfte Stand bleibt erhalten.</p>}
                                {watchCoverage[saved.id]?.error && <p role="status">{watchCoverage[saved.id].error}. Treffer und Fristen werden weiterhin verglichen.</p>}
                                {watchCoverage[saved.id]?.enabled === false && <p role="status">Die automatische Unterlagenprüfung ist derzeit deaktiviert. Bitte prüfen Sie die Quelle direkt.</p>}
                                {watchCoverage[saved.id]?.enabled && watchCoverage[saved.id]?.total > watchCoverage[saved.id]?.supported && <p className="saved-search__quiet">Automatische Unterlagenprüfung für {watchCoverage[saved.id].supported} von {watchCoverage[saved.id].total} beobachteten Verfahren möglich. Nicht jedes Portal gibt seine Unterlagen frei; bei den übrigen bitte die Quelle prüfen.</p>}
                                {saved.updates.length > 0 ? <><ul className="search-updates">{saved.updates.map((update) => <li key={update.fingerprint}><span className={`search-updates__badge is-${update.kind}`}>{update.label}</span><div>{quellenUrl(update.tender.source_url) ? <a href={quellenUrl(update.tender.source_url)} target="_blank" rel="noopener noreferrer">{update.tender.title} ↗</a> : <span>{update.tender.title}</span>}{update.kind === 'deadline' && <p>{update.previousLabel || (update.previous ? formatDate(update.previous) : 'Nicht erfasst')} → {update.valueLabel || (update.value ? formatDate(update.value) : 'Nicht mehr angegeben')}</p>}</div></li>)}</ul><button type="button" className="source-trigger" disabled={checkingSearches} onClick={() => savedSearchesWrite(savedSearches.map((row) => row.id === saved.id ? { ...row, updates: [] } : row))}>Änderungen als gelesen markieren</button></> : !searchErrors[saved.id] && <p className="saved-search__quiet">Keine neuen Änderungen seit dem letzten Vergleich.</p>}
                            </article>)}
                            <p className="workspace__hint">Je Suche: die ersten 25 Treffer und bis zu 25 beobachtete Verfahren. Unterstützte öffentliche Unterlagen werden im Hintergrund regelmäßig geprüft; Änderungen erscheinen nach dem nächsten Abgleich. Andere Unterlagen bitte direkt an der Quelle prüfen. Keine E-Mail-Benachrichtigung in dieser Browseransicht. Für regelmäßige E-Mail-Digests: <a href="#profil">Pilotprofil anfragen</a>.</p>
                        </section>

                        <div className="tafel" id="tafel">
                            <div className="tafel__kopf">
                                <div>
                                    <span className="profile-lead__eyebrow">{texte.eyebrow}</span>
                                    <h3>{texte.titel}</h3>
                                    <p>{texte.einleitung}</p>
                                </div>
                                {merkliste.length > 0 && (
                                    <button type="button" className="source-trigger" onClick={merklisteLeeren}>
                                        {texte.leeren}
                                    </button>
                                )}
                            </div>

                            {merkliste.length === 0 ? (
                                <div className="tender-state">{texte.leer}</div>
                            ) : (
                                <div className="tafel__liste">
                                    {merkliste.map((eintrag) => {
                                        const bilanz = gruendeBilanz(eintrag.gruende)
                                        return (
                                            <article className="tafel-karte" key={eintrag.id}>
                                                <div className="tender-card__meta">
                                                    <span>{(eintrag.tender.source || '').toUpperCase()}</span>
                                                    <span className={`tafel-karte__status ist-${eintrag.entscheidung || 'offen'}`}>
                                                        {eintrag.entscheidung === 'go'
                                                            ? texte.go
                                                            : eintrag.entscheidung === 'no_go'
                                                                ? texte.noGo
                                                                : texte.offen}
                                                    </span>
                                                </div>
                                                <h4>{eintrag.tender.title}</h4>
                                                <dl>
                                                    <div>
                                                        <dt>{texte.auftraggeber}</dt>
                                                        <dd>{eintrag.tender.buyer_name || texte.nichtAngegeben}</dd>
                                                    </div>
                                                    <div>
                                                        <dt>{texte.frist}</dt>
                                                        <dd>{formatDate(eintrag.tender.deadline_at, sprache)}</dd>
                                                    </div>
                                                </dl>

                                                {eintrag.gruende.length > 0 && (
                                                    <>
                                                        <p className="tafel-karte__bilanz">
                                                            {texte.bilanz(bilanz.dafuer, bilanz.dagegen, bilanz.neutral)}
                                                        </p>
                                                        <ul className="tafel-karte__gruende">
                                                            {eintrag.gruende.map((grund) => (
                                                                <li key={grund.kennung} className={`ist-${grund.bewertung}`}>
                                                                    {grund.text}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </>
                                                )}

                                                <label className="shortlist-label">{sprache === 'en' ? 'Your decision notes' : 'Ihre Entscheidungsnotiz'}<textarea className="shortlist-note" rows={2} maxLength={2000} value={eintrag.notiz || ''} onChange={(event) => entscheidungSetzen(eintrag.id, eintrag.entscheidung, event.target.value)} placeholder={sprache === 'en' ? 'Next step, owner, open questions …' : 'Nächster Schritt, Zuständigkeit, offene Fragen …'} /></label>

                                                <div className="tafel-karte__aktionen">
                                                    <button
                                                        type="button"
                                                        className={eintrag.entscheidung === 'go' ? 'is-active' : ''}
                                                        onClick={() => entscheidungSetzen(eintrag.id, eintrag.entscheidung === 'go' ? null : 'go')}
                                                    >
                                                        {texte.go}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={eintrag.entscheidung === 'no_go' ? 'is-active' : ''}
                                                        onClick={() => entscheidungSetzen(eintrag.id, eintrag.entscheidung === 'no_go' ? null : 'no_go')}
                                                    >
                                                        {texte.noGo}
                                                    </button>
                                                    <button type="button" onClick={() => setSelectedTender(eintrag.tender)}>Entscheidung prüfen</button>
                                                    <a href={quellenUrl(eintrag.tender.source_url) || undefined} target="_blank" rel="noopener noreferrer">
                                                        {texte.original}
                                                    </a>
                                                    <button type="button" onClick={() => merklisteEntfernen(eintrag.id)}>
                                                        {texte.entfernen}
                                                    </button>
                                                </div>
                                            </article>
                                        )
                                    })}
                                </div>
                            )}
                        </div>

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
                                        <span><s>149 EUR/Monat</s> Kostenfrei in der Pilotphase</span>
                                        <p>Suchprofil, Alerts, Fulltext-Suche und wöchentliche Trefferliste.</p>
                                        <small>Checkout folgt nach Pilotabstimmung.</small>
                                    </article>
                                    <article>
                                        <strong>Agent</strong>
                                        <span><s>499 EUR/Monat</s> Kostenfrei in der Pilotphase</span>
                                        <p>Höhere API-Limits, Volltextsuche, Agent API, A2A/MCP und Priorisierung.</p>
                                        <small>Checkout folgt nach Pilotabstimmung.</small>
                                    </article>
                                    <article>
                                        <strong>Verfahren</strong>
                                        <span><s>1.499 EUR einmalig</s> Kostenfrei für Pilotpartner</span>
                                        <p>Konkrete Ausschreibung prüfen, Anforderungen strukturieren, Angebotsfahrplan bauen.</p>
                                        <small>Checkout folgt nach Pilotabstimmung.</small>
                                    </article>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {selectedTender && <dialog ref={dialogRef} className="decision-dialog" aria-labelledby="decision-title" onCancel={() => setSelectedTender(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelectedTender(null) }}>
                <div className="decision-dialog__panel">
                    <button type="button" className="decision-dialog__close" aria-label="Entscheidungskarte schließen" onClick={() => setSelectedTender(null)}>×</button>
                    <span className="section__label">Entscheidungskarte</span>
                    <h2 id="decision-title">{selectedTender.title}</h2>
                    <p>{selectedTender.buyer_name || 'Auftraggeber nicht angegeben'}</p>
                    <Entscheidungskarte tender={selectedTender} criteria={merkliste.find((row) => row.id === String(selectedTender.id))?.criteria || criteria} evidence={merkliste.find((row) => row.id === String(selectedTender.id))?.evidence} onEvidenceChange={(type, value) => nachweisSetzen(selectedTender, type, value)} />
                    <div className="decision-dialog__actions">
                        {quellenUrl(selectedTender.source_url) && <a className="btn btn--primary" href={quellenUrl(selectedTender.source_url)} target="_blank" rel="noopener noreferrer">Original & Unterlagen öffnen ↗</a>}
                        <button type="button" className="btn btn--outline" disabled={!aufTafel(selectedTender.id) && merkliste.length >= MERKLISTE_GRENZE} onClick={() => merklisteAufnehmen(selectedTender, { suchbegriff: tenderQuery })}>{aufTafel(selectedTender.id) ? '✓ Auf Ihrer Merkliste' : 'Auf die Merkliste'}</button>
                    </div>
                    {!aufTafel(selectedTender.id) && merkliste.length >= MERKLISTE_GRENZE && <p>Ihre Merkliste ist voll. Entfernen Sie einen Eintrag, um weitere Nachweisstände zu speichern.</p>}
                </div>
            </dialog>}
            <section className="section workflow" id="prozess"><div className="container"><h2>Vom ersten Treffer zur klaren Entscheidung.</h2><div className="workflow__steps"><p><strong>01 · Finden</strong>Leistung und Region wählen. Direkt in den erfassten Quellen suchen.</p><p><strong>02 · Prüfen</strong>Leistungen, Risiken und Nachweise anhand der Originalangaben abgleichen.</p><p><strong>03 · Dranbleiben</strong>Suche speichern, Änderungen prüfen und Ihre Entscheidung festhalten.</p></div></div></section>

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
                        Jetzt <span className="gradient-text">kostenfrei</span> in die Pilotphase
                    </h2>
                    <p className="section__subtitle">
                        Wir suchen aktuell weitere Partner für eine kostenfreie Pilotphase.
                        Die durchgestrichenen Preise sind eine Orientierung für den späteren Regelbetrieb —
                        im Pilot zahlen Sie nichts. Der Online-Checkout wird erst nach erfolgreicher
                        Pilotphase freigeschaltet; Pilot und Vertrag werden persönlich abgestimmt.
                    </p>

                    <div className="pricing-strip">
                        <article>
                            <strong>Pro</strong>
                            <span><s>149 EUR/Monat</s> Kostenfrei in der Pilotphase</span>
                            <p>Suchprofil, Alerts, Volltextsuche und wöchentliche Trefferliste.</p>
                            <a href="#profil" className="btn btn--outline">Pilotzugang anfragen</a>
                        </article>
                        <article>
                            <strong>Agent</strong>
                            <span><s>499 EUR/Monat</s> Kostenfrei in der Pilotphase</span>
                            <p>Höhere API-Limits, Volltextsuche, Agent API, A2A/MCP und Priorisierung.</p>
                            <a href="#profil" className="btn btn--outline">Pilotzugang anfragen</a>
                        </article>
                        <article>
                            <strong>Verfahren</strong>
                            <span><s>1.499 EUR einmalig</s> Kostenfrei für Pilotpartner</span>
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
                                <div className={`glass-card__icon${f.color ? ' glass-card__icon' + f.color : ''}`}><Icon name={f.icon} /></div>
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
                                <span className="branche-card__emoji"><Icon name={b.emoji} size={30} /></span>
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
                            Datenschutz und KI: bewusst europäisch
                        </h3>
                        <p>
                            Wer Vergabeunterlagen, Firmenprofile und Angebotsstrategien in ein Werkzeug legt, gibt
                            mehr preis als eine E-Mail-Adresse. Deshalb gilt bei uns: Die Plattform wird in
                            Deutschland gehostet, und wo KI-Modelle zum Einsatz kommen, laufen sie bei europäischen
                            Anbietern innerhalb der Europäischen Union – aktuell Mistral AI. Ihre Daten verlassen
                            die EU nicht, und es findet keine Verarbeitung bei US-Hyperscalern statt.
                        </p>
                        <p>
                            Das ist nicht nur eine Rechtsfrage nach DSGVO, sondern auch eine Vertrauensfrage:
                            Suchprofile verraten, welche Aufträge ein Unternehmen sucht und welche es ausschließt.
                            Diese Information gehört nicht in fremde Jurisdiktionen.
                        </p>

                        <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                            Vom Treffer zum Team: Merkliste, Notizen und Export
                        </h3>
                        <p>
                            Eine gefundene Ausschreibung ist erst der Anfang. Im Pilot-Dashboard behalten Sie den
                            Überblick: Jeder Treffer zeigt Auftraggeber, Leistungsort, Frist, geschätzten Wert,
                            die einzelnen Match-Gründe und die Originalquelle. Status und interne Notizen machen
                            den Vorgang im Team bearbeitbar – vom ersten Fund bis zur Go/No-Go-Entscheidung.
                        </p>
                        <p>
                            Für Kollegen ohne Zugang, für das Archiv oder für die Übergabe an ein ERP exportieren
                            Sie Treffer als versioniertes JSON, CSV oder XLSX. Ein signierter Webhook ist
                            konfigurierbar; konkrete ERP-Connectoren folgen erst nach Herstellerklärung – auch das
                            kennzeichnen wir bewusst als Ausbau statt als Versprechen.
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
                                <h4><Icon name="mail" size={18} /> E-Mail</h4>
                                <p><a href="mailto:hi@ausschreibungsagenten.de">hi@ausschreibungsagenten.de</a></p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4><Icon name="phone" size={18} /> Telefon</h4>
                                <p><a href="tel:+4930403665430">030 – 403 665 430</a></p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4><Icon name="pin" size={18} /> Standort</h4>
                                <p>Yawusa UG (haftungsbeschränkt)<br />Schliemannstraße 23, 10437 Berlin</p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4><Icon name="zap" size={18} /> Antwortzeit</h4>
                                <p>In der Regel antworten wir innerhalb von 24 Stunden an Werktagen.</p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4><Icon name="target" size={18} /> Für wen?</h4>
                                <p>Handwerk, Bau, IT, Beratung, Facility Management und alle Unternehmen, die öffentliche Aufträge gewinnen möchten.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
