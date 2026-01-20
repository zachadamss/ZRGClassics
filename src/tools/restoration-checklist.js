/**
 * Restoration Checklist - Vehicle-specific restoration tracking
 * Uses Supabase for persistence, requires authentication
 */

// ============================================
// Vehicle-Specific Checklist Data
// ============================================

const CATEGORIES = {
    engine: { name: 'Engine & Drivetrain', icon: '🔧' },
    cooling: { name: 'Cooling System', icon: '❄️' },
    fuel: { name: 'Fuel System', icon: '⛽' },
    exhaust: { name: 'Exhaust', icon: '💨' },
    suspension: { name: 'Suspension & Steering', icon: '🔩' },
    brakes: { name: 'Brakes', icon: '🛑' },
    electrical: { name: 'Electrical', icon: '⚡' },
    interior: { name: 'Interior', icon: '💺' },
    body: { name: 'Body & Paint', icon: '🎨' },
    glass: { name: 'Glass & Trim', icon: '🪟' },
    seals: { name: 'Weatherstripping & Seals', icon: '🚿' }
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

// ============================================
// State Management
// ============================================

let currentUser = null;
let currentVehicle = null;
let garageVehicles = [];
let checklistItems = {};
let savedItems = {};
let isSaving = false;
let pendingSaves = [];

// ============================================
// Authentication Check
// ============================================

async function checkAuth() {
    try {
        currentUser = await Auth.getUser();
        if (!currentUser) {
            showLoginRequired();
            return false;
        }
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        showLoginRequired();
        return false;
    }
}

function showLoginRequired() {
    const container = document.querySelector('.checklist-container');
    container.innerHTML = `
        <div class="auth-required">
            <div class="auth-icon">🔐</div>
            <h2>Login Required</h2>
            <p>You need to be logged in to use the Restoration Checklist.</p>
            <p>Your progress is saved to your account so you can access it from anywhere.</p>
            <div class="auth-actions">
                <a href="/account/login/?redirect=/tools/restoration-checklist/" class="btn btn-primary">Log In</a>
                <a href="/account/register/?redirect=/tools/restoration-checklist/" class="btn btn-secondary">Create Account</a>
            </div>
        </div>
    `;
}

// ============================================
// Garage Vehicle Loading
// ============================================

async function loadGarageVehicles() {
    try {
        garageVehicles = await Garage.getVehicles();
        populateVehicleSelect();
    } catch (error) {
        console.error('Failed to load garage vehicles:', error);
        garageVehicles = [];
        populateVehicleSelect();
    }
}

function populateVehicleSelect() {
    const select = document.getElementById('vehicle-select');
    if (!select) return;

    // Clear existing options except the placeholder
    select.innerHTML = '<option value="">Select your vehicle...</option>';

    // Add garage vehicles if any
    if (garageVehicles.length > 0) {
        const garageGroup = document.createElement('optgroup');
        garageGroup.label = 'My Garage';

        garageVehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = `garage:${vehicle.id}`;
            const platformInfo = Garage.getPlatformInfo(vehicle.platform);
            const displayName = vehicle.nickname
                ? `${vehicle.nickname} (${platformInfo.name})`
                : `${vehicle.year || ''} ${platformInfo.fullName}`.trim();
            option.textContent = displayName;
            option.dataset.platform = vehicle.platform;
            garageGroup.appendChild(option);
        });

        select.appendChild(garageGroup);
    }

    // Add all platform options
    const bmwGroup = document.createElement('optgroup');
    bmwGroup.label = 'BMW (Select Platform)';
    const bmwPlatforms = ['e28', 'e30', 'e34', 'e36', 'e39', 'e46', 'e90'];
    bmwPlatforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = `platform:${platform}`;
        const info = Garage.PLATFORMS[platform];
        option.textContent = `${info.name} (${info.years})`;
        bmwGroup.appendChild(option);
    });
    select.appendChild(bmwGroup);

    const porscheGroup = document.createElement('optgroup');
    porscheGroup.label = 'Porsche (Select Platform)';
    const porschePlatforms = ['924', '928', '944', '964', '986', '987', '991', '993', '996', '997'];
    porschePlatforms.forEach(platform => {
        const option = document.createElement('option');
        option.value = `platform:${platform}`;
        const info = Garage.PLATFORMS[platform];
        option.textContent = `${info.name} (${info.years})`;
        porscheGroup.appendChild(option);
    });
    select.appendChild(porscheGroup);
}

// ============================================
// Checklist Building
// ============================================

function buildChecklistItems(platform) {
    const items = {};
    const specifics = VEHICLE_SPECIFICS[platform]?.additions || {};

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

        // Add vehicle-specific items
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

// ============================================
// Data Persistence (Supabase)
// ============================================

async function loadSavedProgress() {
    if (!currentVehicle) return;

    try {
        const vehicleId = currentVehicle.type === 'garage' ? currentVehicle.id : null;
        if (!vehicleId) {
            // For platform-only selection, we need a garage vehicle
            // Show message to add vehicle to garage first
            return;
        }

        savedItems = await Garage.getRestorationItems(vehicleId);

        // Merge saved data with checklist items
        for (const [category, items] of Object.entries(checklistItems)) {
            for (const item of items) {
                const saved = savedItems[item.id];
                if (saved) {
                    item.status = saved.status || 'not-started';
                    item.estimate = saved.estimatedCost || item.estimate;
                    item.actual = saved.actualCost || 0;
                    item.notes = saved.notes || '';
                }
            }
        }
    } catch (error) {
        console.error('Failed to load saved progress:', error);
    }
}

async function saveItem(category, itemId, data) {
    if (!currentVehicle || currentVehicle.type !== 'garage') return;

    // Queue the save
    pendingSaves.push({
        vehicleId: currentVehicle.id,
        itemId: itemId,
        data: {
            status: data.status,
            estimatedCost: data.estimate,
            actualCost: data.actual,
            notes: data.notes,
            category: category,
            itemName: data.name
        }
    });

    // Debounce saves
    debouncedSave();
}

const debouncedSave = debounce(async () => {
    if (isSaving || pendingSaves.length === 0) return;

    isSaving = true;
    const savesToProcess = [...pendingSaves];
    pendingSaves = [];

    try {
        // Process all pending saves
        for (const save of savesToProcess) {
            await Garage.updateRestorationItem(save.vehicleId, save.itemId, save.data);
        }
        showSaveIndicator('Saved');
    } catch (error) {
        console.error('Failed to save:', error);
        showSaveIndicator('Save failed');
        // Re-queue failed saves
        pendingSaves = [...savesToProcess, ...pendingSaves];
    } finally {
        isSaving = false;
    }
}, 500);

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showSaveIndicator(message) {
    let indicator = document.getElementById('save-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'save-indicator';
        indicator.className = 'save-indicator';
        document.body.appendChild(indicator);
    }

    indicator.textContent = message;
    indicator.classList.add('visible');

    setTimeout(() => {
        indicator.classList.remove('visible');
    }, 2000);
}

// ============================================
// Rendering Functions
// ============================================

function renderChecklist() {
    const container = document.getElementById('checklist-content');
    if (!container || !checklistItems) return;

    let html = '';

    for (const [categoryKey, categoryInfo] of Object.entries(CATEGORIES)) {
        const items = checklistItems[categoryKey] || [];
        if (items.length === 0) continue;

        const completedCount = items.filter(i => i.status === 'complete').length;
        const categoryProgress = Math.round((completedCount / items.length) * 100);

        html += `
            <div class="checklist-category" data-category="${categoryKey}">
                <div class="category-header" data-toggle="${categoryKey}">
                    <div class="category-title">
                        <span class="category-icon">${categoryInfo.icon}</span>
                        <h3>${categoryInfo.name}</h3>
                        <span class="category-progress">${completedCount}/${items.length}</span>
                    </div>
                    <div class="category-progress-bar">
                        <div class="category-progress-fill" style="width: ${categoryProgress}%"></div>
                    </div>
                    <span class="category-toggle">▼</span>
                </div>
                <div class="category-items" id="items-${categoryKey}">
                    ${items.map(item => renderChecklistItem(item, categoryKey)).join('')}
                    <button type="button" class="add-item-btn" data-category="${categoryKey}">
                        + Add Custom Item
                    </button>
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
    attachItemEventListeners();
    updateSummary();
}

function renderChecklistItem(item, category) {
    const statusClass = `status-${item.status}`;
    const vehicleSpecificBadge = item.vehicleSpecific ? '<span class="vehicle-specific-badge">Vehicle Specific</span>' : '';
    const customBadge = item.custom ? '<span class="custom-badge">Custom</span>' : '';

    return `
        <div class="checklist-item ${statusClass}" data-id="${item.id}" data-category="${category}">
            <div class="item-header">
                <div class="item-status">
                    <select class="status-select" data-id="${item.id}" data-category="${category}">
                        <option value="not-started" ${item.status === 'not-started' ? 'selected' : ''}>Not Started</option>
                        <option value="in-progress" ${item.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                        <option value="complete" ${item.status === 'complete' ? 'selected' : ''}>Complete</option>
                        <option value="skipped" ${item.status === 'skipped' ? 'selected' : ''}>Skipped</option>
                    </select>
                </div>
                <div class="item-name">
                    ${item.name}
                    ${vehicleSpecificBadge}
                    ${customBadge}
                </div>
                <div class="item-toggle" data-id="${item.id}">▼</div>
            </div>
            <div class="item-details" id="details-${item.id}" style="display: none;">
                <div class="item-costs">
                    <div class="cost-field">
                        <label>Estimated</label>
                        <div class="cost-input-wrapper">
                            <span class="currency">$</span>
                            <input type="number" class="estimate-input" data-id="${item.id}" data-category="${category}"
                                   value="${item.estimate}" min="0" step="10">
                        </div>
                    </div>
                    <div class="cost-field">
                        <label>Actual</label>
                        <div class="cost-input-wrapper">
                            <span class="currency">$</span>
                            <input type="number" class="actual-input" data-id="${item.id}" data-category="${category}"
                                   value="${item.actual}" min="0" step="1">
                        </div>
                    </div>
                </div>
                <div class="item-notes">
                    <label>Notes</label>
                    <textarea class="notes-input" data-id="${item.id}" data-category="${category}"
                              placeholder="Add notes, part numbers, links...">${item.notes}</textarea>
                </div>
                ${item.custom ? `<button type="button" class="btn btn-danger delete-item-btn" data-id="${item.id}" data-category="${category}">Delete Item</button>` : ''}
            </div>
        </div>
    `;
}

function updateSummary() {
    if (!checklistItems) return;

    let totalItems = 0;
    let completedItems = 0;
    let estimatedTotal = 0;
    let actualTotal = 0;

    for (const items of Object.values(checklistItems)) {
        for (const item of items) {
            if (item.status !== 'skipped') {
                totalItems++;
                estimatedTotal += item.estimate || 0;
                actualTotal += item.actual || 0;
                if (item.status === 'complete') {
                    completedItems++;
                }
            }
        }
    }

    const progress = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

    const progressEl = document.getElementById('overall-progress');
    const fillEl = document.getElementById('progress-fill');
    const completeEl = document.getElementById('items-complete');
    const totalEl = document.getElementById('items-total');
    const estimatedEl = document.getElementById('estimated-total');
    const actualEl = document.getElementById('actual-total');

    if (progressEl) progressEl.textContent = `${progress}%`;
    if (fillEl) fillEl.style.width = `${progress}%`;
    if (completeEl) completeEl.textContent = completedItems;
    if (totalEl) totalEl.textContent = totalItems;
    if (estimatedEl) estimatedEl.textContent = estimatedTotal.toLocaleString();
    if (actualEl) actualEl.textContent = actualTotal.toLocaleString();
}

// ============================================
// Event Handlers
// ============================================

function attachItemEventListeners() {
    // Category toggles
    document.querySelectorAll('.category-header').forEach(header => {
        header.addEventListener('click', () => {
            const category = header.dataset.toggle;
            const items = document.getElementById(`items-${category}`);
            const toggle = header.querySelector('.category-toggle');

            if (items.style.display === 'none') {
                items.style.display = 'block';
                toggle.textContent = '▼';
            } else {
                items.style.display = 'none';
                toggle.textContent = '▶';
            }
        });
    });

    // Item toggles
    document.querySelectorAll('.item-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = toggle.dataset.id;
            const details = document.getElementById(`details-${id}`);

            if (details.style.display === 'none') {
                details.style.display = 'block';
                toggle.textContent = '▲';
            } else {
                details.style.display = 'none';
                toggle.textContent = '▼';
            }
        });
    });

    // Status changes
    document.querySelectorAll('.status-select').forEach(select => {
        select.addEventListener('change', (e) => {
            const { id, category } = e.target.dataset;
            const item = checklistItems[category].find(i => i.id === id);
            if (item) {
                item.status = e.target.value;
                saveItem(category, id, item);

                // Update UI
                const itemEl = document.querySelector(`.checklist-item[data-id="${id}"]`);
                itemEl.className = `checklist-item status-${item.status}`;
                updateSummary();
                updateCategoryProgress(category);
            }
        });
    });

    // Estimate changes
    document.querySelectorAll('.estimate-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const { id, category } = e.target.dataset;
            const item = checklistItems[category].find(i => i.id === id);
            if (item) {
                item.estimate = parseFloat(e.target.value) || 0;
                saveItem(category, id, item);
                updateSummary();
            }
        });
    });

    // Actual cost changes
    document.querySelectorAll('.actual-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const { id, category } = e.target.dataset;
            const item = checklistItems[category].find(i => i.id === id);
            if (item) {
                item.actual = parseFloat(e.target.value) || 0;
                saveItem(category, id, item);
                updateSummary();
            }
        });
    });

    // Notes changes
    document.querySelectorAll('.notes-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const { id, category } = e.target.dataset;
            const item = checklistItems[category].find(i => i.id === id);
            if (item) {
                item.notes = e.target.value;
                saveItem(category, id, item);
            }
        });
    });

    // Add custom item buttons
    document.querySelectorAll('.add-item-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            document.getElementById('custom-item-category').value = category;
            document.getElementById('add-item-modal').style.display = 'flex';
        });
    });

    // Delete item buttons
    document.querySelectorAll('.delete-item-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const { id, category } = btn.dataset;
            if (confirm('Are you sure you want to delete this item?')) {
                checklistItems[category] = checklistItems[category].filter(i => i.id !== id);
                // Note: Custom items deletion from DB would need additional handling
                renderChecklist();
            }
        });
    });
}

function updateCategoryProgress(category) {
    const items = checklistItems[category] || [];
    const completedCount = items.filter(i => i.status === 'complete').length;
    const categoryProgress = Math.round((completedCount / items.length) * 100);

    const categoryEl = document.querySelector(`.checklist-category[data-category="${category}"]`);
    if (categoryEl) {
        categoryEl.querySelector('.category-progress').textContent = `${completedCount}/${items.length}`;
        categoryEl.querySelector('.category-progress-fill').style.width = `${categoryProgress}%`;
    }
}

function applyFilter(filter) {
    const items = document.querySelectorAll('.checklist-item');

    items.forEach(item => {
        if (filter === 'all') {
            item.style.display = 'block';
        } else {
            const status = item.classList.contains(`status-${filter}`);
            item.style.display = status ? 'block' : 'none';
        }
    });
}

// ============================================
// Export Functions
// ============================================

function exportToJSON() {
    if (!checklistItems) return;

    const data = {
        vehicle: currentVehicle,
        exportDate: new Date().toISOString(),
        items: checklistItems
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `restoration_checklist_${currentVehicle?.platform || 'export'}.json`;
    a.click();

    URL.revokeObjectURL(url);
}

function exportToCSV() {
    if (!checklistItems) return;

    let csv = 'Category,Item,Status,Estimated,Actual,Notes\n';

    for (const [category, items] of Object.entries(checklistItems)) {
        const categoryName = CATEGORIES[category]?.name || category;
        for (const item of items) {
            const row = [
                `"${categoryName}"`,
                `"${item.name}"`,
                `"${item.status}"`,
                item.estimate,
                item.actual,
                `"${(item.notes || '').replace(/"/g, '""')}"`
            ];
            csv += row.join(',') + '\n';
        }
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `restoration_checklist_${currentVehicle?.platform || 'export'}.csv`;
    a.click();

    URL.revokeObjectURL(url);
}

function printChecklist() {
    window.print();
}

// ============================================
// Project Management
// ============================================

async function startProject(vehicleValue) {
    const [type, id] = vehicleValue.split(':');

    if (type === 'garage') {
        // Load from garage vehicle (use string comparison to handle UUID/int mismatch)
        const vehicle = garageVehicles.find(v => String(v.id) === String(id));
        if (!vehicle) {
            console.error('Vehicle not found. Looking for ID:', id, 'Available vehicles:', garageVehicles.map(v => ({ id: v.id, type: typeof v.id })));
            alert('Vehicle not found in your garage.');
            return;
        }

        currentVehicle = {
            type: 'garage',
            id: vehicle.id,
            platform: vehicle.platform,
            name: vehicle.nickname || `${vehicle.year || ''} ${Garage.getPlatformInfo(vehicle.platform).fullName}`.trim()
        };
    } else {
        // Platform-only selection - prompt to add to garage
        const platformInfo = Garage.getPlatformInfo(id);

        if (garageVehicles.length === 0) {
            const addToGarage = confirm(
                `To save your restoration progress, you need to add this vehicle to your garage.\n\n` +
                `Would you like to add a ${platformInfo.fullName} to your garage now?`
            );

            if (addToGarage) {
                try {
                    const newVehicle = await Garage.addVehicle({
                        platform: id,
                        nickname: `My ${platformInfo.name} Restoration`
                    });

                    currentVehicle = {
                        type: 'garage',
                        id: newVehicle.id,
                        platform: id,
                        name: newVehicle.nickname
                    };

                    garageVehicles.push(newVehicle);
                } catch (error) {
                    console.error('Failed to add vehicle:', error);
                    alert('Failed to add vehicle to garage. Please try again.');
                    return;
                }
            } else {
                return;
            }
        } else {
            // Has garage vehicles but selected platform - warn them
            alert('Please select a vehicle from your garage, or add this vehicle to your garage first.');
            return;
        }
    }

    // Build checklist for the platform
    checklistItems = buildChecklistItems(currentVehicle.platform);

    // Load any saved progress
    await loadSavedProgress();

    // Show the project UI
    showProjectUI();
}

function showProjectUI() {
    document.getElementById('project-setup').style.display = 'none';
    document.getElementById('progress-summary').style.display = 'block';
    document.getElementById('checklist-categories').style.display = 'block';

    // Update header with vehicle name
    const header = document.querySelector('.checklist-header h1');
    if (header && currentVehicle) {
        header.textContent = `${currentVehicle.name} Restoration`;
    }

    renderChecklist();
}

async function resetProject() {
    if (!currentVehicle || currentVehicle.type !== 'garage') return;

    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        try {
            await Garage.clearRestoration(currentVehicle.id);
            checklistItems = buildChecklistItems(currentVehicle.platform);
            renderChecklist();
            showSaveIndicator('Progress reset');
        } catch (error) {
            console.error('Failed to reset:', error);
            alert('Failed to reset progress. Please try again.');
        }
    }
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication first
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    // Load garage vehicles
    await loadGarageVehicles();

    const vehicleSelect = document.getElementById('vehicle-select');
    const startBtn = document.getElementById('start-project-btn');

    // Enable start button when vehicle is selected
    vehicleSelect.addEventListener('change', () => {
        startBtn.disabled = !vehicleSelect.value;
    });

    // Start project
    startBtn.addEventListener('click', () => {
        if (vehicleSelect.value) {
            startProject(vehicleSelect.value);
        }
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
        });
    });

    // Export button
    document.getElementById('export-btn')?.addEventListener('click', () => {
        document.getElementById('export-modal').style.display = 'flex';
    });

    // Export modal buttons
    document.getElementById('export-json')?.addEventListener('click', () => {
        exportToJSON();
        document.getElementById('export-modal').style.display = 'none';
    });

    document.getElementById('export-csv')?.addEventListener('click', () => {
        exportToCSV();
        document.getElementById('export-modal').style.display = 'none';
    });

    document.getElementById('close-export-modal')?.addEventListener('click', () => {
        document.getElementById('export-modal').style.display = 'none';
    });

    // Print button
    document.getElementById('print-btn')?.addEventListener('click', printChecklist);

    // Reset button
    document.getElementById('reset-btn')?.addEventListener('click', resetProject);

    // Add custom item modal
    document.getElementById('close-modal')?.addEventListener('click', () => {
        document.getElementById('add-item-modal').style.display = 'none';
    });

    document.getElementById('cancel-custom-item')?.addEventListener('click', () => {
        document.getElementById('add-item-modal').style.display = 'none';
    });

    document.getElementById('save-custom-item')?.addEventListener('click', async () => {
        const name = document.getElementById('custom-item-name').value.trim();
        const category = document.getElementById('custom-item-category').value;
        const estimate = parseFloat(document.getElementById('custom-item-estimate').value) || 0;

        if (!name) {
            alert('Please enter an item name.');
            return;
        }

        const newItem = {
            id: `${category}-custom-${Date.now()}`,
            name: name,
            estimate: estimate,
            actual: 0,
            status: 'not-started',
            notes: '',
            custom: true
        };

        checklistItems[category].push(newItem);

        // Save to database
        await saveItem(category, newItem.id, newItem);

        // Reset form and close modal
        document.getElementById('custom-item-name').value = '';
        document.getElementById('custom-item-estimate').value = '';
        document.getElementById('add-item-modal').style.display = 'none';

        renderChecklist();
    });

    // Close modals on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });

    // Check URL params for vehicle pre-selection
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('vehicle');
    if (vehicleId) {
        // Try to find and select this vehicle
        const selectValue = `garage:${vehicleId}`;
        if (vehicleSelect.querySelector(`option[value="${selectValue}"]`)) {
            vehicleSelect.value = selectValue;
            startBtn.disabled = false;
            // Auto-start if coming from garage
            startProject(selectValue);
        }
    }
});
