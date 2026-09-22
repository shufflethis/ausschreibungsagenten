import { entscheidungshilfe, fristText, quellenUrl } from '../lib/vergabe'

export default function Entscheidungskarte({ tender, criteria, evidence = {}, onEvidenceChange }) {
    const karte = entscheidungshilfe(tender, criteria)
    const quelle = quellenUrl(tender.source_url)
    const fehlt = karte.nachweise.filter((item) => evidence[item.type] === 'missing')
    return <div className="decision-card">
        <p className="decision-card__intro">Ihre Vorprüfung · Suchkriterien und Originalangaben. Die endgültige Teilnahmeentscheidung treffen Sie.</p>
        <div className={`decision-card__verdict ${karte.ausschluss.length || fehlt.length ? 'has-blocker' : ''}`}>
            <strong>{karte.ausschluss.length ? 'Ausschlussgrund prüfen' : fehlt.length ? `${fehlt.length} Nachweis${fehlt.length === 1 ? '' : 'e'} fehlt` : 'Eignung gezielt prüfen'}</strong>
            <span>{karte.ausschluss.length ? 'Ein von Ihnen gesetztes Kriterium ist nicht erfüllt.' : 'Die Karte zeigt, was belegt ist und was noch offen bleibt.'}</span>
        </div>
        {[
            ['Das passt zur Suche', karte.passend, 'positive'],
            ['Das spricht dagegen', karte.ausschluss, 'negative'],
            ['Noch zu klären', karte.offen, 'open'],
        ].map(([title, items, variant]) => <section className={`decision-card__group is-${variant}`} key={title}>
            <h4>{title}</h4>
            {items.length ? <ul>{items.map((item, index) => <li key={index}>
                <p>{item.text}</p>
                {item.beleg && <blockquote>{item.beleg}</blockquote>}
                {quelle && <a href={quelle} target="_blank" rel="noopener noreferrer">{item.feld} in der Originalquelle ↗</a>}
            </li>)}</ul> : <p className="decision-card__empty">{variant === 'positive' ? 'Wählen Sie ein Gewerk oder eine Leistung für einen konkreten Abgleich.' : 'Kein Ausschluss aus den gewählten Kriterien erkennbar. Das ist noch keine Eignungsbestätigung.'}</p>}
        </section>)}
        <section className="decision-card__group">
            <h4>Fristen aus der Bekanntmachung</h4>
            {tender.deadline_details?.length ? <ul>{tender.deadline_details.map((detail, index) => <li key={index}>{fristText({ deadline_at: detail.at, deadline_details: [detail] })}</li>)}</ul> : <p>Fristart und Uhrzeit sind noch nicht belegt. Bitte im Original prüfen.</p>}
            {tender.deadline_details?.filter((item) => item.kind === 'submission').length > 1 && <p>Mehrere Fristen: Zuordnung zum passenden Los in den Vergabeunterlagen prüfen.</p>}
        </section>
        <section className="decision-card__group">
            <h4>Geforderte Nachweise</h4>
            <p className="decision-card__empty">Nur Anforderungen mit Fundstelle werden aufgeführt. Ihren Nachweisstand markieren Sie selbst.</p>
            {karte.nachweise.length ? <ul>{karte.nachweise.map((item) => <li key={item.type}>
                <strong>{item.text}</strong><blockquote>{item.beleg}</blockquote>
                {quelle && <a href={quelle} target="_blank" rel="noopener noreferrer">Fundstelle in der Bekanntmachung ↗</a>}
                {onEvidenceChange && <label className="decision-card__evidence">Ihr Nachweisstand
                    <select value={evidence[item.type] || ''} onChange={(e) => onEvidenceChange(item.type, e.target.value)}>
                        <option value="">Noch nicht geprüft</option><option value="available">Vorhanden · selbst geprüft</option><option value="missing">Fehlt noch</option>
                    </select>
                </label>}
            </li>)}</ul> : <p>Im Kurztext fehlen belegte Anforderungen. Daraus folgt keine Befreiung von Nachweisen.</p>}
        </section>
        <div className="decision-card__next"><strong>Nächster Schritt</strong>
            <p>{karte.ausschluss.length ? 'Prüfen Sie die markierten Ausschlussgründe. Passt der Auftrag trotzdem, können Sie Ihre Entscheidung mit einer Notiz festhalten.' : fehlt.length ? `Klären Sie zuerst: ${fehlt.map((item) => item.text).join(', ')}.` : 'Öffnen Sie die Vergabeunterlagen, klären Sie Fristen und Eignung und halten Sie anschließend Ihre Entscheidung fest.'}</p>
            <span>{fristText(tender)}</span>
        </div>
    </div>
}
