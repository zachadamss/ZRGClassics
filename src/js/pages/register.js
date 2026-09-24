// register: page script for account/register.njk (moved out of the template so the site can use a strict Content-Security-Policy)
document.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const user = await Auth.getUser();
  if (user) {
    window.location.href = '/account/garage/';
    return;
  }

  // Pre-fill email if passed from homepage newsletter signup
  const params = new URLSearchParams(window.location.search);
  const prefillEmail = params.get('email');
  if (prefillEmail) {
    document.getElementById('email').value = prefillEmail;
  }

  const form = document.getElementById('register-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const newsletterOptIn = document.getElementById('newsletter-optin').checked;
    const submitBtn = form.querySelector('button[type="submit"]');

    // Validate passwords match
    if (password !== confirmPassword) {
      AuthUI.showError(form, 'Passwords do not match');
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account…';

    try {
      await Auth.signUp(email, password, username);

      // Fire-and-forget newsletter subscription
      if (newsletterOptIn) {
        Newsletter.subscribe(email, username)
          .catch(err => console.warn('Newsletter signup failed (non-blocking):', err));
      }

      // Show success message
      form.innerHTML = `
        <div class="alert alert-success">
          <h3>Check your email</h3>
          <p>We've sent a confirmation link to <strong>${email}</strong>.</p>
          <p>Click the link in the email to activate your account.</p>
        </div>
        <a href="/account/login/" class="btn btn-secondary btn-block">Back to Sign In</a>
      `;
    } catch (error) {
      AuthUI.showError(form, error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Create Account';
    }
  });
});
