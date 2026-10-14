# AFH — FieldhouseUSA Aurora site: build plan

**Version** v5 · **Date** 2026-10-14 · **Status** Two experiences live on branch `v3`; floor plan now follows Exhibit A · **Supersedes** v4 (2026-10-09, deleted)
**Repo** 10xequity/afh · `main` = retired v2.0 draft (tag `v2.0-legacy`) · tag `v3.0-whiteboard` = first scrolling draft · `v3` branch head = this build
**Demo** https://10xequity.github.io/afh/ (tour) · https://10xequity.github.io/afh/site.html (scrolling site) · **Live domain** aurorafieldhouseusa.com still on Wix

## 1. What changed (2026-10-14)

Owner supplied Exhibit A, "Facility Site Map", from the Claude Desktop project, and asked for its layout and naming with the site's existing colour scheme.

- `assets/plan.js` redrawn to Exhibit A: Zones 1–4 as the 2×2 convertible block, Zone 5 by the main entrance, Zone 6 bottom centre, Zone 7 the three-court east column; rooms Bathroom 1 and 2, Admin (two), S360 Basketball, Massage, Storage / Dock, Social Den, Dance / Yoga Studio 1, Studio 2, Bar / Kitchen Area (Oda Up); parking lot and main entrance marked. Zone descriptors as printed ("2 volleyball courts or 1 basketball court", "2 volleyball courts / sports court", "3 volleyball courts"). No Zone 8.
- `data/zones.json`: area names follow Exhibit A; Massage added as an area (routes to the therapy inquiry); court numbers 1–15 dropped in favour of Exhibit A's per-zone counts; wing contents and copy updated.
- Both pages, the minimap and the full map pick the change up from the shared script.

## 2. Decisions carried over

Entry offers Walk in or Browse the site · contact admin@aurorafieldhouseusa.com (unverified alias) · 720-773-4776 · Oda Up → odaup.com · coloradoaf.org kept · A1 Boxing, Chari Rest, Vexa off · Team Evo = basketball club, no URL · court rental and tournaments route to boomtownathletics.com, events to Event-Den · Shoot 360 → shoot360denver.com · form = mailto routed by type · hosting GitHub Pages for the demo · brand black/red/white, no grey text.

## 3. Open items

**Owner to confirm**
1. Wing contents: West = Admin, S360 Basketball, Zones 1–4; Ahead = Bar / Kitchen, Social Den, Studio 1, Studio 2, Massage, Zone 6, Mezzanine; East = Zones 5 and 7.
2. Mezzanine is not on Exhibit A; it is kept as an area that highlights the bar. Keep, or drop?
3. Test mail to admin@aurorafieldhouseusa.com; the other inquiry recipients per request type.
4. Real photos per scene.
5. Remember the visitor's entry choice on repeat visits? Not built.

**Build**
6. Server-side email for the form (Cloudflare Pages Function when on Cloudflare).
7. Open Graph image. Analytics once on Cloudflare.
8. Lighthouse and screen-reader pass on both pages before DNS cut-over; test the walk on a real phone.
9. DNS move off Wix; redirects from old Wix URLs; Search Console.
