# AFH — FieldhouseUSA Aurora site: build plan

**Version** v2 · **Date** 2026-10-06 · **Status** v3 demo built on branch `v3`; owner review next · **Supersedes** v1 (2026-10-06, deleted)
**Repo** 10xequity/afh · `main` = retired v2.0 draft (tag `v2.0-legacy`) · `v3` = this build
**Live domain** aurorafieldhouseusa.com still on Wix. DNS move is a separate, owner-scheduled step.

## 1. Decisions taken from the owner's answers (2026-10-06)

| Topic | Decision |
|---|---|
| Contact inbox | admin@aurorafieldhouseusa.com (owner "believes" the alias exists: unverified until a test mail lands) |
| Phone | 720-773-4776 |
| Oda Up | links to odaup.com (not live yet) |
| Social-Den | section on this site (#social-den); forward the owned domain to it. One site beats a thin second site for search. |
| Foundation | coloradoaf.org kept (did not respond from here on 2026-10-06) |
| A1 Boxing, Chari Rest | removed; boxing space becomes Zone 5 courts |
| Vexa / leasing | off the site |
| Team Evo | kept as the basketball club; no URL yet, routes to the contact form |
| Court rental, tournaments, drop-in, leagues | content lives on this site for search; CTAs go to boomtownathletics.com pages (tournaments.html etc.) and Event-Den for events |
| Shoot 360 | shoot360denver.com (live 2026-10-06) |
| Inquiry form | built in the site; opens the visitor's email app addressed per request type. Server-side send is the upgrade (Cloudflare Pages Function). |
| PT and massage | kept, routes to the form |
| Team store | not added: no URL yet |
| Extra partners | Real Colorado and VOLO Sports added with their sites; Match Pt Social not added: no URL yet |
| Main sells | Events, Rentals, Tournaments are the hero and nav; everything else is a partner row |
| Programs directory | dropped; the partner list and the zone map replace it |
| Zones | 1–8 per the floor plan, interpretation in README (confirm) |
| Logo | FHUSA logo.svg from Downloads, inlined; black/red/white only |
| Photos vs video | none yet; the whiteboard floor plan is the visual. Photos first when they exist; a short muted loop only for the arrival screen. |
| Hosting | GitHub Pages from `v3` for the demo (the Cloudflare token here cannot reach Pages; the Cloudflare MCP has no Pages tools). Cloudflare fronts it when DNS moves. |

## 2. What v3 is

One page. Arrival screen (logo, headline, Step inside) → whiteboard floor plan with zones 1–8 and rooms (tap to zoom in and read what's there and who books it) → the three sells → facility specs → who runs what → Social-Den → contact form with request-type routing → FAQ → footer. Slide-in menu with the sells, a zone grid, partners and rules. Reduced-motion respected, keyboard operable, phone layout with a bottom sheet for zone details.

## 3. Open items

**Owner to confirm**
1. Zone numbering as drawn. Zone 5 = the former boxing room with two courts. Zone 8 = both studios plus the seating and meeting space.
2. The alias admin@aurorafieldhouseusa.com receives mail. Send one test.
3. The other two inquiry recipients (the form can address up to any number per request type). Who gets events, who gets rentals and tournaments?
4. Which sports each zone actually hosts (surface: hardwood, sport court, turf). The copy is generic until then.
5. Team store URL. Match Pt Social URL.
6. Mezzanine: not on the floor plan supplied. Is it still a hireable space?
7. Facility rules: the site links to boomtownathletics.com/facility-rules.html rather than copying them. OK?

**Build**
8. Server-side email for the form (Cloudflare Pages Function once the project is on Cloudflare).
9. Open Graph image (assets/og.png is referenced, not yet made).
10. Real photography per zone when it exists; swap into the panel.
11. Analytics: Cloudflare Web Analytics once on Cloudflare.
12. Lighthouse and screen-reader pass before DNS cut-over.
13. DNS: move aurorafieldhouseusa.com from Wix; redirect map from old Wix URLs; Search Console.
