import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import UeberUns from './pages/UeberUns'

describe('Über-uns-Seite', () => {
    it('stellt Ausschreibungsagenten und das vollständige Team vor', () => {
        render(
            <MemoryRouter>
                <UeberUns />
            </MemoryRouter>,
        )

        expect(screen.getByRole('heading', { name: /Menschen für Entscheidungen/ })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Gorden Wübbe' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Tobias Sander' })).toBeInTheDocument()
        expect(screen.getByRole('heading', { name: 'Thilo Jansen' })).toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Agentifizierung kennenlernen/ })).toHaveAttribute(
            'href',
            'https://www.agentifizierung.de/',
        )
    })
})
