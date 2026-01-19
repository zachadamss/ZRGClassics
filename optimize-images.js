const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");

async function optimizeHeroImages() {
  const inputDir = "./src/images/vehicles";
  const outputDir = "./_site/images/vehicles";

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all hero images
  const files = fs.readdirSync(inputDir).filter(f => f.endsWith('-hero.jpg'));

  console.log(`Optimizing ${files.length} hero images...`);

  for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const baseName = path.basename(file, '.jpg');

    try {
      let stats = await Image(inputPath, {
        widths: [400, 800, 1200, 1920],
        formats: ["webp", "jpeg"],
        outputDir: outputDir,
        filenameFormat: function (id, src, width, format) {
          return `${baseName}-${width}.${format}`;
        },
        sharpJpegOptions: {
          quality: 80,
          progressive: true
        },
        sharpWebpOptions: {
          quality: 80
        }
      });

      // Also copy original size JPEG for fallback (renamed to standard name)
      const jpeg1920 = stats.jpeg.find(s => s.width === 1920) || stats.jpeg[stats.jpeg.length - 1];
      if (jpeg1920) {
        fs.copyFileSync(jpeg1920.outputPath, path.join(outputDir, file));
      }

      const webpSizes = stats.webp.map(s => `${s.width}w`).join(', ');
      const jpegSizes = stats.jpeg.map(s => `${s.width}w`).join(', ');
      console.log(`  ✓ ${file} → WebP: [${webpSizes}], JPEG: [${jpegSizes}]`);

    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
    }
  }

  console.log("Done!");
}

optimizeHeroImages();
