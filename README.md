# ZRG Classics

A free resource hub for classic Porsche and BMW owners — live at [zrgclassics.com](https://zrgclassics.com).

## Features

- **Vehicle resources** for 17 platforms (BMW E28–E90, Porsche 924–997): common issues with repair costs, step-by-step restoration and DIY guides, torque specs, buyer's guides, parts suppliers, and community links
- **Site-wide search** across vehicles, issues, guides, specs, and suppliers
- **Tools**: Restoration Checklist, Maintenance Tracker, and Build Cost Calculator
- **My Garage**: save vehicles and track restoration progress and service history
- **Community forums** with per-platform categories

## Tech Stack

- [Eleventy](https://www.11ty.dev/) v3 with Nunjucks templates
- Vanilla CSS and JavaScript
- [Supabase](https://supabase.com/) for authentication and the database
- Deployed on [Vercel](https://vercel.com/)

## Development

Requires Node.js 18 or newer.

```bash
npm install
npm run serve        # Dev server with live reload at http://localhost:8080
npm run build:all    # Rebuild the search index and the site into _site/
npm run build:prod   # Production build: search index, site, image optimization, minification
```

Rebuild the search index (`npm run build:search`) whenever vehicle data in `src/_data/vehicles/` changes.

## Database Setup

In the Supabase SQL Editor, run these files in order:

1. `supabase-schema.sql` — profiles and forums
2. `supabase-schema-garage.sql` — My Garage tables
3. `supabase-migration-security.sql` — security hardening (safe to re-run)

## Adding Images to Guide Steps

Guide steps support optional inline images. Images are placed in `src/images/guides/` following this structure:

```
src/images/guides/
├── e30/
│   └── suspension-refresh/
│       └── step-2.jpg
├── 944/
│   └── clutch-replacement/
│       └── step-1.jpg
└── ...
```

To add an image, change a step from a string to an object in the guide's JSON data:

**Before (string):**
```json
"Remove the brake caliper using a 13mm socket."
```

**After (object with image):**
```json
{
  "text": "Remove the brake caliper using a 13mm socket.",
  "image": "/images/guides/e30/brake-pads/step-2.jpg",
  "caption": "Two 13mm bolts on the back of the caliper"
}
```

Fields:
- `text` (required) - The step instruction
- `image` (required) - Path starting with `/images/guides/...`
- `caption` (optional) - Description shown below the image

You can mix string and object formats freely within the same guide. Only convert steps to object format when adding an image.



# To-Do List

## High Priority
- [ ] Add contact form validation.
- [ ] Fix broken links on the shop page.

## Low Priority
- [ ] Add a dark mode toggle.
- [ ] Improve mobile responsiveness.