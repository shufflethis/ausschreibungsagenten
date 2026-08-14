export const kiAngebotAusschreibung = {
    path: '/ki-angebot-ausschreibung',
    h1: 'KI und Ausschreibungen: was beim Angebot wirklich hilft — und was nicht',
    heroBild: {
        src: '/hero/ki-angebot-ausschreibung-planung.webp',
        alt: 'Team plant ein Angebot für eine öffentliche Ausschreibung mit Notizen und Laptop',
    },
    direktantwort:
        'KI hilft bei öffentlichen Ausschreibungen vor allem beim Vorbereiten: Anforderungen aus den Vergabeunterlagen herauslesen, sie gegen vorhandene Nachweise halten und früh sichtbar machen, ob eine Teilnahme überhaupt sinnvoll ist. Das Verfassen des Angebotstexts und die Kalkulation bleiben Ihre Arbeit — dort haftet Ihr Unternehmen für jede Angabe.',
    fakten: {
        datenstand: '12. August 2026',
        kopf: ['Arbeitsschritt', 'Maschinell sinnvoll?', 'Warum'],
        zeilen: [
            ['Anforderungen aus Unterlagen herauslesen', 'Ja', 'Mühsam, gut prüfbar, wiederholt sich in jedem Verfahren'],
            ['Nachweise zuordnen und Lücken zeigen', 'Ja', 'Vergleich gegen ein gepflegtes Archiv, Ergebnis ist belegbar'],
            ['Go/No-Go früh einschätzen', 'Ja', 'Feste Kriterien: Frist, Wert, Ort, Eignung'],
            ['Formularfelder vorbefüllen', 'Mit Vorbehalt', 'Nur als Entwurf, jede Angabe muss geprüft werden'],
            ['Angebotstext schreiben', 'Nein', 'Inhaltliche Zusage mit Rechtsfolge, nicht delegierbar'],
            ['Preise kalkulieren', 'Nein', 'Betriebswirtschaftliche Entscheidung, keine Textaufgabe'],
        ],
    },
    abschnitte: [
        {
            titel: 'Warum „ChatGPT schreibt mein Angebot" der falsche Ansatz ist',
            absaetze: [
                'Ein Angebot auf eine öffentliche Ausschreibung ist kein Text, sondern eine Willenserklärung. Jede Angabe darin — Referenzen, Umsätze, Zertifikate, Preise, Fristen — ist eine verbindliche Zusage, an der Ihr Unternehmen später gemessen wird. Ein Sprachmodell, das plausibel klingende Formulierungen erzeugt, erzeugt an genau dieser Stelle ein Haftungsrisiko.',
                'Dazu kommt ein formaler Grund: Öffentliche Auftraggeber schließen unvollständige Angebote aus. Fehlt im Leistungsverzeichnis eine bepreiste Position, ist das Angebot raus — unabhängig davon, wie gut der Begleittext war. Der Aufwand liegt selten in der Sprache, sondern in der Vollständigkeit.',
            ],
        },
        {
            titel: 'Wo maschinelle Unterstützung tatsächlich Zeit spart',
            absaetze: [
                'Die zeitraubende Arbeit steckt vor dem Schreiben. Vergabeunterlagen umfassen oft mehrere hundert Seiten, verteilt auf Bewerbungsbedingungen, Leistungsbeschreibung, Eignungsnachweise und Formblätter. Daraus die eigentlichen Anforderungen herauszuziehen, ist mühsam, aber gut strukturierbar — und damit maschinell sinnvoll.',
                'Der zweite Hebel ist der Abgleich mit dem, was Sie ohnehin haben. Wer Referenzen, Umsatzangaben, Versicherungsnachweise und Zertifikate einmal geordnet ablegt, kann jede neue Ausschreibung dagegen halten: Was ist vorhanden, was fehlt, was ist abgelaufen. Aus diesem Vergleich entsteht eine Nachweismatrix mit Belegstellen statt einer Behauptung — zu jedem Punkt steht, aus welchem Dokument er stammt.',
            ],
        },
        {
            titel: 'Was unser Agent in diesem Bereich konkret tut',
            absaetze: ['Der Funktionsumfang ist bewusst eng und überprüfbar:'],
            liste: [
                'Anforderungen aus den Vergabeunterlagen herauslesen und benennen, aus welcher Datei und welcher Stelle sie stammen.',
                'Eine Nachweismatrix erzeugen: welche geforderten Nachweise vorliegen, welche fehlen und welche abgelaufen sind — bei vorhandenen Nachweisen mit dem Gültigkeitsdatum.',
                'Eine Go/No-Go-Karte nach festen Kriterien: Frist, Auftragswert, Leistungsort, Eignungsanforderungen — nachvollziehbar, nicht als Blackbox-Urteil.',
                'Einen unverbindlichen Entwurf zum Vorbefüllen wiederkehrender Angaben, der ausdrücklich zu prüfen ist.',
                'GAEB-Dateien der Austauschphasen X83 und X84 lesend aufschlüsseln: Bereiche, Positionen, Mengen, Einheiten und vorhandene Preise.',
            ],
        },
        {
            titel: 'Die fünf Punkte, an denen Angebote tatsächlich scheitern',
            absaetze: [
                'Aus der Praxis öffentlicher Vergaben: Die häufigsten Ausschlussgründe sind formal, nicht inhaltlich.',
            ],
            liste: [
                'Eignungskriterien nicht erfüllt oder nicht belegt — Umsatz, Referenzen, Zertifikate, Versicherungsnachweis.',
                'Leistungsverzeichnis unvollständig bepreist; jede Position braucht einen Preis.',
                'Frist überschritten. Zu spät ist zu spät, auf die Minute.',
                'Nebenangebote nicht genutzt, obwohl zugelassen — eine verschenkte Chance auf einen Wettbewerbsvorteil.',
                'Unklarheiten nicht geklärt, obwohl Bieterfragen meist anonym über das Portal möglich sind.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was wir ausdrücklich nicht tun',
        absaetze: [
            'Wir formulieren keine Angebotstexte, ermitteln keine Preise, geben keine Preisempfehlung ab und reichen nichts ein. Diese Schritte gehören in Ihre Verantwortung, weil an ihnen die Zusage und die Haftung hängen.',
            'Der Vorbefüll-Entwurf ist ausdrücklich unverbindlich: Er spart Tipparbeit bei wiederkehrenden Angaben, ersetzt aber keine Prüfung. Ebenso ist die Nachweismatrix nur so gut wie das hinterlegte Archiv — sie zeigt, was dort steht, und erfindet nichts dazu.',
        ],
    },
    faq: [
        {
            frage: 'Kann ich ChatGPT für Ausschreibungen überhaupt nutzen?',
            antwort: 'Für Verständnisfragen und zum Strukturieren eigener Entwürfe spricht nichts dagegen. Kritisch wird es, sobald Inhalte ungeprüft ins Angebot wandern: Referenzen, Zahlen und Zusagen müssen aus Ihren echten Unterlagen stammen, nicht aus einer Textvorhersage.',
        },
        {
            frage: 'Dürfen Vergabeunterlagen in ein KI-Werkzeug hochgeladen werden?',
            antwort: 'Das hängt an den Bedingungen des Verfahrens und an Ihrem eigenen Datenschutz. Unterlagen enthalten regelmäßig Angaben Dritter. Prüfen Sie, wo die Daten verarbeitet werden und ob sie zum Training verwendet werden dürfen — im Zweifel bleibt die Verarbeitung im eigenen Haus.',
        },
        {
            frage: 'Was ist eine Go/No-Go-Karte?',
            antwort: 'Eine kurze Entscheidungsvorlage zu einer konkreten Ausschreibung: Frist, Auftragswert, Leistungsort und Eignungsanforderungen im Abgleich mit Ihrem Profil, dazu die offenen Punkte. Sie ersetzt keine Entscheidung, macht aber früh sichtbar, ob sich der Aufwand lohnt.',
        },
        {
            frage: 'Was passiert mit GAEB-Dateien?',
            antwort: 'Dateien der Austauschphasen X83 und X84 werden nur gelesen und aufgeschlüsselt: Bereiche, Positionen, Mengen, Einheiten und bereits enthaltene Preise, dazu Export nach CSV und XLSX. Eine automatische Kalkulation findet nicht statt.',
        },
    ],
    ctaKontext: 'KI-Unterstützung beim Angebot',
    ctaTitel: 'Eine konkrete Ausschreibung gemeinsam durchgehen',
    ctaText:
        'Im Pilot nehmen wir ein laufendes Verfahren, lesen die Anforderungen heraus, halten sie gegen Ihre Nachweise und bauen daraus einen Fahrplan bis zur Abgabe.',
    querverweise: [
        { path: '/ausschreibungssuche-automatisieren', text: 'Wie die Suche nach passenden Verfahren automatisiert wird' },
        { path: '/semantische-suche-ausschreibungen', text: 'Warum wir nicht auf semantische Vektorsuche setzen' },
        { path: '/entwickler', text: 'Agent API, A2A und MCP für eigene Anbindungen' },
    ],
}
