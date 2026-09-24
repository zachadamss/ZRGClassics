// forum-search: page script for forum/search.njk (moved out of the template so the site can use a strict Content-Security-Policy)
document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const resultsContainer = document.getElementById('search-results');
  const paginationContainer = document.getElementById('pagination');

  let currentPage = 1;

  // Check for query param
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q');
  if (initialQuery) {
    searchInput.value = initialQuery;
    performSearch(initialQuery);
  }

  searchBtn.addEventListener('click', () => {
    performSearch(searchInput.value.trim());
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      performSearch(searchInput.value.trim());
    }
  });

  async function performSearch(query, page = 1) {
    if (!query || query.length < 2) {
      resultsContainer.innerHTML = '<p class="empty-state">Please enter at least 2 characters</p>';
      return;
    }

    resultsContainer.innerHTML = '<p class="loading">Searching...</p>';
    currentPage = page;

    // Update URL
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('q', query);
    window.history.replaceState({}, '', newUrl);

    try {
      const results = await Forum.searchThreads(query, { page });

      if (!results.threads || results.threads.length === 0) {
        resultsContainer.innerHTML = `<p class="empty-state">No results found for "${Forum.sanitizeHtml(query)}"</p>`;
        paginationContainer.innerHTML = '';
        return;
      }

      resultsContainer.innerHTML = results.threads.map(thread => `
        <div class="thread-item">
          <div class="thread-info">
            <a href="/forum/${encodeURIComponent(thread.category.slug)}/${thread.id}/" class="thread-title">${Forum.sanitizeHtml(thread.title)}</a>
            <div class="thread-meta">
              <span class="thread-category">${Forum.sanitizeHtml(thread.category.name)}</span>
              <span>by ${Forum.sanitizeHtml(thread.author?.username || 'Unknown')}</span>
              <span>${Forum.timeAgo(thread.created_at)}</span>
            </div>
          </div>
          <div class="thread-stats">
            <span>${thread.reply_count || 0} replies</span>
            <span>${thread.view_count || 0} views</span>
          </div>
        </div>
      `).join('');

      // Render pagination
      if (results.totalPages > 1) {
        let paginationHtml = '';
        for (let i = 1; i <= results.totalPages; i++) {
          paginationHtml += `<button class="page-btn ${i === page ? 'active' : ''}" data-page="${i}">${i}</button>`;
        }
        paginationContainer.innerHTML = paginationHtml;

        paginationContainer.querySelectorAll('.page-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            performSearch(query, parseInt(btn.dataset.page));
          });
        });
      } else {
        paginationContainer.innerHTML = '';
      }
    } catch (error) {
      console.error('Search error:', error);
      resultsContainer.innerHTML = '<p class="error">An error occurred while searching. Please try again.</p>';
    }
  }
});
