import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { appUrl } from '../config/appOrigin'

function browserRedirect(url) {
    window.location.replace(url)
}

export default function AppRedirect({ path, title, onRedirect = browserRedirect }) {
    const destination = appUrl(path)
    useEffect(() => onRedirect(destination), [destination, onRedirect])

    return (
        <section className="section account-entry"><div className="container"><div className="account-entry__card">
            {/* Vorlagenzeichenkette statt zweier Kinder: React 19 verlangt
                fuer title genau ein Textkind. */}
            <Helmet><title>{`${title} | Ausschreibungsagenten.de`}</title></Helmet>
            <h1 className="section__title">{title}</h1>
            <p className="section__subtitle">Der geschützte Bereich läuft auf einer eigenen App-Domain. Dort wird Ihre sichere Sitzung geprüft.</p>
            <a className="btn btn--primary" href={destination}>Weiter zum geschützten Bereich</a>
        </div></div></section>
    )
}
