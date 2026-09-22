import { fristText } from './vergabe'

// Bewusst auf diesem Gerät: kein Konto und kein E-Mail-Versand erforderlich.
// Pro Suche vergleichen wir die ersten 25 Treffer und die zuletzt beobachteten
// 25 IDs. Breite Suchen können weitere Treffer enthalten; die UI benennt die Grenze.
export const SUCHAUFTRAEGE_KEY = 'aa_suchauftraege_v1'
export const SUCHAUFTRAEGE_LIMIT = 8

export function suchkriterien(value = {}) {
    if (!value || typeof value !== 'object') value = {}
    const text = (key, limit = 160) => typeof value[key] === 'string' ? value[key].trim().slice(0, limit) : ''
    return { search: text('search'), region: text('region'), vertical: text('vertical', 40),
        country: /^[A-Z]{3}$/.test(value.country) ? value.country : 'DEU',
        exclusions: text('exclusions', 300), minimumDays: Math.min(90, Math.max(0, Number(value.minimumDays) || 0)) }
}

export function suchparameter(criteria, { limit = 25, offset = 0 } = {}) {
    const c = suchkriterien(criteria)
    const params = new URLSearchParams({ country: c.country, search: c.search, min_score: '0', limit: String(limit), offset: String(offset), summary_lang: 'de' })
    if (c.region) params.set('performance_region', c.region)
    if (c.vertical) params.set('vertical', c.vertical)
    return params
}

export function suchauftragLesen(storage) {
    try {
        storage ||= globalThis.localStorage
        const rows = JSON.parse(storage.getItem(SUCHAUFTRAEGE_KEY) || '[]')
        return Array.isArray(rows) ? rows.filter((row) => row && typeof row.id === 'string' && row.criteria && Array.isArray(row.snapshots))
            .slice(0, SUCHAUFTRAEGE_LIMIT).map((row) => ({ ...row, criteria: suchkriterien(row.criteria),
                checkedAt: Number.isFinite(Date.parse(row.checkedAt)) ? row.checkedAt : null,
                snapshots: row.snapshots.filter(validTender).slice(0, 25).map(snapshot),
                updates: Array.isArray(row.updates) ? row.updates.filter((u) => u && typeof u.fingerprint === 'string' && typeof u.label === 'string' && ['new', 'deadline', 'documents'].includes(u.kind) && validTender(u.tender)).slice(0, 50) : [] })) : []
    } catch { return [] }
}

export function suchauftragSchreiben(rows, storage) {
    try { (storage || globalThis.localStorage).setItem(SUCHAUFTRAEGE_KEY, JSON.stringify(rows.slice(0, SUCHAUFTRAEGE_LIMIT))); return true } catch { return false }
}

function validTender(tender) { return tender && typeof tender.id === 'string' && typeof tender.title === 'string' }

function snapshot(tender) {
    return { id: tender.id, title: tender.title, buyer_name: typeof tender.buyer_name === 'string' ? tender.buyer_name : '', source_url: tender.source_url,
        deadline_at: tender.deadline_at || null, deadline_text: typeof tender.deadline_text === 'string' ? tender.deadline_text : fristText(tender), document_revision: tender.document_revision || null }
}

function identity(tender) {
    return [tender.title, tender.buyer_name || ''].map((s) => s.toLocaleLowerCase('de').replace(/[^\p{L}\p{N}]+/gu, ' ').trim()).join('|')
}

export function neuerSuchauftrag(criteria, tenders, now = new Date().toISOString()) {
    return { id: globalThis.crypto.randomUUID(), criteria: suchkriterien(criteria), createdAt: now, checkedAt: now,
        snapshots: tenders.slice(0, 25).map(snapshot), updates: [] }
}

export function suchauftragVergleichen(saved, current, watched = [], now = new Date().toISOString()) {
    const old = new Map(saved.snapshots.map((row) => [identity(row), row]))
    const latest = new Map([...watched, ...current].map((row) => [identity(row), row]))
    const currentKeys = new Set(current.map(identity))
    const updates = [...saved.updates]
    for (const [key, row] of latest) {
        const before = old.get(key)
        const add = (kind, label, previous, value) => {
            const fingerprint = `${key}|${kind}|${value || ''}`
            if (!updates.some((u) => u.fingerprint === fingerprint)) updates.unshift({ fingerprint, kind, label, previous, value, previousLabel: before?.deadline_text, valueLabel: snapshot(row).deadline_text, tender: snapshot(row), at: now })
        }
        if (!before && currentKeys.has(key)) add('new', 'Neu gefunden', null, row.id)
        if (before && (Date.parse(before.deadline_at) || null) !== (Date.parse(row.deadline_at) || null)) add('deadline', before.deadline_at ? 'Frist geändert' : 'Frist ergänzt', before.deadline_at, row.deadline_at || null)
        if (before && row.document_revision && before.document_revision !== row.document_revision) add('documents', before.document_revision ? 'Unterlagen geändert' : 'Unterlagen erstmals erfasst', before.document_revision, row.document_revision)
    }
    // Poll timestamps are intentionally ignored: only actual values produce news.
    return { ...saved, checkedAt: now, snapshots: [...current, ...watched, ...saved.snapshots].filter((row, i, all) => all.findIndex((r) => identity(r) === identity(row)) === i).slice(0, 25).map(snapshot), updates: updates.slice(0, 50) }
}
