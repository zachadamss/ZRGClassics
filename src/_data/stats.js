const fs = require('fs');
const path = require('path');

module.exports = function() {
  const vehicleDir = path.join(__dirname, 'vehicles');
  const files = fs.readdirSync(vehicleDir).filter(f => f.endsWith('.json'));

  let totalGuides = 0;
  let totalDiyGuides = 0;
  let totalTorqueSpecs = 0;
  let totalSuppliers = 0;

  files.forEach(file => {
    const data = JSON.parse(fs.readFileSync(path.join(vehicleDir, file)));

    // Count restoration guides
    if (data.guides) totalGuides += data.guides.length;

    // Count DIY guides
    if (data.diyGuides) totalDiyGuides += data.diyGuides.length;

    // Count torque specs (skip 'sources' which is metadata)
    if (data.torqueSpecs) {
      Object.entries(data.torqueSpecs).forEach(([key, category]) => {
        if (Array.isArray(category)) totalTorqueSpecs += category.length;
      });
    }

    // Count suppliers
    if (data.suppliers) {
      if (data.suppliers.oem) totalSuppliers += data.suppliers.oem.length;
      if (data.suppliers.aftermarket) totalSuppliers += data.suppliers.aftermarket.length;
      if (data.suppliers.used) totalSuppliers += data.suppliers.used.length;
    }
  });

  return {
    guides: totalGuides + totalDiyGuides,
    restorationGuides: totalGuides,
    diyGuides: totalDiyGuides,
    torqueSpecs: totalTorqueSpecs,
    suppliers: totalSuppliers,
    vehicles: files.length
  };
};
