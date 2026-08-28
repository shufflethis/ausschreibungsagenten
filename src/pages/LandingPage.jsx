import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import Icon from '../components/Icon'
import VideoAbschnitt from '../components/VideoAbschnitt'
import { VIDEO_BESCHREIBUNG, VIDEO_TITEL, VIDEO_TRANSKRIPT } from '../data/videoTranskript'
import { stelleWerkzeugeBereit, warteAuf, werkzeugAntwort, werkzeugFehler } from '../lib/webmcp'
import { eintragAnlegen, MERKLISTE_GRENZE, merklisteLesen, merklisteSchreiben } from '../lib/merkliste'
import { artAusCpv, EU_SCHWELLENWERTE, fitGruende, gruendeBilanz, schwellenwertPruefung } from '../lib/vergabe'

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
    // Land, Mindest-Score und Trefferzahl haben bewusst kein Bedienelement:
    // sie sind die Stellschrauben, die das WebMCP-Werkzeug `search_tenders`
    // setzt. Fuer Menschen bleibt die Suche ein einziges Eingabefeld.
    const [tenderLand, setTenderLand] = useState('DEU')
    const [tenderMindestScore, setTenderMindestScore] = useState(50)
    const [tenderAnzahl, setTenderAnzahl] = useState(6)
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
                    country: tenderLand,
                    search: tenderQuery,
                    min_score: String(tenderMindestScore),
                    limit: String(tenderAnzahl),
                })
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
    }, [tenderQuery, tenderLand, tenderMindestScore, tenderAnzahl])

    useEffect(() => {
        const controller = new AbortController()
        fetch('/api/source-status', { signal: controller.signal })
            .then((response) => response.ok ? response.json() : [])
            .then((data) => setSourceStatus(Array.isArray(data) ? data : []))
            .catch(() => {})
        return () => controller.abort()
    }, [])

    useEffect(() => {
        const gespeichert = merklisteLesen()
        if (gespeichert.length === 0) return
        setMerkliste(gespeichert.map((eintrag) => ({ ...eintrag, gruende: fitGruende(eintrag.tender, {}) })))
    }, [])

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
        const gruende = fitGruende(tender, { suchbegriff })
        merklisteAendern((bisher) => {
            const vorhanden = bisher.find((eintrag) => eintrag.id === String(tender.id))
            if (vorhanden) {
                return bisher.map((eintrag) =>
                    eintrag.id === vorhanden.id
                        ? { ...eintrag, tender, gruende, notiz: notiz ?? eintrag.notiz }
                        : eintrag,
                )
            }
            if (bisher.length >= MERKLISTE_GRENZE) return bisher
            return [...bisher, { ...eintragAnlegen(tender, { notiz: notiz ?? '' }), gruende }]
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

    // ===== WebMCP =====
    //
    // Werkzeuge fuer Agenten, die *diese geoeffnete Seite* bedienen. Der
    // MCP-Server unter /mcp bleibt davon unberuehrt: dort ruft ein Agent
    // das Backend ohne Browser auf, hier aendert jeder Aufruf sichtbar den
    // Zustand der Seite. Genau das ist der Zweck - der Mensch davor sieht,
    // was der Agent tut, und der Agent muss die Karten nicht aus dem DOM
    // zusammenkratzen.
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
            tenderMindestScore,
            tenderAnzahl,
            sourceStatus,
            merkliste,
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
            return werkzeugAntwort(text, { query: begriff, country: land, count: treffer.length, tenders: treffer })
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
                        min_score: { type: 'number', description: 'Minimum relevance score from 0 to 100' },
                        limit: { type: 'integer', description: 'Number of results to display, 1 to 20' },
                    },
                    required: ['search'],
                    additionalProperties: false,
                },
                execute: async ({ search, country, min_score: minScore, limit } = {}) => {
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

                    const unveraendert =
                        begriff === jetzt.tenderQuery &&
                        land === jetzt.tenderLand &&
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
                    setTenderMindestScore(score)
                    setTenderAnzahl(anzahl)
                    zumAnker('suche')

                    const fertig = await warteAuf(() => {
                        const spaeter = zustand.current
                        return (
                            !spaeter.tendersLoading &&
                            spaeter.tenderQuery === begriff &&
                            spaeter.tenderLand === land &&
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
                    'Put a tender on the shared go/no-go board on this page and compute its fit reasons from the notice fields (CPV division, place of performance, days to deadline, value against the EU threshold, award criteria, lots, framework agreement, GPA coverage). The board is visible to the user, who can override every decision. Reason texts are German because they are rendered on the page.',
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
                    const gruende = fitGruende(tender, { suchbegriff: zustand.current.tenderQuery })
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
                    const pruefung = schwellenwertPruefung(wert, gewaehlt)
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

            {/* ===== HERO ===== */}
            <section className="hero" id="start">
                <img
                    className="hero-foto"
                    src="/hero/oeffentliche-ausschreibungen-team-recherche.webp"
                    alt="Team bespricht öffentliche Ausschreibungen gemeinsam am Laptop im Büro"
                    fetchPriority="high"
                />
                <div className="hero-foto__schleier" aria-hidden="true"></div>
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6', animation: 'pulse 2s ease-in-out infinite' }}></span>
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
                                <span className="hero__stat-value" style={{ color: '#818cf8' }}>0–100</span>
                                <span className="hero__stat-label">Erklärbarer Firmen-Fit</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#38bdf8' }}>
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
                                            {tender.summary?.summary && (
                                                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', margin: '0 0 .5rem' }}>
                                                    {tender.summary.summary}
                                                    <span style={{ display: 'block', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', marginTop: '.25rem' }}>
                                                        {tender.summary.label}
                                                    </span>
                                                </p>
                                            )}
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
                                            <div className="tender-card__aktionen">
                                                <button
                                                    type="button"
                                                    className="source-trigger"
                                                    onClick={() => setSelectedTender(tender)}
                                                >
                                                    Quelle öffnen
                                                </button>
                                                <button
                                                    type="button"
                                                    className="source-trigger"
                                                    onClick={() => merklisteAufnehmen(tender, { suchbegriff: tenderQuery })}
                                                >
                                                    {aufTafel(tender.id) ? 'Auf der Tafel — Gründe aktualisieren' : 'Auf die Go/No-Go-Tafel'}
                                                </button>
                                            </div>
                                        </article>
                                    )
                                })}
                            </div>
                        )}

                        <div className="tafel" id="tafel">
                            <div className="tafel__kopf">
                                <div>
                                    <span className="profile-lead__eyebrow">Go/No-Go</span>
                                    <h3>Gemeinsame Vorauswahl</h3>
                                    <p>
                                        Treffer landen hier per Klick — oder über einen Agenten, der die Werkzeuge
                                        dieser Seite nutzt. Die Gründe stammen aus den Feldern der Bekanntmachung:
                                        CPV, Leistungsort, Frist, Auftragswert gegen den EU-Schwellenwert,
                                        Zuschlagskriterien, Lose. Entschieden wird von Ihnen; die Argumente sind
                                        eine Vorarbeit, keine Empfehlung.
                                    </p>
                                </div>
                                {merkliste.length > 0 && (
                                    <button type="button" className="source-trigger" onClick={merklisteLeeren}>
                                        Tafel leeren
                                    </button>
                                )}
                            </div>

                            {merkliste.length === 0 ? (
                                <div className="tender-state">
                                    Noch nichts auf der Tafel. Legen Sie einen Treffer darauf — oder bitten Sie in
                                    einem Browser mit WebMCP Ihren Agenten darum, etwa: „Suche Fassadenausschreibungen
                                    und leg die drei mit der längsten Frist auf die Tafel."
                                </div>
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
                                                            ? 'Go'
                                                            : eintrag.entscheidung === 'no_go'
                                                                ? 'No-Go'
                                                                : 'offen'}
                                                    </span>
                                                </div>
                                                <h4>{eintrag.tender.title}</h4>
                                                <dl>
                                                    <div>
                                                        <dt>Auftraggeber</dt>
                                                        <dd>{eintrag.tender.buyer_name || 'Nicht angegeben'}</dd>
                                                    </div>
                                                    <div>
                                                        <dt>Frist</dt>
                                                        <dd>{formatDate(eintrag.tender.deadline_at)}</dd>
                                                    </div>
                                                </dl>

                                                {eintrag.gruende.length > 0 && (
                                                    <>
                                                        <p className="tafel-karte__bilanz">
                                                            {bilanz.dafuer} dafür · {bilanz.dagegen} dagegen · {bilanz.neutral} zu prüfen
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

                                                {eintrag.notiz && <p className="tafel-karte__notiz">{eintrag.notiz}</p>}

                                                <div className="tafel-karte__aktionen">
                                                    <button
                                                        type="button"
                                                        className={eintrag.entscheidung === 'go' ? 'is-active' : ''}
                                                        onClick={() => entscheidungSetzen(eintrag.id, eintrag.entscheidung === 'go' ? null : 'go')}
                                                    >
                                                        Go
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className={eintrag.entscheidung === 'no_go' ? 'is-active' : ''}
                                                        onClick={() => entscheidungSetzen(eintrag.id, eintrag.entscheidung === 'no_go' ? null : 'no_go')}
                                                    >
                                                        No-Go
                                                    </button>
                                                    <a href={eintrag.tender.source_url} target="_blank" rel="noopener noreferrer">
                                                        Originalbekanntmachung
                                                    </a>
                                                    <button type="button" onClick={() => merklisteEntfernen(eintrag.id)}>
                                                        Entfernen
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
