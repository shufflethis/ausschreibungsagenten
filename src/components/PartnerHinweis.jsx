import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
    COOKIE_TAGE,
    codeAusSuche,
    einwilligungLesen,
    einwilligungSchreiben,
    partnerCodeLesen,
    partnerCodeSchreiben,
} from '../lib/partnerCode'

// Fragt die Einwilligung fuer das Partner-Cookie ab - und zwar nur dann,
// wenn tatsaechlich ein `?via=` in der URL steht. Besucher ohne
// Partner-Link sehen nichts, und die Seite bleibt fuer sie cookiefrei,
// wie sie es heute ist. Ein seitenweites Banner waere fuer ein einziges
// Cookie unverhaeltnismaessig.
//
// Waechst die Seite auf mehrere einwilligungspflichtige Cookies, wird
// daraus eine richtige Einwilligungsverwaltung - dann aber als eigenes
// Vorhaben, nicht als Nebenwirkung hier.
export default function PartnerHinweis() {
    const { search } = useLocation()
    const [sichtbar, setSichtbar] = useState(false)
    const [code, setCode] = useState(null)

    useEffect(() => {
        const gefunden = codeAusSuche(search)
        if (!gefunden) return

        // Liegt der Code schon als Cookie vor, ist die Frage beantwortet.
        // First-Touch gilt: der erste Partner behaelt die Zuordnung.
        if (partnerCodeLesen()) return

        const entscheidung = einwilligungLesen()
        if (entscheidung === 'nein') return
        if (entscheidung === 'ja') {
            partnerCodeSchreiben(gefunden)
            return
        }

        setCode(gefunden)
        setSichtbar(true)
    }, [search])

    if (!sichtbar || !code) return null

    function zustimmen() {
        einwilligungSchreiben('ja')
        partnerCodeSchreiben(code)
        setSichtbar(false)
    }

    function ablehnen() {
        einwilligungSchreiben('nein')
        setSichtbar(false)
    }

    return (
        <div className="partner-hinweis" role="dialog" aria-labelledby="partner-hinweis-titel">
            <div className="partner-hinweis__inhalt">
                <div className="partner-hinweis__text">
                    <p id="partner-hinweis-titel" className="partner-hinweis__titel">
                        Sie kommen über einen Partnerlink
                    </p>
                    <p>
                        Mit Ihrem Einverständnis merken wir uns für {COOKIE_TAGE} Tage, wer Sie
                        empfohlen hat, damit dieser Partner bei einem Vertragsabschluss seine
                        Provision erhält. Dafür speichern wir ein Cookie mit der Partnerkennung —
                        sonst nichts. Ohne Ihr Einverständnis funktioniert die Seite unverändert.{' '}
                        <Link to="/datenschutz">Mehr dazu in der Datenschutzerklärung</Link>.
                    </p>
                </div>
                <div className="partner-hinweis__aktionen">
                    <button type="button" className="btn btn--primary" onClick={zustimmen}>
                        Einverstanden
                    </button>
                    <button type="button" className="btn btn--outline" onClick={ablehnen}>
                        Nicht speichern
                    </button>
                </div>
            </div>
        </div>
    )
}
