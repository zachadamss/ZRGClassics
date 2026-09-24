# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZRG Classics is a resource hub for classic Porsche & BMW enthusiasts. It's a static site built with **Eleventy (11ty) v3** using **Nunjucks** templates, **vanilla CSS/JS**, and **Supabase** for authentication and database features. Deployed on **Vercel** at zrgclassics.com.

## Build & Development Commands

```bash
npm run serve              # Dev server with hot reload (localhost:8080)
npm run build              # Build site to _site/
npm run build:search       # Rebuild search index from vehicle JSON data
npm run build:all          # Build site + search index
npm run minify             # Minify CSS and JS
npm run build:prod         # Full production build (build:all + minify)
```

No test runner or linter is configured. Node 22+ is required (`@11ty/eleventy-img` 7).

## Architecture

### Data-Driven Vehicle Pages

The core content pattern: **JSON data files → Nunjucks templates → static HTML**.

- `src/_data/vehicles/*.json` — 17 vehicle data files (7 BMW, 10 Porsche), each containing issues, guides, torque specs, suppliers, buyer's guide, and community resources
- `src/resources/bmw/*.njk` and `src/resources/porsche/*.njk` — page templates that reference vehicle data
- `src/_includes/layouts/vehicle.njk` — shared layout for all vehicle pages
- `src/resources/buying.njk` (+ `buying.11tydata.js`) — paginates `vehiclePages` into one buyer's guide per car at `/resources/<brand>/<car>/buying/`
- `src/_includes/partials/` — reusable components (vehicle-hero, vehicle-grid, guide-card, issue-card, specs-table, supplier-list, buyers-guide, garage-cta, logo, etc.)
- `src/_includes/icons/*.svg` — line icons, included inline

Vehicle data is accessed in templates via the global `vehicles` object (e.g., `vehicles.e30`). Car lists, nav submenus, the footer, the sitemap, the garage platform list (`/js/platforms.js`, generated from `src/_generated/platforms.njk`), and all content counts (`stats.js`, including `stats.byBrand`) are generated from `vehicleList.json` and the vehicle files, so adding a car doesn't require editing them.

Edit vehicle JSON with `scripts/vehicle_json.py` (load/save in the house formatting) so diffs stay readable.

### Images

Photos render through the async `{% picture src, alt, sizes, attrs %}` shortcode in `.eleventy.js` (Eleventy Image: WebP + JPEG at 400/800/1200/1920w, never upscaled, output to `_site/images/responsive/`). Nunjucks drops async shortcode output inside plain `{% for %}` loops, so loops that render pictures (directly or via an include) must use `{% asyncEach %}`. Vehicle photos are placeholders; replace a file in `src/images/vehicles/` and fill that car's `photoCredit`.

### Client-Side Search

Search is pre-built at build time, not server-side:
1. `build-search-index.js` reads all vehicle JSON files and produces `src/search-index.json`
2. `src/search.js` loads this index in the browser for full-text filtering by brand, type, and keywords. URL parameters: `?q=` runs a search, `?brand=BMW|Porsche` presets the brand filter, `?car=e30` limits results to one car (the homepage search sends it)

The search index must be rebuilt (`npm run build:search`) when vehicle data changes.

### Supabase Integration

Client-side Supabase handles all dynamic features:
- **Auth**: Login, register, password reset (`src/account/`, `src/js/supabase.js`)
- **My Garage**: the single home for tracking a car (`src/account/garage.njk`, page script `src/js/pages/garage-page.js`, data layer `src/js/garage.js`). Its maintenance tracker (`/account/garage/maintenance/`, `src/js/maintenance-tracker.js`) and restoration tracker (`/account/garage/restoration/`, `src/js/restoration-tracker.js`) always load one car from `?vehicle=<id>`; the garage page accepts `?vehicle=<id>` and `?add=<platform>` deep links.
- **Forums**: Categories, threads, replies (`src/forum/`, `src/js/forum.js`, page scripts in `src/js/pages/forum-*.js`). Moderators (`profiles.is_moderator`) get Pin/Lock/Delete on every thread and Delete on every reply; those go through the `moderate_thread` / `moderate_delete_reply` RPCs from `supabase-migration-moderation.sql`, which check the flag server-side. Authors delete their own posts through normal RLS
- **Restoration checklist**: the base and per-car items live in `src/js/restoration-checklist.js` (`window.RestorationChecklist`), shared by the tracker and My Garage so both compute progress against the full list. Saved items the base list doesn't know are the owner's custom items
- **Tools**: the public Build Cost Calculator (`src/tools/`) and a `/tools/` hub
- **Newsletter**: `src/js/newsletter.js` subscribes forms marked `data-newsletter-form` directly to ConvertKit

Database schemas are in `supabase-schema*.sql` files at the project root. Run the migrations after them, in order: `supabase-migration-security.sql` (username/avatar constraints, triggers that protect system-managed columns like `is_pinned`/`post_count`, a block on replies to locked threads), `supabase-migration-garage.sql` (columns the garage code writes that the base schema lacked), `supabase-migration-moderation.sql`. All are idempotent. When code starts writing a new column, add it to a migration in the same change.

The login page only follows same-site paths from `?return=` (`safeReturnUrl()`); keep it that way.

Any user- or database-supplied value inserted via `innerHTML` must go through `Forum.sanitizeHtml()` (or the tools' `escapeHtml()`), and user-supplied URLs through `Forum.safeUrl()`. The Supabase client library (vendored at `src/js/vendor/supabase-js-<version>.js`; upgrade steps in `docs/vendored-scripts.md`) and `/js/supabase.js` are loaded once in `layouts/base.njk`; pages should not include them again.

### Content-Security-Policy

`vercel.json` sends a strict CSP: scripts only from this site and Google Tag Manager, no inline `<script>` blocks, no inline event handlers (`onclick=` etc., including in HTML built by JS), and network requests only to Supabase, ConvertKit, and Google Analytics. So:
- Page JavaScript goes in a file (`src/js/pages/<page>.js`) listed in the page's `extraScripts` front matter; use `data-*` attributes plus `addEventListener` (often one delegated listener) instead of `onclick`
- A new third-party service needs its host added to the matching CSP directive (`connect-src`, `script-src`, `form-action`, …) or the browser blocks it with a "Refused to…" console error
- Inline `style="…"` is still allowed (`style-src 'unsafe-inline'`)

### Styling

Single CSS file (`src/styles.css`, ~11K lines) using design tokens in `:root`. The look is a "shop manual": warm paper background, navy ink text, Gulf blue as a color field, monospace for codes and numbers.
- Surfaces: `--background-color` (paper #F5F2EC), `--background-alt`, `--surface` (white cards), `--surface-sunk` (wells inside cards), `--band` / `--band-deep` (dark stats, garage, footer bands), `--border-color`, `--border-strong`. Text: `--text-color` (ink), `--text-secondary`, `--text-muted`, `--text-subtle`, `--link-blue`
- Gulf palette (Blue #7DCFEA, Orange #F26522) is decorative: stripes, bands, the blueprint. Orange is saved for the one main action on a screen (`--accent-strong` button fill, white text 4.6:1) and a few meaningful marks (pinned threads, the 404). Don't use it for borders or decoration
- Type (self-hosted in `src/fonts/`, preloaded in `base.njk`): Archivo (`--font-display`, expanded width) for headings, IBM Plex Sans (`--font-body`), IBM Plex Mono (`--font-mono`) for chassis codes, costs, part numbers, torque values, and small uppercase labels. Fluid scale `--step--1`…`--step-5`; spacing `--space-1`…`--space-9`, `--gutter`, `--content-wide`, `--content-reading`
- `.section-title` headings are numbered automatically (01, 02…) with a CSS counter reset on `#main-content`
- Difficulty is shown by lightness (easy = Gulf blue, moderate = link blue, advanced = ink), not red/yellow/green
- The homepage has its own block at the end of `styles.css`, scoped to `.hm`. It is deliberately photo-free (the car photos are placeholders); its content comes from `src/_data/home.js`
- The header collapses to the menu button at 960px (`NAV_BREAKPOINT` in `script.js` must match the CSS). The drawer is hidden with `clip-path`, not an off-screen transform, so it can't widen the page
- Dark mode via `[data-theme="dark"]` on `<html>`. An inline script in `base.njk` applies the saved theme or `prefers-color-scheme` before first paint; `script.js` only handles the toggle
- `<html>` starts as `no-js` and becomes `js`; scroll-reveal content stays visible without JS
- Desktop-first `max-width` media queries at 1024px, 768px, and 480px (plus 960px for the header). Check 320px too: nothing should scroll sideways
- Page-specific rules are scoped to the page wrapper (`.garage-page`, `.maintenance-tracker`, `.restoration-checklist`, `.calculator-container`, `.auth-page`, `.forum-page`). Don't add unscoped rules for generic class names like `.section-header` or `.vehicle-card`
- Don't use a `<header>` element for page intros; the global `header` rule styles the site header

### Eleventy Configuration

`.eleventy.js` configures:
- Passthrough copy for images, CSS, JS, and tool files
- Input: `src/`, Output: `_site/`, Includes: `_includes/`, Data: `_data/`
- Template formats: njk, md, html

### Vercel Routing

`vercel.json` defines redirects for retired URLs (Invoice Creator, old `/tools/` tracker URLs, `/community/forums/`) and rewrites for dynamic forum URLs:
- `/forum/:category/:threadId/` → `/forum/thread/`
- `/forum/:category/` → `/forum/category/`

Also sets security headers (X-Frame-Options, CSP-adjacent headers, Permissions-Policy).

## Vehicle Data Schema

All vehicle JSON files follow a consistent structure with these top-level keys: `model`, `brand`, `fullName`, `series` (short card label), `tagline`, `years`, `engines`, `heroImage`, `lastReviewed` (YYYY-MM-DD; bump it when you edit that car, it drives the byline, sitemap `lastmod`, and article `dateModified`), `photoCredit{text,url,license}`, `buyersGuide` (with `pricingGuide.asOf`), `issues[]`, `guides[]`, `diyGuides[]`, `torqueSpecs{}`, `suppliers{}`, `communityResources[]`. Issue parts use `partNumber` for real OEM numbers only; use `brand` for aftermarket makers and omit both when it varies. See any existing file (e.g., `src/_data/vehicles/e30.json`) as the canonical reference when adding new vehicles.

## Key Files

- `src/_data/site.json` — site metadata (name, URL, social links)
- `src/_data/navigation.json` — hierarchical menu structure
- `src/_data/stats.js` — content counts for the homepage and brand pages (`stats.byBrand`)
- `src/_data/home.js` — homepage content picked from the vehicle data: the hero job ticket, the featured issue, "the big jobs, priced" (with log-scale cost-ruler positions), and the chassis index. Change the picks at the top of the file; it throws if an issue id doesn't exist
- `.eleventy.js` filters: `range` (en dashes), `money` (en dashes plus thousands separators, for prices), `partNumber(brand)` (11-digit OEM numbers written BMW `11 31 1 711 081` or Porsche `964.105.195.01` style), `readableDate`
- `src/script.js` — global JS (theme toggle, mobile nav, expandable cards, print buttons, `/` to search)
- `src/js/theme-init.js` — loaded synchronously in `<head>`: sets the theme before first paint (kept out of the page for the CSP)
- `src/js/car-memory.js` — car pages and buyer's guides save the last car read to `localStorage` (`zrg:lastCar`); the homepage offers it back ("Pick up where you left off"). Signed-in visitors instead/also get a maintenance status line (`home.js` lazy-loads `garage.js` only when a Supabase session exists)
- `src/js/copy-link.js` — "Copy link" buttons on issue cards (`data-copy-link="#issue-id"`)
- `src/_includes/partials/newsletter-strip.njk` — newsletter sign-up at the end of car pages and buyer's guides
- `docs/site-review-2026-09.md` — September 2026 design/copy review: every finding, its status, and what's waiting on the owner

## SEO

- `base.njk` emits JSON-LD: Organization (with the owner as `founder`), WebSite, BreadcrumbList, and a TechArticle (vehicle pages) or Article (buyer's guides, via `schemaType`) with the owner as author and the car as `about`. All JSON-LD values go through `| dump | safe`; never interpolate raw strings into JSON.
- Front matter `robots:` sets the meta robots tag and drops the page from the sitemap; `canonical: false` omits the canonical tag (forum thread/category templates set it in JS with `Forum.setCanonical()`).
- Vehicle titles follow "<fullName>: Common Problems, Repair Costs & Specs"; the meta description is the car's `tagline` plus a short fixed line, kept under ~160 characters so it isn't cut off in results. Keep new taglines short enough for that.
- HowTo and FAQ markup were left out on purpose (Google no longer shows those rich results for most sites).

## Voice

Site copy is first person ("I"), in a tech-editor tone: knowledgeable, direct, occasional wit, measured opinions. Avoid "Comprehensive/Complete…" openers, "legendary", "sweet spot", "robust", and borrowed manufacturer slogans. Use en dashes for ranges (the `range` filter converts `1982-1994` in templates). Don't invent personal history for the owner.
