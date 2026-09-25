import { renderToString } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import StrukturierteDaten from './components/StrukturierteDaten'

function jsonLd(pfad, faq) {
    const markup = renderToString(<StrukturierteDaten path={pfad} faq={faq} />)
    const roh = markup
        .replace(/^[\s\S]*?<script type="application\/ld\+json">/, '')
        .replace(/<\/script>[\s\S]*$/, '')
    return JSON.parse(roh)
}

describe('Strukturierte Daten', () => {
    it('nennt die Brotkrumenspur der jeweiligen Seite', () => {
        const daten = jsonLd('/ueber-uns')
        const spur = daten['@graph'].find((k) => k['@type'] === 'BreadcrumbList')
        expect(spur.itemListElement).toHaveLength(2)
        expect(spur.itemListElement[1].item).toContain('/ueber-uns')
    })

    it('laesst die Brotkrumenspur der Startseite einstufig', () => {
        const daten = jsonLd('/')
        const spur = daten['@graph'].find((k) => k['@type'] === 'BreadcrumbList')
        expect(spur.itemListElement).toHaveLength(1)
    })

    it('ergaenzt eine FAQ, wenn Fragen uebergeben werden', () => {
        const daten = jsonLd('/', [{ frage: 'Was kostet es?', antwort: 'Pro kostet 149 Euro pro Monat.' }])
        const faq = daten['@graph'].find((k) => k['@type'] === 'FAQPage')
        expect(faq.mainEntity[0].name).toBe('Was kostet es?')
        expect(faq.mainEntity[0].acceptedAnswer.text).toContain('149')
    })

    it('laesst die FAQ weg, wenn keine Fragen uebergeben werden', () => {
        const daten = jsonLd('/agb')
        expect(daten['@graph'].some((k) => k['@type'] === 'FAQPage')).toBe(false)
    })

    it('kann nicht aus dem script-Tag ausbrechen', () => {
        const markup = renderToString(
            <StrukturierteDaten path="/" faq={[{ frage: '</script><img onerror=x>', antwort: 'harmlos' }]} />,
        )
        expect(markup).not.toContain('</script><img')
        expect(markup).toContain('\\u003c/script')
    })

    it('nennt die Betreiberin mit ladungsfaehiger Anschrift', () => {
        const daten = jsonLd('/')
        const organisation = daten['@graph'].find((k) => k['@type'] === 'Organization')
        expect(organisation.legalName).toContain('Yawusa')
        expect(organisation.address.addressLocality).toBe('Berlin')
    })

    it('beschreibt die Entitaet, nicht nur ihren Namen', () => {
        const organisation = jsonLd('/')['@graph'].find((k) => k['@type'] === 'Organization')
        expect(organisation.description).toContain('17 Vergabequellen')
        expect(organisation.url).toBe('https://www.ausschreibungsagenten.de/')
        expect(organisation.logo['@type']).toBe('ImageObject')
        expect(organisation.logo.url).toContain('/brand/logo-mark.png')
        expect(organisation.logo.width).toBe(1024)
    })

    it('fuehrt den Dienst nur auf der Startseite und ohne buchbare Offer', () => {
        const start = jsonLd('/')['@graph'].find((k) => k['@type'] === 'Service')
        expect(start.provider['@id']).toBe('https://www.ausschreibungsagenten.de/#organisation')
        expect(start.areaServed.length).toBeGreaterThan(1)
        // Solange der Online-Checkout aus ist, waere eine Offer eine
        // Zusage, die die Website nicht einloest.
        expect(start.offers).toBeUndefined()
        expect(jsonLd('/entwickler')['@graph'].some((k) => k['@type'] === 'Service')).toBe(false)
    })

    it('fuehrt Gorden Wuebbe nur auf der Ueber-uns-Seite mit seinen Profilen', () => {
        const person = jsonLd('/ueber-uns')['@graph'].find((k) => k['@type'] === 'Person')
        expect(person.name).toBe('Gorden Wübbe')
        expect(person.sameAs).toContain('https://www.linkedin.com/in/wuebbe')
        expect(person.worksFor[0]['@id']).toBe('https://www.ausschreibungsagenten.de/#organisation')
        expect(jsonLd('/')['@graph'].some((k) => k['@type'] === 'Person')).toBe(false)
    })

    it('nennt den eigenen YouTube-Kanal als Profil derselben Entitaet', () => {
        const daten = jsonLd('/')
        const organisation = daten['@graph'].find((k) => k['@type'] === 'Organization')
        expect(organisation.sameAs).toContain('https://www.youtube.com/@ausschreibungsagenten')
    })
})
