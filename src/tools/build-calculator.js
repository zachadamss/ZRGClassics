// Build Cost Calculator - ZRG Classics
(function() {
    'use strict';

    // Categories list
    const CATEGORIES = ['engine', 'transmission', 'suspension', 'brakes', 'interior', 'body', 'electrical', 'cooling', 'fuel', 'exhaust', 'wheels'];

    // Vehicle cost estimates - maps data-item IDs to cost arrays [budget, standard, oem, premium]
    // This comprehensive list covers all common restoration items
    const VEHICLE_ESTIMATES = {
        // BMW E28
        e28: {
            'engine-rebuild': [2500, 4000, 6000, 8000],
            'timing-belt-chain': [200, 350, 500, 600],
            'valve-cover-gasket': [30, 50, 80, 100],
            'water-pump': [80, 120, 180, 250],
            'clutch-kit': [300, 500, 700, 900],
            'shocks-struts': [300, 500, 800, 1200],
            'bushings': [150, 300, 500, 700],
            'rotors-front': [80, 120, 180, 250],
            'rotors-rear': [70, 100, 150, 200],
            'pads-front': [40, 60, 100, 150],
            'pads-rear': [35, 55, 90, 130],
            'paint-single-stage': [2000, 4000, 0, 0],
            'paint-show': [0, 0, 7000, 12000],
            'radiator': [150, 250, 400, 600],
            'coolant-hoses': [80, 150, 250, 350]
        },
        // BMW E30
        e30: {
            'engine-rebuild': [2000, 3500, 5500, 7500],
            'timing-belt-chain': [150, 300, 450, 550],
            'valve-cover-gasket': [25, 45, 70, 90],
            'water-pump': [70, 110, 160, 220],
            'clutch-kit': [250, 450, 650, 850],
            'shocks-struts': [250, 450, 700, 1000],
            'bushings': [120, 250, 450, 650],
            'control-arms': [150, 280, 450, 600],
            'rotors-front': [70, 110, 160, 220],
            'rotors-rear': [60, 90, 140, 180],
            'pads-front': [35, 55, 90, 130],
            'pads-rear': [30, 50, 80, 120],
            'paint-single-stage': [2000, 4000, 0, 0],
            'paint-show': [0, 0, 7000, 12000],
            'radiator': [120, 200, 350, 500],
            'coolant-hoses': [60, 120, 200, 300]
        },
        // BMW E34
        e34: {
            'engine-rebuild': [2500, 4000, 6000, 8500],
            'timing-belt-chain': [200, 400, 550, 700],
            'valve-cover-gasket': [35, 55, 85, 110],
            'water-pump': [90, 140, 200, 280],
            'clutch-kit': [300, 500, 750, 950],
            'shocks-struts': [350, 550, 850, 1300],
            'bushings': [180, 350, 550, 750],
            'rotors-front': [90, 130, 200, 280],
            'rotors-rear': [80, 110, 170, 230],
            'pads-front': [45, 65, 110, 160],
            'pads-rear': [40, 60, 100, 140],
            'paint-single-stage': [2500, 4500, 0, 0],
            'paint-show': [0, 0, 8000, 13000],
            'radiator': [180, 280, 450, 650],
            'coolant-hoses': [90, 160, 280, 400]
        },
        // BMW E36
        e36: {
            'engine-rebuild': [2000, 3500, 5500, 8000],
            'timing-belt-chain': [150, 300, 500, 650],
            'valve-cover-gasket': [30, 50, 80, 100],
            'water-pump': [80, 120, 180, 250],
            'clutch-kit': [300, 500, 700, 950],
            'shocks-struts': [280, 480, 750, 1100],
            'bushings': [140, 280, 480, 680],
            'control-arms': [180, 320, 500, 700],
            'rotors-front': [80, 120, 180, 250],
            'rotors-rear': [70, 100, 150, 210],
            'pads-front': [40, 60, 100, 150],
            'pads-rear': [35, 55, 90, 130],
            'paint-single-stage': [2000, 4000, 0, 0],
            'paint-show': [0, 0, 7000, 12000],
            'radiator': [140, 220, 380, 550],
            'coolant-hoses': [70, 130, 220, 320],
            'expansion-tank': [40, 70, 120, 180]
        },
        // BMW E39
        e39: {
            'engine-rebuild': [3000, 5000, 7500, 10000],
            'timing-belt-chain': [300, 500, 700, 900],
            'valve-cover-gasket': [40, 70, 110, 150],
            'water-pump': [100, 160, 240, 340],
            'clutch-kit': [400, 650, 900, 1200],
            'shocks-struts': [400, 650, 1000, 1500],
            'bushings': [200, 400, 650, 900],
            'control-arms': [250, 450, 700, 1000],
            'rotors-front': [100, 150, 230, 320],
            'rotors-rear': [90, 130, 200, 280],
            'pads-front': [50, 80, 130, 190],
            'pads-rear': [45, 70, 115, 165],
            'paint-single-stage': [2500, 5000, 0, 0],
            'paint-show': [0, 0, 8500, 14000],
            'radiator': [200, 320, 520, 750],
            'coolant-hoses': [100, 180, 300, 450],
            'expansion-tank': [50, 90, 150, 220]
        },
        // BMW E46
        e46: {
            'engine-rebuild': [2500, 4500, 6500, 9000],
            'timing-belt-chain': [200, 400, 600, 800],
            'valve-cover-gasket': [35, 60, 95, 130],
            'water-pump': [90, 140, 210, 300],
            'clutch-kit': [350, 600, 850, 1100],
            'shocks-struts': [320, 550, 850, 1250],
            'bushings': [160, 320, 550, 780],
            'control-arms': [200, 380, 600, 850],
            'rotors-front': [90, 135, 200, 280],
            'rotors-rear': [80, 115, 175, 245],
            'pads-front': [45, 70, 115, 170],
            'pads-rear': [40, 62, 100, 145],
            'paint-single-stage': [2000, 4500, 0, 0],
            'paint-show': [0, 0, 7500, 12500],
            'radiator': [160, 260, 420, 620],
            'coolant-hoses': [80, 150, 250, 380],
            'expansion-tank': [45, 80, 130, 200]
        },
        // BMW E90
        e90: {
            'engine-rebuild': [3000, 5000, 7500, 10000],
            'timing-belt-chain': [300, 500, 750, 1000],
            'valve-cover-gasket': [50, 85, 135, 190],
            'oil-pan-gasket': [80, 130, 200, 280],
            'water-pump': [120, 190, 290, 400],
            'clutch-kit': [450, 700, 1000, 1300],
            'shocks-struts': [400, 680, 1050, 1550],
            'bushings': [200, 400, 680, 960],
            'control-arms': [280, 500, 800, 1150],
            'rotors-front': [110, 165, 250, 350],
            'rotors-rear': [100, 145, 220, 310],
            'pads-front': [55, 90, 145, 210],
            'pads-rear': [50, 80, 130, 185],
            'paint-single-stage': [2500, 5000, 0, 0],
            'paint-show': [0, 0, 8500, 14000],
            'radiator': [220, 360, 580, 850],
            'coolant-hoses': [110, 200, 340, 500],
            'expansion-tank': [60, 100, 170, 250]
        },
        // Porsche 924
        '924': {
            'engine-rebuild': [2000, 3500, 5000, 7000],
            'timing-belt-chain': [250, 450, 650, 850],
            'valve-cover-gasket': [30, 50, 80, 110],
            'water-pump': [90, 140, 210, 300],
            'clutch-kit': [350, 550, 800, 1000],
            'shocks-struts': [300, 500, 800, 1200],
            'bushings': [150, 300, 500, 720],
            'rotors-front': [90, 135, 200, 280],
            'rotors-rear': [80, 115, 175, 245],
            'pads-front': [50, 80, 130, 180],
            'pads-rear': [45, 70, 115, 160],
            'paint-single-stage': [2500, 5000, 0, 0],
            'paint-show': [0, 0, 8000, 13000],
            'radiator': [180, 290, 470, 680],
            'coolant-hoses': [90, 160, 270, 400]
        },
        // Porsche 944
        '944': {
            'engine-rebuild': [2500, 4500, 6500, 9000],
            'timing-belt-chain': [400, 700, 1000, 1300],
            'valve-cover-gasket': [40, 65, 105, 145],
            'water-pump': [110, 175, 265, 370],
            'clutch-kit': [400, 650, 950, 1200],
            'shocks-struts': [350, 600, 950, 1400],
            'bushings': [180, 360, 600, 860],
            'rotors-front': [110, 165, 250, 350],
            'rotors-rear': [100, 145, 220, 310],
            'pads-front': [60, 95, 155, 220],
            'pads-rear': [55, 85, 140, 195],
            'paint-single-stage': [2500, 5000, 0, 0],
            'paint-show': [0, 0, 8500, 14000],
            'radiator': [200, 320, 520, 750],
            'coolant-hoses': [100, 180, 300, 450]
        },
        // Porsche 928
        '928': {
            'engine-rebuild': [4000, 7000, 10000, 14000],
            'timing-belt-chain': [500, 900, 1300, 1700],
            'valve-cover-gasket': [60, 100, 160, 220],
            'water-pump': [150, 240, 365, 510],
            'clutch-kit': [500, 800, 1200, 1600],
            'shocks-struts': [450, 750, 1200, 1800],
            'bushings': [250, 500, 850, 1200],
            'rotors-front': [150, 225, 340, 480],
            'rotors-rear': [130, 195, 300, 420],
            'pads-front': [80, 130, 210, 295],
            'pads-rear': [70, 115, 185, 260],
            'paint-single-stage': [3000, 6000, 0, 0],
            'paint-show': [0, 0, 10000, 16000],
            'radiator': [280, 450, 730, 1050],
            'coolant-hoses': [140, 250, 420, 620]
        },
        // Porsche 964
        '964': {
            'engine-rebuild': [5000, 9000, 14000, 20000],
            'timing-belt-chain': [200, 350, 500, 700],
            'valve-cover-gasket': [50, 85, 135, 190],
            'clutch-kit': [600, 1000, 1500, 2000],
            'shocks-struts': [500, 900, 1400, 2100],
            'bushings': [300, 600, 1000, 1450],
            'rotors-front': [180, 270, 410, 575],
            'rotors-rear': [160, 240, 365, 510],
            'pads-front': [100, 160, 260, 365],
            'pads-rear': [90, 145, 235, 330],
            'paint-single-stage': [3500, 7000, 0, 0],
            'paint-show': [0, 0, 12000, 20000]
        },
        // Porsche 993
        '993': {
            'engine-rebuild': [6000, 10000, 16000, 24000],
            'timing-belt-chain': [200, 350, 500, 700],
            'valve-cover-gasket': [55, 95, 150, 210],
            'clutch-kit': [700, 1200, 1800, 2400],
            'shocks-struts': [600, 1000, 1600, 2400],
            'bushings': [360, 720, 1200, 1740],
            'rotors-front': [210, 315, 480, 670],
            'rotors-rear': [185, 280, 425, 595],
            'pads-front': [120, 195, 315, 440],
            'pads-rear': [105, 170, 275, 385],
            'paint-single-stage': [4000, 8000, 0, 0],
            'paint-show': [0, 0, 14000, 22000]
        },
        // Porsche 996
        '996': {
            'engine-rebuild': [5000, 9000, 14000, 20000],
            'timing-belt-chain': [300, 500, 800, 1100],
            'valve-cover-gasket': [50, 85, 135, 190],
            'water-pump': [130, 210, 320, 445],
            'clutch-kit': [600, 1000, 1500, 2000],
            'shocks-struts': [500, 900, 1400, 2050],
            'bushings': [300, 600, 1000, 1450],
            'rotors-front': [170, 255, 390, 545],
            'rotors-rear': [150, 225, 345, 480],
            'pads-front': [95, 155, 250, 350],
            'pads-rear': [85, 140, 225, 315],
            'paint-single-stage': [3500, 7000, 0, 0],
            'paint-show': [0, 0, 12000, 18000],
            'radiator': [260, 420, 680, 980],
            'coolant-hoses': [130, 235, 390, 580]
        },
        // Porsche 997
        '997': {
            'engine-rebuild': [6000, 10000, 16000, 22000],
            'timing-belt-chain': [350, 600, 900, 1200],
            'valve-cover-gasket': [55, 95, 150, 210],
            'water-pump': [145, 235, 355, 495],
            'clutch-kit': [700, 1200, 1700, 2300],
            'shocks-struts': [600, 1000, 1550, 2300],
            'bushings': [360, 720, 1200, 1740],
            'rotors-front': [200, 300, 455, 640],
            'rotors-rear': [175, 265, 400, 560],
            'pads-front': [110, 180, 290, 405],
            'pads-rear': [100, 160, 260, 365],
            'paint-single-stage': [4000, 8000, 0, 0],
            'paint-show': [0, 0, 13000, 20000],
            'radiator': [290, 465, 755, 1090],
            'coolant-hoses': [145, 260, 435, 645]
        },
        // Porsche 986 Boxster
        '986': {
            'engine-rebuild': [4500, 8000, 12000, 17000],
            'timing-belt-chain': [250, 450, 700, 950],
            'valve-cover-gasket': [45, 75, 120, 170],
            'water-pump': [115, 185, 280, 390],
            'clutch-kit': [550, 900, 1300, 1800],
            'shocks-struts': [450, 800, 1250, 1850],
            'bushings': [270, 540, 900, 1300],
            'rotors-front': [150, 225, 345, 480],
            'rotors-rear': [135, 200, 305, 425],
            'pads-front': [85, 140, 225, 315],
            'pads-rear': [75, 125, 200, 280],
            'paint-single-stage': [3000, 6000, 0, 0],
            'paint-show': [0, 0, 10000, 16000],
            'radiator': [230, 370, 600, 870],
            'coolant-hoses': [115, 205, 345, 510]
        },
        // Porsche 987 Boxster/Cayman
        '987': {
            'engine-rebuild': [5000, 9000, 14000, 19000],
            'timing-belt-chain': [300, 500, 800, 1100],
            'valve-cover-gasket': [50, 85, 135, 190],
            'water-pump': [130, 210, 320, 445],
            'clutch-kit': [600, 1000, 1500, 2000],
            'shocks-struts': [500, 900, 1400, 2050],
            'bushings': [300, 600, 1000, 1450],
            'rotors-front': [170, 255, 390, 545],
            'rotors-rear': [150, 225, 345, 480],
            'pads-front': [95, 155, 250, 350],
            'pads-rear': [85, 140, 225, 315],
            'paint-single-stage': [3500, 7000, 0, 0],
            'paint-show': [0, 0, 11000, 17000],
            'radiator': [260, 420, 680, 980],
            'coolant-hoses': [130, 235, 390, 580]
        },
        // Porsche 991
        '991': {
            'engine-rebuild': [7000, 12000, 18000, 26000],
            'timing-belt-chain': [400, 700, 1000, 1400],
            'valve-cover-gasket': [65, 110, 175, 245],
            'water-pump': [170, 275, 415, 580],
            'clutch-kit': [800, 1400, 2000, 2800],
            'shocks-struts': [700, 1200, 1850, 2750],
            'bushings': [420, 840, 1400, 2030],
            'rotors-front': [240, 360, 545, 765],
            'rotors-rear': [210, 315, 480, 670],
            'pads-front': [135, 220, 355, 495],
            'pads-rear': [120, 195, 315, 440],
            'paint-single-stage': [4500, 9000, 0, 0],
            'paint-show': [0, 0, 15000, 24000],
            'radiator': [340, 545, 885, 1280],
            'coolant-hoses': [170, 305, 510, 755]
        }
    };

    // Build level index
    const BUILD_LEVELS = { budget: 0, standard: 1, oem: 2, premium: 3 };

    // DOM ready
    document.addEventListener('DOMContentLoaded', init);

    function init() {
        // Setup event listeners
        document.getElementById('cost-mode').addEventListener('change', handleModeChange);
        document.getElementById('labor-rate').addEventListener('input', recalculateAll);
        document.getElementById('vehicle-select').addEventListener('change', handleVehicleChange);
        document.getElementById('build-level').addEventListener('change', handleBuildLevelChange);
        document.getElementById('vehicle-cost').addEventListener('input', updateSummary);
        document.getElementById('include-vehicle-cost').addEventListener('change', updateSummary);

        // Category toggles and item listeners
        CATEGORIES.forEach(cat => {
            const content = document.getElementById(`${cat}-content`);
            if (content) {
                content.querySelectorAll('input').forEach(input => {
                    input.addEventListener('input', () => recalculateCategory(cat));
                    input.addEventListener('change', () => recalculateCategory(cat));
                });
            }
        });

        // Action buttons
        document.getElementById('clear-btn').addEventListener('click', clearAll);
        document.getElementById('save-btn').addEventListener('click', saveProject);
        document.getElementById('load-btn').addEventListener('click', showLoadModal);
        document.getElementById('export-csv-btn').addEventListener('click', exportCSV);
        document.getElementById('export-json-btn').addEventListener('click', exportJSON);
        document.getElementById('print-btn').addEventListener('click', () => window.print());

        // Modal buttons
        document.getElementById('cancel-load-btn').addEventListener('click', hideLoadModal);
        document.getElementById('confirm-load-btn').addEventListener('click', loadProject);
        document.getElementById('delete-project-btn').addEventListener('click', deleteProject);

        // Initialize mode
        handleModeChange();
        recalculateAll();
    }

    function handleModeChange() {
        const mode = document.getElementById('cost-mode').value;
        const isShop = mode === 'shop';

        document.querySelectorAll('.shop-only').forEach(el => {
            el.style.display = isShop ? '' : 'none';
        });

        document.querySelector('.labor-rate-field').style.display = isShop ? '' : 'none';

        recalculateAll();
    }

    function handleVehicleChange() {
        const vehicle = document.getElementById('vehicle-select').value;
        if (!vehicle) return;

        const buildLevel = document.getElementById('build-level').value;
        applyVehicleEstimates(vehicle, buildLevel);
    }

    function handleBuildLevelChange() {
        const vehicle = document.getElementById('vehicle-select').value;
        if (!vehicle) return;

        const buildLevel = document.getElementById('build-level').value;
        applyVehicleEstimates(vehicle, buildLevel);
    }

    function applyVehicleEstimates(vehicle, buildLevel) {
        const estimates = VEHICLE_ESTIMATES[vehicle];
        if (!estimates) return;

        const levelIndex = BUILD_LEVELS[buildLevel];

        // Apply estimates to all items that have data for this vehicle
        Object.entries(estimates).forEach(([itemId, costs]) => {
            const row = document.querySelector(`[data-item="${itemId}"]`);
            if (!row) return;

            const partsCost = row.querySelector('.parts-cost');
            const includeCheckbox = row.querySelector('.include-item');
            const cost = costs[levelIndex];

            if (partsCost && cost !== undefined) {
                partsCost.value = cost;
                // Auto-check the include box if there's a non-zero cost
                if (includeCheckbox && cost > 0) {
                    includeCheckbox.checked = true;
                } else if (includeCheckbox && cost === 0) {
                    includeCheckbox.checked = false;
                }
            }
        });

        recalculateAll();
    }

    function toggleCategory(category) {
        const content = document.getElementById(`${category}-content`);
        const header = content.previousElementSibling;
        const icon = header.querySelector('.toggle-icon');

        content.classList.toggle('collapsed');
        icon.textContent = content.classList.contains('collapsed') ? '▶' : '▼';
    }

    // Make toggleCategory globally available
    window.toggleCategory = toggleCategory;

    function addCustomItem(category) {
        const tbody = document.getElementById(`${category}-items`);
        const row = document.createElement('tr');
        row.dataset.item = `custom-${Date.now()}`;
        row.innerHTML = `
            <td><input type="text" class="item-name" placeholder="Custom item description"></td>
            <td><input type="number" class="parts-cost" value="0" min="0" step="10"></td>
            <td class="shop-only"><input type="number" class="labor-hours" value="0" min="0" step="0.5"></td>
            <td class="line-total">$0</td>
            <td><input type="checkbox" class="include-item" checked></td>
        `;

        // Add event listeners
        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => recalculateCategory(category));
            input.addEventListener('change', () => recalculateCategory(category));
        });

        tbody.appendChild(row);

        // Update shop-only visibility
        const mode = document.getElementById('cost-mode').value;
        if (mode !== 'shop') {
            row.querySelector('.shop-only').style.display = 'none';
        }

        recalculateCategory(category);
    }

    // Make addCustomItem globally available
    window.addCustomItem = addCustomItem;

    function recalculateCategory(category) {
        const tbody = document.getElementById(`${category}-items`);
        if (!tbody) return;

        const mode = document.getElementById('cost-mode').value;
        const laborRate = parseFloat(document.getElementById('labor-rate').value) || 0;

        let categoryTotal = 0;
        let categoryParts = 0;
        let categoryHours = 0;

        tbody.querySelectorAll('tr').forEach(row => {
            const include = row.querySelector('.include-item');
            if (!include || !include.checked) {
                row.querySelector('.line-total').textContent = '$0';
                return;
            }

            const partsCost = parseFloat(row.querySelector('.parts-cost')?.value) || 0;
            const laborHours = parseFloat(row.querySelector('.labor-hours')?.value) || 0;

            let lineTotal = partsCost;
            if (mode === 'shop') {
                lineTotal += laborHours * laborRate;
            }

            row.querySelector('.line-total').textContent = formatCurrency(lineTotal);
            categoryTotal += lineTotal;
            categoryParts += partsCost;
            categoryHours += laborHours;
        });

        // Update category total in header
        document.getElementById(`${category}-total`).textContent = formatCurrency(categoryTotal);

        // Update summary
        updateSummary();
    }

    function recalculateAll() {
        CATEGORIES.forEach(cat => recalculateCategory(cat));
    }

    function updateSummary() {
        const mode = document.getElementById('cost-mode').value;
        const laborRate = parseFloat(document.getElementById('labor-rate').value) || 0;

        let totalParts = 0;
        let totalHours = 0;

        CATEGORIES.forEach(cat => {
            const tbody = document.getElementById(`${cat}-items`);
            if (!tbody) return;

            let catParts = 0;
            let catHours = 0;

            tbody.querySelectorAll('tr').forEach(row => {
                const include = row.querySelector('.include-item');
                if (!include || !include.checked) return;

                catParts += parseFloat(row.querySelector('.parts-cost')?.value) || 0;
                catHours += parseFloat(row.querySelector('.labor-hours')?.value) || 0;
            });

            totalParts += catParts;
            totalHours += catHours;

            // Update summary line
            const summaryLine = document.querySelector(`.summary-line[data-cat="${cat}"] .cat-sum`);
            if (summaryLine) {
                const catTotal = mode === 'shop' ? catParts + (catHours * laborRate) : catParts;
                summaryLine.textContent = formatCurrency(catTotal);
            }
        });

        const totalLabor = totalHours * laborRate;

        // Get vehicle cost
        const vehicleCost = parseFloat(document.getElementById('vehicle-cost').value) || 0;
        const includeVehicleCost = document.getElementById('include-vehicle-cost').checked;

        // Calculate grand total
        let grandTotal = mode === 'shop' ? totalParts + totalLabor : totalParts;
        if (includeVehicleCost) {
            grandTotal += vehicleCost;
        }

        // Update display
        document.getElementById('vehicle-cost-display').textContent = formatCurrency(vehicleCost);
        document.getElementById('parts-total').textContent = formatCurrency(totalParts);
        document.getElementById('labor-hours-total').textContent = totalHours.toFixed(1);
        document.getElementById('labor-rate-display').textContent = laborRate;
        document.getElementById('labor-total').textContent = formatCurrency(totalLabor);
        document.getElementById('grand-total').textContent = formatCurrency(grandTotal);

        // Show/hide vehicle cost line based on whether there's a value
        const vehicleCostLine = document.querySelector('.vehicle-cost-line');
        if (vehicleCostLine) {
            vehicleCostLine.style.display = vehicleCost > 0 ? '' : 'none';
        }
    }

    function formatCurrency(value) {
        return '$' + value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }

    function clearAll() {
        if (!confirm('Clear all entries? This cannot be undone.')) return;

        document.getElementById('project-name').value = '';
        document.getElementById('vehicle-select').value = '';
        document.getElementById('cost-mode').value = 'diy';
        document.getElementById('labor-rate').value = '125';
        document.getElementById('build-level').value = 'standard';
        document.getElementById('vehicle-cost').value = '0';
        document.getElementById('include-vehicle-cost').checked = true;

        CATEGORIES.forEach(cat => {
            const tbody = document.getElementById(`${cat}-items`);
            if (!tbody) return;

            tbody.querySelectorAll('tr').forEach(row => {
                const partsCost = row.querySelector('.parts-cost');
                const laborHours = row.querySelector('.labor-hours');
                const include = row.querySelector('.include-item');

                if (partsCost) partsCost.value = 0;
                if (laborHours) laborHours.value = laborHours.defaultValue || 0;
                if (include) include.checked = false;
            });

            // Remove custom items
            tbody.querySelectorAll('tr[data-item^="custom-"]').forEach(row => row.remove());
        });

        handleModeChange();
        recalculateAll();
    }

    function getProjectData() {
        const data = {
            projectName: document.getElementById('project-name').value,
            vehicle: document.getElementById('vehicle-select').value,
            costMode: document.getElementById('cost-mode').value,
            laborRate: document.getElementById('labor-rate').value,
            buildLevel: document.getElementById('build-level').value,
            vehicleCost: document.getElementById('vehicle-cost').value,
            includeVehicleCost: document.getElementById('include-vehicle-cost').checked,
            categories: {}
        };

        CATEGORIES.forEach(cat => {
            const tbody = document.getElementById(`${cat}-items`);
            if (!tbody) return;

            data.categories[cat] = [];

            tbody.querySelectorAll('tr').forEach(row => {
                const itemId = row.dataset.item;
                const isCustom = itemId.startsWith('custom-');
                const itemName = isCustom
                    ? row.querySelector('.item-name')?.value
                    : row.querySelector('td:first-child').textContent.trim();

                data.categories[cat].push({
                    id: itemId,
                    name: itemName,
                    partsCost: row.querySelector('.parts-cost')?.value || 0,
                    laborHours: row.querySelector('.labor-hours')?.value || 0,
                    included: row.querySelector('.include-item')?.checked || false,
                    isCustom: isCustom
                });
            });
        });

        return data;
    }

    function saveProject() {
        const projectName = document.getElementById('project-name').value.trim();
        if (!projectName) {
            alert('Please enter a project name to save.');
            document.getElementById('project-name').focus();
            return;
        }

        const data = getProjectData();
        const saved = JSON.parse(localStorage.getItem('zrg-build-projects') || '{}');
        saved[projectName] = data;
        localStorage.setItem('zrg-build-projects', JSON.stringify(saved));

        alert(`Project "${projectName}" saved!`);
    }

    function showLoadModal() {
        const saved = JSON.parse(localStorage.getItem('zrg-build-projects') || '{}');
        const select = document.getElementById('saved-projects-list');

        select.innerHTML = '<option value="">-- Select Project --</option>';
        Object.keys(saved).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            select.appendChild(option);
        });

        document.getElementById('load-modal').classList.add('show');
    }

    function hideLoadModal() {
        document.getElementById('load-modal').classList.remove('show');
    }

    function loadProject() {
        const select = document.getElementById('saved-projects-list');
        const projectName = select.value;
        if (!projectName) return;

        const saved = JSON.parse(localStorage.getItem('zrg-build-projects') || '{}');
        const data = saved[projectName];
        if (!data) return;

        // Clear custom items first
        CATEGORIES.forEach(cat => {
            const tbody = document.getElementById(`${cat}-items`);
            if (tbody) {
                tbody.querySelectorAll('tr[data-item^="custom-"]').forEach(row => row.remove());
            }
        });

        // Load basic settings
        document.getElementById('project-name').value = data.projectName || '';
        document.getElementById('vehicle-select').value = data.vehicle || '';
        document.getElementById('cost-mode').value = data.costMode || 'diy';
        document.getElementById('labor-rate').value = data.laborRate || '125';
        document.getElementById('build-level').value = data.buildLevel || 'standard';
        document.getElementById('vehicle-cost').value = data.vehicleCost || '0';
        document.getElementById('include-vehicle-cost').checked = data.includeVehicleCost !== false;

        // Load category data
        CATEGORIES.forEach(cat => {
            const catData = data.categories?.[cat];
            if (!catData) return;

            catData.forEach(item => {
                if (item.isCustom) {
                    // Add custom item
                    addCustomItem(cat);
                    const tbody = document.getElementById(`${cat}-items`);
                    const row = tbody.lastElementChild;
                    row.querySelector('.item-name').value = item.name;
                    row.querySelector('.parts-cost').value = item.partsCost;
                    row.querySelector('.labor-hours').value = item.laborHours;
                    row.querySelector('.include-item').checked = item.included;
                } else {
                    // Update existing item
                    const row = document.querySelector(`[data-item="${item.id}"]`);
                    if (row) {
                        row.querySelector('.parts-cost').value = item.partsCost;
                        row.querySelector('.labor-hours').value = item.laborHours;
                        row.querySelector('.include-item').checked = item.included;
                    }
                }
            });
        });

        handleModeChange();
        recalculateAll();
        hideLoadModal();
    }

    function deleteProject() {
        const select = document.getElementById('saved-projects-list');
        const projectName = select.value;
        if (!projectName) return;

        if (!confirm(`Delete project "${projectName}"?`)) return;

        const saved = JSON.parse(localStorage.getItem('zrg-build-projects') || '{}');
        delete saved[projectName];
        localStorage.setItem('zrg-build-projects', JSON.stringify(saved));

        showLoadModal(); // Refresh list
    }

    function exportCSV() {
        const data = getProjectData();
        const mode = data.costMode;
        const laborRate = parseFloat(data.laborRate) || 0;

        let csv = 'Category,Item,Parts Cost,Labor Hours,Labor Cost,Total,Included\n';

        CATEGORIES.forEach(cat => {
            const catData = data.categories?.[cat];
            if (!catData) return;

            catData.forEach(item => {
                const partsCost = parseFloat(item.partsCost) || 0;
                const laborHours = parseFloat(item.laborHours) || 0;
                const laborCost = mode === 'shop' ? laborHours * laborRate : 0;
                const total = partsCost + laborCost;

                csv += `"${cat}","${item.name}",${partsCost},${laborHours},${laborCost},${total},${item.included}\n`;
            });
        });

        downloadFile(csv, `${data.projectName || 'build-estimate'}.csv`, 'text/csv');
    }

    function exportJSON() {
        const data = getProjectData();
        const json = JSON.stringify(data, null, 2);
        downloadFile(json, `${data.projectName || 'build-estimate'}.json`, 'application/json');
    }

    function downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
})();
