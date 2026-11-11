// WebMCP-Werkzeuge der Startseite. Aus LandingPage.jsx herausgezogen; der
// Ablauf ist unveraendert. Die Werkzeuge lesen den Seitenzustand ueber die
// Referenz `zustand` (LandingPage fuellt sie bei jedem Rendern) und aendern
// ihn nur ueber die uebergebenen Setter.
import { useEffect } from 'react'
import { stelleWerkzeugeBereit, warteAuf, werkzeugAntwort, werkzeugFehler } from '../../lib/webmcp'
import { MERKLISTE_GRENZE } from '../../lib/merkliste'
import { artAusCpv, EU_SCHWELLENWERTE, fitGruende, GEWERKE, gruendeBilanz, schwellenwertPruefung } from '../../lib/vergabe'

export function useWebmcpWerkzeuge(zustand, { setProfileData, setSelectedTender, setTenderAnzahl, setTenderLand, setTenderMindestScore, setTenderQuery, setTenderRegion, setTenderVertical, setTendersLoading }) {
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
                        vertical: { type: 'string', enum: GEWERKE.map((item) => item.value), description: 'Trade filter. Curated verticals (facade_construction, planning, marketing) or construction CPV groups matched on the main CPV prefix (bau = CPV 45, hochbau, tiefbau, dach_spezialbau, haustechnik, ausbau). Empty string clears the trade.' },
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
}
