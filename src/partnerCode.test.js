import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
    COOKIE_TAGE,
    EINWILLIGUNG_SCHLUESSEL,
    PARTNER_COOKIE,
    codeAusSuche,
    einwilligungLesen,
    einwilligungSchreiben,
    istGueltigerCode,
    partnerCodeLesen,
    partnerCodeSchreiben,
} from './lib/partnerCode'

// Minimaler Cookie-Speicher: `document.cookie` verhaelt sich beim Setzen
// wie ein Append und beim Lesen wie eine Liste. jsdom bildet das ab, aber
// nicht die Domain-Regeln - fuer die Attributpruefung brauchen wir den
// gesetzten Rohwert.
function dokumentMock(vorhanden = '') {
    return {
        cookie: vorhanden,
        gesetzt: [],
        set _(_wert) {},
    }
}

function dokumentMitSchreiben(vorhanden = '') {
    const eintraege = vorhanden ? [vorhanden] : []
    const gesetzt = []
    return {
        gesetzt,
        get cookie() {
            return eintraege.join('; ')
        },
        set cookie(wert) {
            gesetzt.push(wert)
            eintraege.push(wert.split(';')[0])
        },
    }
}

function speicherMock(anfang = {}) {
    const daten = { ...anfang }
    return {
        getItem: (k) => (k in daten ? daten[k] : null),
        setItem: (k, v) => {
            daten[k] = String(v)
        },
        daten,
    }
}

const PROD = { hostname: 'www.ausschreibungsagenten.de', protocol: 'https:' }
const LOKAL = { hostname: 'localhost', protocol: 'http:' }

describe('Partner-Code aus der URL', () => {
    it('nimmt einen gueltigen Code an', () => {
        expect(codeAusSuche('?via=TESTPARTNER1')).toBe('TESTPARTNER1')
        expect(codeAusSuche('?utm_source=x&via=a_b-C9')).toBe('a_b-C9')
    })

    it('verwirft ungueltige Codes, statt sie zurechtzuschneiden', () => {
        expect(codeAusSuche('?via=<script>')).toBeNull()
        expect(codeAusSuche(`?via=${'x'.repeat(51)}`)).toBeNull()
        expect(codeAusSuche('?via=')).toBeNull()
        expect(codeAusSuche('?via=hat leerzeichen')).toBeNull()
    })

    it('bleibt still, wenn kein Code in der URL steht', () => {
        expect(codeAusSuche('')).toBeNull()
        expect(codeAusSuche('?utm_source=newsletter')).toBeNull()
    })

    it('haelt sich an die Laenge aus partner_programs.tracking_code', () => {
        expect(istGueltigerCode('x'.repeat(50))).toBe(true)
        expect(istGueltigerCode('x'.repeat(51))).toBe(false)
    })
})

describe('Cookie erst nach Einwilligung', () => {
    let dokument
    let speicher

    beforeEach(() => {
        dokument = dokumentMitSchreiben()
        speicher = speicherMock()
    })

    // Der Fall, der ohne ausdruecklichen Test durchrutscht: die Logik
    // funktioniert, aber niemand prueft, dass sie vorher schweigt.
    it('schreibt ohne Einwilligung kein Cookie', () => {
        const code = codeAusSuche('?via=TESTPARTNER1')
        expect(code).toBe('TESTPARTNER1')
        expect(einwilligungLesen(speicher)).toBeNull()
        expect(dokument.cookie).toBe('')
    })

    it('schreibt das Cookie nach erteilter Einwilligung', () => {
        einwilligungSchreiben('ja', speicher)
        const geschrieben = partnerCodeSchreiben('TESTPARTNER1', { dokument, ort: PROD })

        expect(geschrieben).toBe(true)
        expect(einwilligungLesen(speicher)).toBe('ja')
        expect(partnerCodeLesen(dokument)).toBe('TESTPARTNER1')
    })

    it('merkt sich eine Ablehnung', () => {
        einwilligungSchreiben('nein', speicher)
        expect(einwilligungLesen(speicher)).toBe('nein')
        expect(speicher.daten[EINWILLIGUNG_SCHLUESSEL]).toBe('nein')
    })

    it('verwirft ungueltige Codes auch mit Einwilligung', () => {
        einwilligungSchreiben('ja', speicher)
        expect(partnerCodeSchreiben('<script>', { dokument, ort: PROD })).toBe(false)
        expect(dokument.cookie).toBe('')
    })
})

describe('First-Touch', () => {
    it('ueberschreibt einen bestehenden Code nicht', () => {
        const dokument = dokumentMitSchreiben(`${PARTNER_COOKIE}=ERSTER`)

        const geschrieben = partnerCodeSchreiben('ZWEITER', { dokument, ort: PROD })

        expect(geschrieben).toBe(false)
        expect(partnerCodeLesen(dokument)).toBe('ERSTER')
    })
})

describe('Cookie-Attribute', () => {
    it('setzt auf der eigenen Domain Domain und Secure', () => {
        const dokument = dokumentMitSchreiben()
        partnerCodeSchreiben('TESTPARTNER1', { dokument, ort: PROD })

        const roh = dokument.gesetzt[0]
        // Domain ueber alle Subdomains: nur so erreicht der Code den
        // Checkout auf app.ausschreibungsagenten.de.
        expect(roh).toContain('Domain=.ausschreibungsagenten.de')
        expect(roh).toContain('Secure')
        expect(roh).toContain('SameSite=Lax')
        expect(roh).toContain(`Max-Age=${COOKIE_TAGE * 24 * 60 * 60}`)
    })

    it('laesst Domain und Secure auf localhost weg, sonst kaeme das Cookie nie an', () => {
        const dokument = dokumentMitSchreiben()
        partnerCodeSchreiben('TESTPARTNER1', { dokument, ort: LOKAL })

        const roh = dokument.gesetzt[0]
        expect(roh).not.toContain('Domain=')
        expect(roh).not.toContain('Secure')
        expect(partnerCodeLesen(dokument)).toBe('TESTPARTNER1')
    })
})

describe('ohne Browser-Umgebung', () => {
    // entry-server.jsx rendert dieselben Komponenten ohne document und
    // localStorage. Dafuer reicht es nicht, null zu uebergeben - dann
    // greift der Rueckfall auf die Globals. Die Globals muessen weg.
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it('wirft beim Serverrendern nicht', () => {
        vi.stubGlobal('document', undefined)
        vi.stubGlobal('localStorage', undefined)

        expect(() => partnerCodeLesen()).not.toThrow()
        expect(partnerCodeLesen()).toBeNull()
        expect(partnerCodeSchreiben('TESTPARTNER1')).toBe(false)
        expect(einwilligungLesen()).toBeNull()
        expect(einwilligungSchreiben('ja')).toBe(false)
    })

    it('haelt einen blockierten localStorage aus', () => {
        vi.stubGlobal('localStorage', {
            getItem() {
                throw new Error('blockiert')
            },
        })

        expect(() => einwilligungLesen()).not.toThrow()
        expect(einwilligungLesen()).toBeNull()
    })

    it('haelt ein leeres Mock-Dokument aus', () => {
        expect(partnerCodeLesen(dokumentMock())).toBeNull()
    })
})
