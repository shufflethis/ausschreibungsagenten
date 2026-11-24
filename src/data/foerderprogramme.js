// Verifizierte Foerdermittel-Datenbank 2026/2027 (Bund + 16 Bundeslaender)
// sowie Matching-, Berechnungs- und .ics-Fristenkalender-Logik fuer
// /foerder-und-auftrags-planer. Stand: 24. November 2026.

export const FOERDER_STAND = '24. November 2026'

export const BRANCHEN = [
    { id: 'it', label: 'IT, Software & KI', sub: 'CPV 72 & 48 · EVB-IT, Cloud, Beratung', search: 'Software', cpv: ['72000000', '48000000'] },
    { id: 'bau', label: 'Bau & Handwerk', sub: 'CPV 45 · Hochbau, Ausbau, Sanierung', search: 'Bauarbeiten', cpv: ['45000000'] },
    { id: 'elektro', label: 'Elektro, SHK & Solar', sub: 'CPV 4531 / 4533 · Technik & PV', search: 'Elektro', cpv: ['45310000', '45330000'] },
    { id: 'architektur', label: 'Architektur & Ingenieure', sub: 'CPV 71 · Planung, Gutachten, TGA', search: 'Planungsleistungen', cpv: ['71000000'] },
    { id: 'beratung', label: 'Agentur, Marketing & Beratung', sub: 'CPV 79 · Kommunikation, Strategie', search: 'Beratung', cpv: ['79000000'] },
    { id: 'facility', label: 'Reinigung, Sicherheit & Facility', sub: 'CPV 9091 / 7971 · Gebäudedienste', search: 'Gebäudereinigung', cpv: ['90910000', '79710000'] },
    { id: 'industrie', label: 'Industrie, Logistik & Fertigung', sub: 'CPV 30–44 / 60 · Liefer- & Anlagenbau', search: 'Lieferung', cpv: ['30000000', '60000000'] },
]

export const BUNDESLAENDER = [
    { code: 'BY', name: 'Bayern', nuts: 'DE2', east: false, hint: 'Digitalbonus (Monatskontingent)' },
    { code: 'NW', name: 'Nordrhein-Westfalen', nuts: 'DEA', east: false, hint: 'MID NRW (NRW.BANK)' },
    { code: 'BW', name: 'Baden-Württemberg', nuts: 'DE1', east: false, hint: 'L-Bank Digitalisierung' },
    { code: 'BE', name: 'Berlin', nuts: 'DE3', east: false, hint: 'IBB Pro FIT + Bund' },
    { code: 'BB', name: 'Brandenburg', nuts: 'DE4', east: true, hint: 'BIG-Digital (50 % bis 30.06.27)' },
    { code: 'HH', name: 'Hamburg', nuts: 'DE6', east: false, hint: 'Bund (Digital Check beendet)' },
    { code: 'HE', name: 'Hessen', nuts: 'DE7', east: false, hint: 'RKW Beratung + Bund' },
    { code: 'NI', name: 'Niedersachsen', nuts: 'DE9', east: false, hint: 'Bund (Digitalbonus beendet)' },
    { code: 'SH', name: 'Schleswig-Holstein', nuts: 'DEF', east: false, hint: 'DKU (40 % bis 30.06.27)' },
    { code: 'SN', name: 'Sachsen', nuts: 'DED', east: true, hint: 'SAB (Leipzig offen)' },
    { code: 'ST', name: 'Sachsen-Anhalt', nuts: 'DEE', east: true, hint: 'DIGITAL INNOVATION (50 %)' },
    { code: 'TH', name: 'Thüringen', nuts: 'DEG', east: true, hint: 'TAB InnoInvest (Hardware)' },
    { code: 'RP', name: 'Rheinland-Pfalz', nuts: 'DEB', east: false, hint: 'ISB Beratung + Bund' },
    { code: 'SL', name: 'Saarland', nuts: 'DEC', east: false, hint: 'DigitalInvest KMU (20k €)' },
    { code: 'MV', name: 'Mecklenburg-Vorpommern', nuts: 'DE8', east: true, hint: 'Mittelstand MV (50 %)' },
    { code: 'HB', name: 'Bremen', nuts: 'DE5', east: false, hint: 'Bund + BAB-Check' },
]

export const GROESSEN = [
    { id: 'micro', label: 'Unter 10 Mitarbeitende', sub: 'Kleinstunternehmen · höchste KMU-Quoten' },
    { id: 'small', label: '10 bis 49 Mitarbeitende', sub: 'Kleines KMU · QCG 100 %, DKU & Digitalbonus Standard' },
    { id: 'medium', label: '50 bis 249 Mitarbeitende', sub: 'Mittleres KMU · 35 % Forschungszulage, ZIM, QCG 50 %' },
    { id: 'large', label: '250+ Mitarbeitende', sub: 'Großunternehmen · 25 % Forschungszulage, Investitionsbooster, KfW' },
]

export const VORHABEN = [
    { id: 'ausschreibungen', label: 'Neue öffentliche Aufträge', sub: 'Passende Vergaben aus 18 Live-Quellen sichern' },
    { id: 'ki_hardware', label: 'KI-Hardware / lokale GPU-Server', sub: 'On-Premise-KI, Workstations, DSGVO-Infrastruktur' },
    { id: 'ki_software', label: 'KI-Software & Automatisierung', sub: 'Prozesse, KI-Agenten, eigene KI-Entwicklung (FuE)' },
    { id: 'it_security', label: 'IT-Sicherheit & NIS-2', sub: 'Netzwerk, Backup, Sicherheits-Audits' },
    { id: 'weiterbildung', label: 'Team-Weiterbildung (KI / Vertrieb)', sub: 'QCG-Zuschuss bis 100 % Lehrgangs- + Lohnkosten' },
    { id: 'beratung', label: 'Strategie- & Antragsberatung', sub: 'BAFA-Beratungsförderung (50–80 % bis 2028)' },
]

export const FOERDERPROGRAMME = [
    {
        id: 'bund-forschungszulage',
        name: 'Steuerliche Forschungszulage (FZulG)',
        level: 'bund',
        states: ['ALL'],
        type: 'tax_cashback',
        status: 'OPEN',
        status_label: 'Aktiv & seit 01.01.2026 stark aufgewertet (12 Mio. € Basis)',
        funding_rate_kmu_pct: 35,
        funding_rate_large_pct: 25,
        max_grant_kmu_eur_per_year: 4200000,
        hardware_eligible: true,
        hardware_note: 'Projektbezogene Abschreibungen (AfA) auf abnutzbare bewegliche FuE-/KI-Hardware (keine GWG) sind förderfähig – zzgl. 20 % Gemeinkostenpauschale.',
        goals: ['ki_software', 'ki_hardware', 'fue_innovation'],
        company_sizes: ['micro', 'small', 'medium', 'large'],
        pre_start_ban: false,
        deadlines: [{ date: '2027-03-31', label: 'BSFZ-Antrag für FuE-Projekte 2026/2027 vorbereiten (rückwirkend bis 4 Jahre)' }],
        official_url: 'https://www.bescheinigung-forschungszulage.de/',
    },
    {
        id: 'bund-investitionsbooster',
        name: 'Investitionsbooster (Degressive AfA 30 % + IAB § 7g)',
        level: 'bund',
        states: ['ALL'],
        type: 'tax_depreciation',
        status: 'OPEN',
        status_label: 'Befristet aktiv für Anschaffungen bis 31.12.2027',
        funding_rate_kmu_pct: 30,
        hardware_eligible: true,
        hardware_note: 'Bis zu 30 % degressive AfA im 1. Jahr für GPU-Workstations, KI-Server, Storage & Netzwerk (01.07.2025–31.12.2027); kombinierbar mit IAB (§ 7g EStG).',
        goals: ['ki_hardware', 'it_security', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium', 'large'],
        pre_start_ban: false,
        deadlines: [
            { date: '2026-12-31', label: 'Jahresende 2026: Investitionen & IAB-Planung für 2026 abschließen' },
            { date: '2027-12-31', label: 'Auslaufdatum Investitionsbooster (30 % degressive AfA) – Lieferung bis 31.12.2027' },
        ],
        official_url: 'https://www.bundesfinanzministerium.de/',
    },
    {
        id: 'bund-bafa-beratung',
        name: 'BAFA Förderung von Unternehmensberatungen für KMU',
        level: 'bund',
        states: ['ALL'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Verlängert bis 31.12.2028 (ab 01.01.2027 ELSTER/BundID)',
        funding_rate_kmu_pct: 50,
        funding_rate_east_pct: 80,
        max_grant_kmu_eur_per_year: 2800,
        hardware_eligible: false,
        hardware_note: 'Reine Beratungsförderung – ideal als bezuschusster Einstieg für KI-, Vergabe- und Förderstrategie vor der Hardware-Bestellung.',
        goals: ['beratung', 'ki_software', 'ausschreibungen', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [
            { date: '2027-01-01', label: 'BAFA Verfahrensumstellung ab 01.01.2027: Antragstellung über ELSTER/BundID' },
            { date: '2028-12-31', label: 'Frist für BAFA-Verwendungsnachweise (verlängerte Richtlinie)' },
        ],
        official_url: 'https://www.bafa.de/DE/Wirtschaft/Beratung_Finanzierung/Unternehmensberatung/unternehmensberatung_node.html',
    },
    {
        id: 'bund-zim',
        name: 'ZIM – Zentrales Innovationsprogramm Mittelstand',
        level: 'bund',
        states: ['ALL'],
        type: 'grant',
        status: 'PAUSED_2027',
        status_label: 'Vorübergehender Antragsstopp seit Juli 2026 – Wiederöffnung Anfang 2027 erwartet',
        funding_rate_kmu_pct: 45,
        max_grant_kmu_eur_per_year: 247500,
        hardware_eligible: true,
        hardware_note: 'Fokus auf Personal- und Entwicklungsaufwand für innovative KI-/Software-Projekte; Projektskizze jetzt vorab fertigstellen.',
        goals: ['ki_software', 'fue_innovation'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [{ date: '2027-01-15', label: 'ZIM-Wiederöffnung Q1 2027 überwachen – Projektskizze bereithalten' }],
        official_url: 'https://www.zim.de/',
    },
    {
        id: 'bund-kfw-511-512',
        name: 'KfW ERP-Förderkredit Digitalisierung (511 / 512)',
        level: 'bund',
        states: ['ALL'],
        type: 'loan_with_grant',
        status: 'OPEN',
        status_label: 'Aktiv (Basis, LevelUp, HighEnd – bis 5 % ERP-Förderzuschuss)',
        funding_rate_kmu_pct: 5,
        max_grant_kmu_eur_per_year: 200000,
        hardware_eligible: true,
        hardware_note: 'Finanziert IT-Infrastruktur, Server, IT-Sicherheit und KI-Projekte über die Hausbank; bis zu 5 % Zuschuss (max. 200.000 €).',
        goals: ['ki_hardware', 'ki_software', 'it_security', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium', 'large'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.kfw.de/',
    },
    {
        id: 'bund-qcg',
        name: 'Qualifizierungschancengesetz (QCG, § 82 SGB III)',
        level: 'bund',
        states: ['ALL'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Aktiv (KI-Kompetenz-Schulungen nach EU AI Act förderfähig)',
        funding_rate_kmu_pct: 100,
        hardware_eligible: false,
        hardware_note: 'Unter 50 MA bis zu 100 % Lehrgangskosten + bis 75 % Lohnkostenzuschuss (AZAV-Träger, Antrag vor Start bei der Agentur für Arbeit).',
        goals: ['weiterbildung', 'ki_software'],
        company_sizes: ['micro', 'small', 'medium', 'large'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.arbeitsagentur.de/unternehmen/finanziell/foerderung-von-weiterbildung',
    },
    {
        id: 'by-digitalbonus',
        name: 'Digitalbonus Bayern (Standard & Plus)',
        level: 'land',
        states: ['BY'],
        type: 'grant',
        status: 'MONTHLY_QUOTA',
        status_label: 'Verlängert bis 31.12.2027 – Monatskontingent öffnet am 1. jedes Monats',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 30000,
        hardware_eligible: true,
        hardware_note: 'Standard (<50 MA, max. 7.500 €) und Plus (innovative KI-/IT-Sicherheit, max. 30.000 €) decken projektbezogene Hard- und Software.',
        goals: ['ki_hardware', 'ki_software', 'it_security', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [
            { date: '2026-12-01', label: 'Digitalbonus Bayern: Neues Monatskontingent öffnet am 01.12.2026' },
            { date: '2027-01-01', label: 'Digitalbonus Bayern: Neues Monatskontingent öffnet am 01.01.2027' },
            { date: '2027-02-01', label: 'Digitalbonus Bayern: Neues Monatskontingent öffnet am 01.02.2027' },
            { date: '2027-12-31', label: 'Aktuelles Laufzeitende Digitalbonus Bayern' },
        ],
        official_url: 'https://www.digitalbonus.bayern/',
    },
    {
        id: 'nrw-mid',
        name: 'MID – Mittelstand Innovativ & Digital NRW',
        level: 'land',
        states: ['NW'],
        type: 'grant',
        status: 'REGIONAL_CAP',
        status_label: 'Seit 01.01.2026 bei NRW.BANK – MID-Digitale Prozesse 2026 ausgeschöpft, neue Aufrufe 2027 beobachten',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 15000,
        hardware_eligible: false,
        hardware_note: 'Fördert externe Beratungs- und Entwicklungsleistungen (KI, IT-Sicherheit); Hardware über Investitionsbooster kombinieren.',
        goals: ['ki_software', 'it_security', 'digitalisierung', 'beratung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [{ date: '2027-01-15', label: 'MID NRW: Neue Förderaufrufe 2027 bei der NRW.BANK prüfen' }],
        official_url: 'https://www.mittelstand-innovativ-digital.nrw/',
    },
    {
        id: 'bb-big-digital',
        name: 'Brandenburgischer Innovationsgutschein (BIG-Digital)',
        level: 'land',
        states: ['BB'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Aktiv bis 30.06.2027 (WFBB-Erstberatung vorab Pflicht)',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 250000,
        hardware_eligible: true,
        hardware_note: '50 % Zuschuss für Beratung (bis 50k €), Implementierung (bis 250k €, inkl. projektnotwendiger IT/Hardware) und Schulung (bis 50k €).',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung', 'weiterbildung', 'beratung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [{ date: '2027-06-30', label: 'Richtlinienende BIG-Digital Brandenburg (WFBB-Termin mind. 8 Wochen vorher buchen)' }],
        official_url: 'https://www.ilb.de/',
    },
    {
        id: 'sh-dku',
        name: 'DKU – Digitalisierungsmaßnahmen in kleinen Unternehmen (SH)',
        level: 'land',
        states: ['SH'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Aktiv bis 30.06.2027 (für Betriebe unter 50 Mitarbeitenden)',
        funding_rate_kmu_pct: 40,
        max_grant_kmu_eur_per_year: 80000,
        hardware_eligible: true,
        hardware_note: 'Modul Umsetzung (10.000–200.000 € Ausgaben, 40 % Zuschuss) deckt ausdrücklich Hard-, Software und Schulungen; Modul Beratung 2.500–20.000 €.',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung', 'weiterbildung', 'beratung'],
        company_sizes: ['micro', 'small'],
        pre_start_ban: true,
        deadlines: [{ date: '2027-06-30', label: 'Richtlinienende DKU Schleswig-Holstein (WTSH)' }],
        official_url: 'https://www.wtsh.de/',
    },
    {
        id: 'st-digital-innovation',
        name: 'DIGITAL INNOVATION (Sachsen-Anhalt)',
        level: 'land',
        states: ['ST'],
        type: 'grant',
        status: 'REGIONAL_CAP',
        status_label: 'Aktiv in periodischen Wettbewerbsaufrufen (IB Sachsen-Anhalt)',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 70000,
        hardware_eligible: true,
        hardware_note: 'Bis 50 % Zuschuss (max. 70.000 €) für digitale Innovationen & IT-Projekte; alternativ IB-Digitalisierungsdarlehen.',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [{ date: '2027-02-01', label: 'Nächstes Antragsfenster DIGITAL INNOVATION Sachsen-Anhalt prüfen' }],
        official_url: 'https://www.ib-sachsen-anhalt.de/',
    },
    {
        id: 'sl-digitalinvest',
        name: 'DigitalInvest KMU (Saarland)',
        level: 'land',
        states: ['SL'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Aktiv',
        funding_rate_kmu_pct: 35,
        max_grant_kmu_eur_per_year: 20000,
        hardware_eligible: true,
        hardware_note: 'Bis zu 20.000 € Zuschuss für Digitalisierungsprozesse inkl. Investitionen und Mitarbeiterschulung.',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung', 'weiterbildung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.saarland.de/',
    },
    {
        id: 'mv-digitalisierung',
        name: 'Digitalisierungsförderung Mittelstand MV',
        level: 'land',
        states: ['MV'],
        type: 'grant',
        status: 'REGIONAL_CAP',
        status_label: 'Aktiv über zeitlich begrenzte Projektaufrufe (Skizzenverfahren)',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 50000,
        hardware_eligible: true,
        hardware_note: 'De-minimis-Zuschuss bis 50 % (max. 50.000 €) für KMU bei Ersetzung analoger Prozesse.',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.lfi-mv.de/',
    },
    {
        id: 'sn-sab-digital',
        name: 'SAB Digitalisierungszuschuss (EFRE Sachsen)',
        level: 'land',
        states: ['SN'],
        type: 'grant',
        status: 'REGIONAL_CAP',
        status_label: 'Teil-Stopp: Region Leipzig/Nordsachsen OFFEN · Übergangsregion (Dresden/Chemnitz) seit Juli 2026 gestoppt',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 50000,
        hardware_eligible: true,
        hardware_note: 'Aktuell nur für Betriebsstätten in Stadt Leipzig, LK Leipzig und LK Nordsachsen offen; übriges Sachsen nutzt Bund.',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.sab.sachsen.de/',
    },
    {
        id: 'bw-lbank-digital',
        name: 'L-Bank Digitalisierungsfinanzierung BW (Nachfolger Digitalisierungsprämie Plus)',
        level: 'land',
        states: ['BW'],
        type: 'loan_with_grant',
        status: 'OPEN',
        status_label: 'Aktiv (reine Zuschussvariante Digitalisierungsprämie Plus seit Mitte 2025 beendet)',
        funding_rate_kmu_pct: 10,
        hardware_eligible: true,
        hardware_note: 'Zinsverbilligte Darlehen (Basis, LevelUp, HighEnd) mit Tilgungszuschuss nach Umsetzung über die Hausbank.',
        goals: ['ki_hardware', 'ki_software', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.l-bank.de/',
    },
    {
        id: 'be-ibb-profit',
        name: 'IBB Pro FIT Berlin (Alternative zur beendeten Digitalprämie Berlin)',
        level: 'land',
        states: ['BE'],
        type: 'grant_and_loan',
        status: 'OPEN',
        status_label: 'Aktiv für FuE-/KI-Projekte (klassische Digitalprämie Berlin beendet)',
        funding_rate_kmu_pct: 45,
        max_grant_kmu_eur_per_year: 400000,
        hardware_eligible: true,
        hardware_note: 'Greift bei echtem KI-/FuE-Anteil; für reine IT-Hardware in Berlin Investitionsbooster + KfW 511 nutzen.',
        goals: ['ki_software', 'fue_innovation'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.ibb.de/',
    },
    {
        id: 'th-innoinvest',
        name: 'TAB InnoInvest (Alternative zum ausgeschöpften Digitalbonus Thüringen)',
        level: 'land',
        states: ['TH'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Aktiv für investive Innovationen (Digitalbonus Thüringen ausgeschöpft)',
        funding_rate_kmu_pct: 35,
        max_grant_kmu_eur_per_year: 150000,
        hardware_eligible: true,
        hardware_note: 'Explizit investiv (Hardware, Automatisierung, IT-Sicherheit); reine Software-Abos und reine Beratung ausgeschlossen.',
        goals: ['ki_hardware', 'it_security'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.aufbaubank.de/',
    },
    {
        id: 'he-rkw-digi',
        name: 'DIGI-Beratung Hessen (RKW) – nach Ende des DIGI-Zuschusses',
        level: 'land',
        states: ['HE'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Beratung aktiv (DIGI-Zuschuss Hessen im Juni 2026 endgültig beendet)',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 4000,
        hardware_eligible: false,
        hardware_note: 'Für Hardware in Hessen statt des beendeten DIGI-Zuschusses Investitionsbooster (30 % AfA), KfW 511 und Forschungszulage kombinieren.',
        goals: ['beratung', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.rkw-hessen.de/',
    },
    {
        id: 'rp-betriebsberatung',
        name: 'Betriebsberatungsprogramm Rheinland-Pfalz (ISB)',
        level: 'land',
        states: ['RP'],
        type: 'grant',
        status: 'OPEN',
        status_label: 'Aktiv (DigiBoost RLP beendet)',
        funding_rate_kmu_pct: 50,
        max_grant_kmu_eur_per_year: 5000,
        hardware_eligible: false,
        hardware_note: 'Bis 50 % (max. 500 €/Tagewerk) für Digitalisierungs-/KI-Beratung; Hardware über Investitionsbooster & KfW 511 finanzieren.',
        goals: ['beratung', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://isb.rlp.de/',
    },
    {
        id: 'ni-digitalbonus-closed',
        name: 'Digitalbonus Niedersachsen (Ausgelaufen)',
        level: 'land',
        states: ['NI'],
        type: 'closed_notice',
        status: 'CLOSED_WITH_ALTERNATIVE',
        status_label: 'Beendet – kein direkter Landes-IT-Zuschuss mehr bei der NBank',
        hardware_eligible: false,
        hardware_note: 'Aktive Alternativen in Niedersachsen: BAFA Beratung (80 % in Region Lüneburg, sonst 50 %), KfW 511/512, Forschungszulage & Investitionsbooster (30 % AfA).',
        goals: ['ki_hardware', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: false,
        deadlines: [],
        official_url: 'https://www.nbank.de/',
    },
    {
        id: 'hh-digitalcheck-closed',
        name: 'Hamburg Digital Check (IFB – geschlossen am 16.11.2026)',
        level: 'land',
        states: ['HH'],
        type: 'closed_notice',
        status: 'CLOSED_WITH_ALTERNATIVE',
        status_label: 'Finaler Antragsschluss 16.11.2026 abgelaufen – Richtlinie endet 31.12.2026',
        hardware_eligible: false,
        hardware_note: 'Aktive Alternativen in Hamburg: BAFA Beratung (bis 2028), KfW 511/512, Forschungszulage (35 % KMU) & Investitionsbooster (30 % AfA).',
        goals: ['beratung', 'it_security', 'digitalisierung'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: false,
        deadlines: [],
        official_url: 'https://www.ifbhh.de/',
    },
    {
        id: 'hb-bab-notice',
        name: 'Bremer Aufbau-Bank (BAB) Digitalisierungsprogramme',
        level: 'land',
        states: ['HB'],
        type: 'regional_check',
        status: 'REGIONAL_CAP',
        status_label: 'Budgetabhängige Programme – vorab mit Bundesprogrammen kombinieren',
        hardware_eligible: false,
        hardware_note: 'In Bremen primär BAFA, KfW 511/512, QCG, Forschungszulage und Investitionsbooster einplanen; aktuelle BAB-Aufrufe einzeln prüfen.',
        goals: ['digitalisierung', 'ki_hardware'],
        company_sizes: ['micro', 'small', 'medium'],
        pre_start_ban: true,
        deadlines: [],
        official_url: 'https://www.bab-bremen.de/',
    },
]

const EUR = new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
})

export const formatEUR = (wert) => EUR.format(wert)

export function formatDatumDE(iso) {
    if (!iso) return ''
    const datum = new Date(iso)
    if (Number.isNaN(datum.getTime())) return iso
    return datum.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function matchFoerderprogramme(eingabe) {
    const land = BUNDESLAENDER.find((b) => b.code === eingabe.stateCode) || BUNDESLAENDER[0]
    const open = []
    const watch = []
    const closed = []

    const ziele = new Set([...eingabe.goals, 'digitalisierung'])
    if (eingabe.goals.includes('ki_software')) ziele.add('fue_innovation')

    for (const p of FOERDERPROGRAMME) {
        if (!p.states.includes('ALL') && !p.states.includes(eingabe.stateCode)) continue
        if (p.status === 'CLOSED_WITH_ALTERNATIVE') {
            closed.push(p)
            continue
        }
        if (p.company_sizes && !p.company_sizes.includes(eingabe.size)) continue
        if (!p.goals.some((g) => ziele.has(g))) continue
        if (p.type === 'loan_with_grant' && eingabe.financing === 'equity' && eingabe.budget < 50000) continue

        const schaetzung = schaetzeVorteil(p, eingabe, land)
        const angereichert = {
            ...p,
            estimated_eur: schaetzung.eur,
            estimate_label: schaetzung.label,
            reason: begruendungBauen(p, eingabe, land),
        }
        if (p.status === 'OPEN' || p.status === 'MONTHLY_QUOTA') open.push(angereichert)
        else watch.push(angereichert)
    }

    open.sort((a, b) => (b.level === 'land' ? 1 : 0) - (a.level === 'land' ? 1 : 0) || b.estimated_eur - a.estimated_eur)
    return { open, watch, closed }
}

function schaetzeVorteil(p, eingabe, land) {
    const b = eingabe.budget
    if (p.id === 'bund-bafa-beratung') {
        const quote = land.east ? (p.funding_rate_east_pct ?? 80) : (p.funding_rate_kmu_pct ?? 50)
        const eur = Math.round(3500 * (quote / 100))
        return { eur, label: `bis ${formatEUR(eur)} (${quote} % auf 3.500 €)` }
    }
    if (p.id === 'bund-investitionsbooster') {
        const afaY1 = Math.round(b * 0.3)
        const effekt = Math.round(afaY1 * 0.3)
        return { eur: effekt, label: `${formatEUR(afaY1)} AfA im 1. Jahr (~${formatEUR(effekt)} Steuer-Effekt)` }
    }
    if (p.id === 'bund-forschungszulage') {
        const quote = eingabe.size === 'large' ? 25 : 35
        const basis = Math.round(b * 1.2)
        const eur = Math.min(Math.round(basis * (quote / 100)), eingabe.size === 'large' ? 3000000 : 4200000)
        return { eur, label: `bis ~${formatEUR(eur)} (${quote} % inkl. 20 % Gemeinkosten)` }
    }
    if (p.id === 'bund-qcg') {
        const quote = eingabe.size === 'micro' || eingabe.size === 'small' ? 100 : eingabe.size === 'medium' ? 50 : 25
        const eur = Math.round(Math.min(b, 12000) * (quote / 100))
        return { eur, label: `${quote} % Lehrgangskosten${quote === 100 ? ' + bis 75 % Lohnzuschuss' : ''}` }
    }
    if (p.id === 'by-digitalbonus') {
        const istPlus = eingabe.goals.includes('ki_hardware') || eingabe.goals.includes('ki_software')
        const cap = istPlus ? 30000 : 7500
        const eur = Math.min(Math.round(b * 0.5), cap)
        return { eur, label: `bis ${formatEUR(eur)} (50 %, ${istPlus ? 'Plus' : 'Standard'})` }
    }
    const quote = p.funding_rate_kmu_pct ?? 30
    const roh = Math.round(b * (quote / 100))
    const eur = p.max_grant_kmu_eur_per_year ? Math.min(roh, p.max_grant_kmu_eur_per_year) : roh
    return { eur, label: `bis ~${formatEUR(eur)} (${quote} %)` }
}

function begruendungBauen(p, eingabe, land) {
    const teile = [p.level === 'bund' ? 'Bundesweit gültig' : `Landesprogramm ${land.name}`]
    if (p.hardware_eligible && eingabe.goals.includes('ki_hardware')) teile.push('deckt KI-/IT-Hardware')
    if (p.id === 'bund-bafa-beratung') teile.push(land.east ? '80 % Ost-Quote' : '50 % West-Quote')
    if (p.status === 'MONTHLY_QUOTA') teile.push('Monatskontingent am 1. des Monats')
    return `Passt, weil: ${teile.join(' · ')}`
}

export function sammleFristen(open, watch, tenders) {
    const liste = []
    for (const p of [...open, ...watch]) {
        for (const d of p.deadlines ?? []) {
            liste.push({ date: d.date, title: p.name, detail: d.label, sourceType: 'funding' })
        }
    }
    for (const t of tenders) {
        if (t.deadline_at) {
            liste.push({
                date: String(t.deadline_at).slice(0, 10),
                title: `Angebotsfrist: ${String(t.title || '').slice(0, 65)}`,
                detail: `${t.buyer_name || 'Vergabestelle'} · Quelle: ${String(t.source || '').toUpperCase()}`,
                sourceType: 'tender',
            })
        }
    }
    liste.sort((a, b) => a.date.localeCompare(b.date))
    return liste
}

export function baueIcsKalender(events) {
    const esc = (s) => String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
    const zeilen = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Ausschreibungsagenten.de//Auftrags- und Foerder-Planer 2027//DE',
        'CALSCALE:GREGORIAN',
        'X-WR-CALNAME:Auftrags- & Förder-Kalender 2027 (Ausschreibungsagenten.de)',
    ]
    events.forEach((ev, idx) => {
        const dt = ev.date.replace(/-/g, '')
        zeilen.push(
            'BEGIN:VEVENT',
            `UID:aa-2027-${idx}-${dt}@ausschreibungsagenten.de`,
            `DTSTART;VALUE=DATE:${dt}`,
            `SUMMARY:${esc(ev.title)}`,
            `DESCRIPTION:${esc(`${ev.detail} — Ausschreibungsagenten.de/foerder-und-auftrags-planer`)}`,
            'BEGIN:VALARM',
            'TRIGGER:-P14D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Erinnerung in 14 Tagen: Frist prüfen!',
            'END:VALARM',
            'BEGIN:VALARM',
            'TRIGGER:-P3D',
            'ACTION:DISPLAY',
            'DESCRIPTION:Letzte Erinnerung in 3 Tagen!',
            'END:VALARM',
            'END:VEVENT',
        )
    })
    zeilen.push('END:VCALENDAR')
    return zeilen.join('\r\n')
}
