import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { appUrl } from '../config/appOrigin'

function browserRedirect(url) {
    window.location.replace(url)
}

export default function MagicHandoff({ expired = false, onRedirect = browserRedirect }) {
    const fragment = typeof window === 'undefined' ? '' : window.location.hash
    const destination = `${appUrl('/auth/magic')}${fragment}`

    useEffect(() => {
        if (!expired && fragment.includes('token=')) onRedirect(destination)
    }, [destination, expired, fragment, onRedirect])

    if (expired) {
        return (
            <section className="section account-entry"><div className="container"><div className="account-entry__card">
                <Helmet><title>Link abgelaufen | Ausschreibungsagenten.de</title></Helmet>
                <h1 className="section__title">Link abgelaufen oder bereits verwendet</h1>
                <p className="section__subtitle">Fordern Sie einen neuen Magic Link an. Aus Sicherheitsgründen nennen wir keine weiteren Kontodetails.</p>
                <Link className="btn btn--primary" to="/login">Neuen Link anfordern</Link>
            </div></div></section>
        )
    }

    return (
        <section className="section account-entry"><div className="container"><div className="account-entry__card">
            <Helmet><title>Anmeldung bestätigen | Ausschreibungsagenten.de</title></Helmet>
            <h1 className="section__title">Anmeldung bestätigen</h1>
            <p className="section__subtitle">Sie werden zur sicheren Bestätigungsseite der App weitergeleitet. Der Link wird erst durch Ihren ausdrücklichen Klick verbraucht.</p>
            <a className="btn btn--primary" href={destination}>Bestätigungsseite öffnen</a>
        </div></div></section>
    )
}
