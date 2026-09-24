/**
 * Restoration Tracker (My Garage) - Vehicle-specific restoration tracking
 * Uses Supabase for persistence, requires authentication
 */

// ============================================
// Vehicle-Specific Checklist Data
// ============================================

const { CATEGORIES, buildChecklistItems, withSaved } = window.RestorationChecklist;

// ============================================
// State Management
// ============================================

let currentUser = null;
let currentVehicle = null;
let checklistItems = {};
let savedItems = {};
let isSaving = false;
let pendingSaves = [];

// Helper: Escape HTML to prevent XSS
function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

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
    const container = document.querySelector('.restoration-checklist');
    container.innerHTML = `
        <div class="auth-required">
            <h2>Sign in to open your garage</h2>
            <p>The restoration tracker saves to your account, so your checklist is the same on your phone in the garage and on your laptop later. Accounts are free.</p>
            <div class="auth-actions">
                <a href="/account/login/?return=${encodeURIComponent(location.pathname + location.search)}" class="btn btn-primary">Sign In</a>
                <a href="/account/register/" class="btn btn-secondary">Create an Account</a>
            </div>
        </div>
    `;
}

// ============================================
// Vehicle Loading
// ============================================

// The tracker always works on one garage car, passed as ?vehicle=<id>.
// Picking a car happens in My Garage, so anything else goes back there.
async function loadVehicleFromUrl() {
    const vehicleId = new URLSearchParams(window.location.search).get('vehicle');
    if (!vehicleId) {
        window.location.replace('/account/garage/');
        return null;
    }
    try {
        return await Garage.getVehicle(vehicleId);
    } catch (error) {
        console.error('Failed to load vehicle:', error);
        return null;
    }
}

function showVehicleNotFound() {
    const loading = document.getElementById('tool-loading');
    if (!loading) return;
    loading.innerHTML = `
        <p>I couldn't find that car in your garage.</p>
        <a href="/account/garage/" class="btn btn-primary">Back to My Garage</a>
    `;
}

// ============================================
// Checklist Building
// ============================================


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

        // Rebuild with saved progress, including the owner's custom items
        checklistItems = withSaved(currentVehicle.platform, savedItems);
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

async function startProject(vehicle) {
    const displayInfo = Garage.getVehicleDisplayInfo(vehicle);
    currentVehicle = {
        type: 'garage',
        id: vehicle.id,
        platform: vehicle.platform,
        make: vehicle.make,
        model: vehicle.model,
        name: displayInfo.name,
        isCustom: displayInfo.isCustom
    };

    // Build checklist for the platform (or generic for custom vehicles)
    checklistItems = buildChecklistItems(currentVehicle.platform);

    // Load any saved progress
    await loadSavedProgress();

    // Show the project UI
    showProjectUI();
}

function showProjectUI() {
    document.getElementById('tool-loading')?.remove();
    document.getElementById('progress-summary').style.display = 'block';
    document.getElementById('checklist-categories').style.display = 'block';
    document.getElementById('export-section').style.display = 'block';

    // Update vehicle name display
    const vehicleNameEl = document.getElementById('current-vehicle-name');
    if (vehicleNameEl && currentVehicle) {
        vehicleNameEl.textContent = `${currentVehicle.name} Restoration`;
    }
    const crumb = document.getElementById('crumb-vehicle-name');
    if (crumb && currentVehicle) {
        crumb.textContent = `${currentVehicle.name} · Restoration`;
        document.title = `${currentVehicle.name} Restoration - ZRG Classics`;
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

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.dataset.filter);
        });
    });

    // Export buttons
    document.getElementById('export-json')?.addEventListener('click', exportToJSON);
    document.getElementById('export-csv')?.addEventListener('click', exportToCSV);

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

    const vehicle = await loadVehicleFromUrl();
    if (vehicle) {
        await startProject(vehicle);
    } else {
        showVehicleNotFound();
    }
});
