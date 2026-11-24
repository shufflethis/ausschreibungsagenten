export const ausschreibungenSaarland = {
    path: '/ausschreibungen-saarland',
    h1: 'Ausschreibungen Saarland: Vergaben im Land & in der Großregion finden',
    direktantwort:
        'Betriebe im Saarland profitieren geografisch von kurzen Wegen nach Rheinland-Pfalz, Luxemburg und Frankreich. Ausschreibungsagenten.de durchsucht 18 Live-Quellen inklusive TED für alle 27 EU-Staaten sowie das Landesportal Rheinland-Pfalz, filtert nach Leistungsort Saarland (NUTS DEC0) und verbindet Ihre Auftragssuche mit dem aktiven Landesprogramm DigitalInvest KMU bis 20.000 Euro.',
    fakten: {
        datenstand: '24. November 2026',
        kopf: ['Kriterium', 'Stand für das Saarland'],
        zeilen: [
            ['Zentrale Landesplattform', 'vergabe.saarland'],
            ['Abgedeckte Live-Quellen', 'Datenservice Öffentlicher Einkauf, TED (DE + LUX + FRA), Landesportal RLP, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'STTG (Saarländisches Tariftreue- und Fairer-Lohn-Gesetz), UVgO, VOB/A'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['NUTS-Region', 'DEC / DEC0 (Saarland – erweiterbar auf RLP, LUX und FRA)'],
            ['Förderstatus 2026/2027', 'DigitalInvest KMU AKTIV (bis 20.000 € Zuschuss inkl. Schulung) + Bundesprogramme'],
        ],
    },
    abschnitte: [
        {
            titel: 'Saarland plus Großregion (RLP, Luxemburg, Frankreich) in einer Suche',
            absaetze: [
                'In Saarbrücken, Saarlouis, Neunkirchen, Homburg und St. Wendel lohnt sich der Blick über die Landes- und Staatsgrenze: Über unsere direkte TED-Anbindung sind sämtliche EU-Staaten — darunter Luxemburg (`LUX`) und Frankreich (`FRA`) — per Parameter abrufbar, und das Landesportal Rheinland-Pfalz liegt direkt in unseren 18 Live-Quellen.',
                'Nutzen Sie die [CPV-Code-Suche](/cpv-code-suche) für [Bauaufträge](/bauauftraege-finden), [Elektro & SHK](/ausschreibungen-elektro-shk) oder [IT-Ausschreibungen](/ausschreibungen-it) in der gesamten Großregion.',
            ],
            links: [
                { href: '/?region=Saarland#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen im Saarland' },
                { href: '/?region=Saarland&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge im Saarland' },
            ],
        },
        {
            titel: 'Fördermittel 2026/2027 im Saarland: DigitalInvest KMU & Bund',
            absaetze: [
                'Mit **DigitalInvest KMU** gewährt das Saarland kleinen und mittleren Unternehmen Zuschüsse von **bis zu 20.000 €** für Investitionen in digitale Prozesse — ausdrücklich einschließlich begleitender Mitarbeiterschulungen (Vorhabenbeginn-Sperre beachten!).',
                'Ergänzend greifen bundesweit der [Investitionsbooster (30 % AfA bis 31.12.2027)](/foerderung-ki-hardware-investitionsbooster), die Forschungszulage (35 % KMU) und die bis 2028 verlängerte [BAFA-Beratung](/bafa-foerderung-2027). Berechnen Sie Ihr Paket direkt im [Auftrags- & Förder-Planer 2027](/foerder-und-auftrags-planer).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer Saarland-Abdeckung',
        absaetze: [
            'Saarländische Vergaben erfassen wir über Datenservice Öffentlicher Einkauf, TED, service.bund.de, DTVP und RIB; das Nachbarportal Rheinland-Pfalz ist direkt angebunden. Ein separater Scraper für vergabe.saarland ist im [Quellenstatus](/status) derzeit nicht gelistet.',
            'Für verbindliche Vergabeunterlagen und DigitalInvest-KMU-Anträge gelten stets die offiziellen Originalportale.',
        ],
    },
    faq: [
        {
            frage: 'Kann ich über Ausschreibungsagenten.de auch Ausschreibungen in Luxemburg finden?',
            antwort:
                'Ja. Über unsere direkte TED-Schnittstelle sind alle 27 EU-Länder inklusive Luxemburg (LUX) und Frankreich (FRA) abrufbar — ideal für grenznahe Betriebe im Saarland.',
        },
        {
            frage: 'Was fördert DigitalInvest KMU im Saarland?',
            antwort:
                'DigitalInvest KMU bezuschusst KMU mit Sitz oder Betriebsstätte im Saarland mit bis zu 20.000 € bei Investitionen in Digitalisierungsprozesse einschließlich Mitarbeiterschulungen.',
        },
        {
            frage: 'Welche Vergabevorschriften gelten im Saarland?',
            antwort:
                'Neben UVgO und VOB/A Abschnitt 1 im Unterschwellenbereich greift im Saarland das Saarländische Tariftreue- und Fairer-Lohn-Gesetz (STTG). Oberhalb der [EU-Schwellenwerte](/eu-schwellenwerte) gilt Bundes-/EU-Vergaberecht.',
        },
    ],
    ctaKontext: 'Ausschreibungen Saarland & Großregion',
    ctaTitel: 'Suchprofil für Saarland & Großregion im Pilot einrichten',
    ctaText:
        'Finden Sie öffentliche Aufträge im Saarland, in Rheinland-Pfalz und in Luxemburg aus 18 Live-Quellen — kostenfrei in der Pilotphase.',
    querverweise: [
        { path: '/foerder-und-auftrags-planer', text: 'DigitalInvest KMU & Aufträge im Planer 2027 prüfen' },
        { path: '/ausschreibungen-hessen', text: 'Ausschreibungen Hessen im Überblick' },
        { path: '/ausschreibungen-baden-wuerttemberg', text: 'Ausschreibungen Baden-Württemberg im Überblick' },
        { path: '/status', text: 'Live-Quellenstatus inkl. TED & RLP' },
    ],
}
