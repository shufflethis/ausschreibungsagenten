export const semantischeSucheAusschreibungen = {
    path: '/semantische-suche-ausschreibungen',
    h1: 'Semantische Suche bei Ausschreibungen: was der Begriff meint und was wir stattdessen tun',
    direktantwort:
        'Semantische Suche findet Texte nach Bedeutung statt nach exakten Wörtern, indem sie Sprache in Vektoren übersetzt und nach Ähnlichkeit vergleicht. Bei Vergabeunterlagen hat das einen Haken: Ähnlichkeit ist kein Nachweis. Wir arbeiten deshalb mit CPV-Codes, Stichwörtern, Ausschlüssen und harten Regeln — jeder Treffer bleibt so einzeln begründbar.',
    fakten: {
        datenstand: '12. August 2026',
        kopf: ['Verfahren', 'Findet Formulierungsvarianten', 'Treffer einzeln begründbar'],
        zeilen: [
            ['Reine Stichwortsuche', 'Nein', 'Ja'],
            ['Semantische Vektorsuche', 'Ja', 'Nein — nur ein Ähnlichkeitswert'],
            ['CPV plus Regeln und Ausschlüsse', 'Teilweise, über Codes und Begriffslisten', 'Ja — je Kriterium'],
        ],
    },
    abschnitte: [
        {
            titel: 'Das Problem, das semantische Suche lösen soll',
            absaetze: [
                'Vergabestellen beschreiben dieselbe Leistung unterschiedlich. Die eine schreibt „Sanitärinstallation" aus, die nächste „sanitärtechnische Anlagen", eine dritte „Installationsarbeiten Trinkwasser und Abwasser". Wer nur nach einem dieser Begriffe sucht, verpasst die anderen beiden.',
                'Semantische Verfahren übersetzen Texte in Zahlenvektoren, in denen inhaltlich Ähnliches nah beieinanderliegt. Die Suche fragt dann nicht „kommt dieses Wort vor", sondern „wie ähnlich ist dieser Text meiner Anfrage". Für Fließtext funktioniert das gut.',
            ],
        },
        {
            titel: 'Warum das bei Vergabeunterlagen an Grenzen stößt',
            absaetze: [
                'Der Ausgabewert eines semantischen Vergleichs ist eine Ähnlichkeitszahl. Sie sagt nicht, welches Kriterium erfüllt ist. Eine Ausschreibung für Fensterreinigung liegt sprachlich nah an einer für Fenstermontage — inhaltlich trennen sie Welten. Wer nur einen Ähnlichkeitswert sieht, kann diesen Unterschied weder erkennen noch korrigieren.',
                'Dazu kommt, dass in der Vergabe die harten Kriterien entscheiden: Leistungsort, Auftragswert, Frist, Eignungsanforderungen, Ausschlussgründe. Das sind keine Bedeutungsfragen, sondern Prüfungen mit Ja oder Nein. Ein Verfahren 400 Kilometer entfernt wird nicht dadurch passend, dass der Text ähnlich klingt.',
                'Und schließlich die Nachvollziehbarkeit: Wenn ein Treffer fehlt, muss man wissen, warum. Bei Regeln lässt sich das nachschärfen — ein Begriff fehlt, ein Ausschluss war zu breit, der Radius zu eng. Bei einem Ähnlichkeitswert bleibt nur die Vermutung.',
            ],
        },
        {
            titel: 'Was wir stattdessen einsetzen',
            absaetze: [
                'Unser Abgleich kombiniert vier Ebenen, und jede liefert ihren eigenen, sichtbaren Beitrag zum Ergebnis:',
            ],
            liste: [
                'CPV-Codes: das einheitliche EU-Vokabular für Beschaffung. Es ist genau dafür gemacht, dieselbe Leistung über Sprach- und Formulierungsgrenzen hinweg gleich zu benennen.',
                'Leistungsbegriffe aus Ihrem Profil, bewusst in der Sprache der Vergabestellen und nicht in Ihrer Marketingsprache.',
                'Ausschlusswörter für alles, was Sie ausdrücklich nicht anbieten.',
                'Harte Regeln für Leistungsort, Auftragswert und Frist.',
            ],
        },
        {
            titel: 'Wie wir es mit semantischen Verfahren künftig halten',
            absaetze: [
                'Semantische Modelle sind kein Irrweg, sie sind an dieser Stelle nur nachrangig. Denkbar ist ein Einsatz dort, wo Ähnlichkeit tatsächlich die Frage ist: etwa beim Vorschlagen zusätzlicher Begriffe für ein Profil oder beim Auffinden vergleichbarer Referenzprojekte im eigenen Bestand.',
                'Was wir nicht tun werden, ist einen Ähnlichkeitswert an die Stelle einer Begründung zu setzen. Wenn wir semantische Verfahren ergänzen, dann als zusätzliche Spur neben den Regeln — und erkennbar als solche.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Damit hier kein falscher Eindruck entsteht',
        absaetze: [
            'Wir betreiben derzeit keine semantische Vektorsuche im laufenden Betrieb. Wer eine solche Funktion sucht, findet sie bei uns nicht — und wir bauen sie nicht als Behauptung in die Produktbeschreibung ein, nur weil danach gesucht wird.',
            'Umgekehrt heißt das auch: Unser Verfahren findet keine Ausschreibung, deren Leistung weder über einen passenden CPV-Code noch über einen Ihrer hinterlegten Begriffe erreichbar ist. Diese Lücke ist real. Sie lässt sich durch Nachschärfen des Profils schließen — aber nur, weil sichtbar ist, woran es lag.',
        ],
    },
    faq: [
        {
            frage: 'Was sind CPV-Codes?',
            antwort: 'Das Common Procurement Vocabulary ist ein EU-weit einheitlicher Katalog, der Beschaffungsgegenstände klassifiziert. Jede Bekanntmachung trägt mindestens einen Code. Er macht Leistungen über Länder- und Formulierungsgrenzen hinweg vergleichbar, unabhängig von der Wortwahl der Vergabestelle.',
        },
        {
            frage: 'Verpasse ich ohne semantische Suche Ausschreibungen?',
            antwort: 'Möglich, wenn eine Leistung ungewöhnlich beschrieben und zugleich mit einem untypischen CPV-Code versehen wurde. Genau deshalb zeigen wir zu jedem Treffer die Gründe an: Fehlt etwas, erkennen Sie, ob der Code, ein Begriff oder eine Regel die Ursache war.',
        },
        {
            frage: 'Ist das dann überhaupt KI?',
            antwort: 'Der Agent automatisiert Abruf, Zuordnung und Bewertung über 17 Quellen und arbeitet dabei regelbasiert und nachvollziehbar. Ob man das KI nennt, ist eine Definitionsfrage. Uns ist wichtiger, dass jede Entscheidung des Systems eine Begründung hat, die Sie prüfen können.',
        },
        {
            frage: 'Kann ich eigene Begriffe hinterlegen?',
            antwort: 'Ja, und das ist der wirksamste Hebel überhaupt. Neben positiven Leistungsbegriffen lohnen sich vor allem Ausschlusswörter: Sie entfernen ganze Gruppen unpassender Treffer und sparen mehr Zeit als jedes zusätzliche Suchwort.',
        },
    ],
    ctaKontext: 'Erklärbares Matching statt Ähnlichkeitswert',
    ctaTitel: 'Profil gemeinsam schärfen',
    ctaText:
        'Im Pilot gehen wir Ihre Gewerke durch, übersetzen sie in CPV-Codes und Begriffe der Vergabesprache und prüfen an echten Bekanntmachungen, was der Abgleich findet.',
    querverweise: [
        { path: '/ausschreibungssuche-automatisieren', text: 'Wie die automatisierte Suche insgesamt funktioniert' },
        { path: '/ki-angebot-ausschreibung', text: 'Was KI beim Angebot leisten kann und was nicht' },
        { path: '/status', text: 'Quellenstatus aller 17 angebundenen Portale' },
    ],
}
