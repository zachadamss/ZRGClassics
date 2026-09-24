// Loaded synchronously in <head> (base.njk) so it runs before first paint: swap no-js for js, and apply the saved or
// system theme so dark-mode visitors don't get a white flash.
(function () {
    var root = document.documentElement;
    root.classList.remove('no-js');
    root.classList.add('js');
    var theme = null;
    try { theme = localStorage.getItem('theme'); } catch (e) {}
    if (!theme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark';
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
})();
