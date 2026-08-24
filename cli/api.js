// Der Client spricht ausschliesslich die anonym erreichbaren Endpunkte der
// oeffentlichen API an. Ein API-Key ist optional und hebt nur das Limit;
// ohne Key sind es 60 Anfragen pro Stunde.
export const STANDARD_BASIS = 'https://www.ausschreibungsagenten.de'

export function basis() {
    return (process.env.AUSSCHREIBUNGSAGENTEN_API_BASE || STANDARD_BASIS).replace(/\/+$/, '')
}

// Fehler der API kommen als application/problem+json mit code, message und
// resolution. Genau diese Felder gibt die CLI weiter, statt sie hinter
// einem eigenen Text zu verstecken.
export class ApiFehler extends Error {
    constructor(status, problem) {
        const text = problem?.message || problem?.title || `HTTP ${status}`
        super(text)
        this.name = 'ApiFehler'
        this.status = status
        this.code = problem?.code ?? null
        this.resolution = problem?.resolution ?? null
    }
}

async function hole(pfad, parameter = {}, { fetchImpl = fetch } = {}) {
    const url = new URL(pfad, basis())
    for (const [schluessel, wert] of Object.entries(parameter)) {
        if (wert !== undefined && wert !== null && wert !== '') url.searchParams.set(schluessel, String(wert))
    }

    // Die API kennt ausschliesslich HTTP Bearer. Ein X-API-Key-Header
    // wird nicht etwa abgelehnt, sondern ignoriert: die Anfrage gilt als
    // nicht angemeldet und laeuft ins anonyme Limit.
    const kopf = { Accept: 'application/json' }
    if (process.env.AUSSCHREIBUNGSAGENTEN_API_KEY) {
        kopf.Authorization = `Bearer ${process.env.AUSSCHREIBUNGSAGENTEN_API_KEY}`
    }

    const antwort = await fetchImpl(url, { headers: kopf })
    const rumpf = await antwort.text()
    let daten = null
    try {
        daten = rumpf ? JSON.parse(rumpf) : null
    } catch {
        daten = null
    }

    if (!antwort.ok) throw new ApiFehler(antwort.status, daten)
    if (daten === null) throw new ApiFehler(antwort.status, { message: 'Antwort war kein JSON.' })
    return daten
}

export function sucheTender(optionen, umgebung) {
    return hole('/api/tenders-public', {
        search: optionen.begriff,
        country: optionen.land,
        cpv: optionen.cpv,
        min_score: optionen.mindestScore,
        limit: optionen.limit,
        offset: optionen.offset,
        summary_lang: optionen.sprache,
    }, umgebung)
}

export function quellenStatus(umgebung) {
    return hole('/api/source-status', {}, umgebung)
}

export function laender(umgebung) {
    return hole('/api/countries', {}, umgebung)
}
