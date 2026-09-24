// Per-page data for the paginated buyer's guides (buying.njk). Kept in JS
// because Nunjucks strings inside computed arrays don't re-evaluate per page.
module.exports = {
  eleventyComputed: {
    vehicle: data => data.item.key,
    title: data => `${data.vehicles[data.item.key].fullName} Buyer's Guide`,
    description: data => {
      const v = data.vehicles[data.item.key];
      return `Buying a ${v.fullName}? Which versions to look for, a pre-purchase inspection checklist, red flags, and current prices.`;
    },
    breadcrumbs: data => {
      const { key, brand } = data.item;
      const v = data.vehicles[key];
      return [
        { label: 'Home', url: '/' },
        { label: v.brand, url: `/resources/${brand}/` },
        { label: v.model, url: `/resources/${brand}/${key}/` },
        { label: "Buyer's Guide" }
      ];
    }
  }
};
