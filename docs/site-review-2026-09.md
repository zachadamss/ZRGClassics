# Site Review — September 2026

Design and copy review of zrgclassics.com, and the fixes that came out of it. Work happens on the `site-review-fixes` branch.

**Status key:** ✅ done · 🟡 partial / needs owner input · ⏳ in progress · ⬜ not started

## Decisions (from the owner, 2026-09-23)

- **Voice:** first person ("I"), tech-editor tone: knowledgeable, direct, occasional wit, measured opinions. Reference line: *"The M20's weak point is its rubber timing belt. It's an interference engine, so a snapped belt means bent valves. Replace it every 50,000 miles or four years, and do the water pump and tensioner at the same time."*
- **Photos:** the current vehicle photos are placeholders. Build the image system so real photos drop in as file replacements.
- **About page:** the owner will supply personal details (name/handle, cars, why ZRG exists).
- **Bigger changes approved:** split buyer's guides into their own pages; make My Garage the single home for tracking a car; new heading font; homepage newsletter subscribes directly to ConvertKit.
- **Defaults accepted:** remove Shop from the nav (page kept, `noindex`); drop "Coming Soon" cards; hide zero forum counts; build a `/tools/` hub.

---

## Top 10

| ID | Item | Status | Notes |
|----|------|--------|-------|
| T1 | Consistent, well-cropped car photos | 🟡 | Photos are placeholders from the owner. Image system done: responsive `<picture>` (WebP+JPEG, 400–1920w), fixed 3:2 card crops, `photoCredit` field per vehicle shown in the hero. To replace: drop a new file at the same path in `src/images/vehicles/` and fill `photoCredit`. |
| T2 | Fix factual errors (E30 M42 belt vs chain, etc.) | ✅ | See Accuracy A1–A10 and N11–N16. Remaining doubts are listed under "Needs owner review". |
| T3 | Remove borrowed manufacturer slogans from brand pages | ✅ | BMW: "Seven BMWs, from the E28 to the E90." Porsche: "Ten Porsches: front-engined, air-cooled, and water-cooled." |
| T4 | Homepage section headers broken by duplicate `.section-header` CSS | ✅ | Garage `.section-header` scoped to `.garage-page`; homepage header rebuilt. |
| T5 | Rewrite hero; cut generic homepage sections | ✅ | New hero with search built in; generic "Everything You Need"/CTA sections removed. |
| T6 | Use responsive/WebP images; stop loading 1920px JPEGs in 170px cards | ✅ | Eleventy Image `picture` shortcode (`.eleventy.js`); `optimize-images.js` removed. Logo is now inline SVG. |
| T7 | Remove "Coming Soon" from nav/homepage; hide empty forum counts | ✅ | Shop out of nav (`noindex`, honest copy); Coming Soon cards removed; empty forum categories show "Start the first thread" instead of "0 threads · 0 posts". |
| T8 | Newsletter form shouldn't force account creation | ✅ | `src/js/newsletter.js` subscribes in place via ConvertKit; registration reuses it. |
| T9 | Model-specific signature guides instead of identical guide sets | 🟡 | 17 signature guides added, one per car (list below). Written conservatively (torque values point to the page's own table), but they need an owner read before going live. |
| T10 | Real About page | ✅ | Owner section written from Zach's details (cars owned, current garage, PNW independent mechanic) plus a "Why ZRG" section: *zurückgeben*, give back/restore, OEM+. |

## Design

| ID | Item | Status | Notes |
|----|------|--------|-------|
| D1 | Logo: SVG, transparent, Gulf palette | ✅ | Inline SVG lockup (`partials/logo.njk`, `logo-mark.njk`), early long-hood 911 profile in Gulf livery (redrawn 2026-09-24 from the car's proportions: raked windshield, fastback, rounded tail, Fuchs-style wheels); favicon.svg, favicon-32, apple-touch-icon, og-default.png and the homepage blueprint are generated from the same paths. A professional logo can replace these files later. |
| D2 | Replace emoji icons with a consistent SVG icon set | ✅ | `src/_includes/icons/*.svg` (14 line icons) on homepage, tools hub, 404. |
| D3 | Lighten hero overlay so the car shows | ✅ | Homepage overlay is a left-to-right gradient; vehicle hero uses a bottom gradient. |
| D4 | New heading font | ✅ | Archivo (expanded width) for display; Inter for body. Body font later changed to IBM Plex Sans (see R2). |
| D5 | Design tokens: type scale, spacing, fix undefined vars (`--text-primary`, `--background`, `--gulf-orange-rgb`) | ✅ | Tokens in `:root`: type scale `--step-*`, spacing `--space-*`, `--gutter`, content widths, fonts; undefined vars now defined. |
| D6 | Deduplicate conflicting top-level selectors (37 found) | ✅ | 132 selectors scoped to their page (`.garage-page`, `.maintenance-tracker`, `.restoration-checklist`, `.calculator-container`, `.auth-page`, `.forum-page`, …); 90 dead classes removed; 12,046 → ~9,970 lines. |
| D7 | Homepage order: vehicles higher, newsletter lower, search in hero | ✅ | Hero+search → stats → cars → what's on a car page → garage → forum → newsletter. |
| D8 | Card grids: no orphan rows | ✅ | Column count by card count (7 → 4+3, 10 → 5+5, families 2–4); swipeable row on phones. |
| D9 | Vehicle cards: drop redundant model/name duplication | ✅ | Cards show model, series (e.g. "Transaxle V8", "Boxster & Cayman"), years. New `series` field. |
| D10 | Vehicle pages too long; split buyer's guide to its own page | ✅ | Buyer's guides at `/resources/<brand>/<car>/buying/`; teaser card on the vehicle page. |
| D11 | Pricing tiers: neutral progression instead of red/amber/green | ✅ | Tiers share one card style; top border deepens blue → orange. |
| D12 | Forum page width/alignment consistent with the rest of the site | ✅ | Added the missing `.container` rule (forum and garage were full-width); forum copy rewritten. |
| D13 | Vehicle hero: taller, better crop, years in headline | ✅ | 460px photo hero, bottom-left title, years as its own line, optional `tagline`. |
| D-IMG | Photo pipeline: `<picture>`/srcset, fixed aspect ratios, `photoCredit` field + credit line | ✅ | See T1. |

### Accessibility

| ID | Item | Status | Notes |
|----|------|--------|-------|
| X1 | `--text-muted` / `--text-subtle` fail WCAG AA on light backgrounds | ✅ | `--text-muted` #4F6B8A (5.5:1), `--text-subtle` #526D8C (≥4.6:1). |
| X2 | White text on orange buttons (3.15:1) | ✅ | Buttons use `--accent-strong` #C4521A (4.6:1); orange text uses `--accent-text` #B8481A (5.3:1). |
| X3 | Popular-search chips ~1.75:1 | ✅ | Chips use `--link-blue` #236C90 (5.8:1). |
| X4 | Dark-mode flash on load; honour `prefers-color-scheme` | ✅ | Inline head script applies saved theme or `prefers-color-scheme` before paint. |
| X5 | Scroll-reveal content invisible without JS | ✅ | `no-js` class on `<html>`, swapped to `js` by the head script; `.no-js .animate-on-scroll` stays visible. |

## Copy

| ID | Item | Status | Notes |
|----|------|--------|-------|
| C1 | Homepage copy rewrite (hero, sections, CTA) | ✅ | New hero, section headings, garage/forum/newsletter copy. |
| C2 | Brand page copy rewrite | ✅ | Brand heroes, family blurbs, search prompts; stats from data. |
| C3 | Remove "Comprehensive/Complete…" template openers from guide descriptions | ✅ | All 136 existing guide descriptions rewritten car by car. |
| C4 | Remove filler vocabulary (robust, essential, sweet spot, legendary, ultimate) | ✅ | ~100 filler phrases rewritten (robust, sweet spot, legendary, notorious, Premier, Industry-leading…); "critical" kept only for structural/safety items; 44 ALL-CAPS step labels changed to sentence case. |
| C5 | Rewrite buyer's guide overviews in the owner voice | ✅ | All 17 overviews rewritten, plus a new one-line `tagline` per car shown in the hero. |
| C6 | Typography: en dashes for ranges; real dashes instead of spaced hyphens | ✅ | 1,132 spaced hyphens in data became dashes (85 numeric ranges corrected to en dashes); `range` filter formats years and prices in templates. |
| C7 | "Vintage" → "classic" on tool pages | ✅ | Calculator and Terms now say "classic". |
| C8 | Newsletter, CTA, tools, account, forum, 404 microcopy | ✅ | Newsletter, 404, tools hub, garage, trackers' sign-in prompts, account pages, forum, vehicle partial labels. |

## Technical accuracy

| ID | Item | Status | Notes |
|----|------|--------|-------|
| A1 | E30: M42 is chain-driven, not belt | ✅ | E30 issue, parts, DIY guide, variant, inspection point, and red flag corrected: M20 = belt, M10/M42 = chain. |
| A2 | E30: engine list missing M20B27 "eta" | ✅ | E30 engines now include the M20 2.7L "eta" and label the S14 as the M3. |
| A3 | E46: only 5 issues; missing OFHG, DISA, rear shock mounts, S54 rod bearings/VANOS | ✅ | Added: oil filter housing gasket, DISA valve, rear shock mount tear-out, S54 rod bearings + VANOS hardware (9 issues total). |
| A4 | E46: engine list missing M54B25, M52TU 2.8 | ✅ | M52TU 2.5/2.8, M54 2.5/3.0, S54 listed with models. |
| A5 | E36: S52 is 3.2L (US) | ✅ | Engine list now distinguishes the 1995 US M3 (S50B30US 3.0) from 1996–99 (S52 3.2); fixed "240-240 hp" typo. |
| A6 | 993: add secondary air injection (SAI) | ✅ | Added "Secondary Air Injection Ports Clogging (1996–98)". |
| A7 | 991 / 987.2 issue lists lean on earlier-engine problems | 🟡 | 987.2 wording fixed (DFI on S models only; no IMS on any 987.2). 991 coolant-pipe and 987.2/991 carbon-buildup entries left as-is for owner review. |
| A8 | 996 parts table: supplier name in part-number column | ✅ | Part numbers normalized site-wide: 15 brand names moved to a `brand` field, 88 "Various"/"N/A" placeholders removed; table shows the brand or "Varies". |
| A9 | "Factory-verified torque specs" claim | ✅ | Removed from homepage and brand pages; torque section now says to check the listed source and your manual. |
| A10 | "Prices as of {{ site.year }}" auto-updates; needs a real as-of date per vehicle | ✅ | `pricingGuide.asOf` per vehicle ("January 2026", when the data was written). Confirm and update when prices are rechecked. |

## Other

| ID | Item | Status | Notes |
|----|------|--------|-------|
| O1 | 404 page links to non-existent `/vehicles/` and `/tools/` | ✅ | 404 rebuilt; links to `/`, `/resources/`, `/tools/`, `/forum/` (all exist). |
| O2 | Tools vs My Garage vs vehicle-page checklist overlap: Garage becomes single home | ✅ | Trackers live under My Garage; tools pages load a car from `?vehicle=`; vehicle-page localStorage checklist removed (anyone with progress saved there loses it; the site is new, so I judged this acceptable). |
| O3 | Brand-page stats hardcoded; TODO.md guide counts stale | ✅ | Brand stats from `stats.byBrand`; supplier count fixed; TODO.md counts updated. |
| O4 | SEO: stray `twitter:site`, logo as OG image, meta keywords, FAQ schema | ✅ | Stray `twitter:site` only when a Twitter URL exists; `og-default.png` 1200×630; meta keywords removed; FAQ schema removed; account/tool pages `noindex`. |
| O5 | Nav: `href="#"` parents; Porsche order inconsistent | ✅ | Parent items link to `/resources/` and `/tools/`; car submenus generated from `vehicleList.json`. |
| O6 | Build calculator description promises PDF/spreadsheet export | ✅ | Now "print it or export to CSV". |
| O7 | CLAUDE.md says mobile-first; CSS is desktop-first | ✅ | CLAUDE.md now describes the desktop-first breakpoints and the new token system. |
| O8 | Shop page meta claims cars for sale; remove from nav | ✅ | Shop is out of the nav, `noindex`, and describes itself accurately. |

---

## Found along the way

| ID | Item | Status | Notes |
|----|------|--------|-------|
| N1 | Garage "Open Full Checklist" deep link crashed (`vehicleSelect` undefined in restoration JS) | ✅ | Fixed by the garage merge |
| N2 | Login `?return=` accepted any URL (open redirect) | ✅ | `safeReturnUrl()` in `login.njk` only allows same-site paths; `requireAuth` now keeps the query string |
| N3 | Trackers linked to login with `?redirect=`, which login ignored | ✅ | Now `?return=` with the full current URL |
| N4 | `@11ty/eleventy-img` 7 requires Node 22, `package.json` said `>=18` | ✅ | `engines.node` `>=22`, `.nvmrc` 22 |
| N5 | Search ignored `?brand=` from brand pages; URL searches used a 500ms timeout | ✅ | `search.js` reads `brand` and waits for the index promise |
| N6 | Garage platform years disagreed with vehicle pages (E39, E46, 991, 996) | ✅ | Generated from vehicle data via `/js/platforms.js` |
| N7 | Sitemap listed `/community/forums/` (404) and was hand-maintained | ✅ | Generated from collections; old URL redirects to `/forum/` |
| N8 | Stats supplier count only counted `oem`, `aftermarket` (nonexistent key), `used` | ✅ | Counts unique names across all categories |
| N9 | Vehicle year conventions are mixed (model years vs production years) | 🟡 | Left as-is; owner review recommended |
| N10 | Nunjucks async shortcodes inside `for` loops silently drop output | ✅ | `asyncEach` used in `vehicle-grid.njk` and brand loops; noted in CLAUDE.md |
| N11 | E28 and E34 guides described a "multi-link" rear suspension (both are semi-trailing arm) | ✅ | Descriptions rewritten |
| N12 | 964 suspension guide was written around torsion bars; the 964 uses coil springs | ✅ | Torsion-bar steps/warnings rewritten, pre-964 spring plate part removed; flagged for review |
| N13 | 993 "serpentine belt" guide described an automatic tensioner the car doesn't have | ✅ | Replaced with a shim-adjusted fan/alternator belt guide; flagged for review |
| N14 | E36 overview years (1992–1999) contradicted the page (1990–2000) | ✅ | Overviews no longer restate years |
| N15 | 964 distributor issue said "twin distributors driven off the camshafts" | ✅ | Rewritten around the known internal drive belt + vent kit |
| N16 | 987.2 described as all-DFI | ✅ | Base 2.9 was port-injected; wording, best-years, and issue title corrected |
| N17 | Tools-hub intro used a `<header>` element and inherited the site header's sticky navy styling | ✅ | Changed to `<div>`; noted in CLAUDE.md |

## Content review pass (2026-09-24)

Second pass over every vehicle file for accuracy and voice. All 137 issue descriptions, all 17 buyer's guides (variants, red flags, what to look for, tips), and the flagged items were re-read; uncertain claims were checked against published sources (dictionaries, LN Engineering, Porsche/BMW community references, specialist tech articles).

**Verified and resolved from the previous review list**
- E30 oil capacities were swapped: now M20 ≈ 4.5 qt (4.25 L), M42 ≈ 5.25 qt (5.0 L)
- 944 has no timing belt "inspection window": the guide now pulls the upper cover; "oil on the belt = water pump" corrected (oil = seals, coolant = pump)
- 986/996 "best years… improved IMS bearing" was backwards: 1997–99 (986) and through MY2000 (996) have the stronger dual-row bearing (~1% failure); 2001–05 single-row (~8%). 996 issue text had the dual-row years wrong too
- 987.1 IMS bearing is single-row (larger, non-serviceable from 2006), not dual-row
- 991: "coolant pipe failures" retitled to cooling-system leaks (housings, seals, radiators); DI carbon buildup toned down for 987.2/997.2/991 (mild on Porsche engines)
- PDK: Porsche's 991 schedule is clutch fluid every 60,000 mi and transmission fluid every 120,000 mi/12 yrs (many specialists say 60,000), not "lifetime"
- 964 uses coil springs (confirmed); a leftover "Torsion Bar Cover" torque spec was removed
- 993 fan belt: shim-adjusted (confirmed); steps corrected to the pulley's clamp bolts and ~5 mm deflection target
- Glued coolant pipes are a Mezger (Turbo/GT2/GT3) problem (confirmed); E90 electric pump bleed routine confirmed
- Year conventions (N9): overviews no longer restate years, so the only years shown are the page header's

**New errors found and fixed in this pass**
- E28: front suspension isn't multi-link; warm-up regulator isn't used on US E28s; 1,340 North American M5s (was 1,239)
- E30: convertible wrongly credited to Baur; a buying tip contradicted itself
- E34: M60 timing guides are plastic, not "Nikasil"; the 3.8L M5 was Europe-only; US Touring included the 530iT
- E36: removed an S52 rod-bearing red flag, "glass European headlights," and an unverifiable "M3/4/5 package"
- E39: front suspension is MacPherson (multi-link rear); US Touring included the V8 540iT; M5 rod-bearing advice toned down
- E46: front suspension is MacPherson; the ZHP didn't include a limited-slip differential; removed an unverified transmission model
- E90: the N20 isn't an E90 engine; "VANOS bolts backing out" is an S54 problem; HPFP trouble is N54, not N55; fixed "300-300 hp"
- 924: 2.0L cars (including the Turbo) have no balance shafts; base 924s have no DME; all 924s were fuel-injected; automatics existed
- 928: automatics were Mercedes-sourced (no Aisin); every 928 has the Weissach axle; removed "biodegradable wiring"
- 944: the 944S engine didn't come "from the 968"; automatics existed; removed "guibo" from the torque tube
- 964: it's rear-engined, not mid-engined; not the cheapest air-cooled 911
- 993: Varioram arrived for 1996; manual cars use a shift rod, not cables
- 996: PASM/Sport Chrono weren't 996 options; 997 GT3 output range corrected (415–500 hp)

**Voice**: every issue description, variant blurb, and buying tip is now in the first-person tech-editor voice; ALL-CAPS in guide steps changed to sentence case.

## Redesign: "shop manual" (2026-09-24)

The owner approved the homepage concept and asked for a photo-free homepage with its own voice instead of a generic template, carried through the site. Work is on branch `claude/brave-hopper-g4dtnl`.

| ID | Item | Status | Notes |
|----|------|--------|-------|
| R1 | Palette: paper, ink, Gulf blue as a field, orange only for the main action | ✅ | New tokens (`--band`, `--surface-sunk`, `--border-strong`); decorative orange borders moved to ink or Gulf blue; headings in ink (warm white in dark mode). |
| R2 | Type: self-hosted Archivo, IBM Plex Sans, IBM Plex Mono | ✅ | Replaces Google Fonts and Inter. Mono for chassis codes, prices, part numbers, torque values, labels. Two faces preloaded; ~230 KB total. |
| R3 | Homepage rebuilt without photos | ✅ | Blueprint hero (the logo's 911 drawn as a line, three callouts) with a real job ticket; car-aware search; stats; chassis index (brand tabs on phones); a full real issue card; "the big jobs, priced" on a log-scale cost ruler; garage preview; who-writes-this stamp; "also in the shop"; newsletter. Content from `src/_data/home.js`. |
| R4 | Header and footer | ✅ | Livery stripe, icon search and theme buttons, Join or My Garage pill, 960px collapse, clip-path drawer; footer with mono car lists. Home and Search left the text nav (logo and icon cover them). |
| R5 | Site-wide details | ✅ | Numbered section titles; issue cards with neutral mono cost boxes and difficulty by lightness; part numbers formatted BMW/Porsche style; calmer supplier tags; mono table headers; About numbered; 404 "part not in the catalog". |
| R6 | Search `?car=` | ✅ | Homepage search can target one car; car with no query goes straight to that car's page. |
| R7 | Accessibility | ✅ | axe (WCAG 2 A/AA) clean on 16 pages, light and dark, 1440px and 390px. Calculator's 164 inputs labeled; skip link, filter buttons, dark-mode link buttons fixed. No sideways scroll from 320px up. |
| R8 | Logged-in pages (garage, trackers) | 🟡 | Styled through the shared tokens but not screenshot-tested, since they need a signed-in session. Worth a click-through. |

## Needs owner review

Much shorter now. What's left is judgment calls rather than likely errors:

1. **Signature guides (T9)**: the key claims were checked (964 coil springs, 993 fan belt, 997 Mezger coolant pipes, E90 bleed routine, 944 tension gauge, PDK intervals). The procedures are conservative, but a read-through from you is still the best check.
2. **924/944 drivetrain couplings**: the inspection checklist mentions a rubber coupling between the engine and torque tube. Confirm or remove.
3. **Prices** are "checked January 2026". Recheck and update `pricingGuide.asOf` when you do.
4. **Logo** is my redraw. Keep, tweak, or replace.
5. **Vehicle-page checklist removal**: anyone with progress saved in the old localStorage checklist lost it.

## Change log

- **2026-09-23**: `4672500` normalized vehicle JSON formatting (no content change) so later diffs are readable.
- **2026-09-23**: `3c7239a` structure, design system, garage merge, buyer's guide pages, image pipeline, SEO, and the fixes N1–N8, N10.
- **2026-09-23**: `adc4386` vehicle data accuracy fixes (A1–A10, N11–N16), 17 signature guides, overviews/taglines, guide descriptions, filler and typography pass.
- **2026-09-23**: `2ba1617` page copy (forum, account, calculator, Terms), About rebuild, CLAUDE.md/README/TODO updates.
- **2026-09-23**: site URL switched to `https://www.zrgclassics.com` (Vercel's primary domain) so canonical tags, sitemap, and social links stop pointing at a redirect; About page owner section and "Why ZRG" added.
- **2026-09-24**: content review pass (accuracy + voice) on branch `content-review`; see "Content review pass" above.
- **2026-09-24**: SEO pass (PR #6): search-style vehicle titles and tagline-based descriptions; JSON-LD rebuilt with valid encoding plus Article/TechArticle markup (author, car as subject); visible author byline with last-reviewed date; per-car `lastReviewed` drives sitemap `lastmod` and `dateModified`; internal search pages `noindex`; forum thread/category canonical set per URL in JS; hero alt text; Crawl-delay removed.
- **2026-09-24**: "shop manual" redesign on `claude/brave-hopper-g4dtnl`: photo-free homepage, new header/footer, self-hosted fonts, site-wide palette and type pass, search `?car=` filter, accessibility fixes (see "Redesign" above).
- **2026-09-24**: hardening and return visits: Supabase client self-hosted; every inline script and handler moved to files and a strict Content-Security-Policy added; forum moderation (moderator flag, pin/lock/delete RPCs, thread-page controls); `supabase-migration-garage.sql` for garage columns the base schema lacked; fixed the forum index script (a syntax error kept `/forum/` on "Loading…"), My Garage restoration % (counted only saved items), and custom restoration items disappearing on reload; homepage "pick up where you left off" and signed-in maintenance line, copy-link on issues, newsletter sign-up on car pages, `/` to search.
- **2026-09-24**: logo car redrawn as an early long-hood 911 (facing left, engine at the back) in the header, footer, favicon, share image, homepage blueprint, and author stamp; blueprint callouts re-pointed (engine callout now at the rear), footer wheels made visible on the dark band.
