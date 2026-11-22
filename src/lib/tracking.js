// Schlanke Event-Bruecke zu Plausible (eingebunden in index.html).
// Auf dem Server oder bei blockiertem Skript ein stiller No-op.
export function trackEvent(name, props = {}) {
    if (typeof window === 'undefined' || typeof window.plausible !== 'function') return
    window.plausible(name, {
        props: {
            seite: window.location?.pathname || '/',
            ...props,
        },
    })
}
