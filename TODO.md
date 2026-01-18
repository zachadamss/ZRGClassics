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
- [x] **11ty Migration** - Converted from static HTML to 11ty-powered static site
  - Nunjucks templating with layouts and partials
  - Data-driven vehicle pages from JSON files
  - Automatic navigation generation from data
  - Build system with `npm run build` and `npm run serve`

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
- [ ] Newsletter signup for launch notifications
- [ ] Add more vehicle platforms (E90, 987, 991, etc.)
- [x] Add better navigation structure/home page for each brand to see all of the models, and then the same for each model to see all of the resources for that model.
- [ ] Adjust color scheme to match color codes of vintage porsche racing in a very aesthetic, modern, and still timeless way.
- [x] Fix usability on mobile, does not work well, user menu is not fully visible and page is not resizing correctly.  

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
- [ ] Add "Related Issues" links between similar problems across platforms
- [ ] Add print-friendly styling for resource pages (mechanics can print guides)
- [ ] Add "Report Issue" or "Suggest Edit" links for community contributions
- [ ] Add estimated repair costs to issue cards
- [ ] Add difficulty ratings for DIY repairs (Easy/Moderate/Advanced)
- [ ] Add parts links or part numbers where applicable

### New Platforms to Add
- [ ] BMW E90/E91/E92/E93 (2005-2013 3 Series)
- [ ] Porsche 987 Boxster/Cayman (2005-2012)
- [ ] Porsche 991 911 (2012-2019)
- [ ] BMW E39 5 Series (1995-2003)
- [ ] BMW E34 5 Series (1988-1996)

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
- [ ] Add real supplier URLs and notes (currently placeholders)
- [ ] Verify torque specs against factory service manuals
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
