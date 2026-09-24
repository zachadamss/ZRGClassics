// Flat list of { key, brand } for paginated per-vehicle pages (buyer's guides).
const vehicleList = require('./vehicleList.json');

module.exports = Object.entries(vehicleList).flatMap(([brand, keys]) =>
  keys.map(key => ({ key, brand }))
);
