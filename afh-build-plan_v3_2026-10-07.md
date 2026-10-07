# AFH — FieldhouseUSA Aurora site: build plan

**Version** v3 · **Date** 2026-10-07 · **Status** POV walk-in build live on branch `v3`; owner review next · **Supersedes** v2 (2026-10-06, deleted)
**Repo** 10xequity/afh · `main` = retired v2.0 draft (tag `v2.0-legacy`) · tag `v3.0-whiteboard` = rejected floor-plan-first build · `v3` branch head = this build
**Demo** https://10xequity.github.io/afh/ · **Live domain** aurorafieldhouseusa.com still on Wix

## 1. What changed from v2

Owner rejected the whiteboard concept (2026-10-07) and asked for the original first-person walk-in, rebuilt: animated entry, a sleeker menu, FPS-style navigation with a map, walk transitions between areas, the facility rules always available, and filler images from the current Wix site.

Built: doors-then-dolly entry; lobby with three objective-style markers (West, Ahead, East); wing scenes with area markers; walk transition (push toward the tapped marker + blur, next scene settles, footstep bob); area detail panel (bottom sheet on phones); compass, breadcrumb, minimap, full floor plan drawn as volleyball courts; slide-in menu with stagger; rules, FAQ, partners and routed contact form as side panels; hash routes and keyboard control; reduced-motion fallback.

Images: the Wix site holds Event-Den stock (food, dance, lounges), no court or building photos. Courts use the owner's own shots from the Colorado Boom site and the Nike camp originals; the Shoot 360 lab uses the Shoot 360 site photos. All are filler; swap by filename in `assets/`.

## 2. Decisions carried over (unchanged from v2)

Contact admin@aurorafieldhouseusa.com (unverified alias) · 720-773-4776 · Oda Up → odaup.com · Social-Den is an area on this site · coloradoaf.org kept · A1 Boxing, Chari Rest, Vexa off · Team Evo = basketball club, no URL · court rental and tournaments route to boomtownathletics.com pages, events to Event-Den · Shoot 360 → shoot360denver.com · form = mailto routed by type · PT and massage kept · team store and Match Pt Social not added (no URLs) · zones 1–8 as interpreted in the README · hosting GitHub Pages for the demo (Cloudflare token cannot reach Pages).

## 3. Open items

**Owner to confirm**
1. Zone numbering as drawn (README). Zone 5 = former boxing room, two courts. Zone 8 = both studios plus seating.
2. Wing contents: West = office, Shoot 360, zones 1–4; Ahead = Oda Up, Social-Den, Dance-Den, Yoga-Den, zone 6, mezzanine; East = zones 5 and 7. Move anything that is in the wrong wing.
3. Test mail to admin@aurorafieldhouseusa.com.
4. The other inquiry recipients per request type.
5. Sports and surface per zone, so the area copy stops being generic.
6. Mezzanine: not on the plan; kept as an area under Ahead. Correct?
7. Real photos: exterior, lobby, each wing and area. Until then the Nike camp and Boom shots stand in.

**Build**
8. Server-side email for the form (Cloudflare Pages Function when on Cloudflare).
9. Open Graph image (uses assets/lobby.jpg for now).
10. Analytics once on Cloudflare.
11. Lighthouse and screen-reader pass before DNS cut-over; test the walk on a real phone.
12. DNS move off Wix; redirects from old Wix URLs; Search Console.
