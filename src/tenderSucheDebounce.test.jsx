import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import LandingPage from './pages/LandingPage'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Jeder Tastendruck loeste bisher einen eigenen Request auf
// /api/tenders-public aus. Das Backend erzeugt je Aufruf bis zu fuenf neue
// KI-Kurzfassungen; ein getipptes Wort brachte so 30-50 Mistral-Aufrufe und
// lief in dessen Ratelimit (38 x HTTP 429 an einem Abend).
describe('Tender-Suche auf der Landingpage', () => {
    let wurzel
    let behaelter

    beforeEach(() => {
        vi.useFakeTimers()
        behaelter = document.createElement('div')
        document.body.appendChild(behaelter)
        globalThis.fetch = vi.fn(() =>
            Promise.resolve({ ok: true, json: () => Promise.resolve([]) }),
        )
    })

    afterEach(() => {
        act(() => wurzel?.unmount())
        behaelter.remove()
        vi.useRealTimers()
        vi.restoreAllMocks()
    })

    function tenderAufrufe() {
        return globalThis.fetch.mock.calls
            .map(([url]) => String(url))
            .filter((url) => url.includes('/api/tenders-public'))
    }

    async function rendern() {
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
    }

    it('buendelt schnelles Tippen zu einem einzigen Request', async () => {
        await rendern()
        const feld = behaelter.querySelector('input[type="search"], input#tender-suche')
        expect(feld, 'Suchfeld nicht gefunden').toBeTruthy()

        const vorher = tenderAufrufe().length

        // "Gebaeude" Buchstabe fuer Buchstabe, schneller als die Wartezeit.
        for (const zwischenstand of ['G', 'Ge', 'Geb', 'Geba', 'Gebae', 'Gebaeu', 'Gebaeud', 'Gebaeude']) {
            await act(async () => {
                const setter = Object.getOwnPropertyDescriptor(
                    window.HTMLInputElement.prototype, 'value',
                ).set
                setter.call(feld, zwischenstand)
                feld.dispatchEvent(new Event('input', { bubbles: true }))
                vi.advanceTimersByTime(50)
            })
        }

        expect(
            tenderAufrufe().length - vorher,
            'Waehrend des Tippens darf noch kein Request rausgehen',
        ).toBe(0)

        await act(async () => {
            vi.advanceTimersByTime(500)
        })

        const neue = tenderAufrufe().slice(vorher)
        expect(neue.length, 'Nach dem Tippen genau ein Request').toBe(1)
        expect(neue[0]).toContain('search=Gebaeude')
    })

    it('fordert keine KI-Kurzfassungen fuer sehr kurze Suchbegriffe an', async () => {
        await rendern()
        const feld = behaelter.querySelector('input[type="search"], input#tender-suche')
        const vorher = tenderAufrufe().length

        await act(async () => {
            const setter = Object.getOwnPropertyDescriptor(
                window.HTMLInputElement.prototype, 'value',
            ).set
            setter.call(feld, 'Ge')
            feld.dispatchEvent(new Event('input', { bubbles: true }))
            vi.advanceTimersByTime(500)
        })

        const neue = tenderAufrufe().slice(vorher)
        expect(neue.length).toBe(1)
        expect(
            neue[0],
            'Bei zwei Zeichen darf summary_lang nicht mitgehen - sonst erzeugt '
            + 'jeder Zwischenstand beim Tippen neue KI-Kurzfassungen',
        ).not.toContain('summary_lang')
    })

    it('laedt beim Seitenaufruf sofort und mit Kurzfassungen', async () => {
        // Der haeufigste Zustand der Seite: leere Suche. Hier muessen die
        // KI-Kurzfassungen kommen - die Standardliste ist stabil und nach dem
        // ersten Aufruf gecacht, teuer waren nur die Tipp-Zwischenstaende.
        await rendern()

        const sofort = tenderAufrufe()
        expect(sofort.length, 'Erstaufruf darf nicht 350 ms warten').toBe(1)
        expect(sofort[0]).toContain('summary_lang=de')

        await act(async () => {
            vi.advanceTimersByTime(500)
        })
        expect(tenderAufrufe().length, 'kein zweiter Aufruf hinterher').toBe(1)
    })
})
