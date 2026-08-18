export const vergabepilotAlternative = {
    path: '/vergabepilot-alternative',
    h1: 'Vergabepilot Alternative: warum Ausschreibungsagenten erklärbar statt semantisch matcht',
    direktantwort:
        'Vergabepilot positioniert sich als KI-Plattform für deutsche Ausschreibungen mit semantischer Suche, KI-Zusammenfassung der Unterlagen und einem KI-Assistenten. Ausschreibungsagenten wählt bewusst einen anderen Weg: kein Ähnlichkeitswert, sondern erklärbares Matching über CPV-Codes, Regeln und Ausschlüsse — jeder Treffer mit Begründung, jede Quelle mit belegtem Abrufstand.',
    fakten: {
        datenstand: '18. August 2026',
        kopf: ['Merkmal', 'Vergabepilot', 'Ausschreibungsagenten'],
        zeilen: [
            ['Suchverfahren', 'Semantische KI-Suche, KI versteht den Kontext', 'CPV-Codes, Regeln und Ausschlüsse, Begründung je Treffer'],
            ['Treffer nachvollziehbar', 'KI-Zusammenfassung und KI-Assistent', 'Jeder Treffer nennt die Gründe, warum er zu Ihnen passt'],
            ['Quellen', '„Alle Vergabeportale an einem Ort“', '17 benannte Quellen mit belegtem Abrufstand im Quellenstatus'],
            ['Angebotserstellung', 'Angekündigt, laut Anbieter „geplant“', 'Bewusst nicht Teil des Angebots, siehe Abgrenzung'],
            ['Hosting und KI', 'Made in Germany, DSGVO-konform', 'Deutschland gehostet, Mistral AI in der EU, keine US-Hyperscaler'],
        ],
    },
    abschnitte: [
        {
            titel: 'Was Vergabepilot macht — und wo die Reise hingeht',
            absaetze: [
                'Vergabepilot versteht sich als Plattform, die öffentliche Ausschreibungen „finden und verstehen“ soll. Im Kern stehen eine semantische Suche, die nach Bedeutung statt nach Stichwörtern sucht, eine KI-Zusammenfassung, die Vergabeunterlagen in eine strukturierte Übersicht bringt, und ein KI-Assistent für die Teilnahmeentscheidung. Dazu kommt Team-Kollaboration mit Rollen, Kommentaren und einem Kanbanboard.',
                'Mehrere Bausteine sind ausdrücklich als geplant gekennzeichnet: eine Wissensdatenbank, ein Formularassistent und die KI-gestützte Angebotserstellung. Für die Bewertung einer Alternative ist das relevant, weil sich der reale Funktionsumfang heute von der angekündigten Roadmap unterscheidet.',
            ],
        },
        {
            titel: 'Der Kernunterschied: Ähnlichkeitswert oder Begründung',
            absaetze: [
                'Semantische Suche liefert als Ergebnis einen Ähnlichkeitswert. Der sagt, wie nah ein Text einer Anfrage liegt — aber nicht, welches Kriterium erfüllt ist. Eine Ausschreibung für Fensterreinigung liegt sprachlich nah an einer für Fenstermontage, inhaltlich trennen sie Welten. Mit nur einem Ähnlichkeitswert lässt sich dieser Unterschied weder erkennen noch korrigieren.',
                'Ausschreibungsagenten arbeitet deshalb anders: Jeder Treffer wird über CPV-Codes, Leistungsbegriffe, Ausschlusswörter und harte Regeln für Ort, Wert und Frist geprüft. Das Ergebnis ist keine Punktzahl, sondern eine Liste von Gründen. Fehlt ein Treffer, sehen Sie, ob es am Code, an einem Begriff oder an einer Regel lag — und können das Profil nachschärfen.',
            ],
        },
        {
            titel: 'Quellen: benannt und belegt statt „alle“',
            absaetze: [
                'Vergabepilot wirbt damit, alle öffentlichen Vergabeportale an einem Ort zu bündeln. Ausschreibungsagenten geht hier einen nüchternen Weg: Wir nennen die 17 Quellen beim Namen — TED, Bund, den Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale und die britischen Bekanntmachungswege — und zeigen im Quellenstatus zu jeder Quelle den letzten erfolgreichen Abruf.',
                'Der Unterschied ist praktisch: Eine unbestimmte Zahl lässt sich nicht prüfen. Ein Quellenstatus mit Zeitstempel schon. Wenn eine Quelle klemmt, sehen Sie es, statt sich auf eine Zahl zu verlassen, die niemand nachvollziehen kann.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was Ausschreibungsagenten ausdrücklich nicht leistet',
        absaetze: [
            'Wir formulieren keine Angebotstexte, erstellen keine Angebote, kalkulieren keine Preise und reichen nichts ein. Diese Schritte gehören in Ihre Verantwortung, weil an ihnen Zusage und Haftung hängen. Genau hier verspricht der Markt vieles — wir lassen diese Versprechen bewusst aus, statt sie als geplante Funktion in die Produktbeschreibung zu schreiben.',
            'Ebenso betreiben wir keine semantische Vektorsuche. Wer eine solche Funktion sucht, findet sie bei uns nicht. Unser erklärbares Matching hat eine reale Lücke: Leistungen, die weder über einen passenden CPV-Code noch über einen hinterlegten Begriff erreichbar sind, werden nicht gefunden — diese Lücke lässt sich aber durch Nachschärfen des Profils sichtbar schließen.',
        ],
    },
    faq: [
        {
            frage: 'Was ist der Unterschied zwischen semantischer Suche und erklärbarem Matching?',
            antwort: 'Semantische Suche vergleicht Texte nach Bedeutung und liefert einen Ähnlichkeitswert zurück. Erklärbares Matching prüft feste Kriterien — CPV-Codes, Begriffe, Ausschlüsse, Ort, Wert, Frist — und liefert zu jedem Treffer die Gründe. Der Ähnlichkeitswert sagt „nah dran“, die Begründung sagt „erfüllt Kriterium X, Y und Z“.',
        },
        {
            frage: 'Ist Vergabepilot günstiger oder teurer als Ausschreibungsagenten?',
            antwort: 'Vergabepilot veröffentlicht keine öffentliche Preisliste auf der Startseite; die Kosten ergeben sich über Demo und Vertrieb. Ausschreibungsagenten nennt seine Preise offen: Der Pro-Tarif kostet 149 Euro im Monat, der Agent-Tarif mit höheren API-Limits 499 Euro. Beide sind erst nach einer persönlichen Pilotphase buchbar.',
        },
        {
            frage: 'Brauche ich KI-Zusammenfassungen, um Unterlagen zu verstehen?',
            antwort: 'Hilfreich ist, Anforderungen schneller zu erfassen — entscheidend ist aber, dass jede Angabe aus dem Original belegbar bleibt. Unser Ansatz liest Anforderungen aus den Unterlagen heraus und benennt, aus welcher Datei und welcher Stelle sie stammen. Eine Zusammenfassung ersetzt diese Belegstelle nicht.',
        },
        {
            frage: 'Kann ich von Vergabepilot zu Ausschreibungsagenten wechseln?',
            antwort: 'Ja. Da unser Abgleich über CPV-Codes und Begriffe läuft, richten wir Ihr Suchprofil im Pilot gemeinsam neu ein und prüfen es an echten Bekanntmachungen. Historische Daten aus dem alten System lassen sich nicht automatisch übernehmen — aber das Profil selbst ist in einer Sitzung angelegt.',
        },
    ],
    ctaKontext: 'Vergabepilot-Alternative',
    ctaTitel: 'Erklärbares Matching im Pilot prüfen',
    ctaText:
        'Wir übersetzen Ihre Gewerke in CPV-Codes und Begriffe der Vergabesprache, richten das Profil ein und zeigen Ihnen die ersten Treffer — jeweils mit den Gründen, aus denen sie passen.',
    querverweise: [
        { path: '/semantische-suche-ausschreibungen', text: 'Warum wir bewusst nicht auf semantische Vektorsuche setzen' },
        { path: '/ausschreibungssuche-automatisieren', text: 'Wie die automatisierte Ausschreibungssuche funktioniert' },
        { path: '/status', text: 'Quellenstatus: welche Portale wann zuletzt abgefragt wurden' },
    ],
}
