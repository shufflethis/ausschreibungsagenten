// Eine Stelle fuer die Frage "will hier ein Agent lesen oder ein Mensch?".
// Vorher stand das Muster nur in der middleware.js; die 404-Function
// braucht dieselbe Entscheidung und darf sie nicht abweichend treffen,
// sonst bekaeme derselbe Aufrufer je nach Pfad zwei Darstellungen.
export const AGENT_USER_AGENT =
    /GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot/i

// Guete eines Medientyps im Accept-Kopf nach RFC 9110. Zwei Regeln, die
// den Unterschied machen:
//
// - Markdown zaehlt nur, wenn es woertlich genannt ist. Wer `*/*` oder
//   `text/*` schickt - curl, fetch und die halbe Crawler-Landschaft -
//   will die normale Seite, nicht unsere Agentenfassung.
// - Der q-Wert entscheidet. `text/html,text/markdown;q=0.1` nennt
//   Markdown zwar, will aber eindeutig HTML. Vorher hat ein blosses
//   includes('text/markdown') genau diesen Fall falsch beantwortet.
function guete(accept, typ, { nurExakt = false } = {}) {
    const [hauptTyp] = typ.split('/')
    let beste = -1

    for (const roh of String(accept).split(',')) {
        const teile = roh.trim().split(';')
        const kandidat = teile.shift()?.trim().toLowerCase()
        if (!kandidat) continue

        const passt =
            kandidat === typ || (!nurExakt && (kandidat === '*/*' || kandidat === `${hauptTyp}/*`))
        if (!passt) continue

        let q = 1
        for (const parameter of teile) {
            const [name, wert] = parameter.split('=').map((s) => s.trim().toLowerCase())
            if (name !== 'q') continue
            const zahl = Number.parseFloat(wert)
            if (Number.isFinite(zahl)) q = Math.min(Math.max(zahl, 0), 1)
        }
        if (q > beste) beste = q
    }

    return beste < 0 ? 0 : beste
}

export function willAgentAnsicht({ accept = '', userAgent = '', modus = null }) {
    if (modus === 'agent' || AGENT_USER_AGENT.test(userAgent)) return true

    const markdown = guete(accept, 'text/markdown', { nurExakt: true })
    if (markdown <= 0) return false
    return markdown >= guete(accept, 'text/html')
}
