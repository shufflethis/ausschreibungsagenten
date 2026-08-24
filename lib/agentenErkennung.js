// Eine Stelle fuer die Frage "will hier ein Agent lesen oder ein Mensch?".
// Vorher stand das Muster nur in der middleware.js; die 404-Function
// braucht dieselbe Entscheidung und darf sie nicht abweichend treffen,
// sonst bekaeme derselbe Aufrufer je nach Pfad zwei Darstellungen.
export const AGENT_USER_AGENT =
    /GPTBot|ClaudeBot|ChatGPT-User|PerplexityBot|Google-Extended|Applebot-Extended|ora-agent|DeepSeekBot/i

export function willAgentAnsicht({ accept = '', userAgent = '', modus = null }) {
    return accept.includes('text/markdown') || modus === 'agent' || AGENT_USER_AGENT.test(userAgent)
}
