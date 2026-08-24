# Agent authentication

## Discover

Read `/openapi.json`, `/.well-known/api-catalog` and `/entwickler`. Anonymous preview endpoints require no credential. Higher limits use an API key.

## Pick a method

Use anonymous access for public previews. Use HTTP Bearer authentication for authenticated REST, A2A and MCP operations: `Authorization: Bearer <key>`. Keys are prefixed `sk_`. OAuth is not currently advertised, and no other header is accepted — a request sent with `X-API-Key` is treated as unauthenticated.

## Register

Request a free key through `POST /api/signup` or the form on `/entwickler`. The request takes a business email address. The key is displayed once and sent to that address.

## Claim

No identity assertion or ID-JAG flow is required. Possession of the delivered API key is the current credential proof.

## Use the credential

Send `Authorization: Bearer <key>` over HTTPS:

```bash
curl -H "Authorization: Bearer sk_..." https://api.ausschreibungsagenten.de/api/v1/tenders?limit=5
```

Never put the key in a query string, URL, public issue or prompt transcript. Public preview requests may omit the header entirely.

## Errors

401 means a key is missing or invalid; the body names the expected header. 400 on a malformed request. 403 means the plan does not permit the operation. 429 means the rate limit is exhausted. Responses include machine-readable JSON errors and rate-limit headers.

## Revocation

For key loss or revocation contact hi@ausschreibungsagenten.de. A replacement invalidates the previous credential. Never send the old key by email.
