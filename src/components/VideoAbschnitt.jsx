import { useContext } from 'react'
import { SITE_ORIGIN } from '../routes'
import { SsrKontext } from './SsrKontext'

// Das Transkript steht bewusst als sichtbarer Text auf der Seite:
// Suchmaschinen und KI-Crawler werten kein Bewegtbild aus, fuer sie ist
// das Transkript die einzige verwertbare Fassung des Videos.
//
// Geladen wird erst auf Klick: preload="none" bei der eigenen Datei,
// loading="lazy" beim eingebetteten Rahmen. Ohne das zoege ein neun
// Minuten langes Video die Ladezeit der Startseite nach unten.
function alsJsonLd(daten) {
    return JSON.stringify(daten).replace(/</g, '\\u003c')
}

export default function VideoAbschnitt({ titel, beschreibung, quelle, transkript }) {
    const beimServerRendern = useContext(SsrKontext)
    const volltext = transkript.map((eintrag) => eintrag.text).join(' ')

    const daten = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: titel,
        description: beschreibung ?? volltext.slice(0, 200),
        transcript: volltext,
        ...(quelle.dauer ? { duration: quelle.dauer } : {}),
        ...(quelle.hochgeladenAm ? { uploadDate: quelle.hochgeladenAm } : {}),
        // Dasselbe Video liegt zusaetzlich auf YouTube. Ohne diesen Verweis
        // halten Suchmaschinen die beiden Kopien fuer unabhaengige Videos,
        // die gegeneinander laufen, statt fuer eine Aufnahme an zwei Orten.
        ...(quelle.auchAuf?.length ? { sameAs: quelle.auchAuf } : {}),
        ...(quelle.art === 'datei'
            ? {
                  contentUrl: `${SITE_ORIGIN}${quelle.url}`,
                  ...(quelle.poster ? { thumbnailUrl: `${SITE_ORIGIN}${quelle.poster}` } : {}),
              }
            : { embedUrl: `https://www.youtube-nocookie.com/embed/${quelle.id}` }),
    }

    return (
        <section className="section video-abschnitt" id="video">
            <div className="container">
                {beimServerRendern ? (
                    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: alsJsonLd(daten) }} />
                ) : null}

                <h2 className="section__title">{titel}</h2>
                {beschreibung ? <p className="section__subtitle">{beschreibung}</p> : null}

                {quelle.art === 'datei' ? (
                    <video
                        className="video-abschnitt__player"
                        controls
                        preload="none"
                        playsInline
                        poster={quelle.poster}
                    >
                        <source src={quelle.url} type="video/mp4" />
                        Ihr Browser kann dieses Video nicht abspielen. Das vollständige Transkript steht darunter.
                    </video>
                ) : (
                    <iframe
                        className="video-abschnitt__player"
                        src={`https://www.youtube-nocookie.com/embed/${quelle.id}`}
                        title={titel}
                        loading="lazy"
                        allowFullScreen
                    />
                )}

                <details className="video-abschnitt__transkript">
                    <summary>Transkript lesen</summary>
                    <dl>
                        {transkript.map((eintrag) => (
                            <div key={eintrag.zeit} className="video-abschnitt__eintrag">
                                <dt>
                                    <span className="video-abschnitt__zeit">{eintrag.zeit}</span> {eintrag.titel}
                                </dt>
                                <dd>{eintrag.text}</dd>
                            </div>
                        ))}
                    </dl>
                </details>
            </div>
        </section>
    )
}
