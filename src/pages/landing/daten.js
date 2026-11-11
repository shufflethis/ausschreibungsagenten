// Inhalte der Startseite: Marktueberblick, Funktionen, Branchen, FAQ.
// Reine Daten, damit die Seite selbst nur Ablauf und Darstellung traegt.
import { GEWERKE } from '../../lib/vergabe'

export const TOOLS = [
    { name: 'Ausschreibungsagenten.de (Pilot)', url: '#profil', own: true, price: '0 € im Pilot (später ab 149 €/Mon.)', ai: true, portals: '18 Live-Quellen (DE, EU, UK, US)', focus: 'Bau, Fassade, Planung & Digital', gaeb: true, alerts: true, free: true },
    { name: 'DTVP', url: 'https://www.dtvp.de', price: '€49/Mon. Professional', ai: false, portals: 'DTVP', focus: 'Offizielles Portal', gaeb: false, alerts: true, free: true },
    { name: 'aumass', url: 'https://www.aumass.de', price: 'Anbieterangabe', ai: false, portals: 'Herstellerangabe', focus: 'Breite Abdeckung', gaeb: false, alerts: true, free: true },
    { name: 'GAEB.ai', url: 'https://gaeb.ai', price: 'Anbieterangabe', ai: true, portals: 'Herstellerangabe', focus: 'Elektro/Bau', gaeb: true, alerts: true, free: true },
    { name: 'Vergabe24', url: 'https://www.vergabe24.de', price: 'Anbieterangabe', ai: false, portals: 'Herstellerangabe', focus: 'Regional', gaeb: false, alerts: true, free: false },
    { name: 'TenderWolf', url: 'https://www.tenderwolf.com', price: 'Anbieterangabe', ai: true, portals: 'EU-weit', focus: 'Europa', gaeb: false, alerts: true, free: true },
    { name: 'Jorpex', url: 'https://www.jorpex.com', price: 'Anbieterangabe', ai: true, portals: 'Global', focus: 'International', gaeb: false, alerts: true, free: false },
    { name: 'Bidfix', url: 'https://bidfix.ai', price: 'k.A.', ai: true, portals: 'DACH', focus: 'DACH-Markt', gaeb: false, alerts: true, free: false },
    { name: 'Hermix', url: 'https://hermix.com', price: 'Enterprise', ai: true, portals: 'EU', focus: 'Öffentl. Sektor', gaeb: false, alerts: true, free: true },
]

export const FEATURES = [
    { icon: 'search', title: '18 Live-Quellen', text: 'TED, service.bund.de, der Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale Bayern, NRW, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen Quellen Find a Tender und Contracts Finder und die US-Bundesquelle SAM.gov werden regelmäßig abgefragt. Deutsche eVergabe und evergabe.de befinden sich im Ausbau.', color: '' },
    { icon: 'target', title: 'Erklärbares Matching', text: 'CPV-Codes, Leistungsbegriffe, Ausschlusswörter, Leistungsort, Auftragswert und Frist ergeben einen transparenten Firmen-Fit mit einzelnen Score-Gründen.', color: '--violet' },
    { icon: 'mail', title: 'E-Mail-Digest', text: 'Der E-Mail-Digest wird im begleiteten Pilot gemeinsam getestet und anschließend je Profil täglich oder wöchentlich freigeschaltet. WhatsApp und Push sind nicht produktiv.', color: '--amber' },
    { icon: 'doc', title: 'GAEB X83/X84 lesen', text: 'GAEB-DA-XML-Dateien der Austauschphasen X83 und X84 werden nur lesend strukturiert: Bereiche, Positionen, Mengen, Einheiten und optionale Preise. Keine Kalkulationsautomatik.', color: '--green' },
    { icon: 'dashboard', title: 'Pilot-Dashboard', text: 'Aktive Treffer, Fit-Gründe, Fristen, Auftragswerte, Originalquelle, Status und interne Notizen in einer geschützten Profilansicht.', color: '' },
    { icon: 'export', title: 'Standardisierter ERP-Export', text: 'Tender lassen sich als versioniertes JSON, CSV oder XLSX exportieren. Ein signierter Webhook ist konfigurierbar; konkrete ERP-Connectoren folgen erst nach Herstellerklärung.', color: '--violet' },
]

// Bau laeuft ueber CPV-Gruppen, nicht ueber ein kuratiertes Vertical - der
// Text sagt das, damit die Karte nicht mehr verspricht als der Filter kann.
export const BAU_GEWERKE = GEWERKE.filter((g) => g.cpv)

export const BRANCHEN = [
    { emoji: 'pin', name: 'Bau & Handwerk', desc: 'Bauaufträge nach Gewerk und Region: Gruppen des CPV-Katalogs (Abteilung 45), gefiltert über den Haupt-CPV jeder Bekanntmachung. Gewerk wählen, Region ergänzen.', gewerke: BAU_GEWERKE },
    { emoji: 'crane', name: 'Fenster & Fassade', desc: 'Im Pilot aktiv: Fenster, Türen, Fassaden, Verglasung, Metallbau, Sonnenschutz und ausgewählte Brandschutz-Gewerke.' },
    { emoji: 'target', name: 'Architektur & Ingenieurbüros', desc: 'Neu konfiguriert: Objektplanung, Tragwerksplanung, TGA-Planung, Bauleitung, Vermessung und Bauleitplanung (CPV 71) — nach unserer TED-Auswertung die zweitgrößte Kategorie deutscher EU-Ausschreibungen.' },
    { emoji: 'megaphone', name: 'Marketing & Digital', desc: 'Weiterhin aktiv: Marketing, Werbung, PR, Webdesign, Grafik und ausgewählte digitale Dienstleistungen.' },
    { emoji: 'compass', name: 'Weitere Branchen', desc: 'Weitere Branchen werden nach CPV-Katalog und Pilotbedarf konfiguriert. Eine vollständige Abdeckung aller Gewerke behaupten wir derzeit nicht.' },
]

export const FAQS = [
    { q: 'Was sind öffentliche Ausschreibungen und warum sind sie wichtig?', a: 'Öffentliche Ausschreibungen sind Vergabeverfahren, mit denen Behörden, Kommunen und öffentliche Einrichtungen Aufträge an Unternehmen vergeben. Die OECD beziffert die öffentliche Beschaffung in Deutschland in einer häufig zitierten Schätzung auf rund 15 Prozent des Bruttoinlandsprodukts. Die amtliche Vergabestatistik erfasst gemeldete Zuschläge und ist nicht mit einer vollständigen Zahl aller veröffentlichten Verfahren gleichzusetzen.' },
    { q: 'Welche Vergabeportale gibt es in Deutschland?', a: 'Zu den wichtigen Quellen gehören DTVP, eVergabe, service.bund.de, die Landesportale und für EU-Verfahren TED. Unser eigener Pilot indexiert aktuell 18 Quellen: TED, service.bund.de, den Datenservice Öffentlicher Einkauf, DTVP, RIB, die Landesportale Bayern, NRW, Baden-Württemberg, Bremen, Sachsen, Mecklenburg-Vorpommern, Hessen und Rheinland-Pfalz, die Metropolregion Rhein-Neckar, das Vergabeportal Baden-Württemberg sowie die britischen Quellen Find a Tender und Contracts Finder und die US-Bundesquelle SAM.gov. Deutsche eVergabe und evergabe.de sind im Ausbau.' },
    { q: 'Was macht der Ausschreibungsagent konkret?', a: 'Der aktuelle Agent ordnet Bekanntmachungen über CPV-Codes und Regeln Branchen zu. Anschließend vergleicht er Firmenprofil, Keywords, Ausschlüsse, Leistungsort, Auftragswert und Frist. Jeder Fit-Score wird mit nachvollziehbaren Einzelgründen angezeigt; semantisches KI-Matching wird nicht als bereits produktiv behauptet.' },
    { q: 'Wie viel kostet ein Ausschreibungsagent?', a: 'Aktuell suchen wir weitere Partner für eine kostenfreie Pilotphase — im Pilot fallen keine Kosten an. Als Orientierung für den späteren Regelbetrieb: Der geplante Pro-Tarif liegt bei 149 EUR pro Monat, der Agent-Tarif bei 499 EUR pro Monat und die Begleitung eines einzelnen Verfahrens bei 1.499 EUR. Der Online-Checkout ist noch nicht freigeschaltet; Pilot und Vertrag werden persönlich abgestimmt.' },
    { q: 'Ab welchem Auftragsvolumen lohnt sich die Suche nach öffentlichen Ausschreibungen?', a: 'Eine allgemeingültige Untergrenze gibt es nicht. Entscheidend sind Auftragswert, Angebotsaufwand und Gewinnwahrscheinlichkeit. Für 2026/2027 gelten je nach Auftraggeber unterschiedliche EU-Schwellenwerte; unter anderem 140.000 EUR für Liefer- und Dienstleistungen zentraler Regierungsbehörden, 216.000 EUR für andere öffentliche Auftraggeber und 5.404.000 EUR für Bauaufträge. Maßgeblich sind immer die aktuellen amtlichen Werte und Vergabeunterlagen.' },
    { q: 'Welche GAEB-Funktion ist verfügbar?', a: 'Der Pilot liest GAEB DA XML X83 und X84 nur lesend ein und zeigt Metadaten, Bereiche, Positionen, Texte, Mengen, Einheiten und vorhandene Preise. CSV- und XLSX-Export sind möglich. Automatische Kalkulation, Preisempfehlung und Angebotsabgabe gehören nicht zum aktuellen Umfang.' },
    { q: 'Wie viele Ausschreibungen werden täglich veröffentlicht?', a: 'Eine vollständige tagesaktuelle Gesamtzahl für alle deutschen Portale existiert nicht. Bekanntmachungen sind auf EU-, Bundes-, Landes- und weiteren Vergabeplattformen verteilt. Genau deshalb weist unser Quellenstatus transparent aus, welche Portale tatsächlich abgefragt werden und wann der letzte erfolgreiche Abruf erfolgte.' },
    { q: 'Welche Branchen profitieren am meisten von Ausschreibungsagenten?', a: 'Besonders stark profitieren das Baugewerbe, Handwerksbetriebe, IT-Dienstleister, Ingenieurbüros und Facility-Management-Unternehmen. Aber auch Catering, Reinigung, Beratung, Schulung und viele weitere Branchen finden regelmäßig passende öffentliche Aufträge. Grundsätzlich gilt: Jedes Unternehmen, das Dienstleistungen oder Produkte an den öffentlichen Sektor verkaufen kann, sollte Ausschreibungsagenten nutzen.' },
    { q: 'Kann ich auch als kleines Unternehmen an öffentlichen Ausschreibungen teilnehmen?', a: 'Ja, unbedingt! Das Vergaberecht fördert sogar explizit die Beteiligung kleiner und mittlerer Unternehmen (KMU). Viele Aufträge werden in Lose aufgeteilt, um auch kleineren Betrieben die Teilnahme zu ermöglichen. Kommunale Ausschreibungen sind oft besonders KMU-freundlich. Ein KI-Agent hilft Ihnen, genau die Ausschreibungen zu finden, die zu Ihrer Unternehmensgröße und Ihren Kapazitäten passen.' },
    { q: 'Wie unterscheidet sich ausschreibungsagenten.de von anderen Plattformen?', a: 'Neben dem Marktüberblick erproben wir einen eigenen, transparenten Ausschreibungsagenten. Im aktuellen Pilot sind 18 öffentliche Quellen, erklärbares Profil-Matching, strukturierte Go/No-Go-Karten, GAEB X83/X84 und Standardexporte verfügbar. E-Mail-Digests werden im begleiteten Pilot getestet; weitere Portale und Hersteller-Connectoren kennzeichnen wir als Ausbau.' },
    { q: 'Welche Fristen gelten bei öffentlichen Ausschreibungen?', a: 'Die Angebotsfristen variieren je nach Verfahrensart. Bei offenen Verfahren oberhalb der EU-Schwellenwerte beträgt die Mindestfrist 35 Tage (mit elektronischer Bekanntmachung: 30 Tage). Unterhalb der Schwellenwerte und bei nationalen Verfahren gelten oft kürzere Fristen von 10–15 Werktagen. Ein Ausschreibungsagent mit Fristenkalender sorgt dafür, dass Sie keine Deadline verpassen.' },
    { q: 'Ist die Nutzung der Vergabeportale kostenlos?', a: 'Die Einsicht in Bekanntmachungen ist auf den meisten offiziellen Portalen kostenlos. Die Teilnahme an elektronischen Vergabeverfahren über das DTVP ist ebenfalls kostenfrei. Erweiterte Funktionen wie Suchprofile, automatische Benachrichtigungen und Export-Funktionen sind bei vielen Portalen premium-pflichtig. Drittanbieter-Tools wie aumass, TenderWolf oder GAEB.ai bieten Mehrwert-Features gegen monatliche Gebühren.' },
    { q: 'Wo werden meine Daten verarbeitet – und welche KI steckt dahinter?', a: 'Der Sitz der Yawusa UG ist Berlin, die Plattform wird in Deutschland gehostet und die eingesetzten KI-Modelle laufen bei europäischen Anbietern innerhalb der Europäischen Union (aktuell Mistral AI). Kundendaten verlassen die EU nicht. Verarbeitet wird, was für Suchprofil, Matching und Digest nötig ist; Details stehen in der Datenschutzerklärung.' },
    { q: 'Kann ich Treffer im Team bearbeiten – Merkliste, Notizen, Status?', a: 'Ja. Das Pilot-Dashboard zeigt je Treffer Auftraggeber, Leistungsort, Frist, Wert, Match-Gründe und Originalquelle und erlaubt Status und interne Notizen im Team. Für Kollegen ohne Zugang oder fürs Archiv lassen sich Treffer als JSON, CSV oder XLSX exportieren; ein signierter Webhook ist konfigurierbar.' },
]

export const TENDER_PRESETS = [
    { label: 'Fassade', value: 'fassade' },
    { label: 'Fenster', value: 'fenster' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Webdesign', value: 'website' },
    { label: 'IT', value: 'software' },
    { label: 'PR', value: 'öffentlichkeitsarbeit' },
]
