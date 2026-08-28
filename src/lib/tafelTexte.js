// Beschriftungen der Go/No-Go-Tafel, deutsch und englisch.
//
// Nur die Tafel, nicht die ganze Seite: uebersetzt wird die Flaeche, auf
// der Mensch und Agent zusammenarbeiten. Der Rest der Landingpage ist
// Marketingtext fuer den deutschen Markt und bleibt deutsch.

export const TAFEL_TEXTE = {
    de: {
        eyebrow: 'Go/No-Go',
        titel: 'Gemeinsame Vorauswahl',
        einleitung:
            'Treffer landen hier per Klick — oder über einen Agenten, der die Werkzeuge dieser Seite nutzt. Die Gründe stammen aus den Feldern der Bekanntmachung: CPV, Leistungsort, Frist, Auftragswert gegen den EU-Schwellenwert, Zuschlagskriterien, Lose. Entschieden wird von Ihnen; die Argumente sind eine Vorarbeit, keine Empfehlung.',
        leeren: 'Tafel leeren',
        leer: 'Noch nichts auf der Tafel. Legen Sie einen Treffer darauf — oder bitten Sie in einem Browser mit WebMCP Ihren Agenten darum, etwa: „Suche Fassadenausschreibungen und leg die drei mit der längsten Frist auf die Tafel."',
        auftraggeber: 'Auftraggeber',
        frist: 'Frist',
        keineFrist: 'Keine Frist genannt',
        nichtAngegeben: 'Nicht angegeben',
        go: 'Go',
        noGo: 'No-Go',
        offen: 'offen',
        original: 'Originalbekanntmachung',
        entfernen: 'Entfernen',
        bilanz: (dafuer, dagegen, neutral) => `${dafuer} dafür · ${dagegen} dagegen · ${neutral} zu prüfen`,
        aufTafel: 'Auf die Go/No-Go-Tafel',
        aufTafelSchon: 'Auf der Tafel — Gründe aktualisieren',
        quelleOeffnen: 'Quelle öffnen',
    },
    en: {
        eyebrow: 'Go/No-Go',
        titel: 'Shared shortlist',
        einleitung:
            'Tenders land here by click — or through an agent using this page’s tools. The reasons come from the fields of the notice: CPV, place of performance, deadline, contract value against the EU threshold, award criteria, lots. You decide; the arguments are groundwork, not a recommendation.',
        leeren: 'Clear board',
        leer: 'Nothing on the board yet. Put a tender on it — or, in a browser with WebMCP, ask your agent: "Search facade tenders and put the three with the longest deadlines on the board."',
        auftraggeber: 'Buyer',
        frist: 'Deadline',
        keineFrist: 'No deadline stated',
        nichtAngegeben: 'Not stated',
        go: 'Go',
        noGo: 'No-Go',
        offen: 'open',
        original: 'Original notice',
        entfernen: 'Remove',
        bilanz: (dafuer, dagegen, neutral) => `${dafuer} for · ${dagegen} against · ${neutral} to check`,
        aufTafel: 'Add to go/no-go board',
        aufTafelSchon: 'On the board — refresh reasons',
        quelleOeffnen: 'Open source',
    },
}

export const tafelTexte = (sprache) => TAFEL_TEXTE[sprache === 'en' ? 'en' : 'de']
