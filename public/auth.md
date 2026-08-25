# Agent authentication

## Discover

Read `/openapi.json`, `/.well-known/api-catalog` and `/entwickler`. Anonymous preview endpoints require no credential. Higher limits use an API key.

## Pick a method

Three methods, in increasing order of control:

1. **Anonymous** — public preview endpoints, no credential, 60 requests per hour.
2. **API key as bearer** — `Authorization: Bearer sk_...`. Simplest for a fixed integration.
3. **OAuth 2.0 client credentials** — exchange the key for a short-lived token that
   names its own scope. Preferred for agents: the token expires after an hour and
   states what it may do.

No other header is accepted — a request sent with `X-API-Key` is treated as
unauthenticated and silently runs in the anonymous limit.

## Register

Self-serve, machine-callable. No browser, no form, no confirmation step:

```
register_uri: https://api.ausschreibungsagenten.de/api/v1/signup
```

```bash
curl -s -X POST https://api.ausschreibungsagenten.de/api/v1/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","tier":"free"}'
```

```json
{ "api_key": "sk_...", "tier": "free" }
```

The key is returned once in the response body and also sent to that address.
Ten registrations per hour; a second one for the same address returns 409.
Humans can use the form on
[/entwickler](https://www.ausschreibungsagenten.de/entwickler) instead.

The free tier allows 60 requests per hour and covers `tenders:read` and
`profiles:read`. Nothing else is required to start — the public preview
endpoints work with no credential at all.

## Claim

Possession of the delivered API key is the credential proof. For scoped access,
exchange it at the token endpoint — `client_id` is the key's id (from
`GET /api/v1/me/keys`), `client_secret` is the key itself:

```bash
curl -s -X POST https://api.ausschreibungsagenten.de/oauth/token \
  -d grant_type=client_credentials \
  -d client_id=<key id> \
  -d client_secret=sk_... \
  -d scope="tenders:read"
```

```json
{ "access_token": "...", "token_type": "Bearer", "expires_in": 3600, "scope": "tenders:read" }
```

Discovery without asking anyone:

- [`/.well-known/oauth-protected-resource`](https://api.ausschreibungsagenten.de/.well-known/oauth-protected-resource) (RFC 9728) — what the resource is and which scopes exist
- [`/.well-known/oauth-authorization-server`](https://api.ausschreibungsagenten.de/.well-known/oauth-authorization-server) (RFC 8414) — where to get a token

### Scopes

| Scope | Grants | Plan |
| --- | --- | --- |
| `tenders:read` | tender search, detail, source status, country coverage | all |
| `profiles:read` | company profiles and their explained matches | all |
| `fulltext:read` | full text across indexed notices | Pro and above |
| `webhooks:write` | manage delivery webhooks | Pro and above |

Asking for a scope the plan does not include returns `invalid_scope` rather
than a token that would fail later. Omit `scope` to receive everything the plan
allows.

## Use the credential

Send `Authorization: Bearer <key>` over HTTPS:

```bash
curl -H "Authorization: Bearer sk_..." https://api.ausschreibungsagenten.de/api/v1/tenders?limit=5
```

Never put the key in a query string, URL, public issue or prompt transcript. Public preview requests may omit the header entirely.

## Errors

401 means a key is missing or invalid; the body names the expected header. 400 on a malformed request. 403 means the plan does not permit the operation. 429 means the rate limit is exhausted. Responses include machine-readable JSON errors and rate-limit headers.

## Revocation

Delete a key with `DELETE /api/v1/me/keys/{id}`, or contact
hi@ausschreibungsagenten.de. Revoking a key **immediately** invalidates every
token issued against it — there is no grace period until the token expires.
Never send the old key by email.
