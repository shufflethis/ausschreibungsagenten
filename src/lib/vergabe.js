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
// Alle Texte gibt es deutsch und englisch, gesteuert ueber `sprache`
// (siehe src/lib/sprache.js). Mensch und Agent bekommen immer dieselbe
// Sprache - sie sollen dasselbe vor sich haben, nicht zwei Fassungen.
//
// Was hier NICHT passiert: eine Empfehlung. Die Funktionen liefern
// Argumente mit Vorzeichen, entschieden wird von Menschen.

import { STANDARDSPRACHE } from './sprache'

// EU-Schwellenwerte fuer 2026/2027. Dieselben Zahlen nennt die FAQ auf
// der Landingpage; sie stehen hier nur einmal, damit beide nicht
// auseinanderlaufen. Massgeblich sind immer die amtlichen Werte und die
// Vergabeunterlagen des jeweiligen Verfahrens.
export const EU_SCHWELLENWERTE = {
    zentrale_regierungsbehoerde: {
        wert: 140000,
        text: {
            de: 'Liefer- und Dienstleistungen zentraler Regierungsbehörden',
            en: 'supplies and services of central government authorities',
        },
    },
    oeffentlicher_auftraggeber: {
        wert: 216000,
        text: {
            de: 'Liefer- und Dienstleistungen anderer öffentlicher Auftraggeber',
            en: 'supplies and services of other public buyers',
        },
    },
    bauauftrag: {
        wert: 5404000,
        text: { de: 'Bauaufträge', en: 'works contracts' },
    },
}

// Die CPV-Abteilung sind die ersten beiden Stellen. Sie genuegt, um einem
// Menschen zu sagen, worum es ueberhaupt geht - die vollstaendige
// CPV-Systematik hat ueber 9.000 Eintraege und gehoert nicht ins Bundle.
const CPV_ABTEILUNGEN = {
    '09': { de: 'Erdölerzeugnisse, Brennstoffe, Strom', en: 'Petroleum products, fuel, electricity' },
    30: { de: 'Büromaschinen, Datenverarbeitungsgeräte', en: 'Office and computing machinery' },
    32: { de: 'Rundfunk-, Fernseh-, Kommunikationsgeräte', en: 'Radio, television and communication equipment' },
    34: { de: 'Fahrzeuge', en: 'Transport equipment' },
    38: { de: 'Labor-, optische und Präzisionsgeräte', en: 'Laboratory, optical and precision equipment' },
    39: { de: 'Möbel, Einrichtungsgegenstände, Reinigungsmittel', en: 'Furniture, furnishings, cleaning products' },
    42: { de: 'Maschinen und Anlagen', en: 'Industrial machinery' },
    44: { de: 'Baukonstruktionen und -materialien', en: 'Construction structures and materials' },
    45: { de: 'Bauarbeiten', en: 'Construction work' },
    48: { de: 'Softwarepakete und Informationssysteme', en: 'Software packages and information systems' },
    50: { de: 'Reparatur und Wartung', en: 'Repair and maintenance services' },
    51: { de: 'Installationsarbeiten', en: 'Installation services' },
    55: { de: 'Hotel-, Restaurant- und Einzelhandelsdienste', en: 'Hotel, restaurant and retail services' },
    60: { de: 'Transport- und Beförderungsdienste', en: 'Transport services' },
    63: { de: 'Hilfs- und Nebentätigkeiten des Transports, Reisebüros', en: 'Supporting transport services, travel agencies' },
    64: { de: 'Post- und Telekommunikationsdienste', en: 'Postal and telecommunications services' },
    66: { de: 'Finanz- und Versicherungsdienste', en: 'Financial and insurance services' },
    70: { de: 'Immobiliendienste', en: 'Real estate services' },
    71: {
        de: 'Architektur-, Bau-, Ingenieur- und Inspektionsleistungen',
        en: 'Architectural, construction, engineering and inspection services',
    },
    72: { de: 'IT-Dienste: Beratung, Software, Internet', en: 'IT services: consulting, software, internet' },
    73: { de: 'Forschung und Entwicklung', en: 'Research and development' },
    75: {
        de: 'Öffentliche Verwaltung, Verteidigung, Sozialversicherung',
        en: 'Administration, defence and social security services',
    },
    77: { de: 'Land- und forstwirtschaftliche Dienste, Gartenbau', en: 'Agricultural, forestry and horticultural services' },
    79: { de: 'Unternehmensdienste: Recht, Marketing, Beratung, Druck', en: 'Business services: legal, marketing, consulting, printing' },
    80: { de: 'Allgemeine und berufliche Bildung', en: 'Education and training services' },
    85: { de: 'Gesundheits- und Sozialwesen', en: 'Health and social work services' },
    90: { de: 'Abwasser, Abfall, Reinigung, Umweltschutz', en: 'Sewage, refuse, cleaning and environmental services' },
    92: { de: 'Erholung, Kultur, Sport', en: 'Recreational, cultural and sporting services' },
    98: { de: 'Sonstige öffentliche und persönliche Dienste', en: 'Other community, social and personal services' },
}

const sprachwahl = (sprache) => (sprache === 'en' ? 'en' : STANDARDSPRACHE)

export function cpvAbteilung(cpv, sprache) {
    const ziffern = String(cpv ?? '').replace(/\D/g, '')
    if (ziffern.length < 2) return null
    const s = sprachwahl(sprache)
    const schluessel = ziffern.slice(0, 2)
    const eintrag = CPV_ABTEILUNGEN[schluessel] ?? CPV_ABTEILUNGEN[Number(schluessel)]
    return {
        code: schluessel,
        text: eintrag ? eintrag[s] : s === 'en' ? `CPV division ${schluessel}` : `CPV-Abteilung ${schluessel}`,
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
export function schwellenwertPruefung(wertEur, art, sprache) {
    const s = sprachwahl(sprache)
    const schluessel = art && EU_SCHWELLENWERTE[art] ? art : 'oeffentlicher_auftraggeber'
    const schwelle = EU_SCHWELLENWERTE[schluessel]
    const wert = Number(wertEur)
    if (!Number.isFinite(wert) || wert <= 0) {
        return { art: schluessel, schwelle: schwelle.wert, oberhalb: null, text: schwelle.text[s] }
    }
    return { art: schluessel, schwelle: schwelle.wert, oberhalb: wert >= schwelle.wert, text: schwelle.text[s] }
}

export function artAusCpv(cpv) {
    return cpvAbteilung(cpv)?.code === '45' ? 'bauauftrag' : 'oeffentlicher_auftraggeber'
}

const euro = (wert, sprache) =>
    new Intl.NumberFormat(sprache === 'en' ? 'en-IE' : 'de-DE', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(wert)

const TEXTE = {
    de: {
        cpv: (abteilung, cpv, weitere) =>
            `${abteilung} (CPV ${cpv}${weitere ? `, ${weitere} ${weitere === 1 ? 'weiterer CPV-Code' : 'weitere CPV-Codes'}` : ''}).`,
        suchbegriffTreffer: (begriff) => `Der Suchbegriff „${begriff}" steht im Titel.`,
        suchbegriffDaneben: (begriff) =>
            `Der Suchbegriff „${begriff}" steht nicht im Titel; der Treffer kommt über CPV oder Volltext.`,
        ort: (ort) => `Leistungsort: ${ort}. Anfahrt und Bauleitung vor Ort selbst einschätzen.`,
        fristFehlt: 'Die Bekanntmachung nennt keine Angebotsfrist. Frist in den Vergabeunterlagen prüfen.',
        fristAbgelaufen: (tage) => `Die Angebotsfrist ist seit ${tage} Tagen abgelaufen.`,
        fristKnapp: (tage) => `Nur noch ${tage} Tage bis zur Frist — für ein vollständiges Angebot knapp.`,
        fristOffen: (tage) => `${tage} Tage bis zur Angebotsfrist.`,
        wertFehlt: (schwelle, art) =>
            `Kein Auftragswert veröffentlicht. Der EU-Schwellenwert für ${art} liegt bei ${schwelle}.`,
        wert: (wert, lage, schwelle, art) =>
            `Auftragswert ${wert}, ${lage} des EU-Schwellenwerts von ${schwelle} für ${art}.`,
        oberhalb: 'oberhalb',
        unterhalb: 'unterhalb',
        nurPreis: 'Zuschlag allein über den Preis — Qualität und Referenzen zählen nicht.',
        mehrKriterien: (anzahl) => `Zuschlag über ${anzahl} Kriterien, nicht nur den Preis.`,
        lose: (anzahl) => `${anzahl} Lose — eine Bewerbung auf einzelne Lose ist möglich.`,
        rahmen: 'Rahmenvereinbarung: der Zuschlag sichert Abrufe zu, keine feste Auftragsmenge.',
        gpa: 'Verfahren fällt unter das WTO-Beschaffungsübereinkommen — auch Bieter außerhalb der EU sind zugelassen.',
        score: (score) => `Vorschau-Score ${score} von 100. Ein Firmenprofil macht den Score belastbarer.`,
    },
    en: {
        cpv: (abteilung, cpv, weitere) =>
            `${abteilung} (CPV ${cpv}${weitere ? `, ${weitere} further CPV ${weitere === 1 ? 'code' : 'codes'}` : ''}).`,
        suchbegriffTreffer: (begriff) => `The search term "${begriff}" appears in the title.`,
        suchbegriffDaneben: (begriff) =>
            `The search term "${begriff}" is not in the title; this notice matched on CPV or full text.`,
        ort: (ort) => `Place of performance: ${ort}. Judge travel and on-site supervision yourself.`,
        fristFehlt: 'The notice states no bid deadline. Check the deadline in the procurement documents.',
        fristAbgelaufen: (tage) => `The bid deadline passed ${tage} days ago.`,
        fristKnapp: (tage) => `Only ${tage} days left — tight for a complete bid.`,
        fristOffen: (tage) => `${tage} days until the bid deadline.`,
        wertFehlt: (schwelle, art) =>
            `No contract value published. The EU threshold for ${art} is ${schwelle}.`,
        wert: (wert, lage, schwelle, art) =>
            `Contract value ${wert}, ${lage} the EU threshold of ${schwelle} for ${art}.`,
        oberhalb: 'at or above',
        unterhalb: 'below',
        nurPreis: 'Awarded on lowest price alone — quality and references do not count.',
        mehrKriterien: (anzahl) => `Awarded on ${anzahl} criteria, not on price alone.`,
        lose: (anzahl) => `${anzahl} lots — bidding for individual lots is possible.`,
        rahmen: 'Framework agreement: winning secures call-offs, not a fixed volume.',
        gpa: 'Covered by the WTO Government Procurement Agreement — bidders from outside the EU are admitted too.',
        score: (score) => `Preview score ${score} of 100. A company profile makes the score more reliable.`,
    },
}

// Liefert die Einzelgruende zu einer Bekanntmachung, jeder mit Vorzeichen
// ('plus', 'minus', 'neutral'), in der gewaehlten Sprache.
export function fitGruende(tender, { suchbegriff = '', jetzt = new Date(), sprache } = {}) {
    if (!tender) return []
    const s = sprachwahl(sprache)
    const t = TEXTE[s]
    const gruende = []

    const abteilung = cpvAbteilung(tender.cpv_main, s)
    if (abteilung) {
        const weitere = Array.isArray(tender.cpv_additional) ? tender.cpv_additional.length : 0
        gruende.push({ kennung: 'cpv', bewertung: 'neutral', text: t.cpv(abteilung.text, tender.cpv_main, weitere) })
    }

    const begriff = suchbegriff.trim()
    if (begriff.length >= 3) {
        const imTitel = String(tender.title ?? '').toLowerCase().includes(begriff.toLowerCase())
        gruende.push({
            kennung: 'suchbegriff',
            bewertung: imTitel ? 'plus' : 'neutral',
            text: imTitel ? t.suchbegriffTreffer(begriff) : t.suchbegriffDaneben(begriff),
        })
    }

    if (tender.performance_location) {
        gruende.push({ kennung: 'ort', bewertung: 'neutral', text: t.ort(tender.performance_location) })
    }

    const tage = tageBisFrist(tender.deadline_at, jetzt)
    if (tage === null) {
        gruende.push({ kennung: 'frist', bewertung: 'neutral', text: t.fristFehlt })
    } else if (tage < 0) {
        gruende.push({ kennung: 'frist', bewertung: 'minus', text: t.fristAbgelaufen(Math.abs(tage)) })
    } else if (tage <= 13) {
        gruende.push({ kennung: 'frist', bewertung: 'minus', text: t.fristKnapp(tage) })
    } else {
        gruende.push({ kennung: 'frist', bewertung: tage >= 21 ? 'plus' : 'neutral', text: t.fristOffen(tage) })
    }

    const pruefung = schwellenwertPruefung(tender.estimated_value_eur, artAusCpv(tender.cpv_main), s)
    if (pruefung.oberhalb === null) {
        gruende.push({
            kennung: 'wert',
            bewertung: 'neutral',
            text: t.wertFehlt(euro(pruefung.schwelle, s), pruefung.text),
        })
    } else {
        gruende.push({
            kennung: 'wert',
            bewertung: 'neutral',
            text: t.wert(
                euro(Number(tender.estimated_value_eur), s),
                pruefung.oberhalb ? t.oberhalb : t.unterhalb,
                euro(pruefung.schwelle, s),
                pruefung.text,
            ),
        })
    }

    const kriterien = Array.isArray(tender.award_criteria) ? tender.award_criteria : []
    if (kriterien.length > 0) {
        const nurPreis = kriterien.every((kriterium) => kriterium?.type === 'price')
        gruende.push({
            kennung: 'zuschlag',
            bewertung: nurPreis ? 'minus' : 'plus',
            text: nurPreis ? t.nurPreis : t.mehrKriterien(kriterien.length),
        })
    }

    const lose = Number(tender.lot_count)
    if (Number.isFinite(lose) && lose > 1) {
        gruende.push({ kennung: 'lose', bewertung: 'plus', text: t.lose(lose) })
    }

    if (tender.framework_agreement && tender.framework_agreement !== 'none') {
        gruende.push({ kennung: 'rahmen', bewertung: 'neutral', text: t.rahmen })
    }

    if (tender.gpa_covered) {
        gruende.push({ kennung: 'gpa', bewertung: 'neutral', text: t.gpa })
    }

    const score = Number(tender.relevance_score)
    if (Number.isFinite(score)) {
        gruende.push({
            kennung: 'score',
            bewertung: 'neutral',
            text: t.score(score),
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

export const GEWERKE = [
    { value: '', label: 'Alle Gewerke' },
    { value: 'facade_construction', label: 'Fenster, Fassade & Metallbau' },
    { value: 'planning', label: 'Architektur & Planung' },
    { value: 'marketing', label: 'Marketing & Digital' },
]

const NACHWEISE = {
    references: 'Vergleichbare Referenzen', turnover: 'Umsatznachweis', insurance: 'Haftpflichtversicherung',
    certificate: 'Zertifikate', prequalification: 'Präqualifikation', tax: 'Steuerliche Nachweise',
    social_security: 'Sozialversicherungsnachweise', trade_register: 'Registerauszug',
    personnel: 'Personalqualifikation', self_declaration: 'Eigenerklärung',
    tariff_compliance: 'Tariftreue', subcontractor: 'Nachunternehmer', consortium: 'Bietergemeinschaft', bond: 'Bürgschaft',
}

export function quellenUrl(value) {
    try {
        const url = new URL(value)
        return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null
    } catch { return null }
}

export function fristText(tender) {
    const details = Array.isArray(tender.deadline_details) ? tender.deadline_details : []
    const detail = details.find((item) => ['submission', 'participation', 'interest', 'questions', 'unspecified'].includes(item.kind)
        && new Date(item.at).getTime() === new Date(tender.deadline_at).getTime())
    const date = new Date(tender.deadline_at)
    if (!tender.deadline_at || Number.isNaN(date.getTime())) return 'Frist noch ungeklärt'
    const label = { submission: 'Angebot', participation: 'Teilnahme', interest: 'Interesse', questions: 'Bieterfragen' }[detail?.kind] || 'Portalfrist'
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Berlin' }
    if (detail?.precision === 'datetime') Object.assign(options, { hour: '2-digit', minute: '2-digit' })
    const displayDate = detail?.precision === 'date' ? new Date(`${detail.at.slice(0, 10)}T12:00:00Z`) : date
    return `${label}: ${new Intl.DateTimeFormat('de-DE', options).format(displayDate)}${detail?.precision === 'datetime' ? ' Uhr (Berlin)' : ' · Uhrzeit prüfen'}`
}

// Vorprüfung gegen ausdrücklich gewählte Suchkriterien. Eine vorhandene CPV
// oder ein Index-Score ist kein Beleg für die Eignung eines Unternehmens.
export function entscheidungshilfe(tender, { search = '', vertical = '', exclusions = '', minimumDays = 0 } = {}, jetzt = new Date()) {
    const passend = [], ausschluss = [], offen = []
    const text = `${tender.title || ''} ${tender.description || ''}`.toLocaleLowerCase('de')
    const begriff = search.trim().toLocaleLowerCase('de')
    if (begriff && text.includes(begriff)) passend.push({ text: `Ihre Leistung „${search.trim()}“ wird genannt.`, beleg: tender.title.toLocaleLowerCase('de').includes(begriff) ? tender.title : tender.description, feld: 'Leistungsbeschreibung' })
    else if (begriff) offen.push({ text: 'Leistungsumfang im Original mit Ihrer Suche abgleichen.', feld: 'Leistungsbeschreibung' })
    if (vertical && tender.verticals?.includes(vertical)) passend.push({ text: `${GEWERKE.find((g) => g.value === vertical)?.label}: passende Quellenklassifikation.`, beleg: `CPV ${[tender.cpv_main, ...(tender.cpv_additional || [])].filter(Boolean).join(', ')}`, feld: 'Klassifikation' })
    for (const wort of exclusions.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 10)) {
        if (text.includes(wort.toLocaleLowerCase('de'))) ausschluss.push({ text: `Ihr Ausschlussbegriff „${wort}“ ist enthalten.`, beleg: (tender.title || '').toLocaleLowerCase('de').includes(wort.toLocaleLowerCase('de')) ? tender.title : tender.description, feld: 'Leistungsbeschreibung' })
    }
    const tage = tageBisFrist(tender.deadline_at, jetzt)
    if (tender.deadline_at && new Date(tender.deadline_at) < jetzt) ausschluss.push({ text: 'Die gespeicherte Verfahrensfrist ist abgelaufen.', beleg: fristText(tender), feld: 'Frist' })
    else if (tage === null) offen.push({ text: 'Frist und Offenheit des Verfahrens sind noch ungeklärt.', feld: 'Frist' })
    else if (minimumDays > 0 && tage < minimumDays) ausschluss.push({ text: `Weniger als Ihre ${minimumDays} Tage Mindestvorlauf.`, beleg: fristText(tender), feld: 'Frist' })
    else offen.push({ text: `${fristText(tender)}. Aktuellen Stand im Original prüfen.`, feld: 'Frist' })
    if (!tender.performance_location && !tender.performance_nuts?.length) offen.push({ text: 'Leistungsort ist nicht angegeben.', feld: 'Leistungsort' })
    if (tender.estimated_value_eur == null) offen.push({ text: 'Auftragswert ist nicht veröffentlicht.', feld: 'Auftragswert' })
    const nachweise = (Array.isArray(tender.requirements) ? tender.requirements : [])
        .filter((r) => r && NACHWEISE[r.type] && typeof r.evidence === 'string' && r.evidence.trim())
        .map((r) => ({ type: r.type, text: NACHWEISE[r.type], beleg: r.evidence, feld: 'Eignungsanforderungen' }))
    if (!nachweise.length) offen.push({ text: 'Eignungsnachweise sind im Kurztext nicht belegt. Vergabeunterlagen prüfen.', feld: 'Eignungsanforderungen' })
    return { passend, ausschluss, offen, nachweise }
}
