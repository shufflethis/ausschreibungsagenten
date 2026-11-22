export const ausschreibungenBerlin = {
    path: '/ausschreibungen-berlin',
    h1: 'Ausschreibungen Berlin: Land, Bund und EU-Verfahren finden',
    direktantwort:
        'In Berlin treffen Landes- und Bezirksvergaben auf einen besonders hohen Anteil an Bundesbehörden, Ministerien und bundeseigenen Einrichtungen. Ausschreibungsagenten.de bündelt Berliner Bekanntmachungen über 18 Live-Quellen – insbesondere den Datenservice Öffentlicher Einkauf (Ober- und Unterschwelle), service.bund.de, DTVP und TED – und begründet jeden Treffer transparent.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kriterium', 'Stand für Berlin'],
        zeilen: [
            ['Zentrale Quellen für Berlin', 'Datenservice Öffentlicher Einkauf (oeffentlichevergabe.de), service.bund.de, TED, DTVP, RIB'],
            ['Landesvergaberecht', 'Berliner Ausschreibungs- und Vergabegesetz (BerlAVG), UVgO, VOB/A'],
            ['Wichtige BerlAVG-Pflichten', 'Vergabespezifischer Mindestlohn, Umweltschutz- und Frauenförderungs-Nachweise'],
            ['EU-Schwellenwerte 2026/27', '140.000 € (oberste Bundesbehörden in Berlin) · 216.000 € (Land/Bezirke) · 5.404.000 € (Bau)'],
            ['Regionssuche', 'Filtert auf Leistungsort Berlin (NUTS DE30) inkl. kombinierbarer Umlandsuche'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum der Berliner Vergabemarkt anders tickt als Flächenländer',
            absaetze: [
                'Berlin vereint zwei große Auftraggeber-Welten auf engstem Raum: die Senatsverwaltungen, zwölf Bezirke und landeseigenen Betriebe einerseits sowie Bundesministerien, Bundesämter, Stiftungen und Forschungseinrichtungen andererseits. Gerade bei den obersten Bundesbehörden greift bereits der niedrigere [EU-Schwellenwert von 140.000 Euro netto](/eu-schwellenwerte) für Liefer- und Dienstleistungen.',
                'Dadurch fallen in Berlin überdurchschnittlich viele Verfahren aus [IT & Software](/ausschreibungen-it), [Marketing, PR & Kommunikation](/ausschreibungen-marketing), Beratung sowie [Architektur & Bau](/ausschreibungen-architektur) an.',
            ],
            links: [
                { href: '/?region=Berlin#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Berlin' },
                { href: '/?region=Berlin&gewerk=marketing#ergebnisse', text: 'Live-Suche öffnen: Marketing & PR in Berlin' },
                { href: '/?region=Berlin&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Berlin' },
            ],
        },
        {
            titel: 'Quellenabdeckung für Berlin ehrlich erklärt',
            absaetze: [
                'Wir weisen unsere Abdeckung transparent aus: Für Berlin fließen Bekanntmachungen über den zentralen **Datenservice Öffentlicher Einkauf** (`oeffentlichevergabe.de`, Ober- und Unterschwelle), **service.bund.de** (Bundesbehörden), **TED** (EU-Verfahren), **DTVP** und **RIB** in unsere 18 Live-Quellen ein. Die Berliner Landesplattform `mein.berlin.de` ist aktuell nicht als eigener Direkt-Scraper angebunden; was dort über den Datenservice Öffentlicher Einkauf gemeldet wird, ist enthalten.',
                'Den genauen Abrufstand jeder Quelle sehen Sie jederzeit im [Quellenstatus](/status); eine Übersicht aller passenden Branchencodes liefert die [CPV-Code-Suche](/cpv-code-suche).',
            ],
        },
        {
            titel: 'Besonderheit BerlAVG: Formale Nachweise früh prüfen',
            absaetze: [
                'Bei Berliner Landesvergaben verlangt das **Berliner Ausschreibungs- und Vergabegesetz (BerlAVG)** regelmäßig zusätzliche Eigenerklärungen – etwa zum vergabespezifischen Mindeststundenentgelt, zur Frauenförderung (ab bestimmten Betriebsgrößen) oder zu ökologischen Kriterien. Fehlen diese Formblätter, droht der formale Ausschluss.',
                'Worauf Sie bei Eignungs- und Formalnachweisen achten sollten, fassen [KI und Ausschreibungen](/ki-angebot-ausschreibung) und unsere [Eignungskriterien-Auswertung](/zahlen) zusammen.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was unsere Berlin-Suche nicht abdeckt',
        absaetze: [
            'Verfahren, die ausschließlich auf der Berliner Vergabeplattform ohne Weitergabe an den Datenservice Öffentlicher Einkauf, TED, Bund oder DTVP stehen, sowie nicht-öffentliche Direktvergaben erscheinen nicht in unseren 18 Live-Quellen. Wir behaupten bewusst keine lückenlose Abdeckung.',
            'Auch juristische Prüfungen zum BerlAVG, Angebotstexte oder Preiskalkulationen gehören nicht zu unserem Umfang. Alle Konditionen für ein Berlin-Suchprofil (Pilot 0 €) stehen auf der [Preisseite](/preise).',
        ],
    },
    faq: [
        {
            frage: 'Welcher EU-Schwellenwert gilt für Bundesbehörden mit Sitz in Berlin?',
            antwort:
                'Für Liefer- und Dienstleistungen oberster und oberer Bundesbehörden (z. B. Bundesministerien in Berlin) gilt seit 1. Januar 2026 der niedrigere EU-Schwellenwert von 140.000 Euro netto, für das Land Berlin und Bezirke gelten 216.000 Euro netto. Beide Werte lassen sich im [EU-Schwellenwerte-Rechner](/eu-schwellenwerte) prüfen.',
        },
        {
            frage: 'Welche Quellen decken Berliner Ausschreibungen bei Ausschreibungsagenten.de ab?',
            antwort:
                'Berliner Verfahren kommen über den Datenservice Öffentlicher Einkauf (Ober- und Unterschwelle), service.bund.de, TED, DTVP und RIB in unsere 18 Live-Quellen. Der Abrufstand ist öffentlich im [Quellenstatus](/status) einsehbar.',
        },
        {
            frage: 'Worauf müssen Bieter beim Berliner Vergabegesetz (BerlAVG) achten?',
            antwort:
                'Häufig sind verbindliche Eigenerklärungen zum Berliner Vergabemindestlohn, zur Tariftreue, zu Umweltkriterien und je nach Betriebsgröße zur Frauenförderung gefordert. Prüfen Sie die beiliegenden Formblätter immer anhand der Originalbekanntmachung.',
        },
        {
            frage: 'Sitzt Ausschreibungsagenten.de selbst in Berlin?',
            antwort:
                'Ja. Die Betreiberin Yawusa UG (haftungsbeschränkt) hat ihren Sitz in Berlin-Prenzlauer Berg (Schliemannstraße 23, 10437 Berlin). Mehr zum Team steht auf [Über uns](/ueber-uns).',
        },
    ],
    ctaKontext: 'Ausschreibungen Berlin',
    ctaTitel: 'Berlin- & Bund-Suchprofil kostenfrei im Pilot einrichten',
    ctaText:
        'Wir kombinieren Ihre CPV-Codes, Leistungen und Ausschlüsse für Berlin (optional inkl. Brandenburg) und zeigen Ihnen aktuelle Verfahren aus Bund, Land und EU mit Begründung.',
    querverweise: [
        { path: '/status', text: 'Live-Quellenstatus aller 18 Vergabequellen' },
        { path: '/ausschreibungen-it', text: 'IT- & Software-Ausschreibungen (CPV 72 & 48)' },
        { path: '/ausschreibungen-marketing', text: 'Marketing-, PR- & Agentur-Ausschreibungen' },
        { path: '/eu-schwellenwerte', text: 'EU-Schwellenwerte 2026/2027 prüfen' },
    ],
}
