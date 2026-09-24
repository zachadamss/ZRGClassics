// Remembers the last car page a visitor read (in this browser only), so the
// homepage can offer "pick up where you left off". Reads data-car-* from the
// element marked data-car-memory on car pages and buyer's guides.
(function () {
  var el = document.querySelector('[data-car-memory]');
  if (!el) return;
  try {
    localStorage.setItem('zrg:lastCar', JSON.stringify({
      key: el.dataset.carKey,
      name: el.dataset.carName,
      url: el.dataset.carUrl,
      at: Date.now()
    }));
  } catch (e) { /* storage blocked: nothing to remember */ }
})();
