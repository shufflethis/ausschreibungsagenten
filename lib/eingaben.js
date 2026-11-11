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
