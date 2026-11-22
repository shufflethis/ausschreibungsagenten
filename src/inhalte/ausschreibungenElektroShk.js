export const ausschreibungenElektroShk = {
    path: '/ausschreibungen-elektro-shk',
    h1: 'Ausschreibungen für Elektro, SHK und TGA-Handwerk finden',
    direktantwort:
        'Öffentliche Aufträge für Elektroinstallation, Heizung, Lüftung, Sanitär und Dämmung laufen unter CPV-Gruppe 453 (Bauinstallationsarbeiten). Ausschreibungsagenten.de filtert 18 Live-Quellen von TED und dem Datenservice Öffentlicher Einkauf bis zu den Landesportalen gezielt nach Haupt-CPV 453 und Leistungsort, zeigt Fachlose sowie Fristen an und bietet für GAEB-Leistungsverzeichnisse (X83/X84) einen kostenlosen Browser-Viewer.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Gewerk / Bereich', 'CPV-Code', 'Typische öffentliche Aufträge'],
        zeilen: [
            ['Bauinstallation gesamt (TGA)', '45300000', 'Kombinierte Gebäudetechnik in Schulen, Kitas, Verwaltungen'],
            ['Elektroinstallation', '45310000', 'Stark-/Schwachstrom, Beleuchtung, Photovoltaik, Brandmeldeanlagen'],
            ['Dämmarbeiten', '45320000', 'Wärmedämmung, technische Isolierung, Brandschutzabschottung'],
            ['SHK (Sanitär, Heizung, Klima)', '45330000', 'Wärmepumpen, RLT-Lüftungsanlagen, Sanitär- und Heizungstechnik'],
            ['GAEB-Leistungsverzeichnis', 'X83 / X84', 'Vorprüfung im kostenlosen Browser-GAEB-Viewer ohne Upload'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum öffentliche Fachlose für Elektro- und SHK-Betriebe planbar sind',
            absaetze: [
                'Bei nahezu jedem öffentlichen Neubau oder jeder energetischen Sanierung (Schulen, Sporthallen, Kliniken, Rathäuser) machen Elektro- und SHK-Gewerke einen zentralen Teil der Bausumme aus. Dank der gesetzlichen Pflicht zur Losaufteilung (§ 97 Abs. 4 GWB / § 5 Abs. 2 VOB/A) werden Elektro-, Heizungs-, Lüftungs- und Sanitärlose regelmäßig separat ausgeschrieben — direkt erreichbar für regionale Handwerksbetriebe.',
                'Der Filter „Bau: Elektro, SHK & Dämmung“ prüft gezielt auf Haupt-CPV 453 und kombiniert ihn mit Ihrem echten Leistungsort statt dem Sitz der Behörde.',
            ],
            links: [
                { href: '/?gewerk=haustechnik#ergebnisse', text: 'Live-Suche öffnen: Elektro, SHK & Dämmung (CPV 453)' },
                { href: '/?gewerk=haustechnik&suche=Elektro#ergebnisse', text: 'Live-Suche öffnen: Elektroinstallation & PV' },
                { href: '/?gewerk=haustechnik&suche=Heizung#ergebnisse', text: 'Live-Suche öffnen: Heizung, Lüftung & Sanitär' },
            ],
        },
        {
            titel: 'GAEB-X83-Dateien vor der Kalkulation in Sekunden prüfen',
            absaetze: [
                'Gerade in der technischen Gebäudeausrüstung umfassen GAEB-Leistungsverzeichnisse schnell hunderte Positionen. Bevor der Meister oder Kalkulator Stunden investiert, lässt sich jede GAEB-DA-XML-Datei (X81–X86) direkt im kostenlosen [GAEB-Viewer](/gaeb-viewer) lokal im Browser öffnen, nach Stichwörtern wie „Wärmepumpe“ oder „Brandmelde“ durchsuchen und als Excel-CSV exportieren.',
                'Der Viewer arbeitet ohne Server-Upload; im begleiteten Pilot steht dieselbe lesende GAEB-Strukturierung direkt neben Ihren Treffern bereit ([Preise & Pilotphase](/preise)).',
            ],
        },
        {
            titel: 'Unterschwellige Vergaben richtig finden',
            absaetze: [
                'Weil der [EU-Schwellenwert für Bauaufträge 2026/2027](/eu-schwellenwerte) bei 5.404.000 Euro netto liegt, erscheinen die meisten Elektro- und SHK-Fachlose national nach VOB/A Abschnitt 1 — also nicht nur auf TED, sondern vor allem im Datenservice Öffentlicher Einkauf, auf DTVP, RIB und den Landesportalen wie [NRW](/ausschreibungen-nrw), [Bayern](/ausschreibungen-bayern), [Baden-Württemberg](/ausschreibungen-baden-wuerttemberg) und [Hessen](/ausschreibungen-hessen). Alle 18 Live-Quellen stehen im [Quellenstatus](/status).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was der Elektro-/SHK-Filter nicht leistet',
        absaetze: [
            'Der Bau-Filter prüft auf den Haupt-CPV 453. Wenn ein Auftraggeber ein Gebäude gesamthaft unter Hochbau (4521) oder Wartung (50) ausschreibt und Elektro oder SHK nur im Text nennt, greift die freie Stichwortsuche besser als der reine CPV-Filter.',
            'Private Baustellen, Wartungsverträge von Wohnungsbaugesellschaften ohne Vergabepflicht sowie Preiskalkulation und Angebotsabgabe sind nicht Teil unseres Dienstes. Einen Überblick über alle Baugewerke bietet [Bauaufträge finden](/bauauftraege-finden).',
        ],
    },
    faq: [
        {
            frage: 'Welche CPV-Codes gelten für Elektro-, Heizungs-, Lüftungs- und Sanitärarbeiten?',
            antwort:
                'Die Obergruppe ist CPV 45300000 (Bauinstallationsarbeiten) mit 4531 für Elektroinstallation, 4532 für Dämmarbeiten und 4533 für Klempner-, Sanitär-, Heizungs- und Klimaarbeiten. Weitere Detail-Codes finden Sie in der [CPV-Code-Suche](/cpv-code-suche).',
        },
        {
            frage: 'Wie schließe ich unpassende Wartungs- oder Rahmenverträge aus?',
            antwort:
                'Setzen Sie Ausschlussbegriffe wie „Wartungsvertrag“, „Störungsdienst“ oder „Prüfung ortsveränderlicher Geräte“ direkt in den Suchoptionen oder im Pilotprofil. Ausschlüsse sparen im Handwerk mehr Zeit als zusätzliche Suchwörter.',
        },
        {
            frage: 'Brauche ich eine Präqualifikation (PQ-VOB) für öffentliche Elektro- oder SHK-Aufträge?',
            antwort:
                'Pflicht ist die PQ-VOB nicht — Eignungsnachweise lassen sich auch über Einzelnachweise (Formblatt 124) erbringen. Bei regelmäßiger Teilnahme spart eine Präqualifikation jedoch erheblich Zeit. Geforderte Nachweise zeigen unsere Entscheidungskarten frühzeitig an.',
        },
        {
            frage: 'Kann ich GAEB-X83-Dateien kostenlos in Excel öffnen?',
            antwort:
                'Ja, über unseren kostenlosen [GAEB-Viewer](/gaeb-viewer) — 100 Prozent lokal im Browser ohne Upload und mit direktem Excel-CSV-Export.',
        },
    ],
    ctaKontext: 'Elektro, SHK & TGA',
    ctaTitel: 'Regionale Elektro- & SHK-Ausschreibungen im Pilot testen',
    ctaText:
        'Wir richten CPV 453, Ihren Einsatzradius, Ausschlusswörter und Mindestvorlauf kostenfrei im Pilot ein – damit nur passende Fachlose in Ihrem Postfach landen.',
    querverweise: [
        { path: '/bauauftraege-finden', text: 'Bauaufträge finden: alle CPV-Gewerke im Überblick' },
        { path: '/gaeb-viewer', text: 'Kostenloser GAEB-Viewer (X83/X84) im Browser' },
        { path: '/cpv-code-suche', text: 'CPV-Code-Suche für Handwerk und TGA' },
        { path: '/ibau-alternative', text: 'ibau Alternative für öffentliche Bauaufträge' },
    ],
}
