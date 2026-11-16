# AFH — FieldhouseUSA Aurora

Static site for aurorafieldhouseusa.com. One page, no build step, no dependencies beyond Google Fonts.

| | |
|---|---|
| **Branch** | `v3` (this build) · `main` holds the retired v2.0 draft (tag `v2.0-legacy`) · tag `v3.0-whiteboard` is the first scrolling draft, now `site.html` |
| **Live demo** | https://10xequity.github.io/afh/ (GitHub Pages from `v3`) |
| **Status** | Demo for owner review. Not yet on the live domain. |

## What it is (v5)

Five static pages that share one stylesheet and one script. No build step.

- `index.html`: home. Two banners (facility rules, drop-in volleyball), a hero with an animated black court that cycles volleyball, basketball, futsal, training, yoga and dance, three offer cards (Special events, Tournaments, Find an activity), the map with ten tour stops, the full facility rules, questions, and the sponsors section.
- `tour.html`: the tour. Ten set stops, each with a photo gallery and the businesses based there. Map loads flat; 3D (room boxes, standing nets, raised mezzanine) is built on demand. `assets/fieldhouse-3d-map.pdf` is the downloadable 3D map.
- `tournaments.html`: what we host and how booking works (6 to 8 months out, 30% deposit, paid in full 30 days before). **Draft copy, owner to confirm.**
- `activities.html`: "Find an activity" and the Service Operator Partners list, grouped by category.
- `studios.html`: placeholder home for Dance-Den (`#dance-den`) and Yoga-Den (`#yoga-den`) until their own sites exist.
- `site.html`: redirect to `index.html` (old address of the scrolling page).

Page text is plain HTML on purpose: search engines and AI crawlers read it without running JavaScript.

## Files

- `assets/site.css`: all shared styles, including the floor plan in both views.
- `assets/site.js`: logo, header, side menu, footer and the ask-the-front-desk panel (mailto, no backend).
- `assets/plan.js`: the floor-plan geometry (`ROOMS`, `ZONES`, `SPOTS`) and the two drawings, `FHPLAN.flat()` and `FHPLAN.iso()`.
- `data/zones.json`: tour stops (name, copy, photos, partners) and the partner list. The activities page and `llms.txt` were generated from it; if a partner changes, update both.
- `llms.txt`, `robots.txt`, `sitemap.xml`: for search engines and AI assistants. `robots.txt` explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot and Google-Extended.
- `assets/*.webp`: photos. The `.jpg` files are masters. `wing-*`, `exterior`, `arches`, `spike`, `denver-street`, `event-festival` are no longer used by any page.

To regenerate the 3D PDF: print a page that calls `FHPLAN.iso()` with headless Chrome (`--print-to-pdf`), landscape letter.

Serve over HTTP (`python -m http.server`); the tour fetches `data/zones.json`.

## v5.1 changes (2026-11-16)

Second owner review. Home: banners moved under the hero, three photo-led columns and a scoreboard replace the offer cards, entrance photo, rotatable 3D map with numbered pins and a side panel, one Take a tour button, a small Lost items section, facility rules PDF. Tour: every zone 1 to 7 opens its court photos (`#/z/<n>`), pins are numbered, 3D map rotates (drag or arrow buttons). Stops renamed: 3 Hardwood Courts, 9 Sports Court, 10 Sports Court and Futsal Arena; the studio labels are swapped (large room is Studio 2). Shared: no phone number or call button anywhere (email only), Home and an Activities dropdown in the nav, two reds (`--red` for fills, `--red-t` for red text on black) and larger small text for contrast, event and tournament requests must answer a full set of planning questions, downloads ask first. New `assets/chat.js`: an offline helper that answers rule questions by keyword and collects event details, then fills the request form; keep its answers in step with the rules on `index.html`. Tournaments: Boomtown banner, open-space sizes, rental contracts required for all rentals. "Who runs what" is now "Based here".

`assets/fieldhouse-facility-rules.pdf` is generated from the rules in `index.html`; regenerate it when the rules change.

## v5 changes (2026-11-16)

Owner review, 25 items. Home and tour swapped names (home is `index.html`). Walk-through idea dropped for ten set stops. Map: Massage is now Therapy / Spa and fills its gap, Bathroom is Restroom, Studio 1 lines up with Admin, Zone 6 is volleyball only, Zone 7 is 3 volleyball courts or 1 futsal arena. Removed: soccer field and turf, sprung and foam floors, mall entrance, the "pulled from Boomtown" note. Rules rewritten as FieldhouseUSA rules with bag search and service-animal accommodation. Address shows FieldhouseUSA on the suite line. SEO: titles and H1 lead with Denver metro, address stays Aurora; JSON-LD for the venue and FAQ.

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
