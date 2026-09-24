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
