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
                    <span className="section__label">Sicherer Kundenbereich</span>
                    <h1 className="section__title">Mit Magic Link anmelden</h1>
                    <p className="section__subtitle">
                        Geben Sie die geschäftliche E-Mail-Adresse ein, für die Ihr Zugang eingerichtet wurde.
                    </p>
                    <form className="account-entry__form" method="post" action={appUrl('/login')}>
                        <input type="hidden" name="next" value="/app" />
                        <div className="form-group">
                            <label htmlFor="login-email">Geschäftliche E-Mail-Adresse</label>
                            <input id="login-email" name="email" type="email" autoComplete="email" required />
                        </div>
                        <button className="btn btn--primary" type="submit">Magic Link anfordern</button>
                    </form>
                    <p className="account-entry__note">
                        Aus Sicherheitsgründen ist die Antwort immer gleich – unabhängig davon, ob bereits ein
                        aktiver Zugang besteht. Der Link ist 15 Minuten gültig und nur einmal verwendbar.
                    </p>
                </div>
            </div>
        </section>
    )
}
