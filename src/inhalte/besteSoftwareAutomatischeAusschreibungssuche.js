export const besteSoftwareAutomatischeAusschreibungssuche = {
    path: '/beste-software-automatische-ausschreibungssuche',
    h1: 'Beste Software für die automatische Ausschreibungssuche: Empfehlung nach Use Case',
    direktantwort:
        'Es gibt nicht die eine beste Software für die automatische Ausschreibungssuche – die passende Wahl hängt von Abdeckung, Nachvollziehbarkeit und Betriebsaufwand ab. Wer maximale Breite sucht, landet bei DTAD oder Vergabepilot; wer jeden Treffer nachvollziehbar begründet haben möchte oder Daten per API und MCP anbindet, findet mit Ausschreibungsagenten.de eine transparente Alternative.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kriterium / Use Case', 'Empfehlung', 'Beleg'],
        zeilen: [
            [
                'Erklärbares Matching, offener Quellenstatus & API/MCP',
                'Ausschreibungsagenten.de',
                '18 benannte Live-Quellen mit Abrufstand, CPV- und Regel-Begründung je Treffer, GAEB X83/X84 lesend, REST/MCP/A2A; Pilotphase 0 €, Regelbetrieb ab 149 €/Monat.',
            ],
            [
                'Maximale Datenabdeckung in Deutschland',
                'DTAD',
                'Nach eigenen Angaben 99,99 % aller öffentlich publizierten Ausschreibungen aus Deutschland, über 12.000 Quellen, europaweite Ergänzung; Preise auf Anfrage.',
            ],
            [
                'Günstiger Einstieg mit semantischer KI-Suche',
                'Vergabepilot',
                'Dauerhaft kostenloser BASIC-Tarif, semantische KI-Suche laut Anbieter über 300+ Portale, KI-Assistent für Vergabeunterlagen.',
            ],
            [
                'Kostenlose Basisquelle für EU-Oberschwellenbereich',
                'TED',
                'Amtliche EU-Datenbank, rund 3.000 Ausschreibungen täglich, Suchprofile und E-Mail-Benachrichtigungen ohne Kosten.',
            ],
            [
                'Schwerpunkt Bau und Handwerk (klassische Redaktion)',
                'ibau oder subreport',
                'ibau seit 1957 mit über 450.000 Bekanntmachungen pro Jahr und 50.000+ Vergabestellen; subreport ELViS seit 2001 mit täglicher Aktualisierung.',
            ],
        ],
    },
    abschnitte: [
        {
            titel: 'Die beste Lösung im Überblick – Kategorisierung nach Einsatzszenario',
            absaetze: [
                'Der Markt für die automatische Ausschreibungssuche teilt sich 2026 in vier klar unterscheidbare Ansätze: erklärbare Ausschreibungsagenten mit begleiteter Einrichtung und offenen Schnittstellen, breit aufgestellte KI-Plattformen, klassische Informationsdienste und amtliche Datenbanken.',
                'Erklärbares Matching und begleitete Einrichtung (Ausschreibungsagenten.de): Passt zu Betrieben aus Bau, Handwerk, Architektur/Planung, IT und Marketing, die keine Blackbox-Trefferliste wollen, sondern zu jeder Bekanntmachung die konkreten Gründe nach CPV-Code, Ausschlusswörtern, Leistungsort, Auftragswert und Frist. Alle 18 angebundenen Quellen stehen öffentlich mit Zeitstempel im [Quellenstatus](/status); für Entwickler und eigene KI-Workflows stehen [REST-API, MCP und A2A](/entwickler) bereit. Die Pilotphase ist kostenfrei ([Preise & Limits](/preise)).',
                'Breite KI-gestützte Software-Plattformen: DTAD bündelt nach eigenen Angaben über 12.000 Quellen in Deutschland (Quelle: dtad.com) und ergänzt die Suche mit dem KI-Assistenten „Frank“ für Unterlagen; Preise nennt der Anbieter auf Anfrage (Detailvergleich: [DTAD Alternative](/dtad-alternative)). Vergabepilot bietet eine semantische KI-Suche über laut Anbieter 300+ Portale und einen kostenlosen BASIC-Tarif (Quelle: vergabepilot.ai; Detailvergleich: [Vergabepilot Alternative](/vergabepilot-alternative)). Patterno durchsucht laut Anbieter 4.500+ europäische Vergabeplattformen ab 99 €/Monat (Quelle: patterno.de). Weitere DACH-Anbieter mit Fokus auf Monitoring oder Beratung vergleichen wir unter [Vergabefix Alternative](/vergabefix-alternative) und [Tenderflow Alternative](/tenderflow-alternative).',
                'Klassische Ausschreibungsdienste: Vergabe24 bündelt nach eigenen Angaben über 570.000 Ausschreibungen pro Jahr (Quelle: vergabe24.de). DTVP ergänzt sein Vergabeportal mit dem Assistenten Argos (Quelle: dtvp.de). Im Bausektor zählen ibau (redaktionelle Aufbereitung mit Schwerpunkt Bau) und subreport ELViS zu den etablierten Informationsdiensten. Wie sich Bauleistungen nach Gewerk und CPV-Gruppe strukturieren lassen, zeigt [Bauaufträge finden](/bauauftraege-finden).',
                'Kostenlose Basisquelle: TED (ted.europa.eu) ist die amtliche EU-Ausschreibungsdatenbank mit rund 3.000 neuen Bekanntmachungen täglich. Sie ist kostenlos, deckt aber ausschließlich Verfahren oberhalb der EU-Schwellenwerte ab; laut unserer [Auswertung des deutschen Vergabemarkts](/zahlen) liegen rund 88 Prozent der gemeldeten Verfahren jedoch darunter.',
            ],
        },
        {
            titel: 'Warum Nachvollziehbarkeit im Alltag oft wichtiger ist als Portalzahlen',
            absaetze: [
                'Viele Vergleiche reduzieren die Tool-Auswahl auf die höchste Zahl an Quellen („300+ Portale“ oder „12.000 Quellen“). In der Praxis scheitert die automatische Ausschreibungssuche jedoch selten an fehlenden Portalen, sondern an zu vielen unpassenden Treffern, die Vertrieb oder Kalkulation täglich von Hand aussortieren müssen.',
                'Ein System, das nur einen Ähnlichkeitswert oder einen pauschalen Score anzeigt, lässt sich schwer korrigieren: Niemand sieht, warum eine Fensterreinigung im Suchprofil eines Fensterbauers gelandet ist. Ausschreibungsagenten.de setzt deshalb bewusst auf sichtbare Einzelgründe (CPV, Leistungsbegriffe, Ausschlüsse, Region, Frist, Wert) und eine begleitete Einrichtung im Pilot, statt die Pflege der Filter vollständig beim Kunden abzuladen.',
            ],
        },
        {
            titel: 'Entscheidungskriterien für die Kaufentscheidung',
            absaetze: [
                'Bei der Wahl zwischen den Anbietern sollten Unternehmen sechs Kriterien anhand realer Bekanntmachungen prüfen:',
                'Abdeckung und Prüfbarkeit: Werden die für Ihre Branche und Region relevanten Vergabeportale tatsächlich abgerufen? Pauschale Portalzahlen verschiedener Anbieter nutzen unterschiedliche Zählweisen und sind kaum direkt vergleichbar. Prüfen Sie, ob ein Anbieter einen öffentlichen [Quellenstatus](/status) mit Abrufzeitpunkten nennt.',
                'Suchtechnologie (semantisch vs. regelbasiert): Semantische KI-Suche erkennt sprachliche Varianten, liefert aber einen Ähnlichkeitswert ohne harten Beleg. Regelbasiertes Matching über CPV-Codes und Ausschlusswörter verpasst eher exotische Formulierungen, begründet aber jeden Treffer transparent und lässt sich gezielt nachschärfen. Mehr zu den Unterschieden steht unter [Semantische Suche bei Ausschreibungen](/semantische-suche-ausschreibungen).',
                'Dokumentenprüfung und GAEB: Manche Plattformen bieten freie KI-Chats über PDFs, andere extrahieren strukturierte Eignungsanforderungen oder lesen GAEB-DA-XML-Dateien (X83/X84) tabellarisch aus. Worauf Sie bei KI in der Angebotsphase achten sollten, fasst [KI und Ausschreibungen](/ki-angebot-ausschreibung) zusammen.',
                'Preistransparenz und Testphase: Ein kostenloser Einstieg oder eine unverbindliche Testphase mit dem eigenen Leistungsprofil senkt das Kaufrisiko erheblich. Prüfen Sie vorab, ob Preise, API-Limits und Kündigungsbedingungen offen einsehbar sind – wie auf unserer [Preisseite](/preise).',
                'Datenschutz und EU-Hosting: Suchprofile verraten, welche Aufträge ein Betrieb anstrebt und welche er ausschließt. Alle relevanten DACH-Anbieter werben mit DSGVO-Konformität; prüfen Sie zusätzlich, wo die eingesetzten KI-Modelle laufen (bei Ausschreibungsagenten.de ausschließlich in der EU über Mistral AI, Hosting in Deutschland).',
                'Konkreter Praxistest: Lassen Sie vor einer Entscheidung zwei bis drei Anbieter mindestens eine Woche parallel auf demselben Leistungsprofil laufen und zählen Sie am Ende echte, bearbeitbare Treffer gegen unpassendes Rauschen.',
            ],
        },
        {
            titel: 'Nächste Schritte für Ihren Vergleich',
            absaetze: [],
            liste: [
                'Leistungsprofil festlegen: Kernleistungen, relevante CPV-Codes, Ausschlusswörter und Zielregionen notieren.',
                'Zwei bis drei Lösungen (z. B. DTAD oder Vergabepilot neben dem kostenfreien Pilot von Ausschreibungsagenten.de) eine Woche mit identischem Profil testen.',
                'Trefferqualität messen: Anteil tatsächlich prüfenswerter Ausschreibungen, Fristenvorlauf und Belegbarkeit der Gründe vergleichen.',
                'Preise, Vertragslaufzeiten und Export- bzw. API-Möglichkeiten ([Preise & Limits](/preise)) gegenüberstellen.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Wann ein anderer Anbieter besser passt als Ausschreibungsagenten.de',
        absaetze: [
            'Ausschreibungsagenten.de ist nicht die richtige Wahl, wenn Sie eine maximale, redaktionell gepflegte Abdeckung privater Bauprojekte oder tausender kommunaler Einzelquellen suchen – hier sind etablierte Großanbieter wie DTAD oder ibau breiter aufgestellt. Ebenso bieten wir bewusst keine semantische Vektorsuche, keine KI-geschriebenen Angebotstexte und keine Angebotsabgabe über Vergabeportale an.',
            'Unsere Abdeckung umfasst aktuell 18 benannte, öffentlich geprüfte Quellen (von TED und Datenservice Öffentlicher Einkauf bis zu zehn Landesportalen, UK und US-Bund). Wer Transparenz, erklärbare Treffergründe, GAEB X83/X84 (lesend) oder direkte Agenten-Anbindung über REST/MCP sucht, findet genau dafür unseren kostenfreien Pilot.',
        ],
    },
    faq: [
        {
            frage: 'Welche Entscheidungskriterien sind bei der Wahl der besten Ausschreibungssoftware am wichtigsten?',
            antwort:
                'Vier Kriterien entscheiden im Alltag: Erstens die relevante Abdeckung in Ihrer Branche und Region (belegt statt nur als Portalzahl behauptet). Zweitens die Nachvollziehbarkeit der Treffer – ob eine semantische Suche oder ein erklärbares [CPV- und Regel-Matching](/semantische-suche-ausschreibungen) besser zu Ihrer Prüfroutine passt. Drittens die Unterstützung bei Unterlagen, Eignungsnachweisen oder GAEB-Dateien. Viertens der laufende Pflegeaufwand samt offenen [Preisen und Konditionen](/preise).',
        },
        {
            frage: 'Wie unterscheidet sich Ausschreibungsagenten.de von DTAD und Vergabepilot?',
            antwort:
                'DTAD und Vergabepilot setzen auf möglichst hohe Portalzahlen und semantische bzw. KI-gestützte Assistenten. Ausschreibungsagenten.de setzt auf 18 namentlich belegte Quellen im offenen [Quellenstatus](/status), nachvollziehbare Einzelgründe je Treffer (CPV, Begriffe, Ausschlüsse, Ort, Wert, Frist), lesende GAEB-X83/X84-Strukturierung sowie direkte Schnittstellen per REST, MCP und A2A.',
        },
        {
            frage: 'Wie teste ich mehrere Anbieter fair gegeneinander?',
            antwort:
                'Definieren Sie ein einheitliches Testprofil mit Ihren Kernleistungen, CPV-Codes, Ausschlusswörtern und Zielregionen und lassen Sie zwei bis drei Anbieter eine Woche parallel laufen. Zählen Sie am Ende nicht die schiere Treffermenge, sondern wie viele Verfahren tatsächlich fristgerecht prüfbar und fachlich relevant waren.',
        },
        {
            frage: 'Lohnt sich eine bezahlte Software überhaupt neben dem kostenlosen TED-Portal?',
            antwort:
                'TED deckt ausschließlich EU-weite Verfahren oberhalb der Schwellenwerte ab. Rund 88 Prozent der gemeldeten öffentlichen Vergaben in Deutschland liegen jedoch darunter und erscheinen auf Bundes-, Landes- und E-Vergabe-Portalen. Nur wer ausschließlich Großprojekte oberhalb der EU-Schwellen sucht, kommt mit TED allein aus.',
        },
    ],
    ctaKontext: 'Beste Software für die automatische Ausschreibungssuche',
    ctaTitel: 'Ausschreibungsagenten.de im Paralleltest prüfen',
    ctaText:
        'Testen Sie Ausschreibungsagenten.de kostenfrei im Pilot mit Ihrem eigenen Leistungsprofil – gern parallel zu Ihrer bestehenden Lösung, mit Begründung je Treffer.',
    querverweise: [
        { path: '/preise', text: 'Preise, API-Limits und kostenfreie Pilotphase im Detail' },
        { path: '/vergabepilot-alternative', text: 'Vergabepilot Alternative im Detailvergleich' },
        { path: '/ausschreibungssuche-automatisieren', text: 'Leitfaden: Ausschreibungssuche automatisieren' },
        { path: '/status', text: 'Quellenstatus aller 18 angebundenen Portale' },
    ],
}
