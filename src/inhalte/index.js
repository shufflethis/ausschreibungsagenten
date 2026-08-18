import { ausschreibungssucheAutomatisieren } from './ausschreibungssucheAutomatisieren'
import { kiAngebotAusschreibung } from './kiAngebotAusschreibung'
import { semantischeSucheAusschreibungen } from './semantischeSucheAusschreibungen'
import { vergabepilotAlternative } from './vergabepilotAlternative'
import { vergabefixAlternative } from './vergabefixAlternative'
import { tenderflowAlternative } from './tenderflowAlternative'

// Alle Inhaltsseiten an einer Stelle. src/inhalte.test.js prueft jede
// davon gegen die Form aus der Spec: Direktantwort in 40-60 Woertern,
// drei bis fuenf FAQ-Eintraege, Abgrenzungsblock, Faktenblock mit
// Datenstand, mindestens zwei Querverweise auf bestehende Routen.
export const inhaltsSeiten = [
    ausschreibungssucheAutomatisieren,
    kiAngebotAusschreibung,
    semantischeSucheAusschreibungen,
    vergabepilotAlternative,
    vergabefixAlternative,
    tenderflowAlternative,
]

export function inhaltsSeiteFuer(path) {
    return inhaltsSeiten.find((seite) => seite.path === path)
}
