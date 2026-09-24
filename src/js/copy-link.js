// "Copy link" buttons on issue cards: copies the page URL plus the issue's
// anchor so a specific fix can be shared in a forum or text.
document.addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-copy-link]');
  if (!btn) return;
  const url = `${location.origin}${location.pathname}${btn.dataset.copyLink}`;
  const label = btn.querySelector('.copy-link-label');
  let copied = false;
  try {
    await navigator.clipboard.writeText(url);
    copied = true;
  } catch (err) {
    history.replaceState(null, '', btn.dataset.copyLink);
  }
  if (label) {
    label.textContent = copied ? 'Copied' : 'Link in address bar';
    btn.classList.add('is-copied');
    clearTimeout(btn._reset);
    btn._reset = setTimeout(() => { label.textContent = 'Copy link'; btn.classList.remove('is-copied'); }, 2000);
  }
});
