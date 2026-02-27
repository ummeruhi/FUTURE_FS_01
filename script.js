// ==========================
// PREMIUM SCRIPT (No resume, no photo needed)
// ==========================

// Preloader
const preloader = document.querySelector('.preloader');
window.addEventListener('load', () => {
  if (preloader) preloader.classList.add('hidden');
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Theme toggle with persistence
const themeToggle = document.querySelector('.theme-toggle');
const html = document.documentElement;

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (themeToggle) {
    themeToggle.innerHTML =
      theme === 'dark'
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
  }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme) setTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  });
}

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

function setMenu(open) {
  if (!hamburger || !navLinks) return;
  hamburger.classList.toggle('active', open);
  navLinks.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
}

if (hamburger) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.contains('active');
    setMenu(!isOpen);
  });
}

// Smooth scroll & close mobile menu
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (!targetId || targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
    setMenu(false);
  });
});

// Scroll reveal
const sections = document.querySelectorAll('.section-hidden');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('section-visible');

      // Progress bars
      if (entry.target.id === 'skills') {
        document.querySelectorAll('.progress').forEach(bar => {
          const m = bar.getAttribute('style')?.match(/--width:\s*(\d+)%/);
          if (m) bar.style.width = m[1] + '%';
        });
      }

      // Counters
      if (entry.target.classList.contains('highlights')) {
        animateCounters();
      }
    }
  });
}, { threshold: 0.15 });

sections.forEach(section => observer.observe(section));

// Active nav highlight
const sectionsForNav = document.querySelectorAll("section[id]");
const navItems = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sectionsForNav.forEach(section => {
    const sectionTop = section.offsetTop - 140;
    if (window.scrollY >= sectionTop) current = section.getAttribute("id");
  });

  navItems.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) link.classList.add("active");
  });
});

// Scroll progress bar
const progressBar = document.querySelector('.scroll-progress span');
window.addEventListener('scroll', () => {
  if (!progressBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = percent + '%';
});

// Particles (disabled for reduced motion)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canvas = document.getElementById('particles-canvas');

if (canvas && !prefersReducedMotion) {
  const ctx = canvas.getContext('2d');
  const particles = [];
  let rafId = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 0.8 - 0.4;
      this.speedY = Math.random() * 0.8 - 0.4;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.fillStyle = 'rgba(108,92,231,0.45)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < 70; i++) particles.push(new Particle());
  }
  initParticles();

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    rafId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId) cancelAnimationFrame(rafId);
  });
}

// Back to top button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
  if (!backToTop) return;
  if (window.scrollY > 400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Contact form — real status
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm && formStatus) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    formStatus.textContent = "Sending…";
    formStatus.style.color = "#6c757d";

    try {
      const data = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        formStatus.textContent = "Message sent successfully!";
        formStatus.style.color = "#28a745";
        contactForm.reset();
      } else {
        formStatus.textContent = "Could not send. Please try again.";
        formStatus.style.color = "#dc3545";
      }
    } catch (err) {
      formStatus.textContent = "Network error. Please try again.";
      formStatus.style.color = "#dc3545";
    }
  });
}

// ==========================
// COUNTER ANIMATION (FIXED)
// ==========================
let countersAnimated = false;

function animateCounters() {
  if (countersAnimated) return;
  countersAnimated = true;

  document.querySelectorAll(".stat-number[data-count]").forEach((el) => {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 900;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(progress * target);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = String(target);
    }

    requestAnimationFrame(tick);
  });
}

// Trigger counters when Highlights section is visible
const highlightsSection = document.querySelector(".highlights");
if (highlightsSection) {
  const highlightsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCounters();
        highlightsObserver.disconnect();
      }
    },
    { threshold: 0.25 }
  );
  highlightsObserver.observe(highlightsSection);
}
