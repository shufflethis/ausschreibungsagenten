# API versioning, Deprecation and Sunset policy

Stable REST endpoints use a `/v1` path on the API host or are documented as stable public aliases on the website host.

## Deprecation

A deprecated operation is marked in OpenAPI with `deprecated: true`. Legacy responses publish a `Deprecation` header and a `Link` relation named `successor-version` when a replacement exists.

## Sunset

Incompatible removals are announced at least **12 months** before shutdown through documentation and an HTTP `Sunset` header. Security or legal emergencies are the only exception.

## Migration

Replacement request and response shapes are documented before enforcement. After Sunset, a removed endpoint returns HTTP 410 with a structured JSON problem and a resolution link; it never silently returns the application shell.
