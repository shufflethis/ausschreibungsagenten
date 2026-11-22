export const ausschreibungenMarketing = {
    path: '/ausschreibungen-marketing',
    h1: 'Ausschreibungen für Marketing, PR & Digital-Agenturen finden',
    direktantwort:
        'Öffentliche Auftraggeber schreiben jedes Jahr tausende Etats für Werbung, PR, Kampagnen, Employer Branding und Web-Relaunches aus – CPV 79 liegt mit 4.027 EU-Verfahren auf Platz 5 in Deutschland. Ausschreibungsagenten.de bündelt dafür ein kuratiertes Marketing-Vertical über 18 Live-Quellen mit erklärbaren Treffergründen statt ungenauer Stichwortflut.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kennzahl / Merkmal', 'Wert für Agenturen im öffentlichen Sektor'],
        zeilen: [
            ['EU-Volumen CPV 79', '4.027 Verfahren in 12 Monaten (4,5 % aller DE-TED-Verfahren, Platz 5)'],
            ['Wichtige CPV-Codes', '7934 (Werbung/Marketing), 79416 (PR), 7240 (Website/CMS), 79952 (Events)'],
            ['EU-Schwellenwerte 2026/27', '140.000 € netto (Bund) · 216.000 € netto (Länder, Kommunen, Anstalten)'],
            ['Typische Zuschlagskriterien', 'Meist 60–70 % Konzept/Qualität und 30–40 % Preis (nicht nur Billigstbieter)'],
            ['Kuratiertes Vertical', 'Aktiv in Ausschreibungsagenten.de über 18 öffentliche Live-Quellen'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum öffentliche Etats für Agenturen besonders attraktiv sind',
            absaetze: [
                'Viele Kreativ-, PR- und Digitalagenturen meiden öffentliche Ausschreibungen aus Sorge vor reinem Preisdumping. In der Praxis gilt bei Kommunikations- und Web-Etats fast immer das Gegenteil: Zuschlagskriterien gewichten Konzept, Strategie, Kreatividee und Teamqualität häufig mit 60 bis 70 Prozent — oft als mehrjährige Rahmenverträge mit planbarem Etat.',
                'Unsere Trefferkarte weist direkt aus, ob ein Verfahren allein über den Preis oder über mehrere Qualitätskriterien vergeben wird. So sortieren Agenturen reine Preis-Ausschreibungen sofort aus.',
            ],
            links: [
                { href: '/?gewerk=marketing#ergebnisse', text: 'Live-Suche öffnen: Marketing & Digital (kuratiert)' },
                { href: '/?gewerk=marketing&suche=Öffentlichkeitsarbeit#ergebnisse', text: 'Live-Suche öffnen: PR & Öffentlichkeitsarbeit' },
                { href: '/?suche=Website#ergebnisse', text: 'Live-Suche öffnen: Website, CMS & Digital-Relaunch' },
            ],
        },
        {
            titel: 'Typische Fehler bei der Agentur-Suche: falsche Wörter und fehlende Ausschlüsse',
            absaetze: [
                'Vergabestellen suchen selten nach „Performance Marketing“ oder „Branding“. In Bekanntmachungen stehen stattdessen Begriffe wie „Öffentlichkeitsarbeit“, „Rahmenvereinbarung Kommunikationsleistungen“, „Gestaltung und Druck“ oder „Barrierefreier Internetauftritt“.',
                'Gleichzeitig überschneidet sich CPV 79 mit Rechtsberatung, Sicherheitsdiensten und klassischer Unternehmensberatung. Unser kuratiertes Vertical und klare Ausschlusswörter trennen relevante Agentur-Etats sauber von fachfremden CPV-79-Verfahren — die dahinterliegende Logik erklärt [Semantische Suche vs. Regeln](/semantische-suche-ausschreibungen).',
            ],
        },
        {
            titel: 'Wo öffentliche Agentur-Etats veröffentlicht werden',
            absaetze: [
                'Große Bundes- und Länder-Etats ab 140.000 bzw. 216.000 Euro netto erscheinen EU-weit auf TED; kommunale Kampagnen, Tourismus-Etats und Hochschul-Websites laufen national über den Datenservice Öffentlicher Einkauf, service.bund.de, DTVP und die Landesportale wie [Berlin](/ausschreibungen-berlin), [NRW](/ausschreibungen-nrw) und [Bayern](/ausschreibungen-bayern).',
                'Alle 18 angebundenen Quellen stehen mit Abrufstand im [Quellenstatus](/status), alle Konditionen inkl. kostenfreier Pilotphase auf der [Preisseite](/preise).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was Ausschreibungsagenten.de für Agenturen nicht übernimmt',
        absaetze: [
            'Wir erstellen keine Pitch-Präsentationen, schreiben keine Angebotskonzepte und kalkulieren keine Tagessätze. Auch geschlossene Agentur-Pitches privater Unternehmen oder nicht-öffentliche Einladungsverfahren sind in unseren 18 öffentlichen Quellen nicht enthalten.',
            'Für Agenturen mit Fokus auf reine Software- oder TYPO3-/Cloud-Projekte lohnt zusätzlich der Blick auf [IT-Ausschreibungen](/ausschreibungen-it) und unsere [CPV-Code-Suche](/cpv-code-suche).',
        ],
    },
    faq: [
        {
            frage: 'Welche CPV-Codes sollten Marketing- und Digitalagenturen überwachen?',
            antwort:
                'Zentral sind 79340000 (Werbung und Marketing), 79416000 (Öffentlichkeitsarbeit/PR), 79800000 (Druck/Grafik), 79952000 (Veranstaltungen) sowie für Digitalagenturen 72400000 (Internetdienste, Website, CMS). Alle Codes lassen sich in der [CPV-Code-Suche](/cpv-code-suche) direkt testen.',
        },
        {
            frage: 'Lohnen sich öffentliche Ausschreibungen auch für kleinere Agenturen?',
            antwort:
                'Ja. Gerade kommunale Websites, regionale Kampagnen, Fachlose und Rahmenverträge von Hochschulen oder Verbänden liegen oft im Unterschwellenbereich mit machbaren Referenzanforderungen. Ausschlusswörter filtern übergroße Bundes-Etats sauber heraus.',
        },
        {
            frage: 'Woran erkenne ich, ob nur der niedrigste Preis entscheidet?',
            antwort:
                'Unsere Entscheidungskarte wertet veröffentlichte Zuschlagskriterien (`award_criteria`) direkt aus und markiert ausdrücklich, wenn ein Verfahren ausschließlich über den Preis statt über Qualität und Konzept vergeben wird.',
        },
        {
            frage: 'Wie hoch sind die Kosten für Agenturen?',
            antwort:
                'Die Live-Suche und die begleitete Pilotphase sind kostenfrei (0 Euro, keine Zahlungsdaten). Danach gilt der offen genannte Pro-Tarif ab 149 Euro netto/Monat ([Preise & Limits](/preise)).',
        },
    ],
    ctaKontext: 'Marketing & Digital-Agenturen',
    ctaTitel: 'Agentur-Suchprofil kostenfrei im Pilot einrichten',
    ctaText:
        'Wir übersetzen Ihre Agentur-Leistungen (Kampagne, PR, Web, Design, Event) in CPV-Codes, Vergabebegriffe und Ausschlüsse und liefern Ihnen passende Etats mit Begründung.',
    querverweise: [
        { path: '/ausschreibungen-it', text: 'IT- & Web-Ausschreibungen (CPV 72 & 48)' },
        { path: '/cpv-code-suche', text: 'CPV-Code-Suche für Agenturen' },
        { path: '/zahlen', text: 'Vergabemarkt Deutschland in Zahlen (CPV 79 auf Platz 5)' },
        { path: '/preise', text: 'Preise, API-Limits und kostenfreie Pilotphase' },
    ],
}
