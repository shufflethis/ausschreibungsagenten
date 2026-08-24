# Arbeitsplan Agent-Readiness (is-agentic / Ora)

Stand: 24.08.2026 · Scan-Snapshot `2026-08-24T00-16-36-353Z` · **87/100**
Quelle: https://is-agentic.com/scan/www.ausschreibungsagenten.de

Punkteverteilung im Snapshot: Essential 66,2/80 (8 von 11 Checks) · Recommended
15,6/20 (15 von 22) · Bonus +5 (35 positive Signale, Deckel erreicht).

## Die gepastete Liste ist überholt

Der Report, aus dem die fünf Punkte stammen, ist älter als der Deploy von
`6ea0243..6536ee3`. Gegen den aktuellen Snapshot und gegen eigene Live-Messungen
gilt:

| gepasteter Punkt | tatsächlicher Stand heute |
| --- | --- |
| 01 Agent-friendly 404s | **Partial (50 %)** — der Statuscode stimmt bereits überall, es fehlt nur der Markdown-Body |
| 02 Markdown content negotiation / `Vary` | **erledigt** — `vary: Accept, Accept-Encoding, User-Agent` steht auf `/`, Check ist auf "Passed" |
| 03 Developer resource discoverability | weiterhin **Failed** |
| 04 MCP server / manifest | **Partial** — Server läuft und antwortet, der Scanner scheitert am Handshake (Ursache unten) |
| 05 REST versioning / deprecation | weiterhin **Failed** |

Neu in der aktuellen Fix-Liste, in der gepasteten noch nicht enthalten:
**Scoped permissions** (Failed) und **OAuth 2.0** (Partial) — beide zählen zu den
Essential-Checks und sind damit punktemäßig schwerer als die drei
Recommended-Punkte.

Eigene Messung der 404-Lage (alle sieben Formen liefern korrekt 404):

```text
/does-not-exist-xyz     404      /entwickler/unterseite  404
/api/does-not-exist     404      /partner/xyz            404
/.well-known/nope       404      /foo.md                 404
/assets/nope.js         404
```

**Antwort auf die Frage "Navigation fails safely 1/2 — kriegen wir das hin?":
ja.** Die fehlende Hälfte ist ausschließlich der Markdown-Body auf der
404-Antwort (Aufgabe A1). Das ist ein Nachmittag Arbeit in diesem Repo.

## Drei Bahnen

Rund die Hälfte der offenen Punkte lässt sich **nicht** in diesem Repository
lösen, weil OpenAPI-Spec und MCP-Server aus dem privaten AgentLeads-Backend
kommen. Der Plan trennt deshalb sauber:

- **Bahn A** — dieses Repo, sofort umsetzbar
- **Bahn B** — privates Backend (`~/agentleads-account`), Spec und MCP
- **Bahn C** — Produktentscheidungen, nicht durch Doku heilbar

---

## Bahn A — dieses Repo (sofort)

> **Stand 24.08.2026: A1 bis A4 umgesetzt**, noch nicht committet und nicht
> deployt. Abweichungen von der Planung sind unten je Aufgabe vermerkt. Offen
> aus dieser Bahn bleiben A5 (Rest) und A6.

### A1 · Markdown-404 (Critical access, 50 % → 100 %) — erledigt

Scanner-Evidenz: *"Nonexistent paths return a real HTTP 404. For full credit,
include a short markdown body (site map links, where to look next) so agents can
recover."*

Umsetzung:

1. Neue Funktion `api/not-found.js`. Sie antwortet **immer** mit Status 404 und
   verhandelt den Body: `Accept: text/markdown` oder Agent-User-Agent →
   `text/markdown` mit H1, Kurzbegründung und Linkliste (`/llms.txt`,
   `/sitemap.xml`, `/agents.md`, `/entwickler`, `/status`, `/openapi.json`);
   sonst die gestaltete HTML-Seite. **So umgesetzt:** HTML als Konstante in
   `api/not-found.js`, `public/404.html` entfernt, `scripts/prerender.mjs`
   schreibt daraus `dist/404.html`. Grund: `public/` liegt zur Laufzeit nicht
   im Dateisystem der Function, ein `fs.readFile('public/404.html')` wäre in
   Produktion ohne `includeFiles` fehlgeschlagen.
2. Header setzen: `Vary: Accept, Accept-Encoding, User-Agent`,
   `X-Robots-Tag: noindex`, `Link` auf Sitemap und api-catalog.
3. In `vercel.json` als **letzter** Rewrite `"/(.*)" → "/api/not-found"`
   ergänzen. Vercel prüft erst das Dateisystem, dann die Rewrites — statische
   Seiten, prerenderte Routen, `/api/*`, `/.well-known/*` und die bestehenden
   SPA-Rewrites bleiben unberührt, weil sie vorher greifen.
4. Test in `src/agentReadiness.test.js` ergänzen: Body beginnt mit `#`,
   Content-Type `text/markdown`, Status 404.

Nebenwirkung, bewusst in Kauf genommen: jeder 404 wird zur Function-Invocation
statt zur statischen Datei. Bei diesem Traffic-Volumen unkritisch.

Verifikation:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://www.ausschreibungsagenten.de/gibt-es-nicht
curl -s -H "Accept: text/markdown" https://www.ausschreibungsagenten.de/gibt-es-nicht | head -5
```

### A2 · Fehlende Navigationspfade abfangen — erledigt

Die Testagenten des Scanners sind selbst in 404 gelaufen. Aus den Evaluator
Notes: *"standard navigation paths (/preise, /funktionen, /wie-es-funktioniert)
returned 404s, forcing the agent to rely on prior knowledge."*

Redirects in `vercel.json` ergänzen (jeweils 301 auf den passenden Anker der
Startseite bzw. die passende Seite):

| Quelle | Ziel |
| --- | --- |
| `/preise`, `/pricing`, `/tarife` | `/#preise` |
| `/funktionen`, `/features` | `/#funktionen` |
| `/wie-es-funktioniert`, `/how-it-works` | `/#prozess` |
| `/api` | `/entwickler` |
| `/faq` | `/#faq` |
| `/branchen` (falls gewünscht) | `/#branchen` |

Die Anker sind gegen `src/pages/LandingPage.jsx` geprüft: `preise`, `funktionen`,
`prozess`, `faq`, `branchen`, `vergleich`, `kontakt` existieren. Ein
`#so-funktioniert-es` gibt es **nicht** — Ziel ist `#prozess`. Muster für
Fragment-Redirects liegt mit `/kontakt → /#kontakt` bereits in `vercel.json`.

### A3 · llms.txt als Navigationsindex (Bonus 50 % → 100 %) — erledigt

Scanner-Evidenz: *"starts with a heading and has 73 lines, but it contains no
markdown links."* Die Datei listet nackte URLs. Alle Einträge in
`public/llms.txt` auf `[Titel](URL)` umstellen; die Fließtext-URLs in den
Codeblöcken bleiben, wie sie sind. Zahlt zusätzlich auf A5 (Discoverability)
ein.

### A4 · JSON-LD vervollständigen (Recommended 75 % → 100 %) — erledigt

Scanner-Evidenz: *"JSON-LD Organization with name + description — add url and
sameAs/logo/address for full score."* In `src/components/StrukturierteDaten.jsx`
am Organization-Knoten `url`, `logo`, `address` (PostalAddress Schliemannstraße
23, 10437 Berlin) und `sameAs` (LinkedIn, GitHub, sonstige belegbare Profile)
ergänzen. Für "Schema type breadth" (aktuell 50 %) zusätzlich einen
`Service`-Knoten für die Tender-Suche. Bestehende Tests in
`src/strukturierteDaten.test.jsx` mitziehen.

### A5 · Developer-Discoverability, der Teil, der hier machbar ist

Scanner-Evidenz: *"Agent searched for 'ausschreibungsagenten' developer
resources but found nothing relevant."* Das ist ein **Live-Websuche-Check**.
Was wir liefern können:

- `/entwickler` in Title und H1 zusätzlich mit den Suchbegriffen "API
  Dokumentation" und "Developer" belegen (Title heute: *"API & Agent-Anbindung |
  Ausschreibungen API Deutschland – Ausschreibungsagenten.de"*).
- `/docs` zeigt heute per 307 auf `api.ausschreibungsagenten.de/docs`, also weg
  von der indexierten Domain. Eine eigene, indexierbare Docs-Seite unter
  `www` anlegen, die auf Swagger verlinkt statt weiterzuleiten.
- Die `.md`-Zwillinge (`/entwickler.md`, `/agents.md`, `/auth.md`,
  `/pricing.md`, `/api-policy.md`) in `sitemap.xml` aufnehmen —
  `scripts/sitemap.mjs` erweitern.
- A3 (Markdown-Links in llms.txt).

**Erwartungsmanagement:** dieser Check hängt am Suchindex Dritter. Er wird beim
Rescan morgen mit hoher Wahrscheinlichkeit **nicht** umspringen, egal was wir
heute ausliefern. Nicht als Misserfolg der Maßnahme lesen.

### A6 · Maschinelle Key-Ausgabe dokumentieren

Scanner-Evidenz zu "Agent onboarding friction": *"Onboarding signals described
but not verified live: free tier available, self-serve key generation,
sandbox/test environment, zero-auth access."* Der Self-Service existiert
(`api/signup.js`, Formular auf `/entwickler#api-key`), ist für einen Agenten
aber nur als HTML-Formular sichtbar. Maßnahme: `POST /api/signup` als
dokumentierten, maschinell aufrufbaren Registrierungs-Endpunkt behandeln — in
`auth.md` unter *Register/Claim* mit `register_uri` benennen, in der OpenAPI-
Spec aufführen (Bahn B) und in `agents.md` verlinken.

---

## Bahn B — privates Backend (Spec, MCP)

### B1 · `securitySchemes` deklarieren (Essential, Failed)

Scanner-Evidenz: *"No declared OAuth scopes, security schemes, or
scoped-permission documentation found."* Gemessen bestätigt: die ausgelieferte
`openapi.json` enthält `components.securitySchemes = {}` und `security = []` —
also gar nichts.

Minimale ehrliche Fassung, sofort machbar: `apiKey`-Schema für `X-API-Key`
deklarieren und an jeder geschützten Operation `security` setzen. Danach
benannte Scopes (`tenders:read`, `fulltext:read`, `profiles:read`,
`exports:write`) ergänzen, sobald die Autorisierung sie kennt.

Der Weg über `api/openapi-proxy.js` (Scheme nachträglich injizieren) wäre
schneller, erzeugt aber Drift zwischen Spec und Backend. Nur als
Notfall-Stopgap, nicht als Lösung.

### B2 · Versionierung `/api/v1` (Recommended, Failed)

Scanner-Evidenz: *"No API versioning strategy found — add URL path versioning
(/v1/, /v2/) or a versioned header parameter in your OpenAPI spec."* Der
vorhandene `info.x-deprecation-policy` und `/api-policy.md` genügen dem Check
nicht, weil er die Pfade in der Spec auswertet.

Maßnahme: `/api/v1/...`-Aliase im Backend ausliefern, Pfade oder `servers` in
der Spec entsprechend versionieren, alte Pfade als Alias bestehen lassen. Dazu
`Deprecation`- und `Sunset`-Header tatsächlich senden, wie `/api-policy.md` es
bereits zusagt — heute steht die Zusage ohne Umsetzung im Netz.

Randnotiz: der Scanner hat unter `https://ausschreibungsagenten.de/api/v1`
RateLimit-Header gemessen und daraus "live API" abgeleitet. Das war unsere
404-Catch-all-Funktion. Der Rate-Limit-Check ist also aus dem falschen Grund
grün.

### B3 · MCP-Handshake (Partial, Ursache identifiziert)

Scanner-Evidenz: *"MCP manifest found at /.well-known/mcp.json but protocol
handshake failed."* Eigener Test: der Handshake funktioniert über beide Hosts,
`tools/list` liefert sechs Werkzeuge. Aber:

```text
Request : "protocolVersion": "2025-06-18"
Response: "protocolVersion": "2025-11-25"
```

Der Server antwortet unabhängig von der angefragten Version immer mit
`2025-11-25`. Ein strikter Client wertet eine Version, die er nicht angefragt
hat und nicht kennt, als gescheiterte Aushandlung und bricht ab. **Primärfix:
angefragte Version zurückgeben, wenn sie unterstützt wird**, sonst die höchste
unterstützte.

Sekundäre Hypothese, danach prüfen: `/.well-known/mcp.json` zeigt per Rewrite
auf `server-card.json`. Erwartet wird dort womöglich das
Registry-`server.json`-Format mit `remotes[{type: "streamable-http", url}]`.
Erst B3a ausliefern, rescannen, dann entscheiden.

### B4 · `inputSchema` für zwei MCP-Werkzeuge

Scanner-Evidenz: *"4/6 tools on product MCP have parameter schemas."* Die beiden
Werkzeuge ohne `inputSchema` identifizieren und typisieren.

---

## Bahn C — Produktentscheidungen

### C1 · OAuth 2.0 (Essential, Partial 60 %)

Scanner-Evidenz: *"OAuth mentioned in documentation at /auth.md but no OAuth or
OpenID Connect endpoint responded."* Bestätigt:
`/.well-known/oauth-authorization-server` und `/.well-known/oauth-protected-resource`
liefern 404 auf allen drei Hosts.

Zwei Wege:

1. **Ehrlich und klein:** RFC 9728 Protected-Resource-Metadata für die
   API-Key-geschützte Fläche veröffentlichen, inklusive `scopes_supported` —
   löst nebenbei B1 mit. Kein OAuth behaupten, das es nicht gibt.
2. **Vollständig:** OAuth 2.0 Client Credentials Grant im Backend plus
   Authorization-Server-Metadata. Das ist echte Entwicklungsarbeit, kein
   Doku-Task.

Was wir **nicht** tun: Metadata veröffentlichen, die auf einen nicht
existierenden Authorization Server zeigt. Genau dieses Muster ("described but
not verified live") bestraft der Scanner an anderer Stelle bereits — und es
widerspricht der bewusst zurückhaltenden Außendarstellung (Checkout aus,
Pilotzugang nur per Magic Link).

### C2 · CLI-Tool (Recommended, Failed)

Scanner-Evidenz: *"No CLI tool found."* Ein schlankes npm-Paket
(`npx ausschreibungsagenten suche --land DEU --cpv 45`) um die anonyme
Public-API wäre überschaubar und schlägt zwei Fliegen: der Check selbst **und**
ein unter dem Produktnamen indexierbares Artefakt für A5. Eigenes Repo,
Entscheidung über Aufwand liegt beim Team.

---

## Reihenfolge

**Sprint 1 (dieses Repo, ein Arbeitstag):** A1 → A2 → A3 → A4. Danach Rescan
auslösen. Erwartete Bewegung: 404 auf voll, llms.txt und JSON-LD auf voll,
Navigation 2/2.

**Sprint 2 (Backend, ein bis zwei Tage):** B1 → B3 → B2 → B4. B1 ist der
punktestärkste Einzelposten des ganzen Plans, weil Essential-Checks rund 7,3
Punkte pro Check wiegen gegenüber rund 0,9 bei Recommended.

**Sprint 3 (Entscheidung nötig):** C1 Variante wählen, A5 Rest, A6, C2.

## Punkteerwartung

Grobe Rechnung aus der sichtbaren Gewichtung (Essential 80 Punkte auf 11
Checks, Recommended 20 auf 22, Bonus bereits gedeckelt bei +5):

| Maßnahme | Delta |
| --- | --- |
| A1 Markdown-404 (50 → 100 %) | rund +3,6 |
| B1 securitySchemes (Failed → Passed) | rund +7,3 |
| C1 OAuth (60 → 100 %) | rund +2,9 |
| A3/A4/B2/B3/B4/A6/C2 zusammen | rund +4 |

Nach Sprint 1 und 2 realistisch **91 bis 94**, mit C1 in der vollen Variante
Richtung 96. Die letzten Punkte hängen an A5, und damit an einem fremden
Suchindex.

## Wiederholbare Prüfung

```bash
# 404-Verhalten über mehrere Pfadformen
for p in /gibt-es-nicht /api/gibt-es-nicht /.well-known/nope /entwickler/unterseite; do
  printf "%-26s " "$p"
  curl -s -o /dev/null -w "%{http_code} " "https://www.ausschreibungsagenten.de$p"
  curl -s -o /dev/null -w "md=%{content_type}\n" -H "Accept: text/markdown" \
    "https://www.ausschreibungsagenten.de$p"
done

# MCP-Versionsaushandlung
curl -s -X POST -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"t","version":"1"}}}' \
  https://www.ausschreibungsagenten.de/mcp | head -c 200

# Security-Schemes in der ausgelieferten Spec
curl -s https://www.ausschreibungsagenten.de/openapi.json |
  python3 -c "import sys,json;d=json.load(sys.stdin);print(d['components'].get('securitySchemes'),d.get('security'))"
```

## Umsetzungsnotizen Bahn A

- Die Bot-Erkennung liegt jetzt in `lib/agentenErkennung.js` und wird von
  `middleware.js` und `api/not-found.js` geteilt. Dabei ist `PerplexityBot` in
  die Liste gerutscht — er stand in `robots.txt` auf Allow, fehlte aber im
  Muster der Middleware. Perplexity bekommt damit auf `/` dieselbe
  Markdown-Ansicht wie GPTBot und ClaudeBot.
- `public/404.html` ist entfallen. Einzige Quelle ist die Konstante `HTML` in
  `api/not-found.js`; `scripts/prerender.mjs` schreibt daraus `dist/404.html`.
- Der `Service`-Knoten im JSON-LD steht bewusst **ohne `offers`**: solange der
  Online-Checkout aus ist, wäre eine buchbare Offer eine Zusage, die die
  Website nicht einlöst. Die Preise stehen weiterhin in `/pricing.md`.
- Neue Tests: `src/agentReadiness.test.js` prüft Statuscode, Content-Type,
  `Vary`, `X-Robots-Tag` und die Linkliste der 404-Antwort, dass der
  Auffang-Rewrite der letzte Eintrag ist, dass jeder neue Anker-Redirect auf
  eine `id` zeigt, die es in `LandingPage.jsx` wirklich gibt, und dass die
  llms.txt Markdown-Links enthält. `npm test`: 144 Tests grün, `npm run build`
  läuft durch.
