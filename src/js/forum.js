/**
 * ZRG Classics - Forum Module
 * Handles forum threads, replies, and interactions
 */

const Forum = {
  // ============================================
  // CATEGORIES
  // ============================================

  /**
   * Get all forum categories
   */
  async getCategories() {
    const { data, error } = await db
      .from('forum_categories')
      .select('*')
      .order('display_order');

    if (error) throw error;
    return data;
  },

  /**
   * Get categories grouped by brand
   */
  async getCategoriesGrouped() {
    const categories = await this.getCategories();

    return {
      general: categories.filter(c => !c.brand),
      bmw: categories.filter(c => c.brand === 'BMW'),
      porsche: categories.filter(c => c.brand === 'Porsche')
    };
  },

  /**
   * Get single category by slug
   */
  async getCategory(slug) {
    const { data, error } = await db
      .from('forum_categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  // ============================================
  // THREADS
  // ============================================

  /**
   * Get threads for a category
   */
  async getThreads(categorySlug, options = {}) {
    const { page = 1, limit = 25 } = options;
    const offset = (page - 1) * limit;

    let query = db
      .from('forum_threads')
      .select(`
        *,
        author:profiles!forum_threads_author_id_fkey(id, username, avatar_url),
        last_reply_author:profiles!forum_threads_last_reply_by_fkey(username),
        category:forum_categories!inner(slug, name, vehicle)
      `, { count: 'exact' });

    if (categorySlug && categorySlug !== 'all') {
      query = query.eq('category.slug', categorySlug);
    }

    const { data, error, count } = await query
      .order('is_pinned', { ascending: false })
      .order('last_reply_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      threads: data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  },

  /**
   * Get single thread with replies
   */
  async getThread(threadId) {
    // Get thread
    const { data: thread, error: threadError } = await db
      .from('forum_threads')
      .select(`
        *,
        author:profiles!forum_threads_author_id_fkey(id, username, avatar_url, post_count, created_at),
        category:forum_categories(id, slug, name, vehicle)
      `)
      .eq('id', threadId)
      .single();

    if (threadError) throw threadError;

    // Increment view count
    db.rpc('increment_thread_views', { thread_id: threadId });

    return thread;
  },

  /**
   * Get replies for a thread
   */
  async getReplies(threadId, options = {}) {
    const { page = 1, limit = 20 } = options;
    const offset = (page - 1) * limit;

    const { data, error, count } = await db
      .from('forum_replies')
      .select(`
        *,
        author:profiles(id, username, avatar_url, post_count, created_at)
      `, { count: 'exact' })
      .eq('thread_id', threadId)
      .order('created_at')
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      replies: data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  },

  /**
   * Create a new thread
   */
  async createThread(categoryId, title, content) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in to create a thread');

    const slug = this.generateSlug(title) + '-' + Date.now();

    const { data, error } = await db
      .from('forum_threads')
      .insert({
        category_id: categoryId,
        author_id: user.id,
        title,
        slug,
        content,
        last_reply_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a reply
   */
  async createReply(threadId, content) {
    const user = await Auth.getUser();
    if (!user) throw new Error('Must be logged in to reply');

    const { data, error } = await db
      .from('forum_replies')
      .insert({
        thread_id: threadId,
        author_id: user.id,
        content
      })
      .select(`
        *,
        author:profiles(id, username, avatar_url, post_count, created_at)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a thread
   */
  async updateThread(threadId, updates) {
    const { data, error } = await db
      .from('forum_threads')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', threadId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update a reply
   */
  async updateReply(replyId, content) {
    const { data, error } = await db
      .from('forum_replies')
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', replyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a thread (author only)
   */
  async deleteThread(threadId) {
    const { error } = await db
      .from('forum_threads')
      .delete()
      .eq('id', threadId);

    if (error) throw error;
  },

  /**
   * Delete a reply (author only)
   */
  async deleteReply(replyId) {
    const { error } = await db
      .from('forum_replies')
      .delete()
      .eq('id', replyId);

    if (error) throw error;
  },

  // ============================================
  // SEARCH
  // ============================================

  /**
   * Search threads
   */
  async searchThreads(query, options = {}) {
    const { page = 1, limit = 25, category = null } = options;
    const offset = (page - 1) * limit;

    let dbQuery = db
      .from('forum_threads')
      .select(`
        *,
        author:profiles!forum_threads_author_id_fkey(username, avatar_url),
        category:forum_categories(slug, name)
      `, { count: 'exact' })
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`);

    if (category) {
      dbQuery = dbQuery.eq('category.slug', category);
    }

    const { data, error, count } = await dbQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      threads: data,
      total: count,
      page,
      totalPages: Math.ceil(count / limit)
    };
  },

  // ============================================
  // HELPERS
  // ============================================

  /**
   * Generate URL-safe slug from title
   */
  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  },

  /**
   * Format relative time
   */
  timeAgo(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
      }
    }

    return 'just now';
  },

  /**
   * Format date
   */
  formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  /**
   * Sanitize HTML to prevent XSS
   */
  sanitizeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  /**
   * Convert newlines to <br> tags
   */
  nl2br(text) {
    return this.sanitizeHtml(text).replace(/\n/g, '<br>');
  }
};

// Export
window.Forum = Forum;
