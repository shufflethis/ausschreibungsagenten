// Eingabepruefung der Formular-Functions (Kontakt, Pilotanfrage, Signup).
export function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, maxLength)
}

export function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 320
}

// Zeitlimit fuer ausgehende Aufrufe (Resend, Slack, Backend).
export const ZEITLIMIT_MS = 10000
