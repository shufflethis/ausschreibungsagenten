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

    it('rendert auf /status schon serverseitig alle 18 Quellen statt einer leeren Ladeanzeige', async () => {
        const { html } = await render('/status')
        expect(html).toContain('Datenservice Öffentlicher Einkauf')
        expect(html).toContain('US SAM.gov Contract Opportunities')
        expect(html).toContain('Metropolregion Rhein-Neckar')
    })

    it('rendert /preise als eigenstaendige Tarifseite mit Limits', async () => {
        const { html, head } = await render('/preise')
        expect(head).toContain('https://www.ausschreibungsagenten.de/preise')
        expect(html).toContain('3.600/h')
        expect(html).toContain('149 €/Monat')
    })

    it('rendert die drei kostenlosen Werkzeuge und die DTAD-Alternative vorgerendert', async () => {
        const gaeb = await render('/gaeb-viewer')
        expect(gaeb.html).toContain('GAEB-Viewer')
        expect(gaeb.head).toContain('"WebApplication"')

        const cpv = await render('/cpv-code-suche')
        expect(cpv.html).toContain('45443000')
        expect(cpv.html).toContain('Fassadenarbeiten')

        const schwellen = await render('/eu-schwellenwerte')
        expect(schwellen.html).toContain('5.404.000')
        expect(schwellen.html).toContain('432.000')

        const dtad = await render('/dtad-alternative')
        expect(dtad.html).toContain('DTAD Alternative')
        expect(dtad.html).toContain('Gorden Wübbe')
    })
})
