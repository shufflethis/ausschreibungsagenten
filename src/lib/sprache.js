// Sprache der Go/No-Go-Tafel.
//
// Die Tafel ist die Flaeche, auf der Mensch und Agent gemeinsam arbeiten.
// Sie muss der Mensch lesen koennen - und wer die Seite mit einem
// englischen Browser oeffnet, kann „3 Lose - eine Bewerbung auf einzelne
// Lose ist moeglich" nicht lesen. Die Begruendungen folgen deshalb der
// Browsersprache.
//
// Bewusst nur die Tafel und nicht die ganze Seite: Der Rest ist
// Marketingtext fuer den deutschen Markt. Uebersetzt wird die Flaeche,
// auf der zusammengearbeitet wird - dieselbe Sprache fuer Mensch und
// Agent, damit beide dasselbe vor sich haben.
//
// Fuer die internationale Marke tender-agents.com ist das die Vorarbeit:
// die Texte liegen dann schon getrennt vom Code.

export const SPRACHEN = ['de', 'en']
export const STANDARDSPRACHE = 'de'

// SSR-sicher: scripts/prerender.mjs rendert ohne `navigator`. Dort - und
// bei jedem deutschen Besucher - bleibt es bei Deutsch.
// Der Standardwert steht bewusst in der Signatur und nicht als `??` im
// Rumpf: so bedeutet ein ausdruecklich uebergebenes `null` auch wirklich
// „kein navigator" und faellt nicht auf den echten zurueck.
export function spracheErmitteln(nav = typeof navigator === 'undefined' ? null : navigator) {
    if (!nav) return STANDARDSPRACHE
    const kandidaten = Array.isArray(nav.languages) && nav.languages.length > 0 ? nav.languages : [nav.language]
    for (const eintrag of kandidaten) {
        if (typeof eintrag !== 'string') continue
        const basis = eintrag.toLowerCase().split('-')[0]
        // Die erste Sprache, zu der wir ueberhaupt etwas anzubieten haben,
        // gewinnt. Steht Deutsch vor Englisch, bleibt es Deutsch.
        if (SPRACHEN.includes(basis)) return basis
    }
    // Weder Deutsch noch Englisch: Englisch ist die bessere Vermutung -
    // ein franzoesischer Browser kommt damit weiter als mit Deutsch.
    return 'en'
}
