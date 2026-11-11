import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function CheckEmail() {
    return (
        <section className="section account-entry">
            <Seo path="/login/postfach" />
            <div className="container">
                <div className="account-entry__card">
                    <span className="section__label">Anmeldung angefordert</span>
                    <h1 className="section__title">Postfach prüfen</h1>
                    <p className="section__subtitle">
                        Falls ein aktiver Zugang besteht, wurde ein Anmeldelink versendet. Öffnen Sie die E-Mail
                        und klicken Sie auf den Link. Auf der folgenden Seite bestätigen Sie die Anmeldung.
                    </p>
                    <p className="account-entry__note">
                        Keine E-Mail erhalten? Prüfen Sie den Spam-Ordner und ob die Adresse stimmt. Nach einigen
                        Minuten können Sie einen neuen Link anfordern; frühere Links werden dabei ungültig.
                    </p>
                    <Link className="btn btn--secondary" to="/login">Zurück zum Login</Link>
                </div>
            </div>
        </section>
    )
}
