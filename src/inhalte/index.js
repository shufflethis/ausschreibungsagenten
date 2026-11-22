import { ausschreibungssucheAutomatisieren } from './ausschreibungssucheAutomatisieren'
import { kiAngebotAusschreibung } from './kiAngebotAusschreibung'
import { semantischeSucheAusschreibungen } from './semantischeSucheAusschreibungen'
import { vergabepilotAlternative } from './vergabepilotAlternative'
import { dtadAlternative } from './dtadAlternative'
import { vergabe24Alternative } from './vergabe24Alternative'
import { ibauAlternative } from './ibauAlternative'
import { vergabefixAlternative } from './vergabefixAlternative'
import { tenderflowAlternative } from './tenderflowAlternative'
import { partnerprogramm } from './partnerprogramm'
import { besteSoftwareAutomatischeAusschreibungssuche } from './besteSoftwareAutomatischeAusschreibungssuche'
import { bauauftraegeFinden } from './bauauftraegeFinden'
import { ausschreibungenIt } from './ausschreibungenIt'
import { ausschreibungenArchitektur } from './ausschreibungenArchitektur'
import { ausschreibungenMarketing } from './ausschreibungenMarketing'
import { ausschreibungenElektroShk } from './ausschreibungenElektroShk'
import { ausschreibungenNrw } from './ausschreibungenNrw'
import { ausschreibungenBayern } from './ausschreibungenBayern'
import { ausschreibungenBerlin } from './ausschreibungenBerlin'
import { ausschreibungenHessen } from './ausschreibungenHessen'
import { ausschreibungenBadenWuerttemberg } from './ausschreibungenBadenWuerttemberg'

// Alle Inhaltsseiten an einer Stelle. src/inhalte.test.js prueft jede
// davon gegen die Form aus der Spec: Direktantwort in 40-60 Woertern,
// drei bis fuenf FAQ-Eintraege, Abgrenzungsblock, Faktenblock mit
// Datenstand, mindestens zwei Querverweise auf bestehende Routen.
export const inhaltsSeiten = [
    ausschreibungssucheAutomatisieren,
    kiAngebotAusschreibung,
    semantischeSucheAusschreibungen,
    vergabepilotAlternative,
    dtadAlternative,
    vergabe24Alternative,
    ibauAlternative,
    vergabefixAlternative,
    tenderflowAlternative,
    partnerprogramm,
    besteSoftwareAutomatischeAusschreibungssuche,
    bauauftraegeFinden,
    ausschreibungenIt,
    ausschreibungenArchitektur,
    ausschreibungenMarketing,
    ausschreibungenElektroShk,
    ausschreibungenNrw,
    ausschreibungenBayern,
    ausschreibungenBerlin,
    ausschreibungenHessen,
    ausschreibungenBadenWuerttemberg,
]

export function inhaltsSeiteFuer(path) {
    return inhaltsSeiten.find((seite) => seite.path === path)
}
