# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ZRG Classics is a resource hub for classic Porsche & BMW enthusiasts. It's a static site built with **Eleventy (11ty) v2** using **Nunjucks** templates, **vanilla CSS/JS**, and **Supabase** for authentication and database features. Deployed on **Vercel** at zrgclassics.com.

## Build & Development Commands

```bash
npm run serve              # Dev server with hot reload (localhost:8080)
npm run build              # Build site to _site/
npm run build:search       # Rebuild search index from vehicle JSON data
npm run build:all          # Build site + search index
npm run optimize:images    # Generate WebP + responsive image sizes
npm run minify             # Minify CSS and JS
npm run build:prod         # Full production build (build:all + optimize + minify)
```

No test runner or linter is configured.

## Architecture

### Data-Driven Vehicle Pages

The core content pattern: **JSON data files → Nunjucks templates → static HTML**.

- `src/_data/vehicles/*.json` — 17 vehicle data files (7 BMW, 10 Porsche), each containing issues, guides, torque specs, suppliers, buyer's guide, and community resources
- `src/resources/bmw/*.njk` and `src/resources/porsche/*.njk` — page templates that reference vehicle data
- `src/_includes/layouts/vehicle.njk` — shared layout for all vehicle pages
- `src/_includes/partials/` — reusable components (guide-card, issue-card, specs-table, supplier-list, buyers-guide, etc.)

Vehicle data is accessed in templates via the global `vehicles` object (e.g., `vehicles.e30`).

### Client-Side Search

Search is pre-built at build time, not server-side:
1. `build-search-index.js` reads all vehicle JSON files and produces `src/search-index.json`
2. `src/search.js` loads this index in the browser for full-text filtering by brand, type, and keywords

The search index must be rebuilt (`npm run build:search`) when vehicle data changes.

### Supabase Integration

Client-side Supabase handles all dynamic features:
- **Auth**: Login, register, password reset (`src/account/`, `src/js/supabase.js`)
- **My Garage**: Vehicle storage and maintenance history (`src/account/garage.njk`, `src/js/garage.js`)
- **Forums**: Categories, threads, replies (`src/forum/`, `src/js/forum.js`)
- **Tools**: Invoice creator, build calculator, maintenance tracker, restoration checklist (`src/tools/`)

Database schemas are in `supabase-schema*.sql` files at the project root.

### Styling

Single CSS file (`src/styles.css`, ~12K lines) using CSS custom properties for theming:
- Gulf Racing color palette (Blue #7DCFEA, Orange #F26522, Navy #1E3A5F)
- Dark mode via `[data-theme="dark"]` on `<html>`, persisted in localStorage
- Mobile-first responsive design (breakpoints at 480px and 768px)

### Eleventy Configuration

`.eleventy.js` configures:
- Passthrough copy for images, CSS, JS, and tool files
- Input: `src/`, Output: `_site/`, Includes: `_includes/`, Data: `_data/`
- Template formats: njk, md, html

### Vercel Routing

`vercel.json` defines rewrites for dynamic forum URLs:
- `/forum/:category/:threadId/` → `/forum/thread/`
- `/forum/:category/` → `/forum/category/`

Also sets security headers (X-Frame-Options, CSP-adjacent headers, Permissions-Policy).

## Vehicle Data Schema

All vehicle JSON files follow a consistent structure with these top-level keys: `model`, `brand`, `fullName`, `years`, `engines`, `heroImage`, `buyersGuide`, `issues[]`, `guides[]`, `diyGuides[]`, `torqueSpecs{}`, `suppliers{}`, `communityResources[]`. See any existing file (e.g., `src/_data/vehicles/e30.json`) as the canonical reference when adding new vehicles.

## Key Files

- `src/_data/site.json` — site metadata (name, URL, social links)
- `src/_data/navigation.json` — hierarchical menu structure
- `src/_data/stats.js` — dynamically computes content counts for the homepage
- `src/script.js` — global JS (dark mode toggle, mobile nav, expandable cards)
- `optimize-images.js` — Sharp-based image optimization script
