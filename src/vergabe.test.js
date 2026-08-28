import { describe, expect, it } from 'vitest'
import {
    EU_SCHWELLENWERTE,
    artAusCpv,
    cpvAbteilung,
    fitGruende,
    gruendeBilanz,
    schwellenwertPruefung,
    tageBisFrist,
} from './lib/vergabe'
import { spracheErmitteln, STANDARDSPRACHE } from './lib/sprache'

const JETZT = new Date('2026-08-28T12:00:00.000Z')

const bekanntmachung = (abweichung = {}) => ({
    id: 't-1',
    title: 'Vorhangfassade Holz / Neubau Kombibad Maintal',
    cpv_main: '45223110',
    cpv_additional: ['45432210', '45443000'],
    performance_location: 'Maintal, 63477',
    deadline_at: '2026-09-20T22:00:00.000Z',
    estimated_value_eur: null,
    award_criteria: [{ type: 'price', weight: null, name: 'niedrigster Preis' }],
    framework_agreement: 'none',
    gpa_covered: false,
    lot_count: 1,
    relevance_score: 60,
    ...abweichung,
})

describe('CPV-Abteilung', () => {
    it('loest die fuehrenden zwei Stellen auf', () => {
        expect(cpvAbteilung('45223110').text).toBe('Bauarbeiten')
        expect(cpvAbteilung('71240000').text).toMatch(/Architektur/)
        expect(cpvAbteilung('09310000').text).toMatch(/Strom/)
    })

    it('nennt unbekannte Abteilungen beim Code, statt zu raten', () => {
        expect(cpvAbteilung('03000000').text).toBe('CPV-Abteilung 03')
    })

    it('liefert null, wo keine Abteilung erkennbar ist', () => {
        expect(cpvAbteilung(null)).toBeNull()
        expect(cpvAbteilung('4')).toBeNull()
    })
})

describe('Fristen', () => {
    it('zaehlt volle Tage bis zur Frist', () => {
        expect(tageBisFrist('2026-09-20T22:00:00.000Z', JETZT)).toBe(23)
    })

    it('unterscheidet abgelaufen von nicht genannt', () => {
        expect(tageBisFrist('2026-08-20T12:00:00.000Z', JETZT)).toBe(-8)
        expect(tageBisFrist(null, JETZT)).toBeNull()
        expect(tageBisFrist('kein Datum', JETZT)).toBeNull()
    })
})

describe('EU-Schwellenwerte', () => {
    it('leitet die Auftragsart aus der CPV-Abteilung ab', () => {
        expect(artAusCpv('45223110')).toBe('bauauftrag')
        expect(artAusCpv('79340000')).toBe('oeffentlicher_auftraggeber')
    })

    it('ordnet Werte ober- und unterhalb der Schwelle zu', () => {
        expect(schwellenwertPruefung(6000000, 'bauauftrag').oberhalb).toBe(true)
        expect(schwellenwertPruefung(300000, 'bauauftrag').oberhalb).toBe(false)
        expect(schwellenwertPruefung(300000, 'oeffentlicher_auftraggeber').oberhalb).toBe(true)
    })

    // Ohne Wert ist die Frage nicht beantwortbar. `false` waere eine
    // Aussage, die die Bekanntmachung nicht hergibt.
    it('sagt bei fehlendem Wert weder ja noch nein', () => {
        expect(schwellenwertPruefung(null, 'bauauftrag').oberhalb).toBeNull()
        expect(schwellenwertPruefung(0, 'bauauftrag').oberhalb).toBeNull()
    })

    it('nennt dieselben Zahlen wie die FAQ der Landingpage', () => {
        expect(EU_SCHWELLENWERTE.zentrale_regierungsbehoerde.wert).toBe(140000)
        expect(EU_SCHWELLENWERTE.oeffentlicher_auftraggeber.wert).toBe(216000)
        expect(EU_SCHWELLENWERTE.bauauftrag.wert).toBe(5404000)
    })
})

describe('Fit-Gruende', () => {
    const kennungen = (gruende) => gruende.map((grund) => grund.kennung)
    const grundZu = (gruende, kennung) => gruende.find((grund) => grund.kennung === kennung)

    it('leitet die Gruende aus den Feldern der Bekanntmachung ab', () => {
        const gruende = fitGruende(bekanntmachung(), { suchbegriff: 'fassade', jetzt: JETZT })
        expect(kennungen(gruende)).toEqual(
            expect.arrayContaining(['cpv', 'suchbegriff', 'ort', 'frist', 'wert', 'zuschlag', 'score']),
        )
        expect(grundZu(gruende, 'cpv').text).toMatch(/Bauarbeiten/)
        expect(grundZu(gruende, 'cpv').text).toMatch(/2 weitere CPV-Codes/)
    })

    it('wertet eine knappe Frist als Argument dagegen', () => {
        const knapp = fitGruende(bekanntmachung({ deadline_at: '2026-09-04T12:00:00.000Z' }), { jetzt: JETZT })
        expect(grundZu(knapp, 'frist').bewertung).toBe('minus')
        const abgelaufen = fitGruende(bekanntmachung({ deadline_at: '2026-08-01T12:00:00.000Z' }), { jetzt: JETZT })
        expect(grundZu(abgelaufen, 'frist').text).toMatch(/abgelaufen/)
    })

    it('nennt reinen Preiswettbewerb als Argument dagegen', () => {
        const nurPreis = fitGruende(bekanntmachung(), { jetzt: JETZT })
        expect(grundZu(nurPreis, 'zuschlag').bewertung).toBe('minus')

        const mitQualitaet = fitGruende(
            bekanntmachung({
                award_criteria: [{ type: 'price' }, { type: 'quality', name: 'Konzept' }],
            }),
            { jetzt: JETZT },
        )
        expect(grundZu(mitQualitaet, 'zuschlag').bewertung).toBe('plus')
    })

    it('wertet mehrere Lose als KMU-freundlich', () => {
        const gruende = fitGruende(bekanntmachung({ lot_count: 4 }), { jetzt: JETZT })
        expect(grundZu(gruende, 'lose').bewertung).toBe('plus')
        expect(fitGruende(bekanntmachung({ lot_count: 1 }), { jetzt: JETZT }).find((g) => g.kennung === 'lose')).toBeUndefined()
    })

    it('sagt beim Suchbegriff, ob er im Titel steht oder nicht', () => {
        const drin = fitGruende(bekanntmachung(), { suchbegriff: 'fassade', jetzt: JETZT })
        expect(grundZu(drin, 'suchbegriff').bewertung).toBe('plus')
        const nichtDrin = fitGruende(bekanntmachung(), { suchbegriff: 'webdesign', jetzt: JETZT })
        expect(grundZu(nichtDrin, 'suchbegriff').bewertung).toBe('neutral')
        expect(grundZu(nichtDrin, 'suchbegriff').text).toMatch(/Volltext/)
    })

    it('bleibt bei einer leeren Bekanntmachung stumm statt zu werfen', () => {
        expect(fitGruende(null)).toEqual([])
        expect(fitGruende({})).toEqual(expect.arrayContaining([expect.objectContaining({ kennung: 'frist' })]))
    })

    it('zaehlt die Argumente, ohne eine Empfehlung abzugeben', () => {
        const bilanz = gruendeBilanz(fitGruende(bekanntmachung({ lot_count: 3 }), { suchbegriff: 'fassade', jetzt: JETZT }))
        expect(bilanz.dafuer).toBeGreaterThan(0)
        expect(bilanz.dagegen).toBeGreaterThan(0)
        expect(Object.keys(bilanz)).toEqual(['dafuer', 'dagegen', 'neutral'])
    })
})

describe('Sprachwahl', () => {
    const nav = (languages) => ({ languages })

    it('nimmt die erste Sprache, zu der es etwas anzubieten gibt', () => {
        expect(spracheErmitteln(nav(['de-DE', 'de', 'en']))).toBe('de')
        expect(spracheErmitteln(nav(['en-GB', 'en']))).toBe('en')
        // Franzoesisch vor Deutsch: Franzoesisch kennen wir nicht, Deutsch
        // steht aber in der Liste und gewinnt vor der Vermutung.
        expect(spracheErmitteln(nav(['fr-FR', 'de-DE']))).toBe('de')
    })

    it('raet Englisch, wenn weder Deutsch noch Englisch angeboten wird', () => {
        expect(spracheErmitteln(nav(['fr-FR', 'es-ES']))).toBe('en')
    })

    // scripts/prerender.mjs rendert ohne navigator; dort darf nichts werfen.
    it('faellt ohne navigator auf Deutsch zurueck', () => {
        expect(spracheErmitteln(null)).toBe(STANDARDSPRACHE)
        expect(spracheErmitteln({})).toBe('en')
    })
})

describe('Zweisprachige Gruende', () => {
    const grundZu = (gruende, kennung) => gruende.find((grund) => grund.kennung === kennung)

    it('liefert dieselbe Bewertung in beiden Sprachen', () => {
        const de = fitGruende(bekanntmachung({ lot_count: 3 }), { suchbegriff: 'fassade', jetzt: JETZT, sprache: 'de' })
        const en = fitGruende(bekanntmachung({ lot_count: 3 }), { suchbegriff: 'fassade', jetzt: JETZT, sprache: 'en' })

        expect(en.map((g) => g.kennung)).toEqual(de.map((g) => g.kennung))
        expect(en.map((g) => g.bewertung)).toEqual(de.map((g) => g.bewertung))
        expect(gruendeBilanz(en)).toEqual(gruendeBilanz(de))
    })

    it('uebersetzt Sachbegriffe, nicht nur die Rahmensaetze', () => {
        const en = fitGruende(bekanntmachung({ lot_count: 3 }), { jetzt: JETZT, sprache: 'en' })
        expect(grundZu(en, 'cpv').text).toMatch(/Construction work/)
        expect(grundZu(en, 'wert').text).toMatch(/works contracts/)
        expect(grundZu(en, 'zuschlag').text).toMatch(/lowest price alone/)
        expect(grundZu(en, 'lose').text).toMatch(/3 lots/)
    })

    // „1 further CPV codes" stand kurz auf der Seite.
    it('beugt den Singular richtig', () => {
        const einer = fitGruende(bekanntmachung({ cpv_additional: ['45443000'] }), { jetzt: JETZT, sprache: 'en' })
        expect(grundZu(einer, 'cpv').text).toMatch(/1 further CPV code\b/)
        const mehrere = fitGruende(bekanntmachung(), { jetzt: JETZT, sprache: 'en' })
        expect(grundZu(mehrere, 'cpv').text).toMatch(/2 further CPV codes/)

        const einerDe = fitGruende(bekanntmachung({ cpv_additional: ['45443000'] }), { jetzt: JETZT, sprache: 'de' })
        expect(grundZu(einerDe, 'cpv').text).toMatch(/1 weiterer CPV-Code\b/)
    })

    it('behaelt Deutsch, wenn keine Sprache angegeben ist', () => {
        expect(grundZu(fitGruende(bekanntmachung(), { jetzt: JETZT }), 'cpv').text).toMatch(/Bauarbeiten/)
    })
})
