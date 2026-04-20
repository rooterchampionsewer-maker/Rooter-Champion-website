/* ============================================================
   ROOTER CHAMPION — Main JS
   ============================================================ */

// ─── Sticky nav shadow on scroll ──────────────────────────────
const navWrapper = document.querySelector('.nav-wrapper');
window.addEventListener('scroll', () => {
  navWrapper.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// ─── Mobile hamburger menu ────────────────────────────────────
const hamburger = document.querySelector('.nav__hamburger');
const navLinks  = document.querySelector('.nav__links');

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const isOpen = navLinks.classList.contains('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.querySelectorAll('span').forEach((s, i) => {
    if (isOpen) {
      if (i === 0) s.style.transform = 'translateY(7px) rotate(45deg)';
      if (i === 1) s.style.opacity = '0';
      if (i === 2) s.style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      s.style.transform = '';
      s.style.opacity = '';
    }
  });
});

// Close menu when a link is clicked
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

// ─── Smooth scroll offset for fixed nav ───────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── Scroll reveal animation ──────────────────────────────────
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Add reveal class to elements
const revealTargets = document.querySelectorAll(
  '.service-card, .testimonial-card, .process-step, .why-list__item, .contact-detail'
);

revealTargets.forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = `opacity .5s ease ${i * 0.06}s, transform .5s ease ${i * 0.06}s`;
  revealObserver.observe(el);
});

document.addEventListener('DOMContentLoaded', () => {
  // Add CSS class for revealed state
  const style = document.createElement('style');
  style.textContent = `.revealed { opacity: 1 !important; transform: translateY(0) !important; }`;
  document.head.appendChild(style);
});

// ─── Contact form handler ─────────────────────────────────────
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  // Simulate submission (replace with real endpoint / EmailJS / etc.)
  setTimeout(() => {
    btn.textContent = '✓ Request Sent! We\'ll call you soon.';
    btn.style.background = '#81B752';
    contactForm.reset();

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
    }, 4000);
  }, 1200);
});

// ─── Active nav link on scroll ───────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--green)'
      : '';
  });
}, { passive: true });
