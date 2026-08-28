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

    it('liest den Accept-Kopf nach q-Werten statt nach Teilzeichenkette', () => {
        // Wer Markdown nur als Notnagel nennt, will die Seite. Ein blosses
        // includes('text/markdown') hat genau das falsch beantwortet.
        expect(willAgentAnsicht({ accept: 'text/html,text/markdown;q=0.1' })).toBe(false)
        expect(willAgentAnsicht({ accept: 'text/html;q=0.9,text/markdown;q=0.8' })).toBe(false)
        expect(willAgentAnsicht({ accept: 'text/markdown;q=0.9,text/html;q=0.8' })).toBe(true)
        expect(willAgentAnsicht({ accept: 'text/markdown,text/html' })).toBe(true)
        expect(willAgentAnsicht({ accept: 'text/markdown;q=0' })).toBe(false)

        // Wildcards sind kein Markdown-Wunsch: das schicken curl, fetch und
        // die halbe Crawler-Landschaft, und die wollen die normale Seite.
        expect(willAgentAnsicht({ accept: '*/*' })).toBe(false)
        expect(willAgentAnsicht({ accept: 'text/*' })).toBe(false)
        // ... aber sie zaehlen als HTML-Wunsch, wenn Markdown daneben steht.
        expect(willAgentAnsicht({ accept: 'text/markdown;q=0.5,*/*' })).toBe(false)
    })

    it('loest die OAuth-Metadaten auch auf der Website-Origin ein', async () => {
        // Wer die Domain prueft, prueft www - dort liegen die Dokumente aber
        // nicht, sie gehoeren zum API-Host. Ohne diese Regeln liefe die
        // Entdeckung des Ausstellers in die Markdown-404.
        const config = JSON.parse(await text('vercel.json'))
        for (const pfad of ['/.well-known/oauth-authorization-server', '/.well-known/oauth-protected-resource']) {
            const regel = config.rewrites.find((r) => r.source === pfad)
            expect(regel?.destination, pfad).toBe(`https://api.ausschreibungsagenten.de${pfad}`)
        }
    })

    it('liefert unter server.json das Registry-Format, unter der Card die Card', async () => {
        // /server.json meint im MCP-Umfeld das Format der offiziellen
        // Registry (remotes[]), nicht die Server Card. Beide unter
        // demselben Namen auszuliefern, hiess: der Scanner findet ein
        // Manifest und kann damit nichts anfangen.
        const registry = JSON.parse(await text('public/server.json'))
        expect(registry.$schema).toContain('server.schema.json')
        expect(registry.name).toBe('de.ausschreibungsagenten/tender-search')
        // Die offizielle Registry weist alles ueber 100 Zeichen mit 422 ab.
        expect(registry.description.length).toBeLessThanOrEqual(100)
        // Ein Server, zwei Tueren: die deutsche und die englische Domain
        // liegen hinter demselben Container. Zwei Remotes in einem Eintrag,
        // nicht zwei Eintraege - sonst haelt ein Verzeichnis ein Produkt
        // fuer zwei.
        expect(registry.remotes).toEqual([
            { type: 'streamable-http', url: 'https://api.ausschreibungsagenten.de/mcp' },
            { type: 'streamable-http', url: 'https://api.tender-agents.com/mcp' },
        ])

        const config = JSON.parse(await text('vercel.json'))

        // Die Server Card ist keine Datei mehr: sie kommt aus der
        // Werkzeugliste des laufenden Servers, damit Karte und Server nicht
        // auseinanderlaufen koennen.
        const karte = config.rewrites.find((r) => r.source === '/.well-known/mcp/server-card.json')
        expect(karte?.destination).toBe(
            'https://api.ausschreibungsagenten.de/.well-known/mcp/server-card.json',
        )

        for (const quelle of ['/.well-known/mcp.json', '/.well-known/mcp/server.json']) {
            const regel = config.rewrites.find((r) => r.source === quelle)
            expect(regel?.destination, quelle).toBe('/server.json')
        }
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

    it('macht die Entwicklerdokumente unter vorhersagbaren Adressen auffindbar', async () => {
        // Der Check dazu ist ein Websuche-Check. Was er braucht: eine
        // indexierbare Adresse auf der eigenen Domain statt eines 307 auf
        // einen fremden Host, und die Dokumente in der Sitemap.
        const config = JSON.parse(await text('vercel.json'))
        expect(config.redirects.find((r) => r.source === '/docs')).toBeUndefined()
        for (const quelle of ['/docs', '/api-docs']) {
            const regel = config.rewrites.find((r) => r.source === quelle)
            expect(regel?.destination, quelle).toBe('/entwickler/index.html')
        }

        const sitemap = await text('scripts/sitemap.mjs')
        for (const dokument of ['/entwickler.md', '/agents.md', '/auth.md', '/pricing.md', '/api-policy.md']) {
            expect(sitemap, dokument).toContain(dokument)
        }

        // Der Produktname gehoert in Titel und Ueberschrift - danach sucht,
        // wer die Doku ueber eine Suchmaschine finden soll.
        const routen = await text('src/routes.js')
        expect(routen).toContain('Ausschreibungsagenten API-Dokumentation')
        const seite = await text('src/pages/Entwickler.jsx')
        expect(seite).toContain('API-Dokumentation')
    })

    it('formatiert die llms.txt als Navigationsindex mit Markdown-Links', async () => {
        const llms = await text('public/llms.txt')
        expect(llms.startsWith('# ')).toBe(true)
        expect(llms.match(/\]\(https:\/\//g).length).toBeGreaterThanOrEqual(20)
        expect(llms.length).toBeLessThan(30000)
    })

    it('advertises machine endpoints from the footer', async () => {
        const footer = await text('src/components/Footer.jsx')
        expect(footer).toMatch(/\/openapi\.json/)
        expect(footer).toMatch(/\/agents\.md/)
        expect(footer).toMatch(/\/\.well-known\/api-catalog/)
    })

    // Der fruehere Inline-Stub in index.html registrierte sein Werkzeug
    // beim Parsen des Dokuments, also vor der Hydrierung, und ohne Bezug
    // zum sichtbaren Zustand. Die Registrierung gehoert in die Komponente,
    // deren Zustand die Werkzeuge steuern.
    it('registers WebMCP tools through document.modelContext', async () => {
        expect(await text('index.html')).not.toMatch(/modelContext/)
        const webmcp = await text('src/lib/webmcp.js')
        expect(webmcp).toMatch(/document\.modelContext\?\.registerTool/)
        // Abgemeldet wird laut Spec ueber ein AbortSignal.
        expect(webmcp).toMatch(/signal: abbruch\.signal/)

        const landing = await text('src/pages/LandingPage.jsx')
        expect(landing).toMatch(/return stelleWerkzeugeBereit\(werkzeuge, /)
        for (const werkzeug of [
            'search_tenders',
            'list_visible_tenders',
            'open_tender',
            'source_status',
            'prefill_pilot_profile',
            'shortlist_tender',
            'explain_fit',
            'set_decision',
            'remove_from_shortlist',
            'list_shortlist',
            'check_eu_threshold',
        ]) {
            expect(landing, werkzeug).toContain(`name: '${werkzeug}'`)
        }
        // Kontakt- und Profilformular loesen echte E-Mails aus. Agenten
        // duerfen ausfuellen, abschicken bleibt der Klick des Menschen.
        expect(landing).toMatch(/submitted: false/)
        expect(landing).not.toMatch(/handleProfileSubmit\(\)/)
    })
})
