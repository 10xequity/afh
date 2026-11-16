# AFH — FieldhouseUSA Aurora

Static site for aurorafieldhouseusa.com. One page, no build step, no dependencies beyond Google Fonts.

| | |
|---|---|
| **Branch** | `v3` (this build) · `main` holds the retired v2.0 draft (tag `v2.0-legacy`) · tag `v3.0-whiteboard` is the first scrolling draft, now `site.html` |
| **Live demo** | https://10xequity.github.io/afh/ (GitHub Pages from `v3`) |
| **Status** | Demo for owner review. Not yet on the live domain. |

## What it is

Two experiences. `index.html` is the **map tour**; `site.html` is a conventional scrolling page (whiteboard floor plan, the three sells, partners, rules, FAQ, contact form). Each links to the other; zone panels on the site deep-link into the tour (`index.html#/a/<area id>`).

The tour (v4) is one screen: the floor plan on the left (3D tilt or flat) is the navigation, a card on the right shows the chosen place: photo, what's here, who runs it, the booking button, and Previous / Next. Below the plan every place is one tap away as a chip (Courts: Zones 1–7, then Rooms). Arrow keys step through the same order. Nothing locks while it animates; a click swaps the card at once. On phones the card sits on top and the map below. Book buttons are in the header; rules, FAQ, partners and the contact form open as side panels from Menu.

## Files

- `index.html` — the entry and the tour: CSS, JS, HUD, the logo symbol.
- `site.html` — the scrolling page. Same data, same logo, same floor plan.
- `assets/plan.js` — the one floor-plan drawing (rooms, zones, volleyball courts, route, position marker) used by both pages.
- `data/zones.json` — all content: site facts, exterior and lobby copy, the three wings and their areas, partners, inquiry routing, FAQ, and the full facility rules. Edit this, not the HTML.
- `assets/` — filler photos (Colorado Boom / Nike camp court shots, Shoot 360 lab, Wix stock for food, studios and lounges). Replace one-for-one when real photos exist; names are referenced from `zones.json`.
- `favicon.svg`, `404.html`, `robots.txt`, `sitemap.xml`.

Serve over HTTP (`python -m http.server`); the page fetches `data/zones.json`.

## v4 — map tour (2026-11-16)

The first-person walk (outside → doors → lobby → wing → area, with compass, breadcrumb, minimap and detail drawer) is replaced by the map tour above. Why: owner reported it laggy, unresponsive and confusing. Each move locked input for 820 ms (plus 640 ms for the doors), screens stacked full-screen 3D layers, and there were six overlapping ways to navigate. Measured on the new build with the CPU throttled 6×: a click repaints the card in 42–79 ms; the welcome card holds 60 fps.

- `index.html` rewritten (65 KB → 36 KB). Old deep links still work: `#/a/<id>` opens that place, `#/w/<wing>` opens the wing's first court, `#/lobby` opens the welcome card.
- `zones.json` still carries `wings`, `exterior`, `lobby` and `desk`; the tour reads the copy and photos from them. `wing-*.webp`, `lobby.webp` and `exterior.webp` are no longer shown by the tour.
- `site.html` links say "Tour the building" and point to `index.html`.
- The walk-in is in git history at tag-free commit `4458aa3` (v3.5) if it is ever wanted back.

## v3.5 — speed (2026-11-14)

- **Photos are WebP**, max 1600 px wide (panorama 2400), quality 60: 6.06 MB of JPEG became 3.28 MB. `zones.json` and the preload point at `.webp`; the `.jpg` originals stay in `assets/` as masters (nothing loads them; `og:image` still uses `lobby.jpg` for link previews). To add a photo, drop the JPEG in and export a WebP the same way.
- **No live blur.** The 8 frosted-glass `backdrop-filter`s re-blurred a constantly moving photo every frame, and every walk step blurred the whole screen. Both removed; the glass tint is already 58-78% black, so it reads the same.
- **Panorama pans with `transform`** (GPU) instead of `background-position` (full repaint every frame).
- **Startup:** fonts no longer block the page script, `zones.json` starts downloading from the `<head>`, and the next scenes' photos download only after the first scene is on screen.

## v3.4 — 3D walk, moving photo, 3D map (2026-11-14)

- **Walk is 3D.** `#stage` has perspective; walking forward pushes into the scene (`translateZ`), turning West/East swings the view on its vertical axis (`rotateY`) and the next room arrives from the side you turned toward. Back steps out of the scene. Reduced motion still gets a plain fade.
- **Moving photo.** The lobby is now the real court panorama (`assets/fieldhouse-panorama.jpg`, `"pano": true` in `zones.json`). It is wider than the screen and looks slowly side to side; pointing at a wing turns it to face that wing, and walking to a wing finishes the turn first.
- **Real photo for the East wing:** `assets/fieldhouse-overhead.jpg` replaces `wing-east.jpg`.
- **3D floor plan.** The map dialog opens tilted in 3D with a 3D / Flat toggle; zones stay tappable in both.
- The same plan geometry also drives the Facility Layout page on boomtownathletics.com (`btvb/assets/js/fieldhouse-plan.js`, a copy — keep them in step).

## Routes

`#/` outside · `#/lobby` · `#/w/west|ahead|east` · `#/a/<areaId>`. Back button and deep links work. Keyboard: arrows to turn or move between areas, Enter to step in, Escape or Backspace to step back.

## Floor plan

Geometry lives in `ROOMS` and `ZONES` in `assets/plan.js` (viewBox 820×650), redrawn 2026-10-14 from the owner's Exhibit A facility site map: Zones 1–4 (convertible courts, the 2×2 block on the west side), Zone 5 (by the main entrance), Zone 6 (bottom centre) and Zone 7 (the three-court column on the east wall), plus Bathroom 1 and 2, Admin (front desk and the second office), S360 Basketball, Massage, Storage / Dock, Social Den, Dance / Yoga Studio 1, Studio 2 and the Bar / Kitchen Area (Oda Up). Names and descriptors follow Exhibit A; there is no Zone 8. The colour scheme is the site's own (black, red, wood courts), not Exhibit A's. An area's `map` key names the room or zone it highlights.

## Rules

`rules` in `zones.json` is the full text of boomtownathletics.com/facility-rules.html as of 2026-10-07. Re-pull when that page changes; the panel shows the pull date and links the source and the waiver.

## Inquiry routing

The contact panel picks a request type and opens the visitor's email app addressed to that type's `to` list. No server. A Cloudflare Pages Function can replace the mailto later; the form already builds the payload.

## Deploy

GitHub Pages from `v3`, root. Cloudflare in front once the domain moves off Wix.
