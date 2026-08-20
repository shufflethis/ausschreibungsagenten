// Erfassung des Partner-Codes aus `?via=` fuer das Partnerprogramm.
//
// Zwei Dinge sind hier bewusst so und nicht anders geloest:
//
// 1. Der Code wird erst nach ausdruecklicher Einwilligung in ein Cookie
//    geschrieben. Bis dahin lebt er nur im Speicher der laufenden Seite.
//    Ein Cookie zur Provisionszuordnung ist nicht technisch notwendig und
//    damit einwilligungspflichtig (§ 25 TDDDG).
//
// 2. Das Cookie traegt `Domain=.ausschreibungsagenten.de`, damit der
//    Browser es auch an app.ausschreibungsagenten.de sendet. Nur so
//    ueberlebt der Code den Hostwechsel zwischen Anmeldung auf der
//    Website und Kauf in der Anwendung.
//
// Alle Funktionen sind SSR-sicher: ohne `document` liefern sie null oder
// false, statt zu werfen. src/entry-server.jsx rendert dieselben
// Komponenten ohne Browser-Umgebung.

export const PARTNER_COOKIE = 'aa_partner'
export const EINWILLIGUNG_SCHLUESSEL = 'aa_partner_einwilligung'

// Laenge und Zeichenvorrat folgen `partner_programs.tracking_code
// varchar(50)` in Numok. Was dort nicht gespeichert werden koennte,
// nehmen wir gar nicht erst an.
export const CODE_MUSTER = /^[A-Za-z0-9_-]{1,50}$/

// Entspricht `programs.cookie_days` in Numok. Weichen die Werte
// auseinander, gewinnt Numok bei der Abrechnung - der Wert hier bestimmt
// nur, wie lange wir den Code ueberhaupt mitfuehren.
export const COOKIE_TAGE = 30

const EIGENE_DOMAIN = 'ausschreibungsagenten.de'

export function istGueltigerCode(wert) {
    return typeof wert === 'string' && CODE_MUSTER.test(wert)
}

// Liest den Code aus einem Query-String. Ungueltige Werte werden
// verworfen, nicht bereinigt: ein zurechtgeschnittener Code wuerde einem
// anderen Partner gutgeschrieben.
export function codeAusSuche(suche) {
    if (!suche) return null
    const code = new URLSearchParams(suche).get('via')
    return istGueltigerCode(code) ? code : null
}

function dokumentOder(dokument) {
    if (dokument) return dokument
    return typeof document === 'undefined' ? null : document
}

function speicherOder(speicher) {
    if (speicher) return speicher
    if (typeof localStorage === 'undefined') return null
    try {
        // Bei blockierten Cookies wirft schon der Zugriff.
        localStorage.getItem(EINWILLIGUNG_SCHLUESSEL)
        return localStorage
    } catch {
        return null
    }
}

export function cookieLesen(name, dokument) {
    const doc = dokumentOder(dokument)
    if (!doc) return null
    const treffer = doc.cookie?.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`))
    return treffer ? decodeURIComponent(treffer[1]) : null
}

export function partnerCodeLesen(dokument) {
    const wert = cookieLesen(PARTNER_COOKIE, dokument)
    return istGueltigerCode(wert) ? wert : null
}

// Auf der Produktionsdomain wird das Cookie fuer alle Subdomains gesetzt
// und als `Secure` markiert. Auf localhost und Vorschau-Deployments
// waeren beide Angaben falsch und das Cookie kaeme nie an - dort bleibt
// es ein gewoehnliches Host-Cookie.
function cookieUmgebung(ort) {
    const host = ort?.hostname ?? ''
    const eigen = host === EIGENE_DOMAIN || host.endsWith(`.${EIGENE_DOMAIN}`)
    return {
        domain: eigen ? `.${EIGENE_DOMAIN}` : null,
        secure: eigen || ort?.protocol === 'https:',
    }
}

// First-Touch: ein bereits gesetzter Code wird nie ueberschrieben. Der
// Partner, der den Besucher zuerst gebracht hat, behaelt die Zuordnung.
export function partnerCodeSchreiben(code, { dokument, ort } = {}) {
    if (!istGueltigerCode(code)) return false
    const doc = dokumentOder(dokument)
    if (!doc) return false
    if (partnerCodeLesen(doc)) return false

    const { domain, secure } = cookieUmgebung(ort ?? (typeof location === 'undefined' ? null : location))
    const teile = [
        `${PARTNER_COOKIE}=${encodeURIComponent(code)}`,
        'Path=/',
        `Max-Age=${COOKIE_TAGE * 24 * 60 * 60}`,
        'SameSite=Lax',
    ]
    if (domain) teile.push(`Domain=${domain}`)
    if (secure) teile.push('Secure')

    doc.cookie = teile.join('; ')
    return true
}

export function einwilligungLesen(speicher) {
    const s = speicherOder(speicher)
    if (!s) return null
    const wert = s.getItem(EINWILLIGUNG_SCHLUESSEL)
    if (wert === 'ja' || wert === 'nein') return wert
    return null
}

// Die Entscheidung liegt bewusst in localStorage und nicht in einem
// Cookie: ein Einwilligungs-Cookie braeuchte selbst eine Einwilligung.
export function einwilligungSchreiben(wert, speicher) {
    if (wert !== 'ja' && wert !== 'nein') return false
    const s = speicherOder(speicher)
    if (!s) return false
    s.setItem(EINWILLIGUNG_SCHLUESSEL, wert)
    return true
}
