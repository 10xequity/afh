# AFH — FieldhouseUSA Aurora site: build plan

**Version** v4 · **Date** 2026-10-09 · **Status** Two experiences live on branch `v3`; owner review next · **Supersedes** v3 (2026-10-07, deleted)
**Repo** 10xequity/afh · `main` = retired v2.0 draft (tag `v2.0-legacy`) · tag `v3.0-whiteboard` = the first scrolling draft · `v3` branch head = this build
**Demo** https://10xequity.github.io/afh/ · **Live domain** aurorafieldhouseusa.com still on Wix

## 1. What changed (2026-10-09)

Owner: keep the first scrolling draft as the "traditional" experience alongside the walk-in, and let the visitor choose on entry.

- `index.html` is the entry. The arrival screen offers **Walk in** (first-person tour) and **Browse the site instead** (`site.html`). The tour's menu also links to the site.
- `site.html` is the scrolling page from the first draft, rebuilt on the same data: whiteboard floor plan with the red route and zoom, the three sells, specs, who runs what, Social-Den, routed contact form, the full facility rules as collapsible sections, FAQ, footer. Every zone panel and the header carry a **Walk the building** link into the tour (deep-linked to the same area).
- `assets/plan.js` is the one floor-plan drawing (rooms, zones, volleyball courts, route, position marker). Both pages draw from it; change the geometry once.
- `data/zones.json` feeds both pages: sells and specs restored for the site page; wings, areas, desk, exterior and lobby copy for the tour; partners, inquiries, FAQ and rules shared.

## 2. Decisions carried over

Contact admin@aurorafieldhouseusa.com (unverified alias) · 720-773-4776 · Oda Up → odaup.com · Social-Den is an area on this site · coloradoaf.org kept · A1 Boxing, Chari Rest, Vexa off · Team Evo = basketball club, no URL · court rental and tournaments route to boomtownathletics.com pages, events to Event-Den · Shoot 360 → shoot360denver.com · form = mailto routed by type · PT and massage kept · team store and Match Pt Social not added (no URLs) · zones 1–8 as in the README · hosting GitHub Pages for the demo (Cloudflare token cannot reach Pages) · brand black/red/white, no grey text.

## 3. Open items

**Owner to confirm**
1. Zone numbering and wing contents (README).
2. Test mail to admin@aurorafieldhouseusa.com; the other inquiry recipients per request type.
3. Sports and surface per zone, so the area copy stops being generic.
4. Mezzanine: kept as an area under Ahead though it is not on the plan.
5. Real photos per scene; the Nike camp and Boom shots are filler.
6. Should the entry remember the visitor's choice and skip the arrival screen next time? Not built; one line of code if wanted.

**Build**
7. Server-side email for the form (Cloudflare Pages Function when on Cloudflare).
8. Open Graph image.
9. Analytics once on Cloudflare.
10. Lighthouse and screen-reader pass on both pages before DNS cut-over; test the walk on a real phone.
11. DNS move off Wix; redirects from old Wix URLs; Search Console.
