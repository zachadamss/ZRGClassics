/**
 * ConvertKit newsletter signup, shared by the homepage form and registration.
 * The v3 api_key is ConvertKit's public key (the secret is never used here).
 */
const Newsletter = {
  FORM_ID: '9066084',
  API_KEY: '4xiJtJiidK2ENJURMRXjgw',

  async subscribe(email, firstName) {
    const body = { api_key: this.API_KEY, email };
    if (firstName) body.first_name = firstName;

    const response = await fetch(`https://api.convertkit.com/v3/forms/${this.FORM_ID}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`Signup failed (${response.status})`);
    return response.json();
  }
};

// Any form marked data-newsletter-form subscribes in place.
document.querySelectorAll('[data-newsletter-form]').forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    const button = form.querySelector('button[type="submit"]');
    const status = form.querySelector('[data-newsletter-status]');

    button.disabled = true;
    button.textContent = 'Signing you up…';
    status.textContent = '';
    status.classList.remove('is-error', 'is-success');

    try {
      await Newsletter.subscribe(input.value.trim());
      form.classList.add('is-subscribed');
      status.classList.add('is-success');
      status.textContent = "You're on the list. I'll email when there's something new worth reading.";
      button.textContent = 'Subscribed';
    } catch (error) {
      console.error(error);
      status.classList.add('is-error');
      status.textContent = "That didn't go through. Check the address and try again.";
      button.disabled = false;
      button.textContent = 'Sign me up';
    }
  });
});

window.Newsletter = Newsletter;
