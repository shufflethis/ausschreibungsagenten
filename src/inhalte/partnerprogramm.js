export const partnerprogramm = {
    path: '/partner',
    h1: 'Partnerprogramm: Empfehlungen, die sich rechnen',
    direktantwort:
        'Das Partnerprogramm von Ausschreibungsagenten vergütet Empfehlungen, die zu einem Vertragsabschluss führen. Sie erhalten einen persönlichen Empfehlungslink, die Zuordnung gilt dreißig Tage ab dem ersten Klick, und die Provision beträgt 25 Prozent des Bruttoumsatzes — bei laufenden Abonnements auch auf jede Folgezahlung. Voraussetzung ist, dass der Empfohlene der Speicherung zustimmt.',
    fakten: {
        datenstand: '20. August 2026',
        kopf: ['Merkmal', 'Regelung'],
        zeilen: [
            ['Provision', '25 % vom Bruttoumsatz — dem Rechnungsbetrag einschließlich Umsatzsteuer'],
            ['Wiederkehrend', 'Ja, solange das empfohlene Abonnement läuft'],
            ['Zuordnungsdauer', '30 Tage ab dem ersten Klick auf den Empfehlungslink'],
            ['Zuordnungsmodell', 'First-Touch — der zuerst empfehlende Partner behält die Zuordnung'],
            ['Bestandskunden', 'Ausgeschlossen: bereits zahlende Konten werden nicht neu zugeordnet'],
            ['Voraussetzung', 'Einwilligung des Empfohlenen in die Speicherung der Partnerkennung'],
            ['Auszahlung', 'Manuell nach Freigabe, gegen Rechnung oder Gutschrift'],
        ],
    },
    abschnitte: [
        {
            titel: 'Für wen sich das Programm eignet',
            absaetze: [
                'Das Programm richtet sich an alle, die regelmäßig mit Betrieben zu tun haben, für die öffentliche Aufträge ein Thema sind: Verbände und Innungen, Unternehmensberatungen im Mittelstand, Agenturen und Systemhäuser, Steuerberatungen sowie Fachmedien und Blogs rund um Vergabe und Bau.',
                'Entscheidend ist nicht die Reichweite, sondern die Passung. Eine Empfehlung an fünf Betriebe, die tatsächlich an Ausschreibungen teilnehmen, ist mehr wert als tausend Klicks aus einem thematisch fremden Umfeld — weil nur ein Vertragsabschluss vergütet wird.',
            ],
        },
        {
            titel: 'Wie die Zuordnung technisch funktioniert',
            absaetze: [
                'Ihr Empfehlungslink trägt einen Parameter mit Ihrer Partnerkennung. Klickt jemand darauf, fragen wir ihn einmalig, ob wir uns diese Kennung merken dürfen. Stimmt er zu, speichern wir sie dreißig Tage lang — ausschließlich die Kennung, keine weiteren Daten über sein Verhalten auf der Seite.',
                'Meldet sich derselbe Besucher später an und bucht einen Tarif, reichen wir die Kennung an die Zahlungsabwicklung weiter. Erst dort entsteht die Provision, und zwar aus dem tatsächlich gezahlten Betrag. Es gibt keine Vergütung für Klicks, keine für Anmeldungen und keine für unbezahlte Testphasen.',
            ],
            liste: [
                'Klick auf den Empfehlungslink, Einwilligung wird abgefragt',
                'Kennung wird für 30 Tage gespeichert, First-Touch gilt',
                'Anmeldung und späterer Kauf werden der Kennung zugeordnet',
                'Provision entsteht mit der Zahlung, wiederkehrend bei Abonnements',
            ],
        },
        {
            titel: 'Was ausdrücklich nicht erlaubt ist',
            absaetze: [
                'Es gibt Wege, ein Partnerprogramm auszunutzen, die dem beworbenen Produkt schaden. Wir benennen sie vorab, statt sie später zu sanktionieren: bezahlte Suchanzeigen auf unseren Markennamen, unaufgeforderte E-Mail-Werbung, Gutschein- und Cashback-Seiten ohne echten Empfehlungsbezug, das ungefragte Setzen der Kennung im Hintergrund fremder Seiten sowie die Zuordnung eigener Käufe.',
                'Ein Verstoß führt zur Sperrung des Zugangs und zum Verfall offener Provisionen. Das steht so in den Teilnahmebedingungen, denen Sie beim Beitritt zustimmen und die wir mit Zeitpunkt der Zustimmung protokollieren.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was das Partnerprogramm nicht ist',
        absaetze: [
            'Es ist kein Vertriebsvertrag und keine Handelsvertretung. Sie empfehlen, wir verkaufen — Beratung, Vertragsschluss und Betreuung der empfohlenen Betriebe liegen vollständig bei uns. Eine Abnahmeverpflichtung, ein Gebietsschutz oder ein Anspruch auf eine Mindestvergütung entstehen daraus nicht.',
            'Wir sichern auch keine bestimmte Zuordnungsquote zu. Weil die Speicherung der Partnerkennung eine Einwilligung voraussetzt, wird nicht jeder Klick zuordenbar sein. Ihre eigenen Klickzahlen werden deshalb regelmäßig über der Zahl der zugeordneten Anmeldungen liegen. Das ist kein Fehler, sondern die Folge einer datenschutzkonformen Umsetzung.',
        ],
    },
    faq: [
        {
            frage: 'Wie hoch ist die Provision?',
            antwort: '25 Prozent vom Bruttoumsatz, also vom Rechnungsbetrag einschließlich Umsatzsteuer. Bei Abonnements fällt sie wiederkehrend an, solange der empfohlene Vertrag läuft — nicht nur im ersten Monat. Beim Pro-Tarif ist das eine Vergütung, die jeden Monat aufs Neue entsteht, ohne dass Sie etwas tun müssen.',
        },
        {
            frage: 'Warum wird nicht jeder Klick gezählt?',
            antwort: 'Die Partnerkennung liegt in einem Cookie, das nicht technisch notwendig ist und daher eine Einwilligung braucht. Wer ablehnt, wird nicht zugeordnet. Wir halten diesen Weg für richtig, auch wenn er die messbare Quote senkt — die Alternative wäre eine Speicherung ohne Zustimmung.',
        },
        {
            frage: 'Werden auch Bestandskunden vergütet?',
            antwort: 'Nein. Konten mit einem bereits laufenden bezahlten Vertrag werden keinem Partner neu zugeordnet, auch wenn sie später über einen Empfehlungslink kommen. Vergütet wird neuer Umsatz, den die Empfehlung tatsächlich gebracht hat.',
        },
        {
            frage: 'Wie und wann wird ausgezahlt?',
            antwort: 'Provisionen werden nach Ablauf der Widerrufs- und Sperrfrist freigegeben und anschließend manuell überwiesen — gegen Ihre Rechnung oder per Gutschriftverfahren, je nach steuerlicher Situation. Die Auszahlungsschwelle und der Rhythmus stehen in den Teilnahmebedingungen.',
        },
        {
            frage: 'Was passiert bei einer Rückerstattung?',
            antwort: 'Wird eine Zahlung erstattet oder zurückgebucht, entfällt die zugehörige Provision. Bereits ausgezahlte Beträge werden mit der nächsten Abrechnung verrechnet. Deshalb gibt es zwischen Zahlungseingang und Freigabe eine Sperrfrist.',
        },
    ],
    ctaKontext: 'Partnerprogramm',
    ctaTitel: 'Partner werden',
    ctaText:
        'Schreiben Sie uns kurz, mit welchem Umfeld Sie arbeiten und wie Sie empfehlen möchten. Wir melden uns mit den Konditionen, den Teilnahmebedingungen und Ihrem persönlichen Empfehlungslink.',
    querverweise: [
        { path: '/datenschutz', text: 'Wie wir die Partnerkennung verarbeiten' },
        { path: '/entwickler', text: 'API und Agenten-Anbindung für technische Partner' },
        { path: '/ueber-uns', text: 'Wer hinter Ausschreibungsagenten steht' },
    ],
}
