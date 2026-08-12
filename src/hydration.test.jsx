import { StrictMode, act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, describe, expect, it } from 'vitest'
import App from './App'
import { render } from './entry-server'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Regressionsschutz fuer React-Fehler 418. Die Kopf-Elemente entstehen nur
// beim Server-Rendern und werden aus dem Rumpf in den Kopfbereich gehoben.
// Wuerden Seo, StrukturierteDaten oder VideoAbschnitt sie auch im Browser
// ausgeben, erwartet React beim Hydrieren im Rumpf ein Element, das dort
// nicht mehr steht - und verwirft den gesamten vorgerenderten Baum.
//
// Hydration-Beanstandungen laufen ueber onRecoverableError, nicht ueber
// console.error. Genau daran ist eine erste Fassung dieses Tests
// vorbeigelaufen und meldete gruen, obwohl React den Baum verwarf.
async function hydriere(pfad, ausgeliefertesHtml) {
    const { html } = ausgeliefertesHtml ? { html: ausgeliefertesHtml } : await render(pfad)

    window.history.pushState({}, '', pfad)
    const wurzel = document.createElement('div')
    wurzel.id = 'root'
    wurzel.innerHTML = html
    document.body.appendChild(wurzel)

    const beanstandungen = []
    await act(async () => {
        hydrateRoot(
            wurzel,
            <StrictMode>
                <HelmetProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </HelmetProvider>
            </StrictMode>,
            { onRecoverableError: (fehler) => beanstandungen.push(String(fehler?.message ?? fehler)) },
        )
    })

    return { beanstandungen, wurzel }
}

afterEach(() => {
    document.body.innerHTML = ''
    window.history.pushState({}, '', '/')
})

describe('Hydration vorgerenderter Seiten', () => {
    it('hydriert die Startseite ohne Beanstandung', async () => {
        const { beanstandungen } = await hydriere('/')
        expect(beanstandungen).toEqual([])
    })

    it('hydriert eine Rechtsseite ohne Beanstandung', async () => {
        const { beanstandungen } = await hydriere('/agb')
        expect(beanstandungen).toEqual([])
    })

    it('behaelt den vorgerenderten Inhalt nach dem Hydrieren', async () => {
        const { wurzel } = await hydriere('/agb')
        expect(wurzel.textContent).toContain('Allgemeine Geschäftsbedingungen')
    })

    // Warum nicht vorgerenderte Routen ein eigenes leeres Geruest brauchen:
    // Bekaemen sie ueber den Auffang-Rewrite die dist/index.html, stuende
    // dort seit dem Prerendering die vollstaendige Startseite - und der
    // Browser wuerde sie gegen die Login-Seite hydrieren. Dieser Test haelt
    // den Schaden fest; verhindert wird er in scripts/prerender.mjs, geprueft
    // in scripts/check-prerender.mjs.
    it('Startseiten-HTML gegen eine andere Route zu hydrieren geht schief', async () => {
        const { html: startseite } = await render('/')
        const { beanstandungen } = await hydriere('/login', startseite)
        expect(beanstandungen.length).toBeGreaterThan(0)
    })

    it('gibt im Browser keine Kopf-Elemente in den Rumpf', async () => {
        const { wurzel } = await hydriere('/')
        expect(wurzel.querySelector('title')).toBeNull()
        expect(wurzel.querySelector('meta')).toBeNull()
        expect(wurzel.querySelector('link[rel="canonical"]')).toBeNull()
    })
})
