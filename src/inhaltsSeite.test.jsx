import { render, screen, within } from '@testing-library/react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import InhaltsSeite from './components/InhaltsSeite'
import { SsrKontext } from './components/SsrKontext'

const SEITE = {
    path: '/agb',
    h1: 'Wie automatisiere ich die Ausschreibungssuche?',
    direktantwort:
        'Eine automatisierte Ausschreibungssuche fragt alle relevanten Vergabeportale regelmäßig ab und gleicht jede Bekanntmachung mit einem hinterlegten Firmenprofil ab.',
    fakten: {
        datenstand: '12. August 2026',
        kopf: ['Quelle', 'Ebene'],
        zeilen: [
            ['TED', 'EU'],
            ['service.bund.de', 'Bund'],
        ],
    },
    abschnitte: [
        { titel: 'Was dabei passiert', absaetze: ['Erster Absatz.', 'Zweiter Absatz.'] },
    ],
    abgrenzung: {
        titel: 'Was das nicht leistet',
        absaetze: ['Angebotstexte werden nicht geschrieben.'],
    },
    faq: [
        { frage: 'Kostet das etwas?', antwort: 'Der Pro-Tarif kostet 149 Euro im Monat.' },
        { frage: 'Wie oft wird gesucht?', antwort: 'Mehrmals täglich, je nach Quelle.' },
        { frage: 'Welche Portale?', antwort: 'Derzeit 17 Live-Quellen.' },
    ],
    ctaKontext: 'Automatisierte Ausschreibungssuche',
    querverweise: [
        { path: '/ueber-uns', text: 'Wer dahintersteht' },
        { path: '/status', text: 'Quellenstatus ansehen' },
    ],
}

function zeige(seite = SEITE) {
    return render(
        <MemoryRouter>
            <InhaltsSeite seite={seite} />
        </MemoryRouter>,
    )
}

describe('Schablone fuer Inhaltsseiten', () => {
    it('stellt die Direktantwort vor alle anderen Abschnitte', () => {
        const { container } = zeige()
        const text = container.textContent
        expect(text.indexOf('Vergabeportale regelmäßig')).toBeLessThan(text.indexOf('Erster Absatz'))
    })

    it('zeigt Ueberschrift, Faktentabelle mit Datenstand und Abgrenzung', () => {
        zeige()
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Wie automatisiere ich')
        const tabelle = screen.getByRole('table')
        expect(within(tabelle).getByText('service.bund.de')).toBeInTheDocument()
        expect(screen.getByText(/Stand: 12\. August 2026/)).toBeInTheDocument()
        expect(screen.getByText('Angebotstexte werden nicht geschrieben.')).toBeInTheDocument()
    })

    it('rendert jede FAQ-Frage und jeden Querverweis', () => {
        zeige()
        for (const eintrag of SEITE.faq) {
            expect(screen.getByText(eintrag.frage)).toBeInTheDocument()
        }
        expect(screen.getByRole('link', { name: 'Quellenstatus ansehen' })).toHaveAttribute('href', '/status')
    })

    it('fuehrt die Handlungsaufforderung mit Seitenkontext auf das Pilot-Formular', () => {
        zeige()
        const knopf = screen.getByRole('link', { name: /Pilotzugang anfragen/ })
        expect(knopf.getAttribute('href')).toContain('/#kontakt')
        expect(knopf.getAttribute('href')).toContain('thema=')
    })

    it('gibt die FAQ beim Server-Rendern als FAQPage-Schema aus', () => {
        const markup = renderToString(
            <SsrKontext.Provider value={true}>
                <MemoryRouter>
                    <InhaltsSeite seite={SEITE} />
                </MemoryRouter>
            </SsrKontext.Provider>,
        )
        const roh = markup
            .replace(/^[\s\S]*?<script type="application\/ld\+json">/, '')
            .replace(/<\/script>[\s\S]*$/, '')
        const daten = JSON.parse(roh)
        const faq = daten['@graph'].find((k) => k['@type'] === 'FAQPage')
        expect(faq.mainEntity).toHaveLength(3)
        expect(faq.mainEntity[0].name).toBe('Kostet das etwas?')
    })

    it('wirft, wenn die Direktantwort fehlt', () => {
        expect(() => zeige({ ...SEITE, direktantwort: '' })).toThrow(/Direktantwort/)
    })
})
