import { render, screen, waitFor } from '@testing-library/react'
import { HelmetProvider } from 'react-helmet-async'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import AppRedirect from './pages/AppRedirect'
import CheckEmail from './pages/CheckEmail'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Login from './pages/Login'
import MagicHandoff from './pages/MagicHandoff'

function renderPage(node) {
    return render(
        <HelmetProvider>
            <MemoryRouter>{node}</MemoryRouter>
        </HelmetProvider>,
    )
}

describe('Kundenzugang', () => {
    it('sendet den Login direkt an die eindeutige App-Origin und antwortet neutral', () => {
        const { container } = renderPage(<Login />)
        expect(screen.getByRole('heading', { name: /Mit Magic Link anmelden/i })).toBeInTheDocument()
        const form = container.querySelector('form')
        expect(form).toHaveAttribute('method', 'post')
        expect(form).toHaveAttribute('action', 'https://app.ausschreibungsagenten.de/login')
        expect(screen.getByText(/Antwort immer gleich/i)).toBeInTheDocument()
    })

    it('zeigt die neutrale Postfach-Seite', () => {
        renderPage(<CheckEmail />)
        expect(screen.getByRole('heading', { name: /Postfach prüfen/i })).toBeInTheDocument()
        expect(screen.getByText(/Falls ein aktiver Zugang besteht/i)).toBeInTheDocument()
    })

    it('reicht den Magic-Link-Fragmenttoken nur an die App-Bestätigung weiter', async () => {
        window.history.replaceState({}, '', '/anmeldung-bestaetigen#token=test-token&next=%2Fapp')
        const redirect = vi.fn()
        renderPage(<MagicHandoff onRedirect={redirect} />)
        await waitFor(() => {
            expect(redirect).toHaveBeenCalledWith(
                'https://app.ausschreibungsagenten.de/auth/magic#token=test-token&next=%2Fapp',
            )
        })
        expect(screen.getByText(/ausdrücklichen Klick verbraucht/i)).toBeInTheDocument()
    })

    it('leitet geschützte Konto- und Abrechnungsrouten zur App weiter', async () => {
        const accountRedirect = vi.fn()
        const { unmount } = renderPage(
            <AppRedirect path="/app" title="Kundenkonto öffnen" onRedirect={accountRedirect} />,
        )
        await waitFor(() => {
            expect(accountRedirect).toHaveBeenCalledWith('https://app.ausschreibungsagenten.de/app')
        })
        unmount()
        const billingRedirect = vi.fn()
        renderPage(
            <AppRedirect
                path="/app/billing"
                title="Abrechnung öffnen"
                onRedirect={billingRedirect}
            />,
        )
        await waitFor(() => {
            expect(billingRedirect).toHaveBeenCalledWith(
                'https://app.ausschreibungsagenten.de/app/billing',
            )
        })
    })

    it('behauptet nach dem Success-Redirect keine vorzeitige Aktivierung', () => {
        renderPage(<CheckoutSuccess />)
        expect(screen.getByText(/erst freigeschaltet, nachdem/i)).toBeInTheDocument()
        expect(screen.queryByText(/ist aktiviert/i)).not.toBeInTheDocument()
        expect(screen.getByRole('link', { name: /Abostatus prüfen/i })).toHaveAttribute(
            'href',
            '/abrechnung',
        )
    })
})
