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
| T1 | Consistent, well-cropped car photos | 🟡 | Photos are owner-supplied. Image system prepared (see D-IMG). |
| T2 | Fix factual errors (E30 M42 belt vs chain, etc.) | ⬜ | See Accuracy section |
| T3 | Remove borrowed manufacturer slogans from brand pages | ⬜ | |
| T4 | Homepage section headers broken by duplicate `.section-header` CSS | ⬜ | |
| T5 | Rewrite hero; cut generic homepage sections | ⬜ | |
| T6 | Use responsive/WebP images; stop loading 1920px JPEGs in 170px cards | ⬜ | |
| T7 | Remove "Coming Soon" from nav/homepage; hide empty forum counts | ⬜ | |
| T8 | Newsletter form shouldn't force account creation | ⬜ | |
| T9 | Model-specific signature guides instead of identical guide sets | ⬜ | |
| T10 | Real About page | 🟡 | Waiting on owner details |

## Design

| ID | Item | Status | Notes |
|----|------|--------|-------|
| D1 | Logo: SVG, transparent, Gulf palette | ⬜ | |
| D2 | Replace emoji icons with a consistent SVG icon set | ⬜ | |
| D3 | Lighten hero overlay so the car shows | ⬜ | |
| D4 | New heading font | ⬜ | |
| D5 | Design tokens: type scale, spacing, fix undefined vars (`--text-primary`, `--background`, `--gulf-orange-rgb`) | ⬜ | |
| D6 | Deduplicate conflicting top-level selectors (37 found) | ⬜ | |
| D7 | Homepage order: vehicles higher, newsletter lower, search in hero | ⬜ | |
| D8 | Card grids: no orphan rows | ⬜ | |
| D9 | Vehicle cards: drop redundant model/name duplication | ⬜ | |
| D10 | Vehicle pages too long; split buyer's guide to its own page | ⬜ | |
| D11 | Pricing tiers: neutral progression instead of red/amber/green | ⬜ | |
| D12 | Forum page width/alignment consistent with the rest of the site | ⬜ | |
| D13 | Vehicle hero: taller, better crop, years in headline | ⬜ | |
| D-IMG | Photo pipeline: `<picture>`/srcset, fixed aspect ratios, `photoCredit` field + credit line | ⬜ | |

### Accessibility

| ID | Item | Status | Notes |
|----|------|--------|-------|
| X1 | `--text-muted` / `--text-subtle` fail WCAG AA on light backgrounds | ⬜ | |
| X2 | White text on orange buttons (3.15:1) | ⬜ | |
| X3 | Popular-search chips ~1.75:1 | ⬜ | |
| X4 | Dark-mode flash on load; honour `prefers-color-scheme` | ⬜ | |
| X5 | Scroll-reveal content invisible without JS | ⬜ | |

## Copy

| ID | Item | Status | Notes |
|----|------|--------|-------|
| C1 | Homepage copy rewrite (hero, sections, CTA) | ⬜ | |
| C2 | Brand page copy rewrite | ⬜ | |
| C3 | Remove "Comprehensive/Complete…" template openers from guide descriptions | ⬜ | |
| C4 | Remove filler vocabulary (robust, essential, sweet spot, legendary, ultimate) | ⬜ | |
| C5 | Rewrite buyer's guide overviews in the owner voice | ⬜ | |
| C6 | Typography: en dashes for ranges; real dashes instead of spaced hyphens | ⬜ | |
| C7 | "Vintage" → "classic" on tool pages | ⬜ | |
| C8 | Newsletter, CTA, tools, account, forum, 404 microcopy | ⬜ | |

## Technical accuracy

| ID | Item | Status | Notes |
|----|------|--------|-------|
| A1 | E30: M42 is chain-driven, not belt | ⬜ | |
| A2 | E30: engine list missing M20B27 "eta" | ⬜ | |
| A3 | E46: only 5 issues; missing OFHG, DISA, rear shock mounts, S54 rod bearings/VANOS | ⬜ | |
| A4 | E46: engine list missing M54B25, M52TU 2.8 | ⬜ | |
| A5 | E36: S52 is 3.2L (US) | ⬜ | |
| A6 | 993: add secondary air injection (SAI) | ⬜ | |
| A7 | 991 / 987.2 issue lists lean on earlier-engine problems | ⬜ | Owner review recommended |
| A8 | 996 parts table: supplier name in part-number column | ⬜ | |
| A9 | "Factory-verified torque specs" claim | ⬜ | |
| A10 | "Prices as of {{ site.year }}" auto-updates; needs a real as-of date per vehicle | ⬜ | |

## Other

| ID | Item | Status | Notes |
|----|------|--------|-------|
| O1 | 404 page links to non-existent `/vehicles/` and `/tools/` | ⬜ | |
| O2 | Tools vs My Garage vs vehicle-page checklist overlap: Garage becomes single home | ⬜ | |
| O3 | Brand-page stats hardcoded; TODO.md guide counts stale | ⬜ | |
| O4 | SEO: stray `twitter:site`, logo as OG image, meta keywords, FAQ schema | ⬜ | |
| O5 | Nav: `href="#"` parents; Porsche order inconsistent | ⬜ | |
| O6 | Build calculator description promises PDF/spreadsheet export | ⬜ | |
| O7 | CLAUDE.md says mobile-first; CSS is desktop-first | ⬜ | |
| O8 | Shop page meta claims cars for sale; remove from nav | ⬜ | |

---

## Change log

Entries are added as work lands.
