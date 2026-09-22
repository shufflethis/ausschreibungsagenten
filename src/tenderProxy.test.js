import { afterEach, expect, it, vi } from 'vitest'
import handler from '../api/tenders-public'

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

it('reicht gespeicherte IDs und Suchfilter durch und cached keine Upstreamfehler', async () => {
    vi.stubEnv('AGENTLEADS_API_BASE', 'https://backend.example')
    const upstream = vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', upstream)
    const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn(), json: vi.fn() }
    await handler({ method: 'GET', query: { ids: 'a,b', performance_region: 'Berlin', vertical: 'planning', min_score: '0', offset: '25', unsupported: 'ignored' } }, res)
    const sent = new URL(upstream.mock.calls[0][0])
    expect(Object.fromEntries(sent.searchParams)).toEqual({ ids: 'a,b', performance_region: 'Berlin', vertical: 'planning', min_score: '0', offset: '25' })
    upstream.mockResolvedValueOnce(new Response('{}', { status: 503 }))
    await handler({ method: 'GET', query: {} }, res)
    expect(res.status).toHaveBeenLastCalledWith(503)
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
})
