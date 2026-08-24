import { createHash } from 'node:crypto'
import agentAnsicht from '../api/agent-view.js'
import nichtGefunden from '../api/not-found.js'
import { willAgentAnsicht } from '../lib/agentenErkennung.js'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const text = (path) => readFile(resolve(process.cwd(), path), 'utf8')

// Minimaler Ersatz fuer das Antwortobjekt der Vercel-Function, damit die
// Aushandlung ohne laufenden Server pruefbar bleibt.
function antwort(headers) {
    const gesammelt = { header: {}, status: null, body: '' }
    const res = {
        setHeader: (schluessel, wert) => { gesammelt.header[schluessel] = wert },
        status: (code) => { gesammelt.status = code; return res },
        send: (rumpf) => { gesammelt.body = rumpf; return res },
        end: () => res,
    }
    nichtGefunden({ method: 'GET', url: '/gibt-es-nicht', headers }, res)
    return gesammelt
}

describe('Agent-Readiness machine contracts', () => {
    it('publishes discovery, instructions, pricing and auth documents', async () => {
        for (const path of [
            'public/agents.md',
            'public/pricing.md',
            'public/auth.md',
            'public/api-policy.md',
            'public/openapi.json.md',
            'public/entwickler.md',
            'public/.well-known/api-catalog.md',
            'public/.well-known/ai-catalog.json',
            'public/.well-known/api-catalog',
            'public/.well-known/mcp/server-card.json',
            'public/.well-known/agent-skills/index.json',
            'public/skills/tender-search/SKILL.md',
        ]) {
            expect((await text(path)).length, path).toBeGreaterThan(200)
        }
    })

    it('keeps the Agent Skills v0.2 digest verifiable', async () => {
        const manifest = JSON.parse(await text('public/.well-known/agent-skills/index.json'))
        const skill = await text('public/skills/tender-search/SKILL.md')
        expect(manifest.version).toBe('0.2.0')
        expect(manifest.skills[0].type).toBe('skill-md')
        expect(manifest.skills[0].digest).toBe(`sha256:${createHash('sha256').update(skill).digest('hex')}`)
        expect(skill).toMatch(/When to use this skill/i)
    })

    it('publishes valid ARD identifiers and trust metadata', async () => {
        const catalog = JSON.parse(await text('public/.well-known/ai-catalog.json'))
        expect(catalog.specVersion).toBe('1.0')
        expect(catalog.entries.length).toBeGreaterThanOrEqual(3)
        for (const entry of catalog.entries) {
            expect(entry.identifier).toMatch(/^urn:air:ausschreibungsagenten\.de:/)
            expect(entry.displayName).toBeTruthy()
            expect(entry.type).toBeTruthy()
            expect(Boolean(entry.url) !== Boolean(entry.data)).toBe(true)
            expect(entry.trustManifest?.identity).toBeTruthy()
        }
    })

    it('exposes same-origin OpenAPI, MCP and conditional markdown routes', async () => {
        const config = JSON.parse(await text('vercel.json'))
        expect(config.rewrites).toEqual(expect.arrayContaining([
            expect.objectContaining({ source: '/openapi.json', destination: '/api/openapi-proxy' }),
            expect.objectContaining({ source: '/mcp', destination: 'https://api.ausschreibungsagenten.de/mcp' }),
        ]))
        // Die Erkennung steht in lib/agentenErkennung.js, weil middleware
        // und 404-Function dieselbe Entscheidung treffen muessen. Geprueft
        // wird deshalb das Verhalten, nicht der Wortlaut der middleware.
        const middleware = await text('middleware.js')
        expect(middleware).toMatch(/willAgentAnsicht/)
        expect(middleware).toMatch(/'\/api\/agent-view'/)
        expect(willAgentAnsicht({ accept: 'text/markdown' })).toBe(true)
        expect(willAgentAnsicht({ modus: 'agent' })).toBe(true)
        expect(willAgentAnsicht({ userAgent: 'Mozilla/5.0 (compatible; ClaudeBot/1.0)' })).toBe(true)
        expect(willAgentAnsicht({ accept: 'text/html', userAgent: 'Mozilla/5.0' })).toBe(false)
    })

    it('liefert die Agent-Ansicht als Markdown, ohne beim Laden zu brechen', () => {
        // Diese Datei ist ein einziges Template-Literal. Ein Backtick im
        // Text beendet es und macht aus der Function einen 500 - genau das
        // ist passiert, als der Bearer-Header in Backticks gesetzt wurde.
        // Der Import hier faellt schon beim Parsen um, wenn es wieder
        // passiert; der Rest prueft die Antwort.
        const gesammelt = { header: {}, status: null, body: '' }
        const res = {
            setHeader: (k, v) => { gesammelt.header[k] = v },
            status: (c) => { gesammelt.status = c; return res },
            send: (b) => { gesammelt.body = b; return res },
            end: () => res,
        }
        agentAnsicht({ method: 'GET', url: '/index.md', headers: {} }, res)

        expect(gesammelt.status).toBe(200)
        expect(gesammelt.header['Content-Type']).toBe('text/markdown; charset=utf-8')
        expect(gesammelt.header.Vary).toContain('Accept')
        expect(gesammelt.body).toContain('# Ausschreibungsagenten.de')
        expect(gesammelt.body).toContain('Authorization: Bearer')
        expect(gesammelt.body).not.toContain('X-API-Key')
    })

    it('faengt geratene Adressen mit echtem 404 und Markdown-Rumpf ab', async () => {
        const config = JSON.parse(await text('vercel.json'))
        // Der Auffang-Rewrite muss der letzte sein: Vercel arbeitet die
        // Liste der Reihe nach ab, davor stehende Regeln wuerden sonst
        // nie greifen.
        // Der Auffang nimmt /api/ ausdruecklich aus: dort antwortet
        // api/[...path].js mit application/problem+json. Ohne die
        // Ausnahme ueberholt der Auffang diese Function und Agenten
        // bekommen auf eine falsche API-Adresse HTML statt JSON.
        expect(config.rewrites.at(-1)).toEqual({ source: '/((?!api/).*)', destination: '/api/not-found' })

        const agent = antwort({ accept: 'text/markdown', 'user-agent': 'ClaudeBot/1.0' })
        expect(agent.status).toBe(404)
        expect(agent.header['Content-Type']).toBe('text/markdown; charset=utf-8')
        expect(agent.header.Vary).toContain('Accept')
        expect(agent.header['X-Robots-Tag']).toBe('noindex')
        expect(agent.body.startsWith('# ')).toBe(true)
        for (const ziel of ['/llms.txt', '/sitemap.xml', '/agents.md', '/openapi.json', '/entwickler']) {
            expect(agent.body, ziel).toContain(`](https://www.ausschreibungsagenten.de${ziel})`)
        }

        const mensch = antwort({ accept: 'text/html', 'user-agent': 'Mozilla/5.0' })
        expect(mensch.status).toBe(404)
        expect(mensch.header['Content-Type']).toBe('text/html; charset=utf-8')
        expect(mensch.body).toContain('<title>Seite nicht gefunden')
    })

    it('fuehrt geratene Navigationspfade auf vorhandene Anker', async () => {
        const config = JSON.parse(await text('vercel.json'))
        const landingpage = await text('src/pages/LandingPage.jsx')

        for (const quelle of ['/preise', '/funktionen', '/wie-es-funktioniert', '/faq', '/api']) {
            const regel = config.redirects.find((r) => r.source === quelle)
            expect(regel, quelle).toBeTruthy()
            const anker = regel.destination.split('#')[1]
            // Ein Redirect auf einen Anker, den es nicht gibt, sieht wie
            // eine Loesung aus und ist keine: der Aufrufer landet oben
            // auf der Startseite und sucht weiter.
            if (anker) expect(landingpage, `${quelle} -> #${anker}`).toContain(`id="${anker}"`)
        }
    })

    it('loest die versionierte API-Flaeche auch auf der Website-Origin ein', async () => {
        // Die openapi.json nennt www als zweiten Server. Ohne diese Regel
        // laeuft dort jede dokumentierte Operation ins 404 - die Spec
        // verspraeche etwas, das der Server nicht kann.
        const config = JSON.parse(await text('vercel.json'))
        const quellen = config.rewrites.map((r) => r.source)
        const v1 = config.rewrites.find((r) => r.source === '/api/v1/(.*)')
        expect(v1?.destination).toBe('https://api.ausschreibungsagenten.de/api/v1/$1')
        // Muss vor der allgemeinen /api-Regel stehen, sonst greift die zuerst.
        expect(quellen.indexOf('/api/v1/(.*)')).toBeLessThan(quellen.indexOf('/api/(.*)'))
    })

    it('formatiert die llms.txt als Navigationsindex mit Markdown-Links', async () => {
        const llms = await text('public/llms.txt')
        expect(llms.startsWith('# ')).toBe(true)
        expect(llms.match(/\]\(https:\/\//g).length).toBeGreaterThanOrEqual(20)
        expect(llms.length).toBeLessThan(30000)
    })

    it('advertises WebMCP and machine endpoints from rendered HTML', async () => {
        const html = await text('index.html')
        expect(html).toMatch(/document\.modelContext\.registerTool/)
        const footer = await text('src/components/Footer.jsx')
        expect(footer).toMatch(/\/openapi\.json/)
        expect(footer).toMatch(/\/agents\.md/)
        expect(footer).toMatch(/\/\.well-known\/api-catalog/)
    })
})
