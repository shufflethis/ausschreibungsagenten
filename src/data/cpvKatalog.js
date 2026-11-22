// Kuratierter deutscher CPV-Katalog fuer die interaktive CPV-Code-Suche
// (/cpv-code-suche). Deckt alle 20 staerksten deutschen TED-Divisionen plus
// zentrale Bau-, Planungs-, IT- und Dienstleistungs-Gruppen ab.
// `suche` und optional `gewerk` verlinken direkt in die Live-Suche auf `/`.

export const CPV_KATALOG = [
    // Bauarbeiten (Abteilung 45)
    { code: '45000000', titel: 'Bauarbeiten (Gesamt)', kategorie: 'Bau & Handwerk', schlagwoerter: 'bau bauauftrag vob gewerk', gewerk: 'bau' },
    { code: '45110000', titel: 'Abbruch- und Erdbewegungsarbeiten', kategorie: 'Bau & Handwerk', schlagwoerter: 'abbruch erdbau baugrube entsorgung', gewerk: 'bau' },
    { code: '45112700', titel: 'Landschaftsgärtnerische Arbeiten (GaLaBau)', kategorie: 'Bau & Handwerk', schlagwoerter: 'galabau garten landschaftsbau grünflächen außenanlagen', suche: 'Landschaftsbau' },
    { code: '45210000', titel: 'Hochbauarbeiten', kategorie: 'Bau & Handwerk', schlagwoerter: 'hochbau rohbau schulbau neubau gebäude', gewerk: 'hochbau' },
    { code: '45212200', titel: 'Bauarbeiten für Sport- und Freizeitanlagen', kategorie: 'Bau & Handwerk', schlagwoerter: 'sporthalle schwimmbad sportplatz', gewerk: 'hochbau' },
    { code: '45214000', titel: 'Bau von Bildungs- und Forschungseinrichtungen', kategorie: 'Bau & Handwerk', schlagwoerter: 'schule kita universität bildungsbau', gewerk: 'hochbau' },
    { code: '45220000', titel: 'Ingenieurbau und Tiefbau', kategorie: 'Bau & Handwerk', schlagwoerter: 'tiefbau brückenbau ingenieurbau', gewerk: 'tiefbau' },
    { code: '45230000', titel: 'Rohrleitungs-, Fernmelde-, Straßen- und Wegebau', kategorie: 'Bau & Handwerk', schlagwoerter: 'straßenbau kanalbau leitungsbau glasfaser kabeltiefbau', gewerk: 'tiefbau' },
    { code: '45260000', titel: 'Dachdeckungs- und Spezialbauarbeiten', kategorie: 'Bau & Handwerk', schlagwoerter: 'dachdecker dach zimmerer gerüstbau betonbau', gewerk: 'dach_spezialbau' },
    { code: '45261000', titel: 'Errichtung und Eindeckung von Dächern', kategorie: 'Bau & Handwerk', schlagwoerter: 'flachdach steildach dachsanierung klempner', gewerk: 'dach_spezialbau' },
    { code: '45262100', titel: 'Gerüstbauarbeiten', kategorie: 'Bau & Handwerk', schlagwoerter: 'gerüst fassadengerüst schutzgerüst', gewerk: 'dach_spezialbau' },
    { code: '45262300', titel: 'Betonarbeiten', kategorie: 'Bau & Handwerk', schlagwoerter: 'stahlbeton beton fundament rohbau', gewerk: 'dach_spezialbau' },
    { code: '45262500', titel: 'Maurer- und Mauerwerksarbeiten', kategorie: 'Bau & Handwerk', schlagwoerter: 'maurer mauerwerk klinker', gewerk: 'dach_spezialbau' },
    { code: '45300000', titel: 'Bauinstallationsarbeiten (TGA, Elektro, SHK)', kategorie: 'Elektro & SHK', schlagwoerter: 'tga haustechnik installation gebäudetechnik', gewerk: 'haustechnik' },
    { code: '45310000', titel: 'Elektroinstallationsarbeiten', kategorie: 'Elektro & SHK', schlagwoerter: 'elektro elektriker beleuchtung photovoltaik pv brandmelde', gewerk: 'haustechnik', suche: 'Elektro' },
    { code: '45320000', titel: 'Dämmarbeiten', kategorie: 'Elektro & SHK', schlagwoerter: 'wdvs wärmedämmung brandschutzisolierung dämmung', gewerk: 'haustechnik' },
    { code: '45330000', titel: 'Klempner- und Sanitärinstallationsarbeiten (SHK)', kategorie: 'Elektro & SHK', schlagwoerter: 'shk heizung lüftung sanitär klima wärmepumpe rlt', gewerk: 'haustechnik', suche: 'Heizung' },
    { code: '45340000', titel: 'Zäune, Geländer und Sicherheitsvorrichtungen', kategorie: 'Fenster, Fassade & Metallbau', schlagwoerter: 'metallbau zaun geländer schlosser', gewerk: 'facade_construction' },
    { code: '45400000', titel: 'Baufertigstellung (Ausbaugewerke)', kategorie: 'Ausbau & Fassade', schlagwoerter: 'ausbau innenausbau trockenbau estrich', gewerk: 'ausbau' },
    { code: '45420000', titel: 'Bautischlerei- und Einbauarbeiten (Fenster & Türen)', kategorie: 'Fenster, Fassade & Metallbau', schlagwoerter: 'fenster türen tischler schreiner sonnenschutz brandschutztür', gewerk: 'facade_construction', suche: 'Fenster' },
    { code: '45421100', titel: 'Einbau von Türen und Fenstern', kategorie: 'Fenster, Fassade & Metallbau', schlagwoerter: 'fenstermontage aluminiumfenster kunststofffenster holzfenster', gewerk: 'facade_construction', suche: 'Fenster' },
    { code: '45430000', titel: 'Boden- und Wandverkleidungsarbeiten', kategorie: 'Ausbau & Fassade', schlagwoerter: 'fliesen bodenbelag parkett estrich', gewerk: 'ausbau' },
    { code: '45440000', titel: 'Maler- und Glaserarbeiten', kategorie: 'Ausbau & Fassade', schlagwoerter: 'maler lackierer glaser verglasung fassade', gewerk: 'ausbau', suche: 'Maler' },
    { code: '45443000', titel: 'Fassadenarbeiten', kategorie: 'Fenster, Fassade & Metallbau', schlagwoerter: 'fassade pfosten-riegel vorgehängte hinterlüftete fassade metallfassade', gewerk: 'facade_construction', suche: 'Fassade' },
    { code: '45450000', titel: 'Sonstige Baufertigstellung (Sanierung & Umbau)', kategorie: 'Ausbau & Fassade', schlagwoerter: 'sanierung umbau modernisierung trockenbau', gewerk: 'ausbau' },
    { code: '44221000', titel: 'Fenster, Türen und dazugehörige Artikel (Lieferung)', kategorie: 'Fenster, Fassade & Metallbau', schlagwoerter: 'fenster türen lieferung metallbau bauelemente', gewerk: 'facade_construction', suche: 'Fenster' },

    // Architektur & Ingenieurleistungen (Abteilung 71)
    { code: '71000000', titel: 'Architektur-, Bau-, Ingenieur- und Inspektionsleistungen', kategorie: 'Architektur & Planung', schlagwoerter: 'architekt ingenieur hoai planung gutachten', gewerk: 'planning' },
    { code: '71200000', titel: 'Dienstleistungen von Architekturbüros', kategorie: 'Architektur & Planung', schlagwoerter: 'objektplanung architektur gebäudeplanung vgv', gewerk: 'planning', suche: 'Objektplanung' },
    { code: '71240000', titel: 'Architektur-, Ingenieur- und Planungsleistungen', kategorie: 'Architektur & Planung', schlagwoerter: 'leistungsphasen lph bauüberwachung machbarkeitsstudie', gewerk: 'planning' },
    { code: '71300000', titel: 'Dienstleistungen von Ingenieurbüros', kategorie: 'Architektur & Planung', schlagwoerter: 'tragwerksplanung tga-planung statik verkehrsanlagen', gewerk: 'planning', suche: 'Tragwerksplanung' },
    { code: '71320000', titel: 'Technische Planungsleistungen (TGA / Statik / Tiefbau)', kategorie: 'Architektur & Planung', schlagwoerter: 'technische ausrüstung elektroplanung heizungsplanung', gewerk: 'planning' },
    { code: '71400000', titel: 'Stadtplanung und Landschaftsgestaltung', kategorie: 'Architektur & Planung', schlagwoerter: 'stadtplanung bauleitplanung freianlagen landschaftsarchitektur', gewerk: 'planning' },
    { code: '71500000', titel: 'Dienstleistungen im Bauwesen (Projektsteuerung / SiGeKo)', kategorie: 'Architektur & Planung', schlagwoerter: 'projektsteuerung bauleitung sigeko kostenkontrolle', gewerk: 'planning', suche: 'Projektsteuerung' },

    // IT & Software (Abteilungen 72 & 48)
    { code: '72000000', titel: 'IT-Dienste: Beratung, Softwareentwicklung, Internet', kategorie: 'IT & Software', schlagwoerter: 'it software digitalisierung cloud beratung entwicklung', suche: 'IT' },
    { code: '72200000', titel: 'Softwareprogrammierung und -beratung', kategorie: 'IT & Software', schlagwoerter: 'softwareentwicklung programmierung app webentwicklung agile', suche: 'Softwareentwicklung' },
    { code: '72260000', titel: 'Softwarebezogene Dienstleistungen (Wartung / Support)', kategorie: 'IT & Software', schlagwoerter: 'softwarewartung support betrieb pflege', suche: 'Software' },
    { code: '72400000', titel: 'Internetdienste (Webdesign, CMS, Hosting)', kategorie: 'IT & Software', schlagwoerter: 'website typo3 cms barrierefrei webdesign portal', suche: 'Website' },
    { code: '72500000', titel: 'Datenverarbeitungsdienste & IT-Betrieb', kategorie: 'IT & Software', schlagwoerter: 'managed services rechenzentrum hosting betrieb', suche: 'IT-Betrieb' },
    { code: '72600000', titel: 'EDV-Unterstützung und -Beratung (IT-Sicherheit)', kategorie: 'IT & Software', schlagwoerter: 'it-sicherheit cyber security bsi isms pentest', suche: 'IT-Sicherheit' },
    { code: '48000000', titel: 'Softwarepakete und Informationssysteme (Lizenzen)', kategorie: 'IT & Software', schlagwoerter: 'softwarelizenz dms erp fachverfahren saas', suche: 'Software' },
    { code: '30200000', titel: 'Computeranlagen und -zubehör (Hardware)', kategorie: 'IT & Software', schlagwoerter: 'notebook server drucker endgeräte hardware', suche: 'Hardware' },

    // Marketing, Kommunikation & Beratung (Abteilung 79)
    { code: '79000000', titel: 'Unternehmensdienste: Recht, Marketing, Beratung, Druck', kategorie: 'Marketing & Beratung', schlagwoerter: 'beratung marketing recht druck event', gewerk: 'marketing' },
    { code: '79340000', titel: 'Werbe- und Marketingdienstleistungen', kategorie: 'Marketing & Beratung', schlagwoerter: 'werbeagentur kampagne social media mediaplanung employer branding', gewerk: 'marketing', suche: 'Marketing' },
    { code: '79410000', titel: 'Unternehmens- und Managementberatung', kategorie: 'Marketing & Beratung', schlagwoerter: 'organisationsberatung strategieberatung consulting vergabeberatung', suche: 'Beratung' },
    { code: '79416000', titel: 'Öffentlichkeitsarbeit (PR & Kommunikation)', kategorie: 'Marketing & Beratung', schlagwoerter: 'pr öffentlichkeitsarbeit pressearbeit kommunikation', gewerk: 'marketing', suche: 'Öffentlichkeitsarbeit' },
    { code: '79800000', titel: 'Druckereidienste und verbundene Dienstleistungen', kategorie: 'Marketing & Beratung', schlagwoerter: 'druck druckerei broschüre flyer print', gewerk: 'marketing' },
    { code: '79952000', titel: 'Veranstaltungsorganisation (Events & Messen)', kategorie: 'Marketing & Beratung', schlagwoerter: 'event veranstaltung messe konferenz', gewerk: 'marketing', suche: 'Veranstaltung' },

    // Reinigung, Umwelt, Facility & Weitere Top-Divisionen
    { code: '90910000', titel: 'Reinigungsdienste (Gebäudereinigung)', kategorie: 'Facility & Dienste', schlagwoerter: 'gebäudereinigung unterhaltsreinigung glasreinigung schulreinigung', suche: 'Reinigung' },
    { code: '90500000', titel: 'Abfall- und Entsorgungsdienste', kategorie: 'Facility & Dienste', schlagwoerter: 'abfall entsorgung müllabfuhr recycling', suche: 'Entsorgung' },
    { code: '79710000', titel: 'Sicherheitsdienste (Wachschutz / Objektschutz)', kategorie: 'Facility & Dienste', schlagwoerter: 'sicherheitsdienst wachschutz objektschutz pforte', suche: 'Sicherheitsdienst' },
    { code: '50000000', titel: 'Reparatur- und Wartungsdienste', kategorie: 'Facility & Dienste', schlagwoerter: 'wartung instandhaltung aufzug heizungswartung', suche: 'Wartung' },
    { code: '55520000', titel: 'Verpflegungsdienste (Catering & Schulverpflegung)', kategorie: 'Facility & Dienste', schlagwoerter: 'catering kantine schulverpflegung kita essen', suche: 'Catering' },
    { code: '34100000', titel: 'Kraftfahrzeuge (Kommunalfahrzeuge / E-Flotte)', kategorie: 'Lieferungen & Technik', schlagwoerter: 'fahrzeug elektroauto nutzfahrzeug feuerwehr', suche: 'Fahrzeug' },
    { code: '33100000', titel: 'Medizinische Geräte', kategorie: 'Lieferungen & Technik', schlagwoerter: 'medizintechnik krankenhaus klinik labor', suche: 'Medizintechnik' },
    { code: '39100000', titel: 'Möbel (Büro- und Schulmöbel)', kategorie: 'Lieferungen & Technik', schlagwoerter: 'büromöbel schulmöbel möblierung ausstattung', suche: 'Möbel' },
    { code: '09310000', titel: 'Elektrizität (Stromlieferung)', kategorie: 'Lieferungen & Technik', schlagwoerter: 'strom ökostrom energie gas lieferung', suche: 'Stromlieferung' },
    { code: '80000000', titel: 'Allgemeine und berufliche Bildung (Schulungen)', kategorie: 'Bildung & Transport', schlagwoerter: 'weiterbildung schulung coaching bildungsträger', suche: 'Weiterbildung' },
    { code: '60100000', titel: 'Straßentransportdienste (ÖPNV & Schülerverkehr)', kategorie: 'Bildung & Transport', schlagwoerter: 'bus schülerbeförderung öpnv transport logistik', suche: 'Beförderung' },
]

export function filtereCpv(anfrage, kategorie = '') {
    const q = String(anfrage ?? '').trim().toLowerCase()
    return CPV_KATALOG.filter((eintrag) => {
        if (kategorie && eintrag.kategorie !== kategorie) return false
        if (!q) return true
        const heuhaufen = `${eintrag.code} ${eintrag.titel} ${eintrag.kategorie} ${eintrag.schlagwoerter}`.toLowerCase()
        return q.split(/\s+/).every((wort) => heuhaufen.includes(wort))
    })
}
