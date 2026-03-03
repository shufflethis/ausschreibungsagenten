import { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const TOOLS = [
    { name: 'DTVP', url: 'https://www.dtvp.de', price: 'ab €39/Mon.', ai: false, portals: '~100%', focus: 'Offizielles Portal', gaeb: false, alerts: true, free: true },
    { name: 'aumass', url: 'https://www.aumass.de', price: '€39–79/Mon.', ai: false, portals: 'Alle', focus: 'Breite Abdeckung', gaeb: false, alerts: true, free: true },
    { name: 'GAEB.ai', url: 'https://gaeb.ai', price: 'Individuell', ai: true, portals: '8+', focus: 'Elektro/Bau', gaeb: true, alerts: true, free: true },
    { name: 'Vergabe24', url: 'https://www.vergabe24.de', price: '~€50–100/Mon.', ai: false, portals: '500.000+/Jahr', focus: 'Regional', gaeb: false, alerts: true, free: false },
    { name: 'TenderWolf', url: 'https://www.tenderwolf.com', price: '€80–150/Mon.', ai: true, portals: 'EU-weit', focus: 'Europa', gaeb: false, alerts: true, free: true },
    { name: 'Jorpex', url: 'https://www.jorpex.com', price: '$49–149/Mon.', ai: true, portals: 'Global', focus: 'International', gaeb: false, alerts: true, free: false },
    { name: 'Bidfix', url: 'https://bidfix.ai', price: 'k.A.', ai: true, portals: 'DACH', focus: 'DACH-Markt', gaeb: false, alerts: true, free: false },
    { name: 'Hermix', url: 'https://hermix.com', price: 'Enterprise', ai: true, portals: 'EU', focus: 'Öffentl. Sektor', gaeb: false, alerts: true, free: true },
]

const FEATURES = [
    { icon: '🔍', title: 'Multi-Portal-Scan', text: 'Ein Agent durchsucht DTVP, TED, Bund.de, eVergabe, Vergabe24 und alle Landesportale gleichzeitig. Kein manuelles Hin-und-Her-Klicken zwischen Dutzenden Plattformen mehr.', color: '' },
    { icon: '🤖', title: 'KI-Relevanz-Scoring', text: 'Künstliche Intelligenz bewertet jede Ausschreibung nach Passung zu Ihrem Firmenprofil: Gewerk, Region, Auftragsvolumen und Eignungskriterien werden automatisch abgeglichen.', color: '--violet' },
    { icon: '📱', title: 'Sofort-Benachrichtigung', text: 'Push-Notifications via E-Mail, App oder WhatsApp – in Echtzeit, wenn eine relevante Ausschreibung veröffentlicht wird. Nie wieder eine Frist verpassen.', color: '--amber' },
    { icon: '📄', title: 'GAEB/LV-Analyse', text: 'Leistungsverzeichnisse im GAEB DA XML, PDF oder Excel-Format werden automatisch ausgewertet. Positionen, Mengen und Anforderungen auf einen Blick erfasst.', color: '--green' },
    { icon: '📊', title: 'Intelligentes Dashboard', text: 'Fristenkalender, Angebotsübersicht und Wettbewerbsanalyse in einem zentralen Dashboard. Behalten Sie den Überblick über alle laufenden Vergabeverfahren.', color: '' },
    { icon: '🔗', title: 'ERP-Integration', text: 'Nahtlose Anbindung an gängige Handwerker- und Bau-Software. Gefundene Ausschreibungen direkt in Ihrem ERP-System weiterverarbeiten und Angebote erstellen.', color: '--violet' },
]

const BRANCHEN = [
    { emoji: '🔧', name: 'Handwerk', desc: '580.000 Betriebe in Deutschland – von Elektro über Sanitär bis Maler. Ihr KI-Agent findet die passenden Gewerke-Ausschreibungen in Ihrer Region.' },
    { emoji: '🏗️', name: 'Bauunternehmen', desc: 'Hoch-, Tief- und Straßenbau. GAEB-Analyse inklusive. Von der kommunalen Kanalsanierung bis zum Bundesstraßen-Neubau.' },
    { emoji: '💻', name: 'IT-Dienstleister', desc: 'Software-Entwicklung, Cloud-Migration, IT-Sicherheit. Öffentliche IT-Projekte im Wert von Milliarden pro Jahr warten auf Ihre Expertise.' },
    { emoji: '📋', name: 'Ingenieurbüros', desc: 'Tragwerksplanung, Vermessung, Umweltgutachten. Komplexe Eignungskriterien werden automatisch gegen Ihr Profil geprüft.' },
    { emoji: '🍽️', name: 'Catering & Services', desc: 'Kantinen-Bewirtschaftung, Reinigung, Facility Management. Kommunale und Bundes-Ausschreibungen für Dienstleistungen.' },
]

const FAQS = [
    { q: 'Was sind öffentliche Ausschreibungen und warum sind sie wichtig?', a: 'Öffentliche Ausschreibungen sind Vergabeverfahren, mit denen Behörden, Kommunen und öffentliche Einrichtungen Aufträge an Unternehmen vergeben. Mit einem jährlichen Volumen von rund 500 Milliarden Euro allein in Deutschland sind sie eine der größten Auftragsquellen für Unternehmen jeder Größe. Öffentliche Aufträge bieten Planungssicherheit, faire Konditionen und regelmäßige Zahlungen.' },
    { q: 'Welche Vergabeportale gibt es in Deutschland?', a: 'Die wichtigsten Vergabeportale sind das Deutsche Vergabeportal (DTVP), eVergabe.de, Bund.de, sowie die Landesvergabeportale der 16 Bundesländer. Für EU-weite Ausschreibungen ist TED (Tenders Electronic Daily) die zentrale Plattform. Ein KI-Ausschreibungsagent durchsucht all diese Portale automatisch und spart Ihnen die tägliche manuelle Recherche auf Dutzenden unterschiedlichen Plattformen.' },
    { q: 'Was ist ein KI-Ausschreibungsagent?', a: 'Ein KI-Ausschreibungsagent ist eine Software, die mithilfe Künstlicher Intelligenz automatisch alle relevanten Vergabeportale nach passenden Ausschreibungen durchsucht. Der Agent lernt Ihr Firmenprofil – Gewerke, Region, Auftragsvolumen, Eignungskriterien – und bewertet jede neue Ausschreibung mit einem Relevanz-Score. So erhalten Sie nur die Treffer, die wirklich zu Ihrem Unternehmen passen.' },
    { q: 'Wie viel kostet ein Ausschreibungsagent?', a: 'Die Preise variieren je nach Anbieter und Funktionsumfang. Einstiegsangebote beginnen bei ca. 39 €/Monat für Basis-Funktionen (z. B. aumass Start). Professionelle Tools mit KI-Features liegen zwischen 80 und 200 €/Monat. Enterprise-Lösungen mit API-Zugang und White-Label-Optionen werden individuell bepreist. Angesichts des Potenzials öffentlicher Aufträge amortisiert sich die Investition oft schon mit einem einzigen gewonnenen Auftrag.' },
    { q: 'Ab welchem Auftragsvolumen lohnt sich die Suche nach öffentlichen Ausschreibungen?', a: 'Grundsätzlich gibt es keine Untergrenze. Bereits Kleinstaufträge ab wenigen tausend Euro werden öffentlich ausgeschrieben, insbesondere auf kommunaler Ebene. Für die meisten Unternehmen lohnt sich der Einstieg ab einem anvisierten Jahresauftragsvolumen von 50.000 €. Die Vergaberechts-Schwellenwerte liegen aktuell bei 143.000 € für Liefer- und Dienstleistungsaufträge und 5.538.000 € für Bauaufträge (EU-weite Vergabe).' },
    { q: 'Was ist GAEB und warum ist die automatische Analyse wichtig?', a: 'GAEB (Gemeinsamer Ausschuss Elektronik im Bauwesen) ist das Standardformat für elektronische Leistungsverzeichnisse im deutschen Bauwesen. GAEB DA XML-Dateien enthalten strukturierte Positionsdaten, Mengen und Leistungsbeschreibungen. Die automatische Analyse dieser Dateien spart Stunden manueller Arbeit beim Lesen und Kalkulieren von Leistungsverzeichnissen und reduziert Fehlerquellen bei der Angebotserstellung erheblich.' },
    { q: 'Wie viele Ausschreibungen werden täglich veröffentlicht?', a: 'In Deutschland werden täglich mehrere tausend neue Ausschreibungen auf den verschiedenen Vergabeportalen veröffentlicht. Allein das DTVP (Deutsches Vergabeportal) verzeichnet über 500.000 Bekanntmachungen pro Jahr. Ohne automatisierte Suche ist es praktisch unmöglich, alle relevanten Ausschreibungen manuell zu erfassen – insbesondere, wenn man mehrere Portale und Bundesländer abdecken möchte.' },
    { q: 'Welche Branchen profitieren am meisten von Ausschreibungsagenten?', a: 'Besonders stark profitieren das Baugewerbe, Handwerksbetriebe, IT-Dienstleister, Ingenieurbüros und Facility-Management-Unternehmen. Aber auch Catering, Reinigung, Beratung, Schulung und viele weitere Branchen finden regelmäßig passende öffentliche Aufträge. Grundsätzlich gilt: Jedes Unternehmen, das Dienstleistungen oder Produkte an den öffentlichen Sektor verkaufen kann, sollte Ausschreibungsagenten nutzen.' },
    { q: 'Kann ich auch als kleines Unternehmen an öffentlichen Ausschreibungen teilnehmen?', a: 'Ja, unbedingt! Das Vergaberecht fördert sogar explizit die Beteiligung kleiner und mittlerer Unternehmen (KMU). Viele Aufträge werden in Lose aufgeteilt, um auch kleineren Betrieben die Teilnahme zu ermöglichen. Kommunale Ausschreibungen sind oft besonders KMU-freundlich. Ein KI-Agent hilft Ihnen, genau die Ausschreibungen zu finden, die zu Ihrer Unternehmensgröße und Ihren Kapazitäten passen.' },
    { q: 'Wie unterscheidet sich ausschreibungsagenten.de von anderen Plattformen?', a: 'Ausschreibungsagenten.de bietet einen unabhängigen Überblick über alle verfügbaren Tools und Plattformen zur Ausschreibungssuche. Wir vergleichen Funktionen, Preise und KI-Fähigkeiten objektiv und helfen Ihnen, die beste Lösung für Ihre spezifischen Anforderungen zu finden. Dazu liefern wir redaktionelle Inhalte rund um das Thema Vergabe, Tipps zur Angebotserstellung und aktuelle Markt-Insights.' },
    { q: 'Welche Fristen gelten bei öffentlichen Ausschreibungen?', a: 'Die Angebotsfristen variieren je nach Verfahrensart. Bei offenen Verfahren oberhalb der EU-Schwellenwerte beträgt die Mindestfrist 35 Tage (mit elektronischer Bekanntmachung: 30 Tage). Unterhalb der Schwellenwerte und bei nationalen Verfahren gelten oft kürzere Fristen von 10–15 Werktagen. Ein Ausschreibungsagent mit Fristenkalender sorgt dafür, dass Sie keine Deadline verpassen.' },
    { q: 'Ist die Nutzung der Vergabeportale kostenlos?', a: 'Die Einsicht in Bekanntmachungen ist auf den meisten offiziellen Portalen kostenlos. Die Teilnahme an elektronischen Vergabeverfahren über das DTVP ist ebenfalls kostenfrei. Erweiterte Funktionen wie Suchprofile, automatische Benachrichtigungen und Export-Funktionen sind bei vielen Portalen premium-pflichtig. Drittanbieter-Tools wie aumass, TenderWolf oder GAEB.ai bieten Mehrwert-Features gegen monatliche Gebühren.' },
]

export default function LandingPage() {
    const [openFaq, setOpenFaq] = useState(null)
    const [formData, setFormData] = useState({ name: '', email: '', company: '', branche: '', message: '' })
    const [formStatus, setFormStatus] = useState(null)
    const [sending, setSending] = useState(false)
    const [newsletterEmail, setNewsletterEmail] = useState('')
    const [newsletterStatus, setNewsletterStatus] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSending(true)
        setFormStatus(null)
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            if (res.ok) {
                setFormStatus('success')
                setFormData({ name: '', email: '', company: '', branche: '', message: '' })
            } else {
                setFormStatus('error')
            }
        } catch {
            setFormStatus('error')
        }
        setSending(false)
    }

    const handleNewsletter = async (e) => {
        e.preventDefault()
        try {
            const res = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: newsletterEmail }),
            })
            if (res.ok) {
                setNewsletterStatus('success')
                setNewsletterEmail('')
            } else {
                setNewsletterStatus('error')
            }
        } catch {
            setNewsletterStatus('error')
        }
    }

    return (
        <>
            <Helmet>
                <title>Ausschreibungsagenten.de – KI-Agenten für Öffentliche Ausschreibungen | Automatisch finden, filtern, gewinnen</title>
                <meta name="description" content="Öffentliche Ausschreibungen automatisch finden mit KI-Agenten. Alle Vergabeportale im Blick: DTVP, TED, Bund.de, eVergabe. Tools im Vergleich. Für Handwerk, Bau, IT & Beratung." />
            </Helmet>

            {/* ===== HERO ===== */}
            <section className="hero" id="start">
                <div className="container">
                    <div className="hero__content">
                        <div className="hero__badge">
                            <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#06b6d4', animation: 'pulse 2s ease-in-out infinite' }}></span>
                            Über 8 Vergabeportale im Blick
                        </div>

                        <h1 className="hero__title">
                            Nie wieder<br />
                            <span className="gradient-text">Ausschreibungen verpassen</span>
                        </h1>

                        <p className="hero__description">
                            KI-Agenten durchsuchen täglich alle deutschen Vergabeportale und liefern Ihnen
                            nur die öffentlichen Ausschreibungen, die wirklich zu Ihrem Unternehmen passen.
                            Automatisch. Intelligent. Rund um die Uhr.
                        </p>

                        <div className="hero__actions">
                            <a href="#vergleich" className="btn btn--primary btn--lg">Tools vergleichen →</a>
                            <a href="#kontakt" className="btn btn--outline btn--lg">Beratung anfragen</a>
                        </div>

                        <div className="hero__stats">
                            <div className="hero__stat">
                                <span className="hero__stat-value">€500 Mrd.</span>
                                <span className="hero__stat-label">Öffentliches Beschaffungsvolumen/Jahr</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#8b5cf6' }}>500.000+</span>
                                <span className="hero__stat-label">Ausschreibungen pro Jahr in DE</span>
                            </div>
                            <div className="hero__stat">
                                <span className="hero__stat-value" style={{ color: '#f59e0b' }}>8+</span>
                                <span className="hero__stat-label">Vergabeportale automatisch gescannt</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PROBLEM ===== */}
            <section className="section section--alt" id="problem">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Das Problem
                    </span>
                    <h2 className="section__title">
                        Warum <span className="gradient-text--amber">manuelle Suche</span> Sie Aufträge kostet
                    </h2>
                    <p className="section__subtitle">
                        Jeden Tag werden tausende neue Ausschreibungen veröffentlicht – verteilt auf Dutzende Portale.
                        Wer manuell sucht, verliert systematisch Aufträge an die Konkurrenz.
                    </p>

                    <div className="problem-grid">
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">73%</div>
                            <h3 className="glass-card__title">Zeitverlust</h3>
                            <p className="glass-card__text">
                                Durchschnittlich verbringen Unternehmen 5–8 Stunden pro Woche mit der manuellen Suche auf verschiedenen Vergabeportalen. Zeit, die für die Angebotserstellung und Kernarbeit fehlt. Mitarbeiter klicken sich durch DTVP, eVergabe, Bund.de und Landesportale – ohne Garantie, alle relevanten Ausschreibungen zu finden.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">85%</div>
                            <h3 className="glass-card__title">Informationsflut</h3>
                            <p className="glass-card__text">
                                Die meisten Suchergebnisse sind irrelevant. Ohne intelligentes Filtering wühlen Sie sich durch hunderte unpassende Ausschreibungen, um die wenigen relevanten Treffer zu finden. Falsche Region, falsches Gewerk, zu hohes Auftragsvolumen – die Trefferquote manueller Suche liegt unter 15%.
                            </p>
                        </div>
                        <div className="glass-card problem-card">
                            <div className="problem-card__number">40%</div>
                            <h3 className="glass-card__title">Verpasste Fristen</h3>
                            <p className="glass-card__text">
                                Angebotsfristen bei öffentlichen Vergaben sind oft knapp bemessen – zwischen 10 und 35 Tagen. Wer eine Ausschreibung erst nach einer Woche entdeckt, hat kaum noch Zeit für eine qualitativ hochwertige Angebotserstellung. Verspätete Angebote werden ausnahmslos ausgeschlossen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== HOW IT WORKS ===== */}
            <section className="section" id="prozess">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> So funktioniert's
                    </span>
                    <h2 className="section__title">
                        In 3 Schritten zum <span className="gradient-text">passenden Auftrag</span>
                    </h2>
                    <p className="section__subtitle">
                        Richten Sie Ihren persönlichen KI-Agenten ein und erhalten Sie ab sofort nur noch relevante
                        Ausschreibungen – automatisch und tagesaktuell.
                    </p>

                    <div className="steps-grid">
                        <div className="glass-card step-card">
                            <div className="step-card__number">1</div>
                            <h3 className="glass-card__title">Profil anlegen</h3>
                            <p className="glass-card__text">
                                Definieren Sie Ihr Firmenprofil: Gewerke, Leistungsbereiche, bevorzugte Regionen,
                                Auftragsvolumen und Eignungskriterien. Je präziser Ihr Profil, desto besser die
                                Trefferqualität Ihres KI-Agenten. Die Einrichtung dauert nur wenige Minuten.
                            </p>
                        </div>
                        <div className="glass-card step-card">
                            <div className="step-card__number">2</div>
                            <h3 className="glass-card__title">Agent arbeitet</h3>
                            <p className="glass-card__text">
                                Ihr KI-Agent scannt täglich alle relevanten Vergabeportale – DTVP, TED, Bund.de,
                                eVergabe und die Landesportale. Jede neue Ausschreibung wird mit Ihrem Profil
                                abgeglichen und erhält einen Relevanz-Score. Unpassende Treffer werden automatisch ausgefiltert.
                            </p>
                        </div>
                        <div className="glass-card step-card">
                            <div className="step-card__number">3</div>
                            <h3 className="glass-card__title">Angebot abgeben</h3>
                            <p className="glass-card__text">
                                Sie erhalten nur die besten Treffer direkt in Ihr Postfach – per E-Mail, Push oder
                                WhatsApp. Mit allen wichtigen Details: Auftraggeber, Leistungsumfang, Fristen und
                                Eignungskriterien. So können Sie sofort mit der Angebotserstellung beginnen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMPARISON TABLE ===== */}
            <section className="section section--alt" id="vergleich">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Marktüberblick 2026
                    </span>
                    <h2 className="section__title">
                        Alle <span className="gradient-text--amber">Ausschreibungstools</span> im Vergleich
                    </h2>
                    <p className="section__subtitle">
                        Der unabhängige Überblick über die wichtigsten Plattformen und Tools zur automatischen
                        Ausschreibungssuche in Deutschland und Europa. Finden Sie die Lösung, die zu Ihrem
                        Unternehmen passt.
                    </p>

                    <div className="comparison-wrapper">
                        <table className="comparison-table">
                            <thead>
                                <tr>
                                    <th>Tool</th>
                                    <th>Preis</th>
                                    <th>KI-Features</th>
                                    <th>Portal-Abdeckung</th>
                                    <th>Fokus</th>
                                    <th>GAEB-Support</th>
                                    <th>Alerts</th>
                                    <th>Free Tier</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TOOLS.map((tool, i) => (
                                    <tr key={i}>
                                        <td className="tool-name">
                                            <a href={tool.url} target="_blank" rel="noopener noreferrer">{tool.name}</a>
                                        </td>
                                        <td>{tool.price}</td>
                                        <td><span className={`badge ${tool.ai ? 'badge--yes' : 'badge--no'}`}>{tool.ai ? '✓ Ja' : '✗ Nein'}</span></td>
                                        <td>{tool.portals}</td>
                                        <td>{tool.focus}</td>
                                        <td><span className={`badge ${tool.gaeb ? 'badge--yes' : 'badge--no'}`}>{tool.gaeb ? '✓' : '✗'}</span></td>
                                        <td><span className={`badge ${tool.alerts ? 'badge--yes' : 'badge--no'}`}>{tool.alerts ? '✓' : '✗'}</span></td>
                                        <td><span className={`badge ${tool.free ? 'badge--yes' : 'badge--no'}`}>{tool.free ? '✓' : '✗'}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                        Stand: März 2026. Alle Angaben ohne Gewähr. Preise zzgl. MwSt. wo nicht anders angegeben.
                        <br />Haben wir ein Tool vergessen? <a href="#kontakt">Schreiben Sie uns</a> – wir ergänzen es gerne.
                    </p>
                </div>
            </section>

            {/* ===== FEATURES ===== */}
            <section className="section" id="funktionen">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Funktionen
                    </span>
                    <h2 className="section__title">
                        Was ein <span className="gradient-text">KI-Ausschreibungsagent</span> kann
                    </h2>
                    <p className="section__subtitle">
                        Moderne Ausschreibungsagenten kombinieren Web-Scraping, Natural Language Processing
                        und maschinelles Lernen, um den gesamten Prozess der Ausschreibungssuche zu
                        automatisieren und zu optimieren.
                    </p>

                    <div className="features-grid">
                        {FEATURES.map((f, i) => (
                            <div className={`glass-card ${i === 0 ? 'glass-card--featured' : ''}`} key={i}>
                                <div className={`glass-card__icon${f.color ? ' glass-card__icon' + f.color : ''}`}>{f.icon}</div>
                                <h3 className="glass-card__title">{f.title}</h3>
                                <p className="glass-card__text">{f.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BRANCHEN ===== */}
            <section className="section section--alt" id="branchen">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Branchen
                    </span>
                    <h2 className="section__title">
                        Öffentliche Aufträge für <span className="gradient-text">jede Branche</span>
                    </h2>
                    <p className="section__subtitle">
                        Ob Handwerk, Bau, IT oder Beratung – öffentliche Ausschreibungen gibt es in nahezu
                        jeder Branche. KI-Agenten filtern gezielt nach Ihrem Fachgebiet und Ihrer Region.
                    </p>

                    <div className="branchen-grid">
                        {BRANCHEN.map((b, i) => (
                            <div className="glass-card branche-card" key={i}>
                                <span className="branche-card__emoji">{b.emoji}</span>
                                <h3 className="glass-card__title">{b.name}</h3>
                                <p className="glass-card__text">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SEO CONTENT BLOCK ===== */}
            <section className="section" id="wissen">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Wissen
                    </span>
                    <h2 className="section__title">
                        Der vollständige Leitfaden zu <span className="gradient-text">öffentlichen Ausschreibungen</span>
                    </h2>

                    <div style={{ marginTop: '2rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
                        <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                            Öffentliche Beschaffung in Deutschland: Ein €500-Milliarden-Markt
                        </h3>
                        <p>
                            Die öffentliche Beschaffung in Deutschland umfasst ein jährliches Volumen von rund 500 Milliarden Euro – das entspricht etwa 15 Prozent des Bruttoinlandsprodukts. Damit ist Deutschland einer der größten öffentlichen Beschaffungsmärkte in Europa. Dieser Markt ist hochgradig dezentralisiert: Rund 58 Prozent aller Vergaben erfolgen auf kommunaler Ebene, 30 Prozent auf Länderebene und nur 12 Prozent auf Bundesebene. Das bedeutet: Die meisten Aufträge werden von Städten, Gemeinden und Landkreisen vergeben – oft ohne dass überregionale Unternehmen davon erfahren.
                        </p>
                        <p>
                            Genau hier liegt die Chance für Unternehmen, die KI-gestützte Ausschreibungsagenten einsetzen: Statt täglich Dutzende Vergabeportale manuell zu durchsuchen, übernimmt ein intelligenter Agent diese Aufgabe automatisch. Er durchsucht DTVP, TED, Bund.de, eVergabe und sämtliche Landesportale, filtert nach Ihren Kriterien und liefert nur die relevanten Treffer.
                        </p>

                        <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                            Vergaberecht verstehen: Schwellenwerte und Verfahrensarten
                        </h3>
                        <p>
                            Das deutsche Vergaberecht unterscheidet zwischen nationalen und EU-weiten Verfahren. Die EU-Schwellenwerte liegen aktuell bei 143.000 Euro für Liefer- und Dienstleistungsaufträge und 5.538.000 Euro für Bauaufträge. Oberhalb dieser Schwellen müssen Aufträge EU-weit ausgeschrieben werden – unterhalb gelten die nationalen Vergabeordnungen der jeweiligen Bundesländer.
                        </p>
                        <p>
                            Die häufigsten Verfahrensarten sind das offene Verfahren (jeder kann ein Angebot abgeben), das nicht offene Verfahren (nur ausgewählte Unternehmen werden zur Angebotsabgabe aufgefordert) und das Verhandlungsverfahren (für besonders komplexe Leistungen). Ein guter Ausschreibungsagent klassifiziert die Verfahrensart automatisch und hilft Ihnen, die Anforderungen des jeweiligen Verfahrens zu verstehen.
                        </p>

                        <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                            Die Rolle der Künstlichen Intelligenz in der Ausschreibungssuche
                        </h3>
                        <p>
                            Traditionelle Ausschreibungstools arbeiten mit Keyword-basierten Suchfiltern – Sie geben Begriffe wie „Sanitärinstallation" oder „IT-Sicherheitsberatung" ein und erhalten eine Liste aller Treffer. Das Problem: Ausschreibungstexte verwenden oft unterschiedliche Formulierungen für die gleiche Leistung. „Sanitärtechnische Anlagen" statt „Sanitärinstallation", „Cyber Security Consulting" statt „IT-Sicherheitsberatung".
                        </p>
                        <p>
                            KI-gestützte Agenten lösen dieses Problem mit Natural Language Processing (NLP). Sie verstehen den semantischen Kontext einer Ausschreibung und erkennen, dass „Erneuerung der haustechnischen Anlagen – Los 3: Sanitär" für einen Sanitärbetrieb hochrelevant ist, auch wenn das Wort „Sanitärinstallation" im Titel nicht vorkommt. Dieses intelligente Matching erhöht die Trefferquote um bis zu 60 Prozent gegenüber Keyword-Suchen.
                        </p>

                        <h3 style={{ color: 'var(--text-heading)', fontSize: 'var(--font-size-xl)', marginBottom: '1rem', marginTop: '2rem' }}>
                            Tipps für eine erfolgreiche Angebotsabgabe
                        </h3>
                        <p>
                            Die beste Ausschreibung nützt nichts, wenn das Angebot nicht überzeugt. Hier unsere fünf wichtigsten Tipps für eine erfolgreiche Angebotsabgabe bei öffentlichen Vergaben:
                        </p>
                        <p>
                            <strong>1. Eignungskriterien sorgfältig prüfen:</strong> Prüfen Sie vor der Angebotserstellung, ob Ihr Unternehmen alle formalen Anforderungen erfüllt – Umsatzgröße, Referenzen, Zertifizierungen, Versicherungsnachweise.
                        </p>
                        <p>
                            <strong>2. Leistungsverzeichnis vollständig ausfüllen:</strong> Jede Position muss bepreist werden. Fehlende Positionen führen zum Ausschluss. GAEB-Tools helfen, automatisch alle Positionen zu erfassen und strukturiert zu kalkulieren.
                        </p>
                        <p>
                            <strong>3. Fristen einhalten:</strong> Verspätete Angebote werden ausnahmslos ausgeschlossen. Planen Sie Puffer ein und nutzen Sie den Fristenkalender Ihres Ausschreibungsagenten.
                        </p>
                        <p>
                            <strong>4. Nebenangebote nutzen:</strong> Wenn die Vergabestelle Nebenangebote zulässt, nutzen Sie die Chance, innovative oder kostengünstigere Alternativen anzubieten. Das kann einen Wettbewerbsvorteil verschaffen.
                        </p>
                        <p>
                            <strong>5. Nachfragen stellen:</strong> Bei Unklarheiten im Leistungsverzeichnis nutzen Sie die Bieterfragen. Diese sind über das jeweilige Vergabeportal möglich und werden allen Bietern anonymisiert zur Verfügung gestellt.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="section section--alt" id="faq">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Häufige Fragen
                    </span>
                    <h2 className="section__title" style={{ textAlign: 'center' }}>
                        FAQ – Alles über <span className="gradient-text">Ausschreibungsagenten</span>
                    </h2>
                    <p className="section__subtitle" style={{ textAlign: 'center', margin: '0 auto' }}>
                        Die wichtigsten Fragen und Antworten rund um öffentliche Ausschreibungen,
                        KI-Agenten und die richtige Tool-Auswahl.
                    </p>

                    <div className="faq-list">
                        {FAQS.map((faq, i) => (
                            <div className={`faq-item ${openFaq === i ? 'faq-item--open' : ''}`} key={i}>
                                <button className="faq-item__question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    {faq.q}
                                    <span className="arrow">▼</span>
                                </button>
                                <div className="faq-item__answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== NEWSLETTER ===== */}
            <section className="section newsletter-section" id="newsletter">
                <div className="container">
                    <span className="section__label section__label--amber">
                        <span className="pulse"></span> Newsletter
                    </span>
                    <h2 className="section__title" style={{ textAlign: 'center' }}>
                        Wöchentlicher <span className="gradient-text--amber">Ausschreibungs-Report</span>
                    </h2>
                    <p className="section__subtitle" style={{ textAlign: 'center', margin: '0 auto 0.5rem' }}>
                        Erhalten Sie jeden Montag die wichtigsten neuen Ausschreibungen, Tool-Updates
                        und Vergabe-Tipps direkt in Ihr Postfach. Kostenlos und jederzeit abbestellbar.
                    </p>

                    <form className="newsletter-form" onSubmit={handleNewsletter}>
                        <input
                            type="email"
                            placeholder="Ihre geschäftliche E-Mail-Adresse"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn btn--amber">Anmelden</button>
                    </form>
                    {newsletterStatus === 'success' && (
                        <p className="form-status form-status--success" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
                            ✓ Erfolgreich angemeldet! Prüfen Sie Ihr Postfach.
                        </p>
                    )}
                    {newsletterStatus === 'error' && (
                        <p className="form-status form-status--error" style={{ maxWidth: 500, margin: '1rem auto 0' }}>
                            Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.
                        </p>
                    )}
                </div>
            </section>

            {/* ===== CONTACT ===== */}
            <section className="section section--alt" id="kontakt">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Kontakt
                    </span>
                    <h2 className="section__title">
                        Lassen Sie uns über <span className="gradient-text">Ihre Ausschreibungsstrategie</span> sprechen
                    </h2>
                    <p className="section__subtitle">
                        Ob Beratung zur Tool-Auswahl, individuelle Agenten-Konfiguration oder
                        Enterprise-Lösungen – wir helfen Ihnen, das Maximum aus öffentlichen
                        Ausschreibungen herauszuholen.
                    </p>

                    <div className="contact-grid">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-name">Name *</label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Max Mustermann"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-email">E-Mail *</label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="max@firma.de"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="contact-company">Unternehmen</label>
                                    <input
                                        id="contact-company"
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Mustermann GmbH"
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="contact-branche">Branche</label>
                                    <select
                                        id="contact-branche"
                                        value={formData.branche}
                                        onChange={(e) => setFormData({ ...formData, branche: e.target.value })}
                                    >
                                        <option value="">Bitte wählen...</option>
                                        <option value="Handwerk">Handwerk</option>
                                        <option value="Bau">Bauunternehmen</option>
                                        <option value="IT">IT-Dienstleistung</option>
                                        <option value="Ingenieurbuero">Ingenieurbüro</option>
                                        <option value="Beratung">Beratung / Consulting</option>
                                        <option value="Facility">Facility Management</option>
                                        <option value="Catering">Catering / Gastronomie</option>
                                        <option value="Sonstiges">Sonstiges</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="contact-message">Nachricht *</label>
                                <textarea
                                    id="contact-message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Wie können wir Ihnen helfen? Beschreiben Sie Ihre aktuelle Situation bei der Ausschreibungssuche..."
                                    required
                                />
                            </div>

                            <button type="submit" className="btn btn--primary" disabled={sending}>
                                {sending ? 'Wird gesendet...' : 'Anfrage absenden →'}
                            </button>

                            {formStatus === 'success' && (
                                <div className="form-status form-status--success">
                                    ✓ Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                                </div>
                            )}
                            {formStatus === 'error' && (
                                <div className="form-status form-status--error">
                                    Es gab ein Problem beim Senden. Bitte versuchen Sie es erneut oder schreiben Sie an info@famefact.com.
                                </div>
                            )}
                        </form>

                        <div className="contact-info">
                            <div className="glass-card contact-info__item">
                                <h4>📧 E-Mail</h4>
                                <p><a href="mailto:info@famefact.com">info@famefact.com</a></p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>📍 Standort</h4>
                                <p>track by track GmbH<br />Schliemannstr. 23, 10437 Berlin</p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>⚡ Antwortzeit</h4>
                                <p>In der Regel antworten wir innerhalb von 24 Stunden an Werktagen.</p>
                            </div>
                            <div className="glass-card contact-info__item">
                                <h4>🎯 Für wen?</h4>
                                <p>Handwerk, Bau, IT, Beratung, Facility Management und alle Unternehmen, die öffentliche Aufträge gewinnen möchten.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
