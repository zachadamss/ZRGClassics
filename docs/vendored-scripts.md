# Vendored scripts (`src/js/vendor/`)

- `supabase-js-2.117.1.js` — the UMD build of [@supabase/supabase-js](https://github.com/supabase/supabase-js) 2.117.1 (`dist/umd/supabase.js` from the npm package), MIT License. Served from this site instead of unpkg so a CDN outage or compromise can't affect sign-in, and so the Content-Security-Policy can allow scripts from this site only.

To upgrade: `npm pack @supabase/supabase-js@<version>`, copy `package/dist/umd/supabase.js` here under the new version's filename, update the `<script>` tag in `src/_includes/layouts/base.njk`, and delete the old file.
