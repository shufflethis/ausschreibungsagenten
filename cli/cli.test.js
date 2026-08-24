import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { ApiFehler, basis } from './api.js'
import { laenderZeilen, quellenZeilen, tenderZeilen } from './ausgabe.js'
import { fuehreAus } from './index.js'

// Sammelt beide Kanaele getrennt: Agenten pipen stdout weiter, deshalb
// darf dort nie eine Hilfe oder Fehlermeldung landen.
function lauf(argv) {
    const aus = []
    const fehler = []
    return fuehreAus(argv, (z) => aus.push(String(z)), (z) => fehler.push(String(z)))
        .then((code) => ({ code, aus: aus.join('\n'), fehler: fehler.join('\n') }))
}

const VERSION_ERWARTET = '0.1.2'

describe('CLI', () => {
    it('nennt Version und Hilfe auf stdout', async () => {
        expect((await lauf(['--version'])).aus).toBe(VERSION_ERWARTET)
        const hilfe = await lauf(['--help'])
        expect(hilfe.code).toBe(0)
        expect(hilfe.aus).toContain('ausschreibungsagenten suche')
    })

    it('haelt stdout frei, wenn der Aufruf unvollstaendig ist', async () => {
        const ohne = await lauf([])
        expect(ohne.code).toBe(2)
        expect(ohne.aus).toBe('')
        expect(ohne.fehler).toContain('ausschreibungsagenten suche')

        const ohneBegriff = await lauf(['suche'])
        expect(ohneBegriff.code).toBe(2)
        expect(ohneBegriff.aus).toBe('')
    })

    it('unterscheidet unbekannten Befehl von API-Fehler', async () => {
        expect((await lauf(['quatsch'])).code).toBe(2)
    })

    it('startet ueber den bin-Einstiegspunkt, nicht ueber eine Namenspruefung', async () => {
        // npm legt fuer bin einen Symlink an; jede Pruefung auf den
        // Dateinamen scheitert dort. Die erste Fassung tat genau das und
        // lieferte ueber npx wortlos Exit 0.
        const bin = await readFile(resolve(process.cwd(), 'cli/bin.js'), 'utf8')
        expect(bin).toContain('fuehreAus(process.argv.slice(2))')
        const paket = JSON.parse(await readFile(resolve(process.cwd(), 'cli/package.json'), 'utf8'))
        expect(paket.bin.ausschreibungsagenten).toBe('bin.js')
        expect(paket.files).toContain('bin.js')
        expect(paket.version).toBe(VERSION_ERWARTET)
        const modul = await readFile(resolve(process.cwd(), 'cli/index.js'), 'utf8')
        expect(modul).not.toContain('import.meta.url.endsWith')
    })

    it('nimmt die Basis-Adresse aus der Umgebung', () => {
        expect(basis()).toBe('https://www.ausschreibungsagenten.de')
    })

    it('schickt den Key als Bearer, nicht als X-API-Key', async () => {
        // Die API ignoriert X-API-Key stillschweigend: die Anfrage laeuft
        // dann im anonymen Limit, ohne dass jemand einen Fehler sieht.
        const quelle = await readFile(resolve(process.cwd(), 'cli/api.js'), 'utf8')
        expect(quelle).toContain('kopf.Authorization = `Bearer ${')
        expect(quelle).not.toContain("kopf['X-API-Key']")
    })

    it('gibt code, message und resolution der API weiter', () => {
        const fehler = new ApiFehler(404, {
            code: 'route_not_found',
            message: 'No public API operation exists.',
            resolution: 'Read /openapi.json.',
        })
        expect(fehler.status).toBe(404)
        expect(fehler.code).toBe('route_not_found')
        expect(fehler.resolution).toBe('Read /openapi.json.')
    })
})

describe('Textausgabe', () => {
    it('nennt Quelle und Frist je Treffer und verweist auf das Original', () => {
        const zeilen = tenderZeilen([{
            title: 'Fassadensanierung Los 3',
            buyer_name: 'SVLFG',
            buyer_country: 'DEU',
            cpv_main: '45443000',
            cpv_additional: ['45262670'],
            deadline_at: '2026-08-31T11:00:00Z',
            published_at: '2026-08-22T00:00:00Z',
            estimated_value_eur: 3535902,
            relevance_score: 80,
            source: 'doe',
            source_url: 'https://example.org/E1',
        }]).join('\n')
        expect(zeilen).toContain('Fassadensanierung Los 3')
        expect(zeilen).toContain('2026-08-31')
        expect(zeilen).toContain('45443000, 45262670')
        expect(zeilen).toContain('https://example.org/E1')
        expect(zeilen).toContain('Originalbekanntmachung')
    })

    it('sagt bei null Treffern, was zu tun ist', () => {
        expect(tenderZeilen([])[0]).toMatch(/Keine Treffer/)
    })

    it('zeigt fehlende Werte als Strich statt als undefined', () => {
        const zeilen = tenderZeilen([{ title: 'Ohne alles' }]).join('\n')
        expect(zeilen).not.toContain('undefined')
        expect(zeilen).toContain('—')
    })

    it('fasst Quellen und Laender zusammen', () => {
        expect(quellenZeilen([{ source: 'ted', implementation_status: 'live', stored: 5 }]).at(-1))
            .toBe('1 Quellen.')
        expect(laenderZeilen([{ country: 'DEU', count: 10 }]).at(-1)).toContain('10')
    })
})
