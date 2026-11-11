import { backendGet } from '../lib/backendProxy.js'

export default function handler(req, res) {
    return backendGet(req, res, {
        name: 'source status',
        ziel: (basis) => new URL('/api/source-status', basis),
        cache: () => 's-maxage=300, stale-while-revalidate=600',
    })
}
