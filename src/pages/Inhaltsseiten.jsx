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
export const VergabepilotAlternative = seite('/vergabepilot-alternative')
export const DtadAlternative = seite('/dtad-alternative')
export const Vergabe24Alternative = seite('/vergabe24-alternative')
export const IbauAlternative = seite('/ibau-alternative')
export const VergabefixAlternative = seite('/vergabefix-alternative')
export const TenderflowAlternative = seite('/tenderflow-alternative')
export const Partnerprogramm = seite('/partner')
export const BesteSoftwareAutomatischeAusschreibungssuche = seite('/beste-software-automatische-ausschreibungssuche')
export const BauauftraegeFinden = seite('/bauauftraege-finden')
export const AusschreibungenIt = seite('/ausschreibungen-it')
export const AusschreibungenArchitektur = seite('/ausschreibungen-architektur')
export const AusschreibungenMarketing = seite('/ausschreibungen-marketing')
export const AusschreibungenElektroShk = seite('/ausschreibungen-elektro-shk')
export const AusschreibungenNrw = seite('/ausschreibungen-nrw')
export const AusschreibungenBayern = seite('/ausschreibungen-bayern')
export const AusschreibungenBerlin = seite('/ausschreibungen-berlin')
export const AusschreibungenHessen = seite('/ausschreibungen-hessen')
export const AusschreibungenBadenWuerttemberg = seite('/ausschreibungen-baden-wuerttemberg')
