export const ausschreibungenSachsen = {
    path: '/ausschreibungen-sachsen',
    h1: 'Ausschreibungen Sachsen: Landesportal Sachsen, TED & SAB-Förderstatus 2027',
    direktantwort:
        'Das Landesportal Sachsen (eVergabe Sachsen) gehört zu den 18 direkt und produktiv angebundenen Live-Quellen von Ausschreibungsagenten.de. Gemeinsam mit TED, Datenservice Öffentlicher Einkauf, service.bund.de, DTVP und RIB finden Unternehmen öffentliche Aufträge in Dresden, Leipzig, Chemnitz und allen sächsischen Landkreisen — ergänzt um den aktuellen regionalen SAB-Förderstatus 2026/2027.',
    fakten: {
        datenstand: '24. November 2026',
        kopf: ['Kriterium', 'Stand für Sachsen'],
        zeilen: [
            ['Landesportal', 'eVergabe Sachsen – direkt in unseren 18 Live-Quellen angebunden'],
            ['Weitere Live-Quellen', 'TED (EU), Datenservice Öffentlicher Einkauf, service.bund.de, DTVP, RIB'],
            ['Landesvergaberecht', 'SächsVergG (Sächsisches Vergabegesetz), UVgO, VOB/A'],
            ['EU-Schwellenwerte 2026/27', '216.000 € netto (Liefer-/Dienstleistungen) · 5.404.000 € netto (Bauaufträge)'],
            ['NUTS-Regionen', 'DED2 (Dresden), DED4 (Chemnitz), DED5 (Leipzig)'],
            ['SAB-Förderstatus Nov. 2026', 'Leipzig/Nordsachsen OFFEN · Übergangsregion (Dresden/Chemnitz) seit Juli 2026 gestoppt'],
        ],
    },
    abschnitte: [
        {
            titel: 'Direkte Anbindung an das Landesportal Sachsen',
            absaetze: [
                'Das Landesportal Sachsen wird von Ausschreibungsagenten.de direkt produktiv gepollt; den aktuellen Abrufzeitpunkt prüfen Sie jederzeit im [Quellenstatus](/status). Zusammen mit TED, Bund und Datenservice sehen Sie sowohl kommunale Unterschwellen- als auch EU-Oberschwellenverfahren an einer Stelle.',
                'Über NUTS-Codes (`DED2`, `DED4`, `DED5`) und die [CPV-Code-Suche](/cpv-code-suche) grenzen Sie Gewerke wie [Bau](/bauauftraege-finden), [Elektro & SHK](/ausschreibungen-elektro-shk) oder [IT](/ausschreibungen-it) sauber auf Ihr Einsatzgebiet ein.',
            ],
            links: [
                { href: '/?region=Sachsen#ergebnisse', text: 'Live-Suche öffnen: aktuelle Ausschreibungen in Sachsen' },
                { href: '/?region=Sachsen&gewerk=bau#ergebnisse', text: 'Live-Suche öffnen: Bauaufträge in Sachsen (CPV 45)' },
            ],
        },
        {
            titel: 'SAB Digitalisierungszuschuss: Regionale Spaltung in Sachsen beachten',
            absaetze: [
                'Beim EFRE-Digitalisierungszuschuss der Sächsischen Aufbaubank (SAB) gilt seit Mitte Juli 2026 ein **Antragsstopp für die Übergangsregion** (u. a. Dresden, Chemnitz, Bautzen, Görlitz, Erzgebirgskreis). Weiterhin **antragsberechtigt** bleibt die Region **Leipzig / Nordsachsen** (`DED5`).',
                'Unabhängig vom SAB-Status stehen Betrieben in ganz Sachsen die [BAFA-Beratungsförderung](/bafa-foerderung-2027) (80 % außer Raum Leipzig: 50 %), der [Investitionsbooster (30 % AfA)](/foerderung-ki-hardware-investitionsbooster), die Forschungszulage (35 % KMU) und KfW 511/512 offen — direkt kombinierbar im [Auftrags- & Förder-Planer 2027](/foerder-und-auftrags-planer).',
            ],
        },
    ],
    abgrenzung: {
        titel: 'Grenzen unserer Sachsen-Abdeckung',
        absaetze: [
            'Trotz direkter Anbindung des Landesportals Sachsen erscheinen nicht-öffentliche freihändige Vergaben oder interne Kommunal-Ausschreibungen ohne Portal-Veröffentlichung auf keiner Suchplattform.',
            'Für vollständige Vergabeunterlagen, GAEB-Dateien und verbindliche SAB-Förderbedingungen bleiben stets das jeweilige Originalportal und die SAB-Richtlinien maßgeblich.',
        ],
    },
    faq: [
        {
            frage: 'Ist das Landesportal Sachsen direkt bei Ausschreibungsagenten.de angebunden?',
            antwort:
                'Ja. Das Landesportal Sachsen ist eine unserer 18 produktiv gepollten Live-Quellen — den aktuellen Datenstand sehen Sie öffentlich im [Quellenstatus](/status).',
        },
        {
            frage: 'Können Unternehmen in Dresden oder Chemnitz Ende 2026 den SAB Digitalisierungszuschuss beantragen?',
            antwort:
                'Für die Übergangsregion (u. a. Dresden, Chemnitz, Bautzen, Görlitz) gilt seit Juli 2026 ein Antragsstopp. Offen ist der Zuschuss weiter für Stadt/Landkreis Leipzig und Nordsachsen; im übrigen Sachsen greifen BAFA (80 %), Forschungszulage, Investitionsbooster und KfW 511/512.',
        },
        {
            frage: 'Wie prüfe ich GAEB-Leistungsverzeichnisse aus sächsischen Bauvergaben?',
            antwort:
                'Mit unserem kostenlosen [GAEB-Viewer](/gaeb-viewer) öffnen Sie X81-, X83-, X84- und X86-Dateien direkt lokal im Browser und exportieren Positionen nach Excel-CSV.',
        },
    ],
    ctaKontext: 'Ausschreibungen Sachsen',
    ctaTitel: 'Sachsen-Suchprofil direkt mit Landesportal im Pilot testen',
    ctaText:
        'Wir filtern Landesportal Sachsen, TED, Bund und Datenservice nach Ihren CPV-Codes und Zielregionen — kostenfrei in der Pilotphase.',
    querverweise: [
        { path: '/status', text: 'Live-Quellenstatus inkl. Landesportal Sachsen' },
        { path: '/foerder-und-auftrags-planer', text: 'Auftrags- & Förder-Planer 2027 für Sachsen' },
        { path: '/ausschreibungen-brandenburg', text: 'Ausschreibungen Brandenburg im Überblick' },
        { path: '/gaeb-viewer', text: 'Kostenloser GAEB-Viewer für Bau & TGA' },
    ],
}
