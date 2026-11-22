import { afterEach, describe, expect, it, vi } from 'vitest'
import { trackEvent } from './lib/tracking'

describe('Plausible-Tracking-Helfer', () => {
    afterEach(() => {
        delete window.plausible
    })

    it('sendet Event mit aktueller Route als Property, wenn plausible geladen ist', () => {
        const plausible = vi.fn()
        window.plausible = plausible
        window.history.pushState({}, '', '/preise')

        trackEvent('Pilot-Anfrage', { branche: 'Bau' })

        expect(plausible).toHaveBeenCalledWith('Pilot-Anfrage', {
            props: { seite: '/preise', branche: 'Bau' },
        })
    })

    it('bleibt ein sicherer No-op, wenn plausible nicht verfuegbar ist', () => {
        expect(() => trackEvent('Pilot-Anfrage')).not.toThrow()
    })
})
