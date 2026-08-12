import { describe, expect, it } from 'vitest'
import { routes } from './routes'
import { pages } from './App'

describe('Routen-Manifest', () => {
    it('hat zu jedem Eintrag eine Komponente', () => {
        for (const route of routes) {
            expect(pages[route.component], `Komponente fehlt fuer ${route.path}`).toBeDefined()
        }
    })

    it('nutzt jede Komponente aus der Zuordnung', () => {
        const benutzt = new Set(routes.map((r) => r.component))
        for (const name of Object.keys(pages)) {
            expect(benutzt.has(name), `Komponente ${name} ist in keiner Route`).toBe(true)
        }
    })

    it('gibt jeder vorgerenderten Route eigenen Title und eigene Description', () => {
        const vorgerendert = routes.filter((r) => r.prerender)
        expect(vorgerendert.length).toBeGreaterThan(1)
        const titel = vorgerendert.map((r) => r.title)
        expect(new Set(titel).size, 'Titles sind nicht eindeutig').toBe(titel.length)
        for (const route of vorgerendert) {
            expect(route.description.length).toBeGreaterThan(50)
        }
    })

    it('rendert keine Konto- oder Login-Route vor und indexiert sie nicht', () => {
        const geschuetzt = [
            '/login',
            '/login/postfach',
            '/login/abgelaufen',
            '/anmeldung-bestaetigen',
            '/konto',
            '/abrechnung',
            '/checkout-erfolg',
        ]
        for (const pfad of geschuetzt) {
            const route = routes.find((r) => r.path === pfad)
            expect(route, `Route ${pfad} fehlt im Manifest`).toBeDefined()
            expect(route.prerender).toBe(false)
            expect(route.index).toBe(false)
        }
    })
})
