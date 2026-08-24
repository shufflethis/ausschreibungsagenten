import { willAgentAnsicht } from '../lib/agentenErkennung.js'

// Vercel prueft in dieser Reihenfolge: Redirects, Header, Dateisystem,
// Rewrites. Der Auffang-Rewrite "/(.*)" steht als letzter Eintrag der
// vercel.json und greift deshalb nur, wenn weder eine vorgerenderte
// Seite noch eine statische Datei noch eine andere Function gepasst hat.
//
// Der Statuscode allein genuegt Agenten nicht: wer eine Adresse geraten
// hat, braucht im Rumpf eine Landkarte, sonst endet die Recherche hier.
// Deshalb verhandelt diese Function zwischen Markdown fuer Agenten und
// der gestalteten Seite fuer Menschen. Die aufgerufene Adresse wird
// bewusst nicht in die Antwort gespiegelt: sie ist dem Aufrufer bekannt,
// und ungespiegelter Inhalt kann nicht ausbrechen.

const ZIELE = [
    ['Startseite mit Live-Suche über 17 Vergabequellen', '/'],
    ['llms.txt — Kurzfassung dieser Website für KI-Agenten', '/llms.txt'],
    ['agents.md — wann und wie Agenten diese Quelle nutzen', '/agents.md'],
    ['sitemap.xml — alle indexierten Adressen', '/sitemap.xml'],
    ['OpenAPI-Spezifikation', '/openapi.json'],
    ['API- und Agent-Anbindung (REST, MCP, A2A)', '/entwickler'],
    ['Quellenstatus — Datenstand je Vergabeportal', '/status'],
    ['Über uns', '/ueber-uns'],
]

const ORIGIN = 'https://www.ausschreibungsagenten.de'

const MARKDOWN = `# 404 — Seite nicht gefunden

Diese Adresse gibt es auf ausschreibungsagenten.de nicht. Die Recherche muss
hier nicht enden — die folgenden Einstiege sind stabil.

## Wo es weitergeht

${ZIELE.map(([titel, pfad]) => `- [${titel}](${ORIGIN}${pfad})`).join('\n')}

## Hinweis

Geratene Adressen liefern hier immer HTTP 404, nie eine 200 mit der
Startseite. Wer alle gueltigen Adressen sucht, liest \`${ORIGIN}/sitemap.xml\`.
`

const HTML = `<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="robots" content="noindex" />
    <title>Seite nicht gefunden | Ausschreibungsagenten.de</title>
    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0a0e1a;
            color: #e2e8f0;
            font-family: 'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif;
            text-align: center;
            padding: 2rem;
        }

        main { max-width: 28rem; }

        .code {
            font-size: 4rem;
            font-weight: 700;
            background: linear-gradient(135deg, #06b6d4, #8b5cf6);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            margin-bottom: .5rem;
        }

        h1 { font-size: 1.35rem; margin: 0 0 .75rem; }

        p { color: #94a3b8; line-height: 1.6; margin: 0 0 1.5rem; }

        a.btn {
            display: inline-block;
            padding: .7rem 1.4rem;
            border-radius: .6rem;
            background: linear-gradient(135deg, #06b6d4, #0891b2);
            color: #fff;
            text-decoration: none;
            font-weight: 600;
        }

        a.plain { color: #06b6d4; text-decoration: none; }

        nav { margin-top: 2rem; text-align: left; }

        nav h2 { font-size: .95rem; color: #e2e8f0; margin: 0 0 .6rem; }

        nav ul { list-style: none; padding: 0; margin: 0; }

        nav li { margin: 0 0 .4rem; }

        nav a { color: #06b6d4; text-decoration: none; }

        nav span { color: #64748b; }
    </style>
</head>

<body>
    <main>
        <div class="code">404</div>
        <h1>Diese Seite gibt es nicht (mehr)</h1>
        <p>
            Die aufgerufene Adresse führt ins Leere. Vielleicht hilft die Startseite mit
            der Live-Suche weiter – oder der <a class="plain" href="/status">Quellenstatus</a>.
        </p>
        <a class="btn" href="/">Zur Startseite</a>

        <nav>
            <h2>Wo es weitergeht</h2>
            <ul>
                <li><a href="/">Startseite</a> <span>– Live-Suche über 17 Vergabequellen</span></li>
                <li><a href="/status">Quellenstatus</a> <span>– Datenstand je Portal</span></li>
                <li><a href="/entwickler">API und Agent-Anbindung</a> <span>– REST, OpenAPI, MCP, A2A</span></li>
                <li><a href="/ueber-uns">Über uns</a> <span>– Team und Betreiberin</span></li>
                <li><a href="/partner">Partnerprogramm</a></li>
                <li><a href="/impressum">Impressum</a> · <a href="/datenschutz">Datenschutz</a> · <a href="/agb">AGB</a></li>
                <li><a href="/llms.txt">llms.txt</a> <span>– Kurzfassung dieser Website für KI-Agenten</span></li>
                <li><a href="/sitemap.xml">sitemap.xml</a> <span>– alle indexierten Adressen</span></li>
            </ul>
        </nav>
    </main>
</body>

</html>
`

export { MARKDOWN, HTML }

export default function handler(req, res) {
    const modus = new URL(req.url ?? '/', ORIGIN).searchParams.get('mode')
    const agent = willAgentAnsicht({
        accept: req.headers?.accept ?? '',
        userAgent: req.headers?.['user-agent'] ?? '',
        modus,
    })

    res.setHeader('Content-Type', agent ? 'text/markdown; charset=utf-8' : 'text/html; charset=utf-8')
    res.setHeader('Vary', 'Accept, Accept-Encoding, User-Agent')
    res.setHeader('X-Robots-Tag', 'noindex')
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate')
    res.setHeader(
        'Link',
        '</sitemap.xml>; rel="sitemap"; type="application/xml", ' +
            '</llms.txt>; rel="help"; type="text/plain", ' +
            '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json", ' +
            '</.well-known/api-catalog>; rel="api-catalog"',
    )

    if (req.method === 'HEAD') return res.status(404).end()
    return res.status(404).send(agent ? MARKDOWN : HTML)
}
