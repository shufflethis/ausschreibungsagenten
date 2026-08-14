import { Link } from 'react-router-dom'
import Seo from './Seo'

// Gemeinsame Schablone aller Inhaltsseiten. Die Reihenfolge ist bewusst
// festgelegt und nicht je Seite frei waehlbar:
//
// 1. Direktantwort in 40-60 Woertern, vor jeder Verkaufsaussage. Sie ist
//    die Passage, die KI-Antwortflaechen zitieren.
// 2. Faktenblock mit sichtbarem Datenstand.
// 3. Hauptteil mit Zwischenueberschriften, die echte Fragen abbilden.
// 4. Abgrenzung: was das Produkt an dieser Stelle nicht leistet.
// 5. FAQ - dieselben Eintraege landen ueber Seo im FAQPage-Schema.
// 6. Handlungsaufforderung auf das Pilot-Formular, mit Seitenkontext.
// 7. Querverweise auf verwandte Seiten.

function pflichtfeld(wert, name) {
    if (!wert || (Array.isArray(wert) && wert.length === 0)) {
        throw new Error(`Inhaltsseite ohne ${name}`)
    }
    return wert
}

export default function InhaltsSeite({ seite }) {
    pflichtfeld(seite.direktantwort, 'Direktantwort')
    pflichtfeld(seite.h1, 'Ueberschrift')
    pflichtfeld(seite.faq, 'FAQ')

    // Query vor Fragment, nicht umgekehrt: "/#kontakt?thema=..." macht die
    // gesamte Zeichenkette zum Ankernamen, der Browser findet kein Element
    // mit dieser Id und bleibt oben auf der Startseite stehen.
    const kontaktZiel = `/?thema=${encodeURIComponent(seite.ctaKontext ?? seite.h1)}#kontakt`

    return (
        <>
            <Seo path={seite.path} faq={seite.faq} />

            <article className="section inhalt">
                <div className="container">
                    {seite.heroBild ? (
                        <header className="inhalt-hero">
                            <img
                                className="hero-foto"
                                src={seite.heroBild.src}
                                alt={seite.heroBild.alt}
                                fetchPriority="high"
                            />
                            <div className="hero-foto__schleier" aria-hidden="true"></div>
                            <h1 className="section__title">{seite.h1}</h1>
                        </header>
                    ) : (
                        <h1 className="section__title">{seite.h1}</h1>
                    )}

                    <p className="inhalt__direktantwort">{seite.direktantwort}</p>

                    {seite.fakten ? (
                        <div className="inhalt__fakten">
                            <div className="inhalt__tabelle-rahmen">
                                <table>
                                    <thead>
                                        <tr>
                                            {seite.fakten.kopf.map((zelle) => (
                                                <th key={zelle}>{zelle}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seite.fakten.zeilen.map((zeile) => (
                                            <tr key={zeile.join('|')}>
                                                {zeile.map((zelle, i) =>
                                                    i === 0 ? <th key={zelle} scope="row">{zelle}</th> : <td key={zelle}>{zelle}</td>,
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="inhalt__datenstand">Stand: {seite.fakten.datenstand}</p>
                        </div>
                    ) : null}

                    {seite.abschnitte.map((abschnitt) => (
                        <section key={abschnitt.titel} className="inhalt__abschnitt">
                            <h2>{abschnitt.titel}</h2>
                            {abschnitt.absaetze.map((absatz) => (
                                <p key={absatz.slice(0, 40)}>{absatz}</p>
                            ))}
                            {abschnitt.liste ? (
                                <ul className="inhalt__liste">
                                    {abschnitt.liste.map((punkt) => (
                                        <li key={punkt.slice(0, 40)}>{punkt}</li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    ))}

                    {seite.abgrenzung ? (
                        <section className="inhalt__abgrenzung">
                            <h2>{seite.abgrenzung.titel}</h2>
                            {seite.abgrenzung.absaetze.map((absatz) => (
                                <p key={absatz.slice(0, 40)}>{absatz}</p>
                            ))}
                        </section>
                    ) : null}

                    <section className="inhalt__faq">
                        <h2>Häufige Fragen</h2>
                        {seite.faq.map((eintrag) => (
                            <details key={eintrag.frage}>
                                <summary>{eintrag.frage}</summary>
                                <p>{eintrag.antwort}</p>
                            </details>
                        ))}
                    </section>

                    <section className="inhalt__cta">
                        <h2>{seite.ctaTitel ?? 'Im Pilot ausprobieren'}</h2>
                        <p>
                            {seite.ctaText ??
                                'Wir richten ein Suchprofil für Ihre Gewerke, Regionen und Auftragsgrößen ein und zeigen Ihnen die ersten Treffer mit Begründung.'}
                        </p>
                        <a className="btn btn--primary" href={kontaktZiel}>
                            Pilotzugang anfragen
                        </a>
                    </section>

                    {seite.querverweise?.length ? (
                        <nav className="inhalt__verweise" aria-label="Weiterführend">
                            <h2>Weiterführend</h2>
                            <ul>
                                {seite.querverweise.map((verweis) => (
                                    <li key={verweis.path}>
                                        <Link to={verweis.path}>{verweis.text}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ) : null}
                </div>
            </article>
        </>
    )
}
