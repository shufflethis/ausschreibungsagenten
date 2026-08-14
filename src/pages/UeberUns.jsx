import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

const team = [
    {
        name: 'Gorden Wübbe',
        role: 'Geschäftsführer · Technologie & KI',
        description: 'Gorden verantwortet die technische Plattform hinter Ausschreibungsagenten.de: Datenquellen, Matching, sichere Infrastruktur und die Automatisierung vom Fund bis zur nächsten Aktion.',
        longDescription:
            'Er baut und betreibt die Anbindung der 17 öffentlichen Quellen – von TED über service.bund.de und den Datenservice Öffentlicher Einkauf bis zu den Landesportalen – und legt dabei Wert auf nachvollziehbare Datenpfade: Jede Bekanntmachung bleibt mit Originalquelle, Abrufzeitpunkt und Match-Begründung rekonstruierbar. Datenverarbeitung und KI-Modelle laufen bewusst in der Europäischen Union.',
        image: '/team/gorden-wuebbe.webp',
        accent: 'cyan',
        focus: ['Quellenanbindung & Datenpipeline', 'Matching-Logik & Firmen-Fit', 'Infrastruktur in der EU'],
    },
    {
        name: 'Tobias Sander',
        role: 'Geschäftsführer · Strategie & Produkt',
        description: 'Tobias verbindet Kundenbedarf, Produktentwicklung und digitale Strategie. Er sorgt dafür, dass aus komplexen Vergabeinformationen ein verständliches und praktisch nutzbares Werkzeug wird.',
        longDescription:
            'Er führt die Pilotgespräche mit Unternehmen aus Handwerk, Bau, IT und Marketing und übersetzt deren Vergabealltag in Produktentscheidungen: Welche Angaben braucht eine Go/No-Go-Karte? Welche Exporte landen wirklich im Angebotsprozess? Aus diesen Antworten entstehen Funktionen wie der E-Mail-Digest, das Pilot-Dashboard und der ERP-Export.',
        image: '/team/tobias-sander.webp',
        accent: 'violet',
        focus: ['Pilotprogramm & Kundenarbeit', 'Produktstrategie', 'Vergabeprozesse im Mittelstand'],
    },
    {
        name: 'Thilo Jansen',
        role: 'Geschäftsführer · Qualität & Prozesse',
        description: 'Thilo bringt die Perspektive aus regulierten und verantwortungsvollen Arbeitsfeldern ein. Sein Fokus liegt auf klaren Abläufen, nachvollziehbaren Ergebnissen und einer Einführung, die zum Team passt.',
        longDescription:
            'Er prüft jeden Ablauf auf Nachvollziehbarkeit: Woher stammt ein Treffer, warum wurde er bewertet, wie wird ein Profil eingeführt, ohne den laufenden Betrieb zu stören? Diese Perspektive aus regulierten Arbeitsfeldern sorgt dafür, dass das Werkzeug auch in Unternehmen mit dokumentationspflichtigen Prozessen Vertrauen findet.',
        image: '/team/thilo-jansen.webp',
        accent: 'amber',
        focus: ['Qualitätssicherung & Nachvollziehbarkeit', 'Einführung in bestehende Teams', 'Prozesse in regulierten Umgebungen'],
    },
]

const principles = [
    {
        number: '01',
        title: 'Relevanz statt Trefferflut',
        text: 'Nicht jede Ausschreibung ist eine Chance. Firmenprofil, Region, Leistungsbild und Eignung sollen gemeinsam zeigen, welche Verfahren eine nähere Prüfung verdienen.',
    },
    {
        number: '02',
        title: 'Erklärbar statt Blackbox',
        text: 'Ein Match braucht Gründe. Deshalb machen wir sichtbar, welche Anforderungen passen, welche Nachweise fehlen und wo ein echtes Go oder No-Go liegt.',
    },
    {
        number: '03',
        title: 'Gemeinsam produktiv werden',
        text: 'Wir starten mit echten Suchprofilen und Arbeitsabläufen. Das Feedback aus dem Vergabealltag fließt direkt in die Weiterentwicklung des Produkts ein.',
    },
]

const aboutFaqs = [
    {
        frage: 'Wer steht hinter Ausschreibungsagenten.de?',
        antwort: 'Ausschreibungsagenten.de wird von der Yawusa UG (haftungsbeschränkt) aus Berlin betrieben. Hinter der Plattform stehen drei Geschäftsführer: Gorden Wübbe (Technologie & KI), Tobias Sander (Strategie & Produkt) und Thilo Jansen (Qualität & Prozesse).',
    },
    {
        frage: 'Wo sitzt Ausschreibungsagenten.de und wo werden Daten verarbeitet?',
        antwort: 'Der Sitz ist in Berlin, Schliemannstraße 23, 10437 Berlin. Datenverarbeitung und eingesetzte KI-Modelle laufen bewusst in der Europäischen Union – ein entscheidender Punkt für Unternehmen mit hohen Anforderungen an Datenschutz und Compliance.',
    },
    {
        frage: 'Für welche Unternehmen arbeitet das Team?',
        antwort: 'Im Pilot arbeiten wir mit Unternehmen aus Handwerk, Bau, IT, Marketing und weiteren Dienstleistungsbranchen – vom kleinen Betrieb bis zum etablierten Mittelständler. Entscheidend ist nicht die Größe, sondern der Wunsch, öffentliche Ausschreibungen systematisch statt zufällig zu finden.',
    },
    {
        frage: 'Wie kann ich mit dem Team in Kontakt treten?',
        antwort: 'Am schnellsten per E-Mail an hi@ausschreibungsagenten.de oder telefonisch unter +49 30 403665430. Im Pilot stimmen wir Suchprofil, Branchen und Regionen persönlich ab – bewusst ohne anonymen Self-Service.',
    },
]

export default function UeberUns() {
    return (
        <div className="about-page">
            <Seo path="/ueber-uns" faq={aboutFaqs} />

            <section className="about-hero">
                <div className="container about-hero__inner">
                    <div className="section__label"><span className="pulse" /> Über uns</div>
                    <h1>Menschen für Entscheidungen.<br /><span>Agenten für die Suche.</span></h1>
                    <p className="about-hero__lead">
                        Ausschreibungsagenten.de entsteht aus einer einfachen Überzeugung: Unternehmen sollten ihre Zeit
                        in gute Angebote investieren – nicht in die tägliche Suche durch unzählige Vergabeportale.
                    </p>
                    <p className="about-hero__text">
                        Wir verbinden Technologie, Produktentwicklung und Prozesserfahrung, um öffentliche Ausschreibungen
                        zentral auffindbar, nachvollziehbar bewertbar und im Team bearbeitbar zu machen. Dabei entwickeln
                        wir nah an den Menschen, die täglich über ein Go oder No-Go entscheiden.
                    </p>
                    <div className="about-hero__actions">
                        <a href="mailto:hi@ausschreibungsagenten.de" className="btn btn--primary">Mit uns sprechen →</a>
                        <Link to="/#suche" className="btn btn--outline">Live-Suche ansehen</Link>
                    </div>
                </div>
            </section>

            <section className="section section--alt about-mission">
                <div className="container">
                    <div className="about-section-heading">
                        <div>
                            <div className="section__label section__label--amber">Unsere Arbeitsweise</div>
                            <h2 className="section__title">Was uns bei der Entwicklung leitet</h2>
                        </div>
                        <p className="section__subtitle">
                            KI soll Recherchearbeit reduzieren und Entscheidungen besser vorbereiten. Die fachliche
                            Verantwortung bleibt bei den Menschen im Unternehmen.
                        </p>
                    </div>

                    <div className="about-principles">
                        {principles.map((principle) => (
                            <article className="about-principle" key={principle.number}>
                                <span>{principle.number}</span>
                                <h3>{principle.title}</h3>
                                <p>{principle.text}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section about-team">
                <div className="container">
                    <div className="about-team__intro">
                        <div className="section__label section__label--violet">Das Team</div>
                        <h2 className="section__title">Drei Perspektiven, ein gemeinsames Produkt</h2>
                        <p className="section__subtitle">
                            Hinter Ausschreibungsagenten.de steht das Gründerteam von Agentifizierung. Gemeinsam bauen
                            wir ein Werkzeug, das aus öffentlicher Vergabeinformation konkrete nächste Schritte macht.
                        </p>
                    </div>

                    <div className="about-team__grid">
                        {team.map((member) => (
                            <article className={`team-card team-card--${member.accent}`} key={member.name}>
                                <div className="team-card__image">
                                    <img src={member.image} alt={`${member.name}, ${member.role}`} loading="lazy" />
                                </div>
                                <div className="team-card__content">
                                    <span className="team-card__role">{member.role}</span>
                                    <h3>{member.name}</h3>
                                    <p>{member.description}</p>
                                    {member.longDescription && <p>{member.longDescription}</p>}
                                    {member.focus && (
                                        <ul className="team-card__focus">
                                            {member.focus.map((punkt) => (
                                                <li key={punkt}>{punkt}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section section--alt about-origin">
                <div className="container">
                    <div className="about-origin__card">
                        <div>
                            <span className="about-origin__eyebrow">Entwickelt in Berlin</span>
                            <h2>Ein Service von Agentifizierung</h2>
                            <p>
                                Agentifizierung baut produktive KI-Agenten für bestehende Geschäftsprozesse.
                                Ausschreibungsagenten.de überträgt diesen Ansatz auf die Recherche, Bewertung und
                                Bearbeitung öffentlicher Ausschreibungen.
                            </p>
                        </div>
                        <a
                            href="https://www.agentifizierung.de/"
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn--outline"
                        >
                            Agentifizierung kennenlernen ↗
                        </a>
                    </div>
                </div>
            </section>

            <section className="section about-faq">
                <div className="container">
                    <div className="about-section-heading">
                        <div>
                            <div className="section__label"><span className="pulse" /> Häufige Fragen</div>
                            <h2 className="section__title">Fragen an das Team</h2>
                        </div>
                        <p className="section__subtitle">
                            Die Antworten, die im Pilot am häufigsten nachgefragt werden – kurz und direkt,
                            wie wir arbeiten.
                        </p>
                    </div>
                    <div className="about-faq__list">
                        {aboutFaqs.map((eintrag) => (
                            <details className="about-faq__item" key={eintrag.frage}>
                                <summary>{eintrag.frage}</summary>
                                <p>{eintrag.antwort}</p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
