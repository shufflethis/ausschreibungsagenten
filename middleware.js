import { rewrite } from '@vercel/functions'

const AGENT_USER_AGENT = /GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot/i

export default function middleware(request) {
    const url = new URL(request.url)
    const accept = request.headers.get('accept') || ''
    const userAgent = request.headers.get('user-agent') || ''
    const wantsAgentView =
        accept.includes('text/markdown') ||
        url.searchParams.get('mode') === 'agent' ||
        AGENT_USER_AGENT.test(userAgent)

    if (wantsAgentView) {
        return rewrite(new URL('/api/agent-view', request.url))
    }
}

export const config = {
    matcher: '/',
    runtime: 'edge',
}
