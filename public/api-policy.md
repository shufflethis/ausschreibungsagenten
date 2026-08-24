# API versioning, Deprecation and Sunset policy

## Versioning

The canonical REST surface is versioned in the path:
`https://api.ausschreibungsagenten.de/api/v1/...`. This is the only surface
described in [openapi.json](https://www.ausschreibungsagenten.de/openapi.json),
and the address to integrate against.

The unversioned `/api/...` addresses on the API host remain a permanent alias of
the current version. They are **not** deprecated and carry no Sunset date; they
are simply not listed in the specification, because describing every operation
twice makes the document worse for agents, not better.

Same-origin convenience endpoints on the website host
(`https://www.ausschreibungsagenten.de/api/tenders-public`, `/api/source-status`,
`/api/countries`) are anonymous read-only proxies of the same data. They are
stable public aliases and keep their addresses.

Protocol endpoints are not versioned by us, because their location is set by the
specification they implement: `/.well-known/agent-card.json` (A2A), `/mcp` (MCP
Streamable HTTP), `/server.json`, `/llms.txt` and `/api/a2a`.

## Authentication

Authenticated operations use HTTP Bearer: `Authorization: Bearer sk_...`. The
scheme is declared in the specification as `apiKeyBearer`, and every operation
that requires it carries the requirement. See
[auth.md](https://www.ausschreibungsagenten.de/auth.md).

## Deprecation

A deprecated operation is marked in OpenAPI with `deprecated: true`. Legacy
responses publish a `Deprecation` header and a `Link` relation named
`successor-version` when a replacement exists.

## Sunset

Incompatible removals are announced at least **12 months** before shutdown
through documentation and an HTTP `Sunset` header. Security or legal emergencies
are the only exception.

A new major version appears as a new path segment (`/api/v2/...`). It does not
change the behaviour of an existing one; `/api/v1` keeps its contract for as long
as it is served.

## Migration

Replacement request and response shapes are documented before enforcement. After
Sunset, a removed endpoint returns HTTP 410 with a structured JSON problem and a
resolution link; it never silently returns the application shell.
