import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { pages } from './seitenLazy'
import './index.css'

const wurzel = document.getElementById('root')

const baum = (
    <React.StrictMode>
        <BrowserRouter>
            <App seiten={pages} />
        </BrowserRouter>
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
