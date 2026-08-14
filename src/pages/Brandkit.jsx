import Seo from '../components/Seo'

const farben = [
    { name: 'Nachtblau (Hintergrund)', hex: '#050b1a' },
    { name: 'Flächenblau (Karten)', hex: '#0a1228' },
    { name: 'Neon-Blau (Primär)', hex: '#3b82f6' },
    { name: 'Neon-Blau hell (Akzent)', hex: '#60a5fa' },
    { name: 'Himmelblau (Sekundär)', hex: '#38bdf8' },
    { name: 'Violett (Tertiär)', hex: '#818cf8' },
    { name: 'Textweiß', hex: '#f1f5f9' },
]

const logoVarianten = [
    {
        titel: 'Neon-A auf Dunkel',
        datei: '/brand/logo-mark.svg',
        png: '/brand/logo-mark.png',
        hintergrund: '#050b1a',
        farbe: '#60a5fa',
    },
    {
        titel: 'Weiß auf Dunkel',
        datei: '/brand/logo-mark-weiss.svg',
        png: '/brand/logo-mark-weiss.png',
        hintergrund: '#050b1a',
        farbe: '#ffffff',
    },
    {
        titel: 'Dunkel auf Hell',
        datei: '/brand/logo-mark-dunkel.svg',
        png: '/brand/logo-mark-dunkel.png',
        hintergrund: '#f1f5f9',
        farbe: '#0a1228',
    },
]

const schriftzugVarianten = [
    {
        titel: 'Neon-Blau auf Dunkel',
        datei: '/brand/logo-schriftzug.png',
        hintergrund: '#050b1a',
    },
    {
        titel: 'Weiß auf Dunkel',
        datei: '/brand/logo-schriftzug-weiss.png',
        hintergrund: '#050b1a',
    },
    {
        titel: 'Dunkel auf Hell',
        datei: '/brand/logo-schriftzug-dunkel.png',
        hintergrund: '#f1f5f9',
    },
]

function LogoMark({ farbe }) {
    return (
        <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false" style={{ width: '96px', height: '96px' }}>
            <g fill="none" stroke={farbe} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M100 22 L178 178 L132 178 L100 96 L68 178 L22 178 Z" />
                <path d="M80 148 L120 148" />
            </g>
        </svg>
    )
}

export default function Brandkit() {
    return (
        <>
            <Seo path="/brandkit" />

            <section className="section">
                <div className="container">
                    <span className="section__label">
                        <span className="pulse"></span> Brandkit
                    </span>
                    <h2 className="section__title">
                        Logo, Farben und <span className="gradient-text">Schreibweise</span>
                    </h2>
                    <p className="section__subtitle">
                        Materialien für Berichterstattung, Partnerseiten und Integrationen. Die Dateien
                        dürfen unverändert verwendet werden, um auf Ausschreibungsagenten.de zu verweisen —
                        bitte ohne Verzerrung, Umfärbung oder eigene Zusätze im Logo.
                    </p>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Logo
                    </span>
                    <h2 className="section__title">Das Neon-A</h2>
                    <p className="section__subtitle">
                        Unser Zeichen ist ein offenes „A" mit Querstrich — als Strichzeichnung mit runden
                        Kappen. Es steht allein oder links neben dem Schriftzug „ausschreibungsagenten.de".
                        Bitte ausreichend Freiraum lassen (mindestens die Breite des Querstrichs rundum).
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
                        {logoVarianten.map((variante) => (
                            <div className="glass-card" key={variante.datei}>
                                <div
                                    style={{
                                        background: variante.hintergrund,
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1.5rem',
                                        border: '1px solid rgba(96, 165, 250, 0.2)',
                                    }}
                                >
                                    <LogoMark farbe={variante.farbe} />
                                </div>
                                <h3 className="glass-card__title" style={{ marginTop: '1rem' }}>{variante.titel}</h3>
                                <div style={{ display: 'flex', gap: '.5rem', marginTop: '.5rem', flexWrap: 'wrap' }}>
                                    <a href={variante.datei} download className="btn btn--outline">SVG</a>
                                    <a href={variante.png} download className="btn btn--outline">PNG (1024 px)</a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Logo mit Schriftzug
                    </span>
                    <h2 className="section__title">Die Wortmarke</h2>
                    <p className="section__subtitle">
                        Neon-A plus Schriftzug in Inter Bold — für Kooperationsseiten, Präsentationen
                        und überall dort, wo der Name ausgeschrieben stehen soll. PNG mit transparentem
                        Hintergrund, 2000 px breit.
                    </p>
                    <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
                        {schriftzugVarianten.map((variante) => (
                            <div className="glass-card" key={variante.datei}>
                                <div
                                    style={{
                                        background: variante.hintergrund,
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '1.5rem',
                                        border: '1px solid rgba(96, 165, 250, 0.2)',
                                    }}
                                >
                                    <img
                                        src={variante.datei}
                                        alt={`Wortmarke Ausschreibungsagenten.de – ${variante.titel}`}
                                        style={{ maxWidth: '100%', height: 'auto' }}
                                        loading="lazy"
                                    />
                                </div>
                                <h3 className="glass-card__title" style={{ marginTop: '1rem' }}>{variante.titel}</h3>
                                <a href={variante.datei} download className="btn btn--outline" style={{ marginTop: '.5rem' }}>
                                    PNG herunterladen
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Farben
                    </span>
                    <h2 className="section__title">Neon-Blue-Palette</h2>
                    <p className="section__subtitle">
                        Dunkler Grund, blaue Akzente: Die Marke lebt auf Nachtblau, Neon-Blau trägt
                        Interaktion und Hervorhebung.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
                        {farben.map((farbe) => (
                            <div className="glass-card" key={farbe.hex}>
                                <div
                                    style={{
                                        background: farbe.hex,
                                        height: '64px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(96, 165, 250, 0.25)',
                                    }}
                                />
                                <h3 className="glass-card__title" style={{ marginTop: '.75rem', fontSize: '1rem' }}>{farbe.name}</h3>
                                <p className="glass-card__text"><code>{farbe.hex}</code></p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <span className="section__label section__label--violet">
                        <span className="pulse"></span> Schrift &amp; Schreibweise
                    </span>
                    <h2 className="section__title">So schreibt man uns</h2>
                    <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Typografie</h3>
                            <p className="glass-card__text">
                                Wir setzen auf <strong>Inter</strong> (System-Fallback: -apple-system, Segoe UI,
                                sans-serif). Überschriften fett, Fließtext regulär.
                            </p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Namensschreibweise</h3>
                            <p className="glass-card__text">
                                Im Fließtext: <strong>Ausschreibungsagenten.de</strong> (großes A, mit „.de").
                                Im Logo-Schriftzug klein: „ausschreibungsagenten.de". Bitte nicht:
                                „AusschreibungsAgenten", „Ausschreibungs-Agenten" oder Abkürzungen.
                            </p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Über das Produkt</h3>
                            <p className="glass-card__text">
                                Kurzbeschreibung für Presse und Partner: „Ausschreibungsagenten.de findet
                                öffentliche Ausschreibungen aus 17 Live-Quellen — von TED bis zu den
                                Landesportalen — und erklärt zu jedem Treffer, warum er zum Firmenprofil
                                passt." Betrieben von der Yawusa UG (haftungsbeschränkt), Berlin;
                                Datenverarbeitung in der EU.
                            </p>
                        </div>
                        <div className="glass-card">
                            <h3 className="glass-card__title">Fragen zum Brandkit</h3>
                            <p className="glass-card__text">
                                Druckdaten, weitere Formate oder Freigaben für andere Verwendungen:
                                Kontakt über das <a href="/impressum">Impressum</a> — wir antworten schnell.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
