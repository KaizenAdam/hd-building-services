/* ================================================================
   TRADIE WEBSITE TEMPLATE — main.js
   ================================================================ */

/* ── Copyright year ── */
document.getElementById('year').textContent = new Date().getFullYear();


/* ── Mobile nav ── */
const hamburger   = document.getElementById('hamburger');
const mobileMenu  = document.getElementById('mobile-menu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
});

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('active');
  hamburger.setAttribute('aria-label', 'Open menu');
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    closeMobileMenu();
  }
});


/* ── Active nav link on scroll ── */
const sections  = document.querySelectorAll('section[id], div[id="home"]');
const navLinks  = document.querySelectorAll('.nav-links a');

const observerOptions = {
  root: null,
  rootMargin: '-60px 0px -50% 0px',
  threshold: 0,
};

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach((link) => {
        link.style.color = link.getAttribute('href') === `#${id}`
          ? '#ffffff'
          : 'rgba(255,255,255,0.82)';
      });
    }
  });
}, observerOptions);

document.querySelectorAll('section[id]').forEach((s) => navObserver.observe(s));


/* ── Stats counter animation ── */
function animateCounter(el) {
  const text    = el.textContent.trim();
  const hasPlus    = text.includes('+');
  const hasPercent = text.includes('%');
  const hasStar    = text.includes('★');
  if (hasStar) return; // don't animate star rating
  if (text.includes('/')) return; // don't animate scores like 10/10

  const target = parseInt(text.replace(/[^0-9]/g, ''), 10);
  if (isNaN(target) || target === 0) return;

  const duration  = 1500; // ms
  const framerate = 1000 / 60;
  const totalFrames = Math.round(duration / framerate);
  let frame = 0;

  const counter = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // ease-out curve
    const value = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    el.textContent = value + (hasPlus ? '+' : '') + (hasPercent ? '%' : '');
    if (frame === totalFrames) clearInterval(counter);
  }, framerate);
}

const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && !statsAnimated) {
      statsAnimated = true;
      statNumbers.forEach(animateCounter);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);


/* ── Spam: set form load timestamp (used by mail.php timing check) ── */
const formTimeField = document.getElementById('form_time');
if (formTimeField) formTimeField.value = Math.floor(Date.now() / 1000);


/* ── Contact form (PHP mailer → mail.php) ── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('[type="submit"]');
    const original  = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending…';
    submitBtn.disabled  = true;

    try {
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body:   new FormData(contactForm),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        contactForm.reset();
        formSuccess.style.display = 'block';
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data?.error || 'Something went wrong. Please try calling us directly.');
      }
    } catch {
      alert('Could not send message. Please call us directly.');
    }

    submitBtn.innerHTML = original;
    submitBtn.disabled  = false;
  });
}


/* ── Scroll animations ── */
document.documentElement.classList.add('anim-ready');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.aosDelay || 0);
      setTimeout(() => entry.target.classList.add('in-view'), delay);
      animObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-aos]').forEach((el) => animObserver.observe(el));


/* ── Gallery lightbox ── */
const lightbox      = document.getElementById('lightbox');
const lightboxImg   = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');
const lightboxPrev  = document.getElementById('lightbox-prev');
const lightboxNext  = document.getElementById('lightbox-next');

const galleryImgs = [...document.querySelectorAll('.gallery-item img')];
let currentIdx = 0;

function openLightbox(index) {
  currentIdx = index;
  lightboxImg.src = galleryImgs[index].src;
  lightboxImg.alt = galleryImgs[index].alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function lightboxStep(dir) {
  currentIdx = (currentIdx + dir + galleryImgs.length) % galleryImgs.length;
  lightboxImg.src = galleryImgs[currentIdx].src;
  lightboxImg.alt = galleryImgs[currentIdx].alt;
}

galleryImgs.forEach((img, i) => {
  img.closest('.gallery-item').addEventListener('click', () => openLightbox(i));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => lightboxStep(-1));
lightboxNext.addEventListener('click', () => lightboxStep(1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   lightboxStep(-1);
  if (e.key === 'ArrowRight')  lightboxStep(1);
});


/* ── Smooth scroll with header offset ── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href').slice(1);
    const target   = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    const offset = 70; // height of fixed header
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
