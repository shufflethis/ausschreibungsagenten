import { GEWERKE } from '../lib/vergabe'

// Anlass: Bing Webmaster Tools, AI Performance (Stand 2. November 2026).
// Copilot zitiert die Startseite fuer "bauaufträge finden deutschland" und
// "ausschreibungen nach gewerk und region", ohne dass eine Seite das Thema
// trug. Die Links fuehren direkt in die vorbelegte Live-Suche der Startseite;
// sie werden aus GEWERKE erzeugt, damit Seite und Filter nicht auseinanderlaufen.
const suchLinks = GEWERKE.filter((g) => g.cpv).map((g) => ({
    href: `/?gewerk=${g.value}#ergebnisse`,
    text: `Live-Suche öffnen: ${g.label.replace(/^Bau: /, '')}`,
}))

export const bauauftraegeFinden = {
    path: '/bauauftraege-finden',
    h1: 'Bauaufträge finden: öffentliche Ausschreibungen nach Gewerk und Region',
    direktantwort:
        'Öffentliche Bauaufträge finden Sie, indem Sie Bekanntmachungen nach Gewerk und Leistungsort filtern. Das Gewerk steckt im CPV-Code: Abteilung 45 umfasst alle Bauleistungen, 4531 zum Beispiel Elektroinstallation. Ausschreibungsagenten.de durchsucht 18 Live-Quellen von TED bis zu Landesportalen nach CPV-Gruppe und Region und nennt zu jedem Treffer die Gründe.',
    fakten: {
        datenstand: '5. November 2026',
        kopf: ['Gewerk', 'CPV-Gruppe', 'Filter in der Suche'],
        zeilen: [
            ['Alle Bauleistungen', '45', 'Bau: alle Bauleistungen'],
            ['Hochbau', '4521', 'Bau: Hochbau'],
            ['Tief-, Straßen- und Ingenieurbau, Leitungsbau', '4522, 4523', 'Bau: Tief-, Straßen- & Ingenieurbau'],
            ['Dach, Gerüst, Gründung, Beton- und Mauerarbeiten', '4526', 'Bau: Dach- & Spezialbau'],
            ['Elektro, Sanitär, Heizung, Lüftung, Dämmung', '453', 'Bau: Elektro, SHK & Dämmung'],
            ['Putz, Tischler, Boden, Maler, Glaser', '454', 'Bau: Ausbau, Maler & Glas'],
            ['Fenster, Türen, Fassade, Metallbau', 'kuratierte Auswahl aus 45 und 44', 'Fenster, Fassade & Metallbau'],
            ['Garten- und Landschaftsbau', '45112700', 'kein eigener Filter; Suchbegriff „Landschaftsbau“'],
        ],
    },
    abschnitte: [
        {
            titel: 'Ausschreibungen nach Gewerk finden: der CPV-Code entscheidet',
            absaetze: [
                'Jede öffentliche Bekanntmachung trägt einen Haupt-CPV-Code aus dem Gemeinsamen Vokabular für öffentliche Aufträge der EU. Die ersten Stellen bilden eine Hierarchie: 45 steht für Bauarbeiten, 453 für Bauinstallationsarbeiten, 4531 für Elektroinstallation. Wer nach Gewerk sucht, sucht deshalb am verlässlichsten nach einer CPV-Gruppe und nicht nach einzelnen Wörtern im Titel.',
                'Die Gewerk-Filter auf ausschreibungsagenten.de arbeiten genau so: Sie prüfen, ob der Haupt-CPV einer Bekanntmachung mit der gewählten Gruppe beginnt. Die Entscheidungskarte zu jedem Treffer nennt den Code als Beleg. Zusätzlich lässt sich ein Suchbegriff eingeben, etwa „Schule“ oder „Sanierung“, um innerhalb des Gewerks einzugrenzen.',
            ],
            links: suchLinks,
        },
        {
            titel: 'Ausschreibungen nach Region finden: Leistungsort statt Sitz der Vergabestelle',
            absaetze: [
                'Für einen Baubetrieb zählt, wo gebaut wird, nicht wo die Vergabestelle sitzt. Die Regionssuche vergleicht deshalb den Leistungsort der Bekanntmachung, einschließlich der NUTS-Regionen, mit Ihrer Eingabe. Ein Bundesland wie „Bayern“, eine Region wie „NRW“ oder eine Stadt wie „Leipzig“ genügen.',
                'Fehlt der Leistungsort in der Bekanntmachung, weist die Entscheidungshilfe das ausdrücklich als offenen Punkt aus, statt den Treffer stillschweigend zuzuordnen.',
            ],
        },
        {
            titel: 'Wo öffentliche Bauaufträge in Deutschland veröffentlicht werden',
            absaetze: [
                'Bauaufträge ab 5.404.000 Euro geschätztem Netto-Auftragswert müssen EU-weit ausgeschrieben werden und erscheinen auf TED, der amtlichen Ausschreibungsdatenbank der EU. Der weitaus größere Teil der Bauaufträge liegt darunter und wird national nach VOB/A Abschnitt 1 vergeben: auf dem Bundesportal, auf Landesportalen und auf Vergabemarktplätzen wie DTVP.',
                'Wer nur eine Quelle beobachtet, sieht deshalb nur einen Ausschnitt. Welche Quellen angebunden sind und wann sie zuletzt erfolgreich abgefragt wurden, steht öffentlich auf der Statusseite.',
            ],
        },
        {
            titel: 'Fachlose: warum auch kleine Betriebe direkt mitbieten können',
            absaetze: [
                'Öffentliche Auftraggeber müssen Bauleistungen in der Regel nach Gewerken getrennt in Fachlosen und nach Menge in Teillosen vergeben. Oberhalb der EU-Schwelle schreibt das § 97 Absatz 4 GWB vor, darunter § 5 Absatz 2 VOB/A. Eine Gesamtvergabe an einen Generalunternehmer ist nur aus wirtschaftlichen oder technischen Gründen zulässig.',
                'Für Handwerksbetriebe heißt das: Auch bei einem großen Schulneubau wird das Elektro- oder Malerlos oft einzeln ausgeschrieben. Nennt eine Bekanntmachung mehrere Lose, zeigt die Trefferkarte die Zahl an.',
            ],
        },
        {
            titel: 'Für Subunternehmer und Nachunternehmer',
            absaetze: [
                'Subunternehmer haben drei Wege zu öffentlichen Bauaufträgen: das passende Fachlos selbst anbieten, sich mit anderen Betrieben zu einer Bietergemeinschaft zusammenschließen oder als Nachunternehmer eines Bieters arbeiten. Für die ersten beiden Wege genügt eine Gewerk-Suche mit Region und Mindestvorlauf.',
                'Viele Auftraggeber verlangen, dass Nachunternehmer im Angebot benannt werden. Steht das als Eignungsanforderung in der Bekanntmachung, führt die Entscheidungshilfe es als Nachweis „Nachunternehmer“ mit dem zitierten Text auf.',
            ],
        },
        {
            titel: 'So richten Sie die Suche ein',
            absaetze: [],
            liste: [
                'Gewerk wählen, zum Beispiel „Elektro, SHK & Dämmung“.',
                'Region eintragen, in der Sie Aufträge ausführen können.',
                'Ausschlussbegriffe setzen, etwa „Winterdienst“ oder „Wartungsvertrag“.',
                'Mindestvorlauf in Tagen angeben, damit keine Frist zu knapp wird.',
                'Suche speichern: Beim nächsten Öffnen werden neue Treffer, Fristen und Unterlagen verglichen.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was die Gewerk-Suche nicht leistet',
        absaetze: [
            'Die Bau-Filter prüfen nur den Haupt-CPV. Bekanntmachungen, bei denen Ihr Gewerk nur als Zusatz-CPV geführt wird oder die falsch klassifiziert sind, fehlen in der gefilterten Liste; eine Stichwortsuche ohne Gewerk-Filter findet sie eher. Die Abdeckung beschränkt sich auf die angebundenen Quellen, nicht auf jede Vergabeplattform in Deutschland.',
            'Aufträge von Bauträgern, Generalunternehmern und privaten Bauherren werden nicht öffentlich ausgeschrieben und sind deshalb nicht enthalten. Angebotstext und Kalkulation bleiben beim Betrieb; GAEB-Leistungsverzeichnisse werden nur lesend aufbereitet. Maßgeblich ist immer die verlinkte Originalbekanntmachung.',
        ],
    },
    faq: [
        {
            frage: 'Wie finde ich öffentliche Ausschreibungen nach Gewerk und Region?',
            antwort:
                'Wählen Sie in der Suche ein Gewerk, also eine CPV-Gruppe wie Hochbau (4521) oder Elektro, SHK und Dämmung (453), und tragen Sie Ihre Region ein. Die Suche gleicht den Haupt-CPV und den Leistungsort jeder Bekanntmachung aus 18 Live-Quellen ab und zeigt zu jedem Treffer die Gründe.',
        },
        {
            frage: 'Wo finde ich öffentliche Bauaufträge in Deutschland?',
            antwort:
                'Bauaufträge ab 5.404.000 Euro erscheinen EU-weit auf TED. Alle kleineren Bauaufträge, also die große Mehrheit, stehen auf dem Bundesportal, auf Landesportalen und auf Vergabemarktplätzen. Eine Suche über mehrere Quellen erspart das tägliche Abklappern einzelner Portale.',
        },
        {
            frage: 'Gibt es eine automatische Ausschreibungssuche für Subunternehmer?',
            antwort:
                'Ja. Subunternehmer können als Bieter auf einzelne Fachlose oder in einer Bietergemeinschaft antreten. Eine gespeicherte Suche nach Gewerk, Region und Mindestvorlauf meldet beim nächsten Öffnen neue Treffer und geänderte Fristen. Für ein laufend gepflegtes Profil gibt es den Pilotzugang.',
        },
        {
            frage: 'Ab welchem Auftragswert wird ein Bauauftrag EU-weit ausgeschrieben?',
            antwort:
                'Seit dem 1. Januar 2026 liegt der EU-Schwellenwert für Bauaufträge bei 5.404.000 Euro geschätztem Netto-Auftragswert. Darunter gilt in Deutschland die VOB/A Abschnitt 1 mit nationaler Bekanntmachung. Die Trefferkarte vergleicht einen veröffentlichten Auftragswert mit diesem Schwellenwert.',
        },
    ],
    ctaKontext: 'Bauaufträge nach Gewerk und Region',
    ctaTitel: 'Ihr Gewerk dauerhaft beobachten lassen',
    ctaText:
        'Wir richten ein Suchprofil für Ihre Gewerke, Regionen und Auftragsgrößen ein und zeigen Ihnen die ersten Bauaufträge mit Begründung.',
    querverweise: [
        { path: '/ausschreibungssuche-automatisieren', text: 'Wie die automatisierte Ausschreibungssuche funktioniert' },
        { path: '/status', text: 'Quellenstatus aller angebundenen Portale' },
        { path: '/zahlen', text: 'Vergabemarkt Deutschland in Zahlen' },
    ],
}
