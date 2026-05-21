import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import LandingPage from './pages/LandingPage'
import Impressum from './pages/Impressum'
import AGB from './pages/AGB'
import Datenschutz from './pages/Datenschutz'
import Disclaimer from './pages/Disclaimer'
import CheckoutSuccess from './pages/CheckoutSuccess'

export default function App() {
    return (
        <>
            <Header />
            <main>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/impressum" element={<Impressum />} />
                    <Route path="/agb" element={<AGB />} />
                    <Route path="/datenschutz" element={<Datenschutz />} />
                    <Route path="/disclaimer" element={<Disclaimer />} />
                    <Route path="/checkout-erfolg" element={<CheckoutSuccess />} />
                </Routes>
            </main>
            <Footer />
        </>
    )
}
