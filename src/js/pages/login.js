// login: page script for account/login.njk (moved out of the template so the site can use a strict Content-Security-Policy)
// Only follow same-site paths from ?return= so the login page can't be used
// to bounce people to another site after they sign in.
function safeReturnUrl() {
  const target = new URLSearchParams(window.location.search).get('return') || '';
  return /^\/(?![\/\\])/.test(target) ? target : '/account/garage/';
}

document.addEventListener('DOMContentLoaded', async () => {
  // Check if already logged in
  const user = await Auth.getUser();
  if (user) {
    window.location.href = safeReturnUrl();
    return;
  }

  const form = document.getElementById('login-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in…';

    try {
      await Auth.signIn(email, password);
      window.location.href = safeReturnUrl();
    } catch (error) {
      AuthUI.showError(form, error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  });
});
