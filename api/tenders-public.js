import { backendGet } from '../lib/backendProxy.js'

const ALLOWED_PARAMS = [
    'country', 'search', 'cpv', 'vertical', 'performance_region',
    'minimum_value_eur', 'maximum_value_eur', 'deadline_within_days',
    'only_active', 'min_score', 'limit', 'offset', 'summary_lang', 'ids',
]

export default function handler(req, res) {
    return backendGet(req, res, {
        name: 'public tender',
        ziel: (basis) => {
            const url = new URL('/api/public/tenders', basis)
            for (const key of ALLOWED_PARAMS) {
                const value = req.query[key]
                if (Array.isArray(value)) {
                    value.forEach((item) => url.searchParams.append(key, item))
                } else if (value !== undefined) {
                    url.searchParams.set(key, value)
                }
            }
            return url
        },
        // Beobachtete IDs (gespeicherte Suchen) muessen frisch sein.
        cache: (url) => (url.searchParams.has('ids') ? 'no-store' : 's-maxage=60, stale-while-revalidate=120'),
    })
}
