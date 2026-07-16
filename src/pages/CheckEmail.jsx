import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

export default function CheckEmail() {
    return (
        <section className="section account-entry">
            <Helmet><title>Postfach prüfen | Ausschreibungsagenten.de</title></Helmet>
            <div className="container">
                <div className="account-entry__card">
                    <span className="section__label">Anmeldung angefordert</span>
                    <h1 className="section__title">Postfach prüfen</h1>
                    <p className="section__subtitle">
                        Falls ein aktiver Zugang besteht, wurde ein Anmeldelink versendet. Öffnen Sie die E-Mail
                        und bestätigen Sie die Anmeldung bewusst im Browser.
                    </p>
                    <p className="account-entry__note">
                        Keine E-Mail erhalten? Prüfen Sie Spam-Ordner und Adresse oder fordern Sie nach einigen
                        Minuten einen neuen Link an. Frühere Links werden dabei ungültig.
                    </p>
                    <Link className="btn btn--secondary" to="/login">Zurück zum Login</Link>
                </div>
            </div>
        </section>
    )
}
