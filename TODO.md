# ZRG Classics - Project TODO

## Current Status
- 17 vehicle platforms (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 136 guides (56 restoration + 80 DIY maintenance) with step-by-step procedures
- 17 comprehensive buyer's guides with inspection checklists and pricing
- 132+ documented issues with repair costs and difficulty ratings
- 465 torque specs indexed
- Full-text search across all content
- 3 tools: Build Cost Calculator, Maintenance Tracker, Restoration Checklist
- User authentication with Supabase (login, register, password reset)
- Community Forums with categories, threads, replies, search
- My Garage - Personal vehicle management with DB-synced restoration & maintenance tracking
- Community Resources for each vehicle (YouTube channels, forums, Facebook groups, websites)
- Comprehensive Parts Suppliers with categorized listings (OEM, performance, general, specialty, used, tools)
- Hero images for all 17 vehicles (optimized WebP + responsive sizes)
- Mobile responsive with touch-friendly UI (44px tap targets, card layouts, 480px breakpoint)
- Dark mode with theme-aware button styling
- Print-friendly layouts
- Production build with CSS/JS minification

---

## Action Required (Manual Steps)

- [ ] **Run `supabase-migration-security.sql` in the Supabase SQL Editor** — the site-side XSS fixes are deployed with the code, but the database hardening (username/avatar rules, protected forum columns, locked-thread replies) only takes effect once this is run
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

- [ ] **Content-Security-Policy header** — needs the inline `<script>` blocks in forum/account pages moved into `.js` files first so the policy can avoid `unsafe-inline`
- [ ] **Self-host the Supabase client** (or add Subresource Integrity) instead of loading it from unpkg, so a CDN outage or compromise can't affect sign-in
- [ ] **Forum moderation UI** — pinning, locking, and removing posts currently requires the Supabase dashboard

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
npm run optimize:images # Optimize hero images (WebP + sizes)
npm run minify         # Minify CSS/JS in _site/
npm run build:prod     # Full production build (all of the above)
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
1. Create `src/_data/vehicles/<model>.json`
2. Create `src/resources/<brand>/<model>.njk`
3. Add to `src/_data/navigation.json`
4. Run `npm run build:all`
