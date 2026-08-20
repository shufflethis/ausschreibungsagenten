import { afterEach, describe, expect, it, vi } from 'vitest'

import handler from './signup.js'

function responseMock() {
    return {
        statusCode: 200,
        body: undefined,
        setHeader: vi.fn(),
        status(code) {
            this.statusCode = code
            return this
        },
        json(body) {
            this.body = body
            return this
        },
        send(body) {
            this.body = body
            return this
        },
        end() {
            return this
        },
    }
}

describe('signup proxy', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        delete process.env.AGENTLEADS_API_BASE
    })

    it('forwards valid signups to the AgentLeads backend', async () => {
        process.env.AGENTLEADS_API_BASE = 'https://api.example.invalid'
        const fetchMock = vi.fn().mockResolvedValue({
            status: 200,
            text: vi.fn().mockResolvedValue('{"email":"dev@example.com","tier":"free","api_key":"sk_test"}'),
            headers: { get: () => 'application/json' },
        })
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({ method: 'POST', body: { email: 'dev@example.com' } }, res)

        expect(fetchMock).toHaveBeenCalledOnce()
        const [url, options] = fetchMock.mock.calls[0]
        expect(String(url)).toBe('https://api.example.invalid/api/signup')
        expect(JSON.parse(options.body)).toEqual({ email: 'dev@example.com', tier: 'free' })
        expect(res.statusCode).toBe(200)
    })

    it('reicht den Partner-Code aus dem Cookie weiter', async () => {
        process.env.AGENTLEADS_API_BASE = 'https://api.example.invalid'
        const fetchMock = vi.fn().mockResolvedValue({
            status: 200,
            text: vi.fn().mockResolvedValue('{}'),
            headers: { get: () => 'application/json' },
        })
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler(
            {
                method: 'POST',
                body: { email: 'dev@example.com' },
                headers: { cookie: 'foo=bar; aa_partner=TESTPARTNER1; baz=1' },
            },
            res,
        )

        const [, options] = fetchMock.mock.calls[0]
        expect(JSON.parse(options.body)).toEqual({
            email: 'dev@example.com',
            tier: 'free',
            partner_tracking_code: 'TESTPARTNER1',
        })
    })

    it('laesst das Feld weg, wenn kein Cookie da ist', async () => {
        process.env.AGENTLEADS_API_BASE = 'https://api.example.invalid'
        const fetchMock = vi.fn().mockResolvedValue({
            status: 200,
            text: vi.fn().mockResolvedValue('{}'),
            headers: { get: () => 'application/json' },
        })
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({ method: 'POST', body: { email: 'dev@example.com' }, headers: {} }, res)

        const [, options] = fetchMock.mock.calls[0]
        expect(JSON.parse(options.body)).not.toHaveProperty('partner_tracking_code')
        expect(res.statusCode).toBe(200)
    })

    // Ein manipuliertes Cookie darf die Anmeldung nicht kaputt machen -
    // der Code faellt weg, der Nutzer merkt nichts.
    it('verwirft manipulierte Codes, ohne die Anmeldung zu stoeren', async () => {
        process.env.AGENTLEADS_API_BASE = 'https://api.example.invalid'
        const res = responseMock()

        for (const boeses of ['<script>alert(1)</script>', 'x'.repeat(80), 'mit leerzeichen', '']) {
            const fetchMock = vi.fn().mockResolvedValue({
                status: 200,
                text: vi.fn().mockResolvedValue('{}'),
                headers: { get: () => 'application/json' },
            })
            vi.stubGlobal('fetch', fetchMock)

            await handler(
                {
                    method: 'POST',
                    body: { email: 'dev@example.com' },
                    headers: { cookie: `aa_partner=${encodeURIComponent(boeses)}` },
                },
                res,
            )

            const [, options] = fetchMock.mock.calls[0]
            expect(JSON.parse(options.body), `Code "${boeses}" wurde durchgereicht`).not.toHaveProperty(
                'partner_tracking_code',
            )
            expect(res.statusCode).toBe(200)
        }
    })

    it('rejects invalid email addresses without calling the backend', async () => {
        process.env.AGENTLEADS_API_BASE = 'https://api.example.invalid'
        const fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({ method: 'POST', body: { email: 'kein-email' } }, res)

        expect(fetchMock).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(400)
    })

    it('silently accepts honeypot submissions', async () => {
        process.env.AGENTLEADS_API_BASE = 'https://api.example.invalid'
        const fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({ method: 'POST', body: { email: 'dev@example.com', website: 'spam' } }, res)

        expect(fetchMock).not.toHaveBeenCalled()
        expect(res.statusCode).toBe(200)
    })
})
