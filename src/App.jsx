import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
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

export default function App() {
    return (
        <>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/ueber-uns" element={<UeberUns />} />
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/agb" element={<AGB />} />
                    <Route path="/datenschutz" element={<Datenschutz />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/checkout-erfolg" element={<CheckoutSuccess />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/login/postfach" element={<CheckEmail />} />
                    <Route path="/login/abgelaufen" element={<MagicHandoff expired />} />
                    <Route path="/anmeldung-bestaetigen" element={<MagicHandoff />} />
                    <Route path="/konto" element={<AppRedirect path="/app" title="Kundenkonto öffnen" />} />
                    <Route path="/abrechnung" element={<AppRedirect path="/app/billing" title="Abrechnung öffnen" />} />
                </Routes>
            </main>
            <Footer />
        </>
    )
}
