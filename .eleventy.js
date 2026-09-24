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
