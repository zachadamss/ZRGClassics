# ZRG Classics - Project TODO

## Current Status
- 17 vehicle platforms with full content (BMW: E28, E30, E34, E36, E39, E46, E90 | Porsche: 924, 928, 944, 964, 986, 987, 991, 993, 996, 997)
- 132+ documented issues with repair costs, difficulty ratings, and parts
- Search across all content types (issues, torque specs, guides, suppliers)
- Related issues cross-references between similar problems
- Invoice Creator tool live
- Mobile responsive, dark mode, print-friendly

---

## Tools (Coming Soon)

- [ ] **Maintenance Tracker** - Track service history and reminders
  - Service history log per vehicle
  - Interval-based maintenance reminders
  - Mileage tracking
  - Export/import service records

- [ ] **Build Cost Calculator** - Estimate restoration and modification costs
  - Parts cost estimation by category
  - Labor hour estimates
  - Project budgeting and tracking
  - Compare DIY vs shop costs

- [ ] **Restoration Checklist** - Step-by-step restoration guides
  - System-by-system checklists (engine, suspension, interior, etc.)
  - Priority-based task organization
  - Progress tracking
  - Printable checklist export

---

## Community Section (Future)

- [ ] **Forums** - Implement forum functionality
  - BMW and Porsche Technical Discussion boards
  - Project Build Threads
  - DIY Guides & How-Tos
  - Events & Meetups
  - User registration/authentication

- [ ] **Parts Marketplace** - Implement marketplace
  - Organized by vehicle platform
  - User verification system
  - Photo listings
  - Saved searches & alerts

---

## Content & Media

- [ ] Add images to resource pages (engine bays, problem areas)
- [ ] Add hero images to brand landing pages (BMW and Porsche index pages)
- [ ] Add vehicle silhouette or icon graphics to resource cards
- [ ] Write actual restoration guide content for each vehicle
- [ ] Write DIY maintenance guide content

---

## Features & Enhancements

- [ ] Newsletter signup for launch notifications
- [ ] Add "Report Issue" or "Suggest Edit" links for community contributions

---

## Technical

- [ ] Minify CSS/JS for production
- [ ] Optimize images for web (if adding photos)

---

## Development Reference

**Commands:**
- `npm run build` - Build site to `_site/`
- `npm run serve` - Dev server at localhost:8080
- `npm run build:search` - Rebuild search index
- `npm run build:all` - Rebuild search index and site

**File Structure:**
- `src/` - Source files (templates, data, assets)
- `src/_data/` - Global data (site.json, navigation.json)
- `src/_data/vehicles/` - Per-vehicle JSON data files
- `src/_includes/` - Layouts and partials
- `_site/` - Built output (gitignored)

**Adding a New Vehicle:**
1. Create `src/_data/vehicles/<model>.json` with vehicle data
2. Create `src/resources/<brand>/<model>.njk` page template
3. Add to `src/_data/navigation.json`
4. Run `npm run build`

**Hero Images:**
- Location: `src/images/vehicles/`
- Naming: `{model-id}-hero.jpg` (e.g., `e46-hero.jpg`, `997-hero.jpg`)
- Specs: JPEG, landscape, 1920x1080 min, under 500KB
- Sources: Own photos, Unsplash, Pexels, Pixabay, Wikimedia Commons
