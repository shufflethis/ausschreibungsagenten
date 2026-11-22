export const ausschreibungenBayern = {
    path: '/ausschreibungen-bayern',
    h1: 'Ausschreibungen Bayern: Landesportal, TED & Kommunen finden',
    direktantwort:
        'Öffentliche Ausschreibungen in Bayern erscheinen auf der Vergabeplattform Bayern (vergabe.bayern.de), im Datenservice Öffentlicher Einkauf, auf DTVP, RIB sowie für EU-Verfahren auf TED. Ausschreibungsagenten.de bindet das Landesportal Bayern als Teil von 18 Live-Quellen direkt an, filtert nach bayerischem Leistungsort und begründet jeden Treffer transparent über CPV-Code, Frist und Ausschlüsse.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kriterium', 'Stand für den Freistaat Bayern'],
        zeilen: [
            ['Landesportal', 'Landesportal Bayern (vergabe.bayern.de) – direkt in unseren 18 Live-Quellen'],
            ['Weitere relevante Quellen', 'TED (EU-Oberschwelle), Datenservice Öffentlicher Einkauf, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'UVgO Bayern, VOB/A Abschnitt 1 (Bau), VwVöA (Verwaltungsvorschrift zum öffentlichen Auftragswesen)'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['Regionssuche', 'Leistungsort & bayerische NUTS-Regionen (DE21–DE27, Oberbayern bis Schwaben)'],
        ],
    },
    abschnitte: [
        {
            titel: 'Welche Vergabeportale für Bayern entscheidend sind',
            absaetze: [
                'Der Freistaat Bayern veröffentlicht zentrale Landesvergaben über die Vergabeplattform Bayern (`vergabe.bayern.de`), die direkt zu unseren 18 produktiv abgefragten Quellen zählt (Abrufzeitpunkt im [Quellenstatus](/status)).',
                'Viele bayerische Städte, Landkreise, Hochschulen und Staatsbauämter publizieren jedoch parallel über den zentralen Datenservice Öffentlicher Einkauf, DTVP, RIB und oberhalb der [EU-Schwellenwerte 2026/2027](/eu-schwellenwerte) auf TED. Wer nur ein Portal beobachtet, übersieht regelmäßig relevante Fachlose.',
            ],
            links: [
                { href: '/?region=Bayern#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Bayern' },
                { href: '/?region=Bayern&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Bayern (CPV 45)' },
                { href: '/?region=Bayern&gewerk=facade_construction#ergebnisse', text: 'Live-Suche öffnen: Fenster, Fassade & Metallbau in Bayern' },
            ],
        },
        {
            titel: 'Bayerische Besonderheiten: VwVöA, Bauämter und Mittelstandsförderung',
            absaetze: [
                'In Bayern prägen die staatlichen Bauämter, Bezirke und rund 2.056 Kommunen ein sehr hohes Volumen im Bau-, Planungs- und Dienstleistungssektor. Im Unterschwellenbereich greifen die UVgO, die VOB/A Abschnitt 1 sowie die bayerische Verwaltungsvorschrift zum öffentlichen Auftragswesen (VwVöA) mit ausgeprägter Mittelstandsförderung durch Fach- und Teillose.',
                'Für Handwerks- und Baubetriebe lassen sich Leistungsbeschreibungen im GAEB-Format direkt im kostenlosen [GAEB-Viewer](/gaeb-viewer) prüfen; passende Branchencodes liefert die [CPV-Code-Suche](/cpv-code-suche).',
            ],
        },
        {
            titel: 'Regional eingrenzen: Oberbayern, Franken, Schwaben oder konkretes Gewerk',
            absaetze: [
                'Bayern ist flächenmäßig das größte Bundesland – ein Betrieb aus Würzburg fährt selten für ein kleines Fachlos nach Rosenheim. Unsere Regionssuche prüft deshalb Leistungsort und bayerische NUTS-Regionen (Oberbayern, Niederbayern, Oberpfalz, Ober-/Mittel-/Unterfranken, Schwaben) und lässt sich direkt mit Gewerken wie [Elektro & SHK](/ausschreibungen-elektro-shk), [Architektur](/ausschreibungen-architektur) oder [IT](/ausschreibungen-it) kombinieren.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was unsere Bayern-Suche nicht abdeckt',
        absaetze: [
            'Freihändige Vergaben und Beschränkte Ausschreibungen ohne öffentlichen Teilnahmewettbewerb erscheinen nicht öffentlich und sind daher in keiner Suchmaschine enthalten. Zudem erfassen wir aktuell 18 namentlich belegte öffentliche Quellen und keine privaten Bauprojekte (siehe [ibau Alternative](/ibau-alternative)).',
            'Verbindlich für Fristen, Unterlagen und Abgabe bleibt immer das verlinkte Originalportal. Alle Konditionen für den kostenfreien Pilot und den späteren Regelbetrieb stehen auf der [Preisseite](/preise).',
        ],
    },
    faq: [
        {
            frage: 'Fragt Ausschreibungsagenten.de das Landesportal Bayern direkt ab?',
            antwort:
                'Ja. Das Landesportal Bayern ist fester Bestandteil unserer 18 Live-Quellen und wird regelmäßig mit TED, dem Datenservice Öffentlicher Einkauf, DTVP und RIB abgeglichen. Den letzten Abruf zeigt der [Quellenstatus](/status).',
        },
        {
            frage: 'Kann ich meine Suche auf München, Nürnberg, Augsburg oder Regensburg eingrenzen?',
            antwort:
                'Ja. Geben Sie im Feld „Leistungsregion“ einfach „Bayern“ oder Ihre Zielstadt ein. Fehlt der Leistungsort in einer Bekanntmachung, kennzeichnet die Entscheidungskarte das transparent als offenen Punkt.',
        },
        {
            frage: 'Welche Branchen sind in bayerischen Ausschreibungen besonders stark?',
            antwort:
                'Bundesweit führen laut unserer [TED-Auswertung](/zahlen) Bauarbeiten (CPV 45, 38 %) und Architektur-/Ingenieurleistungen (CPV 71, 17 %), gefolgt von Umwelt/Reinigung, Fahrzeugen, Marketing und IT – ein Muster, das sich in Bayern besonders bei Schul-, Infrastruktur- und Digitalisierungsprojekten widerspiegelt.',
        },
        {
            frage: 'Wie richte ich einen kostenlosen E-Mail-Alert für Bayern ein?',
            antwort:
                'Hinterlegen Sie Ihr Gewerk, Ihre bayerische Zielregion und Ausschlusswörter im kostenfreien Pilotprofil auf der Startseite. Im Pilot fallen 0 Euro an, ohne Zahlungsdaten ([Preise & Limits](/preise)).',
        },
    ],
    ctaKontext: 'Ausschreibungen Bayern',
    ctaTitel: 'Bayern-Suchprofil kostenfrei im Pilot testen',
    ctaText:
        'Wir richten Ihre Gewerke, Zielregionen in Bayern und Ausschlusswörter im Pilot ein und senden Ihnen passende Treffer aus dem Landesportal Bayern, TED und Bund mit Begründung.',
    querverweise: [
        { path: '/status', text: 'Live-Quellenstatus inkl. Landesportal Bayern' },
        { path: '/ausschreibungen-baden-wuerttemberg', text: 'Ausschreibungen Baden-Württemberg' },
        { path: '/bauauftraege-finden', text: 'Bauaufträge nach Gewerk und Region' },
        { path: '/gaeb-viewer', text: 'Kostenloser GAEB-Viewer (X83/X84)' },
    ],
}
