// ---------- mobile nav toggle ----------
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  // close menu when a link is tapped (mobile)
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ---------- scroll reveal ----------
const revealEls = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));
} else {
  // If reduced motion is preferred or no IntersectionObserver, show everything immediately
  revealEls.forEach(el => el.classList.add('in'));
}

// ---------- disable cursor blink for reduced motion ----------
if (prefersReducedMotion) {
  document.querySelectorAll('.cursor-blink').forEach(el => {
    el.classList.remove('cursor-blink');
  });
}

// ---------- Formspree contact form ----------
// SECURITY NOTES (read before wiring this to a real account):
//
// 1. The URL below (https://formspree.io/f/XXXXXXX) is a FORM ENDPOINT, not a
//    secret. It is meant to be public and visible in page source — that's how
//    Formspree's static-site model works. Never put a Formspree "API key" /
//    personal access token (the one from Account Settings > API, used for
//    managing forms programmatically) into front-end code. That token has
//    account-wide permissions and must only ever be used from a server.
//
// 2. In the Formspree dashboard, restrict the form to your domain
//    (Form Settings > Allowed Domains). This stops someone from copying your
//    form ID out of this file's source and spamming submissions from an
//    unrelated site.
//
// 3. The hidden "_gotcha" input below is a honeypot: real visitors never see
//    or fill it (it's visually hidden, not display:none, to fool simple bots
//    that skip hidden fields), but bots that auto-fill every field will trip
//    it and Formspree silently discards the submission.
//
// 4. Client-side checks here (required fields, email pattern) are for UX
//    only — they save the user a round trip. They are NOT a security
//    boundary. All real validation and spam filtering happens on
//    Formspree's servers; never trust the browser as the source of truth.
//
// 5. Submissions go over HTTPS with fetch()+JSON, and the submit button is
//    disabled while a request is in flight to prevent duplicate/rapid-fire
//    submissions.
//
// 6. Consider turning on reCAPTCHA/hCaptcha in the Formspree dashboard if
//    you start getting spam even with the honeypot.

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mwvkbyqy'; // <- replace with your real form ID

const form = document.getElementById('contact-form');
if (form) {
  const statusEl = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot check — if a bot filled this, quietly stop
    if (form.querySelector('.hp-field input').value) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    statusEl.className = 'form-status';

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: new FormData(form),
      });

      if (res.ok) {
        statusEl.textContent = 'Message sent — thanks, I\u2019ll get back to you soon.';
        statusEl.className = 'form-status show ok';
        form.reset();
      } else {
        const data = await res.json().catch(() => null);
        const msg = data && data.errors ? data.errors.map(x => x.message).join(', ') : 'Something went wrong. Please try again.';
        statusEl.textContent = msg;
        statusEl.className = 'form-status show err';
      }
    } catch (err) {
      statusEl.textContent = 'Network error — please try again in a moment.';
      statusEl.className = 'form-status show err';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send message';
    }
  });
}
