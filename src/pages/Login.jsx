import { Helmet } from 'react-helmet-async'
import { appUrl } from '../config/appOrigin'

export default function Login() {
    return (
        <section className="section account-entry">
            <Helmet>
                <title>Login | Ausschreibungsagenten.de</title>
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>
            <div className="container">
                <div className="account-entry__card">
                    <span className="section__label">Kundenbereich</span>
                    <h1 className="section__title">Anmelden</h1>
                    <p className="section__subtitle">
                        Geben Sie die geschäftliche E-Mail-Adresse ein, für die Ihr Zugang eingerichtet wurde. Wir senden
                        Ihnen einen Anmeldelink – ein Passwort brauchen Sie nicht.
                    </p>
                    <form className="account-entry__form" method="post" action={appUrl('/login')}>
                        <input type="hidden" name="next" value="/app" />
                        <div className="form-group">
                            <label htmlFor="login-email">Geschäftliche E-Mail-Adresse</label>
                            <input id="login-email" name="email" type="email" autoComplete="email" required />
                        </div>
                        <button className="btn btn--primary" type="submit">Anmeldelink anfordern</button>
                    </form>
                    <p className="account-entry__note">
                        Der Link ist 15 Minuten gültig und nur einmal verwendbar. Aus Sicherheitsgründen sehen Sie
                        nach dem Absenden immer dieselbe Bestätigung.
                    </p>
                </div>
            </div>
        </section>
    )
}
