# WebMCP Challenge: Einreichungsmappe

Abgabe: **3. September 2026, 13:00 PT = 22:00 MESZ.** Danach ist das
Formular zu.

Diese Datei ist die Kopiervorlage. Die inhaltliche Herleitung steht in
[`../WEBMCP.md`](../WEBMCP.md); dort liegt auch die von den Regeln geforderte
Abgrenzung „vor dem Einreichungszeitraum vs. darin entstanden".

## Formularfelder

| Feld | Wert |
| --- | --- |
| Live-URL | `https://www.ausschreibungsagenten.de/` |
| Repository | `https://github.com/shufflethis/ausschreibungsagenten` |
| Lizenz | MIT, im Repo-Kopf erkannt |
| Auth für die Jury | keine — die Seite ist offen |
| Video | YouTube, öffentlich, < 3 Minuten, mit Ton |

Kein Test-Login nötig. Die Jury testet im In-App-Browser der ChatGPT-App oder
in Chrome 149+ mit `chrome://flags/#enable-webmcp-testing`.

## Stand

| Punkt | Stand |
| --- | --- |
| Werkzeuge registrieren sich in Chrome 149 | ✅ am 28.08. auf der Live-URL bestätigt |
| Tafel für die Jury lesbar | ✅ sie folgt der Browsersprache — ein englischer Browser sieht eine englische Tafel samt Begründungen. Beim Video-Dreh also mit englischem Browserprofil aufnehmen |
| Öffentliches Repo mit erkannter OSS-Lizenz | ✅ |
| Abgrenzung Vorarbeit/Einreichungszeitraum | ✅ `WEBMCP.md`, dazu die Commit-Historie |
| Beschreibungstext | ✅ unten, englisch |
| Demo-Video | ❌ **offen** — Skript unten |
| Devpost-Registrierung | ❌ **offen**, bis 3. September |

---

## Beschreibungstext (englisch, zum Einfügen)

### Why this use case is a strong fit for WebMCP

Public procurement in Germany publishes more notices than any contractor can
read. The hard part is not finding them — it is deciding, notice by notice,
whether to bid. That go/no-go call costs real money to get wrong, and it needs
two kinds of knowledge that never sit in the same place.

An agent is good at reading twelve notices and pulling out what matters: the CPV
division, days left, the contract value against the applicable EU threshold,
whether the award is on lowest price alone. A human is the only one who knows
whether the crew is free in October, whether that buyer pays on time, and
whether a price-only award is worth the bid cost.

A backend MCP server cannot support that. It hands an agent JSON and leaves the
human out of the loop. Screen-scraping agents are the other failure mode: the
person watches software guess its way through a UI it does not understand, with
no shared artifact to argue with. WebMCP is the only surface where both parties
work on the same visible state.

### How it creates a better user experience

State-changing tool calls change what is on the screen. When the agent searches,
the result list on the page reloads. When it shortlists a tender, a card appears
on a go/no-go board with its reasons spelled out. Read-only tools return that
same visible state and reasoning instead of maintaining a hidden second copy.

The reasons come from fields the result card never shows: CPV division, place of
performance, days to deadline, value against the EU threshold for that contract
type, award criteria, number of lots, framework agreement, GPA coverage. Each
carries a sign — for, against, or worth checking — and an explicit count. No
tool returns a recommendation. The decision stays with the person, and
`set_decision` says so in its own description.

The human can override anything by clicking. The agent reads those overrides
back on its next call.

### What people and agents can do together that was difficult before

Ask: *"Search facade tenders in Germany, put the three with the longest
deadlines on the board, and tell me which are worth bidding on."*

The agent searches — the page changes. It shortlists three; three cards appear,
each with its reasons. You read them, click **No-Go** on one because that city is
out of range, and say so. The agent calls `list_shortlist`, sees a decision it
did not make, and works with the remaining two.

That loop — an agent reading back a human judgement made by hand, on the same
artifact, mid-task — is what a backend tool server cannot do. What makes it
useful here is domain knowledge an agent cannot infer from the DOM: the EU
threshold table, the CPV vocabulary, reading `award_criteria` as a bid-cost
signal.

Nothing is submitted and nothing is bought. The contact and pilot forms send
email to real people, so agents may fill them in but never send them — the
honeypot field is excluded from the fill allowlist, not just from the schema.

### How WebMCP was implemented

Eleven tools registered through `document.modelContext.registerTool`, from the
React component whose state they drive, so they never answer from a stale
closure. Unregistration runs through a single `AbortSignal`, as the spec
prescribes.

- `src/lib/webmcp.js` — registration adapter, feature detection, MCP-shaped
  responses. Without a supporting browser nothing runs, and a test asserts that.
- `src/lib/vergabe.js` — EU thresholds, CPV divisions, deadline arithmetic,
  weighted reasons. No DOM, no network.
- `src/lib/merkliste.js` — board persistence; reasons are recomputed on load,
  because deadlines age.
- `vercel.json` — `Origin-Agent-Cluster: ?1`. `registerTool` rejects with
  `SecurityError` in a document that is not origin-keyed.

Tools returning notice text set `untrustedContentHint: true` — that text comes
from 17 third-party procurement portals and must not be read as instructions.

The board follows the browser language, German or English, reasons included.
Only the board: it is the surface the two parties share, and both have to read
it. The rest of the page stays German, because that is who it is for.

43 tests cover the tools and the domain logic, including the one that matters:
a human clicks **Go** in the DOM, and `list_shortlist` reads that decision back.

---

## Video-Skript

Unter drei Minuten heißt: höchstens rund 420 gesprochene Wörter. Englisch, Ton
Pflicht. Chrome 149 mit gesetztem Flag, **englischem Browserprofil** (sonst
rendert die Tafel deutsch), Fenster aufgeräumt, Tafel vorher leeren.

**0:00–0:20 — Das Problem** *(Bild: Landingpage, Trefferliste)*

> German public procurement publishes more notices than any contractor can read.
> Finding them is easy. Deciding which ones to bid on is the expensive part — and
> it needs two kinds of knowledge that never sit in the same place.

**0:20–0:35 — Die Werkzeuge** *(Bild: Model Context Tool Inspector, Liste)*

> This page registers eleven WebMCP tools. Search, details, source freshness, and
> a shared go/no-go board.

**0:35–1:20 — Der Lauf** *(Prompt tippen, Seite im Bild lassen)*

Prompt: *„Search facade tenders in Germany, put the two with the longest
deadlines on the board, and explain them."*

> Watch the page, not the chat. The search runs — the result list changes. Two
> tenders go on the board, each with its reasons: CPV division, place of
> performance, days to deadline, the contract value against the EU threshold for
> construction, whether the award is on price alone, how many lots. Those come
> from fields the result card never shows.

**1:20–1:55 — Der Punkt** *(auf No-Go klicken, dann fragen)*

> Now I disagree. This one is out of range — I click No-Go myself.

Prompt: *„What's on the board now?"*

> It reads back a decision it did not make. That is the whole point: one
> artifact, two parties, and the human keeps the last word.

**1:55–2:25 — Die Grenzen**

> Three things this deliberately does not do. No tool submits a form — the pilot
> request emails a real person, so an agent may fill it in, but sending stays a
> human click. Tools returning notice text are marked as untrusted content;
> that text comes from seventeen third-party portals. And no tool returns a
> recommendation — only arguments with a sign, and a count.

**2:25–2:45 — Abbinder** *(Bild: Repo)*

> Built on a live procurement platform, MIT licensed, eleven tools, forty-three
> tests. The link to the original notice always prevails over anything we show.

**Nicht vergessen:** kein fremdes Markenmaterial, keine geschützte Musik.

## Vor dem Absenden

1. Auf Devpost registrieren (Registrierung endet zeitgleich mit der Abgabe).
2. Video hochladen, **öffentlich** schalten, Link prüfen.
3. Live-URL ein letztes Mal in Chrome 149 durchspielen — die Jury testet dort.
4. Repo-Link prüfen: Lizenz muss im Kopf der Repo-Seite stehen.
5. Beschreibungstext oben einfügen.
