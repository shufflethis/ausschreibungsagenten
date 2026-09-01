# Devpost Project Story

## Inspiration

Public procurement contains enormous business opportunities, but finding the
right tender is still slow and fragmented. Companies search across many
portals, compare incomplete notices, check deadlines and thresholds, and then
manually decide whether an opportunity deserves further attention.

We wanted to explore a more useful role for browser agents: not replacing the
human decision, but helping people turn scattered tender data into a
transparent Go/No-Go workflow.

## What it does

Tender Agents is a live procurement search platform covering 17 sources across
Germany, the EU, and the UK.

For the WebMCP Challenge, we turned the website into an agent-accessible
workspace with 11 WebMCP tools. An agent can:

- Search live public tenders
- Inspect the tenders currently visible on the page
- Open notices and check source availability
- Add opportunities to a shared shortlist
- Explain the fit using transparent, evidence-based reasons
- Check EU procurement thresholds
- Prefill a pilot search profile without submitting it
- Read and update Go/No-Go decisions

The important part is the shared state. When an agent shortlists a tender, it
appears on the visible board. When a person changes the decision, the agent can
read that decision during its next tool call.

The result is a collaborative workspace instead of an invisible automation
pipeline.

## What was new for the challenge

Tender Agents existed before August 25, 2026 as a public-tender search website.
During the challenge period, we replaced its one-tool inline WebMCP prototype,
which only proxied raw JSON, with 11 tools connected to the live React state.
We also added the shared persistent Go/No-Go board, procurement-specific fit
explanations, a bilingual board interface, explicit trust-boundary handling,
and 43 focused tests. The dated commit history and `WEBMCP.md` document this
extension.

## How we built it

The frontend is built with React, Vite, and JavaScript and deployed on Vercel.

The page registers 11 tools through `document.modelContext.registerTool`. These
tools connect directly to the application's React state, domain logic, live
search results, and browser storage.

We separated the implementation into three small modules:

- WebMCP tool registration and validation
- Procurement-specific evaluation logic
- Persistent shortlist and decision state

Tender fit explanations use observable facts such as CPV categories,
performance location, remaining time, estimated value, EU thresholds, award
criteria, lots, framework agreements, and GPA coverage.

State-changing calls update the visible interface immediately. Read-only calls
return the same state that the person sees on the page.

## Challenges we ran into

The hardest challenge was making agent actions and human actions operate on
exactly the same state.

An earlier prototype exposed a single tool that returned raw JSON but did not
affect the interface. That technically connected the page to an agent, but it
did not create a useful collaboration experience.

We replaced it with tools registered from the live React component so that
agent actions update the actual application state.

We also had to handle untrusted third-party tender content carefully, validate
every tool input, preserve decisions across reloads, support German and English
interfaces, and ensure that profile tools can prefill forms but never submit
them.

## Accomplishments that we're proud of

- 11 focused WebMCP tools on a live production website
- A shared, persistent Go/No-Go board for humans and agents
- Transparent fit explanations instead of black-box recommendations
- Human decisions remain authoritative
- Third-party tender text is explicitly marked as untrusted content
- 43 focused WebMCP and procurement-domain tests
- 205 passing tests across the complete application
- No separate agent-only demo: the integration works on the real product

## What we learned

WebMCP becomes most valuable when it exposes meaningful actions rather than
merely mirroring a REST API.

The most useful agent tools are connected to visible application state, have
narrow responsibilities, validate their inputs, and explain their outputs. We
also learned that human overrides should be part of the protocol itself, not an
afterthought.

Agents are good at searching, comparing, and organizing opportunities. People
should still own the final commercial decision.

## What's next

Next, we want to add reusable company profiles, saved searches, deadline
alerts, collaboration between team members, and stronger procurement-specific
ranking.

The longer-term goal is an agent-assisted workflow that helps small and
medium-sized companies discover suitable public contracts without hiding the
evidence behind each recommendation.
