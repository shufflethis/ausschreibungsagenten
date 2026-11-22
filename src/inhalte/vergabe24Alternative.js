export const vergabe24Alternative = {
    path: '/vergabe24-alternative',
    h1: 'Vergabe24 Alternative: erklärbares Matching, offene Preise und API',
    direktantwort:
        'Vergabe24 zählt zu den traditionsreichsten Ausschreibungsdiensten in Deutschland und bündelt laut Anbieter über 570.000 Bekanntmachungen im Jahr. Ausschreibungsagenten.de setzt auf ein anderes Modell: 18 benannte Live-Quellen mit offenem Quellenstatus, erklärbares Matching mit Begründung je Treffer, transparente Tarife ab 149 Euro nach kostenfreier Pilotphase sowie direkte Schnittstellen per REST-API, MCP und A2A.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Merkmal', 'Vergabe24', 'Ausschreibungsagenten.de'],
        zeilen: [
            ['Positionierung', 'Klassischer Ausschreibungsdienst mit Abo-Paketen', 'Erklärbares Profil-Matching mit persönlicher Pilotphase'],
            ['Quellen-Nachweis', 'Laut Anbieter 570.000+ Ausschreibungen pro Jahr', '18 benannte Live-Quellen mit Zeitstempel im Quellenstatus'],
            ['Matching', 'CPV-Codes, Stichwörter und gespeicherte Suchprofile', 'CPV, Begriffe, Ausschlüsse, Ort, Wert, Frist – mit Gründen je Treffer'],
            ['GAEB & Export', 'Plattform-Downloads und Benachrichtigungen', 'GAEB X83/X84 lesend (inkl. Browser-Viewer), JSON/CSV/XLSX/Webhook'],
            ['API & KI-Agenten', 'Fokus auf klassische Weboberfläche', 'Dokumentierte REST-API, Free API-Key, MCP-Server & A2A'],
            ['Preise & Einstieg', 'Bezahlte Pakete nach Umfang und Laufzeit', 'Live-Suche ohne Anmeldung, Pilotphase 0 €, Pro 149 €/Mon., Agent 499 €/Mon.'],
        ],
    },
    abschnitte: [
        {
            titel: 'Wann Betriebe nach einer Vergabe24-Alternative suchen',
            absaetze: [
                'Vergabe24 ist seit vielen Jahren im deutschen Markt präsent und deckt ein breites Spektrum klassischer Bekanntmachungen ab. Viele Unternehmen schätzen die vertraute Struktur aus Suchprofilen und E-Mail-Benachrichtigungen.',
                'Typische Wechselgründe entstehen im Alltag dort, wo Trefferlisten zu breit ausfallen, die Ursache einzelner Meldungen unklar bleibt oder Unternehmen Ausschreibungsdaten automatisiert in eigene Systeme, CRM-Pipelines oder KI-Workflows übernehmen wollen.',
            ],
        },
        {
            titel: 'Erklärbare Einzelgründe und offener Quellenstatus',
            absaetze: [
                'Bei Ausschreibungsagenten.de sehen Sie zu jeder gemeldeten Ausschreibung die konkreten Gründe für oder gegen eine Teilnahme: passenden [CPV-Code](/cpv-code-suche), Leistungsort, [EU-Schwellenwert](/eu-schwellenwerte), Fristenvorlauf und etwaige Ausschlussbegriffe. So lässt sich ein Suchprofil gezielt nachschärfen statt täglich unpassende Mails auszusortieren.',
                'Zudem dokumentiert der öffentliche [Quellenstatus](/status) alle 18 angebundenen Quellen mit letztem erfolgreichem Abruf – darunter TED, den Datenservice Öffentlicher Einkauf, service.bund.de, DTVP, RIB sowie zehn Landes- und Regionalportale.',
            ],
        },
        {
            titel: 'GAEB-Vorprüfung, offene Tarife und Agenten-Anbindung',
            absaetze: [
                'Baubetriebe und Handwerker können Leistungsverzeichnisse im Format X83/X84 direkt im kostenlosen [GAEB-Viewer](/gaeb-viewer) lokal im Browser prüfen oder im Pilot strukturiert auswerten lassen.',
                'Alle Konditionen – von der kostenfreien Vorschau und dem Free API-Key bis zu Pro (149 €/Monat) und Agent (499 €/Monat) nach der kostenfreien Pilotphase – stehen offen auf der [Preisseite](/preise). Technische Teams binden die Daten über [REST, MCP oder A2A](/entwickler) direkt an.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was Ausschreibungsagenten.de im Vergleich zu Vergabe24 nicht leistet',
        absaetze: [
            'Ausschreibungsagenten.de verspricht keine lückenlose Abdeckung sämtlicher kommunaler Amtsblätter oder privater Projekte. Unsere Basis sind aktuell 18 namentlich belegte öffentliche Live-Quellen, deren Abrufstand jederzeit prüfbar ist.',
            'Auch die Angebotsabgabe, Preiskalkulation oder Vergaberechtsberatung gehören bewusst nicht zum Leistungsumfang. Weitere Anbieter im Vergleich zeigt der [Software-Vergleich nach Use Case](/beste-software-automatische-ausschreibungssuche), speziell für Großanbieter auch unsere [DTAD Alternative](/dtad-alternative).',
        ],
    },
    faq: [
        {
            frage: 'Was kostet Ausschreibungsagenten.de im Vergleich zu Vergabe24?',
            antwort:
                'Die öffentliche Live-Suche auf der Website und die begleitete Pilotphase kosten 0 Euro ohne Zahlungsdaten. Für den späteren Regelbetrieb sind die Preise offen auf der [Preisseite](/preise) genannt: 149 Euro netto im Monat (Pro) und 499 Euro netto im Monat (Agent).',
        },
        {
            frage: 'Kann ich Vergabe24 und Ausschreibungsagenten.de parallel vergleichen?',
            antwort:
                'Ja. Am aussagekräftigsten ist ein ein- bis zweiwöchiger Paralleltest mit identischen Gewerken, CPV-Codes, Ausschlusswörtern und Regionen. So vergleichen Sie unmittelbar die Zahl wirklich passender Verfahren gegen das Rauschen.',
        },
        {
            frage: 'Welche deutschen Portale deckt Ausschreibungsagenten.de ab?',
            antwort:
                'Aktuell 18 produktiv angebundene Quellen: neben TED, service.bund.de, dem zentralen Datenservice Öffentlicher Einkauf (Ober- und Unterschwelle), DTVP und RIB unter anderem die Landesportale für [NRW](/ausschreibungen-nrw), [Bayern](/ausschreibungen-bayern), [Baden-Württemberg](/ausschreibungen-baden-wuerttemberg) und [Hessen](/ausschreibungen-hessen). Alle Quellen stehen live im [Quellenstatus](/status).',
        },
        {
            frage: 'Lassen sich Suchprofile von Vergabe24 übernehmen?',
            antwort:
                'Ein automatischer Import aus Fremdkonten existiert nicht, aber im kostenfreien Pilot übersetzen wir Ihre bestehenden Leistungen, CPV-Codes und Ausschlussbegriffe innerhalb einer kurzen Abstimmung direkt in ein transparentes Suchprofil.',
        },
    ],
    ctaKontext: 'Vergabe24-Alternative',
    ctaTitel: 'Erklärbare Treffer parallel zu Vergabe24 prüfen',
    ctaText:
        'Testen Sie Ausschreibungsagenten.de kostenfrei im Pilot mit Ihrem bestehenden Leistungsprofil – mit offener Begründung je Treffer und belegtem Quellenstatus.',
    querverweise: [
        { path: '/beste-software-automatische-ausschreibungssuche', text: 'Beste Software für automatische Ausschreibungssuche nach Use Case' },
        { path: '/dtad-alternative', text: 'DTAD Alternative im Detailvergleich' },
        { path: '/ibau-alternative', text: 'ibau Alternative für Bau und Handwerk' },
        { path: '/preise', text: 'Offene Preise, API-Limits und kostenfreie Pilotphase' },
    ],
}
