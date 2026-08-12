import InhaltsSeite from '../components/InhaltsSeite'
import { inhaltsSeiteFuer } from '../inhalte'

// Duenne Seitenkomponenten: der gesamte Inhalt liegt in src/inhalte,
// die Form gibt die Schablone vor.
function seite(path) {
    const daten = inhaltsSeiteFuer(path)
    if (!daten) throw new Error(`Keine Inhaltsdaten fuer ${path}`)
    return function Seite() {
        return <InhaltsSeite seite={daten} />
    }
}

export const AusschreibungssucheAutomatisieren = seite('/ausschreibungssuche-automatisieren')
export const KiAngebotAusschreibung = seite('/ki-angebot-ausschreibung')
export const SemantischeSucheAusschreibungen = seite('/semantische-suche-ausschreibungen')
