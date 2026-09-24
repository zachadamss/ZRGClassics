// reset-password: page script for account/reset-password.njk (moved out of the template so the site can use a strict Content-Security-Policy)
document.addEventListener('DOMContentLoaded', async () => {
  const loadingState = document.getElementById('loading-state');
  const errorState = document.getElementById('error-state');
  const form = document.getElementById('new-password-form');
  const successState = document.getElementById('success-state');

  let recoveryMode = false;

  // Listen for auth state changes - Supabase fires PASSWORD_RECOVERY event
  db.auth.onAuthStateChange(async (event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      recoveryMode = true;
      loadingState.style.display = 'none';
      form.style.display = 'block';
    } else if (event === 'SIGNED_IN' && recoveryMode) {
      // Password was updated successfully
      form.style.display = 'none';
      successState.style.display = 'block';
    }
  });

  // Also check URL hash for tokens (fallback)
  const hashParams = new URLSearchParams(window.location.hash.substring(1));
  const accessToken = hashParams.get('access_token');
  const type = hashParams.get('type');

  if (type === 'recovery' && accessToken) {
    // We have a recovery token in the URL
    try {
      const { data, error } = await db.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') || ''
      });

      if (error) throw error;

      recoveryMode = true;
      loadingState.style.display = 'none';
      form.style.display = 'block';
    } catch (err) {
      console.error('Session error:', err);
      loadingState.style.display = 'none';
      errorState.style.display = 'block';
    }
  } else {
    // Check if already in a session (page refresh case)
    const { data: { session } } = await db.auth.getSession();

    if (session) {
      // Check if this looks like a recovery session
      recoveryMode = true;
      loadingState.style.display = 'none';
      form.style.display = 'block';
    } else {
      // Give Supabase a moment to process
      setTimeout(() => {
        if (!recoveryMode) {
          loadingState.style.display = 'none';
          errorState.style.display = 'block';
        }
      }, 2000);
    }
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate passwords match
    if (password !== confirmPassword) {
      AuthUI.showError(form, 'Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      AuthUI.showError(form, 'Password must be at least 8 characters');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Updating…';

    try {
      const { error } = await db.auth.updateUser({ password });

      if (error) throw error;

      form.style.display = 'none';
      successState.style.display = 'block';
    } catch (error) {
      AuthUI.showError(form, error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Update Password';
    }
  });
});
