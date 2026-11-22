import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { routeByPath } from '../routes'
import { trackEvent } from '../lib/tracking'
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

const INLINE_LINK = /\[([^\]]+)\]\((\/[^)\s]+)\)/g

function formatDatum(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null
    const [jahr, monat, tag] = iso.split('-').map(Number)
    return new Intl.DateTimeFormat('de-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(Date.UTC(jahr, monat - 1, tag)))
}

// Verwandelt interne Inline-Links der Form "[Linktext](/pfad)" in React-Router-
// Links ohne HTML-Injection. Externe URLs werden bewusst nicht geparst.
export function renderTextMitLinks(text) {
    if (!text || !text.includes('](')) return text
    const teile = []
    let letzterIndex = 0
    for (const treffer of text.matchAll(INLINE_LINK)) {
        const [voll, label, ziel] = treffer
        if (treffer.index > letzterIndex) {
            teile.push(text.slice(letzterIndex, treffer.index))
        }
        teile.push(
            <Link
                key={`${treffer.index}-${ziel}`}
                to={ziel}
                onClick={() => trackEvent('Querverweis-Geklickt', { ziel, ort: 'inline' })}
            >
                {label}
            </Link>,
        )
        letzterIndex = treffer.index + voll.length
    }
    if (letzterIndex === 0) return text
    if (letzterIndex < text.length) teile.push(text.slice(letzterIndex))
    return teile.map((teil, i) => <Fragment key={i}>{teil}</Fragment>)
}

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

    const route = routeByPath(seite.path)
    const aktualisiertText = formatDatum(route?.lastmod)

    // Query vor Fragment, nicht umgekehrt: "/#profil?thema=..." macht die
    // gesamte Zeichenkette zum Ankernamen, der Browser findet kein Element
    // mit dieser Id und bleibt oben auf der Startseite stehen. Ziel ist
    // standardmaessig das kostenfreie Pilotprofil (#profil); Sonderseiten wie
    // /partner koennen ueber ctaAnker auf #kontakt verweisen.
    const anker = seite.ctaAnker ?? 'profil'
    const kontaktZiel = `/?thema=${encodeURIComponent(seite.ctaKontext ?? seite.h1)}#${anker}`

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
                                width={1920}
                                height={1280}
                                fetchPriority="high"
                            />
                            <div className="hero-foto__schleier" aria-hidden="true"></div>
                            <h1 className="section__title">{seite.h1}</h1>
                        </header>
                    ) : (
                        <h1 className="section__title">{seite.h1}</h1>
                    )}

                    {route?.article ? (
                        <p className="inhalt__byline">
                            Von <Link to="/ueber-uns#gorden-wuebbe">Gorden Wübbe</Link>
                            {aktualisiertText ? (
                                <>
                                    {' '}· Aktualisiert am{' '}
                                    <time dateTime={route.lastmod}>{aktualisiertText}</time>
                                </>
                            ) : null}
                        </p>
                    ) : null}

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
                                <p key={absatz.slice(0, 40)}>{renderTextMitLinks(absatz)}</p>
                            ))}
                            {abschnitt.liste ? (
                                <ul className="inhalt__liste">
                                    {abschnitt.liste.map((punkt) => (
                                        <li key={punkt.slice(0, 40)}>{renderTextMitLinks(punkt)}</li>
                                    ))}
                                </ul>
                            ) : null}
                            {abschnitt.links ? (
                                <ul className="inhalt__liste">
                                    {abschnitt.links.map((link) => (
                                        <li key={link.href}>
                                            <a href={link.href}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            ) : null}
                        </section>
                    ))}

                    {seite.abgrenzung ? (
                        <section className="inhalt__abgrenzung">
                            <h2>{seite.abgrenzung.titel}</h2>
                            {seite.abgrenzung.absaetze.map((absatz) => (
                                <p key={absatz.slice(0, 40)}>{renderTextMitLinks(absatz)}</p>
                            ))}
                        </section>
                    ) : null}

                    <section className="inhalt__faq">
                        <h2>Häufige Fragen</h2>
                        {seite.faq.map((eintrag) => (
                            <details key={eintrag.frage}>
                                <summary>{eintrag.frage}</summary>
                                <p>{renderTextMitLinks(eintrag.antwort)}</p>
                            </details>
                        ))}
                    </section>

                    <section className="inhalt__cta">
                        <h2>{seite.ctaTitel ?? 'Kostenfrei im Pilot ausprobieren'}</h2>
                        <p>
                            {seite.ctaText ??
                                'Wir richten ein Suchprofil für Ihre Gewerke, Regionen und Auftragsgrößen ein und zeigen Ihnen die ersten Treffer mit Begründung.'}
                        </p>
                        <a
                            className="btn btn--primary"
                            href={kontaktZiel}
                            onClick={() => trackEvent('Pilot-CTA-Geklickt', { ziel: kontaktZiel })}
                        >
                            {seite.ctaKnopf ?? 'Kostenfreien Pilotzugang anfragen'}
                        </a>
                        {anker === 'profil' && (
                            <p className="field-hint">0 € in der Pilotphase · unverbindlich · keine Zahlungsdaten nötig.</p>
                        )}
                    </section>

                    {seite.querverweise?.length ? (
                        <nav className="inhalt__verweise" aria-label="Weiterführend">
                            <h2>Weiterführend</h2>
                            <ul>
                                {seite.querverweise.map((verweis) => (
                                    <li key={verweis.path}>
                                        <Link
                                            to={verweis.path}
                                            onClick={() => trackEvent('Querverweis-Geklickt', { ziel: verweis.path, ort: 'verweise' })}
                                        >
                                            {verweis.text}
                                        </Link>
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
