export const evbItVertrag = {
    path: '/evb-it-vertrag',
    h1: 'EVB-IT Vertrag in öffentlichen IT-Ausschreibungen: Vertragstypen & Checkliste',
    direktantwort:
        'Bei öffentlichen IT-Ausschreibungen von Bund, Ländern und Kommunen ersetzen die EVB-IT (Ergänzende Vertragsbedingungen für die Beschaffung von IT-Leistungen) fast immer die eigenen AGB des Anbieters. Wer Werkvertrag (Erstellung, System) und Dienstvertrag (Dienstleistung) sauber unterscheidet und Risiken vor Fristablauf per Bieterfrage klärt, vermeidet Ausschlüsse und Haftungsfallen.',
    fakten: {
        datenstand: '24. November 2026',
        kopf: ['EVB-IT Vertragstyp', 'Rechtsnatur', 'Typischer Anwendungsfall'],
        zeilen: [
            ['EVB-IT Dienstleistung', 'Dienstvertrag (kein Abnahmeerfolg)', 'IT-Beratung, KI-Coaching, Unterstützung nach Aufwand'],
            ['EVB-IT Erstellung', 'Werkvertrag (Abnahmepflicht)', 'Individualsoftware, Portale, KI-Agenten-Entwicklung'],
            ['EVB-IT System', 'Werkvertrag (Gesamtsystem)', 'Hardware + Software + Integration aus einer Hand'],
            ['EVB-IT Cloud', 'Cloud-/SaaS-Vertrag', 'SaaS, Hosting, Managed Cloud (DSGVO, BSI-C5/ISO 27001)'],
            ['EVB-IT Kauf / Überlassung Typ A', 'Kaufvertrag', 'Server, GPU-Hardware, dauerhafte Standardsoftware'],
            ['EVB-IT Pflege S / Instandhaltung', 'Dauerschuldverhältnis', 'Wartung, Updates, Support & SLA-Betrieb'],
        ],
    },
    abschnitte: [
        {
            titel: 'Die fünf wichtigsten Prüfpunkte für IT-Bieter vor Angebotsabgabe',
            absaetze: [
                'Öffentliche Auftraggeber fügen den Vergabeunterlagen meist ein vorausgefülltes EVB-IT-Vertragsformular bei. Prüfen Sie diese fünf Punkte frühzeitig vor Ablauf der Bieterfragen-Frist:',
            ],
            liste: [
                'Werk- vs. Dienstvertrag: Bei EVB-IT Erstellung und System schulden Sie eine förmliche Abnahme — unklare Anforderungen zwingend per Bieterfrage konkretisieren.',
                'Haftungsdeckel & Vertragsstrafen: Kontrollieren Sie Haftungsobergrenzen und Verzugs-Pönalen im Verhältnis zum Auftragswert.',
                'Nutzungsrechte & Open Source / KI: Grenzen Sie vorbestehende Bibliotheken, Frameworks und lokale KI-Modelle sauber ab.',
                'Datenschutz & IT-Sicherheit: Bei EVB-IT Cloud sind EU-Hosting, AVV und BSI-/ISO-Nachweise zentral — bei strengen Auflagen punktet [lokale KI-Hardware](/foerderung-ki-hardware-investitionsbooster).',
                'Passende Eignungsnachweise: Referenzen und [CPV-Codes (72 & 48)](/cpv-code-suche) müssen zum ausgeschriebenen Leistungsumfang passen.',
            ],
        },
        {
            titel: 'Warum eigene AGB im Angebot fast immer zum Ausschluss führen',
            absaetze: [
                'Ein häufiger Anfängerfehler in [IT-Ausschreibungen](/ausschreibungen-it) ist das Anhängen eigener allgemeiner Geschäftsbedingungen oder abweichender Lizenztexte. Vergaberechtlich gilt das als unzulässige Änderung der Vergabeunterlagen — die Vergabestelle muss das Angebot dann zwingend ausschließen.',
                'Mit Ausschreibungsagenten.de durchsuchen Sie 18 Live-Quellen frühzeitig nach passenden IT-Verfahren, sodass genug Zeit für die Vertragsprüfung und Bieterfragen bleibt.',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Keine Rechtsberatung zu EVB-IT-Verträgen',
        absaetze: [
            'Ausschreibungsagenten.de bündelt öffentliche Bekanntmachungen und bereitet Kernanforderungen nachvollziehbar auf — wir erbringen keine Rechtsberatung und prüfen keine individuellen EVB-IT-Vertragsentwürfe rechtlich verbindlich.',
            'Bei komplexen System-, Erstellungs- oder Cloud-Verträgen oberhalb der [EU-Schwellenwerte 2026/2027](/eu-schwellenwerte) bleibt eine vergabe- und IT-rechtliche Prüfung durch Fachanwälte unverzichtbar.',
        ],
    },
    faq: [
        {
            frage: 'Darf ich bei einer EVB-IT-Ausschreibung meine eigenen AGB beifügen?',
            antwort:
                'In der Regel nein. Eigene AGB, die den EVB-IT widersprechen, gelten im Vergaberecht als Änderung der Vergabeunterlagen und führen fast immer zum zwingenden Ausschluss des Angebots.',
        },
        {
            frage: 'Was ist der Unterschied zwischen EVB-IT Dienstleistung und EVB-IT Erstellung?',
            antwort:
                'EVB-IT Dienstleistung ist ein Dienstvertrag ohne geschuldeten Abnahmeerfolg (z. B. Beratung nach Aufwand). EVB-IT Erstellung ist ein Werkvertrag mit förmlicher Abnahme, Mängelhaftung und konkretem Erfolgsmaßstab.',
        },
        {
            frage: 'Wo finde ich aktuelle öffentliche IT-Ausschreibungen mit EVB-IT?',
            antwort:
                'Über unsere Live-Suche und die Branchenseite [IT-Ausschreibungen](/ausschreibungen-it) durchsuchen Sie 18 Quellen (inkl. Bund, TED, Datenservice und Landesportale) gezielt nach CPV 72 und 48.',
        },
    ],
    ctaKontext: 'EVB-IT & IT-Ausschreibungen',
    ctaTitel: 'Passende IT-Ausschreibungen frühzeitig mit Begründung erhalten',
    ctaText:
        'Je früher Ihr Team eine IT-Vergabe sieht, desto mehr Zeit bleibt für EVB-IT-Prüfung und Bieterfragen. Testen Sie Ihr IT-Profil kostenfrei in der Pilotphase.',
    querverweise: [
        { path: '/ausschreibungen-it', text: 'IT- & Software-Ausschreibungen finden (CPV 72 & 48)' },
        { path: '/foerder-und-auftrags-planer', text: 'Auftrags- & Förder-Planer 2027 für IT-Häuser' },
        { path: '/praequalifizierung-pq-vob-vol', text: 'Präqualifizierung (AVPQ / PQ-VOL) für IT-Dienstleister' },
        { path: '/eu-schwellenwerte', text: 'EU-Schwellenwerte 2026/2027 (inkl. 140.000 € Bund)' },
    ],
}
