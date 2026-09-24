// Homepage behavior: the car-aware search form and the brand tabs on phones.

(function () {
  // Search: a car with no query goes straight to that car's page;
  // a car with a query searches within that car.
  const form = document.querySelector('[data-home-search]');
  if (form) {
    form.addEventListener('submit', (e) => {
      const select = form.querySelector('[data-car-select]');
      const query = form.querySelector('input[name="q"]');
      const option = select && select.selectedOptions[0];
      if (option && option.value && !query.value.trim()) {
        e.preventDefault();
        window.location.href = option.dataset.url;
        return;
      }
      // Don't send an empty car parameter
      if (select && !select.value) select.disabled = true;
      setTimeout(() => { if (select) select.disabled = false; }, 0);
    });
  }

  // "Pick up where you left off": the last car page read in this browser
  // (saved by car-memory.js).
  try {
    const last = JSON.parse(localStorage.getItem('zrg:lastCar') || 'null');
    const resume = document.querySelector('[data-resume]');
    const select = document.querySelector('[data-car-select]');
    const option = last && select && [...select.options].find(o => o.value === last.key);
    if (resume && option) {
      const link = resume.querySelector('[data-resume-link]');
      link.href = option.dataset.url;
      link.firstChild.textContent = `${last.name || option.textContent} `;
      resume.hidden = false;
    }
  } catch (e) { /* no storage or bad data: skip */ }

  // Signed-in visitors: one line about their own cars ("The Daily: timing belt
  // is overdue"). The garage scripts load only when a sign-in session exists.
  const garageStatus = document.querySelector('[data-garage-status]');
  const hasSession = (() => {
    try { return Object.keys(localStorage).some(k => /^sb-.+-auth-token$/.test(k)); } catch (e) { return false; }
  })();

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function showGarageStatus() {
    const user = await Auth.getUser();
    if (!user) return;
    if (!window.Garage) {
      await loadScript('/js/platforms.js');
      await loadScript('/js/garage.js');
    }
    const cars = await Garage.getVehicles();
    if (!cars.length) return;

    let worst = null;
    for (const car of cars) {
      const upcoming = Garage.getUpcomingMaintenance(await Garage.getMaintenanceSchedule(car.id), car.mileage);
      const top = upcoming.find(item => item.status !== 'ok');
      if (top && (!worst || (top.status === 'overdue' && worst.item.status !== 'overdue'))) {
        worst = { car, item: top, count: upcoming.filter(i => i.status === top.status).length };
      }
      if (worst && worst.item.status === 'overdue') break;
    }

    const text = garageStatus.querySelector('[data-garage-text]');
    const link = garageStatus.querySelector('[data-garage-link]');
    if (worst) {
      const name = Garage.getVehicleDisplayInfo(worst.car).name;
      const state = worst.item.status === 'overdue' ? 'overdue' : 'due soon';
      text.textContent = worst.count > 1
        ? `${name}: ${worst.count} services ${state}.`
        : `${name}: ${worst.item.name.toLowerCase()} is ${state}.`;
      link.href = `/account/garage/maintenance/?vehicle=${encodeURIComponent(worst.car.id)}`;
      link.firstChild.textContent = 'Open maintenance ';
      garageStatus.classList.toggle('is-overdue', worst.item.status === 'overdue');
    } else {
      text.textContent = cars.length === 1 ? 'Your car is caught up on maintenance.' : `All ${cars.length} of your cars are caught up on maintenance.`;
    }
    garageStatus.hidden = false;
  }

  if (garageStatus && hasSession && window.Auth) {
    showGarageStatus().catch(err => console.warn('Garage status unavailable:', err.message));
  }

  // Brand tabs: shown only on narrow screens, where the two lists stack.
  const tabList = document.querySelector('[data-brand-tabs]');
  if (!tabList) return;
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];
  const panels = [...document.querySelectorAll('[data-brand-panel]')];
  const narrow = window.matchMedia('(max-width: 768px)');

  function select(tab, focus) {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => { p.hidden = narrow.matches && p.id !== tab.getAttribute('aria-controls'); });
    if (focus) tab.focus();
  }

  function sync() {
    tabList.hidden = !narrow.matches;
    panels.forEach(p => {
      if (narrow.matches) p.setAttribute('role', 'tabpanel');
      else p.removeAttribute('role');
    });
    select(tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0], false);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab, false));
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      select(next, true);
    });
  });

  narrow.addEventListener('change', sync);
  sync();
})();
