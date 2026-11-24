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
import { kiFoerderungUnternehmen } from './kiFoerderungUnternehmen'
import { foerderungKiHardwareInvestitionsbooster } from './foerderungKiHardwareInvestitionsbooster'
import { foerdermittelKalender2027 } from './foerdermittelKalender2027'
import { bafaFoerderung2027 } from './bafaFoerderung2027'
import { evbItVertrag } from './evbItVertrag'
import { praequalifizierungPqVobVol } from './praequalifizierungPqVobVol'
import { ausschreibungenNiedersachsen } from './ausschreibungenNiedersachsen'
import { ausschreibungenHamburg } from './ausschreibungenHamburg'
import { ausschreibungenBrandenburg } from './ausschreibungenBrandenburg'
import { ausschreibungenSachsen } from './ausschreibungenSachsen'
import { ausschreibungenSchleswigHolstein } from './ausschreibungenSchleswigHolstein'
import { ausschreibungenSaarland } from './ausschreibungenSaarland'

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
    kiFoerderungUnternehmen,
    foerderungKiHardwareInvestitionsbooster,
    foerdermittelKalender2027,
    bafaFoerderung2027,
    evbItVertrag,
    praequalifizierungPqVobVol,
    ausschreibungenNiedersachsen,
    ausschreibungenHamburg,
    ausschreibungenBrandenburg,
    ausschreibungenSachsen,
    ausschreibungenSchleswigHolstein,
    ausschreibungenSaarland,
]

export function inhaltsSeiteFuer(path) {
    return inhaltsSeiten.find((seite) => seite.path === path)
}
