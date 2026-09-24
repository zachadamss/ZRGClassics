// Thread page (forum/thread.njk): the thread, its replies, the reply form,
// and author/moderator actions. Buttons carry data-action attributes and are
// handled by one delegated listener (no inline handlers, for the CSP).
document.addEventListener('DOMContentLoaded', async () => {
  const threadContainer = document.getElementById('thread-content');
  const repliesSection = document.getElementById('replies-section');
  const repliesList = document.getElementById('replies-list');
  const replyPagination = document.getElementById('replies-pagination');
  const replyFormSection = document.getElementById('reply-form-section');
  const loginPrompt = document.getElementById('login-prompt');
  const lockedNotice = document.getElementById('locked-notice');
  const replyForm = document.getElementById('reply-form');

  // Thread ID from the URL: /forum/e30/123/ or /forum/thread/?slug=e30&id=123
  const urlParams = new URLSearchParams(window.location.search);
  let threadId = parseInt(urlParams.get('id'), 10);
  if (!threadId) {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    threadId = parseInt(pathParts[2], 10);
  }

  if (!threadId) {
    threadContainer.innerHTML = '<p class="error">Thread not found.</p>';
    return;
  }

  const user = await Auth.getUser();
  const profile = user ? await Auth.getProfile(user.id) : null;
  const isModerator = Boolean(profile && profile.is_moderator);
  let thread = null;
  let currentPage = 1;
  const repliesById = new Map();

  const esc = (text) => Forum.sanitizeHtml(text);

  function avatar(author) {
    const url = Forum.safeUrl(author?.avatar_url);
    return url
      ? `<img src="${url}" alt="">`
      : `<span>${esc((author?.username || '?').substring(0, 2).toUpperCase())}</span>`;
  }

  function authorBlock(author, withJoinDate) {
    return `
      <aside class="post-author">
        <div class="author-avatar">${avatar(author)}</div>
        <div class="author-name">${esc(author?.username || 'Unknown')}</div>
        <div class="author-stats">
          <span>${author?.post_count || 0} posts</span>
          ${withJoinDate && author?.created_at ? `<span>Member since ${Forum.formatDate(author.created_at)}</span>` : ''}
        </div>
      </aside>`;
  }

  function threadActions() {
    const isAuthor = user && thread.author?.id === user.id;
    const buttons = [];
    if (isModerator) {
      buttons.push(`<button type="button" class="btn-mod" data-action="${thread.is_pinned ? 'unpin' : 'pin'}">${thread.is_pinned ? 'Unpin' : 'Pin'}</button>`);
      buttons.push(`<button type="button" class="btn-mod" data-action="${thread.is_locked ? 'unlock' : 'lock'}">${thread.is_locked ? 'Unlock' : 'Lock'}</button>`);
    }
    if (isAuthor || isModerator) {
      buttons.push('<button type="button" class="btn-delete" data-action="delete-thread">Delete thread</button>');
    }
    return buttons.length ? `<div class="post-actions">${buttons.join('')}</div>` : '';
  }

  function renderThread() {
    const badges = [
      thread.is_pinned ? '<span class="thread-badge thread-badge--pinned">Pinned</span>' : '',
      thread.is_locked ? '<span class="thread-badge thread-badge--locked">Locked</span>' : ''
    ].join('');

    threadContainer.innerHTML = `
      <div class="thread-header">
        ${badges ? `<p class="thread-badges">${badges}</p>` : ''}
        <h1 class="thread-title">${esc(thread.title)}</h1>
        <div class="thread-meta">
          <span>Posted by <strong>${esc(thread.author?.username || 'Unknown')}</strong></span>
          <span>${Forum.formatDate(thread.created_at)}</span>
          <span>${thread.view_count || 0} views</span>
        </div>
      </div>
      <div class="post-card original-post">
        ${authorBlock(thread.author, true)}
        <div class="post-body">
          <div class="post-content">${Forum.nl2br(thread.content)}</div>
          ${threadActions()}
        </div>
      </div>
    `;
  }

  function renderReply(reply, isNew) {
    repliesById.set(String(reply.id), reply);
    const canDelete = (user && reply.author?.id === user.id) || isModerator;
    const edited = reply.updated_at && reply.updated_at !== reply.created_at;
    return `
      <div class="post-card reply-post${isNew ? ' new-reply' : ''}" data-reply-id="${esc(reply.id)}">
        ${authorBlock(reply.author, false)}
        <div class="post-body">
          <div class="post-meta">
            <span>${Forum.formatDate(reply.created_at)}</span>
            ${edited ? '<span class="edited">(edited)</span>' : ''}
          </div>
          <div class="post-content">${Forum.nl2br(reply.content)}</div>
          ${canDelete ? `<div class="post-actions"><button type="button" class="btn-delete" data-action="delete-reply" data-reply-id="${esc(reply.id)}">Delete reply</button></div>` : ''}
        </div>
      </div>`;
  }

  // Reply form, sign-in prompt, or locked notice
  function renderReplyArea() {
    const locked = thread.is_locked && !isModerator;
    replyFormSection.hidden = !user || locked;
    loginPrompt.hidden = Boolean(user) || thread.is_locked;
    lockedNotice.hidden = !thread.is_locked;
    lockedNotice.textContent = isModerator
      ? 'This thread is locked. Only moderators can reply.'
      : 'This thread is locked, so it\u2019s closed to new replies.';
  }

  async function loadReplies(page) {
    currentPage = page;
    try {
      const result = await Forum.getReplies(threadId, { page });
      repliesSection.hidden = result.replies.length === 0;
      repliesList.innerHTML = result.replies.map(reply => renderReply(reply, false)).join('');

      replyPagination.innerHTML = '';
      if (result.totalPages > 1) {
        for (let i = 1; i <= result.totalPages; i++) {
          replyPagination.insertAdjacentHTML('beforeend',
            `<button type="button" class="page-btn${i === page ? ' active' : ''}" data-page="${i}"${i === page ? ' aria-current="page"' : ''}>${i}</button>`);
        }
      }
    } catch (error) {
      console.error('Error loading replies:', error);
      repliesList.innerHTML = '<p class="error">Replies didn’t load. Refresh to try again.</p>';
    }
  }

  // Load the thread
  try {
    thread = await Forum.getThread(threadId);
    if (!thread) {
      threadContainer.innerHTML = '<p class="error">Thread not found.</p>';
      return;
    }

    document.title = `${thread.title} - ZRG Classics Forums`;
    Forum.setCanonical();
    const crumb = document.getElementById('thread-title-crumb');
    crumb.textContent = thread.title.length > 50 ? `${thread.title.substring(0, 50)}…` : thread.title;
    const categoryLink = document.getElementById('category-link');
    categoryLink.textContent = thread.category.name;
    categoryLink.href = `/forum/${encodeURIComponent(thread.category.slug)}/`;

    renderThread();
    renderReplyArea();
    if (thread.reply_count > 0) await loadReplies(1);
  } catch (error) {
    console.error('Error:', error);
    threadContainer.innerHTML = '<p class="error">This thread didn’t load. Refresh to try again.</p>';
    return;
  }

  // One listener for every button on the page
  document.addEventListener('click', async (e) => {
    const pageBtn = e.target.closest('#replies-pagination [data-page]');
    if (pageBtn) {
      await loadReplies(parseInt(pageBtn.dataset.page, 10));
      repliesSection.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const btn = e.target.closest('[data-action]');
    if (!btn || !threadContainer.closest('main').contains(btn)) return;
    const action = btn.dataset.action;

    try {
      if (action === 'delete-thread') {
        if (!confirm('Delete this thread and all of its replies? This can’t be undone.')) return;
        const isAuthor = user && thread.author?.id === user.id;
        if (isAuthor) await Forum.deleteThread(thread.id);
        else await Forum.moderateThread(thread.id, 'delete');
        window.location.href = `/forum/${encodeURIComponent(thread.category.slug)}/`;
      } else if (action === 'delete-reply') {
        if (!confirm('Delete this reply? This can’t be undone.')) return;
        const replyId = parseInt(btn.dataset.replyId, 10);
        const reply = repliesById.get(String(replyId));
        const isAuthor = user && reply && reply.author?.id === user.id;
        if (isAuthor) await Forum.deleteReply(replyId);
        else await Forum.moderateDeleteReply(replyId);
        await loadReplies(currentPage);
      } else if (['pin', 'unpin', 'lock', 'unlock'].includes(action)) {
        btn.disabled = true;
        await Forum.moderateThread(thread.id, action);
        thread = await Forum.getThread(thread.id);
        renderThread();
        renderReplyArea();
      }
    } catch (error) {
      console.error(error);
      btn.disabled = false;
      alert(`That didn’t work: ${error.message}`);
    }
  });

  // Post a reply
  replyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const textarea = document.getElementById('reply-content');
    const content = textarea.value.trim();
    const submitBtn = replyForm.querySelector('button[type="submit"]');
    if (!content) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting…';

    try {
      const reply = await Forum.createReply(threadId, content);
      repliesSection.hidden = false;
      repliesList.insertAdjacentHTML('beforeend', renderReply(reply, true));
      textarea.value = '';
      repliesList.lastElementChild.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      AuthUI.showError(replyForm, error.message);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Post reply';
    }
  });
});
