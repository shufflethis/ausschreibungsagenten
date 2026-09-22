// Speicher der gemeinsamen Go/No-Go-Merkliste.
//
// Die Merkliste ist der Ort, an dem Mensch und Agent auf dieselbe Tafel
// schauen: der Agent legt Treffer darauf und begruendet sie, der Mensch
// entscheidet und ueberstimmt. Sie ueberlebt das Neuladen, damit eine
// halb fertige Vorauswahl nicht an einem versehentlichen F5 stirbt.
//
// Bewusst localStorage und kein Cookie: die Liste ist eine reine
// Arbeitshilfe im Browser, sie geht nirgendwo hin. Damit ist sie
// technisch notwendig im Sinne von § 25 TDDDG und braucht keine
// Einwilligung - anders als der Partner-Code in src/lib/partnerCode.js.

export const MERKLISTE_SCHLUESSEL = 'aa_merkliste'

// Hoechstzahl gespeicherter Eintraege. Die Merkliste ist eine Vorauswahl,
// keine Ablage; ohne Grenze waechst sie mit jedem Agentenlauf weiter.
export const MERKLISTE_GRENZE = 25

function speicherOder(speicher) {
    if (speicher) return speicher
    if (typeof localStorage === 'undefined') return null
    try {
        // Bei blockierten Cookies wirft schon der Zugriff.
        localStorage.getItem(MERKLISTE_SCHLUESSEL)
        return localStorage
    } catch {
        return null
    }
}

// Legt einen Eintrag an. `gruende` gehoert bewusst nicht dazu: Fristen
// altern, also werden die Gruende bei jedem Laden neu berechnet.
export function eintragAnlegen(tender, { notiz = '', entscheidung = null } = {}) {
    return { id: String(tender?.id ?? ''), tender, entscheidung, notiz, gruende: [] }
}

// Liest die Liste. Jeder Fehler - kein Speicher, kaputtes JSON, fremde
// Struktur - endet in einer leeren Liste. Eine unlesbare Merkliste ist
// aergerlich, eine geworfene Ausnahme beim Seitenaufbau waere schlimmer.
export function merklisteLesen(speicher) {
    const s = speicherOder(speicher)
    if (!s) return []
    try {
        const roh = JSON.parse(s.getItem(MERKLISTE_SCHLUESSEL) || '[]')
        if (!Array.isArray(roh)) return []
        return roh
            .filter((eintrag) => eintrag && typeof eintrag === 'object' && eintrag.id && eintrag.tender)
            .slice(0, MERKLISTE_GRENZE)
            .map((eintrag) => ({
                id: String(eintrag.id),
                tender: eintrag.tender,
                entscheidung: ['go', 'no_go'].includes(eintrag.entscheidung) ? eintrag.entscheidung : null,
                notiz: typeof eintrag.notiz === 'string' ? eintrag.notiz : '',
                criteria: eintrag.criteria && typeof eintrag.criteria === 'object' ? eintrag.criteria : {},
                evidence: Object.fromEntries(Object.entries(eintrag.evidence || {}).filter(([, value]) => ['available', 'missing'].includes(value))),
                gruende: [],
            }))
    } catch {
        return []
    }
}

export function merklisteSchreiben(liste, speicher) {
    const s = speicherOder(speicher)
    if (!s) return false
    try {
        const schlank = (Array.isArray(liste) ? liste : []).slice(0, MERKLISTE_GRENZE).map((eintrag) => ({
            id: eintrag.id,
            tender: eintrag.tender,
            entscheidung: eintrag.entscheidung,
            notiz: eintrag.notiz,
            criteria: eintrag.criteria,
            evidence: eintrag.evidence,
        }))
        s.setItem(MERKLISTE_SCHLUESSEL, JSON.stringify(schlank))
        return true
    } catch {
        // Voller oder gesperrter Speicher darf die Merkliste der laufenden
        // Sitzung nicht beenden - sie lebt dann nur bis zum Neuladen.
        return false
    }
}
