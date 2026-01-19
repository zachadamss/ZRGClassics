/**
 * ZRG Classics - Supabase Client
 * Handles database connection and authentication
 */

const SUPABASE_URL = 'https://skgtbjqjtwscwbanagrf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_OGi_cH30GtCUHKX2lVhRqw_hgWRdEnY';

// Initialize Supabase client with auth options to prevent iframe errors
let db;
try {
  const { createClient } = supabase;
  db = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  });
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

// ============================================
// AUTH FUNCTIONS
// ============================================

const Auth = {
  /**
   * Get current session
   */
  async getSession() {
    const { data: { session }, error } = await db.auth.getSession();
    if (error) console.error('Session error:', error);
    return session;
  },

  /**
   * Get current user
   */
  async getUser() {
    const { data: { user }, error } = await db.auth.getUser();
    if (error && error.message !== 'Auth session missing!') {
      console.error('User error:', error);
    }
    return user;
  },

  /**
   * Get user profile from database
   */
  async getProfile(userId) {
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) console.error('Profile error:', error);
    return data;
  },

  /**
   * Get current user with profile
   */
  async getCurrentUserWithProfile() {
    const user = await this.getUser();
    if (!user) return null;

    const profile = await this.getProfile(user.id);
    return { user, profile };
  },

  /**
   * Sign up with email and password
   */
  async signUp(email, password, username) {
    // Check if username is available
    const { data: existing } = await db
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (existing) {
      throw new Error('Username is already taken');
    }

    const { data, error } = await db.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          display_name: username
        }
      }
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign in with email and password
   */
  async signIn(email, password) {
    const { data, error } = await db.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  },

  /**
   * Sign out
   */
  async signOut() {
    const { error } = await db.auth.signOut();
    if (error) throw error;
    window.location.href = '/';
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, updates) {
    const { data, error } = await db
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback) {
    return db.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * Request password reset
   */
  async resetPassword(email) {
    const { error } = await db.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password/`
    });
    if (error) throw error;
  }
};

// ============================================
// UI HELPERS
// ============================================

const AuthUI = {
  /**
   * Update navigation based on auth state
   */
  async updateNav() {
    const user = await Auth.getUser();
    const authLinks = document.querySelector('.auth-links');

    if (!authLinks) return;

    if (user) {
      const profile = await Auth.getProfile(user.id);
      authLinks.innerHTML = `
        <a href="/account/dashboard/" class="nav-link user-link">
          ${profile?.username || 'Account'}
        </a>
        <button onclick="Auth.signOut()" class="btn btn-secondary btn-sm">Sign Out</button>
      `;
    } else {
      authLinks.innerHTML = `
        <a href="/account/login/" class="btn btn-secondary btn-sm">Sign In</a>
        <a href="/account/register/" class="btn btn-primary btn-sm">Join</a>
      `;
    }
  },

  /**
   * Show error message
   */
  showError(container, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-error';
    errorDiv.textContent = message;
    container.prepend(errorDiv);
    setTimeout(() => errorDiv.remove(), 5000);
  },

  /**
   * Show success message
   */
  showSuccess(container, message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'alert alert-success';
    successDiv.textContent = message;
    container.prepend(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
  },

  /**
   * Require authentication - redirect if not logged in
   */
  async requireAuth() {
    const user = await Auth.getUser();
    if (!user) {
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/account/login/?return=${returnUrl}`;
      return null;
    }
    return user;
  }
};

// Initialize auth state on page load
document.addEventListener('DOMContentLoaded', () => {
  AuthUI.updateNav();
});

// Export for use in other modules
window.db = db;
window.Auth = Auth;
window.AuthUI = AuthUI;
