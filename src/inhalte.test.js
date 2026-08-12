import { describe, expect, it } from 'vitest'
import { inhaltsSeiten } from './inhalte'
import { routeByPath } from './routes'

// Haelt die Form aus der Spec fest, damit sie beim Schreiben nicht
// aufweicht: Die Direktantwort ist die Passage, die KI-Antwortflaechen
// zitieren, und der Abgrenzungsblock ist der Grund, aus dem die Seiten
// ueberhaupt glaubwuerdig sind.
const WORTGRENZEN = [40, 60]

describe('Inhaltsseiten', () => {
    it('ist nicht leer', () => {
        expect(inhaltsSeiten.length).toBeGreaterThan(0)
    })

    for (const seite of inhaltsSeiten) {
        describe(seite.path, () => {
            it('steht im Routen-Manifest und wird vorgerendert', () => {
                const route = routeByPath(seite.path)
                expect(route, `Route ${seite.path} fehlt im Manifest`).toBeDefined()
                expect(route.prerender).toBe(true)
                expect(route.index).toBe(true)
            })

            it(`hat eine Direktantwort mit ${WORTGRENZEN[0]} bis ${WORTGRENZEN[1]} Woertern`, () => {
                const woerter = seite.direktantwort.trim().split(/\s+/).length
                expect(woerter).toBeGreaterThanOrEqual(WORTGRENZEN[0])
                expect(woerter).toBeLessThanOrEqual(WORTGRENZEN[1])
            })

            it('hat drei bis fuenf FAQ-Eintraege mit Antwort', () => {
                expect(seite.faq.length).toBeGreaterThanOrEqual(3)
                expect(seite.faq.length).toBeLessThanOrEqual(5)
                for (const eintrag of seite.faq) {
                    expect(eintrag.frage.endsWith('?')).toBe(true)
                    expect(eintrag.antwort.length).toBeGreaterThan(40)
                }
            })

            it('benennt, was das Produkt an dieser Stelle nicht leistet', () => {
                expect(seite.abgrenzung).toBeDefined()
                expect(seite.abgrenzung.absaetze.join(' ').length).toBeGreaterThan(100)
            })

            it('hat einen Faktenblock mit Datenstand', () => {
                expect(seite.fakten.datenstand).toMatch(/\d{4}/)
                expect(seite.fakten.zeilen.length).toBeGreaterThan(1)
            })

            it('verweist auf mindestens zwei andere Seiten', () => {
                expect(seite.querverweise.length).toBeGreaterThanOrEqual(2)
                for (const verweis of seite.querverweise) {
                    expect(routeByPath(verweis.path), `Ziel ${verweis.path} fehlt im Manifest`).toBeDefined()
                }
            })

            it('behauptet keine Faehigkeit, die es nicht gibt', () => {
                const volltext = [
                    seite.direktantwort,
                    ...seite.abschnitte.flatMap((a) => [a.titel, ...a.absaetze, ...(a.liste ?? [])]),
                    ...seite.faq.map((f) => `${f.frage} ${f.antwort}`),
                ]
                    .join(' ')
                    .toLowerCase()

                // Diese Formulierungen waeren Zusagen, die das Produkt nicht
                // einloest. Erlaubt bleiben sie nur im Abgrenzungsblock, wo
                // sie ausdruecklich verneint werden.
                for (const wendung of [
                    'schreibt ihr angebot',
                    'erstellt ihr angebot',
                    'kalkuliert',
                    'preisempfehlung',
                    'reicht das angebot ein',
                ]) {
                    expect(volltext.includes(wendung), `"${wendung}" steht ausserhalb der Abgrenzung`).toBe(false)
                }
            })
        })
    }
})
