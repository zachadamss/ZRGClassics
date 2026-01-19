# ZRG Classics - Project TODO

## Current Status
- 14 vehicle platforms (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 136 guides (56 restoration + 80 DIY maintenance) with step-by-step procedures
- 132+ documented issues with repair costs and difficulty ratings
- 414 torque specs indexed
- Full-text search across all content
- 4 tools: Invoice Creator, Build Cost Calculator, Maintenance Tracker, Restoration Checklist
- Newsletter signup on homepage (Formspree-ready)
- Mobile responsive, dark mode, print-friendly

---

## Quick Actions (Manual Steps)

- [ ] **Activate Newsletter Signup**
  1. Sign up at [formspree.io](https://formspree.io) (free tier: 50 submissions/month)
  2. Create a new form
  3. Copy your form ID (e.g., `xyzabc123`)
  4. Replace `YOUR_FORM_ID` in `src/index.njk` line 50
  5. Commit and push

---

## Completed

- [x] **Newsletter Signup Form** - Homepage after stats bar
  - Formspree integration (just needs form ID)
  - "Free Updates" badge with orange accent
  - Theme-aware design (light/dark mode)
  - Mobile responsive

- [x] **Restoration Checklist** - Embedded in each vehicle page
  - 12 system categories with 100+ common items
  - Vehicle-specific restoration items for all 14 vehicles
  - Progress tracking with localStorage per vehicle
  - Cost tracking, dates, and notes per item
  - Print and JSON export

- [x] **Restoration Guides** - 56 comprehensive guides (4 per vehicle)
  - Suspension Refresh - full rebuild procedures
  - Rust Prevention & Repair - common problem areas
  - Electrical Systems - wiring, relays, grounds
  - Interior Restoration - seats, carpet, dashboard
  - Each guide includes: parts lists with OEM numbers, aftermarket alternatives, costs, tools needed, step-by-step procedures, pro tips, warnings, reference links
  - Expandable card UI (click to expand inline)

---

## Priority 1: Content

- [ ] **Add hero images** to vehicle pages
  - Location: `src/images/vehicles/{model}-hero.jpg`
  - Specs: JPEG, 1920x1080, under 500KB
- [ ] **Add inline images** to resource pages (engine bays, problem areas, step photos)

---

## Priority 2: Polish & Production

- [ ] Minify CSS/JS for production
- [ ] Image optimization pipeline

---

## Priority 3: Future / Requires Backend

- [ ] **Community Forums** - Requires user auth
- [ ] **Parts Marketplace** - Requires user auth
- [ ] User accounts and authentication

---

## Development Reference

**Commands:**
```
npm run build        # Build site to _site/
npm run serve        # Dev server at localhost:8080
npm run build:search # Rebuild search index
npm run build:all    # Rebuild search index and site
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
