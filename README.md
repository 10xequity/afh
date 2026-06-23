# AFH — FieldhouseUSA Aurora

<!-- 2026-06-22 · aurora-fieldhouse · v2.0 -->

Cinematic single-page **"walk-in"** site for FieldhouseUSA Aurora (indoor community field house).
Static, dependency-free, **Cloudflare Pages–ready**. Exterior → Lobby → Wing → Area, plus a
Programs directory, grouped FAQ, synced Rules, and Book/Menu/Sponsors modals.

| | |
|---|---|
| **Version** | v2.0 |
| **Date** | 2026-06-22 |
| **Status** | Draft — placeholder imagery + items flagged below |

## Structure

```
AFH/
├─ index.html          # the whole site (HTML + CSS + JS, no build step)
├─ data/
│  └─ zones.json       # SINGLE SOURCE OF TRUTH (wings, areas, links, FAQ, rules, sponsors)
├─ assets/             # drop logo + photos here (see assets/README.md)
└─ README.md
```

Add or edit an area in `data/zones.json` and both the wing map **and** the Programs
directory update — no code changes.

## Run locally

`index.html` fetches `data/zones.json`, so it must be **served over HTTP** (opening the
file directly via `file://` blocks the fetch — the page will tell you so).

```bash
npx serve .          # or: python3 -m http.server
```

## Deploy — Cloudflare Pages

1. Push this repo to GitHub (done).
2. Cloudflare Pages → **Create project → Connect to Git** → select `AFH`.
   - Framework preset: **None**
   - Build command: *(leave empty)*
   - Build output directory: **`/`**  (root — the site is already static)
3. Deploy → validate on the generated `*.pages.dev` URL.
4. **Domain cut-over (separate sign-off):** point `aurorafieldhouseusa.com` + `www` at the
   Pages project. This moves the domain off Wix — schedule deliberately.

> Private repos deploy fine via the Cloudflare GitHub app.

## Logo

The top-bar wordmark is a **temporary text/SVG mark** (red swoosh + "fieldhouse USA" in Oswald).
To use the real hand-drawn logo: drop `assets/logo-white.svg` (preferred) or `.png` into `assets/`,
then replace the `<a class="tb-logo wm">…</a>` block in `index.html` with an `<img>`.
The recolored white-on-transparent raster (from `fieldhouseusalogo.png`) is available separately.

## Imagery

All photos are **seeded placeholders** (`picsum.photos`, stable per `area.id`). To use real shots,
drop files into `assets/` named by `area.id` (e.g. `assets/social.jpg`) and point `PLACE()` in
`index.html` at `./assets/<id>.jpg`. Per-area shot list is in the project Asset Manifest.

## Still `[confirm]` before launch

- **Contact email:** uses `admin@boomtownvb.com` (project docs); the live Boomtown site uses
  `admin@boomtownathletics.com`. Confirm which inbox is monitored.
- **Oda Up / Oda Up Bar links** point at `aurorafieldhouseusa.com` — the Wix site being replaced
  (circular). Needs a real destination.
- **Phone** unverified — omitted from the UI rather than publish a wrong number.
- Yoga-Den / Colorado Boom / Shoot 360 membership URLs unconfirmed.
- **Dance-Den scope:** follows project docs (no cheer/gymnastics); live site still lists them.
- Wing left/right/center mapping + names — confirm against the floor plan.
- **Rules** are synced from `boomtownathletics.com/events` (pulled 2026-06-22). Re-pull before launch.

### Version history
| Version | Date | Notes |
|---|---|---|
| v2.0 | 2026-06-22 | Initial repo: static walk-in site, data-driven, Pages-ready. |
