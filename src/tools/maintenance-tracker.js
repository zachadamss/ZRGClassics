// Maintenance Tracker for ZRG Classics
// Tracks service history and maintenance schedules for vintage German cars

(function() {
    'use strict';

    // Vehicle-specific maintenance schedules (miles, months)
    const MAINTENANCE_PRESETS = {
        // BMW E28 5-Series
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
        // BMW E30 3-Series
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
        // BMW E34 5-Series
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
            { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // BMW E36 3-Series
        e36: [
            { name: 'Oil Change', intervalMiles: 7500, intervalMonths: 12 },
            { name: 'Oil Filter', intervalMiles: 7500, intervalMonths: 12 },
            { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
            { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
            { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
            { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
            { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
            { name: 'Transmission Fluid (Auto)', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'VANOS Seals Inspection', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
            { name: 'Cooling System Inspection', intervalMiles: 60000, intervalMonths: 48 },
        ],
        // BMW E39 5-Series
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
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'VANOS Seals', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Valve Cover Gasket', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Cooling System Overhaul', intervalMiles: 100000, intervalMonths: 120 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // BMW E46 3-Series
        e46: [
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
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'VANOS Seals', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Valve Cover Gasket', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Cooling System Overhaul', intervalMiles: 100000, intervalMonths: 120 },
            { name: 'Rear Subframe Inspection', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // BMW E90 3-Series
        e90: [
            { name: 'Oil Change', intervalMiles: 10000, intervalMonths: 12 },
            { name: 'Oil Filter', intervalMiles: 10000, intervalMonths: 12 },
            { name: 'Air Filter', intervalMiles: 30000, intervalMonths: 36 },
            { name: 'Microfilter (Cabin)', intervalMiles: 15000, intervalMonths: 12 },
            { name: 'Fuel Filter', intervalMiles: 30000, intervalMonths: 36 },
            { name: 'Spark Plugs', intervalMiles: 60000, intervalMonths: 60 },
            { name: 'Coolant Flush', intervalMiles: 30000, intervalMonths: 24 },
            { name: 'Brake Fluid Flush', intervalMiles: 30000, intervalMonths: 24 },
            { name: 'Transmission Fluid (Auto)', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Differential Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Valve Cover Gasket', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Water Pump & Thermostat', intervalMiles: 80000, intervalMonths: 96 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // Porsche 924
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
        // Porsche 928
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
            { name: 'Transmission Fluid (Manual)', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // Porsche 944
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
        // Porsche 964
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
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Valve Adjustment', intervalMiles: 15000, intervalMonths: 24 },
            { name: 'Clutch Inspection', intervalMiles: 60000, intervalMonths: 60 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // Porsche 986 Boxster
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
        // Porsche 987 Boxster/Cayman
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
        // Porsche 991
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
        // Porsche 993
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
            { name: 'Power Steering Fluid', intervalMiles: 60000, intervalMonths: 72 },
            { name: 'Valve Adjustment', intervalMiles: 15000, intervalMonths: 24 },
            { name: 'Brake Pads Inspection', intervalMiles: 15000, intervalMonths: 12 },
        ],
        // Porsche 996
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
        // Porsche 997
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

    // Platform display names
    const PLATFORM_NAMES = {
        e28: 'BMW E28',
        e30: 'BMW E30',
        e34: 'BMW E34',
        e36: 'BMW E36',
        e39: 'BMW E39',
        e46: 'BMW E46',
        e90: 'BMW E90',
        924: 'Porsche 924',
        928: 'Porsche 928',
        944: 'Porsche 944',
        964: 'Porsche 964',
        986: 'Porsche 986',
        987: 'Porsche 987',
        991: 'Porsche 991',
        993: 'Porsche 993',
        996: 'Porsche 996',
        997: 'Porsche 997',
    };

    // Data storage
    let garage = [];
    let currentVehicleId = null;

    // Generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Save to localStorage
    function saveData() {
        localStorage.setItem('zrg-maintenance-garage', JSON.stringify(garage));
    }

    // Load from localStorage
    function loadData() {
        const saved = localStorage.getItem('zrg-maintenance-garage');
        if (saved) {
            try {
                garage = JSON.parse(saved);
            } catch (e) {
                garage = [];
            }
        }
    }

    // Get current vehicle
    function getCurrentVehicle() {
        return garage.find(v => v.id === currentVehicleId);
    }

    // Initialize
    function init() {
        loadData();
        renderGarage();
        bindEvents();
    }

    // Bind all event listeners
    function bindEvents() {
        // Add vehicle button
        document.getElementById('add-vehicle-btn').addEventListener('click', () => openVehicleModal());

        // Vehicle modal
        document.getElementById('close-vehicle-modal').addEventListener('click', closeVehicleModal);
        document.getElementById('cancel-vehicle').addEventListener('click', closeVehicleModal);
        document.getElementById('save-vehicle').addEventListener('click', saveVehicle);
        document.getElementById('vehicle-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) closeVehicleModal();
        });

        // Back to garage
        document.getElementById('back-to-garage').addEventListener('click', showGarageView);

        // Edit/Delete vehicle
        document.getElementById('edit-vehicle-btn').addEventListener('click', () => {
            const vehicle = getCurrentVehicle();
            if (vehicle) openVehicleModal(vehicle);
        });
        document.getElementById('delete-vehicle-btn').addEventListener('click', deleteCurrentVehicle);

        // Update mileage
        document.getElementById('update-mileage-btn').addEventListener('click', updateMileage);
        document.getElementById('update-mileage').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') updateMileage();
        });

        // Tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => switchTab(btn.dataset.tab));
        });

        // Maintenance modal
        document.getElementById('add-maintenance-item').addEventListener('click', () => openMaintenanceModal());
        document.getElementById('close-maintenance-modal').addEventListener('click', closeMaintenanceModal);
        document.getElementById('cancel-maintenance').addEventListener('click', closeMaintenanceModal);
        document.getElementById('save-maintenance').addEventListener('click', saveMaintenanceItem);
        document.getElementById('maintenance-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) closeMaintenanceModal();
        });

        // Service modal
        document.getElementById('add-service-record').addEventListener('click', () => openServiceModal());
        document.getElementById('close-service-modal').addEventListener('click', closeServiceModal);
        document.getElementById('cancel-service').addEventListener('click', closeServiceModal);
        document.getElementById('save-service').addEventListener('click', saveServiceRecord);
        document.getElementById('service-modal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) closeServiceModal();
        });

        // Service item dropdown
        document.getElementById('service-item').addEventListener('change', (e) => {
            const customInput = document.getElementById('service-item-custom');
            customInput.style.display = e.target.value === '' ? 'block' : 'none';
        });

        // Export/Import
        document.getElementById('export-json').addEventListener('click', exportJSON);
        document.getElementById('export-csv').addEventListener('click', exportCSV);
        document.getElementById('import-json').addEventListener('click', () => {
            document.getElementById('import-file').click();
        });
        document.getElementById('import-file').addEventListener('change', importJSON);
        document.getElementById('print-records').addEventListener('click', printRecords);
    }

    // Render garage view
    function renderGarage() {
        const grid = document.getElementById('garage-grid');
        const emptyState = document.getElementById('empty-garage');

        if (garage.length === 0) {
            emptyState.style.display = 'block';
            grid.querySelectorAll('.vehicle-card').forEach(card => card.remove());
            return;
        }

        emptyState.style.display = 'none';

        // Clear existing cards
        grid.querySelectorAll('.vehicle-card').forEach(card => card.remove());

        garage.forEach(vehicle => {
            const card = createVehicleCard(vehicle);
            grid.appendChild(card);
        });
    }

    // Create vehicle card
    function createVehicleCard(vehicle) {
        const card = document.createElement('div');
        card.className = 'vehicle-card';
        card.dataset.id = vehicle.id;

        const upcoming = getUpcomingMaintenance(vehicle);
        const overdueCount = upcoming.filter(u => u.status === 'overdue').length;
        const dueSoonCount = upcoming.filter(u => u.status === 'due-soon').length;

        let statusClass = 'status-ok';
        let statusText = 'All up to date';
        if (overdueCount > 0) {
            statusClass = 'status-overdue';
            statusText = `${overdueCount} overdue`;
        } else if (dueSoonCount > 0) {
            statusClass = 'status-due-soon';
            statusText = `${dueSoonCount} due soon`;
        }

        card.innerHTML = `
            <div class="vehicle-card-header">
                <h3>${vehicle.name}</h3>
                <span class="platform-badge">${PLATFORM_NAMES[vehicle.platform] || vehicle.platform}</span>
            </div>
            <div class="vehicle-card-body">
                <div class="vehicle-stat">
                    <span class="stat-label">Year</span>
                    <span class="stat-value">${vehicle.year || '-'}</span>
                </div>
                <div class="vehicle-stat">
                    <span class="stat-label">Mileage</span>
                    <span class="stat-value">${vehicle.currentMileage ? vehicle.currentMileage.toLocaleString() : '-'}</span>
                </div>
                <div class="vehicle-stat">
                    <span class="stat-label">Service Records</span>
                    <span class="stat-value">${vehicle.serviceHistory ? vehicle.serviceHistory.length : 0}</span>
                </div>
            </div>
            <div class="vehicle-card-status ${statusClass}">
                ${statusText}
            </div>
        `;

        card.addEventListener('click', () => showVehicleDetail(vehicle.id));
        return card;
    }

    // Show vehicle detail view
    function showVehicleDetail(vehicleId) {
        currentVehicleId = vehicleId;
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        document.querySelector('.garage-section').style.display = 'none';
        document.getElementById('vehicle-detail').style.display = 'block';

        document.getElementById('detail-vehicle-name').textContent = vehicle.name;
        document.getElementById('detail-vehicle-platform').textContent = PLATFORM_NAMES[vehicle.platform] || vehicle.platform;
        document.getElementById('current-mileage-display').textContent = vehicle.currentMileage ? vehicle.currentMileage.toLocaleString() : '0';
        document.getElementById('update-mileage').value = '';

        // Reset to upcoming tab
        switchTab('upcoming');

        renderUpcomingMaintenance();
        renderMaintenanceSchedule();
        renderServiceHistory();
        populateServiceItemDropdown();
    }

    // Show garage view
    function showGarageView() {
        currentVehicleId = null;
        document.querySelector('.garage-section').style.display = 'block';
        document.getElementById('vehicle-detail').style.display = 'none';
        renderGarage();
    }

    // Switch tabs
    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    // Vehicle Modal
    function openVehicleModal(vehicle = null) {
        const modal = document.getElementById('vehicle-modal');
        const title = document.getElementById('vehicle-modal-title');

        if (vehicle) {
            title.textContent = 'Edit Vehicle';
            document.getElementById('vehicle-name').value = vehicle.name;
            document.getElementById('vehicle-platform').value = vehicle.platform;
            document.getElementById('vehicle-year').value = vehicle.year || '';
            document.getElementById('vehicle-mileage').value = vehicle.currentMileage || '';
            document.getElementById('vehicle-purchase-date').value = vehicle.purchaseDate || '';
            document.getElementById('vehicle-vin').value = vehicle.vin || '';
            document.getElementById('vehicle-edit-id').value = vehicle.id;
        } else {
            title.textContent = 'Add Vehicle';
            document.getElementById('vehicle-name').value = '';
            document.getElementById('vehicle-platform').value = '';
            document.getElementById('vehicle-year').value = '';
            document.getElementById('vehicle-mileage').value = '';
            document.getElementById('vehicle-purchase-date').value = '';
            document.getElementById('vehicle-vin').value = '';
            document.getElementById('vehicle-edit-id').value = '';
        }

        modal.classList.add('active');
    }

    function closeVehicleModal() {
        document.getElementById('vehicle-modal').classList.remove('active');
    }

    function saveVehicle() {
        const name = document.getElementById('vehicle-name').value.trim();
        const platform = document.getElementById('vehicle-platform').value;
        const year = document.getElementById('vehicle-year').value;
        const mileage = document.getElementById('vehicle-mileage').value;
        const purchaseDate = document.getElementById('vehicle-purchase-date').value;
        const vin = document.getElementById('vehicle-vin').value.trim();
        const editId = document.getElementById('vehicle-edit-id').value;

        if (!name) {
            alert('Please enter a vehicle name');
            return;
        }
        if (!platform) {
            alert('Please select a platform');
            return;
        }

        if (editId) {
            // Edit existing
            const vehicle = garage.find(v => v.id === editId);
            if (vehicle) {
                vehicle.name = name;
                vehicle.platform = platform;
                vehicle.year = year ? parseInt(year) : null;
                vehicle.currentMileage = mileage ? parseInt(mileage) : null;
                vehicle.purchaseDate = purchaseDate || null;
                vehicle.vin = vin || null;
            }
        } else {
            // Create new
            const vehicle = {
                id: generateId(),
                name,
                platform,
                year: year ? parseInt(year) : null,
                currentMileage: mileage ? parseInt(mileage) : null,
                purchaseDate: purchaseDate || null,
                vin: vin || null,
                maintenanceSchedule: MAINTENANCE_PRESETS[platform] ?
                    MAINTENANCE_PRESETS[platform].map(item => ({
                        id: generateId(),
                        ...item,
                        lastServiceDate: null,
                        lastServiceMileage: null
                    })) : [],
                serviceHistory: []
            };
            garage.push(vehicle);
        }

        saveData();
        closeVehicleModal();

        if (editId && currentVehicleId === editId) {
            showVehicleDetail(editId);
        } else if (!editId) {
            showVehicleDetail(garage[garage.length - 1].id);
        } else {
            renderGarage();
        }
    }

    function deleteCurrentVehicle() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        if (!confirm(`Are you sure you want to delete "${vehicle.name}"? This will remove all service history.`)) {
            return;
        }

        garage = garage.filter(v => v.id !== vehicle.id);
        saveData();
        showGarageView();
    }

    // Update mileage
    function updateMileage() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        const newMileage = parseInt(document.getElementById('update-mileage').value);
        if (!newMileage || newMileage < 0) {
            alert('Please enter a valid mileage');
            return;
        }

        if (vehicle.currentMileage && newMileage < vehicle.currentMileage) {
            if (!confirm('New mileage is less than current. Are you sure?')) {
                return;
            }
        }

        vehicle.currentMileage = newMileage;
        saveData();

        document.getElementById('current-mileage-display').textContent = newMileage.toLocaleString();
        document.getElementById('update-mileage').value = '';

        renderUpcomingMaintenance();
        renderMaintenanceSchedule();
    }

    // Calculate upcoming maintenance
    function getUpcomingMaintenance(vehicle) {
        if (!vehicle.maintenanceSchedule) return [];

        const today = new Date();
        const currentMileage = vehicle.currentMileage || 0;
        const results = [];

        vehicle.maintenanceSchedule.forEach(item => {
            let nextDueMiles = null;
            let nextDueDate = null;
            let milesDue = null;
            let daysDue = null;

            if (item.intervalMiles && item.lastServiceMileage !== null) {
                nextDueMiles = item.lastServiceMileage + item.intervalMiles;
                milesDue = nextDueMiles - currentMileage;
            } else if (item.intervalMiles) {
                // Never serviced, due now based on mileage
                milesDue = -currentMileage;
            }

            if (item.intervalMonths && item.lastServiceDate) {
                const lastDate = new Date(item.lastServiceDate);
                nextDueDate = new Date(lastDate);
                nextDueDate.setMonth(nextDueDate.getMonth() + item.intervalMonths);
                daysDue = Math.ceil((nextDueDate - today) / (1000 * 60 * 60 * 24));
            }

            // Determine status
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
                nextDueMiles,
                nextDueDate,
                milesDue,
                daysDue,
                status
            });
        });

        // Sort by urgency
        results.sort((a, b) => {
            const statusOrder = { 'overdue': 0, 'due-soon': 1, 'ok': 2 };
            if (statusOrder[a.status] !== statusOrder[b.status]) {
                return statusOrder[a.status] - statusOrder[b.status];
            }
            // Then by miles due
            const aMiles = a.milesDue ?? Infinity;
            const bMiles = b.milesDue ?? Infinity;
            return aMiles - bMiles;
        });

        return results;
    }

    // Render upcoming maintenance
    function renderUpcomingMaintenance() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        const list = document.getElementById('upcoming-list');
        const upcoming = getUpcomingMaintenance(vehicle);

        if (upcoming.length === 0) {
            list.innerHTML = '<div class="empty-state">No maintenance items scheduled</div>';
            return;
        }

        list.innerHTML = upcoming.map(item => {
            let dueText = '';
            if (item.milesDue !== null) {
                if (item.milesDue < 0) {
                    dueText = `${Math.abs(item.milesDue).toLocaleString()} miles overdue`;
                } else {
                    dueText = `${item.milesDue.toLocaleString()} miles remaining`;
                }
            }
            if (item.daysDue !== null) {
                if (dueText) dueText += ' / ';
                if (item.daysDue < 0) {
                    dueText += `${Math.abs(item.daysDue)} days overdue`;
                } else {
                    dueText += `${item.daysDue} days remaining`;
                }
            }
            if (!dueText) {
                dueText = 'Not yet tracked';
            }

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

        // Bind log service buttons
        list.querySelectorAll('.log-service-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const maintenanceId = btn.dataset.id;
                openServiceModal(null, maintenanceId);
            });
        });
    }

    // Render maintenance schedule
    function renderMaintenanceSchedule() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        const tbody = document.getElementById('schedule-tbody');

        if (!vehicle.maintenanceSchedule || vehicle.maintenanceSchedule.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No maintenance items. Add items to track.</td></tr>';
            return;
        }

        const currentMileage = vehicle.currentMileage || 0;

        tbody.innerHTML = vehicle.maintenanceSchedule.map(item => {
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

        // Bind edit/delete buttons
        tbody.querySelectorAll('.edit-maintenance').forEach(btn => {
            btn.addEventListener('click', () => {
                const item = vehicle.maintenanceSchedule.find(i => i.id === btn.dataset.id);
                if (item) openMaintenanceModal(item);
            });
        });

        tbody.querySelectorAll('.delete-maintenance').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this maintenance item?')) {
                    vehicle.maintenanceSchedule = vehicle.maintenanceSchedule.filter(i => i.id !== btn.dataset.id);
                    saveData();
                    renderMaintenanceSchedule();
                    renderUpcomingMaintenance();
                }
            });
        });
    }

    // Render service history
    function renderServiceHistory() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        const list = document.getElementById('history-list');

        if (!vehicle.serviceHistory || vehicle.serviceHistory.length === 0) {
            list.innerHTML = '<div class="empty-state">No service records yet</div>';
            return;
        }

        // Sort by date descending
        const sorted = [...vehicle.serviceHistory].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });

        list.innerHTML = sorted.map(record => {
            return `
                <div class="history-item">
                    <div class="history-header">
                        <h4>${record.serviceName}</h4>
                        <span class="history-date">${formatDate(record.date)}</span>
                    </div>
                    <div class="history-details">
                        <span class="history-mileage">${record.mileage ? record.mileage.toLocaleString() + ' miles' : ''}</span>
                        <span class="history-cost">${record.cost ? '$' + record.cost.toFixed(2) : ''}</span>
                        <span class="history-shop">${record.shop === 'diy' ? 'DIY' : record.shop === 'dealer' ? 'Dealer' : 'Shop'}</span>
                    </div>
                    ${record.parts ? `<div class="history-parts"><strong>Parts:</strong> ${record.parts}</div>` : ''}
                    ${record.notes ? `<div class="history-notes">${record.notes}</div>` : ''}
                    <div class="history-actions">
                        <button type="button" class="btn-icon edit-service" data-id="${record.id}" title="Edit">&#9998;</button>
                        <button type="button" class="btn-icon delete-service" data-id="${record.id}" title="Delete">&times;</button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind edit/delete buttons
        list.querySelectorAll('.edit-service').forEach(btn => {
            btn.addEventListener('click', () => {
                const record = vehicle.serviceHistory.find(r => r.id === btn.dataset.id);
                if (record) openServiceModal(record);
            });
        });

        list.querySelectorAll('.delete-service').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this service record?')) {
                    vehicle.serviceHistory = vehicle.serviceHistory.filter(r => r.id !== btn.dataset.id);
                    saveData();
                    renderServiceHistory();
                }
            });
        });
    }

    // Maintenance Modal
    function openMaintenanceModal(item = null) {
        const modal = document.getElementById('maintenance-modal');
        const title = document.getElementById('maintenance-modal-title');

        if (item) {
            title.textContent = 'Edit Maintenance Item';
            document.getElementById('maintenance-name').value = item.name;
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

    function saveMaintenanceItem() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

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
            alert('Please enter at least one interval (miles or months)');
            return;
        }

        if (!vehicle.maintenanceSchedule) {
            vehicle.maintenanceSchedule = [];
        }

        if (editId) {
            const item = vehicle.maintenanceSchedule.find(i => i.id === editId);
            if (item) {
                item.name = name;
                item.intervalMiles = intervalMiles ? parseInt(intervalMiles) : null;
                item.intervalMonths = intervalMonths ? parseInt(intervalMonths) : null;
                item.lastServiceMileage = lastMileage ? parseInt(lastMileage) : null;
                item.lastServiceDate = lastDate || null;
            }
        } else {
            vehicle.maintenanceSchedule.push({
                id: generateId(),
                name,
                intervalMiles: intervalMiles ? parseInt(intervalMiles) : null,
                intervalMonths: intervalMonths ? parseInt(intervalMonths) : null,
                lastServiceMileage: lastMileage ? parseInt(lastMileage) : null,
                lastServiceDate: lastDate || null
            });
        }

        saveData();
        closeMaintenanceModal();
        renderMaintenanceSchedule();
        renderUpcomingMaintenance();
        populateServiceItemDropdown();
    }

    // Service Modal
    function populateServiceItemDropdown() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

        const select = document.getElementById('service-item');
        select.innerHTML = '<option value="">Select or enter custom...</option>';

        if (vehicle.maintenanceSchedule) {
            vehicle.maintenanceSchedule.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                select.appendChild(option);
            });
        }
    }

    function openServiceModal(record = null, linkedMaintenanceId = null) {
        const modal = document.getElementById('service-modal');
        const title = document.getElementById('service-modal-title');
        const vehicle = getCurrentVehicle();

        document.getElementById('service-item-custom').style.display = 'none';

        if (record) {
            title.textContent = 'Edit Service Record';
            document.getElementById('service-item').value = record.linkedMaintenanceId || '';
            document.getElementById('service-item-custom').value = record.linkedMaintenanceId ? '' : record.serviceName;
            document.getElementById('service-item-custom').style.display = record.linkedMaintenanceId ? 'none' : 'block';
            document.getElementById('service-date').value = record.date || '';
            document.getElementById('service-mileage').value = record.mileage || '';
            document.getElementById('service-cost').value = record.cost || '';
            document.getElementById('service-shop').value = record.shop || 'diy';
            document.getElementById('service-parts').value = record.parts || '';
            document.getElementById('service-notes').value = record.notes || '';
            document.getElementById('service-edit-id').value = record.id;
            document.getElementById('service-linked-maintenance-id').value = record.linkedMaintenanceId || '';
        } else {
            title.textContent = 'Log Service';
            document.getElementById('service-item').value = linkedMaintenanceId || '';
            document.getElementById('service-item-custom').value = '';
            document.getElementById('service-date').value = new Date().toISOString().split('T')[0];
            document.getElementById('service-mileage').value = vehicle.currentMileage || '';
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

    function saveServiceRecord() {
        const vehicle = getCurrentVehicle();
        if (!vehicle) return;

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
        let linkedMaintenanceId = null;

        if (itemSelect) {
            linkedMaintenanceId = itemSelect;
            const maintenanceItem = vehicle.maintenanceSchedule.find(i => i.id === itemSelect);
            serviceName = maintenanceItem ? maintenanceItem.name : 'Unknown';
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

        if (!vehicle.serviceHistory) {
            vehicle.serviceHistory = [];
        }

        const recordData = {
            serviceName,
            linkedMaintenanceId,
            date,
            mileage: mileage ? parseInt(mileage) : null,
            cost: cost ? parseFloat(cost) : null,
            shop,
            parts,
            notes
        };

        if (editId) {
            const record = vehicle.serviceHistory.find(r => r.id === editId);
            if (record) {
                Object.assign(record, recordData);
            }
        } else {
            vehicle.serviceHistory.push({
                id: generateId(),
                ...recordData
            });
        }

        // Update maintenance schedule if linked
        if (linkedMaintenanceId) {
            const maintenanceItem = vehicle.maintenanceSchedule.find(i => i.id === linkedMaintenanceId);
            if (maintenanceItem) {
                maintenanceItem.lastServiceDate = date;
                if (mileage) {
                    maintenanceItem.lastServiceMileage = parseInt(mileage);
                }
            }
        }

        // Update vehicle mileage if higher
        if (mileage && parseInt(mileage) > (vehicle.currentMileage || 0)) {
            vehicle.currentMileage = parseInt(mileage);
            document.getElementById('current-mileage-display').textContent = vehicle.currentMileage.toLocaleString();
        }

        saveData();
        closeServiceModal();
        renderServiceHistory();
        renderMaintenanceSchedule();
        renderUpcomingMaintenance();
    }

    // Export/Import
    function exportJSON() {
        const data = {
            version: 1,
            exportDate: new Date().toISOString(),
            garage: garage
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zrg-maintenance-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function exportCSV() {
        let csv = 'Vehicle,Platform,Year,Service,Date,Mileage,Cost,Shop,Parts,Notes\n';

        garage.forEach(vehicle => {
            if (vehicle.serviceHistory) {
                vehicle.serviceHistory.forEach(record => {
                    csv += [
                        `"${vehicle.name}"`,
                        `"${PLATFORM_NAMES[vehicle.platform] || vehicle.platform}"`,
                        vehicle.year || '',
                        `"${record.serviceName}"`,
                        record.date || '',
                        record.mileage || '',
                        record.cost || '',
                        record.shop || '',
                        `"${(record.parts || '').replace(/"/g, '""')}"`,
                        `"${(record.notes || '').replace(/"/g, '""')}"`
                    ].join(',') + '\n';
                });
            }
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `zrg-service-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    function importJSON(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                if (!data.garage || !Array.isArray(data.garage)) {
                    throw new Error('Invalid backup file');
                }

                if (!confirm(`This will replace your current garage with ${data.garage.length} vehicle(s). Continue?`)) {
                    return;
                }

                garage = data.garage;
                saveData();
                showGarageView();
                alert('Backup restored successfully!');
            } catch (err) {
                alert('Error importing backup: ' + err.message);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    function printRecords() {
        window.print();
    }

    // Helper: Format date
    function formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
