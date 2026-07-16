import { Helmet } from 'react-helmet-async'

export default function CheckoutSuccess() {
    return (
        <>
            <Helmet>
                <title>Checkout abgeschlossen | Ausschreibungsagenten.de</title>
                <meta name="description" content="Sie sind von Stripe zurückgekehrt. Den verbindlichen Abostatus zeigt das Kundenkonto nach Verarbeitung der Zahlungsbestätigung." />
            </Helmet>

            <section className="section checkout-success">
                <div className="container checkout-success__inner">
                    <span className="section__label">
                        <span className="pulse"></span> Rückkehr von Stripe
                    </span>
                    <h1 className="section__title">Checkout abgeschlossen</h1>
                    <p className="section__subtitle">
                        Stripe hat Sie zur Website zurückgeführt. Ihr Abo wird erst freigeschaltet, nachdem das
                        Backend die signierte Zahlungsbestätigung verarbeitet hat. Den verbindlichen Status sehen
                        Sie in Ihrem Kundenkonto.
                    </p>
                    <div className="checkout-success__actions">
                        <a className="btn btn--primary" href="/abrechnung">Abostatus prüfen</a>
                        <a className="btn btn--secondary" href="/#kontakt">Kontakt aufnehmen</a>
                    </div>
                </div>
            </section>
        </>
    )
}
