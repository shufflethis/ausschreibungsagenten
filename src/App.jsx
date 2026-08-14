import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollRestoration from './components/ScrollRestoration'
import LandingPage from './pages/LandingPage'
import Impressum from './pages/Impressum'
import AGB from './pages/AGB'
import Datenschutz from './pages/Datenschutz'
import Disclaimer from './pages/Disclaimer'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Login from './pages/Login'
import CheckEmail from './pages/CheckEmail'
import MagicHandoff from './pages/MagicHandoff'
import AppRedirect from './pages/AppRedirect'
import UeberUns from './pages/UeberUns'
import Entwickler from './pages/Entwickler'
import Status from './pages/Status'
import {
    AusschreibungssucheAutomatisieren,
    KiAngebotAusschreibung,
    SemantischeSucheAusschreibungen,
} from './pages/Inhaltsseiten'
import { routes } from './routes'

// Zuordnung Manifest-Schluessel auf Komponente. Der Test in routes.test.js
// haelt beide Seiten deckungsgleich.
export const pages = {
    LandingPage: <LandingPage />,
    UeberUns: <UeberUns />,
    Entwickler: <Entwickler />,
    Status: <Status />,
    AusschreibungssucheAutomatisieren: <AusschreibungssucheAutomatisieren />,
    KiAngebotAusschreibung: <KiAngebotAusschreibung />,
    SemantischeSucheAusschreibungen: <SemantischeSucheAusschreibungen />,
    Impressum: <Impressum />,
    AGB: <AGB />,
    Datenschutz: <Datenschutz />,
    Disclaimer: <Disclaimer />,
    CheckoutSuccess: <CheckoutSuccess />,
    Login: <Login />,
    CheckEmail: <CheckEmail />,
    MagicHandoffExpired: <MagicHandoff expired />,
    MagicHandoff: <MagicHandoff />,
    KontoRedirect: <AppRedirect path="/app" title="Kundenkonto öffnen" />,
    AbrechnungRedirect: <AppRedirect path="/app/billing" title="Abrechnung öffnen" />,
}

export default function App() {
    return (
        <>
            <ScrollRestoration />
            <Header />
            <main>
                <Routes>
                    {routes.map((route) => (
                        <Route key={route.path} path={route.path} element={pages[route.component]} />
                    ))}
                </Routes>
            </main>
            <Footer />
        </>
    )
}
