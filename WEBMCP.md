# WebMCP on ausschreibungsagenten.de

Live URL: <https://www.ausschreibungsagenten.de/>

This document describes the WebMCP implementation on this site: what it does, why
this use case fits WebMCP, and — because this is a pre-existing project — exactly
which parts were built during the WebMCP Challenge submission period.

## What the site is

Ausschreibungsagenten.de indexes public procurement notices from 17 connected
sources (TED, service.bund.de, Datenservice Öffentlicher Einkauf, DTVP, RIB, nine
German state and regional portals, and the UK's Find a Tender and Contracts
Finder). A company describes what it does; the platform matches notices against
that profile and shows *why* each notice matched.

The hard part of public procurement is not finding notices. It is deciding, for
each one, whether to bid — a go/no-go call that costs real money to get wrong. A
mid-size contractor sees dozens of plausible notices a week and can seriously bid
on maybe two.

## Why this is a good fit for WebMCP

Go/no-go is a judgement call that neither party should make alone. The agent is
good at reading twelve notices and pulling out the facts that matter. The human
is the only one who knows whether the crew is free in October, whether that
particular buyer pays on time, and whether a pure lowest-price award is worth the
bid cost.

A backend MCP server cannot support that. It hands the agent JSON and leaves the
human out of the loop entirely. Screen-scraping agents are the other failure
mode: the human watches an agent guess its way through a UI it does not
understand, and has no shared artifact to argue with.

WebMCP gives both parties the same board. State-changing tool calls update what
is on the screen; read-only tools return that same visible state and reasoning.
The human can override any of it by clicking, and the agent reads those
overrides back on its next call. That is the collaborative workflow the WebMCP
spec describes, applied to a decision that genuinely needs two kinds of
knowledge.

The board renders in the viewer's browser language, German or English, reasons
included. Person and agent always see the same wording — a board the human
cannot read would defeat the point of putting the reasoning on screen at all.

## What people and agents can do together here that was hard before

Ask an agent: *"Search facade tenders in Germany, put the three with the longest
deadlines on the board, and tell me which ones are worth bidding on."*

The agent calls `search_tenders` — the visible result list on the page changes.
It calls `shortlist_tender` three times; three cards appear on the go/no-go
board, each with reasons derived from fields the human never sees on a result
card: CPV division, place of performance, days remaining, contract value against
the applicable EU threshold, whether the award is on price alone, how many lots
there are, whether it is a framework agreement, whether it is GPA-covered.

The human reads the reasons, clicks **No-Go** on one because Leipzig is out of
range, and says so. The agent calls `list_shortlist`, sees that decision — one it
did not make — and works with the remaining two. Nothing was submitted, nothing
was bought, and the human can see every step.

The pieces that make this work are specific to this domain and not something an
agent could infer from the DOM: the EU threshold table, the CPV division
vocabulary, the reading of `award_criteria` as a bid-cost signal.

## The tools

All tools are registered on the landing page through `document.modelContext`.

| Tool | Effect on the page |
| --- | --- |
| `search_tenders` | Sets query, country, performance region, trade (`vertical`), minimum score and result count; the result list reloads visibly |
| `list_visible_tenders` | Returns what is currently displayed |
| `open_tender` | Opens the detail view for one result |
| `source_status` | Reports the 17 connected sources and their last successful poll |
| `prefill_pilot_profile` | Fills the pilot request form — **never submits it** |
| `shortlist_tender` | Puts a tender on the shared go/no-go board with computed reasons |
| `explain_fit` | Returns weighted reasons without touching the board |
| `set_decision` | Records a go/no-go decision the user made, with their reasoning |
| `remove_from_shortlist` | Takes a tender off the board |
| `list_shortlist` | Reads the board back, including decisions made by hand |
| `check_eu_threshold` | Checks a contract value against the 2026/2027 EU thresholds |

Deliberate constraints:

- **No tool submits a form.** The contact and pilot forms send email to real
  people. Agents may fill them in; the send is the human's click. The spam
  honeypot field is excluded from the fill allowlist, not just from the schema.
- **Tools returning notice text set `untrustedContentHint: true`.** That text
  comes from 17 third-party procurement portals and must not be read by the agent
  as instructions.
- **No tool returns a recommendation.** `explain_fit` and `shortlist_tender`
  return arguments with a sign and an explicit balance count. The decision is the
  user's, and `set_decision` says so in its own description.

## How it is implemented

| File | Role |
| --- | --- |
| `src/lib/webmcp.js` | Registration adapter: feature detection, `registerTool` per tool, unregistration through one `AbortSignal`, MCP-shaped responses |
| `src/lib/vergabe.js` | Domain logic: EU thresholds, CPV divisions, deadline arithmetic, weighted fit reasons. No DOM, no network |
| `src/lib/sprache.js`, `src/lib/tafelTexte.js` | The board follows the browser language — German or English. Only the board: it is the surface people and agents share, and both must be able to read it. The rest of the page is marketing copy for the German market |
| `src/lib/merkliste.js` | Board persistence in `localStorage`; reasons are recomputed on load because deadlines age |
| `src/pages/LandingPage.jsx` | Tool registration and the visible board; tools read live state through a ref so they never answer from a stale closure |
| `vercel.json` | `Origin-Agent-Cluster: ?1` — `registerTool` rejects with `SecurityError` in a document that is not origin-keyed |

Registration is a progressive enhancement: without a supporting browser nothing
runs, and `src/webmcpWerkzeuge.test.jsx` asserts that.

### Testing it

- Chrome 149+: enable `chrome://flags/#enable-webmcp-testing`, restart, open the
  live URL. The Model Context Tool Inspector extension lists the registered tools.
- ChatGPT desktop app: open the live URL in its in-app browser.

## Prior work vs. work added during the submission period

This is a pre-existing project. The submission period started 25 August 2026; the
last commit before it is `6536ee3` (22 August 2026). **Everything after `6536ee3`
is the submission.**

Existing before the submission period:

- The site, the tender search UI, the 17-source index and the backend
- The **backend** MCP server at `https://www.ausschreibungsagenten.de/mcp`
  (Streamable HTTP, 6 tools) — a separate, server-side surface, not WebMCP
- Agent discovery documents: `llms.txt`, agent card, OpenAPI, RFC 9727 API catalog
- An inline WebMCP stub in `index.html`: one tool, registered at document-parse
  time, that proxied the REST endpoint and returned its raw JSON. It changed
  nothing on the page and shared no state with it

Added during the submission period:

- `src/lib/webmcp.js`, `src/lib/vergabe.js`, `src/lib/merkliste.js`
- All 11 tools, registered from the component whose state they drive
- The go/no-go board: shared state, visible UI, `localStorage` persistence
- `Origin-Agent-Cluster: ?1`
- `src/webmcpWerkzeuge.test.jsx` (20 tests) and `src/vergabe.test.js` (23 tests)
- Removal of the inline stub, replaced by registration from the component whose
  state the tools actually drive

The commit history carries the dates.

## Licence

MIT — see `LICENSE`.
