import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LandingPage from './pages/LandingPage'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

// WebMCP-Werkzeuge sind nur dann mehr als DOM-Scraping mit Extraschritten,
// wenn ihr Aufruf den sichtbaren Zustand der Seite aendert. Genau das
// pruefen diese Tests - und dass kein Werkzeug ein Formular abschickt.
const TREFFER = [
    {
        id: 't-1',
        title: 'Fassadenarbeiten Rathaus',
        buyer_name: 'Stadt Musterstadt',
        deadline_at: '2026-10-01T00:00:00.000Z',
        estimated_value_eur: 250000,
        relevance_score: 82,
        source: 'ted',
        source_url: 'https://ted.europa.eu/beispiel',
        cpv_main: '45223110',
        cpv_additional: ['45443000'],
        performance_location: 'Maintal, 63477',
        award_criteria: [{ type: 'price', name: 'niedrigster Preis' }],
        framework_agreement: 'none',
        gpa_covered: false,
        lot_count: 3,
    },
    {
        id: 't-2',
        title: 'Fensteraustausch Schulzentrum',
        buyer_name: 'Landkreis Beispiel',
        deadline_at: '2026-09-15T00:00:00.000Z',
        estimated_value_eur: null,
        relevance_score: 71,
        source: 'dtvp',
        source_url: 'https://dtvp.de/beispiel',
        cpv_main: '45421000',
        cpv_additional: [],
        performance_location: 'Leipzig, 04129',
        award_criteria: [{ type: 'price' }, { type: 'quality', name: 'Konzept' }],
        framework_agreement: 'none',
        gpa_covered: false,
        lot_count: 1,
    },
]

const QUELLEN = [{ source: 'ted', status: 'live', stored: 120, last_success_at: '2026-08-27T22:00:00.000Z' }]

describe('WebMCP-Werkzeuge der Landingpage', () => {
    let wurzel
    let behaelter
    let registriert

    const werkzeug = (name) => {
        const treffer = registriert.find((eintrag) => eintrag.name === name)
        expect(treffer, `Werkzeug ${name} nicht angemeldet`).toBeTruthy()
        return treffer
    }

    const tenderAufrufe = () =>
        globalThis.fetch.mock.calls.map(([url]) => String(url)).filter((url) => url.includes('/api/tenders-public'))

    const spracheSetzen = (werte) =>
        Object.defineProperty(navigator, 'languages', { value: werte, configurable: true })

    beforeEach(async () => {
        vi.useFakeTimers()
        localStorage.clear()
        // Die Tafel folgt der Browsersprache. Fuer die Tests wird sie
        // festgelegt, sonst haengt das Ergebnis an der Voreinstellung von
        // jsdom.
        spracheSetzen(['en-US', 'en'])
        registriert = []
        // jsdom kennt scrollIntoView nicht; jeder Browser tut es.
        Element.prototype.scrollIntoView = vi.fn()
        // Nachbau der Spec-API: registerTool liefert ein Promise, und
        // abgemeldet wird ueber das AbortSignal aus den Optionen.
        document.modelContext = {
            registerTool: (eintrag, { signal } = {}) => {
                registriert.push(eintrag)
                signal?.addEventListener('abort', () => {
                    registriert = registriert.filter((vorhanden) => vorhanden !== eintrag)
                })
                return Promise.resolve()
            },
        }
        globalThis.fetch = vi.fn((url) => {
            const antwort = String(url).includes('/api/source-status') ? QUELLEN : TREFFER
            return Promise.resolve({ ok: true, json: () => Promise.resolve(antwort) })
        })

        behaelter = document.createElement('div')
        document.body.appendChild(behaelter)
        await act(async () => {
            wurzel = createRoot(behaelter)
            wurzel.render(
                <HelmetProvider>
                    <BrowserRouter>
                        <LandingPage />
                    </BrowserRouter>
                </HelmetProvider>,
            )
        })
        // Der Erstaufruf der Trefferliste laeuft ohne Entprellung los.
        await act(async () => {
            await vi.advanceTimersByTimeAsync(50)
        })
    })

    afterEach(() => {
        act(() => wurzel?.unmount())
        behaelter.remove()
        delete document.modelContext
        delete Element.prototype.scrollIntoView
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    // Ein Werkzeugaufruf braucht hier mehrere act-Abschnitte. Der erste
    // laesst React die Zustandsaenderung des Werkzeugs uebernehmen, die
    // folgenden treiben Entprellung und Trefferabfrage weiter. Sie einzeln
    // zu takten ist noetig, weil die Werkzeuge den Zustand ueber eine in
    // einem Effekt gepflegte Referenz lesen - und Effekte laufen erst an
    // der act-Grenze. Ein einziger langer Zeitsprung wuerde die Uhr
    // vorstellen, ohne dass die Werkzeuge je das neue Ergebnis saehen. Im
    // Browser gibt es diese Grenze nicht.
    async function aufrufen(name, argumente) {
        let lauf
        let fertig = false
        await act(async () => {
            lauf = Promise.resolve(werkzeug(name).execute(argumente)).then((antwort) => {
                fertig = true
                return antwort
            })
        })
        for (let takt = 0; takt < 15 && !fertig; takt += 1) {
            await act(async () => {
                await vi.advanceTimersByTimeAsync(200)
            })
        }
        return lauf
    }

    it('meldet die Werkzeuge der Seite an', () => {
        expect(registriert.map((eintrag) => eintrag.name)).toEqual([
            'search_tenders',
            'list_visible_tenders',
            'open_tender',
            'source_status',
            'prefill_pilot_profile',
            'shortlist_tender',
            'explain_fit',
            'set_decision',
            'remove_from_shortlist',
            'list_shortlist',
            'check_eu_threshold',
        ])
        for (const eintrag of registriert) {
            expect(typeof eintrag.execute, eintrag.name).toBe('function')
            expect(eintrag.inputSchema.type, eintrag.name).toBe('object')
            expect(eintrag.title, eintrag.name).toBeTruthy()
            // Die Spec begrenzt Namen auf 1-128 Zeichen aus
            // [A-Za-z0-9_.-]; ein Verstoss laesst registerTool ablehnen.
            expect(eintrag.name).toMatch(/^[A-Za-z0-9_.-]{1,128}$/)
        }
        // Bekanntmachungstexte stammen aus 17 fremden Portalen. Werkzeuge,
        // die sie zurueckgeben, markieren das fuer den Agenten.
        for (const name of ['search_tenders', 'list_visible_tenders', 'open_tender', 'shortlist_tender', 'list_shortlist']) {
            const eintrag = registriert.find((vorhanden) => vorhanden.name === name)
            expect(eintrag.annotations.untrustedContentHint, name).toBe(true)
        }
        expect(registriert.find((e) => e.name === 'prefill_pilot_profile').annotations.readOnlyHint).toBe(false)
    })

    it('search_tenders aendert die sichtbare Trefferliste', async () => {
        const vorher = tenderAufrufe().length
        const ergebnis = await aufrufen('search_tenders', { search: 'fassade', country: 'aut', min_score: 70, limit: 2 })

        const letzte = tenderAufrufe().at(-1)
        expect(tenderAufrufe().length).toBeGreaterThan(vorher)
        expect(letzte).toContain('country=AUT')
        expect(letzte).toContain('search=fassade')
        expect(letzte).toContain('min_score=70')
        expect(letzte).toContain('limit=2')

        expect(ergebnis.isError).toBeUndefined()
        expect(ergebnis.structuredContent.count).toBe(2)
        expect(ergebnis.structuredContent.country).toBe('AUT')
        expect(ergebnis.structuredContent.tenders[0].source_url).toBe('https://ted.europa.eu/beispiel')
        // Der Mensch vor dem Bildschirm sieht dasselbe wie der Agent.
        expect(behaelter.querySelector('input[type="search"]').value).toBe('fassade')
        expect(behaelter.textContent).toContain('Fassadenarbeiten Rathaus')
    })

    it('weist einen unbrauchbaren Laendercode zurueck, statt ihn zu raten', async () => {
        const ergebnis = await aufrufen('search_tenders', { search: 'fassade', country: 'Österreich' })
        expect(ergebnis.isError).toBe(true)
        expect(ergebnis.content[0].text).toMatch(/ISO alpha-3/)
        expect(tenderAufrufe().at(-1)).toContain('country=DEU')
    })

    it('open_tender zeigt bei unbekannter id die verfuegbaren ids statt einer Sackgasse', async () => {
        const ergebnis = await aufrufen('open_tender', { id: 'gibt-es-nicht' })
        expect(ergebnis.isError).toBe(true)
        expect(ergebnis.content[0].text).toContain('t-1, t-2')
    })

    it('open_tender oeffnet den Treffer sichtbar auf der Seite', async () => {
        const ergebnis = await aufrufen('open_tender', { id: 't-2' })
        expect(ergebnis.isError).toBeUndefined()
        expect(ergebnis.structuredContent.title).toBe('Fensteraustausch Schulzentrum')
        expect(behaelter.textContent).toContain('Landkreis Beispiel')
    })

    it('source_status meldet die angebundenen Quellen', async () => {
        const ergebnis = await aufrufen('source_status', {})
        expect(ergebnis.isError).toBeUndefined()
        expect(ergebnis.structuredContent.total_stored).toBe(120)
    })

    it('prefill_pilot_profile fuellt aus, schickt aber nichts ab', async () => {
        const ergebnis = await aufrufen('prefill_pilot_profile', {
            company: 'Musterbau GmbH',
            email: 'info@musterbau.de',
            industry: 'Fassadenbau',
        })

        expect(ergebnis.structuredContent.submitted).toBe(false)
        expect(behaelter.querySelector('#profil')?.textContent).toBeTruthy()
        const werte = [...behaelter.querySelectorAll('#profil input')].map((feld) => feld.value)
        expect(werte).toContain('Musterbau GmbH')
        expect(werte).toContain('info@musterbau.de')
        // Die Pilotanfrage loest eine E-Mail an echte Menschen aus.
        expect(globalThis.fetch.mock.calls.some(([url]) => String(url).includes('/api/profile-lead'))).toBe(false)
    })

    it('ruehrt das Honeypot-Feld der Spamabwehr nicht an', async () => {
        await aufrufen('prefill_pilot_profile', { company: 'Musterbau GmbH', website: 'https://spam.example' })
        expect(behaelter.querySelector('#profil input[name="website"]').value).toBe('')
    })

    const tafelKnopf = (beschriftung) =>
        [...behaelter.querySelectorAll('#tafel button')].find((knopf) => knopf.textContent.trim() === beschriftung)

    it('shortlist_tender legt den Treffer sichtbar auf die Tafel', async () => {
        const ergebnis = await aufrufen('shortlist_tender', { id: 't-1', note: 'Bestandskunde' })

        expect(ergebnis.isError).toBeUndefined()
        expect(ergebnis.structuredContent.decision).toBe('open')
        expect(ergebnis.structuredContent.balance.dafuer).toBeGreaterThan(0)

        const tafel = behaelter.querySelector('#tafel')
        expect(tafel.textContent).toContain('Fassadenarbeiten Rathaus')
        expect(tafel.textContent).toContain('Bestandskunde')
        // Die Gruende kommen aus Feldern, die die Trefferkarte nicht zeigt.
        expect(tafel.textContent).toMatch(/Construction work/)
        expect(tafel.textContent).toMatch(/3 lots/)
        expect(tafel.textContent).toMatch(/lowest price alone/)
    })

    // Der eigentliche Punkt der gemeinsamen Tafel: der Agent liest, was
    // der Mensch per Klick entschieden hat - nicht nur das eigene Werk.
    it('list_shortlist meldet die Entscheidung, die der Mensch geklickt hat', async () => {
        await aufrufen('shortlist_tender', { id: 't-1' })

        await act(async () => {
            tafelKnopf('Go').click()
        })

        const ergebnis = await aufrufen('list_shortlist', {})
        expect(ergebnis.structuredContent.count).toBe(1)
        expect(ergebnis.structuredContent.undecided).toBe(0)
        expect(ergebnis.structuredContent.entries[0].decision).toBe('go')
    })

    it('set_decision zeigt die Entscheidung des Menschen auf der Tafel', async () => {
        await aufrufen('shortlist_tender', { id: 't-2' })
        const ergebnis = await aufrufen('set_decision', {
            id: 't-2',
            decision: 'no_go',
            reason: 'Leipzig liegt außerhalb des Einsatzgebiets.',
        })

        expect(ergebnis.isError).toBeUndefined()
        const tafel = behaelter.querySelector('#tafel')
        expect(tafel.textContent).toContain('No-Go')
        expect(tafel.textContent).toContain('außerhalb des Einsatzgebiets')
    })

    it('set_decision verweigert einen Treffer, der nicht auf der Tafel liegt', async () => {
        const ergebnis = await aufrufen('set_decision', { id: 't-1', decision: 'go' })
        expect(ergebnis.isError).toBe(true)
        expect(ergebnis.content[0].text).toMatch(/shortlist_tender/)
    })

    it('explain_fit begruendet, ohne die Tafel anzufassen', async () => {
        const ergebnis = await aufrufen('explain_fit', { id: 't-2' })
        expect(ergebnis.structuredContent.reasons.length).toBeGreaterThan(3)
        expect(ergebnis.content[0].text).toMatch(/not a recommendation/)
        expect((await aufrufen('list_shortlist', {})).structuredContent.count).toBe(0)
    })

    it('remove_from_shortlist nimmt den Treffer wieder herunter', async () => {
        await aufrufen('shortlist_tender', { id: 't-1' })
        const ergebnis = await aufrufen('remove_from_shortlist', { id: 't-1' })
        expect(ergebnis.structuredContent.removed).toBe(true)
        expect(behaelter.querySelector('#tafel').textContent).not.toContain('Fassadenarbeiten Rathaus')
    })

    it('check_eu_threshold rechnet gegen die Bau-Schwelle, wenn der CPV sie hergibt', async () => {
        const ergebnis = await aufrufen('check_eu_threshold', { value_eur: 300000, cpv: '45223110' })
        expect(ergebnis.structuredContent.contract_type).toBe('bauauftrag')
        expect(ergebnis.structuredContent.threshold_eur).toBe(5404000)
        expect(ergebnis.structuredContent.above_threshold).toBe(false)
    })

    it('haelt die Tafel ueber das Neuladen hinweg', async () => {
        await aufrufen('shortlist_tender', { id: 't-1', note: 'Bestandskunde' })
        expect(JSON.parse(localStorage.getItem('aa_merkliste'))).toHaveLength(1)

        act(() => wurzel.unmount())
        behaelter.remove()
        const zweiter = document.createElement('div')
        document.body.appendChild(zweiter)
        await act(async () => {
            wurzel = createRoot(zweiter)
            wurzel.render(
                <HelmetProvider>
                    <BrowserRouter>
                        <LandingPage />
                    </BrowserRouter>
                </HelmetProvider>,
            )
        })
        await act(async () => {
            await vi.advanceTimersByTimeAsync(100)
        })
        behaelter = zweiter

        expect(zweiter.querySelector('#tafel').textContent).toContain('Fassadenarbeiten Rathaus')
        // Die Gruende werden neu berechnet, nicht mitgespeichert: Fristen altern.
        expect(zweiter.querySelector('#tafel').textContent).toMatch(/Construction work/)
    })

    // Die Grenze soll neue Eintraege bremsen, nicht das Aktualisieren eines
    // Treffers, der ohnehin schon liegt - der laesst die Tafel nicht wachsen.
    it('laesst an der Grenze noch aktualisieren, aber nichts Neues zu', async () => {
        const voll = Array.from({ length: 25 }, (_, nummer) => ({
            id: `f-${nummer}`,
            tender: { id: `f-${nummer}`, title: `Altbestand ${nummer}`, source: 'ted', source_url: 'https://example.org' },
            entscheidung: null,
            notiz: '',
        }))
        localStorage.setItem('aa_merkliste', JSON.stringify(voll))

        act(() => wurzel.unmount())
        behaelter.remove()
        const zweiter = document.createElement('div')
        document.body.appendChild(zweiter)
        await act(async () => {
            wurzel = createRoot(zweiter)
            wurzel.render(
                <HelmetProvider>
                    <BrowserRouter>
                        <LandingPage />
                    </BrowserRouter>
                </HelmetProvider>,
            )
        })
        await act(async () => {
            await vi.advanceTimersByTimeAsync(100)
        })
        behaelter = zweiter

        const neuer = await aufrufen('shortlist_tender', { id: 't-1' })
        expect(neuer.isError).toBe(true)
        expect(neuer.content[0].text).toMatch(/maximum of 25/)

        const vorhandener = await aufrufen('shortlist_tender', { id: 'f-0', note: 'Neue Notiz' })
        expect(vorhandener.isError).toBeUndefined()
        expect(behaelter.querySelector('#tafel').textContent).toContain('Neue Notiz')
    })

    // Die Jury der WebMCP Challenge liest englisch, unsere Kundschaft
    // deutsch. Beide muessen dieselbe Tafel lesen koennen - deshalb folgt
    // sie der Browsersprache, und zwar vollstaendig: eine halb uebersetzte
    // Tafel waere schlimmer als eine einsprachige.
    it('zeigt einem deutschen Browser die deutsche Tafel', async () => {
        act(() => wurzel.unmount())
        behaelter.remove()
        spracheSetzen(['de-DE', 'de'])

        const zweiter = document.createElement('div')
        document.body.appendChild(zweiter)
        await act(async () => {
            wurzel = createRoot(zweiter)
            wurzel.render(
                <HelmetProvider>
                    <BrowserRouter>
                        <LandingPage />
                    </BrowserRouter>
                </HelmetProvider>,
            )
        })
        await act(async () => {
            await vi.advanceTimersByTimeAsync(50)
        })
        behaelter = zweiter

        await aufrufen('shortlist_tender', { id: 't-1' })
        const tafel = behaelter.querySelector('#tafel').textContent
        expect(tafel).toContain('Gemeinsame Vorauswahl')
        expect(tafel).toMatch(/Bauarbeiten/)
        expect(tafel).toMatch(/3 Lose/)
        expect(tafel).not.toMatch(/Construction work/)
    })

    it('bleibt ohne unterstuetzenden Browser wirkungslos', async () => {
        act(() => wurzel.unmount())
        behaelter.remove()
        delete document.modelContext
        registriert = ['unberuehrt']

        const zweiter = document.createElement('div')
        document.body.appendChild(zweiter)
        await act(async () => {
            wurzel = createRoot(zweiter)
            wurzel.render(
                <HelmetProvider>
                    <BrowserRouter>
                        <LandingPage />
                    </BrowserRouter>
                </HelmetProvider>,
            )
        })
        await act(async () => {
            await vi.advanceTimersByTimeAsync(500)
        })

        expect(registriert).toEqual(['unberuehrt'])
        expect(zweiter.textContent).toContain('Ausschreibungen')
        act(() => wurzel.unmount())
        wurzel = null
        behaelter = zweiter
    })

    it('meldet die Werkzeuge beim Verlassen der Seite wieder ab', () => {
        act(() => wurzel.unmount())
        wurzel = null
        expect(registriert).toEqual([])
    })
})
