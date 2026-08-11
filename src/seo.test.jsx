import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import Seo from './components/Seo'

describe('Seo-Komponente', () => {
    it('setzt Titel und Description aus dem Manifest', () => {
        const markup = renderToString(<Seo path="/entwickler" />)
        expect(markup).toContain('<title>')
        expect(markup).toContain('Agent-Anbindung')
        expect(markup).toContain('A2A Agent Card')
    })

    it('setzt Open-Graph-Angaben mit der kanonischen Adresse', () => {
        const markup = renderToString(<Seo path="/agb" />)
        expect(markup).toContain('og:title')
        expect(markup).toContain('https://www.ausschreibungsagenten.de/agb')
    })

    it('erlaubt einen abweichenden Titel', () => {
        const markup = renderToString(<Seo path="/agb" title="Eigener Titel" />)
        expect(markup).toContain('Eigener Titel')
    })

    it('wirft bei unbekanntem Pfad', () => {
        expect(() => renderToString(<Seo path="/gibt-es-nicht" />)).toThrow(/gibt-es-nicht/)
    })
})
