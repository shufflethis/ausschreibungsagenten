export const ausschreibungenHessen = {
    path: '/ausschreibungen-hessen',
    h1: 'Ausschreibungen Hessen: HAD, Landesportal & TED durchsuchen',
    direktantwort:
        'Öffentliche Ausschreibungen in Hessen erscheinen über die Hessische Ausschreibungsdatenbank (HAD), den Datenservice Öffentlicher Einkauf, DTVP, RIB und bei EU-Verfahren auf TED. Ausschreibungsagenten.de fragt das Landesportal Hessen als Teil von 18 Live-Quellen direkt ab, filtert nach hessischem Leistungsort und begründet jeden Treffer nachvollziehbar über CPV-Code, Wert und Frist.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kriterium', 'Stand für das Land Hessen'],
        zeilen: [
            ['Landesportal', 'Landesportal Hessen – direkt produktiv in unseren 18 Live-Quellen'],
            ['Weitere relevante Quellen', 'TED (EU-Oberschwelle), Datenservice Öffentlicher Einkauf, service.bund.de, DTVP, RIB, Metropolregion Rhein-Neckar'],
            ['Landesvergaberecht', 'Hessisches Vergabe- und Tariftreuegesetz (HVTG), Gemeinsamer Runderlass, UVgO, VOB/A'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['Regionssuche', 'Leistungsort & hessische NUTS-Regionen (DE71 Darmstadt, DE72 Gießen, DE73 Kassel)'],
        ],
    },
    abschnitte: [
        {
            titel: 'Hessen zentral durchsuchen: HAD, Landesportal, Rhein-Main und TED',
            absaetze: [
                'Hessen verfügt mit dem Landesportal Hessen über eine etablierte regionale Bekanntmachungsquelle, die direkt in unseren 18 Live-Quellen produktiv abgefragt wird (Abrufzeitpunkt im [Quellenstatus](/status)).',
                'Im Süden Hessens überschneiden sich zudem Ausschreibungen mit der Metropolregion Rhein-Neckar (ebenfalls direkt angebunden), während große Infrastruktur-, Bau- und IT-Projekte im Rhein-Main-Gebiet über TED, DTVP, RIB und den Datenservice Öffentlicher Einkauf laufen. Unsere Suche führt diese Quellen auf einer Oberfläche zusammen.',
            ],
            links: [
                { href: '/?region=Hessen#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Hessen' },
                { href: '/?region=Hessen&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Hessen (CPV 45)' },
                { href: '/?region=Hessen&gewerk=haustechnik#ergebnisse', text: 'Live-Suche öffnen: Elektro & SHK in Hessen (CPV 453)' },
            ],
        },
        {
            titel: 'Hessisches Vergaberecht (HVTG) und Praxis für Bieter',
            absaetze: [
                'Das **Hessische Vergabe- und Tariftreuegesetz (HVTG)** regelt neben den Verfahrensarten im Unterschwellenbereich auch Anforderungen an Tariftreue, Mindestentgelte und die Prüfung von Nachunternehmern. Im Bau- und Planungsbereich sind zudem Fachlose nach VOB/A bzw. § 97 Abs. 4 GWB die Regel.',
                'Für die schnelle Vorprüfung von Leistungsverzeichnissen nutzen hessische Bau- und Handwerksbetriebe unseren kostenlosen [GAEB-Viewer](/gaeb-viewer); die Grenze zwischen Landes- und EU-Verfahren klärt der [EU-Schwellenwerte-Rechner 2026/2027](/eu-schwellenwerte).',
            ],
        },
        {
            titel: 'Passende Gewerke gezielt nach CPV-Code filtern',
            absaetze: [
                'Statt täglich manuell mehrere Portale nach allgemeinen Stichwörtern durchzukämmen, lassen sich hessische Aufträge präzise nach [CPV-Codes](/cpv-code-suche) und Ausschlussbegriffen eingrenzen — etwa für [Bauaufträge](/bauauftraege-finden), [Elektro & SHK](/ausschreibungen-elektro-shk), [Architektur](/ausschreibungen-architektur) oder [IT-Dienstleistungen](/ausschreibungen-it).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer Hessen-Abdeckung',
        absaetze: [
            'Nicht-öffentliche Beschränkte Ausschreibungen, freihändige Vergaben unterhalb lokaler Veröffentlichungsgrenzen sowie private Bauprojekte im Rhein-Main-Gebiet erscheinen nicht in unseren 18 öffentlichen Quellen.',
            'Verbindlich für Fristen, HVTG-Erklärungen und die Angebotsabgabe bleibt stets die verlinkte Originalbekanntmachung. Alle Tarife und die kostenfreie Pilotphase stehen offen auf der [Preisseite](/preise).',
        ],
    },
    faq: [
        {
            frage: 'Ist das Landesportal Hessen direkt bei Ausschreibungsagenten.de angebunden?',
            antwort:
                'Ja. Das Landesportal Hessen wird produktiv als eine unserer 18 Live-Quellen abgefragt — ergänzt um TED, den Datenservice Öffentlicher Einkauf, DTVP, RIB und die Metropolregion Rhein-Neckar. Den letzten Abruf zeigt der [Quellenstatus](/status).',
        },
        {
            frage: 'Kann ich gezielt für Frankfurt, Wiesbaden, Darmstadt oder Kassel suchen?',
            antwort:
                'Ja. Tragen Sie „Hessen“ oder Ihre Wunschstadt in das Feld „Leistungsregion“ ein; die Suche gleicht Leistungsort und NUTS-Regionen (DE71–DE73) ab.',
        },
        {
            frage: 'Welche Gesetze gelten bei öffentlichen Aufträgen in Hessen?',
            antwort:
                'Unterhalb der EU-Schwellenwerte gelten das Hessische Vergabe- und Tariftreuegesetz (HVTG), der Gemeinsame Runderlass zum öffentlichen Auftragswesen sowie UVgO und VOB/A Abschnitt 1; oberhalb gelten GWB, VgV und VOB/A-EU.',
        },
        {
            frage: 'Was kostet ein Suchprofil mit E-Mail-Digest für Hessen?',
            antwort:
                'In der laufenden Pilotphase ist der Zugang kostenfrei (0 Euro, keine Zahlungsdaten). Alle geplanten Preise für den anschließenden Regelbetrieb stehen offen auf der [Preisseite](/preise).',
        },
    ],
    ctaKontext: 'Ausschreibungen Hessen',
    ctaTitel: 'Hessen-Suchprofil kostenfrei im Pilot einrichten',
    ctaText:
        'Wir kombinieren Ihre Gewerke, Zielregionen in Hessen (z. B. Rhein-Main oder Nordhessen) und Ausschlüsse kostenfrei im Pilot – mit klarer Begründung je Treffer.',
    querverweise: [
        { path: '/status', text: 'Live-Quellenstatus inkl. Landesportal Hessen' },
        { path: '/ausschreibungen-nrw', text: 'Ausschreibungen Nordrhein-Westfalen' },
        { path: '/ausschreibungen-baden-wuerttemberg', text: 'Ausschreibungen Baden-Württemberg' },
        { path: '/cpv-code-suche', text: 'CPV-Code-Suche nach Gewerk' },
    ],
}
