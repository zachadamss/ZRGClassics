// forum-index: page script for forum/index.njk (moved out of the template so the site can use a strict Content-Security-Policy)
document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('forum-categories');
  const newThreadBtn = document.getElementById('new-thread-btn');
  const searchInput = document.getElementById('forum-search');

  // Check if user is logged in for new thread button
  const user = await Auth.getUser();
  if (!user) {
    newThreadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = '/account/login/?return=/forum/new/';
    });
  }

  try {
    const grouped = await Forum.getCategoriesGrouped();

    let html = '';

    // General Discussion
    if (grouped.general.length > 0) {
      html += `
        <div class="category-group">
          <h2 class="category-group-title">General</h2>
          <div class="category-list">
            ${grouped.general.map(cat => renderCategory(cat)).join('')}
          </div>
        </div>
      `;
    }

    // BMW Forums
    if (grouped.bmw.length > 0) {
      html += `
        <div class="category-group">
          <h2 class="category-group-title">BMW Forums</h2>
          <div class="category-list">
            ${grouped.bmw.map(cat => renderCategory(cat)).join('')}
          </div>
        </div>
      `;
    }

    // Porsche Forums
    if (grouped.porsche.length > 0) {
      html += `
        <div class="category-group">
          <h2 class="category-group-title">Porsche Forums</h2>
          <div class="category-list">
            ${grouped.porsche.map(cat => renderCategory(cat)).join('')}
          </div>
        </div>
      `;
    }

    container.innerHTML = html;
  } catch (error) {
    console.error('Error loading categories:', error);
    container.innerHTML = `<p class="error">The forum didn't load. Refresh the page, and if it keeps happening, <a href="/about/#contact">let me know</a>.</p>`;
  }

  // Search functionality
  let searchTimeout;
  searchInput.addEventListener('input', () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
      const query = searchInput.value.trim();
      if (query.length >= 2) {
        window.location.href = `/forum/search/?q=${encodeURIComponent(query)}`;
      }
    }, 500);
  });

  function renderCategory(cat) {
    // Use query param locally, clean URL on Vercel
    const isLocal = window.location.hostname === 'localhost';
    const categoryUrl = isLocal ? `/forum/category/?slug=${encodeURIComponent(cat.slug)}` : `/forum/${encodeURIComponent(cat.slug)}/`;
    return `
      <a href="${categoryUrl}" class="category-card">
        <div class="category-info">
          <h3 class="category-name">${Forum.sanitizeHtml(cat.name)}</h3>
          <p class="category-description">${Forum.sanitizeHtml(cat.description)}</p>
        </div>
        <div class="category-stats">
          ${cat.thread_count
            ? `<span class="stat">${cat.thread_count} ${cat.thread_count === 1 ? 'thread' : 'threads'}</span>
               <span class="stat">${cat.post_count || 0} ${cat.post_count === 1 ? 'post' : 'posts'}</span>`
            : '<span class="stat stat-empty">Start the first thread</span>'}
        </div>
      </a>
    `;
  }
});
