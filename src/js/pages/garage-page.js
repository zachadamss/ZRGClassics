// garage-page: page script for account/garage.njk (moved out of the template so the site can use a strict Content-Security-Policy)
(function() {
  'use strict';

  let currentUser = null;
  let currentProfile = null;
  let vehicles = [];
  let selectedVehicleId = null;
  let restorationData = {};
  let maintenanceSchedule = [];
  let serviceHistory = [];

  // Initialize
  async function init() {
    currentUser = await AuthUI.requireAuth();
    if (!currentUser) return;

    currentProfile = await Auth.getProfile(currentUser.id);
    document.getElementById('user-display-name').textContent =
      currentProfile?.display_name || currentProfile?.username || 'Member';

    await loadVehicles();
    bindEvents();
    handleDeepLinks();
    await loadRecentThreads();
  }

  // ?vehicle=<id> opens that car; ?add=<platform> opens the add form with the
  // platform picked (vehicle pages link here with "Add to My Garage").
  function handleDeepLinks() {
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get('vehicle');
    const addPlatform = params.get('add');

    if (vehicleId) {
      const match = vehicles.find(v => String(v.id) === String(vehicleId));
      if (match) selectVehicle(match.id);
    } else if (addPlatform && Garage.PLATFORMS[addPlatform]) {
      openVehicleModal();
      const select = document.getElementById('vehicle-platform');
      select.value = addPlatform;
      select.dispatchEvent(new Event('change'));
    }
  }

  // Load vehicles
  async function loadVehicles() {
    try {
      vehicles = await Garage.getVehicles();
      renderVehicleGrid();
      document.getElementById('vehicle-count').textContent = vehicles.length;
    } catch (error) {
      console.error('Error loading vehicles:', error);
    }
  }

  // Render vehicle grid
  function renderVehicleGrid() {
    const grid = document.getElementById('vehicle-grid');
    const emptyState = document.getElementById('empty-vehicles');

    // Clear existing cards
    grid.querySelectorAll('.vehicle-card').forEach(card => card.remove());

    if (vehicles.length === 0) {
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    vehicles.forEach(vehicle => {
      const card = createVehicleCard(vehicle);
      grid.appendChild(card);
    });
  }

  // Create vehicle card
  function createVehicleCard(vehicle) {
    const card = document.createElement('div');
    card.className = 'vehicle-card' + (vehicle.id === selectedVehicleId ? ' selected' : '');
    card.dataset.id = vehicle.id;

    const displayInfo = Garage.getVehicleDisplayInfo(vehicle);

    // No photo: show the chassis code (E30, 944), or the make's initial for other cars
    const placeholderLetter = displayInfo.isCustom
      ? (vehicle.make || 'C').charAt(0).toUpperCase()
      : String(vehicle.platform).toUpperCase();

    card.innerHTML = `
      <div class="vehicle-card-image">
        ${Forum.safeUrl(vehicle.photo_url)
          ? `<img src="${Forum.safeUrl(vehicle.photo_url)}" alt="${escapeHtml(displayInfo.name)}">`
          : `<div class="vehicle-card-placeholder">${escapeHtml(placeholderLetter)}</div>`
        }
      </div>
      <div class="vehicle-card-content">
        <h3>${escapeHtml(displayInfo.name)}</h3>
        <span class="platform-badge${displayInfo.isCustom ? ' custom' : ''}">${escapeHtml(displayInfo.badge)}</span>
        ${vehicle.mileage ? `<p class="vehicle-mileage">${vehicle.mileage.toLocaleString()} miles</p>` : ''}
      </div>
    `;

    card.addEventListener('click', () => selectVehicle(vehicle.id));
    return card;
  }

  // Select vehicle
  async function selectVehicle(vehicleId) {
    selectedVehicleId = vehicleId;

    // Update card selection
    document.querySelectorAll('.vehicle-card').forEach(card => {
      card.classList.toggle('selected', card.dataset.id == vehicleId);
    });

    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return;

    // Show detail section
    document.getElementById('vehicle-detail').style.display = 'block';

    // Update header using display info helper
    const displayInfo = Garage.getVehicleDisplayInfo(vehicle);
    document.getElementById('detail-vehicle-title').textContent = displayInfo.name;
    const platformBadge = document.getElementById('detail-platform-badge');
    platformBadge.textContent = displayInfo.badge;
    platformBadge.classList.toggle('custom', displayInfo.isCustom);

    // Update stats
    document.getElementById('detail-mileage').textContent =
      vehicle.mileage ? vehicle.mileage.toLocaleString() + ' mi' : '-';
    document.getElementById('detail-year').textContent = vehicle.year || '-';
    document.getElementById('detail-color').textContent = vehicle.color || '-';

    // Update details tab
    document.getElementById('detail-vin').textContent = vehicle.vin || '-';
    document.getElementById('detail-purchase-date').textContent =
      vehicle.purchase_date ? Garage.formatDate(vehicle.purchase_date) : '-';
    document.getElementById('detail-purchase-price').textContent =
      vehicle.purchase_price ? '$' + parseFloat(vehicle.purchase_price).toLocaleString() : '-';
    document.getElementById('detail-notes').textContent = vehicle.notes || '-';

    // Load restoration, maintenance, and service data
    await Promise.all([
      loadRestorationData(vehicleId),
      loadMaintenanceData(vehicleId),
      loadServiceHistory(vehicleId)
    ]);

    // Scroll to detail
    document.getElementById('vehicle-detail').scrollIntoView({ behavior: 'smooth' });
  }

  // Load restoration data
  async function loadRestorationData(vehicleId) {
    try {
      restorationData = await Garage.getRestorationItems(vehicleId);
      updateRestorationSummary();

      // Update link to full checklist
      const checklistLink = document.getElementById('open-restoration-checklist');
      if (checklistLink) {
        checklistLink.href = `/account/garage/restoration/?vehicle=${vehicleId}`;
      }
    } catch (error) {
      console.error('Error loading restoration data:', error);
    }
  }

  // Update restoration summary display. Progress counts against the car's
  // full checklist (RestorationChecklist), the same way the tracker does.
  function updateRestorationSummary() {
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    const items = RestorationChecklist.withSaved(vehicle ? vehicle.platform : null, restorationData);
    const summary = RestorationChecklist.summarize(items);

    document.getElementById('restoration-progress-fill').style.width = summary.percent + '%';
    document.getElementById('restoration-progress-text').textContent = summary.percent + '% complete';
    document.getElementById('restoration-completed').textContent = summary.completed;
    document.getElementById('restoration-in-progress').textContent = summary.inProgress;
    document.getElementById('restoration-remaining').textContent = summary.remaining;
    document.getElementById('restoration-estimated').textContent = '$' + Math.round(summary.estimated).toLocaleString();
    document.getElementById('restoration-actual').textContent = '$' + Math.round(summary.actual).toLocaleString();
    document.getElementById('detail-restoration-progress').textContent = summary.percent + '%';

    renderCategorySummary(summary);
  }

  // Category bars for the systems the owner has started on
  function renderCategorySummary(summary) {
    const container = document.getElementById('restoration-category-summary');
    if (!container) return;

    const touched = new Set(Object.values(restorationData).map(item => item.category).filter(Boolean));
    Object.keys(restorationData).forEach(id => touched.add(id.split('-')[0]));
    const rows = Object.entries(summary.byCategory).filter(([key, cat]) => touched.has(key) && cat.total > 0);

    if (rows.length === 0) {
      container.innerHTML = '<p class="empty-state">Nothing tracked yet. Open the full checklist to get started.</p>';
      return;
    }

    container.innerHTML = '<h3>Progress by system</h3><div class="category-progress-list">' + rows.map(([, cat]) => {
      const percent = Math.round((cat.completed / cat.total) * 100);
      return `
        <div class="category-progress-item">
          <div class="category-progress-header">
            <span class="category-name">${escapeHtml(cat.name)}</span>
            <span class="category-count">${cat.completed}/${cat.total}</span>
          </div>
          <div class="progress-bar small">
            <div class="progress-fill" style="width: ${percent}%"></div>
          </div>
        </div>`;
    }).join('') + '</div>';
  }

  // Load maintenance data for summary display
  async function loadMaintenanceData(vehicleId) {
    try {
      maintenanceSchedule = await Garage.getMaintenanceSchedule(vehicleId);
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);

      // Calculate status counts using Garage helper
      const upcoming = Garage.getUpcomingMaintenance(maintenanceSchedule, vehicle?.mileage);

      let overdueCount = 0;
      let dueSoonCount = 0;
      let okCount = 0;

      upcoming.forEach(item => {
        if (item.status === 'overdue') overdueCount++;
        else if (item.status === 'due-soon') dueSoonCount++;
        else okCount++;
      });

      // Update status cards
      document.getElementById('maint-overdue-count').textContent = overdueCount;
      document.getElementById('maint-due-soon-count').textContent = dueSoonCount;
      document.getElementById('maint-ok-count').textContent = okCount;

      // Update link to full tracker
      const trackerLink = document.getElementById('open-maintenance-tracker');
      if (trackerLink) {
        trackerLink.href = `/account/garage/maintenance/?vehicle=${vehicleId}`;
      }
    } catch (error) {
      console.error('Error loading maintenance data:', error);
    }
  }

  // Load service history for summary display
  async function loadServiceHistory(vehicleId) {
    try {
      serviceHistory = await Garage.getServiceHistory(vehicleId);
      renderRecentServices();
    } catch (error) {
      console.error('Error loading service history:', error);
    }
  }

  // Render recent services (summary view)
  function renderRecentServices() {
    const container = document.getElementById('recent-services-list');

    if (serviceHistory.length === 0) {
      container.innerHTML = '<p class="empty-state">No service records yet</p>';
      return;
    }

    // Show last 5 services
    const recentServices = serviceHistory.slice(0, 5);

    container.innerHTML = recentServices.map(record => `
      <div class="recent-service-item">
        <div class="recent-service-info">
          <span class="recent-service-name">${escapeHtml(record.serviceName)}</span>
          <span class="recent-service-date">${Garage.formatDate(record.serviceDate)}</span>
        </div>
        ${record.mileage ? `<span class="recent-service-mileage">${record.mileage.toLocaleString()} mi</span>` : ''}
      </div>
    `).join('');
  }

  // Load recent threads
  async function loadRecentThreads() {
    try {
      const isLocal = window.location.hostname === 'localhost';
      const { data: threads, error } = await db
        .from('forum_threads')
        .select(`
          id,
          title,
          slug,
          created_at,
          reply_count,
          category:forum_categories(slug, name)
        `)
        .eq('author_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const container = document.getElementById('recent-threads');

      if (error) throw error;

      if (!threads || threads.length === 0) {
        container.innerHTML = '<p class="empty-state">You haven\'t started any threads yet. <a href="/forum/new/">Start your first discussion</a></p>';
      } else {
        container.innerHTML = threads.map(thread => {
          const threadUrl = isLocal
            ? `/forum/thread/?slug=${thread.category.slug}&id=${thread.id}`
            : `/forum/${thread.category.slug}/${thread.id}/`;
          return `
            <div class="recent-thread">
              <a href="${threadUrl}" class="recent-thread-title">${escapeHtml(thread.title)}</a>
              <div class="recent-thread-meta">
                <span>${escapeHtml(thread.category.name)}</span>
                <span>${thread.reply_count} replies</span>
                <span>${Forum.timeAgo(thread.created_at)}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    } catch (error) {
      console.error('Error loading threads:', error);
      document.getElementById('recent-threads').innerHTML = '<p class="empty-state">Unable to load recent threads</p>';
    }
  }

  // Bind events
  function bindEvents() {
    // Add vehicle button
    document.getElementById('add-vehicle-btn').addEventListener('click', () => openVehicleModal());

    // Platform change - show/hide custom fields
    document.getElementById('vehicle-platform').addEventListener('change', handlePlatformChange);

    // Vehicle modal
    document.getElementById('close-vehicle-modal').addEventListener('click', closeVehicleModal);
    document.getElementById('cancel-vehicle-modal').addEventListener('click', closeVehicleModal);
    document.getElementById('save-vehicle-btn').addEventListener('click', saveVehicle);
    document.getElementById('vehicle-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) closeVehicleModal();
    });

    // Edit/Delete vehicle
    document.getElementById('edit-vehicle-btn').addEventListener('click', () => {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) openVehicleModal(vehicle);
    });
    document.getElementById('delete-vehicle-btn').addEventListener('click', deleteSelectedVehicle);

    // Update mileage
    document.getElementById('update-mileage-btn').addEventListener('click', updateMileage);

    // Profile modal
    document.getElementById('edit-profile-btn').addEventListener('click', openProfileModal);
    document.getElementById('close-profile-modal').addEventListener('click', closeProfileModal);
    document.getElementById('cancel-profile-modal').addEventListener('click', closeProfileModal);
    document.getElementById('save-profile-btn').addEventListener('click', saveProfile);
    document.getElementById('profile-modal').addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) closeProfileModal();
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
      });
    });

    // Restoration and maintenance links are set dynamically when vehicle is selected
  }

  // Handle platform dropdown change
  function handlePlatformChange() {
    const platform = document.getElementById('vehicle-platform').value;
    const customFields = document.getElementById('custom-vehicle-fields');
    const platformYearInfo = document.getElementById('platform-year-info');
    const platformYearsHint = document.getElementById('platform-years-hint');

    if (platform === 'custom') {
      customFields.style.display = 'flex';
      platformYearInfo.style.display = 'none';
    } else if (platform && Garage.PLATFORMS[platform]) {
      customFields.style.display = 'none';
      platformYearInfo.style.display = 'block';
      platformYearsHint.textContent = `Production: ${Garage.PLATFORMS[platform].years}`;
      document.getElementById('vehicle-make').value = '';
      document.getElementById('vehicle-model').value = '';
    } else {
      customFields.style.display = 'none';
      platformYearInfo.style.display = 'none';
      document.getElementById('vehicle-make').value = '';
      document.getElementById('vehicle-model').value = '';
    }
  }

  // Vehicle Modal Functions
  function openVehicleModal(vehicle = null) {
    const modal = document.getElementById('vehicle-modal');
    const title = document.getElementById('vehicle-modal-title');
    const customFields = document.getElementById('custom-vehicle-fields');
    const platformYearInfo = document.getElementById('platform-year-info');

    if (vehicle) {
      title.textContent = 'Edit Vehicle';
      document.getElementById('vehicle-nickname').value = vehicle.nickname || '';

      // Determine if this is a custom vehicle (has make/model but no platform, or platform not in our list)
      const isCustom = !vehicle.platform || !Garage.PLATFORMS[vehicle.platform];

      if (isCustom) {
        document.getElementById('vehicle-platform').value = 'custom';
        document.getElementById('vehicle-make').value = vehicle.make || '';
        document.getElementById('vehicle-model').value = vehicle.model || '';
        customFields.style.display = 'flex';
        platformYearInfo.style.display = 'none';
      } else {
        document.getElementById('vehicle-platform').value = vehicle.platform;
        document.getElementById('vehicle-make').value = '';
        document.getElementById('vehicle-model').value = '';
        customFields.style.display = 'none';
        platformYearInfo.style.display = 'block';
        document.getElementById('platform-years-hint').textContent = `Production: ${Garage.PLATFORMS[vehicle.platform].years}`;
      }

      document.getElementById('vehicle-year').value = vehicle.year || '';
      document.getElementById('vehicle-color').value = vehicle.color || '';
      document.getElementById('vehicle-mileage').value = vehicle.mileage || '';
      document.getElementById('vehicle-vin').value = vehicle.vin || '';
      document.getElementById('vehicle-purchase-date').value = vehicle.purchase_date || '';
      document.getElementById('vehicle-purchase-price').value = vehicle.purchase_price || '';
      document.getElementById('vehicle-notes').value = vehicle.notes || '';
      document.getElementById('vehicle-edit-id').value = vehicle.id;
    } else {
      title.textContent = 'Add Vehicle';
      document.getElementById('vehicle-nickname').value = '';
      document.getElementById('vehicle-platform').value = '';
      document.getElementById('vehicle-make').value = '';
      document.getElementById('vehicle-model').value = '';
      document.getElementById('vehicle-year').value = '';
      document.getElementById('vehicle-color').value = '';
      document.getElementById('vehicle-mileage').value = '';
      document.getElementById('vehicle-vin').value = '';
      document.getElementById('vehicle-purchase-date').value = '';
      document.getElementById('vehicle-purchase-price').value = '';
      document.getElementById('vehicle-notes').value = '';
      document.getElementById('vehicle-edit-id').value = '';
      customFields.style.display = 'none';
      platformYearInfo.style.display = 'none';
    }

    modal.classList.add('active');
  }

  function closeVehicleModal() {
    document.getElementById('vehicle-modal').classList.remove('active');
  }

  async function saveVehicle() {
    const platformSelect = document.getElementById('vehicle-platform').value;
    const isCustom = platformSelect === 'custom';
    const make = document.getElementById('vehicle-make').value.trim();
    const model = document.getElementById('vehicle-model').value.trim();

    // Validation
    if (!platformSelect) {
      alert('Please select a platform or choose "Custom Vehicle"');
      return;
    }

    if (isCustom && (!make || !model)) {
      alert('Please enter both make and model for custom vehicles');
      return;
    }

    const vehicleData = {
      platform: isCustom ? null : platformSelect,
      make: isCustom ? make : null,
      model: isCustom ? model : null,
      nickname: document.getElementById('vehicle-nickname').value.trim() || null,
      year: document.getElementById('vehicle-year').value ? parseInt(document.getElementById('vehicle-year').value) : null,
      color: document.getElementById('vehicle-color').value.trim() || null,
      mileage: document.getElementById('vehicle-mileage').value ? parseInt(document.getElementById('vehicle-mileage').value) : null,
      vin: document.getElementById('vehicle-vin').value.trim() || null,
      purchaseDate: document.getElementById('vehicle-purchase-date').value || null,
      purchasePrice: document.getElementById('vehicle-purchase-price').value ? parseFloat(document.getElementById('vehicle-purchase-price').value) : null,
      notes: document.getElementById('vehicle-notes').value.trim() || null
    };

    const editId = document.getElementById('vehicle-edit-id').value;

    try {
      const saveBtn = document.getElementById('save-vehicle-btn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      if (editId) {
        await Garage.updateVehicle(editId, vehicleData);
      } else {
        const newVehicle = await Garage.addVehicle(vehicleData);
        // Initialize maintenance schedule with platform defaults (or generic for custom)
        await Garage.initializeMaintenanceSchedule(newVehicle.id, vehicleData.platform);
      }

      closeVehicleModal();
      await loadVehicles();

      if (editId) {
        await selectVehicle(parseInt(editId));
      }

      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Vehicle';
    } catch (error) {
      alert('Error saving vehicle: ' + error.message);
      document.getElementById('save-vehicle-btn').disabled = false;
      document.getElementById('save-vehicle-btn').textContent = 'Save Vehicle';
    }
  }

  async function deleteSelectedVehicle() {
    const vehicle = vehicles.find(v => v.id === selectedVehicleId);
    if (!vehicle) return;

    if (!confirm(`Delete "${vehicle.nickname || 'this vehicle'}"? All restoration progress and service history will be lost.`)) {
      return;
    }

    try {
      await Garage.deleteVehicle(selectedVehicleId);
      selectedVehicleId = null;
      document.getElementById('vehicle-detail').style.display = 'none';
      await loadVehicles();
    } catch (error) {
      alert('Error deleting vehicle: ' + error.message);
    }
  }

  async function updateMileage() {
    const input = document.getElementById('update-mileage-input');
    const newMileage = parseInt(input.value);
    if (!newMileage || newMileage < 0) {
      alert('Please enter a valid mileage');
      return;
    }

    try {
      await Garage.updateVehicle(selectedVehicleId, { mileage: newMileage });
      const vehicle = vehicles.find(v => v.id === selectedVehicleId);
      if (vehicle) vehicle.mileage = newMileage;
      document.getElementById('detail-mileage').textContent = newMileage.toLocaleString() + ' mi';
      input.value = '';
      renderVehicleGrid();
      renderUpcomingMaintenance();
    } catch (error) {
      alert('Error updating mileage: ' + error.message);
    }
  }

  // Profile Modal Functions
  function openProfileModal() {
    document.getElementById('profile-display-name').value = currentProfile?.display_name || '';
    document.getElementById('profile-location').value = currentProfile?.location || '';
    document.getElementById('profile-bio').value = currentProfile?.bio || '';
    document.getElementById('profile-modal').classList.add('active');
  }

  function closeProfileModal() {
    document.getElementById('profile-modal').classList.remove('active');
  }

  async function saveProfile() {
    try {
      const saveBtn = document.getElementById('save-profile-btn');
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      currentProfile = await Auth.updateProfile(currentUser.id, {
        display_name: document.getElementById('profile-display-name').value.trim() || null,
        location: document.getElementById('profile-location').value.trim() || null,
        bio: document.getElementById('profile-bio').value.trim() || null
      });

      document.getElementById('user-display-name').textContent =
        currentProfile?.display_name || currentProfile?.username || 'Member';

      closeProfileModal();
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Profile';
    } catch (error) {
      alert('Error saving profile: ' + error.message);
      document.getElementById('save-profile-btn').disabled = false;
      document.getElementById('save-profile-btn').textContent = 'Save Profile';
    }
  }

  // Helper: Escape HTML
  function escapeHtml(text) {
    return Forum.sanitizeHtml(text);
  }

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
