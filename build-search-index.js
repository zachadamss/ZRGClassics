const fs = require('fs');
const path = require('path');

const vehiclesDir = path.join(__dirname, 'src', '_data', 'vehicles');
const outputFile = path.join(__dirname, 'src', 'search-index.json');

const searchIndex = {
  issues: [],
  torqueSpecs: [],
  guides: [],
  suppliers: []
};

// Read all vehicle JSON files
const vehicleFiles = fs.readdirSync(vehiclesDir).filter(f => f.endsWith('.json'));

vehicleFiles.forEach(file => {
  const vehicleData = JSON.parse(fs.readFileSync(path.join(vehiclesDir, file), 'utf8'));
  const model = vehicleData.model;
  const brand = vehicleData.brand;
  const modelName = vehicleData.fullName.replace(`${brand} `, '');
  const years = vehicleData.years;
  const url = `/resources/${brand.toLowerCase()}/${model.toLowerCase()}/`;

  // Add issues
  if (vehicleData.issues) {
    vehicleData.issues.forEach(issue => {
      searchIndex.issues.push({
        id: `${model.toLowerCase()}-${issue.id}`,
        brand,
        model,
        modelName,
        years,
        title: issue.title,
        symptoms: issue.symptoms,
        description: issue.description,
        keywords: extractKeywords(issue),
        url
      });
    });
  }

  // Add torque specs
  if (vehicleData.torqueSpecs) {
    Object.entries(vehicleData.torqueSpecs).forEach(([category, specs]) => {
      specs.forEach(spec => {
        searchIndex.torqueSpecs.push({
          id: `${model.toLowerCase()}-${category}-${spec.component.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          brand,
          model,
          modelName,
          years,
          category,
          component: spec.component,
          spec: spec.spec,
          notes: spec.notes || '',
          keywords: `${spec.component} ${category} torque spec ft-lbs ${spec.notes || ''}`.toLowerCase(),
          url
        });
      });
    });
  }

  // Add guides (restoration + diy)
  const allGuides = [...(vehicleData.guides || []), ...(vehicleData.diyGuides || [])];
  allGuides.forEach(guide => {
    const type = vehicleData.guides?.includes(guide) ? 'restoration' : 'diy';
    searchIndex.guides.push({
      id: `${model.toLowerCase()}-${guide.id}`,
      brand,
      model,
      modelName,
      years,
      title: guide.title,
      description: guide.description,
      difficulty: guide.difficulty,
      time: guide.time,
      type,
      keywords: `${guide.title} ${guide.description} ${guide.difficulty} ${type}`.toLowerCase(),
      url
    });
  });

  // Add suppliers
  if (vehicleData.suppliers) {
    Object.entries(vehicleData.suppliers).forEach(([category, suppliers]) => {
      suppliers.forEach(supplier => {
        searchIndex.suppliers.push({
          id: `${model.toLowerCase()}-${category}-${supplier.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          brand,
          model,
          modelName,
          years,
          name: supplier.name,
          category,
          notes: supplier.notes || '',
          keywords: `${supplier.name} ${category} ${supplier.notes || ''} parts supplier`.toLowerCase(),
          url
        });
      });
    });
  }
});

function extractKeywords(issue) {
  const text = `${issue.title} ${issue.symptoms} ${issue.description}`;
  return text.toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2)
    .filter((word, index, arr) => arr.indexOf(word) === index)
    .slice(0, 20)
    .join(' ');
}

// Write output
fs.writeFileSync(outputFile, JSON.stringify(searchIndex, null, 2));

console.log(`Search index built successfully!`);
console.log(`- ${searchIndex.issues.length} issues`);
console.log(`- ${searchIndex.torqueSpecs.length} torque specs`);
console.log(`- ${searchIndex.guides.length} guides`);
console.log(`- ${searchIndex.suppliers.length} suppliers`);
