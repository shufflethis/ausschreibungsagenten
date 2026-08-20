function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
}

function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320
}

// Der Partner-Code kommt aus dem Cookie, nicht aus dem Body: der Body
// wird vom Browser gestellt und waere frei waehlbar. Manipulierbar ist
// zwar auch das Cookie, aber wir kopieren wenigstens keinen beliebigen
// Wert aus der Anfrage weiter.
//
// Muster und Laenge spiegeln `partner_programs.tracking_code
// varchar(50)` in Numok. Was dort nicht gespeichert werden koennte,
// reichen wir gar nicht erst durch.
function partnerCodeAusCookie(cookieHeader) {
    if (!cookieHeader) return null
    const treffer = String(cookieHeader).match(/(?:^|;\s*)aa_partner=([^;]*)/)
    if (!treffer) return null

    let wert
    try {
        wert = decodeURIComponent(treffer[1])
    } catch {
        return null
    }
    return /^[A-Za-z0-9_-]{1,50}$/.test(wert) ? wert : null
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST')
        return res.status(405).json({ error: 'Method not allowed' })
    }

    const baseUrl = process.env.AGENTLEADS_API_BASE
    if (!baseUrl) {
        return res.status(503).json({ error: 'AgentLeads API is not configured' })
    }

    const { email, website } = req.body || {}

    // Honeypot: Bots füllen das versteckte Feld — Anfrage still verwerfen.
    if (clean(website, 200)) {
        return res.status(200).json({ ok: true })
    }

    const cleanEmail = clean(email, 320)
    if (!validEmail(cleanEmail)) {
        return res.status(400).json({ error: 'Bitte eine gültige E-Mail-Adresse angeben.' })
    }

    // Fehlt der Code, bleibt das Feld weg statt null zu senden - das
    // Backend soll nicht zwischen "kein Partner" und "Partner unbekannt"
    // unterscheiden muessen.
    const partnerCode = partnerCodeAusCookie(req.headers?.cookie)
    const nutzlast = { email: cleanEmail, tier: 'free' }
    if (partnerCode) nutzlast.partner_tracking_code = partnerCode

    try {
        const upstream = await fetch(new URL('/api/signup', baseUrl), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(nutzlast),
        })
        const body = await upstream.text()
        res.setHeader('Content-Type', upstream.headers.get('content-type') || 'application/json')
        return res.status(upstream.status).send(body)
    } catch (err) {
        console.error('AgentLeads signup proxy failed:', err)
        return res.status(502).json({ error: 'AgentLeads API is unavailable' })
    }
}
