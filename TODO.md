# ZRG Classics - Project TODO

## Current Status
- 17 vehicle platforms (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 68 DIY maintenance guides with step-by-step procedures
- 132+ documented issues with repair costs and difficulty ratings
- Full-text search across all content
- 3 tools: Invoice Creator, Build Cost Calculator, Maintenance Tracker
- Mobile responsive, dark mode, print-friendly

---

## Priority 1: Next Up

- [ ] **Restoration Checklist Tool** - Step-by-step restoration guides
  - System-by-system checklists (engine, suspension, interior, etc.)
  - Progress tracking with localStorage
  - Printable export

---

## Priority 2: Content & Polish

- [ ] Add hero images to vehicle pages
  - Location: `src/images/vehicles/{model}-hero.jpg`
  - Specs: JPEG, 1920x1080, under 500KB
- [ ] Add images to resource pages (engine bays, problem areas)
- [ ] Minify CSS/JS for production
- [ ] Newsletter signup form

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
