/**
 * Maintenance Tracker - Vehicle service history and schedule tracking
 * Uses Supabase for persistence, requires authentication
 */

// Vehicle-specific maintenance schedules (miles, months)
const MAINTENANCE_PRESETS = {
    e28: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    e30: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt (M20/M42)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60 },
    ],
    e34: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt (M20/M50)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Auto)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    e36: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'VANOS Seals Inspection', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Cooling System Inspection', intervalMiles: 60000, intervalMonths: 48 },
    ],
    e39: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Auto)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'VANOS Seals', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Cooling System Overhaul', intervalMiles: 100000, intervalMonths: 120 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    e46: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'VANOS Seals', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Cooling System Overhaul', intervalMiles: 100000, intervalMonths: 120 },
        { name: 'Rear Subframe Inspection', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    e90: [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Cover Gasket', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Water Pump & Thermostat', intervalMiles: 80000, intervalMonths: 96 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    924: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt', intervalMiles: 45000, intervalMonths: 48 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    928: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt', intervalMiles: 45000, intervalMonths: 48 },
        { name: 'Water Pump', intervalMiles: 45000, intervalMonths: 48 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Auto)', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    944: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Timing Belt & Rollers', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Balance Shaft Belt', intervalMiles: 30000, intervalMonths: 48 },
        { name: 'Water Pump', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    964: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    986: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'IMS Bearing Inspection', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Convertible Top Inspection', intervalMiles: 30000, intervalMonths: 24 },
    ],
    987: [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'PDK Fluid (if equipped)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'IMS Bearing (Early 987)', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    991: [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 40000, intervalMonths: 48 },
        { name: 'Cabin Filter', intervalMiles: 20000, intervalMonths: 24 },
        { name: 'Spark Plugs', intervalMiles: 40000, intervalMonths: 48 },
        { name: 'Coolant Flush', intervalMiles: 40000, intervalMonths: 48 },
        { name: 'Brake Fluid Flush', intervalMiles: 20000, intervalMonths: 24 },
        { name: 'PDK Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Manual Transmission Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    993: [
        { name: 'Oil Change', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Oil Filter', intervalMiles: 5000, intervalMonths: 6 },
        { name: 'Air Filter', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Tiptronic Fluid', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Valve Adjustment', intervalMiles: 15000, intervalMonths: 24 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    996: [
        { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Tiptronic Fluid', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'IMS Bearing Upgrade', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'RMS Seal Inspection', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
    997: [
        { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
        { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Cabin Filter', intervalMiles: 15000, intervalMonths: 12 },
        { name: 'Fuel Filter', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'Spark Plugs', intervalMiles: 30000, intervalMonths: 36 },
        { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
        { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'PDK Fluid', intervalMiles: 60000, intervalMonths: 72 },
        { name: 'IMS Bearing (997.1)', intervalMiles: 50000, intervalMonths: 60 },
        { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
    ],
};

// State
let currentUser = null;
let garageVehicles = [];
let currentVehicle = null;
let maintenanceSchedule = [];
let serviceHistory = [];

// ============================================
// Authentication
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
    const container = document.querySelector('.maintenance-tracker');
    container.innerHTML = `
        <div class="auth-required">
            <div class="auth-icon">🔐</div>
            <h2>Login Required</h2>
            <p>You need to be logged in to use the Maintenance Tracker.</p>
            <p>Your service history is saved to your account so you can access it from anywhere.</p>
            <div class="auth-actions">
                <a href="/account/login/?redirect=/tools/maintenance-tracker/" class="btn btn-primary">Log In</a>
                <a href="/account/register/?redirect=/tools/maintenance-tracker/" class="btn btn-secondary">Create Account</a>
            </div>
        </div>
    `;
}

// ============================================
// Vehicle Loading
// ============================================

async function loadGarageVehicles() {
    try {
        garageVehicles = await Garage.getVehicles();
        renderGarage();
    } catch (error) {
        console.error('Failed to load garage vehicles:', error);
        garageVehicles = [];
        renderGarage();
    }
}

// ============================================
// Rendering
// ============================================

function renderGarage() {
    const grid = document.getElementById('garage-grid');
    const emptyState = document.getElementById('empty-garage');

    if (!grid) return;

    // Clear existing cards (except empty state)
    grid.querySelectorAll('.vehicle-card').forEach(card => card.remove());

    if (garageVehicles.length === 0) {
        emptyState.style.display = 'block';
        emptyState.innerHTML = `
            <p>No vehicles in your garage yet.</p>
            <p>Add a vehicle to start tracking maintenance.</p>
            <a href="/account/garage/" class="btn btn-secondary">Go to My Garage</a>
        `;
        return;
    }

    emptyState.style.display = 'none';

    garageVehicles.forEach(vehicle => {
        const card = createVehicleCard(vehicle);
        grid.appendChild(card);
    });
}

function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card';
    card.dataset.id = vehicle.id;

    const platformInfo = Garage.getPlatformInfo(vehicle.platform);
    const displayName = vehicle.nickname || `${vehicle.year || ''} ${platformInfo.fullName}`.trim();

    card.innerHTML = `
        <div class="vehicle-card-header">
            <h3>${displayName}</h3>
            <span class="platform-badge">${platformInfo.name}</span>
        </div>
        <div class="vehicle-card-body">
            <div class="vehicle-stat">
                <span class="stat-label">Year</span>
                <span class="stat-value">${vehicle.year || '-'}</span>
            </div>
            <div class="vehicle-stat">
                <span class="stat-label">Mileage</span>
                <span class="stat-value">${vehicle.mileage ? vehicle.mileage.toLocaleString() : '-'}</span>
            </div>
        </div>
        <div class="vehicle-card-status status-loading">
            Loading status...
        </div>
    `;

    card.addEventListener('click', () => showVehicleDetail(vehicle));

    // Load maintenance status asynchronously
    loadVehicleMaintenanceStatus(vehicle.id, card);

    return card;
}

async function loadVehicleMaintenanceStatus(vehicleId, card) {
    try {
        const schedule = await Garage.getMaintenanceSchedule(vehicleId);
        const vehicle = garageVehicles.find(v => String(v.id) === String(vehicleId));
        const upcoming = calculateUpcomingMaintenance(schedule, vehicle?.mileage || 0);

        const overdueCount = upcoming.filter(u => u.status === 'overdue').length;
        const dueSoonCount = upcoming.filter(u => u.status === 'due-soon').length;

        const statusEl = card.querySelector('.vehicle-card-status');
        statusEl.classList.remove('status-loading');

        if (overdueCount > 0) {
            statusEl.className = 'vehicle-card-status status-overdue';
            statusEl.textContent = `${overdueCount} overdue`;
        } else if (dueSoonCount > 0) {
            statusEl.className = 'vehicle-card-status status-due-soon';
            statusEl.textContent = `${dueSoonCount} due soon`;
        } else if (schedule.length > 0) {
            statusEl.className = 'vehicle-card-status status-ok';
            statusEl.textContent = 'All up to date';
        } else {
            statusEl.className = 'vehicle-card-status status-ok';
            statusEl.textContent = 'No schedule set';
        }
    } catch (error) {
        console.error('Failed to load maintenance status:', error);
    }
}

async function showVehicleDetail(vehicle) {
    currentVehicle = vehicle;

    // Hide garage, show detail
    document.querySelector('.garage-section').style.display = 'none';
    document.getElementById('vehicle-detail').style.display = 'block';

    const platformInfo = Garage.getPlatformInfo(vehicle.platform);
    const displayName = vehicle.nickname || `${vehicle.year || ''} ${platformInfo.fullName}`.trim();

    document.getElementById('detail-vehicle-name').textContent = displayName;
    document.getElementById('detail-vehicle-platform').textContent = platformInfo.name;
    document.getElementById('current-mileage-display').textContent = vehicle.mileage ? vehicle.mileage.toLocaleString() : '0';
    document.getElementById('update-mileage').value = '';

    // Load maintenance data
    await loadMaintenanceData();

    // Default to upcoming tab
    switchTab('upcoming');
}

async function loadMaintenanceData() {
    if (!currentVehicle) return;

    try {
        maintenanceSchedule = await Garage.getMaintenanceSchedule(currentVehicle.id);
        serviceHistory = await Garage.getServiceHistory(currentVehicle.id);

        renderUpcomingMaintenance();
        renderMaintenanceSchedule();
        renderServiceHistory();
        populateServiceItemDropdown();
    } catch (error) {
        console.error('Failed to load maintenance data:', error);
    }
}

function showGarageView() {
    currentVehicle = null;
    document.querySelector('.garage-section').style.display = 'block';
    document.getElementById('vehicle-detail').style.display = 'none';
    loadGarageVehicles();
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.toggle('active', content.id === `tab-${tabName}`);
    });
}

// ============================================
// Maintenance Calculations
// ============================================

function calculateUpcomingMaintenance(schedule, currentMileage) {
    const today = new Date();
    const results = [];

    schedule.forEach(item => {
        let milesDue = null;
        let daysDue = null;

        if (item.intervalMiles && item.lastServiceMileage !== null) {
            const nextDueMiles = item.lastServiceMileage + item.intervalMiles;
            milesDue = nextDueMiles - currentMileage;
        } else if (item.intervalMiles) {
            milesDue = -currentMileage;
        }

        if (item.intervalMonths && item.lastServiceDate) {
            const lastDate = new Date(item.lastServiceDate);
            const nextDate = new Date(lastDate);
            nextDate.setMonth(nextDate.getMonth() + item.intervalMonths);
            daysDue = Math.ceil((nextDate - today) / (1000 * 60 * 60 * 24));
        }

        let status = 'ok';
        const milesWarning = 1000;
        const daysWarning = 30;

        if ((milesDue !== null && milesDue < 0) || (daysDue !== null && daysDue < 0)) {
            status = 'overdue';
        } else if ((milesDue !== null && milesDue < milesWarning) || (daysDue !== null && daysDue < daysWarning)) {
            status = 'due-soon';
        }

        results.push({
            ...item,
            milesDue,
            daysDue,
            status
        });
    });

    results.sort((a, b) => {
        const statusOrder = { 'overdue': 0, 'due-soon': 1, 'ok': 2 };
        if (statusOrder[a.status] !== statusOrder[b.status]) {
            return statusOrder[a.status] - statusOrder[b.status];
        }
        return (a.milesDue ?? Infinity) - (b.milesDue ?? Infinity);
    });

    return results;
}

function renderUpcomingMaintenance() {
    if (!currentVehicle) return;

    const list = document.getElementById('upcoming-list');
    const currentMileage = currentVehicle.mileage || 0;
    const upcoming = calculateUpcomingMaintenance(maintenanceSchedule, currentMileage);

    if (upcoming.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <p>No maintenance items scheduled</p>
                <button type="button" class="btn btn-secondary" id="init-schedule-btn">Initialize Schedule</button>
            </div>
        `;
        document.getElementById('init-schedule-btn')?.addEventListener('click', initializeSchedule);
        return;
    }

    list.innerHTML = upcoming.map(item => {
        let dueText = '';
        if (item.milesDue !== null) {
            dueText = item.milesDue < 0
                ? `${Math.abs(item.milesDue).toLocaleString()} miles overdue`
                : `${item.milesDue.toLocaleString()} miles remaining`;
        }
        if (item.daysDue !== null) {
            if (dueText) dueText += ' / ';
            dueText += item.daysDue < 0
                ? `${Math.abs(item.daysDue)} days overdue`
                : `${item.daysDue} days remaining`;
        }
        if (!dueText) dueText = 'Not yet tracked';

        return `
            <div class="upcoming-item ${item.status}">
                <div class="upcoming-info">
                    <h4>${item.name}</h4>
                    <p>${dueText}</p>
                </div>
                <button type="button" class="btn btn-primary btn-sm log-service-btn" data-id="${item.id}">Log Service</button>
            </div>
        `;
    }).join('');

    list.querySelectorAll('.log-service-btn').forEach(btn => {
        btn.addEventListener('click', () => openServiceModal(null, btn.dataset.id));
    });
}

function renderMaintenanceSchedule() {
    if (!currentVehicle) return;

    const tbody = document.getElementById('schedule-tbody');
    const currentMileage = currentVehicle.mileage || 0;

    if (maintenanceSchedule.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No maintenance items.
                    <button type="button" class="btn btn-link init-schedule-inline" id="init-schedule-btn-2">Initialize with presets</button>
                </td>
            </tr>
        `;
        document.getElementById('init-schedule-btn-2')?.addEventListener('click', initializeSchedule);
        return;
    }

    tbody.innerHTML = maintenanceSchedule.map(item => {
        let lastService = '-';
        if (item.lastServiceDate || item.lastServiceMileage) {
            const parts = [];
            if (item.lastServiceMileage) parts.push(`${item.lastServiceMileage.toLocaleString()} mi`);
            if (item.lastServiceDate) parts.push(formatDate(item.lastServiceDate));
            lastService = parts.join(' / ');
        }

        let nextDue = '-';
        if (item.intervalMiles && item.lastServiceMileage !== null) {
            const nextMiles = item.lastServiceMileage + item.intervalMiles;
            nextDue = `${nextMiles.toLocaleString()} mi`;
        }
        if (item.intervalMonths && item.lastServiceDate) {
            const lastDate = new Date(item.lastServiceDate);
            const nextDate = new Date(lastDate);
            nextDate.setMonth(nextDate.getMonth() + item.intervalMonths);
            if (nextDue !== '-') nextDue += ' / ';
            else nextDue = '';
            nextDue += formatDate(nextDate.toISOString().split('T')[0]);
        }

        return `
            <tr>
                <td data-label="Item">${item.name}</td>
                <td data-label="Miles">${item.intervalMiles ? item.intervalMiles.toLocaleString() : '-'}</td>
                <td data-label="Months">${item.intervalMonths || '-'}</td>
                <td data-label="Last Service">${lastService}</td>
                <td data-label="Next Due">${nextDue}</td>
                <td class="actions-cell">
                    <button type="button" class="btn-icon edit-maintenance" data-id="${item.id}" title="Edit">&#9998;</button>
                    <button type="button" class="btn-icon delete-maintenance" data-id="${item.id}" title="Delete">&times;</button>
                </td>
            </tr>
        `;
    }).join('');

    tbody.querySelectorAll('.edit-maintenance').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = maintenanceSchedule.find(i => String(i.id) === String(btn.dataset.id));
            if (item) openMaintenanceModal(item);
        });
    });

    tbody.querySelectorAll('.delete-maintenance').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Delete this maintenance item?')) {
                try {
                    await Garage.deleteMaintenanceItem(btn.dataset.id);
                    await loadMaintenanceData();
                } catch (error) {
                    console.error('Failed to delete:', error);
                    alert('Failed to delete item');
                }
            }
        });
    });
}

function renderServiceHistory() {
    if (!currentVehicle) return;

    const list = document.getElementById('history-list');

    if (serviceHistory.length === 0) {
        list.innerHTML = '<div class="empty-state">No service records yet</div>';
        return;
    }

    const sorted = [...serviceHistory].sort((a, b) => new Date(b.service_date) - new Date(a.service_date));

    list.innerHTML = sorted.map(record => `
        <div class="history-item">
            <div class="history-header">
                <h4>${record.serviceName}</h4>
                <span class="history-date">${formatDate(record.serviceDate)}</span>
            </div>
            <div class="history-details">
                <span class="history-mileage">${record.mileage ? record.mileage.toLocaleString() + ' miles' : ''}</span>
                <span class="history-cost">${record.cost ? '$' + parseFloat(record.cost).toFixed(2) : ''}</span>
                <span class="history-shop">${record.shopType === 'diy' ? 'DIY' : record.shopType === 'dealer' ? 'Dealer' : 'Shop'}</span>
            </div>
            ${record.partsUsed ? `<div class="history-parts"><strong>Parts:</strong> ${record.partsUsed}</div>` : ''}
            ${record.notes ? `<div class="history-notes">${record.notes}</div>` : ''}
            <div class="history-actions">
                <button type="button" class="btn-icon edit-service" data-id="${record.id}" title="Edit">&#9998;</button>
                <button type="button" class="btn-icon delete-service" data-id="${record.id}" title="Delete">&times;</button>
            </div>
        </div>
    `).join('');

    list.querySelectorAll('.edit-service').forEach(btn => {
        btn.addEventListener('click', () => {
            const record = serviceHistory.find(r => String(r.id) === String(btn.dataset.id));
            if (record) openServiceModal(record);
        });
    });

    list.querySelectorAll('.delete-service').forEach(btn => {
        btn.addEventListener('click', async () => {
            if (confirm('Delete this service record?')) {
                try {
                    await Garage.deleteServiceRecord(btn.dataset.id);
                    await loadMaintenanceData();
                } catch (error) {
                    console.error('Failed to delete:', error);
                    alert('Failed to delete record');
                }
            }
        });
    });
}

// ============================================
// Initialize Schedule
// ============================================

async function initializeSchedule() {
    if (!currentVehicle) return;

    const presets = MAINTENANCE_PRESETS[currentVehicle.platform];
    if (!presets) {
        alert('No presets available for this platform. Add items manually.');
        return;
    }

    if (!confirm(`Initialize maintenance schedule with ${presets.length} preset items for ${Garage.getPlatformInfo(currentVehicle.platform).name}?`)) {
        return;
    }

    try {
        for (const preset of presets) {
            await Garage.addMaintenanceItem(currentVehicle.id, {
                name: preset.name,
                intervalMiles: preset.intervalMiles,
                intervalMonths: preset.intervalMonths
            });
        }
        await loadMaintenanceData();
    } catch (error) {
        console.error('Failed to initialize schedule:', error);
        alert('Failed to initialize schedule');
    }
}

// ============================================
// Modals
// ============================================

function openMaintenanceModal(item = null) {
    const modal = document.getElementById('maintenance-modal');
    const title = document.getElementById('maintenance-modal-title');

    if (item) {
        title.textContent = 'Edit Maintenance Item';
        document.getElementById('maintenance-name').value = item.name || '';
        document.getElementById('maintenance-interval-miles').value = item.intervalMiles || '';
        document.getElementById('maintenance-interval-months').value = item.intervalMonths || '';
        document.getElementById('maintenance-last-mileage').value = item.lastServiceMileage || '';
        document.getElementById('maintenance-last-date').value = item.lastServiceDate || '';
        document.getElementById('maintenance-edit-id').value = item.id;
    } else {
        title.textContent = 'Add Maintenance Item';
        document.getElementById('maintenance-name').value = '';
        document.getElementById('maintenance-interval-miles').value = '';
        document.getElementById('maintenance-interval-months').value = '';
        document.getElementById('maintenance-last-mileage').value = '';
        document.getElementById('maintenance-last-date').value = '';
        document.getElementById('maintenance-edit-id').value = '';
    }

    modal.classList.add('active');
}

function closeMaintenanceModal() {
    document.getElementById('maintenance-modal').classList.remove('active');
}

async function saveMaintenanceItem() {
    if (!currentVehicle) return;

    const name = document.getElementById('maintenance-name').value.trim();
    const intervalMiles = document.getElementById('maintenance-interval-miles').value;
    const intervalMonths = document.getElementById('maintenance-interval-months').value;
    const lastMileage = document.getElementById('maintenance-last-mileage').value;
    const lastDate = document.getElementById('maintenance-last-date').value;
    const editId = document.getElementById('maintenance-edit-id').value;

    if (!name) {
        alert('Please enter an item name');
        return;
    }

    if (!intervalMiles && !intervalMonths) {
        alert('Please enter at least one interval');
        return;
    }

    const data = {
        name: name,
        intervalMiles: intervalMiles ? parseInt(intervalMiles) : null,
        intervalMonths: intervalMonths ? parseInt(intervalMonths) : null,
        lastServiceMileage: lastMileage ? parseInt(lastMileage) : null,
        lastServiceDate: lastDate || null
    };

    try {
        if (editId) {
            await Garage.updateMaintenanceItem(editId, data);
        } else {
            await Garage.addMaintenanceItem(currentVehicle.id, data);
        }

        closeMaintenanceModal();
        await loadMaintenanceData();
    } catch (error) {
        console.error('Failed to save:', error);
        alert('Failed to save maintenance item');
    }
}

function populateServiceItemDropdown() {
    const select = document.getElementById('service-item');
    select.innerHTML = '<option value="">Select or enter custom...</option>';

    maintenanceSchedule.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.name;
        select.appendChild(option);
    });
}

function openServiceModal(record = null, linkedMaintenanceId = null) {
    const modal = document.getElementById('service-modal');
    const title = document.getElementById('service-modal-title');

    document.getElementById('service-item-custom').style.display = 'none';

    if (record) {
        title.textContent = 'Edit Service Record';
        document.getElementById('service-item').value = record.maintenanceId || '';
        document.getElementById('service-item-custom').value = record.maintenanceId ? '' : record.serviceName;
        document.getElementById('service-item-custom').style.display = record.maintenanceId ? 'none' : 'block';
        document.getElementById('service-date').value = record.serviceDate || '';
        document.getElementById('service-mileage').value = record.mileage || '';
        document.getElementById('service-cost').value = record.cost || '';
        document.getElementById('service-shop').value = record.shopType || 'diy';
        document.getElementById('service-parts').value = record.partsUsed || '';
        document.getElementById('service-notes').value = record.notes || '';
        document.getElementById('service-edit-id').value = record.id;
        document.getElementById('service-linked-maintenance-id').value = record.maintenanceId || '';
    } else {
        title.textContent = 'Log Service';
        document.getElementById('service-item').value = linkedMaintenanceId || '';
        document.getElementById('service-item-custom').value = '';
        document.getElementById('service-date').value = new Date().toISOString().split('T')[0];
        document.getElementById('service-mileage').value = currentVehicle?.mileage || '';
        document.getElementById('service-cost').value = '';
        document.getElementById('service-shop').value = 'diy';
        document.getElementById('service-parts').value = '';
        document.getElementById('service-notes').value = '';
        document.getElementById('service-edit-id').value = '';
        document.getElementById('service-linked-maintenance-id').value = linkedMaintenanceId || '';
    }

    modal.classList.add('active');
}

function closeServiceModal() {
    document.getElementById('service-modal').classList.remove('active');
}

async function saveServiceRecord() {
    if (!currentVehicle) return;

    const itemSelect = document.getElementById('service-item').value;
    const itemCustom = document.getElementById('service-item-custom').value.trim();
    const date = document.getElementById('service-date').value;
    const mileage = document.getElementById('service-mileage').value;
    const cost = document.getElementById('service-cost').value;
    const shop = document.getElementById('service-shop').value;
    const parts = document.getElementById('service-parts').value.trim();
    const notes = document.getElementById('service-notes').value.trim();
    const editId = document.getElementById('service-edit-id').value;

    let serviceName = '';
    let maintenanceItemId = null;

    if (itemSelect) {
        maintenanceItemId = itemSelect;
        const item = maintenanceSchedule.find(i => String(i.id) === String(itemSelect));
        serviceName = item ? item.name : 'Service';
    } else if (itemCustom) {
        serviceName = itemCustom;
    } else {
        alert('Please select or enter a service name');
        return;
    }

    if (!date) {
        alert('Please enter a service date');
        return;
    }

    const data = {
        serviceName: serviceName,
        maintenanceId: maintenanceItemId,
        serviceDate: date,
        mileage: mileage ? parseInt(mileage) : null,
        cost: cost ? parseFloat(cost) : null,
        shopType: shop,
        partsUsed: parts || null,
        notes: notes || null
    };

    try {
        if (editId) {
            await Garage.updateServiceRecord(editId, data);
        } else {
            await Garage.addServiceRecord(currentVehicle.id, data);
        }

        // Update mileage if higher
        if (mileage && parseInt(mileage) > (currentVehicle.mileage || 0)) {
            await Garage.updateVehicle(currentVehicle.id, { mileage: parseInt(mileage) });
            currentVehicle.mileage = parseInt(mileage);
            document.getElementById('current-mileage-display').textContent = currentVehicle.mileage.toLocaleString();
        }

        closeServiceModal();
        await loadMaintenanceData();
    } catch (error) {
        console.error('Failed to save:', error);
        alert('Failed to save service record');
    }
}

// ============================================
// Update Mileage
// ============================================

async function updateMileage() {
    if (!currentVehicle) return;

    const newMileage = parseInt(document.getElementById('update-mileage').value);
    if (!newMileage || newMileage < 0) {
        alert('Please enter a valid mileage');
        return;
    }

    if (currentVehicle.mileage && newMileage < currentVehicle.mileage) {
        if (!confirm('New mileage is less than current. Are you sure?')) {
            return;
        }
    }

    try {
        await Garage.updateVehicle(currentVehicle.id, { mileage: newMileage });
        currentVehicle.mileage = newMileage;
        document.getElementById('current-mileage-display').textContent = newMileage.toLocaleString();
        document.getElementById('update-mileage').value = '';
        renderUpcomingMaintenance();
        renderMaintenanceSchedule();
    } catch (error) {
        console.error('Failed to update mileage:', error);
        alert('Failed to update mileage');
    }
}

// ============================================
// Export
// ============================================

function exportJSON() {
    const data = {
        vehicle: currentVehicle,
        maintenanceSchedule,
        serviceHistory,
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maintenance-${currentVehicle?.nickname || 'export'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportCSV() {
    let csv = 'Service,Date,Mileage,Cost,Performed By,Parts,Notes\n';

    serviceHistory.forEach(record => {
        csv += [
            `"${record.serviceName}"`,
            record.serviceDate || '',
            record.mileage || '',
            record.cost || '',
            record.shopType || '',
            `"${(record.partsUsed || '').replace(/"/g, '""')}"`,
            `"${(record.notes || '').replace(/"/g, '""')}"`
        ].join(',') + '\n';
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `service-history-${currentVehicle?.nickname || 'export'}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function printRecords() {
    window.print();
}

// ============================================
// Helpers
// ============================================

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ============================================
// Event Binding
// ============================================

function bindEvents() {
    // Back to garage
    document.getElementById('back-to-garage')?.addEventListener('click', showGarageView);

    // Update mileage
    document.getElementById('update-mileage-btn')?.addEventListener('click', updateMileage);
    document.getElementById('update-mileage')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') updateMileage();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Maintenance modal
    document.getElementById('add-maintenance-item')?.addEventListener('click', () => openMaintenanceModal());
    document.getElementById('close-maintenance-modal')?.addEventListener('click', closeMaintenanceModal);
    document.getElementById('cancel-maintenance')?.addEventListener('click', closeMaintenanceModal);
    document.getElementById('save-maintenance')?.addEventListener('click', saveMaintenanceItem);
    document.getElementById('maintenance-modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeMaintenanceModal();
    });

    // Service modal
    document.getElementById('add-service-record')?.addEventListener('click', () => openServiceModal());
    document.getElementById('close-service-modal')?.addEventListener('click', closeServiceModal);
    document.getElementById('cancel-service')?.addEventListener('click', closeServiceModal);
    document.getElementById('save-service')?.addEventListener('click', saveServiceRecord);
    document.getElementById('service-modal')?.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) closeServiceModal();
    });

    // Service item dropdown
    document.getElementById('service-item')?.addEventListener('change', (e) => {
        document.getElementById('service-item-custom').style.display = e.target.value === '' ? 'block' : 'none';
    });

    // Export
    document.getElementById('export-json')?.addEventListener('click', exportJSON);
    document.getElementById('export-csv')?.addEventListener('click', exportCSV);
    document.getElementById('print-records')?.addEventListener('click', printRecords);
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) return;

    bindEvents();
    await loadGarageVehicles();

    // Check for vehicle param
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('vehicle');
    if (vehicleId) {
        const vehicle = garageVehicles.find(v => String(v.id) === String(vehicleId));
        if (vehicle) {
            showVehicleDetail(vehicle);
        }
    }
});
