import { afterEach, describe, expect, it, vi } from 'vitest'

import handler from './contact.js'

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

describe('contact notification', () => {
    afterEach(() => {
        vi.unstubAllGlobals()
        delete process.env.RESEND_API_KEY
        delete process.env.RESEND_FROM
        delete process.env.CONTACT_NOTIFICATION_EMAIL
        delete process.env.SLACK_BOT_TOKEN
        delete process.env.SLACK_CHANNEL_ID
    })

    it('sends contact requests through Resend with Reply-To', async () => {
        process.env.RESEND_API_KEY = 're_test'
        process.env.CONTACT_NOTIFICATION_EMAIL = 'hi@ausschreibungsagenten.de'
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, text: vi.fn() })
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({
            method: 'POST',
            body: {
                name: 'Mario Streng',
                email: 'mario@example.com',
                company: 'Rossmanith GmbH',
                branche: 'Bau',
                message: 'Bitte um eine Demo.',
            },
        }, res)

        expect(res.statusCode).toBe(200)
        expect(res.body).toEqual({ success: true })
        expect(fetchMock).toHaveBeenCalledTimes(1)
        const [url, options] = fetchMock.mock.calls[0]
        const payload = JSON.parse(options.body)
        expect(url).toBe('https://api.resend.com/emails')
        expect(payload.to).toEqual(['hi@ausschreibungsagenten.de'])
        expect(payload.reply_to).toBe('mario@example.com')
        expect(payload.subject).toContain('Rossmanith GmbH')
        expect(payload.text).toContain('Bitte um eine Demo.')
    })

    it('keeps the request successful when Slack fails but Resend succeeds', async () => {
        process.env.RESEND_API_KEY = 're_test'
        process.env.SLACK_BOT_TOKEN = 'xoxb-test'
        process.env.SLACK_CHANNEL_ID = 'C123'
        const fetchMock = vi.fn()
            .mockResolvedValueOnce({ ok: true, text: vi.fn() })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue({ ok: false, error: 'channel_not_found' }) })
        vi.stubGlobal('fetch', fetchMock)
        const res = responseMock()

        await handler({
            method: 'POST',
            body: { name: 'Test', email: 'test@example.com', message: 'Testnachricht' },
        }, res)

        expect(res.statusCode).toBe(200)
        expect(fetchMock).toHaveBeenCalledTimes(2)
    })
    it('maskiert Slack-Steuerzeichen aus Formulareingaben', async () => {
        process.env.SLACK_BOT_TOKEN = 'xoxb-test'
        process.env.SLACK_CHANNEL_ID = 'C1'
        const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) })
        vi.stubGlobal('fetch', fetchMock)
        const { default: pilot } = await import('./profile-lead.js')

        await handler({ method: 'POST', body: { name: '<!channel>', email: 'a@b.de', message: '<https://boese.example|Kundenportal> & mehr' } }, responseMock())
        await pilot({ method: 'POST', body: { company: '<!here> GmbH', email: 'a@b.de', services: 'Fenster <@U1>' } }, responseMock())

        for (const [, anfrage] of fetchMock.mock.calls) {
            expect(anfrage.body).not.toMatch(/<[!@h]/)
        }
        expect(fetchMock.mock.calls[0][1].body).toContain('&lt;!channel&gt;')
        expect(fetchMock.mock.calls[0][1].body).toContain('&amp; mehr')
        expect(fetchMock.mock.calls[1][1].body).toContain('&lt;!here&gt; GmbH')
    })
})
