import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
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
                <Seo path="/login/abgelaufen" />
                <h1 className="section__title">Link abgelaufen oder bereits verwendet</h1>
                <p className="section__subtitle">Anmeldelinks sind nur kurz gültig und einmal verwendbar. Fordern Sie einfach einen neuen an.</p>
                <Link className="btn btn--primary" to="/login">Neuen Link anfordern</Link>
            </div></div></section>
        )
    }

    return (
        <section className="section account-entry"><div className="container"><div className="account-entry__card">
            <Seo path="/anmeldung-bestaetigen" />
            <h1 className="section__title">Anmeldung bestätigen</h1>
            <p className="section__subtitle">Sie werden zur Bestätigungsseite weitergeleitet. Dort schließen Sie die Anmeldung mit einem Klick ab.</p>
            <a className="btn btn--primary" href={destination}>Bestätigungsseite öffnen</a>
        </div></div></section>
    )
}
