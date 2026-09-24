const fs = require('fs');
const path = require('path');

// Homepage content pulled from the vehicle data, so the examples on the
// homepage always match what the car pages say.

// The issue shown in full in "Inside a car page"
const FEATURED = ['e30', 'timing-belt'];
// The hero's job ticket
const TICKET = ['944', 'timing-belt'];
// "The big jobs, priced": expensive, well-known failures across both brands
const BIG_JOBS = [
  ['996', 'ims-bearing'],
  ['e46', 'subframe-crack'],
  ['928', 'timing-belt'],
  ['e90', 'rod-bearings'],
  ['964', 'cylinder-head-studs'],
  ['e39', 'timing-chain-guides']
];

// Cost ruler: log scale from $100 to $5,000
const RULER_MIN = 100;
const RULER_MAX = 5000;
const RULER_TICKS = [100, 250, 500, 1000, 2500, 5000];

function loadVehicle(key) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'vehicles', `${key}.json`)));
}

// "$1500-5000+" -> { min: 1500, max: 5000, open: true }
function parseCost(text) {
  const nums = String(text || '').replace(/,/g, '').match(/\d+/g);
  if (!nums) return null;
  const values = nums.map(Number);
  return { min: Math.min(...values), max: Math.max(...values), open: /\+\s*$/.test(text) };
}

function rulerPos(value) {
  const clamped = Math.min(Math.max(value, RULER_MIN), RULER_MAX);
  return +(Math.log(clamped / RULER_MIN) / Math.log(RULER_MAX / RULER_MIN) * 100).toFixed(2);
}

function money(n) {
  return n >= 1000 ? `$${n / 1000}k` : `$${n}`;
}

function carSummary(key, data) {
  const brand = data.brand.toLowerCase();
  return {
    key,
    brand,
    brandName: data.brand,
    model: data.model,
    series: data.series,
    years: data.years,
    issues: (data.issues || []).length,
    guides: (data.guides || []).length + (data.diyGuides || []).length,
    url: `/resources/${brand}/${key}/`
  };
}

function issueSummary([key, issueId]) {
  const data = loadVehicle(key);
  const issue = (data.issues || []).find(i => i.id === issueId);
  if (!issue) throw new Error(`home.js: ${key} has no issue "${issueId}"`);
  const car = carSummary(key, data);
  const diy = parseCost(issue.repairCosts && issue.repairCosts.diy);
  const shop = parseCost(issue.repairCosts && issue.repairCosts.shop);
  const bar = range => range && {
    left: rulerPos(range.min),
    width: Math.max(rulerPos(range.max) - rulerPos(range.min), 1.5)
  };
  return {
    car,
    issue,
    url: `${car.url}#${issue.id}`,
    diyBar: bar(diy),
    shopBar: bar(shop)
  };
}

module.exports = function() {
  const vehicleList = JSON.parse(fs.readFileSync(path.join(__dirname, 'vehicleList.json')));
  const cars = {};
  Object.keys(vehicleList).forEach(brand => {
    cars[brand] = vehicleList[brand].map(key => carSummary(key, loadVehicle(key)));
  });

  return {
    cars,
    featured: issueSummary(FEATURED),
    ticket: issueSummary(TICKET),
    bigJobs: BIG_JOBS.map(issueSummary),
    ruler: RULER_TICKS.map(value => ({ label: money(value), pos: rulerPos(value) }))
  };
};
