---
name: tender-search
description: Find public procurement notices in Germany, the EU and UK with explainable filters.
version: 1.0.0
license: proprietary
---

# Ausschreibungsagenten Tender Search

## When to use this skill (when-to-use)

Use this skill when a user needs to find current public procurement notices by keyword, CPV code, country, location, deadline, estimated value or company profile. It is suitable for Germany, all EU countries and the United Kingdom, including above- and below-threshold sources where connected.

Do not use it to submit a bid, calculate bid prices, provide procurement-law advice or treat the platform summary as legally authoritative. The linked original notice always prevails.

## Procedure

1. Read https://www.ausschreibungsagenten.de/llms.txt for scope and source limitations.
2. For a free preview call `GET https://www.ausschreibungsagenten.de/api/tenders-public` with `search`, `country`, optional `cpv`, `min_score`, `limit` and `offset`.
3. Use https://www.ausschreibungsagenten.de/openapi.json for typed parameters and responses.
4. Use MCP Streamable HTTP at https://www.ausschreibungsagenten.de/mcp when the client supports MCP.
5. Return the original notice URL with every result and state the data timestamp.

## Example

`GET /api/tenders-public?country=DEU&search=fassade&min_score=50&limit=6`
