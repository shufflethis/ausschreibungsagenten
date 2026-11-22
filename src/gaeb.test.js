import { describe, expect, it } from 'vitest'
import { BEISPIEL_GAEB_X83, gaebZuCsv, parseGaebXml } from './lib/gaeb'

describe('GAEB-DA-XML-Parser und CSV-Export', () => {
    it('liest die Beispiel-X83-Datei vollstaendig mit Hierarchie, Mengen und Preisen aus', () => {
        const ergebnis = parseGaebXml(BEISPIEL_GAEB_X83, 'beispiel.x83')
        expect(ergebnis.meta.phase).toBe('X83')
        expect(ergebnis.meta.version).toBe('3.3')
        expect(ergebnis.meta.waehrung).toBe('EUR')
        expect(ergebnis.bereiche).toHaveLength(3)
        expect(ergebnis.positionen).toHaveLength(3)
        expect(ergebnis.positionen[0]).toMatchObject({
            oz: '01.02.0010',
            menge: 340,
            einheit: 'm2',
            einheitspreis: 685,
            gesamtpreis: 232900,
        })
        expect(ergebnis.positionen[2].einheitspreis).toBeNull()
        expect(ergebnis.statistik.positionenMitPreis).toBe(2)
        expect(ergebnis.statistik.gesamtsumme).toBe(277000)
    })

    it('lehnt Nicht-XML-Dateien (z. B. GAEB 90 Text) und defektes XML sauber ab', () => {
        expect(() => parseGaebXml('00010000GAEB90', 'alt.d83')).toThrow(/GAEB DA XML/)
        expect(() => parseGaebXml('<GAEB><kaputt>', 'defekt.x83')).toThrow(/XML/)
        expect(() => parseGaebXml('<AndereDatei />', 'fremd.xml')).toThrow(/<GAEB>/)
    })

    it('erzeugt deutsches Excel-CSV mit BOM und neutralisiert Formel-Injection', () => {
        const csv = gaebZuCsv({
            meta: { waehrung: 'EUR' },
            positionen: [
                {
                    oz: '01.0010',
                    bereich: 'Fassade',
                    kurztext: '=HYPERLINK("http://evil"); Test',
                    menge: 12.5,
                    einheit: 'm2',
                    einheitspreis: 100,
                    gesamtpreis: 1250,
                },
            ],
        })
        expect(csv.startsWith('\uFEFFOZ;Bereich;Kurztext;')).toBe(true)
        expect(csv).toContain(`"'=HYPERLINK(""http://evil""); Test"`)
        expect(csv).toContain(';12,5;m2;100,00;1250,00;EUR')
    })
})
