export const ausschreibungenNrw = {
    path: '/ausschreibungen-nrw',
    h1: 'Ausschreibungen NRW: Vergabemarktplatz, TED & Kommunen durchsuchen',
    direktantwort:
        'Öffentliche Ausschreibungen in Nordrhein-Westfalen erscheinen auf dem Vergabemarktplatz NRW (evergabe.nrw.de), im Datenservice Öffentlicher Einkauf, auf DTVP, RIB und bei EU-Verfahren auf TED. Ausschreibungsagenten.de fragt das Landesportal NRW zusammen mit 18 Live-Quellen regelmäßig ab, filtert nach echtem Leistungsort in NRW und begründet jeden Treffer über CPV-Code, Frist und Ausschlüsse.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kriterium', 'Stand für Nordrhein-Westfalen (NRW)'],
        zeilen: [
            ['Landesportal', 'Vergabemarktplatz NRW (evergabe.nrw.de) – direkt in unseren 18 Live-Quellen'],
            ['Weitere relevante Quellen', 'TED (EU-Oberschwelle), Datenservice Öffentlicher Einkauf, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'UVgO NRW (Liefer-/Dienstleistungen), VOB/A (Bau), Tariftreue- und Vergabegesetz NRW (TVgG NRW)'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['Regionssuche', 'Filtert auf Leistungsort & NUTS-Regionen (DEA1–DEA5) statt nur Behördensitz'],
        ],
    },
    abschnitte: [
        {
            titel: 'Wo öffentliche Ausschreibungen in NRW veröffentlicht werden',
            absaetze: [
                'Nordrhein-Westfalen bündelt zahlreiche Landes- und Kommunalvergaben über den zentralen Vergabemarktplatz NRW (`evergabe.nrw.de`), der direkt zu unseren 18 produktiv angebundenen Quellen gehört. Den aktuellen Abrufzeitpunkt sehen Sie jederzeit im [Quellenstatus](/status).',
                'Trotzdem erscheinen NRW-Aufträge nicht an einer einzigen Stelle: EU-weite Verfahren oberhalb der [EU-Schwellenwerte 2026/2027](/eu-schwellenwerte) stehen auf TED, Bundesbehörden in NRW auf service.bund.de, und kommunale Gesellschaften nutzen zusätzlich DTVP, RIB oder den zentralen Datenservice Öffentlicher Einkauf. Unsere Suche führt alle Ebenen zusammen.',
            ],
            links: [
                { href: '/?region=Nordrhein-Westfalen#ergebnisse', text: 'Live-Suche öffnen: alle aktuellen Ausschreibungen in NRW' },
                { href: '/?region=Nordrhein-Westfalen&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in NRW (CPV 45)' },
                { href: '/?region=Nordrhein-Westfalen&gewerk=planning#ergebnisse', text: 'Live-Suche öffnen: Architektur & Planung in NRW' },
            ],
        },
        {
            titel: 'Besonderheiten im NRW-Vergaberecht für Bieter',
            absaetze: [
                'Unterhalb der EU-Schwellenwerte gelten in NRW die UVgO (Liefer- und Dienstleistungen), die VOB/A Abschnitt 1 (Bauleistungen) sowie die Kommunalen Vergabegrundsätze NRW. Wichtig für Bieter ist zudem das **Tariftreue- und Vergabegesetz NRW (TVgG NRW)**, das häufig entsprechende Eigenerklärungen zur Tariftreue und Mindestentlohnung in den Vergabeunterlagen verlangt.',
                'Wenn eine Bekanntmachung solche Nachweise im Klartext nennt, weist die Entscheidungskarte von Ausschreibungsagenten.de sie frühzeitig samt Belegstelle aus — für Bau- und TGA-Gewerke ergänzt um unseren kostenlosen [GAEB-Viewer](/gaeb-viewer).',
            ],
        },
        {
            titel: 'Nach Gewerk, Stadt und Leistungsort statt Behördensitz filtern',
            absaetze: [
                'Ein zentraler Einkäufer in Düsseldorf oder Münster schreibt häufig Baustellen oder Dienstleistungen im Ruhrgebiet, im Rheinland oder in Ostwestfalen aus. Unsere Regionssuche prüft deshalb den angegebenen Leistungsort und die NUTS-Regionen (Düsseldorf DEA1, Köln DEA2, Münster DEA3, Detmold DEA4, Arnsberg DEA5).',
                'Kombinieren Sie Ihren Einsatzraum mit den passenden Codes aus der [CPV-Code-Suche](/cpv-code-suche) — zum Beispiel für [Bauaufträge](/bauauftraege-finden), [Elektro & SHK](/ausschreibungen-elektro-shk), [IT](/ausschreibungen-it) oder [Architektur](/ausschreibungen-architektur).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer NRW-Abdeckung',
        absaetze: [
            'Nicht jede kleine kommunale Beschränkte Ausschreibung oder freihändige Vergabe in NRW wird öffentlich bekannt gemacht; solche nicht-öffentlichen Verfahren erscheinen auf keiner Suchplattform. Zudem binden wir aktuell 18 benannte Quellen an und behaupten keine lückenlose Erfassung sämtlicher regionaler Einzelportale.',
            'Für verbindliche Vergabeunterlagen, Bieterfragen und die elektronische Angebotsabgabe bleibt immer das jeweilige Originalportal maßgeblich — unsere Treffer verlinken direkt dorthin. Alle Konditionen für ein laufendes NRW-Suchprofil stehen auf der [Preisseite](/preise).',
        ],
    },
    faq: [
        {
            frage: 'Ist der Vergabemarktplatz NRW (evergabe.nrw.de) direkt angebunden?',
            antwort:
                'Ja. Das Landesportal Nordrhein-Westfalen ist produktiver Bestandteil unserer 18 Live-Quellen; den letzten erfolgreichen Abruf prüfen Sie jederzeit öffentlich im [Quellenstatus](/status).',
        },
        {
            frage: 'Kann ich gezielt nach Städten wie Köln, Düsseldorf, Dortmund oder Münster suchen?',
            antwort:
                'Ja. Tragen Sie in der Live-Suche unter „Leistungsregion“ einfach „NRW“, „Nordrhein-Westfalen“ oder direkt eine Stadt ein. Die Suche vergleicht Leistungsort und NUTS-Codes der Bekanntmachung.',
        },
        {
            frage: 'Welche Vergabevorschriften gelten in NRW unterhalb der EU-Schwellenwerte?',
            antwort:
                'In NRW gelten die UVgO für Liefer- und Dienstleistungen, die VOB/A Abschnitt 1 für Bauleistungen, die Kommunalen Vergabegrundsätze sowie das Tariftreue- und Vergabegesetz NRW (TVgG NRW). Maßgeblich sind immer die konkreten Vergabeunterlagen.',
        },
        {
            frage: 'Was kostet ein täglicher E-Mail-Alert für NRW-Ausschreibungen?',
            antwort:
                'In der laufenden begleiteten Pilotphase kostet Ihr NRW-Suchprofil inklusive E-Mail-Digest 0 Euro ohne Zahlungsdaten. Alle geplanten Tarife für den späteren Regelbetrieb stehen offen auf der [Preisseite](/preise).',
        },
    ],
    ctaKontext: 'Ausschreibungen NRW',
    ctaTitel: 'Suchprofil für Nordrhein-Westfalen im Pilot einrichten',
    ctaText:
        'Wir kombinieren Ihre Gewerke, CPV-Codes und Zielregionen in NRW mit klaren Ausschlusswörtern – und liefern aktuelle Treffer aus dem Vergabemarktplatz NRW, TED und Bund mit Begründung.',
    querverweise: [
        { path: '/status', text: 'Live-Quellenstatus inkl. Landesportal NRW' },
        { path: '/bauauftraege-finden', text: 'Bauaufträge nach Gewerk und Region finden' },
        { path: '/ausschreibungen-hessen', text: 'Ausschreibungen Hessen im Überblick' },
        { path: '/ausschreibungen-bayern', text: 'Ausschreibungen Bayern im Überblick' },
    ],
}
