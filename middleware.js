import { rewrite } from '@vercel/functions'
import { willAgentAnsicht } from './lib/agentenErkennung.js'

export default function middleware(request) {
    const url = new URL(request.url)
    const wantsAgentView = willAgentAnsicht({
        accept: request.headers.get('accept') || '',
        userAgent: request.headers.get('user-agent') || '',
        modus: url.searchParams.get('mode'),
    })

    if (wantsAgentView) {
        return rewrite(new URL('/api/agent-view', request.url))
    }
}

export const config = {
    matcher: '/',
    runtime: 'edge',
}
