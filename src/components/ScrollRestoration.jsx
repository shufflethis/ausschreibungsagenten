import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Wie lange ein Anker nach dem Laden nachgefuehrt wird. Die Startseite laedt
// Inhalte oberhalb von #faq, #preise usw. nach und schiebt das Ziel dabei
// noch nach unten; der native Sprung des Browsers landet dann daneben.
const ANKER_NACHFUEHREN_MS = 2500

// React Router belaesst die Scroll-Position beim Routenwechsel. Ohne
// Hash soll jede neue Seite oben beginnen; mit Hash (z.B. /#kontakt)
// wird das Ziel angesteuert und gehalten, bis das Layout sich beruhigt hat
// oder der Nutzer selbst scrollt.
export default function ScrollRestoration() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        // jsdom (Tests) kennt scrollTo nicht; im Browser immer vorhanden.
        if (typeof window.scrollTo !== 'function') return undefined

        if (!hash) {
            try { window.scrollTo(0, 0) } catch { /* nicht kritisch */ }
            return undefined
        }

        const id = decodeURIComponent(hash.slice(1))
        const ende = Date.now() + ANKER_NACHFUEHREN_MS
        let frame = 0
        let abgebrochen = false
        const abbrechen = () => { abgebrochen = true }
        const nutzerEreignisse = ['wheel', 'touchstart', 'keydown', 'mousedown']
        nutzerEreignisse.forEach((e) => window.addEventListener(e, abbrechen, { passive: true, once: true }))

        const nachfuehren = () => {
            if (abgebrochen) return
            const ziel = document.getElementById(id)
            if (ziel) {
                const abstand = parseFloat(getComputedStyle(ziel).scrollMarginTop) || 0
                // 'instant' statt des globalen scroll-behavior: smooth, sonst
                // startet jede Korrektur eine neue Animation.
                if (Math.abs(ziel.getBoundingClientRect().top - abstand) > 2) {
                    ziel.scrollIntoView({ block: 'start', behavior: 'instant' })
                }
            }
            if (Date.now() < ende) frame = requestAnimationFrame(nachfuehren)
        }
        frame = requestAnimationFrame(nachfuehren)

        return () => {
            cancelAnimationFrame(frame)
            nutzerEreignisse.forEach((e) => window.removeEventListener(e, abbrechen))
        }
    }, [pathname, hash])

    return null
}
