import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import PartnerHinweis from './components/PartnerHinweis'
import { EINWILLIGUNG_SCHLUESSEL, PARTNER_COOKIE } from './lib/partnerCode'

// Die entscheidende Eigenschaft dieser Komponente ist, wann sie
// schweigt. Ohne Partnerlink bleibt die Seite cookiefrei, wie sie es
// heute ist - ein seitenweites Banner waere fuer ein einziges Cookie
// unverhaeltnismaessig.
function zeige(suche) {
    return render(
        <MemoryRouter initialEntries={[suche ? `/?${suche}` : '/']}>
            <PartnerHinweis />
        </MemoryRouter>,
    )
}

function cookiesLeeren() {
    for (const teil of document.cookie.split(';')) {
        const name = teil.split('=')[0].trim()
        if (name) document.cookie = `${name}=; Max-Age=0; Path=/`
    }
}

beforeEach(() => {
    cookiesLeeren()
    localStorage.clear()
})

afterEach(() => {
    cookiesLeeren()
    localStorage.clear()
})

const hinweis = () => screen.queryByRole('dialog')

describe('Partner-Hinweis', () => {
    it('bleibt ohne Partnerlink unsichtbar und setzt kein Cookie', () => {
        zeige()

        expect(hinweis()).toBeNull()
        expect(document.cookie).toBe('')
    })

    it('erscheint bei gueltigem Partnerlink, bevor irgendetwas gespeichert wird', () => {
        zeige('via=TESTPARTNER1')

        expect(hinweis()).not.toBeNull()
        expect(document.cookie).not.toContain(PARTNER_COOKIE)
    })

    it('ignoriert einen ungueltigen Code', () => {
        zeige('via=hat%20leerzeichen')

        expect(hinweis()).toBeNull()
        expect(document.cookie).toBe('')
    })

    it('setzt das Cookie erst nach Zustimmung', () => {
        zeige('via=TESTPARTNER1')

        fireEvent.click(screen.getByRole('button', { name: /Einverstanden/ }))

        expect(document.cookie).toContain(`${PARTNER_COOKIE}=TESTPARTNER1`)
        expect(localStorage.getItem(EINWILLIGUNG_SCHLUESSEL)).toBe('ja')
        expect(hinweis()).toBeNull()
    })

    it('setzt bei Ablehnung kein Cookie und merkt sich die Ablehnung', () => {
        zeige('via=TESTPARTNER1')

        fireEvent.click(screen.getByRole('button', { name: /Nicht speichern/ }))

        expect(document.cookie).not.toContain(PARTNER_COOKIE)
        expect(localStorage.getItem(EINWILLIGUNG_SCHLUESSEL)).toBe('nein')
        expect(hinweis()).toBeNull()
    })

    it('fragt nach einer Ablehnung nicht erneut', () => {
        localStorage.setItem(EINWILLIGUNG_SCHLUESSEL, 'nein')

        zeige('via=TESTPARTNER1')

        expect(hinweis()).toBeNull()
        expect(document.cookie).not.toContain(PARTNER_COOKIE)
    })

    // Wer einmal zugestimmt hat, soll beim naechsten Partnerlink nicht
    // wieder gefragt werden - die Einwilligung gilt fuer den Zweck, nicht
    // fuer den einzelnen Code.
    it('uebernimmt den Code stillschweigend, wenn bereits zugestimmt wurde', () => {
        localStorage.setItem(EINWILLIGUNG_SCHLUESSEL, 'ja')

        zeige('via=TESTPARTNER1')

        expect(hinweis()).toBeNull()
        expect(document.cookie).toContain(`${PARTNER_COOKIE}=TESTPARTNER1`)
    })

    it('haelt an First-Touch fest, wenn schon ein Code gespeichert ist', () => {
        document.cookie = `${PARTNER_COOKIE}=ERSTER; Path=/`
        localStorage.setItem(EINWILLIGUNG_SCHLUESSEL, 'ja')

        zeige('via=ZWEITER')

        expect(hinweis()).toBeNull()
        expect(document.cookie).toContain(`${PARTNER_COOKIE}=ERSTER`)
        expect(document.cookie).not.toContain('ZWEITER')
    })
})
