import { Helmet } from 'react-helmet-async'

export default function CheckoutSuccess() {
    return (
        <>
            <Helmet>
                <title>Checkout erfolgreich | Ausschreibungsagenten.de</title>
                <meta name="description" content="Ihr Ausschreibungsagent ist bezahlt. Wir bereiten die nächsten Ausschreibungs-Treffer und Teilnahme-Schritte vor." />
            </Helmet>

            <section className="section checkout-success">
                <div className="container checkout-success__inner">
                    <span className="section__label">
                        <span className="pulse"></span> Checkout erfolgreich
                    </span>
                    <h1 className="section__title">Ihr Ausschreibungsagent ist aktiviert</h1>
                    <p className="section__subtitle">
                        Die Zahlung ist angekommen. Wir prüfen Ihr Profil, priorisieren passende Ausschreibungen
                        und melden uns mit den nächsten konkreten Schritten.
                    </p>
                    <div className="checkout-success__actions">
                        <a className="btn btn--primary" href="/#suche">Weitere Ausschreibungen ansehen</a>
                        <a className="btn btn--secondary" href="/#kontakt">Kontakt aufnehmen</a>
                    </div>
                </div>
            </section>
        </>
    )
}
