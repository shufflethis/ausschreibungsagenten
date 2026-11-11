import { rewrite } from '@vercel/functions'
import { willAgentAnsicht } from './lib/agentenErkennung.js'

// Auf der Startseite entscheidet ausschliesslich der ausdrueckliche Wunsch nach
// Markdown (`Accept: text/markdown` oder `?mode=agent`), nicht der User-Agent.
// Sonst bekommen KI-Suchcrawler wie PerplexityBot, ChatGPT-User oder
// Google-Extended auf `/` nur die knappe API-Kurzfassung statt der deutschen
// Startseite mit Preisen, FAQs, Vergleich und Schema.org-Graph (Cloaking-Falle).
// Wer die Maschinenfassung sucht, folgt dem Link-Header auf `/index.md` oder
// sendet `Accept: text/markdown`.
export default function middleware(request) {
    const url = new URL(request.url)
    const wantsAgentView = willAgentAnsicht({
        accept: request.headers.get('accept') || '',
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
