const configuredOrigin = import.meta.env.VITE_APP_BASE_URL || 'https://app.ausschreibungsagenten.de'

export const APP_ORIGIN = configuredOrigin.replace(/\/$/, '')

export function appUrl(path = '/app') {
    const safePath = path.startsWith('/') && !path.startsWith('//') ? path : '/app'
    return `${APP_ORIGIN}${safePath}`
}
