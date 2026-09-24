# ZRG Classics - Project TODO

## Current Status
- 17 vehicle platforms (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 153 guides (85 restoration, including one model-specific "signature" guide per car, + 68 DIY maintenance)
- 17 buyer's guides on their own pages (`/resources/<brand>/<car>/buying/`) with printable inspection checklists and dated pricing
- 137 documented issues with repair costs and difficulty ratings
- 464 torque specs indexed
- Full-text search across all content, with brand filtering from the brand pages
- My Garage: vehicles, maintenance tracker, and restoration tracker in one place; Build Cost Calculator as a public tool
- User authentication with Supabase (login, register, password reset)
- Community Forums with categories, threads, replies, search
- Community Resources and categorized parts suppliers for each vehicle
- Responsive WebP/JPEG images via Eleventy Image (vehicle photos are placeholders)
- SVG logo, favicon, and social card; Archivo + Inter type; AA-contrast color tokens
- Dark mode (follows the system setting, no flash), mobile layouts, print styles
- Production build with CSS/JS minification

Full record of the September 2026 design and copy review: `docs/site-review-2026-09.md`.

---

## Action Required (Manual Steps)

- [ ] **Replace the placeholder vehicle photos** — drop real photos into `src/images/vehicles/` with the same filenames (landscape, at least 1920px wide) and fill each car's `photoCredit`.
- [ ] **Review the short "Needs owner review" list** in `docs/site-review-2026-09.md` (mostly judgment calls after the Sept 24 content review).
- [x] **Run `supabase-migration-security.sql` in the Supabase SQL Editor** (done, Sept 2026) — the site-side XSS fixes are deployed with the code, but the database hardening (username/avatar rules, protected forum columns, locked-thread replies) only takes effect once this is run
- [ ] **Validate the new profile constraints** — after the migration, check for existing profiles that break the new rules, fix them, then enforce the rules on all rows:
  ```sql
  select id, username, avatar_url from public.profiles
  where username !~ '^[A-Za-z0-9_]{3,20}$' or (avatar_url is not null and avatar_url !~* '^https://');
  alter table public.profiles validate constraint profiles_username_format;
  alter table public.profiles validate constraint profiles_avatar_url_https;
  ```
- [ ] **Retire the invoice tables** — the Invoice Creator is gone from the site; export anything worth keeping, then run the commented-out `drop table` lines at the bottom of `supabase-migration-security.sql`

## Integrations

- [x] **ConvertKit Newsletter** — Live (Form ID: 9066084, integrated into registration flow)
- [x] **Contact Form** — Live (Formspree endpoint on About page)

- [x] **Google Analytics** — Live (G-VB5BSWLP41)

- [ ] **Add Social Media Links** (optional, not blocking launch)
  1. Add URLs to `src/_data/site.json` under `social.facebook`, `social.twitter`, `social.instagram`
  2. Footer icons will appear automatically when URLs are populated

---

## Priority 1: Content

- [ ] **Add inline images** to resource pages (engine bays, problem areas, step photos)

---

## Priority 2: User Experience

- [ ] **Vehicle Photo Upload** - Supabase Storage integration
  - Allow users to upload actual photos to their garage vehicles
  - Replace text-based photo_url with file upload
  - Image compression and thumbnail generation

---

## Priority 3: Hardening & Maintenance

- [ ] **Forum moderation UI** — pin, lock, and remove posts from the site instead of the Supabase dashboard (check how admin rights are modeled in the schema first)

- [ ] **Content-Security-Policy header** — needs the inline `<script>` blocks in forum/account pages moved into `.js` files first so the policy can avoid `unsafe-inline`
- [ ] **Self-host the Supabase client** (or add Subresource Integrity) instead of loading it from unpkg, so a CDN outage or compromise can't affect sign-in

---

## Priority 4: Community Features

- [ ] **Build Journals** - Document restoration journeys
  - Dated entries with photos and costs
  - Tie into existing garage vehicles
  - Shareable/public option
  - Progress timeline visualization

- [ ] **Parts Marketplace** - User-to-user classifieds
  - Listings with photos and pricing
  - Categories by vehicle platform
  - Contact/messaging system
  - Sold/active/expired status

---

## Development Reference

**Commands:**
```
npm run build          # Build site to _site/
npm run serve          # Dev server at localhost:8080
npm run build:search   # Rebuild search index
npm run build:all      # Rebuild search index and site
npm run minify         # Minify CSS/JS in _site/
npm run build:prod     # Search index, site (responsive images), minification
```

**File Structure:**
```
src/
├── _data/           # Global data (site.json, navigation.json)
│   └── vehicles/    # Per-vehicle JSON data files
├── _includes/       # Layouts and partials
├── resources/       # Vehicle resource pages
├── tools/           # Interactive tools
└── images/          # Static assets
```

**Adding a New Vehicle:**
1. Create `src/_data/vehicles/<model>.json` (copy an existing file; include `series`, `tagline`, `photoCredit`, `pricingGuide.asOf`)
2. Create `src/resources/<brand>/<model>.njk` (copy an existing one and change `vehicle`)
3. Add the key to `src/_data/vehicleList.json`. Nav, footer, grids, sitemap, buyer's guide page, and garage platform list update automatically
4. Add a hero photo at `src/images/vehicles/<model>-hero.jpg`
5. Run `npm run build:all`
