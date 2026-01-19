# ZRG Classics - Project TODO

## Current Status
- 17 vehicle platforms (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 68 DIY maintenance guides with step-by-step procedures
- 132+ documented issues with repair costs and difficulty ratings
- Full-text search across all content
- 4 tools: Invoice Creator, Build Cost Calculator, Maintenance Tracker, Restoration Checklist
- Mobile responsive, dark mode, print-friendly

---

## Completed

- [x] **Restoration Checklist** - Embedded in each vehicle page
  - 12 system categories with 100+ common items
  - Vehicle-specific restoration items for all 14 vehicles
  - Progress tracking with localStorage per vehicle
  - Cost tracking, dates, and notes per item
  - Print and JSON export

---

## Priority 1: Content

- [ ] **Restoration Guide Content** - Write actual restoration guides (currently "coming soon")
  - Engine rebuild guides per platform
  - Suspension refresh guides
  - Interior restoration guides
  - Electrical system guides
- [ ] **Add hero images** to vehicle pages
  - Location: `src/images/vehicles/{model}-hero.jpg`
  - Specs: JPEG, 1920x1080, under 500KB
- [ ] **Add inline images** to resource pages (engine bays, problem areas, step photos)

---

## Priority 2: Polish & Production

- [ ] Minify CSS/JS for production
- [ ] Newsletter signup form
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
