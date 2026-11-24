export const ausschreibungenBrandenburg = {
    path: '/ausschreibungen-brandenburg',
    h1: 'Ausschreibungen Brandenburg: Vergabemarktplatz, TED & BIG-Digital 2027',
    direktantwort:
        'Unternehmen in Brandenburg profitieren 2026/2027 von einer starken Doppelchance: laufenden öffentlichen Ausschreibungen in Potsdam, Cottbus und dem Berliner Umland sowie aktiven 50-%-Zuschüssen über BIG-Digital (bis 30.06.2027) und 80 % BAFA-Beratung. Ausschreibungsagenten.de bündelt 18 Live-Quellen und filtert Brandenburg (DE4) auf Wunsch direkt gemeinsam mit Berlin.',
    fakten: {
        datenstand: '24. November 2026',
        kopf: ['Kriterium', 'Stand für Brandenburg'],
        zeilen: [
            ['Zentrale Landesplattform', 'Vergabemarktplatz Brandenburg (vergabemarktplatz.brandenburg.de)'],
            ['Abgedeckte Live-Quellen', 'Datenservice Öffentlicher Einkauf (Ober- & Unterschwelle), TED, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'BbgVergG (Brandenburgisches Vergabegesetz), UVgO, VOB/A'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['NUTS-Region', 'DE4 / DE40 (Brandenburg – kombinierbar mit DE3 Berlin)'],
            ['Förder-Highlight 2027', 'BIG-Digital (ILB) AKTIV bis 30.06.2027 (50 % bis 250k € Implementierung) + 80 % BAFA'],
        ],
    },
    abschnitte: [
        {
            titel: 'Hauptstadtregion gemeinsam denken: Brandenburg & Berlin in einem Profil',
            absaetze: [
                'Viele Bau-, Elektro-, IT- und Dienstleistungsbetriebe im Berliner Umland (Potsdam, Teltow, Oranienburg, Bernau, Cottbus) arbeiten täglich über die Landesgrenze hinweg. Statt zwei Landesportale getrennt abzuklappern, filtert Ausschreibungsagenten.de Brandenburg (`DE4`) und [Berlin](/ausschreibungen-berlin) (`DE3`) auf Wunsch gemeinsam nach Leistungsort und [CPV-Code](/cpv-code-suche).',
            ],
            links: [
                { href: '/?region=Brandenburg#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Brandenburg' },
                { href: '/?region=Brandenburg&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Brandenburg' },
            ],
        },
        {
            titel: 'BIG-Digital bis 30. Juni 2027 & 80 % BAFA-Förderung sichern',
            absaetze: [
                'Mit dem **Brandenburgischen Innovationsgutschein (BIG-Digital)** der ILB erhalten KMU und Handwerksbetriebe bis zum **30. Juni 2027** satte **50 % Zuschuss** für Beratung (bis 50.000 €), Implementierung von Prozessinnovationen (bis 250.000 €, inkl. projektnotwendiger IT/Hardware) und Schulung (bis 50.000 €).',
                'Wichtig: Vor Antragstellung ist eine verbindliche Erstberatung bei der **WFBB** Pflicht, und es gilt die Vorhabenbeginn-Sperre. Zusätzlich greifen 80 % Zuschuss bei der [BAFA-Beratungsförderung](/bafa-foerderung-2027). Sichern Sie sich die 30.06.2027-Erinnerung direkt als `.ics` im [Auftrags- & Förder-Planer 2027](/foerder-und-auftrags-planer).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer Brandenburg-Abdeckung',
        absaetze: [
            'Ausschreibungsagenten.de erfasst Brandenburger Verfahren über Datenservice Öffentlicher Einkauf, TED, service.bund.de, DTVP und RIB. Ein eigener Direkt-Scraper für vergabemarktplatz.brandenburg.de ist im [Quellenstatus](/status) derzeit nicht gesondert aufgeführt.',
            'Für BIG-Digital-Anträge und WFBB-Beratungstermine sind ausschließlich die offiziellen Richtlinien der ILB maßgeblich.',
        ],
    },
    faq: [
        {
            frage: 'Bis wann kann BIG-Digital in Brandenburg beantragt werden?',
            antwort:
                'Die aktuelle Richtlinie von BIG-Digital (ILB) läuft bis zum 30. Juni 2027. Da vor dem Antrag ein verpflichtendes Beratungsgespräch bei der WFBB notwendig ist, sollten Betriebe spätestens im Frühjahr 2027 starten.',
        },
        {
            frage: 'Wie hoch ist die BAFA-Förderquote in Brandenburg 2027?',
            antwort:
                'Brandenburg gehört zu den Regionen mit 80 % Förderquote — KMU erhalten bis zu 2.800 € Zuschuss auf maximal 3.500 € Beratungskosten. Die Richtlinie wurde bis Ende 2028 verlängert.',
        },
        {
            frage: 'Kann ich Brandenburg und Berlin in einem Ausschreibungsprofil verbinden?',
            antwort:
                'Ja. In Ausschreibungsagenten.de kombinieren Sie beide Länder über Region und CPV-Codes in einem gemeinsamen Profil aus 18 Live-Quellen.',
        },
    ],
    ctaKontext: 'Ausschreibungen Brandenburg & BIG-Digital',
    ctaTitel: 'Brandenburg-Profil & BIG-Digital-Frist im Pilot starten',
    ctaText:
        'Erhalten Sie aktuelle Vergaben aus Brandenburg und Berlin inklusive Begründung je Treffer — kostenfrei in der Pilotphase.',
    querverweise: [
        { path: '/foerder-und-auftrags-planer', text: 'BIG-Digital & Auftrags-Planer 2027 für Brandenburg' },
        { path: '/ausschreibungen-berlin', text: 'Ausschreibungen Berlin im Überblick' },
        { path: '/foerdermittel-kalender-2027', text: 'Fördermittel-Kalender 2027 (inkl. 30.06.2027 Frist)' },
        { path: '/bafa-foerderung-2027', text: 'BAFA 80 %-Förderung in Brandenburg' },
    ],
}
