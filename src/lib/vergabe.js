// Fachlogik fuer die Go/No-Go-Bewertung einer Bekanntmachung.
//
// Bewusst ohne DOM und ohne Netz: die Trefferliste von
// /api/tenders-public bringt weit mehr Felder mit, als die Karte auf der
// Seite anzeigt (CPV, Leistungsort, Lose, Zuschlagskriterien,
// Rahmenvereinbarung, GPA). Daraus laesst sich die Einschaetzung
// vollstaendig im Browser herleiten - der Agent bekommt Gruende statt
// einer nackten Zahl, und der Mensch sieht dieselben Gruende auf dem
// Bildschirm.
//
// Was hier NICHT passiert: eine Empfehlung. Die Funktionen liefern
// Argumente mit Vorzeichen, entschieden wird von Menschen.

// EU-Schwellenwerte fuer 2026/2027. Dieselben Zahlen nennt die FAQ auf
// der Landingpage; sie stehen hier nur einmal, damit beide nicht
// auseinanderlaufen. Massgeblich sind immer die amtlichen Werte und die
// Vergabeunterlagen des jeweiligen Verfahrens.
export const EU_SCHWELLENWERTE = {
    zentrale_regierungsbehoerde: {
        wert: 140000,
        text: 'Liefer- und Dienstleistungen zentraler Regierungsbehörden',
    },
    oeffentlicher_auftraggeber: {
        wert: 216000,
        text: 'Liefer- und Dienstleistungen anderer öffentlicher Auftraggeber',
    },
    bauauftrag: {
        wert: 5404000,
        text: 'Bauaufträge',
    },
}

// Die CPV-Abteilung sind die ersten beiden Stellen. Sie genuegt, um einem
// Menschen zu sagen, worum es ueberhaupt geht - die vollstaendige
// CPV-Systematik hat ueber 9.000 Eintraege und gehoert nicht ins Bundle.
const CPV_ABTEILUNGEN = {
    '09': 'Erdölerzeugnisse, Brennstoffe, Strom',
    30: 'Büromaschinen, Datenverarbeitungsgeräte',
    32: 'Rundfunk-, Fernseh-, Kommunikationsgeräte',
    34: 'Fahrzeuge',
    38: 'Labor-, optische und Präzisionsgeräte',
    39: 'Möbel, Einrichtungsgegenstände, Reinigungsmittel',
    42: 'Maschinen und Anlagen',
    44: 'Baukonstruktionen und -materialien',
    45: 'Bauarbeiten',
    48: 'Softwarepakete und Informationssysteme',
    50: 'Reparatur und Wartung',
    51: 'Installationsarbeiten',
    55: 'Hotel-, Restaurant- und Einzelhandelsdienste',
    60: 'Transport- und Beförderungsdienste',
    63: 'Hilfs- und Nebentätigkeiten des Transports, Reisebüros',
    64: 'Post- und Telekommunikationsdienste',
    66: 'Finanz- und Versicherungsdienste',
    70: 'Immobiliendienste',
    71: 'Architektur-, Bau-, Ingenieur- und Inspektionsleistungen',
    72: 'IT-Dienste: Beratung, Software, Internet',
    73: 'Forschung und Entwicklung',
    75: 'Öffentliche Verwaltung, Verteidigung, Sozialversicherung',
    77: 'Land- und forstwirtschaftliche Dienste, Gartenbau',
    79: 'Unternehmensdienste: Recht, Marketing, Beratung, Druck',
    80: 'Allgemeine und berufliche Bildung',
    85: 'Gesundheits- und Sozialwesen',
    90: 'Abwasser, Abfall, Reinigung, Umweltschutz',
    92: 'Erholung, Kultur, Sport',
    98: 'Sonstige öffentliche und persönliche Dienste',
}

export function cpvAbteilung(cpv) {
    const ziffern = String(cpv ?? '').replace(/\D/g, '')
    if (ziffern.length < 2) return null
    const schluessel = ziffern.slice(0, 2)
    return {
        code: schluessel,
        text: CPV_ABTEILUNGEN[schluessel] ?? CPV_ABTEILUNGEN[Number(schluessel)] ?? `CPV-Abteilung ${schluessel}`,
    }
}

// Volle Tage bis zur Frist. Negativ heisst abgelaufen, null heisst: die
// Bekanntmachung nennt keine Frist. Beides ist ein Unterschied, den eine
// Zahl allein nicht traegt - deshalb kein 0 als Ersatzwert.
export function tageBisFrist(frist, jetzt = new Date()) {
    if (!frist) return null
    const ziel = new Date(frist)
    if (Number.isNaN(ziel.getTime())) return null
    return Math.floor((ziel.getTime() - jetzt.getTime()) / 86400000)
}

// Ordnet einen Auftragswert dem passenden EU-Schwellenwert zu. `art` ist
// entweder ein Schluessel aus EU_SCHWELLENWERTE oder wird aus der
// CPV-Abteilung abgeleitet: 45 sind Bauarbeiten.
export function schwellenwertPruefung(wertEur, art) {
    const schluessel = art && EU_SCHWELLENWERTE[art] ? art : 'oeffentlicher_auftraggeber'
    const schwelle = EU_SCHWELLENWERTE[schluessel]
    const wert = Number(wertEur)
    if (!Number.isFinite(wert) || wert <= 0) {
        return { art: schluessel, schwelle: schwelle.wert, oberhalb: null, text: schwelle.text }
    }
    return { art: schluessel, schwelle: schwelle.wert, oberhalb: wert >= schwelle.wert, text: schwelle.text }
}

export function artAusCpv(cpv) {
    return cpvAbteilung(cpv)?.code === '45' ? 'bauauftrag' : 'oeffentlicher_auftraggeber'
}

const euro = (wert) =>
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(wert)

// Liefert die Einzelgruende zu einer Bekanntmachung, jeder mit Vorzeichen
// ('plus', 'minus', 'neutral'). Die Texte sind deutsch, weil sie
// unveraendert auf der Seite erscheinen.
export function fitGruende(tender, { suchbegriff = '', jetzt = new Date() } = {}) {
    if (!tender) return []
    const gruende = []

    const abteilung = cpvAbteilung(tender.cpv_main)
    if (abteilung) {
        const weitere = Array.isArray(tender.cpv_additional) ? tender.cpv_additional.length : 0
        gruende.push({
            kennung: 'cpv',
            bewertung: 'plus',
            text: `${abteilung.text} (CPV ${tender.cpv_main}${weitere ? `, ${weitere} weitere CPV-Codes` : ''}).`,
        })
    }

    const begriff = suchbegriff.trim().toLowerCase()
    if (begriff.length >= 3) {
        const imTitel = String(tender.title ?? '').toLowerCase().includes(begriff)
        gruende.push({
            kennung: 'suchbegriff',
            bewertung: imTitel ? 'plus' : 'neutral',
            text: imTitel
                ? `Der Suchbegriff „${suchbegriff}" steht im Titel.`
                : `Der Suchbegriff „${suchbegriff}" steht nicht im Titel; der Treffer kommt über CPV oder Volltext.`,
        })
    }

    if (tender.performance_location) {
        gruende.push({
            kennung: 'ort',
            bewertung: 'neutral',
            text: `Leistungsort: ${tender.performance_location}. Anfahrt und Bauleitung vor Ort selbst einschätzen.`,
        })
    }

    const tage = tageBisFrist(tender.deadline_at, jetzt)
    if (tage === null) {
        gruende.push({
            kennung: 'frist',
            bewertung: 'neutral',
            text: 'Die Bekanntmachung nennt keine Angebotsfrist. Frist in den Vergabeunterlagen prüfen.',
        })
    } else if (tage < 0) {
        gruende.push({ kennung: 'frist', bewertung: 'minus', text: `Die Angebotsfrist ist seit ${Math.abs(tage)} Tagen abgelaufen.` })
    } else if (tage <= 13) {
        gruende.push({
            kennung: 'frist',
            bewertung: 'minus',
            text: `Nur noch ${tage} Tage bis zur Frist — für ein vollständiges Angebot knapp.`,
        })
    } else {
        gruende.push({
            kennung: 'frist',
            bewertung: tage >= 21 ? 'plus' : 'neutral',
            text: `${tage} Tage bis zur Angebotsfrist.`,
        })
    }

    const art = artAusCpv(tender.cpv_main)
    const pruefung = schwellenwertPruefung(tender.estimated_value_eur, art)
    if (pruefung.oberhalb === null) {
        gruende.push({
            kennung: 'wert',
            bewertung: 'neutral',
            text: `Kein Auftragswert veröffentlicht. Der EU-Schwellenwert für ${pruefung.text} liegt bei ${euro(pruefung.schwelle)}.`,
        })
    } else {
        gruende.push({
            kennung: 'wert',
            bewertung: 'neutral',
            text: `Auftragswert ${euro(Number(tender.estimated_value_eur))}, ${
                pruefung.oberhalb ? 'oberhalb' : 'unterhalb'
            } des EU-Schwellenwerts von ${euro(pruefung.schwelle)} für ${pruefung.text}.`,
        })
    }

    const kriterien = Array.isArray(tender.award_criteria) ? tender.award_criteria : []
    if (kriterien.length > 0) {
        const nurPreis = kriterien.every((kriterium) => kriterium?.type === 'price')
        gruende.push({
            kennung: 'zuschlag',
            bewertung: nurPreis ? 'minus' : 'plus',
            text: nurPreis
                ? 'Zuschlag allein über den Preis — Qualität und Referenzen zählen nicht.'
                : `Zuschlag über ${kriterien.length} Kriterien, nicht nur den Preis.`,
        })
    }

    const lose = Number(tender.lot_count)
    if (Number.isFinite(lose) && lose > 1) {
        gruende.push({
            kennung: 'lose',
            bewertung: 'plus',
            text: `${lose} Lose — eine Bewerbung auf einzelne Lose ist möglich.`,
        })
    }

    if (tender.framework_agreement && tender.framework_agreement !== 'none') {
        gruende.push({
            kennung: 'rahmen',
            bewertung: 'neutral',
            text: 'Rahmenvereinbarung: der Zuschlag sichert Abrufe zu, keine feste Auftragsmenge.',
        })
    }

    if (tender.gpa_covered) {
        gruende.push({
            kennung: 'gpa',
            bewertung: 'neutral',
            text: 'Verfahren fällt unter das WTO-Beschaffungsübereinkommen — auch Bieter außerhalb der EU sind zugelassen.',
        })
    }

    const score = Number(tender.relevance_score)
    if (Number.isFinite(score)) {
        gruende.push({
            kennung: 'score',
            bewertung: score >= 75 ? 'plus' : score >= 55 ? 'neutral' : 'minus',
            text: `Vorschau-Score ${score} von 100. Ein Firmenprofil macht den Score belastbarer.`,
        })
    }

    return gruende
}

// Kurzfassung fuer Badge und Agentenantwort: wie viele Argumente sprechen
// dafuer, wie viele dagegen. Ausdruecklich keine Empfehlung.
export function gruendeBilanz(gruende) {
    const liste = Array.isArray(gruende) ? gruende : []
    return {
        dafuer: liste.filter((grund) => grund.bewertung === 'plus').length,
        dagegen: liste.filter((grund) => grund.bewertung === 'minus').length,
        neutral: liste.filter((grund) => grund.bewertung === 'neutral').length,
    }
}
