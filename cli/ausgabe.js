// Die Textausgabe ist bewusst zeilenweise und ohne Rahmen: sie wird
// haeufiger von grep, awk und Agenten gelesen als von Menschen im
// Terminal. Wer strukturiert weiterarbeiten will, nimmt --json.
function datum(wert) {
    if (!wert) return '—'
    return String(wert).slice(0, 10)
}

function geld(wert) {
    if (wert === null || wert === undefined) return '—'
    return `${Number(wert).toLocaleString('de-DE')} EUR`
}

export function tenderZeilen(treffer) {
    if (!treffer.length) return ['Keine Treffer. Weniger Filter oder ein anderer Suchbegriff hilft meist.']

    const zeilen = []
    for (const t of treffer) {
        zeilen.push(t.title || '(ohne Titel)')
        zeilen.push(`  Auftraggeber : ${t.buyer_name || '—'} (${t.buyer_country || '—'})`)
        zeilen.push(`  Ort          : ${t.performance_location || '—'}`)
        zeilen.push(`  CPV          : ${[t.cpv_main, ...(t.cpv_additional || [])].filter(Boolean).join(', ') || '—'}`)
        zeilen.push(`  Frist        : ${datum(t.deadline_at)}   Veroeffentlicht: ${datum(t.published_at)}`)
        zeilen.push(`  Wert         : ${geld(t.estimated_value_eur)}   Score: ${t.relevance_score ?? '—'}`)
        zeilen.push(`  Quelle       : ${t.source || '—'} — ${t.source_url || '—'}`)
        if (t.summary) zeilen.push(`  KI-Kurzfassung: ${t.summary}`)
        zeilen.push('')
    }
    zeilen.push(`${treffer.length} Treffer. Massgeblich ist immer die verlinkte Originalbekanntmachung.`)
    return zeilen
}

export function quellenZeilen(quellen) {
    const zeilen = []
    for (const q of quellen) {
        const stand = q.last_success_at ? q.last_success_at.replace('T', ' ').slice(0, 16) : 'nie'
        zeilen.push(
            `${(q.source || '—').padEnd(14)} ${(q.implementation_status || '—').padEnd(10)}`
            + ` letzter Erfolg: ${stand}   gespeichert: ${q.stored ?? '—'}`
            + (q.last_error ? `   Fehler: ${q.last_error}` : ''),
        )
    }
    zeilen.push(`${quellen.length} Quellen.`)
    return zeilen
}

export function laenderZeilen(eintraege) {
    const zeilen = eintraege.map((e) => `${(e.country || '—').padEnd(6)} ${String(e.count ?? 0).padStart(7)}`)
    const summe = eintraege.reduce((s, e) => s + (e.count || 0), 0)
    zeilen.push(`${eintraege.length} Laender, ${summe.toLocaleString('de-DE')} offene Verfahren im Index.`)
    return zeilen
}
