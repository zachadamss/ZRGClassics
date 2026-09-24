const path = require("path");
const { default: Image } = require("@11ty/eleventy-img");

// Responsive <picture> for photos: WebP + JPEG at up to four widths. Widths
// larger than the source are skipped, so small placeholder photos still work
// and full-size replacements get every size automatically.
async function pictureShortcode(src, alt, sizes = "100vw", attrs = {}) {
  if (!src) return "";
  const metadata = await Image(path.join("src", src), {
    widths: [400, 800, 1200, 1920],
    formats: ["webp", "jpeg"],
    outputDir: "_site/images/responsive/",
    urlPath: "/images/responsive/",
    filenameFormat: (id, source, width, format) =>
      `${path.basename(source, path.extname(source))}-${width}.${format}`,
    sharpJpegOptions: { quality: 80, progressive: true },
    sharpWebpOptions: { quality: 78 }
  });
  return Image.generateHTML(metadata, {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async",
    ...attrs
  });
}

module.exports = function(eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("src/images");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/styles.css");
  eleventyConfig.addPassthroughCopy("src/script.js");
  eleventyConfig.addPassthroughCopy("src/search.js");
  eleventyConfig.addPassthroughCopy("src/search-index.json");
  eleventyConfig.addPassthroughCopy("src/tools/build-calculator.js");
  eleventyConfig.addPassthroughCopy("src/js");

  eleventyConfig.addAsyncShortcode("picture", pictureShortcode);

  // "1982-1994" -> "1982–1994", "$8,000 - $18,000" -> "$8,000–$18,000"
  eleventyConfig.addFilter("range", value =>
    String(value || "").replace(/(\d[k+]?)\s*-\s*(\$?\d)/g, "$1–$2")
  );

  // Prices: range dashes plus thousands separators. "$1500-3000" -> "$1,500–3,000"
  eleventyConfig.addFilter("money", value =>
    String(value || "")
      .replace(/(\d[k+]?)\s*-\s*(\$?\d)/g, "$1–$2")
      .replace(/\d{4,}/g, n => Number(n).toLocaleString("en-US"))
  );

  // OEM part numbers written the way the parts counter does:
  // BMW "11311711081" -> "11 31 1 711 081", Porsche "96410519501" -> "964.105.195.01"
  eleventyConfig.addFilter("partNumber", (value, brand) => {
    const n = String(value || "");
    if (!/^\d{11}$/.test(n)) return n;
    if (brand === "bmw") return `${n.slice(0, 2)} ${n.slice(2, 4)} ${n.slice(4, 5)} ${n.slice(5, 8)} ${n.slice(8)}`;
    if (brand === "porsche") return `${n.slice(0, 3)}.${n.slice(3, 6)}.${n.slice(6, 9)}.${n.slice(9)}`;
    return n;
  });

  // "2026-09-24" -> "September 2026"
  eleventyConfig.addFilter("readableDate", value => {
    const d = new Date(`${value}T12:00:00Z`);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  });

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("src/styles.css");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
