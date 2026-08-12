import { render, screen } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import Footer from './components/Footer'
import AGB from './pages/AGB'
import Datenschutz from './pages/Datenschutz'
import Impressum from './pages/Impressum'

function renderPage(node) {
    return render(
        <HelmetProvider>
            <MemoryRouter>{node}</MemoryRouter>
        </HelmetProvider>,
    )
}

describe('Betreiberangaben', () => {
    it('verlinkt Agentifizierung und die eigene Über-uns-Seite im Footer', () => {
        renderPage(<Footer />)
        expect(screen.getByRole('link', { name: 'Agentifizierung' })).toHaveAttribute(
            'href',
            'https://www.agentifizierung.de/',
        )
        expect(screen.getByRole('link', { name: 'Über uns' })).toHaveAttribute(
            'href',
            '/ueber-uns',
        )
        expect(screen.getByText(/Yawusa UG \(haftungsbeschränkt\)/)).toBeInTheDocument()
        expect(screen.queryByText(/track by track|famefact/i)).not.toBeInTheDocument()
    })

    it('nennt alle drei Geschäftsführer und die echten Registerdaten', () => {
        renderPage(<Impressum />)
        expect(screen.getByText('Tobias Sander, Thilo Jansen und Gorden Wübbe')).toBeInTheDocument()
        expect(screen.getByText(/HRB 290407 B/)).toBeInTheDocument()
        expect(screen.getByText(/Amtsgericht Charlottenburg/)).toBeInTheDocument()
        // Eingetragen ist eingetragen: der Gruendungszusatz darf nirgends mehr auftauchen.
        expect(screen.queryByText(/i\.G\./)).not.toBeInTheDocument()
        expect(screen.queryByText(/HRB 129805 B|DE814954842/)).not.toBeInTheDocument()
    })

    it('führt Agentifizierung konsistent in Datenschutz und AGB', () => {
        const privacy = renderPage(<Datenschutz />)
        expect(privacy.container).toHaveTextContent('Yawusa UG (haftungsbeschränkt)')
        privacy.unmount()
        const terms = renderPage(<AGB />)
        expect(terms.container).toHaveTextContent('Yawusa UG (haftungsbeschränkt)')
    })
})
