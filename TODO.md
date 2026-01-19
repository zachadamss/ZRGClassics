# ZRG Classics - Project TODO

## Current Status
- 17 vehicle platforms (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 136 guides (56 restoration + 80 DIY maintenance) with step-by-step procedures
- 17 comprehensive buyer's guides with inspection checklists and pricing
- 132+ documented issues with repair costs and difficulty ratings
- 465 torque specs indexed
- Full-text search across all content
- 4 tools: Invoice Creator, Build Cost Calculator, Maintenance Tracker, Restoration Checklist
- User authentication with Supabase (login, register, password reset)
- Community Forums with categories, threads, replies, search
- My Garage - Personal vehicle management with DB-synced restoration & maintenance tracking
- Hero images for all 17 vehicles (optimized WebP + responsive sizes)
- Mobile responsive with touch-friendly UI (44px tap targets, card layouts, 480px breakpoint)
- Dark mode with theme-aware button styling
- Print-friendly layouts
- Production build with CSS/JS minification

---

## Quick Actions (Manual Steps)

- [ ] **Activate Newsletter Signup**
  1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
  2. Create a new form
  3. Copy your form ID (e.g., `xyzabc123`)
  4. Replace `YOUR_FORM_ID` in `src/index.njk` line 50
  5. Commit and push

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

## Priority 3: Community Features

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
