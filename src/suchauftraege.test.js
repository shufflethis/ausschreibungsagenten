import { describe, expect, it } from 'vitest'
import { neuerSuchauftrag, suchauftragLesen, suchauftragSchreiben, suchauftragVergleichen, suchparameter } from './lib/suchauftraege'
import { entscheidungshilfe, fristText } from './lib/vergabe'

const tender = { id: 'a', title: 'Fassadenbau mit Gerüst', buyer_name: 'Stadt Berlin', source_url: 'https://example.org/a', deadline_at: '2026-10-13T08:00:00Z', document_revision: 'v1' }

describe('Gespeicherte Suchen und belegte Entscheidungen', () => {
    it('meldet neue Treffer sowie echte Frist- und Dokumentänderungen genau einmal', () => {
        const saved = neuerSuchauftrag({ search: 'Fassade', region: 'Berlin' }, [tender])
        const changed = { ...tender, id: 'syndicated-copy', deadline_at: '2026-10-20T08:00:00Z', document_revision: 'v2' }
        const next = { ...tender, id: 'b', title: 'Neue Fassade Schule' }
        const checked = suchauftragVergleichen(saved, [next], [changed])
        expect(checked.updates.map((u) => u.kind).sort()).toEqual(['deadline', 'documents', 'new'])
        expect(checked.updates.find((u) => u.kind === 'deadline').previous).toBe(tender.deadline_at)
        expect(suchauftragVergleichen(checked, [next], [changed]).updates).toEqual(checked.updates)
        expect(suchauftragVergleichen({ ...checked, updates: [] }, [next], [changed]).updates).toEqual([])
        const removed = suchauftragVergleichen(saved, [{ ...tender, document_revision: null }])
        expect(removed.updates.find((u) => u.kind === 'documents').label).toBe('Unterlagen nicht mehr erfasst')
        // A timezone representation change and polling timestamps are no news.
        expect(suchauftragVergleichen(saved, [{ ...tender, deadline_at: '2026-10-13T10:00:00+02:00', updated_at: 'tomorrow' }]).updates).toEqual([])
    })

    it('meldet die Rückkehr zu einer früheren Unterlagenversion als eigene Änderung', () => {
        const saved = neuerSuchauftrag({ search: 'Fassade' }, [{ ...tender, document_revision: null }])
        const first = suchauftragVergleichen(saved, [], [tender])
        const changed = suchauftragVergleichen(first, [], [{ ...tender, document_revision: 'v2' }])
        const reverted = suchauftragVergleichen(changed, [], [tender])
        expect(reverted.updates.map((u) => [u.label, u.previous, u.value])).toEqual([
            ['Unterlagen geändert', 'v2', 'v1'], ['Unterlagen geändert', 'v1', 'v2'], ['Unterlagen erstmals erfasst', null, 'v1']])
        expect(suchauftragVergleichen(reverted, [], [tender]).updates).toEqual(reverted.updates)
    })

    it('hält alte Vergleichswerte bei fehlenden IDs und gesperrtem Speicher fest', () => {
        const saved = neuerSuchauftrag({}, [tender])
        expect(suchauftragVergleichen(saved, [], []).snapshots).toEqual(saved.snapshots)
        const blocked = { getItem() { throw new Error('blocked') }, setItem() { throw new Error('blocked') } }
        expect(suchauftragLesen(blocked)).toEqual([])
        expect(suchauftragSchreiben([saved], blocked)).toBe(false)
        const storage = { getItem: () => JSON.stringify([{ ...saved, checkedAt: 'bad', updates: [null, { kind: 'new' }], snapshots: [null, tender] }]) }
        const restored = suchauftragLesen(storage)[0]
        expect(restored.updates).toEqual([])
        expect(restored.checkedAt).toBeNull()
        expect(restored.snapshots).toHaveLength(1)
    })

    it('behält frische ID-Abrufe bei veralteten Suchtreffern und umbenannten Verfahren', () => {
        const saved = neuerSuchauftrag({}, [tender])
        const fresh = { ...tender, title: 'Fassadenbau Schule – geänderte Bekanntmachung', deadline_at: '2026-10-20T08:00:00Z', document_revision: 'v2' }
        const checked = suchauftragVergleichen(saved, [tender], [fresh])
        expect(checked.updates.map((u) => u.kind).sort()).toEqual(['deadline', 'documents'])
        expect(checked.snapshots).toHaveLength(1)
        expect(checked.snapshots[0]).toMatchObject(fresh)
        const repeated = suchauftragVergleichen({ ...checked, updates: [] }, [tender], [fresh])
        expect(repeated.updates).toEqual([])
        expect(repeated.snapshots).toEqual(checked.snapshots)
    })

    it('sucht ohne versteckte Score-Hürde und erhält Region, Gewerk und eindeutigen Offset', () => {
        const params = suchparameter({ search: 'Balkon', region: 'Berlin', vertical: 'facade_construction' }, { offset: 25 })
        expect(Object.fromEntries(params)).toMatchObject({ min_score: '0', country: 'DEU', performance_region: 'Berlin', vertical: 'facade_construction', offset: '25', limit: '25' })
    })

    it('nennt nur belegte Passung und Nachweise; ein Index-Score beweist keine Eignung', () => {
        const karte = entscheidungshilfe({ ...tender, description: 'Fenster erneuern', relevance_score: 100, requirements: [{ type: 'references', evidence: 'Drei vergleichbare Referenzen erforderlich.' }, { type: 'insurance', evidence: '' }] }, { search: 'Fassade', exclusions: 'Gerüst', minimumDays: 30 }, new Date('2026-10-01'))
        expect(karte.passend).toHaveLength(1)
        expect(karte.ausschluss).toHaveLength(2)
        expect(karte.ausschluss[0].beleg).toBe(tender.title)
        expect(karte.nachweise.map((r) => r.type)).toEqual(['references'])
        expect(entscheidungshilfe({ title: 'Test', relevance_score: 100 }).passend).toEqual([])
        expect(entscheidungshilfe({ title: 'Test' }).offen.map((r) => r.feld)).toContain('Frist')
    })

    it('zeigt die genaue Angebotsfrist und verkauft ein bloßes Datum nicht als Uhrzeit', () => {
        expect(fristText({ ...tender, deadline_details: [{ kind: 'submission', at: tender.deadline_at, precision: 'datetime' }] })).toBe('Angebot: 13.10.2026, 10:00 Uhr (Berlin)')
        expect(fristText(tender)).toContain('Uhrzeit prüfen')
        expect(fristText({})).toBe('Frist noch ungeklärt')
    })
})
