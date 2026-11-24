import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { trackEvent } from '../lib/tracking'
import {
    baueIcsKalender,
    BRANCHEN,
    BUNDESLAENDER,
    FOERDER_STAND,
    formatDatumDE,
    formatEUR,
    GROESSEN,
    matchFoerderprogramme,
    sammleFristen,
    VORHABEN,
} from '../data/foerderprogramme'

const STANDARD_EINGABE = {
    industry: 'it',
    stateCode: 'BY',
    size: 'small',
    goals: ['ausschreibungen', 'ki_hardware'],
    budget: 40000,
    financing: 'equity',
}

const PLANER_FAQS = [
    {
        frage: 'Ist der Auftrags- & Förder-Planer 2027 kostenlos und ohne Login nutzbar?',
        antwort:
            'Ja. Die fünf Fragen, die Auswahl aktiver Fördertöpfe 2026/2027, Live-Ausschreibungsbeispiele aus 18 Quellen sowie der Export Ihres .ics-Fristenkalenders funktionieren direkt im Browser ohne Registrierung.',
    },
    {
        frage: 'Warum weist der Planer auch ausgelaufene Förderprogramme aus?',
        antwort:
            'Viele Übersichten im Netz empfehlen noch beendete Programme wie Digitalbonus Niedersachsen, DIGI-Zuschuss Hessen, Digitalprämie Berlin oder den am 16.11.2026 geschlossenen Hamburg Digital Check. Wir kennzeichnen geschlossene Töpfe offen und zeigen die aktiven Alternativen.',
    },
    {
        frage: 'Was bedeutet die Vorhabenbeginn-Sperre vor dem Hardware-Kauf?',
        antwort:
            'Bei Zuschussprogrammen (z. B. Digitalbonus Bayern, BIG-Digital, DKU Schleswig-Holstein, BAFA) dürfen Sie Hardware oder Verträge erst nach Antragstellung bzw. Bewilligung verbindlich bestellen. Unverbindliche Vergleichsangebote einzuholen ist vorab zulässig.',
    },
    {
        frage: 'Ersetzt der Planer eine Steuer- oder Rechtsberatung?',
        antwort:
            'Nein. Alle Angaben sind eine redaktionell geprüfte Orientierungshilfe (Stand 24. November 2026). Verbindlich sind stets die Richtlinien der zuständigen Förderbank, die Originalbekanntmachung sowie die Abstimmung mit Ihrer Steuerberatung.',
    },
]

export default function FoerderPlaner() {
    const [schritt, setSchritt] = useState(0)
    const [zeigeErgebnis, setZeigeErgebnis] = useState(false)
    const [eingabe, setEingabe] = useState(STANDARD_EINGABE)
    const [tenders, setTenders] = useState([])
    const [tendersLaedt, setTendersLaedt] = useState(false)
    const [hinweis, setHinweis] = useState('')

    // Opt-in an den bestehenden same-origin Endpoint /api/profile-lead
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [optinStatus, setOptinStatus] = useState('idle')
    const [optinText, setOptinText] = useState('')

    useEffect(() => {
        if (typeof window === 'undefined') return
        if (window.location.hash.startsWith('#plan=')) {
            try {
                const geladen = JSON.parse(atob(decodeURIComponent(window.location.hash.slice(6))))
                if (geladen?.industry && geladen?.stateCode && geladen?.size) {
                    setEingabe({ ...STANDARD_EINGABE, ...geladen })
                    setZeigeErgebnis(true)
                }
            } catch {
                // Ungueltigen Hash ignorieren
            }
        }
    }, [])

    const branche = useMemo(() => BRANCHEN.find((b) => b.id === eingabe.industry) || BRANCHEN[0], [eingabe.industry])
    const land = useMemo(() => BUNDESLAENDER.find((l) => l.code === eingabe.stateCode) || BUNDESLAENDER[0], [eingabe.stateCode])
    const groesse = useMemo(() => GROESSEN.find((g) => g.id === eingabe.size) || GROESSEN[1], [eingabe.size])

    const ergebnis = useMemo(() => matchFoerderprogramme(eingabe), [eingabe])
    const fristen = useMemo(() => sammleFristen(ergebnis.open, ergebnis.watch, tenders), [ergebnis.open, ergebnis.watch, tenders])

    useEffect(() => {
        if (!zeigeErgebnis) return
        let abgebrochen = false
        setTendersLaedt(true)
        const qs = new URLSearchParams({
            country: 'DEU',
            search: branche.search,
            min_score: '0',
            limit: '4',
        })
        fetch(`/api/tenders-public?${qs.toString()}`)
            .then((r) => (r.ok ? r.json() : []))
            .then((daten) => {
                if (abgebrochen) return
                const liste = Array.isArray(daten) ? daten : daten?.items || daten?.tenders || []
                setTenders(liste.slice(0, 4))
            })
            .catch(() => {
                if (!abgebrochen) setTenders([])
            })
            .finally(() => {
                if (!abgebrochen) setTendersLaedt(false)
            })
        return () => {
            abgebrochen = true
        }
    }, [zeigeErgebnis, branche])

    function planErzeugen() {
        if (typeof window !== 'undefined') {
            const hash = encodeURIComponent(btoa(JSON.stringify(eingabe)))
            window.history.replaceState(null, '', `#plan=${hash}`)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
        trackEvent('Foerderplaner-Ergebnis', { land: eingabe.stateCode, branche: eingabe.industry })
        setZeigeErgebnis(true)
    }

    function teilenLinkKopieren() {
        if (typeof window === 'undefined') return
        const hash = encodeURIComponent(btoa(JSON.stringify(eingabe)))
        const url = `${window.location.origin}${window.location.pathname}#plan=${hash}`
        navigator.clipboard?.writeText(url).then(
            () => setHinweis('Share-Link kopiert — ideal zum Weiterleiten an Geschäftsführung oder Steuerberatung.'),
            () => setHinweis(`Link zum Kopieren: ${url}`),
        )
        trackEvent('Foerderplaner-Geteilt', { land: eingabe.stateCode })
    }

    function icsHerunterladen() {
        const ics = baueIcsKalender(fristen)
        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `Ausschreibungsagenten-Fristenkalender-2027-${eingabe.stateCode}.ics`
        document.body.appendChild(a)
        a.click()
        a.remove()
        setHinweis('Ihr persönlicher .ics-Fristenkalender 2027 (inkl. 14-Tage- & 3-Tage-Erinnerung) wurde heruntergeladen.')
        trackEvent('Foerderplaner-ICS-Export', { land: eingabe.stateCode, anzahl: fristen.length })
    }

    async function handleAlertSubmit(ev) {
        ev.preventDefault()
        if (!email.trim()) return
        setOptinStatus('sending')
        setOptinText('')
        try {
            const payload = {
                email: email.trim(),
                company: company.trim() || `${branche.label} (${land.name})`,
                industry: branche.label,
                region: `${land.name} (${land.nuts})`,
                budget: `${formatEUR(eingabe.budget)} (${eingabe.financing === 'loan' ? 'Förderkredit' : 'Eigenmittel'})`,
                frequency: 'Fristen- & Förder-Alert 2027',
                services: [
                    `Auftrags- & Förder-Planer 2027 (Stand ${FOERDER_STAND})`,
                    `Unternehmensgröße: ${groesse.label}`,
                    `Vorhaben: ${eingabe.goals.join(', ')}`,
                    `CPV: ${branche.cpv.join(', ')}`,
                    `Aktive Töpfe: ${ergebnis.open.map((p) => p.name).join(' | ')}`,
                ].join('\n'),
            }
            const res = await fetch('/api/profile-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) throw new Error(data.error || 'Anfrage konnte nicht gesendet werden.')
            setOptinStatus('ok')
            setOptinText(`Vielen Dank! Ihr 2027-Profil & Fristen-Alert für ${email} ist eingegangen. Wir richten den kostenfreien Pilotzugang ein.`)
            trackEvent('Foerderplaner-Alert-Gesendet', { land: eingabe.stateCode })
        } catch (err) {
            setOptinStatus('error')
            setOptinText(err?.message || 'Versand fehlgeschlagen — schreiben Sie uns kurz an hi@ausschreibungsagenten.de.')
        }
    }

    const bestesLandesprogramm = ergebnis.open.find((p) => p.level === 'land' && p.type === 'grant')
    const landeszuschussHw = bestesLandesprogramm?.hardware_eligible ? bestesLandesprogramm.estimated_eur : 0
    const nettoBasis = Math.max(0, eingabe.budget - landeszuschussHw)
    const afaJahr1 = Math.round(nettoBasis * 0.3)
    const fzQuote = eingabe.size === 'large' ? 25 : 35
    const bafa = ergebnis.open.find((p) => p.id === 'bund-bafa-beratung')
    const booster = ergebnis.open.find((p) => p.id === 'bund-investitionsbooster')
    const gesamtPotenzial =
        (bestesLandesprogramm?.estimated_eur || 0) + (bafa?.estimated_eur || 0) + (booster?.estimated_eur || 0)

    return (
        <>
            <Seo path="/foerder-und-auftrags-planer" faq={PLANER_FAQS} />

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Interaktiver Fahrplan · Stand {FOERDER_STAND} · Kostenfrei
                    </span>
                    <h1 className="section__title">
                        Auftrags- &amp; Förder-Planer 2027:{' '}
                        <span className="gradient-text">Neue Aufträge &amp; Fördergeld kombinieren</span>
                    </h1>
                    <p className="section__subtitle">
                        Beantworten Sie fünf Fragen zu Branche, Bundesland, Firmengröße, Vorhaben und Budget. Sie erhalten
                        sofort passende Live-Ausschreibungen aus 18 Quellen, verifizierte Fördertöpfe 2026/2027 mit
                        ehrlicher Status-Ampel, einen Hardware- &amp; Investitionsbooster-Check sowie Ihren persönlichen
                        .ics-Fristenkalender.
                    </p>

                    {!zeigeErgebnis ? (
                        <div className="glass-card planer-karte" style={{ marginTop: '2rem' }}>
                            <div className="planer-kopf">
                                <div className="planer-fortschritt" role="tablist" aria-label="Fortschritt">
                                    {[0, 1, 2, 3, 4].map((idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            className={`planer-balken ${idx < schritt ? 'is-done' : idx === schritt ? 'is-active' : ''}`}
                                            onClick={() => setSchritt(idx)}
                                            aria-label={`Zu Frage ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                                <span className="planer-zaehler">Frage {schritt + 1} von 5</span>
                            </div>

                            {schritt === 0 && (
                                <div>
                                    <h2>1. In welcher Branche bzw. welchem Gewerk arbeiten Sie?</h2>
                                    <p className="field-hint">Bestimmt Ihre CPV-Hauptgruppe für das Live-Matching aus 18 Vergabequellen.</p>
                                    <div className="planer-grid">
                                        {BRANCHEN.map((b) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                className={`planer-option ${eingabe.industry === b.id ? 'is-selected' : ''}`}
                                                onClick={() => setEingabe({ ...eingabe, industry: b.id })}
                                            >
                                                <strong>{b.label}</strong>
                                                <span>{b.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {schritt === 1 && (
                                <div>
                                    <h2>2. In welchem Bundesland sitzt Ihre Betriebsstätte?</h2>
                                    <p className="field-hint">Entscheidend für Landes-Zuschüsse, BAFA-Quote (50 % vs. 80 %) und regionale Vergaben.</p>
                                    <div className="planer-grid planer-grid--laender">
                                        {BUNDESLAENDER.map((l) => (
                                            <button
                                                key={l.code}
                                                type="button"
                                                className={`planer-option ${eingabe.stateCode === l.code ? 'is-selected' : ''}`}
                                                onClick={() => setEingabe({ ...eingabe, stateCode: l.code })}
                                            >
                                                <strong>{l.name}</strong>
                                                <span>{l.hint}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {schritt === 2 && (
                                <div>
                                    <h2>3. Wie groß ist Ihr Unternehmen?</h2>
                                    <p className="field-hint">Steuert exakte KMU-Quoten bei Forschungszulage (35 %), QCG (bis 100 %), DKU und Digitalbonus.</p>
                                    <div className="planer-grid">
                                        {GROESSEN.map((g) => (
                                            <button
                                                key={g.id}
                                                type="button"
                                                className={`planer-option ${eingabe.size === g.id ? 'is-selected' : ''}`}
                                                onClick={() => setEingabe({ ...eingabe, size: g.id })}
                                            >
                                                <strong>{g.label}</strong>
                                                <span>{g.sub}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {schritt === 3 && (
                                <div>
                                    <h2>4. Was sind Ihre wichtigsten Vorhaben 2027? (Mehrfachwahl)</h2>
                                    <p className="field-hint">Kombiniert öffentliche Aufträge mit KI-Hardware, Software, Weiterbildung oder Beratung.</p>
                                    <div className="planer-grid">
                                        {VORHABEN.map((v) => {
                                            const aktiv = eingabe.goals.includes(v.id)
                                            return (
                                                <button
                                                    key={v.id}
                                                    type="button"
                                                    className={`planer-option ${aktiv ? 'is-selected' : ''}`}
                                                    onClick={() => {
                                                        const neu = aktiv
                                                            ? eingabe.goals.length > 1
                                                                ? eingabe.goals.filter((x) => x !== v.id)
                                                                : eingabe.goals
                                                            : [...eingabe.goals, v.id]
                                                        setEingabe({ ...eingabe, goals: neu })
                                                    }}
                                                >
                                                    <strong>{aktiv ? '✓ ' : ''}{v.label}</strong>
                                                    <span>{v.sub}</span>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {schritt === 4 && (
                                <div>
                                    <h2>5. Welches Investitionsbudget &amp; welchen Eigenanteil planen Sie 2027?</h2>
                                    <p className="field-hint">Unverbindliche Grundlage für Zuschuss-, AfA- und Förderkredit-Orientierung.</p>
                                    <div className="planer-budget">
                                        <div className="planer-budget__zeile">
                                            <span>Geplantes Volumen (Hardware, Software, Beratung):</span>
                                            <strong className="planer-budget__wert">{formatEUR(eingabe.budget)}</strong>
                                        </div>
                                        <input
                                            type="range"
                                            min={5000}
                                            max={300000}
                                            step={5000}
                                            value={eingabe.budget}
                                            aria-label="Geplantes Investitionsbudget 2027 in Euro"
                                            onChange={(e) => setEingabe({ ...eingabe, budget: Number(e.target.value) })}
                                            style={{ width: '100%', marginTop: '0.75rem', accentColor: '#3b82f6' }}
                                        />
                                        <div className="planer-grid" style={{ marginTop: '1rem' }}>
                                            {[
                                                { id: 'equity', label: 'Eigenmittel vorhanden', sub: 'Fokus auf Direktzuschuss, Forschungszulage & AfA' },
                                                { id: 'loan', label: 'Förderkredit / Liquidität schonen', sub: 'Bindet zusätzlich KfW 511/512 & L-Bank ein' },
                                            ].map((m) => (
                                                <button
                                                    key={m.id}
                                                    type="button"
                                                    className={`planer-option ${eingabe.financing === m.id ? 'is-selected' : ''}`}
                                                    onClick={() => setEingabe({ ...eingabe, financing: m.id })}
                                                >
                                                    <strong>{m.label}</strong>
                                                    <span>{m.sub}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="planer-fuss">
                                <button
                                    type="button"
                                    className="btn btn--secondary"
                                    disabled={schritt === 0}
                                    onClick={() => setSchritt((s) => Math.max(0, s - 1))}
                                >
                                    ← Zurück
                                </button>
                                <button
                                    type="button"
                                    className="btn btn--primary"
                                    onClick={() => (schritt < 4 ? setSchritt((s) => s + 1) : planErzeugen())}
                                >
                                    {schritt < 4 ? 'Weiter →' : '2027-Fahrplan erstellen →'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="planer-ergebnis" style={{ marginTop: '2rem' }} aria-live="polite">
                            <div className="glass-card planer-toolbar">
                                <div>
                                    <span className="badge badge--yes">Ihr persönlicher 2027-Fahrplan</span>
                                    <h2 style={{ marginTop: '0.5rem' }}>
                                        {branche.label} in {land.name}
                                    </h2>
                                    <p className="field-hint">
                                        {groesse.label} · Budget {formatEUR(eingabe.budget)} · {ergebnis.open.length} aktive
                                        Fördertöpfe · Orientierungswert {formatEUR(Math.max(gesamtPotenzial, 1750))}
                                    </p>
                                </div>
                                <div className="planer-aktionen">
                                    <button type="button" className="btn btn--secondary" onClick={() => setZeigeErgebnis(false)}>
                                        Angaben anpassen
                                    </button>
                                    <button type="button" className="btn btn--secondary" onClick={teilenLinkKopieren}>
                                        Link für GF / StB teilen
                                    </button>
                                    <button type="button" className="btn btn--primary" onClick={icsHerunterladen}>
                                        Fristenkalender (.ics)
                                    </button>
                                </div>
                            </div>

                            {hinweis ? <p className="planer-toast">{hinweis}</p> : null}

                            {/* Block 1: Live-Ausschreibungen */}
                            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                                <span className="section__label">1 · Zuerst neue Aufträge</span>
                                <h2>Passende Live-Ausschreibungen aus 18 Quellen</h2>
                                <p className="field-hint">
                                    Vorauswahl für {branche.label} (CPV {branche.cpv.join(', ')}). Jeder Treffer verlinkt
                                    direkt auf die kostenlose Originalbekanntmachung.
                                </p>
                                {tendersLaedt ? (
                                    <p style={{ marginTop: '1rem' }}>Lade aktuelle Verfahren aus 18 Live-Quellen …</p>
                                ) : tenders.length === 0 ? (
                                    <p style={{ marginTop: '1rem' }}>
                                        Gerade keine exakten Kurztreffer geladen — über den{' '}
                                        <a href={`/?q=${encodeURIComponent(branche.search)}#ergebnisse`}>
                                            Live-Suchfilter auf der Startseite
                                        </a>{' '}
                                        oder den Fristen-Alert unten erhalten Sie laufende Treffer.
                                    </p>
                                ) : (
                                    <div className="planer-grid" style={{ marginTop: '1rem' }}>
                                        {tenders.map((t) => (
                                            <article key={t.id} className="planer-treffer">
                                                <div className="planer-treffer__meta">
                                                    <span className="badge badge--yes">{String(t.source || 'LIVE').toUpperCase()}</span>
                                                    {t.cpv_main ? <span className="badge badge--partial">CPV {t.cpv_main}</span> : null}
                                                    {t.deadline_at ? <span className="badge">Frist {formatDatumDE(t.deadline_at)}</span> : null}
                                                </div>
                                                <h3>{t.title}</h3>
                                                <p className="field-hint">{t.buyer_name || 'Öffentlicher Auftraggeber'}</p>
                                                <a href={t.source_url} target="_blank" rel="noopener noreferrer">
                                                    Originalbekanntmachung öffnen ↗
                                                </a>
                                            </article>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Block 2: Foerdertoepfe */}
                            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                                <span className="section__label">2 · Staatliches Fördergeld 2026/2027</span>
                                <h2>Aktive Fördertöpfe für {land.name} + Bund</h2>
                                <div className="planer-grid" style={{ marginTop: '1rem' }}>
                                    {ergebnis.open.map((p) => (
                                        <article key={p.id} className="planer-treffer planer-treffer--open">
                                            <div className="planer-treffer__meta">
                                                <span className="badge badge--yes">{p.level === 'bund' ? 'Bund' : land.name}</span>
                                                <strong>{p.estimate_label}</strong>
                                            </div>
                                            <h3>{p.name}</h3>
                                            <p className="field-hint">{p.status_label}</p>
                                            <p className="planer-grund">{p.reason}</p>
                                            <p className="field-hint">{p.hardware_note}</p>
                                            <a href={p.official_url} target="_blank" rel="noopener noreferrer">
                                                Offizielle Förderstelle ↗
                                            </a>
                                        </article>
                                    ))}
                                </div>

                                {ergebnis.watch.length > 0 && (
                                    <div style={{ marginTop: '1.5rem' }}>
                                        <h3>Warteliste &amp; erwartete Aufrufe 2027 (jetzt vorbereiten)</h3>
                                        <div className="planer-grid" style={{ marginTop: '0.75rem' }}>
                                            {ergebnis.watch.map((p) => (
                                                <article key={p.id} className="planer-treffer planer-treffer--watch">
                                                    <div className="planer-treffer__meta">
                                                        <span className="badge badge--partial">Warteliste 2027</span>
                                                        <strong>{p.estimate_label}</strong>
                                                    </div>
                                                    <h4>{p.name}</h4>
                                                    <p className="field-hint">{p.status_label}</p>
                                                    <p className="field-hint">{p.hardware_note}</p>
                                                </article>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {ergebnis.closed.length > 0 && (
                                    <div className="planer-warnung-neutral" style={{ marginTop: '1.5rem' }}>
                                        <strong>Transparenz-Hinweis zu beendeten Programmen in {land.name}:</strong>
                                        {ergebnis.closed.map((c) => (
                                            <p key={c.id} style={{ marginTop: '0.4rem' }}>
                                                <strong>{c.name}:</strong> {c.status_label} — {c.hardware_note}
                                            </p>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Block 3: Hardware (Serge) & Vorhabenbeginn-Sperre */}
                            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                                <span className="section__label section__label--violet">3 · Hardware, AfA &amp; Umsetzung</span>
                                <h2>Förderfähige KI-Hardware &amp; Investitionsbooster bis 31.12.2027</h2>
                                <div className="planer-sperre">
                                    <strong>Vorhabenbeginn-Sperre beachten:</strong> Bestellen Sie Hardware oder Software erst{' '}
                                    <em>nach</em> Antragstellung bzw. Bewilligung eines Zuschusses — sonst verfällt der Anspruch.
                                    Unverbindliche Vergleichsangebote einzuholen ist vorab erlaubt.
                                </div>
                                <div className="planer-grid" style={{ marginTop: '1rem' }}>
                                    <div className="planer-treffer">
                                        <span className="field-hint">1. Aktiver Landeszuschuss ({land.name})</span>
                                        <strong>{landeszuschussHw > 0 ? formatEUR(landeszuschussHw) : '0 € (Bund greift)'}</strong>
                                        <span className="field-hint">
                                            {landeszuschussHw > 0 ? bestesLandesprogramm.name : 'Säulen 2 & 3 gelten bundesweit.'}
                                        </span>
                                    </div>
                                    <div className="planer-treffer">
                                        <span className="field-hint">2. Investitionsbooster (bis 31.12.2027)</span>
                                        <strong>{formatEUR(afaJahr1)} AfA im 1. Jahr</strong>
                                        <span className="field-hint">30 % degressive AfA auf {formatEUR(nettoBasis)} (+ optional IAB § 7g)</span>
                                    </div>
                                    <div className="planer-treffer">
                                        <span className="field-hint">3. Optional: Forschungszulage ({fzQuote} %)</span>
                                        <strong>+{formatEUR(Math.round(afaJahr1 * (fzQuote / 100)))} / Jahr</strong>
                                        <span className="field-hint">auf projektbezogene FuE-Hardware-AfA (+ 20 % Gemeinkosten)</span>
                                    </div>
                                </div>
                                <p style={{ marginTop: '1rem' }}>
                                    Alle Details zur Kombination aus AfA, Forschungszulage und Landeszuschuss finden Sie im{' '}
                                    <Link to="/foerderung-ki-hardware-investitionsbooster">
                                        Leitfaden KI-Hardware &amp; Investitionsbooster 2026/2027
                                    </Link>
                                    . Für ein unverbindliches Hardware-Angebot (Serge &amp; Team) senden Sie Ihren Fahrplan
                                    einfach über das Formular unten mit.
                                </p>
                            </div>

                            {/* Block 4: Fristenkalender & Opt-In */}
                            <div className="glass-card" style={{ marginTop: '1.5rem' }}>
                                <span className="section__label">4 · Persönlicher Fristenkalender &amp; Alert</span>
                                <h2>Alle Stichtage 2026/2027 auf einen Blick</h2>
                                <div className="planer-fristen">
                                    {fristen.map((f, idx) => (
                                        <div key={`${f.date}-${idx}`} className="planer-frist">
                                            <strong className="planer-frist__datum">{formatDatumDE(f.date)}</strong>
                                            <div>
                                                <strong>{f.title}</strong>
                                                <div className="field-hint">{f.detail}</div>
                                            </div>
                                            <span className={`badge ${f.sourceType === 'tender' ? 'badge--partial' : 'badge--yes'}`}>
                                                {f.sourceType === 'tender' ? 'Vergabefrist' : 'Fördertermin'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <form className="planer-optin" onSubmit={handleAlertSubmit}>
                                    <h3>Fristen- &amp; Ausschreibungs-Alert kostenfrei aktivieren (0 € Pilotphase)</h3>
                                    <p className="field-hint">
                                        Wir informieren Sie zu Ihren gematchten Förderfristen (z. B. Monatskontingent,
                                        ZIM-/MID-Wiederöffnung) und richten Ihr CPV-Suchprofil aus 18 Live-Quellen ein.
                                    </p>
                                    <div className="profile-lead__grid" style={{ marginTop: '0.75rem' }}>
                                        <label htmlFor="planer-company" className="profile-lead__field">
                                            Unternehmen (optional)
                                            <input
                                                id="planer-company"
                                                type="text"
                                                value={company}
                                                onChange={(e) => setCompany(e.target.value)}
                                                placeholder="Muster GmbH"
                                            />
                                        </label>
                                        <label htmlFor="planer-email" className="profile-lead__field">
                                            Geschäftliche E-Mail
                                            <input
                                                id="planer-email"
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="name@unternehmen.de"
                                            />
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn--primary"
                                        disabled={optinStatus === 'sending'}
                                        style={{ marginTop: '1rem' }}
                                    >
                                        {optinStatus === 'sending' ? 'Wird übermittelt …' : 'Fristen-Alert & Pilotprofil anfragen'}
                                    </button>
                                    {optinText ? (
                                        <p className="field-hint" style={{ marginTop: '0.75rem', color: optinStatus === 'error' ? '#fca5a5' : '#86efac' }}>
                                            {optinText}
                                        </p>
                                    ) : null}
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Weiterfuehrende Links (Sichtbar im SSR & fuer Crawler) */}
            <section className="section section--alt">
                <div className="container">
                    <span className="section__label">Wissen &amp; Förder-Hubs 2026/2027</span>
                    <h2 className="section__title">Vertiefende Leitfäden zum Fahrplan</h2>
                    <ul className="inhalt__liste">
                        <li>
                            <Link to="/ki-foerderung-unternehmen">KI-Förderung für Unternehmen 2026/2027: Offene &amp; beendete Programme</Link>
                        </li>
                        <li>
                            <Link to="/foerderung-ki-hardware-investitionsbooster">KI-Hardware &amp; Investitionsbooster 2026/2027 (30 % AfA &amp; Forschungszulage)</Link>
                        </li>
                        <li>
                            <Link to="/foerdermittel-kalender-2027">Fördermittel-Kalender 2027: Alle Fristen, Kontingente &amp; Stichtage</Link>
                        </li>
                        <li>
                            <Link to="/bafa-foerderung-2027">BAFA Beratungsförderung 2027 (verlängert bis 2028, ELSTER/BundID)</Link>
                        </li>
                        <li>
                            <Link to="/eu-schwellenwerte">EU-Schwellenwerte 2026/2027: Tabelle &amp; Rechner</Link> ·{' '}
                            <Link to="/cpv-code-suche">CPV-Code-Suche</Link> ·{' '}
                            <Link to="/gaeb-viewer">Kostenloser GAEB-Viewer</Link>
                        </li>
                    </ul>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label">Häufige Fragen</span>
                    <h2 className="section__title">Fragen zum Auftrags- &amp; Förder-Planer</h2>
                    <div className="about-faq__list">
                        {PLANER_FAQS.map((eintrag) => (
                            <details className="about-faq__item" key={eintrag.frage}>
                                <summary>{eintrag.frage}</summary>
                                <p>{eintrag.antwort}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
