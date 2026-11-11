// Eingabepruefung der Formular-Functions (Kontakt, Pilotanfrage, Signup).
export function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
}

export function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320
}

// Slack liest in Nachrichtentext <!channel>, <@U123> und <https://x|Text> als
// Steuerzeichen. Ungeprueft uebernommen koennte ein Formularabsender den
// ganzen Kanal anpingen oder einen Link mit falscher Beschriftung setzen.
// Slack verlangt genau diese drei Ersetzungen, in dieser Reihenfolge.
export function slackText(value) {
    return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Zeitlimit fuer ausgehende Aufrufe (Resend, Slack, Backend).
export const ZEITLIMIT_MS = 10000

const ERLAUBTE_ORIGINS = new Set([
    'https://www.ausschreibungsagenten.de',
    'https://ausschreibungsagenten.de',
])

// Weist Browser-POSTs von fremden Seiten ab (CSRF / fremde Formulareinbettung).
// Fehlt Origin (z. B. lokale Tests), bleibt die Anfrage erlaubt und laeuft in
// die IP-Begrenzung unten.
export function fremdeHerkunft(req) {
    if (req.headers?.['sec-fetch-site'] === 'cross-site') return true
    const origin = String(req.headers?.origin || '').trim()
    if (!origin) return false
    if (ERLAUBTE_ORIGINS.has(origin)) return false
    return !/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
}

// Bewusste Vereinfachung: Zaehler im Speicher der laufenden Function-Instanz.
// Bremst einfache Spam-Schleifen gegen Resend und Slack ohne externe Datenbank;
// Grenze: verteilt sich Last auf mehrere Instanzen oder startet eine Instanz
// neu, zaehlt jede fuer sich. Ausweg bei Botnetz-Volumen: Upstash/Vercel WAF.
const FORMULAR_ZAEHLER = new Map()
const MAX_EINTRAG_ZAHL = 2000

export function formularLimitZuruecksetzen() {
    FORMULAR_ZAEHLER.clear()
}

export function formularLimitPruefen(req, { max = 5, fensterMs = 10 * 60 * 1000, jetzt = Date.now() } = {}) {
    const ip = String(req.headers?.['x-real-ip'] || req.headers?.['x-forwarded-for'] || '')
        .split(',')[0]
        .trim()
    if (!ip) return { erlaubt: true }

    if (FORMULAR_ZAEHLER.size > MAX_EINTRAG_ZAHL) {
        for (const [schluessel, zeiten] of FORMULAR_ZAEHLER) {
            if (zeiten.every((t) => jetzt - t >= fensterMs)) FORMULAR_ZAEHLER.delete(schluessel)
        }
    }

    const aktiv = (FORMULAR_ZAEHLER.get(ip) || []).filter((t) => jetzt - t < fensterMs)
    if (aktiv.length >= max) {
        const retryAfter = Math.max(1, Math.ceil((fensterMs - (jetzt - aktiv[0])) / 1000))
        FORMULAR_ZAEHLER.set(ip, aktiv)
        return { erlaubt: false, retryAfter }
    }
    aktiv.push(jetzt)
    FORMULAR_ZAEHLER.set(ip, aktiv)
    return { erlaubt: true }
}
