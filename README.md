# ZRG Classics

A local website for selling classic cars and parts.

## Features
- Homepage
- Shop page
- About page

## Installation
1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to build the site.
4. Run `npm start` to serve locally.

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