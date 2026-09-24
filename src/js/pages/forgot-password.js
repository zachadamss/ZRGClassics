// forgot-password: page script for account/forgot-password.njk (moved out of the template so the site can use a strict Content-Security-Policy)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('reset-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    try {
      await Auth.resetPassword(email);
      form.innerHTML = `
        <div class="alert alert-success">
          <h3>Check your email</h3>
          <p>If an account exists for <strong>${email}</strong>, we've sent a password reset link.</p>
        </div>
        <a href="/account/login/" class="btn btn-secondary btn-block">Back to Sign In</a>
      `;
    } catch (error) {
      AuthUI.showError(form, error.message);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Link';
    }
  });
});
