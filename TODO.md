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
- [x] **Homepage Redesign** - Modern, comprehensive homepage layout
  - Hero section with background image and gradient overlay
  - Stats bar (17 vehicles, 130+ issues, 400+ torque specs, 170+ suppliers)
  - Quick search with popular search links
  - Vehicle platforms section showing all 17 BMW and Porsche models dynamically
  - Features section highlighting site capabilities
  - Tools section with Invoice Creator and coming soon items
  - Community section preview (forums, marketplace, events)
  - Full mobile responsive design
  - Added `vehicleList.json` data file for template iteration

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
- [x] **Add estimated repair costs to issue cards**
  - All 132 issues across 17 vehicles now include DIY and Shop cost estimates
  - Added OEM part numbers and price ranges for common replacement parts
  - Cost notes explain labor hours, considerations, and recommendations
- [x] **Add difficulty ratings for DIY repairs** - Easy/Moderate/Advanced badges on all 132 issues
  - Ratings based on tool requirements, experience level, and complexity
  - Color-coded badges (green/yellow/red) visible on issue cards
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
- [x] **Adjust color scheme to match vintage Porsche racing aesthetics** - Gulf livery inspired colors implemented throughout site
- [x] Fix usability on mobile, does not work well, user menu is not fully visible and page is not resizing correctly.
- [x] Fix mobile responsiveness for vehicle pages (quick-links, engine tags, search results)  

---

## Next Priorities

### Content
- [x] **Porsche 924** - Add detailed common issues content (timing belt, fuel injection, rust spots, electrical)
- [x] **Porsche 944** - Add detailed common issues content (timing belt, balance shaft, clutch, dashboard cracks)
- [x] **Porsche 928** - Add detailed common issues content (timing belt, V8 specific issues, electrical gremlins)

### Design & UX
- [x] Adjust color scheme to match vintage Porsche racing aesthetics (Gulf livery colors)
- [ ] Add hero images to brand landing pages (BMW and Porsche index pages)
- [ ] Add vehicle silhouette or icon graphics to resource cards
- [x] **Improve typography hierarchy on resource pages** - Added professional font pairing
  - Playfair Display (serif) for headings - elegant, classic feel
  - Inter (sans-serif) for body text - clean, readable
  - Improved visual hierarchy with better font sizes, weights, letter-spacing
  - Consistent typography across homepage, vehicle pages, issue cards

### Features
- [x] Add search functionality across all resources
- [x] Expand search to include torque specs, guides, DIY guides, and suppliers
- [ ] Add "Related Issues" links between similar problems across platforms
- [x] **Add print-friendly styling for resource pages** - Comprehensive print CSS for mechanics
  - Clean black/white layout optimized for printing
  - Issue cards, torque specs, parts tables all print-ready
  - URLs shown inline for reference sources
  - Page break handling to avoid splitting content
- [ ] Add "Report Issue" or "Suggest Edit" links for community contributions
- [x] Add estimated repair costs to issue cards
- [x] **Add difficulty ratings for DIY repairs** - Easy/Moderate/Advanced badges on all issues
- [x] Add parts links or part numbers where applicable

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

- [x] **Add proper meta descriptions for SEO** - All pages now have unique, descriptive meta descriptions
  - Static pages: Custom descriptions in frontmatter
  - Vehicle pages: Auto-generated from vehicle data (model, years, features)
- [x] **Add Open Graph tags for social sharing** - Full OG and Twitter Card support
  - og:title, og:description, og:image, og:url, og:type, og:site_name, og:locale
  - twitter:card, twitter:title, twitter:description, twitter:image, twitter:site
  - Vehicle pages use hero images as OG images when available
- [ ] Minify CSS/JS for production
- [x] **Add sitemap.xml** - Auto-generated sitemap with all 27 pages, proper priorities and change frequencies
- [x] **Add robots.txt** - Includes sitemap reference and crawl-delay
- [x] Consider templating system to reduce HTML duplication (navigation in 18 files) - **DONE: 11ty migration**
- [x] **Add favicon for all pages** - Simplified paths, added theme-color meta tag
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

**Adding Hero Images:**

Hero images are displayed as backgrounds in the vehicle page header. To add a hero image:

1. **Naming Convention:** `{model-id}-hero.jpg`
   - BMW examples: `e30-hero.jpg`, `e46-hero.jpg`, `e90-hero.jpg`
   - Porsche examples: `986-hero.jpg`, `993-hero.jpg`, `997-hero.jpg`

2. **Location:** Place images in `src/images/vehicles/`

3. **Recommended Specs:**
   - **Format:** JPEG (for best compression)
   - **Orientation:** Landscape (wider than tall)
   - **Resolution:** 1920x1080 minimum for sharp display on modern screens
   - **File Size:** Under 500KB for fast loading (use image optimization)

4. **Image Sources:**
   - Own photography
   - Stock photos from Unsplash, Pexels, Pixabay (free commercial use)
   - Wikimedia Commons (may require attribution)

5. **Current Vehicle Hero Images:**
   | Vehicle | Image File |
   |---------|-----------|
   | BMW E28 | `e28-hero.jpg` |
   | BMW E30 | `e30-hero.jpg` |
   | BMW E34 | `e34-hero.jpg` |
   | BMW E36 | `e36-hero.jpg` |
   | BMW E39 | `e39-hero.jpg` |
   | BMW E46 | `e46-hero.jpg` |
   | BMW E90 | `e90-hero.jpg` |
   | Porsche 924 | `924-hero.jpg` |
   | Porsche 928 | `928-hero.jpg` |
   | Porsche 944 | `944-hero.jpg` |
   | Porsche 964 | `964-hero.jpg` |
   | Porsche 986 | `986-hero.jpg` |
   | Porsche 987 | `987-hero.jpg` |
   | Porsche 991 | `991-hero.jpg` |
   | Porsche 993 | `993-hero.jpg` |
   | Porsche 996 | `996-hero.jpg` |
   | Porsche 997 | `997-hero.jpg` |

6. **How It Works:**
   - The `heroImage` property in each vehicle's JSON file points to the image path
   - If the image file exists, it displays as a full-width background behind the vehicle title
   - A gradient overlay ensures text remains readable
   - If no image exists, the default gradient background is used instead
