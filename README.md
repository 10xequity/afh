# AFH — FieldhouseUSA Aurora

Static site for aurorafieldhouseusa.com. One page, no build step, no dependencies beyond Google Fonts.

| | |
|---|---|
| **Branch** | `v3` (this build) · `main` holds the retired v2.0 walk-in draft, also tagged `v2.0-legacy` |
| **Status** | Demo for owner review. Not yet on the live domain. |

## How it works

- `index.html` — the whole site: inline CSS and JS, the floor plan as inline SVG, the logo as an SVG symbol.
- `data/zones.json` — every word of content that changes: site facts, the three things the site sells, the eight zones, the rooms, partners, inquiry routing, FAQ. Edit this, not the HTML.
- `favicon.svg`, `404.html`, `robots.txt`, `sitemap.xml`.

The page fetches `data/zones.json`, so it must be served over HTTP (`python -m http.server`), not opened as a file.

## Zones

Numbered 1–8 from the entrance per the owner's floor plan (2026-10-06): zones 1–4 are the two left columns (top pair and bottom pair of each), 5 is the former boxing space top-right, 6 is the pair beside Oda Up, 7 is the three courts on the east wall, 8 is the studios and Social-Den. Courts 1–15 run in zone order. Change the numbering in `data/zones.json` and in the `data-zone` groups of the SVG together.

## Inquiry routing

The contact form picks a request type, then opens the visitor's email app addressed to the `to` list for that type in `data/zones.json` (`inquiries`). No server, no stored data. To send from the site instead (three recipients, no email app), add a Cloudflare Pages Function that POSTs the same fields; the form already builds the payload.

## Deploy

GitHub Pages from branch `v3`, root. Cloudflare in front once the domain moves off Wix (grey-cloud the records until the certificate issues, then enable Enforce HTTPS).

## Still to confirm

See `afh-build-plan_v2_2026-10-06.md`.
