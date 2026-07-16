import { afterEach, describe, expect, it, vi } from 'vitest'

import handler from './profile-lead.js'

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
        end() {
            return this
        },
    }
}

describe('pilot profile lead', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        delete process.env.RESEND_API_KEY
        delete process.env.CONTACT_NOTIFICATION_EMAIL
        delete process.env.SLACK_BOT_TOKEN
        delete process.env.SLACK_CHANNEL_ID
    })

    it('notifies the operator without creating a public profile or pilot token', async () => {
        process.env.RESEND_API_KEY = 're_test'
        const fetchMock = vi.fn().mockResolvedValue({ ok: true })
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({
            method: 'POST',
            body: {
                email: 'm.streng@rossmanith-hd.de',
                company: 'Rossmanith GmbH',
                industry: 'Bau',
                region: 'Baden-Württemberg',
                services: 'Fenster und Fassaden',
            },
        }, res)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({
            success: true,
            email: 'm.streng@rossmanith-hd.de',
            company: 'Rossmanith GmbH',
        })
        expect(res.body).not.toHaveProperty('pilot_url')
        expect(res.body).not.toHaveProperty('profile_id')
        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock.mock.calls[0][0]).toBe('https://api.resend.com/emails')
    })

    it('silently accepts a filled honeypot without sending', async () => {
        const fetchMock = vi.fn()
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({ method: 'POST', body: { website: 'spam.example' } }, res)

        expect(res.statusCode).toBe(200)
        expect(fetchMock).not.toHaveBeenCalled()
    })
})
