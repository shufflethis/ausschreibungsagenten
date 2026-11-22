export const dtadAlternative = {
    path: '/dtad-alternative',
    h1: 'DTAD Alternative: offene Preise, belegte Quellen und erklärbares Matching',
    direktantwort:
        'DTAD zählt zu den größten deutschen Auftragsplattformen mit breiter Abdeckung öffentlicher und privater Bauprojekte – Preise nennt der Anbieter erst im Vertriebsgespräch. Ausschreibungsagenten.de ist die transparente Alternative für öffentliche Vergaben: 18 benannte Live-Quellen im offenen Quellenstatus, erklärbares Matching mit Begründung je Treffer, offene Tarife ab 149 Euro nach kostenfreier Pilotphase sowie REST-API und MCP.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Merkmal', 'DTAD', 'Ausschreibungsagenten.de'],
        zeilen: [
            ['Preise & Transparenz', 'Auf Anfrage über Vertrieb (keine öffentliche Preisliste)', 'Offen genannt: Pilot 0 €, Pro 149 €/Mon., Agent 499 €/Mon.'],
            ['Abdeckung', 'Laut Anbieter 12.000+ Quellen inkl. privater Bauprojekte', '18 benannte öffentliche Live-Quellen (DE, EU, UK, US-Bund)'],
            ['Quellen-Nachweis', 'Gesamtzahl laut Anbieter', 'Jede Quelle öffentlich mit letztem Abrufzeitpunkt im Quellenstatus'],
            ['Matching & Transparenz', 'KI-gestützte Suche und Assistent „Frank“', 'Erklärbares Regel-/CPV-Matching mit Einzelgründen je Treffer'],
            ['GAEB & Schnittstellen', 'Plattform-Workflows, Enterprise-Anbindungen', 'GAEB X83/X84 lesend, CSV/XLSX/JSON, offene REST-API, MCP & A2A'],
            ['Einstieg', 'Kostenloser Test über Vertrieb', 'Sofortige Live-Suche ohne Anmeldung + kostenfreie Pilotphase (0 €)'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum Unternehmen nach einer DTAD-Alternative suchen',
            absaetze: [
                'DTAD ist seit Jahrzehnten im deutschen Markt etabliert und deckt neben öffentlichen Ausschreibungen auch frühphasige private Bauprojekte ab. Für große Vertriebsteams mit entsprechendem Budget ist diese Breite ein echtes Argument.',
                'Im Mittelstand und bei spezialisierten Betrieben stoßen Interessenten aber häufig auf drei Reibungspunkte: fehlende öffentliche Preise vor dem Vertriebsgespräch, unübersichtliche Trefferlisten ohne transparente Regelbegründung und fehlende offene Schnittstellen wie MCP oder Self-Serve-REST-APIs für eigene Workflows.',
            ],
        },
        {
            titel: 'DTAD Kosten vs. offene Preise bei Ausschreibungsagenten.de',
            absaetze: [
                'Wer nach „DTAD Kosten“ oder „DTAD Preise“ sucht, findet auf der Anbieterseite keine verbindliche Preisliste — Konditionen, Regionen-Pakete und Laufzeiten werden individuell im Vertrieb verhandelt.',
                'Ausschreibungsagenten.de dreht das Modell um: Die Live-Suche auf der Website und der Free API-Key sind sofort ohne Vertriebsgespräch nutzbar. Die begleitete Pilotphase kostet 0 Euro ohne Zahlungsdaten, und alle geplanten Regelbetriebs-Tarife (Pro 149 €/Monat, Agent 499 €/Monat) samt API-Limits stehen offen auf der [Preisseite](/preise).',
            ],
        },
        {
            titel: 'Belegte Quellen und erklärbare Gründe statt Blackbox',
            absaetze: [
                'Statt einer nicht nachprüfbaren Gesamtzahl nennt Ausschreibungsagenten.de alle 18 angebundenen Quellen beim Namen und zeigt im [Quellenstatus](/status) den letzten erfolgreichen Abruf. Dazu gehören TED (alle 27 EU-Länder), der zentrale Datenservice Öffentlicher Einkauf (deutsche Ober- und Unterschwelle), service.bund.de, DTVP, RIB sowie zehn Landes- und Regionalportale.',
                'Jeder Treffer wird nachvollziehbar über [CPV-Codes](/cpv-code-suche), Leistungsbegriffe, Ausschlusswörter, Leistungsort, Auftragswert (inkl. [EU-Schwellenwerte 2026/2027](/eu-schwellenwerte)) und Frist begründet. Leistungsverzeichnisse im GAEB-Format lassen sich direkt im kostenlosen [GAEB-Viewer](/gaeb-viewer) prüfen.',
            ],
        },
        {
            titel: 'Für Entwickler und KI-Workflows: REST, MCP und A2A ab Tag eins',
            absaetze: [
                'Viele klassische Auftragsplattformen sind geschlossene Web-Oberflächen. Wenn Ihr Vertrieb Ausschreibungen automatisch ins CRM, ERP oder in eigene KI-Agenten (z. B. Claude, ChatGPT oder interne Pipelines) ziehen will, fehlt der direkte maschinelle Zugang.',
                'Ausschreibungsagenten.de stellt dafür eine dokumentierte [REST-API, einen öffentlichen MCP-Server und A2A-Discovery](/entwickler) bereit – inklusive kostenfreiem API-Key zum sofortigen Testen.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Wann DTAD die bessere Wahl bleibt als Ausschreibungsagenten.de',
        absaetze: [
            'Wenn Sie gezielt private, nicht-öffentliche Bauvorhaben (z. B. Bauträger- oder Gewerbeprojekte schon in der Planungsphase) recherchieren wollen, ist DTAD deutlich breiter aufgestellt: Ausschreibungsagenten.de erfasst ausschließlich öffentliche Ausschreibungen aus 18 benannten Quellen und keine privaten Bauprojekte.',
            'Ebenso betreiben wir bewusst keine semantische Vektorsuche, formulieren keine Angebotstexte und reichen keine Angebote ein. Wer maximale Breite inklusive Privatsektor sucht, bleibt bei DTAD oder ibau besser aufgehoben; wer öffentliche Vergaben transparent, erklärbar und zu offenen Konditionen prüfen will, testet unseren kostenfreien Pilot.',
        ],
    },
    faq: [
        {
            frage: 'Was kostet DTAD im Vergleich zu Ausschreibungsagenten.de?',
            antwort:
                'DTAD veröffentlicht keine Standardpreise auf seiner Website; die Kosten hängen von Branchen, Regionen und Laufzeit ab und werden im Vertrieb ermittelt. Ausschreibungsagenten.de startet mit einer kostenfreien Pilotphase (0 Euro) und nennt die geplanten Regelpreise offen auf der [Preisseite](/preise): Pro 149 Euro/Monat, Agent 499 Euro/Monat.',
        },
        {
            frage: 'Deckt Ausschreibungsagenten.de wie DTAD auch private Bauprojekte ab?',
            antwort:
                'Nein. Ausschreibungsagenten.de konzentriert sich ausschließlich auf öffentliche Ausschreibungen aus 18 benannten Vergabequellen (Ober- und Unterschwelle in Deutschland, EU-weit über TED, UK und US-Bund). Private Bauvorhaben sind bewusst nicht enthalten.',
        },
        {
            frage: 'Wie vergleiche ich DTAD und Ausschreibungsagenten.de am fairsten?',
            antwort:
                'Lassen Sie beide Systeme ein bis zwei Wochen parallel auf demselben Leistungsprofil (Gewerke, CPV-Codes, Region, Ausschlüsse) laufen und zählen Sie am Ende die tatsächlich bearbeitbaren öffentlichen Ausschreibungen statt der rohen Treffermenge. Der Paralleltest im Pilot von Ausschreibungsagenten.de ist kostenfrei.',
        },
        {
            frage: 'Welche weiteren Alternativen zu DTAD gibt es im DACH-Markt?',
            antwort:
                'Neben Ausschreibungsagenten.de zählen unter anderem Vergabepilot, Patterno, Vergabe24, ibau, subreport und das kostenlose EU-Portal TED zu den relevanten Optionen. Eine sachliche Einordnung nach Einsatzszenario finden Sie im [Software-Vergleich nach Use Case](/beste-software-automatische-ausschreibungssuche).',
        },
    ],
    ctaKontext: 'DTAD-Alternative',
    ctaTitel: 'Ausschreibungsagenten.de parallel zu DTAD testen',
    ctaText:
        'Wir richten Ihr Suchprofil mit CPV-Codes, Regionen und Ausschlusswörtern kostenfrei im Pilot ein – so vergleichen Sie Trefferqualität und Begründungen direkt an echten Verfahren.',
    querverweise: [
        { path: '/beste-software-automatische-ausschreibungssuche', text: 'Beste Software für automatische Ausschreibungssuche nach Use Case' },
        { path: '/preise', text: 'Offene Preise, API-Limits und kostenfreie Pilotphase' },
        { path: '/vergabepilot-alternative', text: 'Vergabepilot Alternative im Detailvergleich' },
        { path: '/status', text: 'Quellenstatus aller 18 produktiven Vergabequellen' },
    ],
}
