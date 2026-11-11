import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Icon from '../components/Icon'
import Entscheidungskarte from '../components/Entscheidungskarte'
import VideoAbschnitt from '../components/VideoAbschnitt'
import { VIDEO_BESCHREIBUNG, VIDEO_TITEL, VIDEO_TRANSKRIPT } from '../data/videoTranskript'
import { eintragAnlegen, MERKLISTE_GRENZE, merklisteLesen, merklisteSchreiben } from '../lib/merkliste'
import { fitGruende, fristText, GEWERKE, gewerkParameter, gruendeBilanz, quellenUrl } from '../lib/vergabe'
import { neuerSuchauftrag, SUCHAUFTRAEGE_LIMIT, suchauftragLesen, suchauftragSchreiben, suchauftragVergleichen, suchkriterien, suchparameter } from '../lib/suchauftraege'
import { spracheErmitteln, STANDARDSPRACHE } from '../lib/sprache'
import { tafelTexte } from '../lib/tafelTexte'
import { FAQS, TENDER_PRESETS } from './landing/daten'
import { useWebmcpWerkzeuge } from './landing/webmcpWerkzeuge'
import { Branchen, Faq, Funktionen, Kontakt, Preise, Prozess, Vergleich, Wissen } from './landing/Abschnitte'

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
    const [formData, setFormData] = useState({ name: '', email: '', company: '', branche: '', message: '', website: '' })
    const [formStatus, setFormStatus] = useState(null)
    const [invalidField, setInvalidField] = useState(null)
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

    // Die Inhaltsseiten verlinken die Suche mit "?gewerk=hochbau#ergebnisse".
    // Erst nach dem Mounten setzen, damit das vorgerenderte HTML passt.
    useEffect(() => {
        const gewerk = new URLSearchParams(window.location.search).get('gewerk')
        if (gewerk && GEWERKE.some((g) => g.value === gewerk)) setTenderVertical(gewerk)
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
                gewerkParameter(params, tenderVertical)
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

    useWebmcpWerkzeuge(zustand, { setProfileData, setSelectedTender, setTenderAnzahl, setTenderLand, setTenderMindestScore, setTenderQuery, setTenderRegion, setTenderVertical, setTendersLoading })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setInvalidField(null)
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
        setInvalidField(null)
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
                <img className="hero-foto" src="/hero/oeffentliche-ausschreibungen-team-recherche.webp" alt="Team bespricht öffentliche Ausschreibungen gemeinsam am Laptop im Büro" fetchPriority="high" />
                <div className="hero-foto__schleier" aria-hidden="true"></div>
                <div className="container">
                    <span className="search-hero__eyebrow">Öffentliche Aufträge. Eine klare Vorauswahl.</span>
                    <h1>Den passenden Auftrag finden.<br /><span className="gradient-text">Die richtige Entscheidung treffen.</span></h1>
                    <p>Leistung und Region eingeben. Treffer mit Originalquelle prüfen. Interessante Verfahren im Blick behalten.</p>
                    <form className="entry-search" id="suche" toolname="search_tenders_form" tooldescription="Set search terms and filters for public tenders; show matching notices on this page." onSubmit={(event) => { event.preventDefault(); document.getElementById('ergebnisse')?.scrollIntoView({ behavior: 'smooth' }) }}>
                        <div className="entry-search__fields">
                            <label htmlFor="tender-query">Welche Leistung bieten Sie an?
                                <input id="tender-query" name="query" type="search" autoComplete="on" placeholder="z. B. Fenster, Fassaden, Marketing …" value={tenderQuery} onChange={(event) => setTenderQuery(event.target.value)} maxLength={160} />
                            </label>
                            <label htmlFor="tender-gewerk">Gewerk
                                <select id="tender-gewerk" name="vertical" autoComplete="on" value={tenderVertical} onChange={(event) => setTenderVertical(event.target.value)}>{GEWERKE.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select>
                            </label>
                            <label htmlFor="tender-region">Leistungsregion
                                <input id="tender-region" name="performance_region" type="text" autoComplete="on" placeholder="Bundesweit oder z. B. Berlin" list="regionen" value={tenderRegion} onChange={(event) => setTenderRegion(event.target.value)} maxLength={160} />
                                <datalist id="regionen">{['Berlin', 'Brandenburg', 'Bayern', 'Baden-Württemberg', 'Hamburg', 'Hessen', 'Nordrhein-Westfalen', 'Sachsen', 'Niedersachsen'].map((region) => <option key={region} value={region} />)}</datalist>
                            </label>
                            <button className="btn btn--primary" type="submit">Aufträge finden <span aria-hidden="true">↓</span></button>
                        </div>
                        <div className="entry-search__bottom">
                            <span>Kostenlos suchen · Ohne Anmeldung</span>
                            <details className="search-options"><summary>Land & Entscheidungskriterien</summary>
                                <div className="search-options__fields">
                                    <label htmlFor="tender-country">Land<select id="tender-country" name="country" autoComplete="on" value={tenderLand} onChange={(event) => setTenderLand(event.target.value)}><option value="DEU">Deutschland</option><option value="AUT">Österreich</option><option value="CHE">Schweiz</option><option value="GBR">Großbritannien</option></select></label>
                                    <label htmlFor="tender-exclusions">Ausschlussbegriffe<input id="tender-exclusions" name="exclusions" type="text" autoComplete="on" placeholder="z. B. Personalüberlassung, Winterdienst" value={exclusions} onChange={(event) => setExclusions(event.target.value)} maxLength={300} /></label>
                                    <label htmlFor="tender-days">Mindestvorlauf in Tagen<input id="tender-days" name="minimum_days" type="number" autoComplete="on" min="0" max="90" value={minimumDays} onChange={(event) => setMinimumDays(Math.min(90, Math.max(0, Number(event.target.value))))} /></label>
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
                            <form className="profile-lead__form" onSubmit={handleProfileSubmit} onInvalid={(e) => setInvalidField((current) => current ?? e.target.id)} onInput={(e) => { if (e.target.id === invalidField) setInvalidField(null) }}>
                                <input className="form-honeypot" type="text" name="website" tabIndex="-1" autoComplete="off" aria-hidden="true" value={profileData.website} onChange={(e) => setProfileData({ ...profileData, website: e.target.value })} />
                                <div className="profile-lead__grid">
                                    <label className="profile-lead__field" htmlFor="profile-company">Unternehmen *
                                        <input id="profile-company" name="company" type="text" autoComplete="organization" aria-invalid={invalidField === 'profile-company'} aria-describedby={invalidField === 'profile-company' ? 'profile-company-error' : undefined} value={profileData.company} onChange={(e) => setProfileData({ ...profileData, company: e.target.value })} required />
                                        {invalidField === 'profile-company' && <span id="profile-company-error" className="field-error">Bitte geben Sie Ihr Unternehmen an.</span>}
                                    </label>
                                    <label className="profile-lead__field" htmlFor="profile-email">Geschäftliche E-Mail *
                                        <input id="profile-email" name="email" type="email" autoComplete="email" aria-invalid={invalidField === 'profile-email'} aria-describedby={invalidField === 'profile-email' ? 'profile-email-hint profile-email-error' : 'profile-email-hint'} value={profileData.email} onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} required />
                                        <span id="profile-email-hint" className="field-hint">An diese Adresse senden wir die Antwort auf Ihre Pilotanfrage.</span>
                                        {invalidField === 'profile-email' && <span id="profile-email-error" className="field-error">Bitte geben Sie eine gültige geschäftliche E-Mail-Adresse an.</span>}
                                    </label>
                                    <label className="profile-lead__field" htmlFor="profile-industry">Branche
                                        <select id="profile-industry" name="industry" autoComplete="off" value={profileData.industry} onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}>
                                            <option value="">Branche wählen</option>
                                            <option value="Handwerk">Handwerk</option>
                                            <option value="Bau">Bau</option>
                                            <option value="IT">IT / Software</option>
                                            <option value="Marketing">Marketing / PR</option>
                                            <option value="Beratung">Beratung</option>
                                            <option value="Facility">Facility Management</option>
                                        </select>
                                    </label>
                                    <label className="profile-lead__field" htmlFor="profile-region">Regionen für Ihr Suchprofil
                                        <input id="profile-region" name="region" type="text" autoComplete="off" placeholder="z. B. NRW, Berlin, DACH" value={profileData.region} onChange={(e) => setProfileData({ ...profileData, region: e.target.value })} />
                                    </label>
                                    <label className="profile-lead__field" htmlFor="profile-budget">Ziel-Auftragsvolumen
                                        <select id="profile-budget" name="budget" autoComplete="off" value={profileData.budget} onChange={(e) => setProfileData({ ...profileData, budget: e.target.value })}>
                                            <option value="">Bitte wählen</option>
                                            <option value="Bis 25.000 EUR">Bis 25.000 EUR</option>
                                            <option value="25.000-100.000 EUR">25.000-100.000 EUR</option>
                                            <option value="100.000-500.000 EUR">100.000-500.000 EUR</option>
                                            <option value="500.000+ EUR">500.000+ EUR</option>
                                        </select>
                                    </label>
                                    <label className="profile-lead__field" htmlFor="profile-frequency">Bisherige Teilnahme
                                        <select id="profile-frequency" name="frequency" autoComplete="off" value={profileData.frequency} onChange={(e) => setProfileData({ ...profileData, frequency: e.target.value })}>
                                            <option value="">Bitte wählen</option>
                                            <option value="Noch nie">Noch nie</option>
                                            <option value="1-3 pro Jahr">1-3 pro Jahr</option>
                                            <option value="Monatlich">Monatlich</option>
                                            <option value="Regelmäßig / Team vorhanden">Regelmäßig / Team vorhanden</option>
                                        </select>
                                    </label>
                                </div>
                                <label className="profile-lead__field" htmlFor="profile-services">Welche Leistungen sollen Agenten für Sie suchen? *
                                    <textarea id="profile-services" name="services" autoComplete="off" aria-invalid={invalidField === 'profile-services'} aria-describedby={invalidField === 'profile-services' ? 'profile-services-error' : undefined} value={profileData.services} onChange={(e) => setProfileData({ ...profileData, services: e.target.value })} required />
                                    {invalidField === 'profile-services' && <span id="profile-services-error" className="field-error">Bitte beschreiben Sie die gesuchten Leistungen.</span>}
                                </label>
                                <button type="submit" className="btn btn--primary" disabled={profileSending}>
                                    {profileSending ? 'Profil wird gesendet...' : 'Agentenprofil anfragen'}
                                </button>
                                {profileStatus === 'success' && (
                                    <p className="form-status form-status--success">
                                        Anfrage angekommen. Ein Zugang wird nach Prüfung ausschließlich per Magic Link freigegeben.
                                    </p>
                                )}
                                {profileStatus === 'error' && (
                                    <p className="form-status form-status--error" role="alert">
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
            <Prozess />

            {/* ===== COMPARISON TABLE ===== */}
            <Vergleich />

            {/* ===== PREISE ===== */}
            <Preise />

            {/* ===== FEATURES ===== */}
            <Funktionen />

            {/* ===== BRANCHEN ===== */}
            <Branchen tenderVertical={tenderVertical} setTenderVertical={setTenderVertical} />

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
                    // Zeitpunkt, an dem die Datei auf die Seite kam (Commit
                    // 7ee648b). Google verlangt Uhrzeit mit Zeitzone; ein
                    // reines Datum meldet die Search Console als ungueltig.
                    hochgeladenAm: '2026-08-12T02:04:05+02:00',
                    // Dieselbe Aufnahme liegt auf dem eigenen Kanal.
                    auchAuf: ['https://www.youtube.com/watch?v=GXD2qj7njVk'],
                }}
            />

            {/* ===== SEO CONTENT BLOCK ===== */}
            <Wissen />

            {/* ===== FAQ ===== */}
            <Faq />

            {/* ===== CONTACT ===== */}
            <Kontakt formData={formData} setFormData={setFormData} invalidField={invalidField} setInvalidField={setInvalidField} formStatus={formStatus} sending={sending} handleSubmit={handleSubmit} />
        </>
    )
}
