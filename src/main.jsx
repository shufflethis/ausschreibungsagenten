import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'
import './index.css'

const wurzel = document.getElementById('root')

const baum = (
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
)

// Vorgerenderte Routen tragen bereits Markup im Wurzelelement; dort wird
// hydriert statt neu gerendert. Routen ohne Prerendering (Login, Konto,
// Abrechnung) bekommen weiterhin das leere Geruest und werden normal
// gerendert.
if (wurzel.hasChildNodes()) {
    ReactDOM.hydrateRoot(wurzel, baum)
} else {
    ReactDOM.createRoot(wurzel).render(baum)
}
