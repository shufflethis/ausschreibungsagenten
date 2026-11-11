// Gemeinsamer Durchreicher fuer die oeffentlichen GET-Endpunkte des
// Backends. Vorher stand derselbe Ablauf in drei Functions, zwei davon
// ohne Zeitlimit - ein haengendes Backend hielt die Function dann bis zum
// Plattform-Timeout offen.
export const ZEITLIMIT_MS = 15000

// Das Backend zaehlt wirklich (slowapi, x-ratelimit-*). Diese Werte reichen
// wir durch, statt feste Zahlen zu behaupten. Grenze: bei einer Antwort aus
// dem CDN-Cache stammen sie vom Zeitpunkt des Cache-Eintrags.
const LIMIT_KOEPFE = ['x-ratelimit-limit', 'x-ratelimit-remaining', 'x-ratelimit-reset']

// Das Backend zaehlt anonyme Aufrufe je Adresse. Ohne diese Koepfe saehe es
// nur die Ausgangsadressen von Vercel: alle Besucher teilten sich einen
// Zaehler, und ein Einzelner koennte Suche oder Signup fuer alle sperren.
// Vercel setzt x-real-ip selbst; ein Aufrufer kann den Wert nicht vorgeben.
// Das Backend glaubt X-Client-IP nur zusammen mit dem gemeinsamen Geheimnis
// (dort TRUSTED_PROXY_SECRET). Fehlt es hier, bleibt alles beim alten Stand.
export function besucherKoepfe(req) {
    const geheimnis = process.env.AGENTLEADS_PROXY_SECRET
    const adresse = String(req.headers?.['x-real-ip'] || req.headers?.['x-forwarded-for'] || '').split(',')[0].trim()
    return geheimnis && adresse ? { 'X-Proxy-Secret': geheimnis, 'X-Client-IP': adresse } : {}
}

export async function backendGet(req, res, { ziel, cache, name }) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const baseUrl = process.env.AGENTLEADS_API_BASE
    if (!baseUrl) {
        return res.status(503).json({ error: 'AgentLeads API is not configured' })
    }

    const upstreamUrl = ziel(baseUrl)
    try {
        const upstream = await fetch(upstreamUrl.toString(), {
            headers: { Accept: 'application/json', ...besucherKoepfe(req) },
            signal: AbortSignal.timeout(ZEITLIMIT_MS),
        })
        const body = await upstream.text()

        // Fehler des Backends nie cachen: sonst haelt das CDN einen
        // kurzen Ausfall minutenlang fest.
        res.setHeader('Cache-Control', upstream.ok ? cache(upstreamUrl) : 'no-store')
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
        for (const kopf of LIMIT_KOEPFE) {
            const wert = upstream.headers.get(kopf)
            if (wert) res.setHeader(kopf, wert)
        }
        if (upstream.status === 429 && upstream.headers.get('retry-after')) {
            res.setHeader('Retry-After', upstream.headers.get('retry-after'))
        }
        return res.status(upstream.status).send(body)
    } catch (err) {
        console.error(`AgentLeads ${name} proxy failed:`, err)
        res.setHeader('Cache-Control', 'no-store')
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
