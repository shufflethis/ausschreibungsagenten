// Transkript des Erklaervideos, aus der Tonspur erzeugt und anschliessend
// von Hoerfehlern befreit ("TED" statt "Tät", "CPV" statt "CPW",
// "Bruttoinlandsprodukt" statt "Protoinlandsprodukt").
//
// Der Text steht bewusst sichtbar auf der Seite: Suchmaschinen und
// KI-Crawler werten kein Bewegtbild aus. Ohne Transkript waere das Video
// fuer sie nicht vorhanden, mit Transkript ist es die inhaltsreichste
// Passage der Startseite.

export const VIDEO_TITEL = 'Öffentliche Ausschreibungen finden: wie der Agent arbeitet'

export const VIDEO_BESCHREIBUNG =
    'Erklärvideo in neun Minuten: wie groß der Markt der öffentlichen Beschaffung ist, warum die Suche von Hand Aufträge kostet, wie das Profil-Matching über 17 Quellen funktioniert und was es kostet.'

export const VIDEO_TRANSKRIPT = [
    {
        zeit: '00:00',
        titel: 'Worum es geht',
        text: 'Wie navigiert man erfolgreich durch den Dschungel der öffentlichen Vergabe in Deutschland? Wer schon einmal versucht hat, einen Fuß in die Tür zu bekommen, weiß, wie unübersichtlich das ist. Diese Übersicht zeigt, wie sich Ausschreibungen aus TED, vom Bund und den Landesportalen filtern und finden lassen — und wie sich dieser dezentrale Markt strategisch erschließen lässt.',
    },
    {
        zeit: '00:41',
        titel: 'Der Milliardenmarkt',
        text: '135,2 Milliarden Euro: So beziffert die amtliche Vergabestatistik des Statistischen Bundesamtes das Volumen der gemeldeten Zuschläge für 2024, bei knapp 200.000 gemeldeten Verfahren. Weil die Statistik Erfassungs- und Meldegrenzen kennt, liegt die tatsächliche Gesamtzahl noch höher.',
    },
    {
        zeit: '01:51',
        titel: 'Warum das den Mittelstand angeht',
        text: 'Eine häufig zitierte Schätzung der OECD beziffert die öffentliche Beschaffung in Deutschland auf rund 15 Prozent des Bruttoinlandsprodukts. Ob Baugewerbe, Handwerk, IT, Marketing oder Facility Management — Bund, Länder, Kommunen und öffentliche Einrichtungen vergeben laufend Aufträge. Für kleine und mittlere Unternehmen ist das eine große Chance, weil das Vergaberecht ihre Beteiligung ausdrücklich fördert, meist indem große Aufträge in kleinere Lose aufgeteilt werden.',
    },
    {
        zeit: '02:33',
        titel: 'Was die Suche von Hand kostet',
        text: 'Ausschreibungen sind extrem dezentral verteilt, über Dutzende Portale auf EU-, Bundes- und Landesebene. Daraus entstehen drei Probleme. Erstens Zeitverlust: Wer alle Quellen von Hand kontrolliert, bindet Arbeitszeit, die später beim Schreiben des Angebots fehlt. Zweitens Informationsflut: Wer nur nach breiten Stichwörtern sucht, wird mit unpassenden Treffern überschwemmt — falsches Gewerk, falsche Region, zu großes Volumen. Drittens verpasste Fristen: Je später ein passendes Verfahren auffällt, desto weniger Zeit bleibt für Unterlagen, Partnersuche und eine saubere Kalkulation.',
    },
    {
        zeit: '03:51',
        titel: 'In drei Schritten zum eigenen Agenten',
        text: 'Schritt eins: Profil anlegen, in wenigen Minuten — Gewerke, Regionen, passendes Auftragsvolumen und erfüllte Eignungskriterien. Je präziser, desto besser. Schritt zwei: Der Agent prüft im Hintergrund jede neue Ausschreibung anhand des einheitlichen EU-Vokabulars, der CPV-Codes, sowie fester Regeln und eigener Stichwörter. Schritt drei: Über E-Mail-Digest oder Dashboard kommen nur die relevanten Treffer an — samt Frist, Wert, Originalquelle und der Begründung, warum genau dieser Treffer passt.',
    },
    {
        zeit: '04:44',
        titel: '17 Live-Quellen',
        text: 'Durchsucht werden derzeit 17 Live-Quellen: europäische Datenbanken wie TED, bundesweite Quellen wie service.bund.de und der Datenservice Öffentlicher Einkauf sowie E-Vergabe-Plattformen und Landesportale, darunter Bayern, Nordrhein-Westfalen, Baden-Württemberg und Hessen. Damit lässt sich ein großer Teil des Marktes abdecken, ohne 17 Webseiten parallel offen zu halten.',
    },
    {
        zeit: '05:28',
        titel: 'Warum reine Stichwortsuche scheitert',
        text: 'Herkömmliche Werkzeuge arbeiten meist mit einfacher Stichwortsuche. Die eine Behörde schreibt eine Sanitärinstallation aus, die nächste sanitärtechnische Anlagen. Fehlt genau dieses eine Wort, ist der Auftrag weg. Ausschreibungsagenten.de setzt stattdessen auf erklärbares Matching: standardisierte CPV-Codes der EU, kombiniert mit Ausschlusswörtern und klaren Regeln für Ort, Wert und Frist. Sichtbar wird dabei immer, warum ein Treffer vorgeschlagen wurde.',
    },
    {
        zeit: '06:09',
        titel: 'Was bewusst nicht eingesetzt wird',
        text: 'Eine rein semantische KI, die Texte unkontrolliert interpretiert, ist derzeit bewusst nicht produktiv im Einsatz. Stattdessen gilt nachvollziehbares, regelbasiertes Matching. Semantische Modelle könnten später ergänzt werden, die Erwartungshaltung bleibt aber realistisch und für Kundinnen und Kunden jederzeit nachprüfbar.',
    },
    {
        zeit: '06:37',
        titel: 'Die Tarife',
        text: 'Der Pro-Tarif kostet 149 Euro im Monat und enthält Suchprofil, Alerts, Volltextsuche und wöchentliche Trefferlisten. Wer höhere API-Limits oder Priorisierung braucht, ist im Agent-Tarif für 499 Euro im Monat richtig. Für konkrete Hilfe bei der Strukturierung einer bestimmten Ausschreibung gibt es das Paket Verfahren für einmalig 1.499 Euro. Der Online-Checkout wird erst nach einer erfolgreichen persönlichen Pilotphase freigeschaltet.',
    },
    {
        zeit: '07:21',
        titel: 'Fünf Tipps für die Angebotsabgabe',
        text: 'Erstens: Eignungskriterien sorgfältig prüfen — Umsatz, Referenzen, Zertifikate. Passt etwas nicht, folgt der Ausschluss. Zweitens: Das Leistungsverzeichnis vollständig ausfüllen, oft in standardisierten GAEB-Formaten; jede Position braucht einen Preis. Drittens: Fristen auf die Minute einhalten. Viertens: Sind Nebenangebote zugelassen, diese für innovative oder günstigere Alternativen nutzen. Fünftens: Bei Unklarheiten Bieterfragen stellen — meist anonym über das Portal.',
    },
    {
        zeit: '08:24',
        titel: 'Fazit',
        text: 'Der Markt ist groß, die Suche von Hand ist ein Zeitfresser, und das Bündeln von TED, Bundes- und Landesportalen löst genau dieses Problem. Die Technik ist da, um das Finden zu automatisieren. Das Gewinnen der Ausschreibung bleibt Sache des eigenen, überzeugenden Angebots.',
    },
]
