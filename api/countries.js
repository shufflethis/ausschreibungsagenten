import { backendGet } from '../lib/backendProxy.js'

export default function handler(req, res) {
    return backendGet(req, res, {
        name: 'countries',
        ziel: (basis) => new URL('/api/public/countries', basis),
        cache: () => 's-maxage=600, stale-while-revalidate=1800',
    })
}
