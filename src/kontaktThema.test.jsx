import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import LandingPage from './pages/LandingPage'

// Die Inhaltsseiten verlinken das Formular mit "?thema=...". Ohne
// Auswertung waere der Parameter reine Dekoration - der Nutzer kaeme am
// Formular an und muesste sein Anliegen neu formulieren.
function zeigeStartseite(suche) {
    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => [] }))
    Element.prototype.scrollIntoView = vi.fn()
    window.history.pushState({}, '', suche ? `/?${suche}` : '/')
    return render(
        <MemoryRouter>
            <LandingPage />
        </MemoryRouter>,
    )
}

afterEach(() => {
    cleanup()
    window.history.pushState({}, '', '/')
    vi.restoreAllMocks()
})

describe('Thema und Suchkriterien in den Formularen', () => {
    it('belegt Pilotprofil und Nachrichtenfeld mit dem Thema der Herkunftsseite', () => {
        zeigeStartseite('thema=Automatisierte%20Ausschreibungssuche')
        expect(screen.getByLabelText(/Welche Leistungen sollen Agenten für Sie suchen/).value).toContain(
            'Automatisierte Ausschreibungssuche',
        )
        const feld = screen.getByPlaceholderText(/Beschreiben Sie Ihre aktuelle Situation/)
        expect(feld.value).toContain('Automatisierte Ausschreibungssuche')
    })

    it('laesst das Nachrichtenfeld ohne Thema leer', () => {
        zeigeStartseite()
        expect(screen.getByPlaceholderText(/Beschreiben Sie Ihre aktuelle Situation/).value).toBe('')
    })

    it('uebernimmt gewaehlte Suchfilter mit einem Klick in das Pilotprofil', () => {
        zeigeStartseite()
        fireEvent.change(screen.getByLabelText('Welche Leistung bieten Sie an?'), { target: { value: 'Brandschutzfenster' } })
        fireEvent.change(screen.getByLabelText('Gewerk'), { target: { value: 'facade_construction' } })
        fireEvent.change(screen.getByLabelText('Leistungsregion'), { target: { value: 'Bayern' } })

        fireEvent.click(screen.getByRole('button', { name: /Aktuelle Suche & Merkliste übernehmen/ }))

        const profil = within(document.getElementById('profil'))
        expect(profil.getByLabelText('Branche').value).toBe('Handwerk')
        expect(profil.getByLabelText('Regionen für Ihr Suchprofil').value).toBe('Bayern')
        expect(profil.getByLabelText(/Welche Leistungen sollen Agenten für Sie suchen/).value).toContain(
            'Brandschutzfenster',
        )
    })

    it('zeigt nach Absenden des Pilotprofils eine konkrete 3-Schritte-Bestaetigung statt des leeren Formulars', async () => {
        zeigeStartseite()
        globalThis.fetch = vi.fn(async (url) => {
            if (String(url).includes('/api/profile-lead')) {
                return { ok: true, json: async () => ({ success: true, company: 'Musterbau GmbH', email: 'info@musterbau.de' }) }
            }
            return { ok: true, json: async () => [] }
        })

        const profil = within(document.getElementById('profil'))
        fireEvent.change(profil.getByLabelText(/Unternehmen/), { target: { value: 'Musterbau GmbH' } })
        fireEvent.change(profil.getByLabelText(/Geschäftliche E-Mail/), { target: { value: 'info@musterbau.de' } })
        fireEvent.change(profil.getByLabelText(/Welche Leistungen sollen Agenten für Sie suchen/), {
            target: { value: 'Fensterbau und Pfosten-Riegel-Fassaden' },
        })
        fireEvent.click(profil.getByRole('button', { name: /Kostenfreien Pilotzugang anfragen/ }))

        expect(await profil.findByText(/wir bereiten das Suchprofil für Musterbau GmbH vor/)).toBeInTheDocument()
        expect(profil.getByText('info@musterbau.de')).toBeInTheDocument()
        expect(profil.getByText(/innerhalb von 24 Std\. an Werktagen/)).toBeInTheDocument()
        expect(profil.queryByLabelText(/Unternehmen/)).toBeNull()

        fireEvent.click(profil.getByRole('button', { name: /Weiteres Suchprofil einreichen/ }))
        expect(profil.getByLabelText(/Unternehmen/)).toBeInTheDocument()
    })
})
