import { render } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import Seo from './components/Seo'
import { SsrKontext } from './components/SsrKontext'

// Kopf-Elemente entstehen nur beim Server-Rendern; im Browser gibt die
// Komponente nichts aus, damit die Hydration nicht bricht.
const imServer = (kind) => <SsrKontext.Provider value={true}>{kind}</SsrKontext.Provider>

describe('Seo-Komponente', () => {
    it('setzt Titel und Description aus dem Manifest', () => {
        const markup = renderToString(imServer(<Seo path="/entwickler" />))
        expect(markup).toContain('<title>')
        expect(markup).toContain('API-Dokumentation')
        expect(markup).toContain('A2A Agent Card')
    })

    it('setzt Open-Graph-Angaben mit der kanonischen Adresse', () => {
        const markup = renderToString(imServer(<Seo path="/agb" />))
        expect(markup).toContain('og:title')
        expect(markup).toContain('https://www.ausschreibungsagenten.de/agb')
    })

    it('erlaubt einen abweichenden Titel', () => {
        const markup = renderToString(imServer(<Seo path="/agb" title="Eigener Titel" />))
        expect(markup).toContain('Eigener Titel')
    })

    it('wirft bei unbekanntem Pfad', () => {
        expect(() => renderToString(imServer(<Seo path="/gibt-es-nicht" />))).toThrow(/gibt-es-nicht/)
    })

    // Partner verlinken auf /?via=CODE und /partner?via=CODE. Der Canonical
    // wird aus dem Manifest-Pfad gebaut, nicht aus der Browser-Adresse -
    // sonst entstuenden pro Partner eigene indexierbare Duplikate. Der
    // Test haelt das fest, damit es beim Umbau nicht verlorengeht.
    it('laesst Query-Parameter aus dem Canonical heraus', () => {
        for (const pfad of ['/', '/partner']) {
            const markup = renderToString(imServer(<Seo path={pfad} />))
            const canonical = markup.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
            expect(canonical, `Canonical fehlt fuer ${pfad}`).toBeDefined()
            expect(canonical).not.toContain('?')
            expect(canonical).not.toContain('via=')
        }
    })

    it('aktualisiert Titel, Description und Canonical bei Client-Navigation in document.head', () => {
        document.head.innerHTML =
            '<meta name="description" content="alt" /><link rel="canonical" href="https://www.ausschreibungsagenten.de/" />'
        const { container } = render(<Seo path="/entwickler" />)
        expect(container.innerHTML).toBe('')
        expect(document.title).toContain('API-Dokumentation')
        expect(document.head.querySelector('meta[name="description"]').getAttribute('content')).toContain('A2A Agent Card')
        expect(document.head.querySelector('link[rel="canonical"]').getAttribute('href')).toBe(
            'https://www.ausschreibungsagenten.de/entwickler',
        )
    })

    it('setzt und entfernt meta[name="robots"] bei Wechsel zwischen noindex- und Index-Routen', () => {
        document.head.innerHTML = ''
        const { rerender } = render(<Seo path="/login" />)
        expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe('noindex, follow')
        rerender(<Seo path="/entwickler" />)
        expect(document.head.querySelector('meta[name="robots"]')).toBeNull()
    })
})
