import { createHash } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const text = (path) => readFile(resolve(process.cwd(), path), 'utf8')

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
        const middleware = await text('middleware.js')
        expect(middleware).toMatch(/accept\.includes\('text\/markdown'\)/)
        expect(middleware).toMatch(/mode'\) === 'agent'/)
        expect(middleware).toMatch(/AGENT_USER_AGENT/)
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
