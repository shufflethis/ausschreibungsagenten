import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { baueIcsKalender, matchFoerderprogramme, sammleFristen } from './data/foerderprogramme'
import FoerderPlaner from './pages/FoerderPlaner'

describe('Auftrags- & Förder-Planer 2027', () => {
    it('matched aktive Landes- und Bundesprogramme fuer Bayern + KI-Hardware', () => {
        const res = matchFoerderprogramme({
            industry: 'it',
            stateCode: 'BY',
            size: 'small',
            goals: ['ausschreibungen', 'ki_hardware'],
            budget: 40000,
            financing: 'equity',
        })
        const ids = res.open.map((p) => p.id)
        expect(ids).toContain('by-digitalbonus')
        expect(ids).toContain('bund-investitionsbooster')
        expect(ids).toContain('bund-forschungszulage')
        expect(res.closed).toHaveLength(0)
    })

    it('weist beendete Programme in Niedersachsen transparent aus', () => {
        const res = matchFoerderprogramme({
            industry: 'bau',
            stateCode: 'NI',
            size: 'small',
            goals: ['ausschreibungen', 'ki_hardware'],
            budget: 25000,
            financing: 'equity',
        })
        expect(res.closed.some((p) => p.id === 'ni-digitalbonus-closed')).toBe(true)
        expect(res.open.some((p) => p.id === 'bund-bafa-beratung')).toBe(true)
    })

    it('erzeugt eine gueltige .ics-Kalenderdatei mit Erinnerungen', () => {
        const res = matchFoerderprogramme({
            industry: 'it',
            stateCode: 'BB',
            size: 'small',
            goals: ['ki_hardware'],
            budget: 50000,
            financing: 'equity',
        })
        const fristen = sammleFristen(res.open, res.watch, [])
        const ics = baueIcsKalender(fristen)
        expect(ics).toContain('BEGIN:VCALENDAR')
        expect(ics).toContain('DTSTART;VALUE=DATE:20270630')
        expect(ics).toContain('TRIGGER:-P14D')
        expect(ics).toContain('END:VCALENDAR')
    })

    it('rendert den 5-Fragen-Planer mit H1 und Schritt 1', () => {
        render(
            <MemoryRouter initialEntries={['/foerder-und-auftrags-planer']}>
                <FoerderPlaner />
            </MemoryRouter>,
        )
        expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Auftrags- & Förder-Planer 2027/)
        expect(screen.getByText(/Frage 1 von 5/)).toBeInTheDocument()
    })
})
