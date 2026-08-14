import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router belaesst die Scroll-Position beim Routenwechsel. Ohne
// Hash soll jede neue Seite oben beginnen; mit Hash (z.B. /#kontakt)
// uebernehmen die bestehenden Anker-Sprung-Mechanismen.
export default function ScrollRestoration() {
    const { pathname, hash } = useLocation()

    useEffect(() => {
        if (hash) return
        // jsdom (Tests) kennt scrollTo nicht; im Browser immer vorhanden.
        if (typeof window.scrollTo === 'function') {
            try { window.scrollTo(0, 0) } catch { /* nicht kritisch */ }
        }
    }, [pathname, hash])

    return null
}
