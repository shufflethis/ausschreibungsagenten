export const ausschreibungssucheAutomatisieren = {
    path: '/ausschreibungssuche-automatisieren',
    h1: 'Ausschreibungssuche automatisieren: wie es funktioniert und was es bringt',
    direktantwort:
        'Die Suche nach öffentlichen Ausschreibungen automatisiert man, indem ein Dienst alle relevanten Vergabeportale regelmäßig abfragt und jede neue Bekanntmachung gegen ein hinterlegtes Firmenprofil prüft: CPV-Codes, Leistungsbegriffe, Ausschlusswörter, Leistungsort, Auftragswert und Frist. Gemeldet werden nur die Treffer, die zu diesen Kriterien passen, jeweils mit Begründung und Link zur Originalquelle.',
    fakten: {
        datenstand: '12. August 2026',
        kopf: ['Ebene', 'Beispiele', 'Warum sie einzeln nötig ist'],
        zeilen: [
            ['EU', 'TED', 'Verfahren oberhalb der EU-Schwellenwerte, alle 27 Mitgliedstaaten'],
            ['Bund', 'service.bund.de, Datenservice Öffentlicher Einkauf', 'Bundesbehörden, Ober- und Unterschwelle'],
            ['E-Vergabe', 'DTVP, RIB', 'Plattformen, über die viele Stellen gemeinsam ausschreiben'],
            ['Land und Region', 'Bayern, NRW, Baden-Württemberg, Hessen, Bremen, Sachsen, MV, Rheinland-Pfalz, Rhein-Neckar', 'Landesrecht und eigene Portale je Bundesland'],
            ['Vereinigtes Königreich', 'Find a Tender, Contracts Finder', 'Seit dem EU-Austritt eigene Bekanntmachungswege'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum die Suche von Hand systematisch Aufträge kostet',
            absaetze: [
                'Bekanntmachungen erscheinen nicht an einer Stelle, sondern verteilt über EU-, Bundes-, Landes- und Plattformportale. Wer sie von Hand kontrolliert, zahlt dafür dreifach.',
            ],
            liste: [
                'Zeit: Jede Quelle einzeln zu prüfen bindet Arbeitszeit, die später beim Schreiben des Angebots fehlt.',
                'Streuung: Breite Stichwörter liefern das falsche Gewerk, die falsche Region und Auftragsgrößen, die nicht zum Betrieb passen.',
                'Fristen: Je später ein passendes Verfahren auffällt, desto weniger Zeit bleibt für Unterlagen, Nachweise, Partner und Kalkulation. Bei offenen Verfahren oberhalb der Schwellenwerte liegt die Mindestfrist bei 35 Tagen, national oft bei 10 bis 15 Werktagen — wer davon zwei Wochen verliert, gibt entweder ein schwaches Angebot ab oder gar keins.',
            ],
        },
        {
            titel: 'Was eine automatisierte Suche technisch tut',
            absaetze: [
                'Der erste Schritt ist das regelmäßige Abfragen: Die Portale werden über ihre Schnittstellen oder Datendienste abgerufen, nicht von Hand aufgerufen. Der zweite Schritt ist die Zuordnung. Dafür gibt es in der EU ein einheitliches Vokabular, das Common Procurement Vocabulary — kurz CPV. Jede Bekanntmachung trägt mindestens einen CPV-Code, der die Leistung klassifiziert.',
                'Der dritte Schritt ist der Abgleich mit dem Firmenprofil. Dabei zählt nicht nur, ob ein Stichwort vorkommt, sondern ob Leistungsort, Auftragswert und Frist zum Betrieb passen und ob Ausschlusskriterien greifen. Aus diesen Einzelprüfungen entsteht ein Wert, der sich aufschlüsseln lässt: Man sieht, welches Kriterium wie beigetragen hat.',
            ],
        },
        {
            titel: 'Was Sie beim Einrichten festlegen sollten',
            absaetze: [
                'Die Qualität der Treffer hängt fast vollständig an der Sorgfalt beim Profil. Vier Angaben tragen am meisten:',
            ],
            liste: [
                'Gewerke und Leistungen, möglichst in der Sprache der Vergabestellen — „sanitärtechnische Anlagen" ist häufiger als „Sanitärinstallation".',
                'Ausschlusswörter für Leistungen, die Sie ausdrücklich nicht anbieten. Sie sparen mehr Zeit als jedes zusätzliche Stichwort.',
                'Leistungsort und Radius. Ein Auftrag 400 Kilometer entfernt ist kein Treffer, auch wenn das Gewerk passt.',
                'Auftragswert von und bis. Zu große Lose kosten Kalkulationszeit ohne Aussicht, zu kleine lohnen den Aufwand nicht.',
            ],
        },
        {
            titel: 'Woran Sie eine brauchbare Lösung erkennen',
            absaetze: [
                'Der entscheidende Prüfstein ist die Begründung. Ein Dienst, der einen Treffer meldet, ohne zu sagen warum, lässt sich nicht korrigieren: Sie können weder das Profil nachschärfen noch beurteilen, ob die Lücke am Werkzeug oder an Ihren Angaben liegt.',
                'Zweiter Prüfstein ist der Quellennachweis. Zu jedem Treffer gehört ein Link auf die Originalbekanntmachung und die Angabe, wann diese Quelle zuletzt erfolgreich abgefragt wurde. Ohne diesen Datenstand wissen Sie nicht, ob eine Quelle seit Tagen klemmt.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was Automatisierung an dieser Stelle nicht leistet',
        absaetze: [
            'Automatisiert wird das Finden und Vorsortieren, nicht das Gewinnen. Die Prüfung der Eignungskriterien, die Kalkulation und der Angebotstext bleiben Ihre Arbeit — dort entscheidet sich der Zuschlag.',
            'Auch die Abdeckung hat Grenzen. Kein Dienst kennt alle Portale Deutschlands vollständig; unterschwellige Vergaben werden zudem nicht überall veröffentlicht. Wer eine lückenlose Abdeckung verspricht, kann sie nicht belegen. Prüfbar ist nur, welche Quellen tatsächlich abgefragt werden und wann zuletzt.',
        ],
    },
    faq: [
        {
            frage: 'Wie oft werden die Portale abgefragt?',
            antwort: 'Das hängt an der Quelle. TED wird alle sechs Stunden abgefragt, der Datenservice Öffentlicher Einkauf alle zwölf Stunden, weil die Tagespakete erst nach Mitternacht bereitstehen. Der Quellenstatus zeigt zu jeder Quelle den letzten erfolgreichen Abruf.',
        },
        {
            frage: 'Brauche ich für jedes Vergabeportal ein eigenes Konto?',
            antwort: 'Für das Finden nicht — die Bekanntmachungen sind öffentlich. Für die Teilnahme am Verfahren, also Unterlagen herunterladen und Angebot abgeben, brauchen Sie weiterhin ein Konto beim jeweiligen Portal. Das Basiskonto ist bei den meisten Portalen kostenlos.',
        },
        {
            frage: 'Lohnt sich das auch für kleine Betriebe?',
            antwort: 'Gerade dort. Das Vergaberecht fördert die Beteiligung kleiner und mittlerer Unternehmen ausdrücklich, meist über die Aufteilung großer Aufträge in Lose. Der Engpass ist selten die Eignung, sondern die Zeit, alle Portale im Blick zu behalten.',
        },
        {
            frage: 'Was kostet eine automatisierte Ausschreibungssuche?',
            antwort: 'Bei uns kostet der Pro-Tarif 149 Euro im Monat und enthält Suchprofil, Alerts, Volltextsuche und wöchentliche Trefferlisten. Der Agent-Tarif mit höheren API-Limits liegt bei 499 Euro im Monat. Der Online-Checkout wird erst nach einer persönlichen Pilotphase freigeschaltet.',
        },
    ],
    ctaKontext: 'Ausschreibungssuche automatisieren',
    ctaTitel: 'Suchprofil im Pilot einrichten',
    ctaText:
        'Wir legen gemeinsam Gewerke, Regionen, Ausschlusswörter und Auftragsgrößen fest und zeigen Ihnen die ersten Treffer — jeweils mit den Gründen, aus denen sie zu Ihnen passen.',
    querverweise: [
        { path: '/semantische-suche-ausschreibungen', text: 'Warum reine Stichwortsuche an Vergabesprache scheitert' },
        { path: '/ki-angebot-ausschreibung', text: 'Was KI beim Angebot wirklich leisten kann' },
        { path: '/status', text: 'Quellenstatus: welche Portale wann zuletzt abgefragt wurden' },
    ],
}
