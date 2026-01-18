# ZRG Classics - Project TODO

## Completed
- [x] Site restructure from car sales to resource hub
- [x] New navigation with dropdown for Resources
- [x] Homepage redesign with resource cards
- [x] E46 detailed common issues page
- [x] Placeholder pages for all vehicle platforms
- [x] Coming Soon pages for Tools/Community
- [x] Updated About page with new mission
- [x] Dark mode support on all new pages
- [x] Search functionality with model and keyword filtering
- [x] **Expanded Search** - Search now includes torque specs, guides, and suppliers
  - 74 torque specifications indexed across all vehicles
  - 32 guides (restoration + DIY) searchable
  - 11 parts suppliers indexed
  - Type filtering (Issues, Torque Specs, Guides, Suppliers)
  - Styled result cards for each content type
- [x] **11ty Migration** - Converted from static HTML to 11ty-powered static site
  - Nunjucks templating with layouts and partials
  - Data-driven vehicle pages from JSON files
  - Automatic navigation generation from data
  - Build system with `npm run build` and `npm run serve`
- [x] **Consolidated About & Contact pages** - Contact form moved to bottom of About page, removed separate Contact page from navigation
- [x] **Added 8 new vehicle platforms** - BMW E28, E34, E39, E90 and Porsche 964, 987, 991, 993
  - Full vehicle data files with issues, torque specs, guides, and suppliers
  - Vehicle page templates for all new models
  - Updated navigation with new models
- [x] **Search index build script** - Added `build-search-index.js` for generating search index from vehicle data
  - `npm run build:search` to rebuild search index
  - `npm run build:all` to rebuild search index and site together
- [x] **Fixed search rendering bug** - Supplier results were crashing search due to undefined `type` field (was using `category`)

---

## Resource Pages - Content Completed

### BMW
- [x] **E30** - Detailed common issues content
  - Timing belt failure (M20/M42)
  - Rust and corrosion
  - Electrical gremlins
  - Suspension bushing wear
  - Fuel injection issues (Bosch Motronic)
  - Cooling system failures

- [x] **E36** - Detailed common issues content
  - Cooling system failures
  - VANOS issues (M50TU/M52)
  - Rear trailing arm bushing (RTAB) failure
  - Window regulator failure
  - Oil leaks
  - Control arm bushings
  - Ignition system failures

- [x] **E46** - Detailed common issues content
  - VANOS system failure
  - Cooling system failures
  - Rear subframe cracking
  - Window regulator failure
  - Control arm bushing wear

### Porsche
- [x] **986 Boxster** - Detailed common issues content
  - IMS bearing failure
  - Rear main seal (RMS) leak
  - Coolant pipe failure
  - Convertible top issues
  - AOS (air/oil separator) failure
  - Bore scoring / cylinder wear
  - Window regulator failure

- [x] **996 911** - Detailed common issues content
  - IMS bearing failure
  - Bore scoring / D-Chunk
  - Rear main seal (RMS) leak
  - AOS (air/oil separator) failure
  - Coolant system failures
  - Headlight seal failure ("fried egg")
  - Suspension wear

- [x] **997 911** - Detailed common issues content
  - IMS bearing failure (997.1 only)
  - Bore scoring (997.1 M97 engine)
  - PDK transmission issues (997.2)
  - PASM suspension failures
  - Coolant pipe and water pump failures
  - Direct fuel injection carbon buildup (997.2)
  - Rear main seal leak (997.1)

---

## Tools Section

- [x] **Invoice Creator** - Build functional tool
  - Customizable shop information
  - Parts and labor line items
  - Tax calculation
  - PDF export
  - Save templates for common jobs

---

## Community Section

- [ ] **Forums** - Implement forum functionality
  - BMW E30/E36/E46 Technical Discussion
  - Porsche 986/996/997 Technical Discussion
  - Project Build Threads
  - DIY Guides & How-Tos
  - Events & Meetups
  - User registration/authentication

- [ ] **Parts Marketplace** - Implement marketplace
  - Organized by vehicle platform
  - User verification system
  - Photo listings
  - Saved searches & alerts
  - Reputation/feedback system

---

## New Platforms Added
- [x] **Porsche 924** (1976-1988) - Placeholder page created
- [x] **Porsche 944** (1982-1991) - Placeholder page created
- [x] **Porsche 928** (1977-1995) - Placeholder page created

## Platforms Ready for Content
- [x] **Porsche 924** - Add detailed common issues content
- [x] **Porsche 944** - Add detailed common issues content
- [x] **Porsche 928** - Add detailed common issues content

## Enhancements

- [ ] Add images to resource pages (engine bays, problem areas)
- [ ] Add estimated repair costs to issue cards
- [ ] Add difficulty ratings for DIY repairs
- [x] Mobile navigation improvements (hamburger menu)
- [x] Search functionality across all resources
- [x] **Mobile Responsiveness Fixes** - Fixed vehicle page layout issues on mobile
  - Fixed quick-links nav collision with header nav styles (was blocking whole page)
  - Quick-links now horizontally scrollable on mobile
  - Engine tags display horizontally with proper wrapping
  - Added comprehensive mobile styles for search results
  - Added mobile styles for vehicle hero, issue cards, guide cards, supplier tabs, specs tables
- [ ] Newsletter signup for launch notifications
- [x] Add more vehicle platforms (E90, 987, 991, etc.) - Added E28, E34, E39, E90, 964, 987, 991, 993
- [x] Add better navigation structure/home page for each brand to see all of the models, and then the same for each model to see all of the resources for that model.
- [ ] Adjust color scheme to match color codes of vintage porsche racing in a very aesthetic, modern, and still timeless way.
- [x] Fix usability on mobile, does not work well, user menu is not fully visible and page is not resizing correctly.
- [x] Fix mobile responsiveness for vehicle pages (quick-links, engine tags, search results)  

---

## Next Priorities

### Content
- [x] **Porsche 924** - Add detailed common issues content (timing belt, fuel injection, rust spots, electrical)
- [x] **Porsche 944** - Add detailed common issues content (timing belt, balance shaft, clutch, dashboard cracks)
- [x] **Porsche 928** - Add detailed common issues content (timing belt, V8 specific issues, electrical gremlins)

### Design & UX
- [ ] Adjust color scheme to match vintage Porsche racing aesthetics (Gulf livery, Rothman's, Martini colors)
- [ ] Add hero images to brand landing pages (BMW and Porsche index pages)
- [ ] Add vehicle silhouette or icon graphics to resource cards
- [ ] Improve typography hierarchy on resource pages

### Features
- [x] Add search functionality across all resources
- [x] Expand search to include torque specs, guides, DIY guides, and suppliers
- [ ] Add "Related Issues" links between similar problems across platforms
- [ ] Add print-friendly styling for resource pages (mechanics can print guides)
- [ ] Add "Report Issue" or "Suggest Edit" links for community contributions
- [ ] Add estimated repair costs to issue cards
- [ ] Add difficulty ratings for DIY repairs (Easy/Moderate/Advanced)
- [ ] Add parts links or part numbers where applicable

### New Platforms to Add
- [x] BMW E90/E91/E92/E93 (2005-2013 3 Series)
- [x] Porsche 987 Boxster/Cayman (2005-2012)
- [x] Porsche 991 911 (2012-2019)
- [x] BMW E39 5 Series (1995-2003)
- [x] BMW E34 5 Series (1988-1996)
- [x] BMW E28 5 Series (1981-1988)
- [x] Porsche 964 911 (1989-1994)
- [x] Porsche 993 911 (1994-1998)

---

## Technical Debt

- [ ] Add proper meta descriptions for SEO
- [ ] Add Open Graph tags for social sharing
- [ ] Minify CSS/JS for production
- [ ] Add sitemap.xml
- [ ] Add robots.txt
- [x] Consider templating system to reduce HTML duplication (navigation in 18 files) - **DONE: 11ty migration**
- [ ] Add favicon for all pages (some missing)
- [ ] Optimize images for web (if adding photos)

---

## Expanded Vehicle Page Sections (11ty Migration)

Each vehicle page now has the following sections with placeholder/coming soon content:

### Completed Structure
- [x] **Vehicle Hero** - Model name, years, engine options
- [x] **Quick Links** - Sticky navigation to page sections
- [x] **Common Issues** - Existing content migrated
- [x] **Restoration Guides** - Placeholder cards (coming soon)
- [x] **Parts & Suppliers** - Tabbed OEM/Aftermarket/Used lists with placeholder entries
- [x] **Torque Specifications** - Tables for Engine/Suspension/Brakes with common specs
- [x] **DIY Guides** - Placeholder cards (coming soon)

### Content Needed
- [ ] Write actual restoration guide content for each vehicle
- [x] Add real supplier URLs (currently placeholders)
  - All 410 placeholder URLs updated with real links across all 17 vehicles
  - Includes issue sources, supplier links (OEM, aftermarket, used)
- [x] Verify torque specs against factory service manuals
- [x] **Add source references with valid links for all torque specifications**
  - All 17 vehicle platforms now have verified torque specs with source URLs
  - Sources include: Garagistic, E30 Zone Wiki, RTS Auto, Rennlist, Lindsey Racing, Department 69, LN Engineering, Bentley Publishers, and various technical forums
  - Template updated to display source references on vehicle pages
- [ ] Write DIY maintenance guide content
- [ ] Add hero images for each vehicle

---

## 11ty Development Notes

**Commands:**
- `npm run build` - Build site to `_site/`
- `npm run serve` - Dev server at localhost:8080
- `npm run watch` - Watch for changes

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
