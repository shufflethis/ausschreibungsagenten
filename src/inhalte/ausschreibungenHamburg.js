export const ausschreibungenHamburg = {
    path: '/ausschreibungen-hamburg',
    h1: 'Ausschreibungen Hamburg: e-Vergabe, TED & Förder-Alternativen 2027',
    direktantwort:
        'Hamburg zählt mit großen Auftraggebern wie Dataport, Hochbahn, HPA, Sprinkenhof und den Bezirksämtern zu den volumenstärksten Vergabemärkten Norddeutschlands. Ausschreibungsagenten.de durchsucht 18 Live-Quellen gezielt nach Leistungsort Hamburg (NUTS DE600), CPV-Code und Frist — und zeigt nach dem Ende des Hamburg Digital Check die aktiven Bundes-Förderprogramme 2027.',
    fakten: {
        datenstand: '24. November 2026',
        kopf: ['Kriterium', 'Stand für Hamburg'],
        zeilen: [
            ['Zentrale Landesplattform', 'fbhh-evergabe.web.hamburg.de / hamburg.de Ausschreibungen'],
            ['Abgedeckte Live-Quellen', 'Datenservice Öffentlicher Einkauf (Ober- & Unterschwelle), TED, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'HmbVgG (Hamburgisches Vergabegesetz), UVgO, VOB/A, Tariftreuevorgaben'],
            ['EU-Schwellenwerte 2026/27', '216.000 € klassisch · 432.000 € Sektoren (ÖPNV/Hafen) · 5.404.000 € Bau'],
            ['Regionsfilter (NUTS)', 'DE6 / DE600 (Freie und Hansestadt Hamburg)'],
            ['Förderstatus 2026/2027', 'Hamburg Digital Check am 16.11.2026 geschlossen → BAFA, Forschungszulage, AfA 30 % & QCG'],
        ],
    },
    abschnitte: [
        {
            titel: 'Besonderheiten bei öffentlichen Vergaben in Hamburg',
            absaetze: [
                'Neben dem klassischen Hoch- und Tiefbau prägen Sektorenauftraggeber (Hafen, Verkehr, Energie mit 432.000 € [EU-Schwellenwert](/eu-schwellenwerte)) sowie große [IT-Ausschreibungen](/ausschreibungen-it) über Dataport mit [EVB-IT-Verträgen](/evb-it-vertrag) das Vergabevolumen in Hamburg.',
                'Gerade bei länderübergreifenden Stellen trennt unsere Suche konsequent zwischen Behördensitz und tatsächlichem Leistungsort (`DE600`). Metropolregion-Betriebe kombinieren Hamburg häufig direkt mit [Schleswig-Holstein](/ausschreibungen-schleswig-holstein) und [Niedersachsen](/ausschreibungen-niedersachsen).',
            ],
            links: [
                { href: '/?region=Hamburg#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Hamburg' },
                { href: '/?region=Hamburg&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Hamburg' },
            ],
        },
        {
            titel: 'Nach dem Hamburg Digital Check: Aktive Fördermittel 2027',
            absaetze: [
                'Am 16. November 2026 endete der finale Antragsschluss für den Hamburg Digital Check bei der IFB Hamburg; die Richtlinie läuft Ende 2026 aus. Hamburger KMU greifen 2027 direkt auf die aktiven Bundes-Instrumente zurück: [BAFA Beratung bis 2028](/bafa-foerderung-2027), steuerliche Forschungszulage (35 % KMU), [Investitionsbooster (30 % AfA)](/foerderung-ki-hardware-investitionsbooster), KfW 511/512 und QCG-Weiterbildung.',
                'Prüfen Sie Ihren persönlichen Fahrplan im [Auftrags- & Förder-Planer 2027](/foerder-und-auftrags-planer).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer Hamburg-Abdeckung',
        absaetze: [
            'Hamburger Bekanntmachungen erfassen wir produktiv über den Datenservice Öffentlicher Einkauf, TED, service.bund.de, DTVP und RIB. Ein eigener Direkt-Scraper für das FBHH-Portal ist im [Quellenstatus](/status) derzeit nicht separat gelistet.',
            'Für verbindliche Vergabeunterlagen, Bieterfragen und die elektronische Angebotsabgabe bleibt stets die verlinkte Originalbekanntmachung maßgeblich.',
        ],
    },
    faq: [
        {
            frage: 'Kann ich den Hamburg Digital Check 2027 noch beantragen?',
            antwort:
                'Nein. Der letzte Antragsschluss des Hamburg Digital Check (IFB Hamburg) war der 16. November 2026. Für 2027 stehen Hamburger KMU bundesweite Programme wie BAFA Beratung, Forschungszulage, Investitionsbooster, KfW 511/512 und QCG offen.',
        },
        {
            frage: 'Welcher EU-Schwellenwert gilt für Hochbahn oder Hafen-Vergaben?',
            antwort:
                'Für Sektorenauftraggeber in den Bereichen Verkehr, Hafen, Wasser und Energie gilt 2026/2027 ein EU-Schwellenwert von 432.000 € netto bei Liefer- und Dienstleistungen (5.404.000 € bei Bau).',
        },
        {
            frage: 'Kann ich Hamburg gemeinsam mit dem Umland überwachen?',
            antwort:
                'Ja. In einem Suchprofil auf Ausschreibungsagenten.de kombinieren Sie Hamburg nahtlos mit angrenzenden Regionen in Schleswig-Holstein und Niedersachsen.',
        },
    ],
    ctaKontext: 'Ausschreibungen Hamburg',
    ctaTitel: 'Hamburger Suchprofil im kostenfreien Pilot einrichten',
    ctaText:
        'Erhalten Sie passende öffentliche Ausschreibungen aus Hamburg und der Metropolregion über 18 Live-Quellen mit nachvollziehbaren Treffergründen.',
    querverweise: [
        { path: '/foerder-und-auftrags-planer', text: 'Auftrags- & Förder-Planer 2027 für Hamburg' },
        { path: '/ausschreibungen-schleswig-holstein', text: 'Ausschreibungen Schleswig-Holstein & 40 % DKU' },
        { path: '/ausschreibungen-niedersachsen', text: 'Ausschreibungen Niedersachsen im Überblick' },
        { path: '/evb-it-vertrag', text: 'EVB-IT Vertrag Checkliste für IT-Bieter' },
    ],
}
