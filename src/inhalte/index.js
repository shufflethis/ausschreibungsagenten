import { ausschreibungssucheAutomatisieren } from './ausschreibungssucheAutomatisieren'
import { kiAngebotAusschreibung } from './kiAngebotAusschreibung'
import { semantischeSucheAusschreibungen } from './semantischeSucheAusschreibungen'

// Alle Inhaltsseiten an einer Stelle. src/inhalte.test.js prueft jede
// davon gegen die Form aus der Spec: Direktantwort in 40-60 Woertern,
// drei bis fuenf FAQ-Eintraege, Abgrenzungsblock, Faktenblock mit
// Datenstand, mindestens zwei Querverweise auf bestehende Routen.
export const inhaltsSeiten = [
    ausschreibungssucheAutomatisieren,
    kiAngebotAusschreibung,
    semantischeSucheAusschreibungen,
]

export function inhaltsSeiteFuer(path) {
    return inhaltsSeiten.find((seite) => seite.path === path)
}
