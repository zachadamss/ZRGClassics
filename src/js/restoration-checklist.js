/**
 * Restoration checklist data, shared by the restoration tracker and My Garage
 * so both count progress the same way. Exposes window.RestorationChecklist.
 */
(function () {
'use strict';

const CATEGORIES = {
    engine: { name: 'Engine & Drivetrain' },
    cooling: { name: 'Cooling System' },
    fuel: { name: 'Fuel System' },
    exhaust: { name: 'Exhaust' },
    suspension: { name: 'Suspension & Steering' },
    brakes: { name: 'Brakes' },
    electrical: { name: 'Electrical' },
    interior: { name: 'Interior' },
    body: { name: 'Body & Paint' },
    glass: { name: 'Glass & Trim' },
    seals: { name: 'Weatherstripping & Seals' }
};

// Base checklist items common to most vehicles
const BASE_ITEMS = {
    engine: [
        { name: 'Oil change and filter', estimate: 50 },
        { name: 'Valve cover gasket', estimate: 80 },
        { name: 'Spark plugs and wires', estimate: 100 },
        { name: 'Air filter', estimate: 30 },
        { name: 'Timing belt/chain service', estimate: 400 },
        { name: 'Motor mounts', estimate: 200 },
        { name: 'Transmission mount', estimate: 100 },
        { name: 'Clutch kit (if manual)', estimate: 500 },
        { name: 'Flywheel resurface/replace', estimate: 300 }
    ],
    cooling: [
        { name: 'Radiator flush and fill', estimate: 50 },
        { name: 'Radiator replacement', estimate: 250 },
        { name: 'Water pump', estimate: 150 },
        { name: 'Thermostat', estimate: 40 },
        { name: 'Coolant hoses (all)', estimate: 150 },
        { name: 'Expansion tank', estimate: 80 },
        { name: 'Radiator cap', estimate: 20 }
    ],
    fuel: [
        { name: 'Fuel filter', estimate: 40 },
        { name: 'Fuel pump', estimate: 200 },
        { name: 'Fuel injectors clean/replace', estimate: 300 },
        { name: 'Fuel lines inspection', estimate: 100 },
        { name: 'Fuel tank cleaning', estimate: 150 }
    ],
    exhaust: [
        { name: 'Exhaust manifold gasket', estimate: 80 },
        { name: 'Catalytic converter', estimate: 400 },
        { name: 'Muffler', estimate: 200 },
        { name: 'Exhaust hangers', estimate: 50 },
        { name: 'O2 sensors', estimate: 150 }
    ],
    suspension: [
        { name: 'Front struts/shocks', estimate: 300 },
        { name: 'Rear shocks', estimate: 200 },
        { name: 'Front control arm bushings', estimate: 150 },
        { name: 'Rear trailing arm bushings', estimate: 150 },
        { name: 'Sway bar end links', estimate: 80 },
        { name: 'Sway bar bushings', estimate: 40 },
        { name: 'Tie rod ends', estimate: 100 },
        { name: 'Ball joints', estimate: 150 },
        { name: 'Wheel bearings', estimate: 200 },
        { name: 'Alignment', estimate: 100 }
    ],
    brakes: [
        { name: 'Front brake pads', estimate: 80 },
        { name: 'Rear brake pads', estimate: 70 },
        { name: 'Front rotors', estimate: 150 },
        { name: 'Rear rotors', estimate: 120 },
        { name: 'Brake fluid flush', estimate: 50 },
        { name: 'Brake lines (stainless)', estimate: 150 },
        { name: 'Brake master cylinder', estimate: 200 },
        { name: 'Parking brake adjustment', estimate: 30 }
    ],
    electrical: [
        { name: 'Battery', estimate: 150 },
        { name: 'Alternator', estimate: 250 },
        { name: 'Starter motor', estimate: 200 },
        { name: 'Headlight restoration/bulbs', estimate: 100 },
        { name: 'Tail light bulbs/lenses', estimate: 80 },
        { name: 'Instrument cluster service', estimate: 200 },
        { name: 'Window switches', estimate: 100 },
        { name: 'Ignition switch', estimate: 80 }
    ],
    interior: [
        { name: 'Carpet cleaning/replacement', estimate: 300 },
        { name: 'Seat reupholster/repair', estimate: 500 },
        { name: 'Door panel restoration', estimate: 200 },
        { name: 'Headliner', estimate: 300 },
        { name: 'Steering wheel restoration', estimate: 150 },
        { name: 'Shift knob/boot', estimate: 80 },
        { name: 'Dashboard repair/cap', estimate: 250 },
        { name: 'HVAC controls', estimate: 100 }
    ],
    body: [
        { name: 'Rust repair - floors', estimate: 800 },
        { name: 'Rust repair - wheel arches', estimate: 600 },
        { name: 'Rust repair - rockers', estimate: 700 },
        { name: 'Dent repair', estimate: 300 },
        { name: 'Paint correction/polish', estimate: 400 },
        { name: 'Full respray', estimate: 5000 },
        { name: 'Bumper refinish', estimate: 400 },
        { name: 'Hood/trunk alignment', estimate: 100 }
    ],
    glass: [
        { name: 'Windshield', estimate: 350 },
        { name: 'Rear window', estimate: 250 },
        { name: 'Side windows', estimate: 150 },
        { name: 'Mirror glass', estimate: 80 },
        { name: 'Trim - window', estimate: 200 },
        { name: 'Trim - body side', estimate: 150 },
        { name: 'Emblems/badges', estimate: 100 }
    ],
    seals: [
        { name: 'Door seals', estimate: 200 },
        { name: 'Trunk seal', estimate: 80 },
        { name: 'Windshield seal', estimate: 100 },
        { name: 'Sunroof seal', estimate: 120 },
        { name: 'Window scrapers', estimate: 100 },
        { name: 'Vent window seals', estimate: 80 }
    ]
};

// Vehicle-specific additions/modifications
const VEHICLE_SPECIFICS = {
    e30: {
        name: 'BMW E30 3-Series',
        additions: {
            engine: [
                { name: 'Inspect/replace guibo', estimate: 100 },
                { name: 'Driveshaft center support bearing', estimate: 80 },
                { name: 'Throttle body cleaning', estimate: 50 }
            ],
            cooling: [
                { name: 'Aux fan and relay', estimate: 120 }
            ],
            suspension: [
                { name: 'Front subframe bushings', estimate: 150 },
                { name: 'Rear subframe bushings', estimate: 200 }
            ],
            electrical: [
                { name: 'Check control module', estimate: 150 },
                { name: 'OBC repair/upgrade', estimate: 100 }
            ],
            interior: [
                { name: 'Door card pocket repair', estimate: 50 },
                { name: 'Center console lid', estimate: 60 }
            ],
            body: [
                { name: 'Front valance', estimate: 200 },
                { name: 'Rear bumper fillers', estimate: 100 }
            ]
        }
    },
    e36: {
        name: 'BMW E36 3-Series',
        additions: {
            engine: [
                { name: 'VANOS seals (if applicable)', estimate: 150 },
                { name: 'Oil filter housing gasket', estimate: 80 }
            ],
            cooling: [
                { name: 'Clutch fan/electric fan conversion', estimate: 250 }
            ],
            suspension: [
                { name: 'RTAB reinforcement plates', estimate: 100 },
                { name: 'Front strut tower reinforcement', estimate: 150 }
            ]
        }
    },
    e46: {
        name: 'BMW E46 3-Series',
        additions: {
            engine: [
                { name: 'VANOS solenoids', estimate: 200 },
                { name: 'Oil filter housing gasket', estimate: 100 },
                { name: 'CCV system', estimate: 150 }
            ],
            cooling: [
                { name: 'Electric water pump upgrade', estimate: 300 }
            ],
            suspension: [
                { name: 'Front control arms (full set)', estimate: 350 },
                { name: 'Rear subframe reinforcement', estimate: 400 }
            ]
        }
    },
    e28: {
        name: 'BMW E28 5-Series',
        additions: {
            engine: [
                { name: 'Inspect/replace guibo', estimate: 100 }
            ],
            electrical: [
                { name: 'Service interval lights reset', estimate: 20 },
                { name: 'Check control repair', estimate: 150 }
            ]
        }
    },
    e34: {
        name: 'BMW E34 5-Series',
        additions: {
            engine: [
                { name: 'Oil filter housing gasket', estimate: 80 },
                { name: 'Valley pan gasket (V8)', estimate: 200 }
            ],
            suspension: [
                { name: 'Thrust arm bushings', estimate: 100 }
            ]
        }
    },
    e39: {
        name: 'BMW E39 5-Series',
        additions: {
            engine: [
                { name: 'VANOS seals', estimate: 200 },
                { name: 'Valley pan gasket (V8)', estimate: 250 }
            ],
            cooling: [
                { name: 'Expansion tank (common failure)', estimate: 80 }
            ],
            suspension: [
                { name: 'Front thrust arm bushings', estimate: 150 }
            ]
        }
    },
    e90: {
        name: 'BMW E90 3-Series',
        additions: {
            engine: [
                { name: 'Oil filter housing gasket', estimate: 150 },
                { name: 'Valve cover gasket', estimate: 200 },
                { name: 'OFHG and VANOS', estimate: 400 }
            ],
            electrical: [
                { name: 'Footwell module', estimate: 300 }
            ]
        }
    },
    944: {
        name: 'Porsche 944',
        additions: {
            engine: [
                { name: 'Balance shaft belt', estimate: 250 },
                { name: 'Timing belt tensioner/rollers', estimate: 200 },
                { name: 'Water pump (timing belt service)', estimate: 150 }
            ],
            cooling: [
                { name: 'Heater core (dash-out job)', estimate: 400 }
            ],
            clutch: [
                { name: 'Clutch master cylinder', estimate: 150 },
                { name: 'Clutch slave cylinder', estimate: 120 }
            ],
            electrical: [
                { name: 'DME relay', estimate: 40 },
                { name: 'Fuel pump relay', estimate: 30 }
            ]
        }
    },
    924: {
        name: 'Porsche 924',
        additions: {
            engine: [
                { name: 'Timing belt service', estimate: 300 }
            ],
            electrical: [
                { name: 'Relay board refurbishment', estimate: 100 }
            ]
        }
    },
    928: {
        name: 'Porsche 928',
        additions: {
            engine: [
                { name: 'Timing belt service', estimate: 800 },
                { name: 'Water pump (timing service)', estimate: 200 }
            ],
            electrical: [
                { name: 'Instrument cluster repair', estimate: 400 }
            ],
            suspension: [
                { name: 'Weissach rear axle service', estimate: 500 }
            ]
        }
    },
    964: {
        name: 'Porsche 964 911',
        additions: {
            engine: [
                { name: 'Air-oil separator', estimate: 150 },
                { name: 'Cylinder head reseal', estimate: 2000 }
            ],
            suspension: [
                { name: 'Coilover conversion', estimate: 2000 }
            ]
        }
    },
    993: {
        name: 'Porsche 993 911',
        additions: {
            engine: [
                { name: 'Air-oil separator', estimate: 150 }
            ],
            suspension: [
                { name: 'Coilover conversion', estimate: 2000 }
            ]
        }
    },
    996: {
        name: 'Porsche 996 911',
        additions: {
            engine: [
                { name: 'IMS bearing upgrade', estimate: 2500 },
                { name: 'RMS seal', estimate: 800 },
                { name: 'AOS replacement', estimate: 400 }
            ],
            cooling: [
                { name: 'Coolant pipes', estimate: 200 }
            ]
        }
    },
    997: {
        name: 'Porsche 997 911',
        additions: {
            engine: [
                { name: 'IMS bearing (early cars)', estimate: 2500 },
                { name: 'Bore scoring inspection', estimate: 300 }
            ]
        }
    },
    986: {
        name: 'Porsche 986 Boxster',
        additions: {
            engine: [
                { name: 'IMS bearing upgrade', estimate: 2500 },
                { name: 'RMS seal', estimate: 800 },
                { name: 'AOS replacement', estimate: 400 }
            ]
        }
    },
    987: {
        name: 'Porsche 987 Boxster/Cayman',
        additions: {
            engine: [
                { name: 'IMS bearing (early cars)', estimate: 2500 }
            ]
        }
    },
    991: {
        name: 'Porsche 991 911',
        additions: {
            engine: [
                { name: 'Spark plugs (access difficulty)', estimate: 300 }
            ]
        }
    }
};

function buildChecklistItems(platform) {
    const items = {};
    // For custom vehicles (null platform), use empty specifics (base items only)
    const specifics = platform ? (VEHICLE_SPECIFICS[platform]?.additions || {}) : {};

    // Start with base items for each category
    for (const [category, baseItems] of Object.entries(BASE_ITEMS)) {
        items[category] = baseItems.map((item, index) => ({
            id: `${category}-${index}`,
            name: item.name,
            estimate: item.estimate,
            actual: 0,
            status: 'not-started',
            notes: '',
            custom: false
        }));

        // Add vehicle-specific items (only for platform vehicles)
        if (specifics[category]) {
            const startIndex = items[category].length;
            specifics[category].forEach((item, index) => {
                items[category].push({
                    id: `${category}-${startIndex + index}`,
                    name: item.name,
                    estimate: item.estimate,
                    actual: 0,
                    status: 'not-started',
                    notes: '',
                    custom: false,
                    vehicleSpecific: true
                });
            });
        }
    }

    return items;
}

// Rebuild the full checklist for a car and merge what the owner has saved.
// Saved items the base list doesn't know about are the owner's custom items.
function withSaved(platform, saved) {
    const items = buildChecklistItems(platform);
    const known = new Set();
    for (const list of Object.values(items)) {
        for (const item of list) {
            known.add(item.id);
            const s = saved && saved[item.id];
            if (s) {
                item.status = s.status || 'not-started';
                item.estimate = s.estimatedCost || item.estimate;
                item.actual = s.actualCost || 0;
                item.notes = s.notes || '';
            }
        }
    }
    for (const [id, s] of Object.entries(saved || {})) {
        if (known.has(id) || !s.itemName) continue;
        const category = s.category && items[s.category] ? s.category : null;
        if (!category) continue;
        items[category].push({
            id,
            name: s.itemName,
            estimate: s.estimatedCost || 0,
            actual: s.actualCost || 0,
            status: s.status || 'not-started',
            notes: s.notes || '',
            custom: true
        });
    }
    return items;
}

// Progress the way the tracker shows it: skipped items don't count.
function summarize(items) {
    const summary = { total: 0, completed: 0, inProgress: 0, remaining: 0, estimated: 0, actual: 0, percent: 0, byCategory: {} };
    for (const [category, list] of Object.entries(items)) {
        const cat = { name: CATEGORIES[category]?.name || category, total: 0, completed: 0 };
        for (const item of list) {
            if (item.status === 'skipped') continue;
            summary.total++; cat.total++;
            summary.estimated += item.estimate || 0;
            summary.actual += item.actual || 0;
            if (item.status === 'complete') { summary.completed++; cat.completed++; }
            else if (item.status === 'in-progress') summary.inProgress++;
            else summary.remaining++;
        }
        summary.byCategory[category] = cat;
    }
    summary.percent = summary.total ? Math.round((summary.completed / summary.total) * 100) : 0;
    return summary;
}

window.RestorationChecklist = { CATEGORIES, buildChecklistItems, withSaved, summarize };
})();
