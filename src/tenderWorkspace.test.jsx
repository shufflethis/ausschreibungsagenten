import { fireEvent, render, screen, waitFor, within, cleanup } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { afterEach, expect, it, vi } from 'vitest'
import LandingPage from './pages/LandingPage'
import { SUCHAUFTRAEGE_KEY } from './lib/suchauftraege'

afterEach(() => { cleanup(); localStorage.clear(); vi.restoreAllMocks() })

it('beschreibt ein ungültiges Pflichtfeld und entfernt den Fehler nach Eingabe', () => {
    globalThis.fetch = vi.fn(async () => ({ ok: true, json: async () => [] }))
    render(<HelmetProvider><BrowserRouter><LandingPage /></BrowserRouter></HelmetProvider>)
    const company = screen.getByLabelText('Unternehmen *')
    fireEvent.invalid(company)
    expect(company.getAttribute('aria-invalid')).toBe('true')
    expect(company.getAttribute('aria-describedby')).toBe('profile-company-error')
    expect(screen.getByText('Bitte geben Sie Ihr Unternehmen an.')).toBeTruthy()
    fireEvent.change(company, { target: { value: 'Beispiel GmbH' } })
    fireEvent.input(company)
    expect(company.getAttribute('aria-invalid')).toBe('false')
    expect(screen.queryByText('Bitte geben Sie Ihr Unternehmen an.')).toBeNull()
})

it('verbindet Einstieg, Blättern, belegte Nachweise und einen gespeicherten Änderungsvergleich', async () => {
    Element.prototype.scrollIntoView = vi.fn()
    const rows = Array.from({ length: 13 }, (_, i) => ({ id: `notice-${i}`, title: `Fenster Berlin ${i}`, buyer_name: 'Stadt', source: 'ted', source_url: `https://example.org/${i}`, description: 'Fenster und Fassaden sanieren.', requirements: [{ type: 'references', evidence: 'Drei Referenzen nachweisen.' }], deadline_at: '2027-10-10T10:00:00Z', deadline_details: [], document_revision: 'v1' }))
    let changed = false
    let compatible = true
    globalThis.fetch = vi.fn(async (url) => {
        const parsed = new URL(url, 'https://example.org')
        if (parsed.pathname === '/api/source-status') return { ok: true, json: async () => [] }
        if (parsed.pathname === '/api/tender-document-watches') return { ok: true, json: async () => ({ supported_ids: ['notice-0'], enabled: true }) }
        const values = changed ? rows.map((row, i) => i ? row : { ...row, deadline_at: '2027-10-20T10:00:00Z', document_revision: 'v2' }) : rows
        const offset = Number(parsed.searchParams.get('offset') || 0), limit = Number(parsed.searchParams.get('limit') || 25)
        return { ok: true, json: async () => parsed.searchParams.has('ids') ? values.map((row) => compatible ? row : { ...row, deadline_details: undefined }) : values.slice(offset, offset + limit) }
    })
    render(<HelmetProvider><BrowserRouter><LandingPage /></BrowserRouter></HelmetProvider>)
    await screen.findAllByText('Fenster Berlin 0')
    fireEvent.change(screen.getByLabelText('Leistungsregion'), { target: { value: 'Berlin' } })
    fireEvent.change(screen.getByLabelText('Gewerk'), { target: { value: 'facade_construction' } })
    await waitFor(() => expect(globalThis.fetch.mock.calls.some(([url]) => String(url).includes('performance_region=Berlin') && String(url).includes('vertical=facade_construction') && String(url).includes('min_score=0'))).toBe(true))
    fireEvent.click(await screen.findByRole('button', { name: 'Weitere Aufträge laden ↓' }))
    await screen.findByText('Fenster Berlin 12')
    expect(document.querySelectorAll('.opportunity')).toHaveLength(13)
    fireEvent.click(screen.getAllByRole('button', { name: 'Entscheidung prüfen' })[0])
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText('Drei Referenzen nachweisen.')).toBeTruthy()
    fireEvent.change(within(dialog).getByLabelText('Ihr Nachweisstand'), { target: { value: 'missing' } })
    expect(within(dialog).getByText('1 Nachweis fehlt')).toBeTruthy()
    fireEvent.click(within(dialog).getByLabelText('Entscheidungskarte schließen'))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(JSON.parse(localStorage.getItem('aa_merkliste'))[0].evidence.references).toBe('missing')
    fireEvent.click(screen.getByRole('button', { name: 'Suche speichern' }))
    await waitFor(() => expect(JSON.parse(localStorage.getItem(SUCHAUFTRAEGE_KEY))?.[0]?.snapshots).toHaveLength(13))
    await screen.findByText(/Automatische Unterlagenprüfung für 1 von 13 beobachteten Verfahren möglich\. Nicht jedes Portal gibt seine Unterlagen frei/)
    expect(globalThis.fetch.mock.calls.some(([url, options]) => url === '/api/tender-document-watches' && options?.method === 'POST' && JSON.parse(options.body).ids.length === 13)).toBe(true)
    changed = true
    fireEvent.click(screen.getByRole('button', { name: 'Jetzt aktualisieren ↻' }))
    await screen.findByText('Frist geändert')
    expect(screen.getByText('Unterlagen geändert')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Änderungen als gelesen markieren' }))
    expect(screen.queryByText('Frist geändert')).toBeNull()
    // Updates vanish only after acknowledgement, while the comparison baseline persists.
    expect(JSON.parse(localStorage.getItem(SUCHAUFTRAEGE_KEY))[0].snapshots[0].document_revision).toBe('v2')
    compatible = false
    const baseline = localStorage.getItem(SUCHAUFTRAEGE_KEY)
    fireEvent.click(screen.getByRole('button', { name: 'Jetzt aktualisieren ↻' }))
    await screen.findByText(/Der Änderungsvergleich ist derzeit nicht verfügbar/)
    expect(localStorage.getItem(SUCHAUFTRAEGE_KEY)).toBe(baseline)
    expect(screen.queryByText('Keine neuen Änderungen seit dem letzten Vergleich.')).toBeNull()
})
