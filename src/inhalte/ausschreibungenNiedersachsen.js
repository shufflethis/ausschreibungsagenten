export const ausschreibungenNiedersachsen = {
    path: '/ausschreibungen-niedersachsen',
    h1: 'Ausschreibungen Niedersachsen: Vergabeportale, TED & Förderstatus 2027',
    direktantwort:
        'Öffentliche Ausschreibungen in Niedersachsen erscheinen über den Datenservice Öffentlicher Einkauf, TED, service.bund.de, DTVP, RIB sowie das Landesportal vergabe.niedersachsen.de. Ausschreibungsagenten.de durchsucht 18 Live-Quellen, filtert gezielt auf den echten Leistungsort in Niedersachsen (NUTS DE91–DE94) und verbindet Ihre Auftragssuche im Planer 2027 mit aktuellen Bundes-Fördermitteln statt ausgelaufener Programme.',
    fakten: {
        datenstand: '24. November 2026',
        kopf: ['Kriterium', 'Stand für Niedersachsen'],
        zeilen: [
            ['Zentrale Landesplattform', 'vergabe.niedersachsen.de (Niedersächsischer Vergabemarktplatz)'],
            ['Abgedeckte Live-Quellen', 'Datenservice Öffentlicher Einkauf (Ober- & Unterschwelle), TED, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'NTVergG (Niedersächsisches Tariftreue- und Vergabegesetz), UVgO, VOB/A'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['NUTS-Regionen', 'DE91 (Braunschweig), DE92 (Hannover), DE93 (Lüneburg), DE94 (Weser-Ems)'],
            ['Förderstatus 2026/2027', 'Digitalbonus Niedersachsen beendet → Bund nutzen (BAFA 80 % in Lüneburg, AfA 30 %, Forschungszulage)'],
        ],
    },
    abschnitte: [
        {
            titel: 'Wo öffentliche Ausschreibungen in Niedersachsen erscheinen',
            absaetze: [
                'Landesbehörden, Landkreise und Kommunen in Hannover, Braunschweig, Oldenburg, Osnabrück, Göttingen und Lüneburg veröffentlichen Verfahren über vergabe.niedersachsen.de sowie angeschlossene E-Vergabe-Systeme. Über den zentralen Datenservice Öffentlicher Einkauf und TED laufen ober- und unterschwellige Bekanntmachungen maschinenlesbar zusammen.',
                'Unsere Suche über 18 Live-Quellen filtert nach tatsächlichem Leistungsort (NUTS DE9) und [CPV-Codes](/cpv-code-suche) — statt nur nach dem Sitz der Vergabestelle.',
            ],
            links: [
                { href: '/?region=Niedersachsen#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Niedersachsen' },
                { href: '/?region=Niedersachsen&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Niedersachsen (CPV 45)' },
            ],
        },
        {
            titel: 'Besonderheiten im NTVergG & Förderstatus 2027',
            absaetze: [
                'Bieter müssen in Niedersachsen die Tariftreue- und Mindestentgeltvorgaben des NTVergG beachten; für Bau- und Technik-Leistungsverzeichnisse steht Ihnen unser kostenloser [GAEB-Viewer](/gaeb-viewer) bereit.',
                'Wichtig für Investitionen 2027: Der frühere Digitalbonus Niedersachsen bei der NBank ist ausgelaufen. Niedersächsische KMU nutzen stattdessen bundesweite Instrumente wie die bis 2028 verlängerte [BAFA-Beratungsförderung](/bafa-foerderung-2027) (80 % in der Region Lüneburg, sonst 50 %), den [Investitionsbooster (30 % AfA)](/foerderung-ki-hardware-investitionsbooster), die Forschungszulage (35 % KMU) und KfW 511/512 — direkt berechenbar im [Auftrags- & Förder-Planer 2027](/foerder-und-auftrags-planer).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer Niedersachsen-Abdeckung',
        absaetze: [
            'Ausschreibungsagenten.de bindet aktuell 18 benannte Live-Quellen an (einsehbar im [Quellenstatus](/status)). Ein separater Direkt-Scraper für vergabe.niedersachsen.de ist derzeit nicht gesondert aufgeführt; niedersächsische Verfahren erfassen wir über Datenservice Öffentlicher Einkauf, TED, service.bund.de, DTVP und RIB.',
            'Nicht-öffentliche Kleinstvergaben ohne Datenservice-Meldung erscheinen auf keiner Plattform. Für verbindliche Vergabeunterlagen gilt stets das verlinkte Originalportal.',
        ],
    },
    faq: [
        {
            frage: 'Wie finde ich öffentliche Ausschreibungen in Hannover, Oldenburg oder Braunschweig?',
            antwort:
                'Wählen Sie in der Live-Suche einfach „Niedersachsen“ oder direkt Ihre Zielstadt im Feld Leistungsregion. Unser Matching prüft den tatsächlichen Leistungsort und die NUTS-Regionen DE91–DE94.',
        },
        {
            frage: 'Gibt es den Digitalbonus Niedersachsen 2027 noch?',
            antwort:
                'Nein. Der Digitalbonus Niedersachsen ist vollständig ausgelaufen. Unternehmen in Niedersachsen greifen 2026/2027 auf bundesweite Instrumente wie [BAFA Beratung](/bafa-foerderung-2027) (80 % in Lüneburg), Forschungszulage, KfW 511/512 und den Investitionsbooster zurück.',
        },
        {
            frage: 'Welche Vergabevorschriften gelten in Niedersachsen?',
            antwort:
                'Unterhalb der [EU-Schwellenwerte 2026/2027](/eu-schwellenwerte) gelten u. a. das Niedersächsische Tariftreue- und Vergabegesetz (NTVergG), die UVgO sowie die VOB/A Abschnitt 1.',
        },
    ],
    ctaKontext: 'Ausschreibungen Niedersachsen',
    ctaTitel: 'Suchprofil für Niedersachsen im Pilot testen',
    ctaText:
        'Kombinieren Sie Ihre Gewerke, CPV-Codes und Zielregionen in Niedersachsen — kostenfrei in der Pilotphase mit nachvollziehbarer Begründung je Treffer.',
    querverweise: [
        { path: '/foerder-und-auftrags-planer', text: 'Auftrags- & Förder-Planer 2027 für Niedersachsen' },
        { path: '/ausschreibungen-hamburg', text: 'Ausschreibungen Hamburg im Überblick' },
        { path: '/ausschreibungen-nrw', text: 'Ausschreibungen NRW im Überblick' },
        { path: '/status', text: 'Live-Quellenstatus aller 18 Vergabequellen' },
    ],
}
