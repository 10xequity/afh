# AFH — FieldhouseUSA Aurora

Static site for aurorafieldhouseusa.com. One page, no build step, no dependencies beyond Google Fonts.

| | |
|---|---|
| **Branch** | `v3` (this build) · `main` holds the retired v2.0 draft (tag `v2.0-legacy`) · tag `v3.0-whiteboard` is the first scrolling draft, now `site.html` |
| **Live demo** | https://10xequity.github.io/afh/ (GitHub Pages from `v3`) |
| **Status** | Demo for owner review. Not yet on the live domain. |

## What it is

Two experiences from one entry. `index.html` opens outside the building and offers **Walk in** (the first-person tour) or **Browse the site instead** (`site.html`, a conventional scrolling page with the whiteboard floor plan, the three sells, partners, rules, FAQ and the contact form). Each links to the other; zone panels on the site deep-link into the same area of the tour.

The tour is a first-person walk through the building. Outside → doors → lobby → one of three wings → an area. Every move is a "walk" transition (the view pushes forward toward what you tapped, blurs, and the next room settles into focus with a small footstep bob). A game-style HUD sits on top: compass (turn West / Ahead / East), where-you-are breadcrumb, front-desk quick actions, a minimap that opens the full floor plan drawn with volleyball courts. Rules, FAQ, partners and the contact form open as side panels from anywhere.

## Files

- `index.html` — the entry and the tour: CSS, JS, HUD, the logo symbol.
- `site.html` — the scrolling page. Same data, same logo, same floor plan.
- `assets/plan.js` — the one floor-plan drawing (rooms, zones, volleyball courts, route, position marker) used by both pages.
- `data/zones.json` — all content: site facts, exterior and lobby copy, the three wings and their areas, partners, inquiry routing, FAQ, and the full facility rules. Edit this, not the HTML.
- `assets/` — filler photos (Colorado Boom / Nike camp court shots, Shoot 360 lab, Wix stock for food, studios and lounges). Replace one-for-one when real photos exist; names are referenced from `zones.json`.
- `favicon.svg`, `404.html`, `robots.txt`, `sitemap.xml`.

Serve over HTTP (`python -m http.server`); the page fetches `data/zones.json`.

## Routes

`#/` outside · `#/lobby` · `#/w/west|ahead|east` · `#/a/<areaId>`. Back button and deep links work. Keyboard: arrows to turn or move between areas, Enter to step in, Escape or Backspace to step back.

## Floor plan

Geometry lives in `ROOMS` and `ZONES` in `assets/plan.js` (viewBox 820×650, traced from the owner's plan). Zones 1–8 from the entrance: 1–4 the two left columns (top pair, bottom pair), 5 the former boxing room, 6 beside Oda Up, 7 the three courts on the east wall, 8 the studios and Social-Den. An area's `map` key names the room or zone it highlights.

## Rules

`rules` in `zones.json` is the full text of boomtownathletics.com/facility-rules.html as of 2026-10-07. Re-pull when that page changes; the panel shows the pull date and links the source and the waiver.

## Inquiry routing

The contact panel picks a request type and opens the visitor's email app addressed to that type's `to` list. No server. A Cloudflare Pages Function can replace the mailto later; the form already builds the payload.

## Deploy

GitHub Pages from `v3`, root. Cloudflare in front once the domain moves off Wix.
