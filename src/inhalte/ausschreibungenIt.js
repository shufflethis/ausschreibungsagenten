export const ausschreibungenIt = {
    path: '/ausschreibungen-it',
    h1: 'IT-Ausschreibungen finden: Software, Cloud und Beratung im öffentlichen Sektor',
    direktantwort:
        'Öffentliche IT-Ausschreibungen werden über CPV-Abteilung 72 (IT-Dienstleistungen, 4.025 EU-Verfahren pro Jahr in Deutschland) und Abteilung 48 (Software, 3.056 Verfahren) gebündelt. Ausschreibungsagenten.de durchsucht 18 Live-Quellen von TED und dem Datenservice Öffentlicher Einkauf bis zu den Landesportalen und nennt zu jedem IT-Treffer CPV-Code, Frist, Schwellenwert und Eignungsanforderungen.',
    fakten: {
        datenstand: '22. November 2026',
        kopf: ['Kennzahl / Kriterium', 'Wert im deutschen IT-Vergabemarkt'],
        zeilen: [
            ['EU-Verfahren CPV 72 (IT-Dienste)', '4.025 Bekanntmachungen in 12 Monaten (Platz 6, eigene TED-Auswertung)'],
            ['EU-Verfahren CPV 48 (Software & Systeme)', '3.056 Bekanntmachungen in 12 Monaten (Platz 7, eigene TED-Auswertung)'],
            ['EU-Schwellenwerte 2026/2027 (netto)', '140.000 € (oberste/obere Bundesbehörden) · 216.000 € (Länder & Kommunen)'],
            ['Typische Vertragstypen', 'EVB-IT System, EVB-IT Dienstleistung, EVB-IT Erstellung, EVB-IT Cloud & Pflege'],
            ['Häufige Nachweise', 'Referenzprojekte, ISO 27001 / BSI-Grundschutz, C5, BITV 2.0 Barrierefreiheit'],
        ],
    },
    abschnitte: [
        {
            titel: 'Welche IT-Leistungen die öffentliche Hand am häufigsten ausschreibt',
            absaetze: [
                'IT-Dienstleistungen (CPV 72) und Softwarepakete (CPV 48) gehören laut unserer [Auswertung des deutschen Vergabemarkts](/zahlen) mit zusammen über 7.000 EU-weiten Verfahren innerhalb von zwölf Monaten zu den größten Dienstleistungs-Kategorien in Deutschland — hinzu kommt ein noch größerer Anteil nationaler Unterschwellen-Vergaben unterhalb von 140.000 bzw. 216.000 Euro.',
                'Stark nachgefragt sind Softwareentwicklung und Fachverfahren (CPV 7220), Web-Portale und barrierefreie CMS-Relaunches nach BITV 2.0 (CPV 7240), IT-Betrieb und Managed Services (CPV 7250), IT-Sicherheit, Pentests und ISMS-Beratung (CPV 7260) sowie SaaS- und DMS-Lizenzen (CPV 4800). Alle relevanten Codes lassen sich in unserer [CPV-Code-Suche](/cpv-code-suche) filtern.',
            ],
            links: [
                { href: '/?suche=Software#ergebnisse', text: 'Live-Suche öffnen: Software & Fachverfahren' },
                { href: '/?suche=IT-Sicherheit#ergebnisse', text: 'Live-Suche öffnen: IT-Sicherheit & Cyber Security' },
                { href: '/?suche=Website#ergebnisse', text: 'Live-Suche öffnen: Webdesign, CMS & Portale' },
            ],
        },
        {
            titel: 'Besonderheiten bei IT-Vergaben: EVB-IT, Rahmenverträge und Eignungsnachweise',
            absaetze: [
                'Öffentliche IT-Aufträge folgen fast immer den Ergänzenden Vertragsbedingungen für die Beschaffung von IT-Leistungen (EVB-IT). Entscheidend für die Go/No-Go-Prüfung sind frühzeitig drei Punkte: die Vertragsart (Werkvertrag vs. Dienstleistung), geforderte Zertifikate wie ISO 27001 oder BSI C5 sowie harte Referenz- und Umsatzschwellen.',
                'Unsere eigene Korpus-Auswertung von 7.179 EU-Bekanntmachungen zeigt: 56 Prozent fordern vergleichbare Referenzen, 49 Prozent Mindestumsätze und 33 Prozent konkrete Zertifikate ([alle Zahlen & Methodik](/zahlen)). Im Pilot liest Ausschreibungsagenten.de solche Eignungsanforderungen samt Belegstelle heraus.',
            ],
        },
        {
            titel: 'Direkte Anbindung für IT-Häuser: REST-API, MCP und Webhooks',
            absaetze: [
                'Gerade IT-Dienstleister, Systemhäuser und Software-Agenturen pflegen ihre Vertriebspipeline bereits in CRM-Systemen oder eigenen KI-Agenten. Über unsere offene [API-Dokumentation (REST, MCP und A2A)](/entwickler) lassen sich aktuelle IT-Ausschreibungen aus 18 Live-Quellen direkt anbinden — inklusive kostenfreiem API-Key zum sofortigen Testen.',
                'Ob ein Vorhaben EU-weit auf TED oder national auf Bundes- und Landesportalen erscheint, prüfen Sie in Sekunden mit dem [EU-Schwellenwerte-Rechner 2026/2027](/eu-schwellenwerte); alle Konditionen stehen auf der [Preisseite](/preise).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Was wir bei IT-Ausschreibungen bewusst nicht übernehmen',
        absaetze: [
            'Ausschreibungsagenten.de prüft keine EVB-IT-Verträge juristisch, erstellt keine Sicherheitskonzepte und schreibt keine Leistungs- oder Konzepttexte für Ihr Angebot. Diese inhaltlichen und haftungsrelevanten Schritte bleiben bei Ihrem Bid-Team (mehr dazu unter [KI und Ausschreibungen](/ki-angebot-ausschreibung)).',
            'Zudem ist IT aktuell über Stichwörter und CPV-Gruppen (72, 48, 30) suchbar; ein eigenes kuratiertes IT-Schlagwort-Vertical konfigurieren wir im begleiteten Pilot individuell je Unternehmen.',
        ],
    },
    faq: [
        {
            frage: 'Welche CPV-Codes sind für IT-Unternehmen und Software-Agenturen am wichtigsten?',
            antwort:
                'Die Kernabteilungen sind CPV 72000000 (IT-Dienste, insbesondere 7220 Softwareentwicklung, 7240 Internetdienste/CMS, 7250 IT-Betrieb, 7260 IT-Sicherheit) sowie CPV 48000000 für Softwarepakete und Lizenzen. Alle Codes samt Direktlink in die Suche stehen in der [CPV-Code-Suche](/cpv-code-suche).',
        },
        {
            frage: 'Ab welchem Wert werden IT-Ausschreibungen EU-weit auf TED veröffentlicht?',
            antwort:
                'Seit 1. Januar 2026 liegt der EU-Schwellenwert für Liefer- und Dienstleistungen bei 140.000 Euro netto für oberste und obere Bundesbehörden sowie bei 216.000 Euro netto für Länder, Kommunen und sonstige öffentliche Auftraggeber. Prüfen lässt sich jeder Betrag im [EU-Schwellenwerte-Rechner](/eu-schwellenwerte).',
        },
        {
            frage: 'Können kleine IT-Firmen trotz hoher Referenzanforderungen mitbieten?',
            antwort:
                'Ja — insbesondere im nationalen Unterschwellenbereich, bei einzelnen Fachlosen oder über eine Bietergemeinschaft mit einem komplementären Partner. Ein klar gesetzter Ausschlussfilter spart hier viel Zeit bei zu großen Enterprise-Rahmenverträgen.',
        },
        {
            frage: 'Wie binden IT-Teams Ausschreibungsagenten.de in eigene Tools oder KI-Agenten ein?',
            antwort:
                'Über unseren öffentlichen MCP-Server, die dokumentierte REST-API v1 oder das CLI-Paket auf npm. Ein Free API-Key mit 60 Anfragen pro Stunde ist ohne Zahlungsdaten im [Entwickler-Portal](/entwickler) verfügbar.',
        },
    ],
    ctaKontext: 'IT-Ausschreibungen',
    ctaTitel: 'Suchprofil für Ihr IT-Portfolio im Pilot einrichten',
    ctaText:
        'Wir kombinieren Ihre CPV-Codes (72/48), Wunsch-Technologien und Ausschlusswörter (z. B. reine Hardware-Lieferung) und liefern Ihnen aktuelle IT-Treffer mit Begründung.',
    querverweise: [
        { path: '/cpv-code-suche', text: 'CPV-Code-Suche für IT, Software und Cloud' },
        { path: '/eu-schwellenwerte', text: 'EU-Schwellenwerte 2026/2027 prüfen' },
        { path: '/entwickler', text: 'REST-API, MCP-Server und Free API-Key' },
        { path: '/zahlen', text: 'Vergabemarkt Deutschland in Zahlen & Eignungsquoten' },
    ],
}
