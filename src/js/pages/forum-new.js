// forum-new: page script for forum/new.njk (moved out of the template so the site can use a strict Content-Security-Policy)
document.addEventListener('DOMContentLoaded', async () => {
  // Require authentication
  const user = await AuthUI.requireAuth();
  if (!user) return;

  const form = document.getElementById('new-thread-form');
  const categorySelect = document.getElementById('category');

  // Load categories
  try {
    const categories = await Forum.getCategories();
    categorySelect.innerHTML = '<option value="">Select a category...</option>' +
      categories.map(cat => `<option value="${Forum.sanitizeHtml(cat.id)}">${Forum.sanitizeHtml(cat.name)}</option>`).join('');

    // Pre-select category from URL if provided
    const urlParams = new URLSearchParams(window.location.search);
    const preselect = urlParams.get('category');
    if (preselect) {
      const cat = categories.find(c => c.slug === preselect);
      if (cat) categorySelect.value = cat.id;
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting...';

    const categoryId = parseInt(categorySelect.value);
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();

    try {
      const thread = await Forum.createThread(categoryId, title, content);

      // Get category slug for redirect
      const { data: category } = await db
        .from('forum_categories')
        .select('slug')
        .eq('id', categoryId)
        .single();

      // Use query param locally, clean URL on Vercel
      const isLocal = window.location.hostname === 'localhost';
      const threadUrl = isLocal
        ? `/forum/thread/?slug=${category.slug}&id=${thread.id}`
        : `/forum/${category.slug}/${thread.id}/`;
      window.location.href = threadUrl;
    } catch (error) {
      AuthUI.showError(form, error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post Thread';
    }
  });
});
