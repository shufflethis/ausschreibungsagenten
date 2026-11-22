export const ausschreibungenBadenWuerttemberg = {
    path: '/ausschreibungen-baden-wuerttemberg',
    h1: 'Ausschreibungen Baden-Württemberg: Landesportale & TED finden',
    direktantwort:
        'In Baden-Württemberg verteilen sich öffentliche Ausschreibungen auf vergabe.landbw.de, das Vergabeportal Baden-Württemberg, die Metropolregion Rhein-Neckar, DTVP, den Datenservice Öffentlicher Einkauf und TED. Ausschreibungsagenten.de bindet alle drei regionalen BW-Quellen zusammen mit 18 Live-Quellen direkt an, filtert nach Leistungsort und begründet jeden Treffer über CPV-Code, Frist und Ausschlüsse.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kriterium', 'Stand für Baden-Württemberg (BW)'],
        zeilen: [
            ['Regionale Live-Quellen', 'Landesportal BW (vergabe.landbw.de), Vergabeportal BW & Metropolregion Rhein-Neckar'],
            ['Weitere relevante Quellen', 'TED (EU-Oberschwelle), Datenservice Öffentlicher Einkauf, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'Landestariftreue- und Mindestlohngesetz (LTMG BW), VwV Beschaffung, UVgO, VOB/A'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['Regionssuche', 'Leistungsort & BW-NUTS-Regionen (DE11 Stuttgart, DE12 Karlsruhe, DE13 Freiburg, DE14 Tübingen)'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum in Baden-Württemberg ein einzelnes Portal nicht reicht',
            absaetze: [
                'Baden-Württemberg hat eine besonders fragmentierte Portallandschaft: Neben dem zentralen Landesportal (`vergabe.landbw.de`) nutzen viele Kommunen das Vergabeportal Baden-Württemberg, im Norden die Plattform der Metropolregion Rhein-Neckar, darüber hinaus DTVP, RIB, den Datenservice Öffentlicher Einkauf und für EU-Verfahren TED.',
                'Ausschreibungsagenten.de fragt alle drei regionalen BW-Portale produktiv innerhalb seiner 18 Live-Quellen ab und weist den letzten erfolgreichen Abruf für jede Quelle transparent im [Quellenstatus](/status) aus.',
            ],
            links: [
                { href: '/?region=Baden-Württemberg#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in BW' },
                { href: '/?region=Baden-Württemberg&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Baden-Württemberg' },
                { href: '/?region=Baden-Württemberg&gewerk=facade_construction#ergebnisse', text: 'Live-Suche öffnen: Fenster, Fassade & Metallbau in BW' },
            ],
        },
        {
            titel: 'LTMG BW, Fachlose und GAEB-Vorprüfung im Mittelstand',
            absaetze: [
                'Unterhalb der [EU-Schwellenwerte 2026/2027](/eu-schwellenwerte) gelten in Baden-Württemberg die VwV Beschaffung, UVgO und VOB/A Abschnitt 1 sowie das **Landestariftreue- und Mindestlohngesetz (LTMG BW)**. Entsprechende Verpflichtungserklärungen gehören bei Landes- und vielen Kommunalaufträgen zu den zwingenden Angebotsbestandteilen.',
                'Handwerks-, Bau- und TGA-Betriebe prüfen Leistungsverzeichnisse im GAEB-Format (X81–X86) direkt vorab in unserem kostenlosen [GAEB-Viewer](/gaeb-viewer) lokal im Browser — ohne Upload.',
            ],
        },
        {
            titel: 'Präzise filtern nach Regierungsbezirk und Gewerk',
            absaetze: [
                'Ob Region Stuttgart, Karlsruhe, Freiburg, Rhein-Neckar oder Bodensee: Kombinieren Sie Ihre Leistungsregion mit den passenden Branchencodes aus der [CPV-Code-Suche](/cpv-code-suche) — etwa für [Bauaufträge](/bauauftraege-finden), [Elektro & SHK](/ausschreibungen-elektro-shk), [Architektur & Planung](/ausschreibungen-architektur) oder [IT-Dienstleistungen](/ausschreibungen-it).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was unsere Baden-Württemberg-Suche nicht abdeckt',
        absaetze: [
            'Nicht-öffentliche Direktvergaben, Beschränkte Ausschreibungen ohne öffentlichen Teilnahmewettbewerb sowie private Bauvorhaben sind in unseren 18 öffentlichen Quellen nicht enthalten. Auch juristische Prüfungen zum LTMG BW oder die Angebotskalkulation übernehmen wir nicht.',
            'Für Fristen und verbindliche Vergabeunterlagen bleibt immer die verlinkte Originalbekanntmachung maßgeblich. Alle Tarife und die kostenfreie Pilotphase stehen offen auf der [Preisseite](/preise).',
        ],
    },
    faq: [
        {
            frage: 'Welche Portale in Baden-Württemberg fragt Ausschreibungsagenten.de direkt ab?',
            antwort:
                'Innerhalb unserer 18 Live-Quellen sind das Landesportal Baden-Württemberg, das Vergabeportal Baden-Württemberg sowie die Metropolregion Rhein-Neckar direkt angebunden – ergänzt um TED, Datenservice Öffentlicher Einkauf, service.bund.de, DTVP und RIB ([Quellenstatus](/status)).',
        },
        {
            frage: 'Kann ich meine Suche auf Stuttgart, Mannheim, Karlsruhe oder Freiburg eingrenzen?',
            antwort:
                'Ja. Geben Sie „Baden-Württemberg“ oder Ihre Zielstadt im Feld „Leistungsregion“ ein. Die Suche vergleicht den veröffentlichten Leistungsort und die NUTS-Regionen (DE11–DE14).',
        },
        {
            frage: 'Welche Landesregelungen sind für Bieter in Baden-Württemberg besonders wichtig?',
            antwort:
                'Neben UVgO und VOB/A Abschnitt 1 insbesondere das Landestariftreue- und Mindestlohngesetz (LTMG BW), das bei öffentlichen Aufträgen ab den jeweiligen Landesgrenzen verbindliche Tariftreue- bzw. Mindestentgelterklärungen verlangt.',
        },
        {
            frage: 'Was kostet ein dauerhafter Alert für Ausschreibungen in Baden-Württemberg?',
            antwort:
                'In der laufenden begleiteten Pilotphase kostet Ihr BW-Suchprofil 0 Euro ohne Zahlungsdaten. Die geplanten Regelbetriebs-Tarife (Pro 149 €/Monat, Agent 499 €/Monat) stehen offen auf der [Preisseite](/preise).',
        },
    ],
    ctaKontext: 'Ausschreibungen Baden-Württemberg',
    ctaTitel: 'Baden-Württemberg-Suchprofil im Pilot einrichten',
    ctaText:
        'Wir kombinieren Ihre Gewerke, Zielregionen in BW und Ausschlusswörter kostenfrei im Pilot – aus beiden BW-Landesportalen, Rhein-Neckar, TED und Bund mit Begründung je Treffer.',
    querverweise: [
        { path: '/status', text: 'Live-Quellenstatus inkl. beider BW-Portale' },
        { path: '/ausschreibungen-bayern', text: 'Ausschreibungen Bayern im Überblick' },
        { path: '/ausschreibungen-hessen', text: 'Ausschreibungen Hessen im Überblick' },
        { path: '/bauauftraege-finden', text: 'Bauaufträge nach Gewerk und Region' },
    ],
}
