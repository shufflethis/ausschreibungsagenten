import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import LandingPage from './pages/LandingPage'

// Die Inhaltsseiten verlinken das Formular mit "?thema=...". Ohne
// Auswertung waere der Parameter reine Dekoration - der Nutzer kaeme am
// Formular an und muesste sein Anliegen neu formulieren.
function zeigeStartseite(suche) {
    window.history.pushState({}, '', suche ? `/?${suche}` : '/')
    return render(
        <MemoryRouter>
            <LandingPage />
        </MemoryRouter>,
    )
}

afterEach(() => {
    window.history.pushState({}, '', '/')
})

describe('Thema aus der Adresse im Kontaktformular', () => {
    it('belegt das Nachrichtenfeld mit dem Thema der Herkunftsseite', () => {
        zeigeStartseite('thema=Automatisierte%20Ausschreibungssuche')
        const feld = screen.getByPlaceholderText(/Beschreiben Sie Ihre aktuelle Situation/)
        expect(feld.value).toContain('Automatisierte Ausschreibungssuche')
    })

    it('laesst das Nachrichtenfeld ohne Thema leer', () => {
        zeigeStartseite()
        expect(screen.getByPlaceholderText(/Beschreiben Sie Ihre aktuelle Situation/).value).toBe('')
    })
})
