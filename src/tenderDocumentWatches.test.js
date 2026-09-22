import { afterEach, expect, it, vi } from 'vitest'
import handler from '../api/tender-document-watches'

afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

it('leitet nur begrenzte UUID-Vormerkungen weiter und cached die Antwort nicht', async () => {
    vi.stubEnv('AGENTLEADS_API_BASE', 'https://backend.example')
    const upstream = vi.fn(async () => new Response('{"supported_ids":[]}', { status: 200 }))
    vi.stubGlobal('fetch', upstream)
    const res = { setHeader: vi.fn(), status: vi.fn().mockReturnThis(), send: vi.fn(), json: vi.fn() }
    const id = 'd12c5408-192e-432b-84b2-1ec654aaa69d'
    await handler({ method: 'POST', body: { ids: [id] } }, res)
    expect(String(upstream.mock.calls[0][0])).toBe('https://backend.example/api/public/tenders/document-watches')
    expect(JSON.parse(upstream.mock.calls[0][1].body)).toEqual({ ids: [id] })
    expect(res.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-store')
    await handler({ method: 'POST', body: { ids: ['not-an-id'] } }, res)
    expect(res.status).toHaveBeenLastCalledWith(400)
    expect(upstream).toHaveBeenCalledTimes(1)
})
