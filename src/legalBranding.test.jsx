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
    it('verlinkt Agentifizierung und die Über-uns-Seite im Footer', () => {
        renderPage(<Footer />)
        expect(screen.getByRole('link', { name: 'Agentifizierung' })).toHaveAttribute(
            'href',
            'https://www.agentifizierung.de/',
        )
        expect(screen.getByRole('link', { name: 'Über uns' })).toHaveAttribute(
            'href',
            'https://www.agentifizierung.de/ueber-uns',
        )
        expect(screen.getByText(/Agentifizierung UG \(haftungsbeschränkt\) i\.G\./)).toBeInTheDocument()
        expect(screen.queryByText(/track by track|famefact/i)).not.toBeInTheDocument()
    })

    it('nennt alle drei Geschäftsführer und keine erfundenen Registerdaten', () => {
        renderPage(<Impressum />)
        expect(screen.getByText('Tobias Sander, Thilo Jansen und Gorden Wübbe')).toBeInTheDocument()
        expect(screen.getByText(/Handelsregisternummer wird nach erfolgter Eintragung ergänzt/)).toBeInTheDocument()
        expect(screen.queryByText(/HRB 129805 B|DE814954842/)).not.toBeInTheDocument()
    })

    it('führt Agentifizierung konsistent in Datenschutz und AGB', () => {
        const privacy = renderPage(<Datenschutz />)
        expect(privacy.container).toHaveTextContent('Agentifizierung UG (haftungsbeschränkt) i.G.')
        privacy.unmount()
        const terms = renderPage(<AGB />)
        expect(terms.container).toHaveTextContent('Agentifizierung UG (haftungsbeschränkt) i.G.')
    })
})
