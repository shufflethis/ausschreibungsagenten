import { afterEach, expect, it, vi } from 'vitest'
import handler from '../api/tenders-public'

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

it('reicht Suchfilter durch und cached weder beobachtete IDs noch Upstreamfehler', async () => {
    vi.stubEnv('AGENTLEADS_API_BASE', 'https://backend.example')
    const upstream = vi.fn(async () => new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }))
    vi.stubGlobal('fetch', upstream)
    const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn(), json: vi.fn() }
    await handler({ method: 'GET', query: { ids: 'a,b', performance_region: 'Berlin', vertical: 'planning', min_score: '0', offset: '25', unsupported: 'ignored' } }, res)
    const sent = new URL(upstream.mock.calls[0][0])
    expect(Object.fromEntries(sent.searchParams)).toEqual({ ids: 'a,b', performance_region: 'Berlin', vertical: 'planning', min_score: '0', offset: '25' })
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
    res.setHeader.mockClear()
    await handler({ method: 'GET', query: { search: 'Balkon' } }, res)
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    res.setHeader.mockClear()
    upstream.mockResolvedValueOnce(new Response('{}', { status: 503 }))
    await handler({ method: 'GET', query: {} }, res)
    expect(res.status).toHaveBeenLastCalledWith(503)
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
})

it('reicht echte Limit-Koepfe durch, setzt ein Zeitlimit und cached keine Fehler', async () => {
    vi.stubEnv('AGENTLEADS_API_BASE', 'https://backend.example')
    const { default: quellenStatus } = await import('../api/source-status')
    const upstream = vi.fn(async () => new Response('[]', { status: 200, headers: { 'x-ratelimit-remaining': '412' } }))
    vi.stubGlobal('fetch', upstream)
    const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn(), json: vi.fn() }
    await quellenStatus({ method: 'GET', query: {} }, res)
    expect(upstream.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal)
    expect(res.setHeader).toHaveBeenCalledWith('x-ratelimit-remaining', '412')
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.setHeader.mockClear()
    upstream.mockResolvedValueOnce(new Response('{}', { status: 429, headers: { 'retry-after': '60' } }))
    await quellenStatus({ method: 'GET', query: {} }, res)
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
    expect(res.setHeader).toHaveBeenCalledWith('Retry-After', '60')
})

it('nennt dem Backend die Besucheradresse nur zusammen mit dem Geheimnis', async () => {
    vi.stubEnv('AGENTLEADS_API_BASE', 'https://backend.example')
    const upstream = vi.fn(async () => new Response('[]', { status: 200 }))
    vi.stubGlobal('fetch', upstream)
    const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn(), json: vi.fn() }
    const req = { method: 'GET', query: {}, headers: { 'x-real-ip': '198.51.100.7', 'x-forwarded-for': '198.51.100.7, 10.0.0.1' } }
    await handler(req, res)
    expect(upstream.mock.calls[0][1].headers).toEqual({ Accept: 'application/json' })
    vi.stubEnv('AGENTLEADS_PROXY_SECRET', 's3cret')
    await handler(req, res)
    expect(upstream.mock.calls[1][1].headers).toEqual({ Accept: 'application/json', 'X-Proxy-Secret': 's3cret', 'X-Client-IP': '198.51.100.7' })
})
