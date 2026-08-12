import { describe, expect, it } from 'vitest'
import { render } from './entry-server'

describe('Server-Renderer', () => {
    it('liefert sichtbaren Text fuer die Startseite', async () => {
        const { html } = await render('/')
        expect(html.length).toBeGreaterThan(1000)
        expect(html).toContain('Ausschreibung')
    })

    it('liefert fuer die Ueber-uns-Seite anderen Inhalt als fuer die Startseite', async () => {
        const start = await render('/')
        const ueberUns = await render('/ueber-uns')
        expect(ueberUns.html).not.toEqual(start.html)
        expect(ueberUns.html).toContain('Gorden')
    })

    it('liefert Kopf-Tags mit Titel', async () => {
        const { head } = await render('/ueber-uns')
        expect(head).toContain('<title')
        expect(head).toContain('Über uns')
    })

    it('setzt die kanonische Adresse je Route', async () => {
        const { head } = await render('/entwickler')
        expect(head).toContain('rel="canonical"')
        expect(head).toContain('https://www.ausschreibungsagenten.de/entwickler')
    })

    it('setzt noindex fuer nicht indexierbare Routen', async () => {
        const { head } = await render('/login')
        expect(head).toContain('noindex')
    })

    it('laesst keine Kopf-Tags im Rumpf zurueck', async () => {
        const { html } = await render('/ueber-uns')
        expect(html).not.toMatch(/<title>/)
        expect(html).not.toMatch(/<meta\b/)
        expect(html).not.toMatch(/<link\b/)
    })
})
