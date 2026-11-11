import Seo from '../components/Seo'

export default function CheckoutSuccess() {
    return (
        <>
            <Seo path="/checkout-erfolg" />

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
