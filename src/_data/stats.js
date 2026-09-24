const fs = require('fs');
const path = require('path');

// Content counts for the homepage and brand pages, computed from the vehicle
// data files so they never go stale.
module.exports = function() {
  const vehicleDir = path.join(__dirname, 'vehicles');
  const files = fs.readdirSync(vehicleDir).filter(f => f.endsWith('.json'));

  const empty = () => ({
    vehicles: 0,
    issues: 0,
    restorationGuides: 0,
    diyGuides: 0,
    guides: 0,
    torqueSpecs: 0,
    suppliers: 0
  });
  const totals = empty();
  const byBrand = { bmw: empty(), porsche: empty() };

  // Suppliers can appear under several vehicles; count each name once.
  const supplierNames = { all: new Set(), bmw: new Set(), porsche: new Set() };

  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(vehicleDir, file)));
    const brand = byBrand[(data.brand || '').toLowerCase()];

    const counts = {
      vehicles: 1,
      issues: (data.issues || []).length,
      restorationGuides: (data.guides || []).length,
      diyGuides: (data.diyGuides || []).length,
      torqueSpecs: 0,
      suppliers: 0
    };
    counts.guides = counts.restorationGuides + counts.diyGuides;

    // torqueSpecs holds arrays of specs per category plus metadata keys
    Object.values(data.torqueSpecs || {}).forEach(category => {
      if (Array.isArray(category)) counts.torqueSpecs += category.length;
    });

    Object.values(data.suppliers || {}).forEach(list => {
      if (!Array.isArray(list)) return;
      list.forEach(s => {
        supplierNames.all.add(s.name);
        supplierNames[(data.brand || '').toLowerCase()]?.add(s.name);
      });
    });

    [totals, brand].forEach(target => {
      if (!target) return;
      Object.keys(counts).forEach(key => { target[key] += counts[key]; });
    });
  });

  totals.suppliers = supplierNames.all.size;
  byBrand.bmw.suppliers = supplierNames.bmw.size;
  byBrand.porsche.suppliers = supplierNames.porsche.size;

  return { ...totals, byBrand };
};
