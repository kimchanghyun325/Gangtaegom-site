/* ============================================
   강태곰 Homepage - JavaScript
   Language Switching, Navigation, Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- State ----
  let currentLang = 'ko';

  // ---- DOM Elements ----
  const body = document.body;
  const header = document.querySelector('.site-header');
  const langBtn = document.querySelector('.lang-btn');
  const langDropdown = document.querySelector('.lang-dropdown');
  const langOptions = document.querySelectorAll('.lang-option');
  const langBtnText = document.querySelector('.lang-btn-text');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');
  const sections = document.querySelectorAll('.content-section, .hero-section');

  // ---- Language Switching ----
  function setLanguage(lang) {
    currentLang = lang;

    // Toggle body class for font
    body.classList.toggle('lang-en', lang === 'en');

    // Update all translatable elements
    document.querySelectorAll('[data-ko]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text !== null) {
        // Check if it's an input placeholder
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.innerHTML = text;
        }
      }
    });

    // Update lang button text
    if (langBtnText) {
      langBtnText.textContent = lang === 'ko' ? '🇰🇷 한국어' : '🇺🇸 English';
    }

    // Mark selected option
    langOptions.forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.lang === lang);
    });

    // Close dropdown
    closeLangDropdown();

    // Store preference
    localStorage.setItem('preferred-lang', lang);
  }

  function closeLangDropdown() {
    langDropdown?.classList.remove('open');
  }

  // Language button toggle
  langBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    langDropdown?.classList.toggle('open');
  });

  // Language option click
  langOptions.forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = opt.dataset.lang;
      if (lang) setLanguage(lang);
    });
  });

  // Close dropdown on outside click
  document.addEventListener('click', () => {
    closeLangDropdown();
  });

  // Load saved language
  const savedLang = localStorage.getItem('preferred-lang');
  if (savedLang) {
    setLanguage(savedLang);
  }

  // ---- Navigation ----
  function setActiveNav(hash) {
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === hash);
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      setActiveNav(href);

      // Close mobile menu
      if (mainNav?.classList.contains('open')) {
        mainNav.classList.remove('open');
        mobileMenuBtn?.classList.remove('active');
      }
    });
  });

  // ---- Mobile Menu ----
  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mainNav?.classList.toggle('open');
  });

  // ---- Header Shadow on Scroll ----
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        // Header shadow
        header?.classList.toggle('scrolled', window.scrollY > 20);

        // Active nav based on scroll position
        let current = '';
        sections.forEach(section => {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 150) {
            current = '#' + section.id;
          }
        });
        if (current) setActiveNav(current);

        ticking = false;
      });
      ticking = true;
    }
  });

  // ---- Scroll Reveal Animation ----
  const fadeElements = document.querySelectorAll('.section-fade');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  fadeElements.forEach(el => observer.observe(el));

  // ---- Logo Click → Home ----
  document.querySelector('.logo-link')?.addEventListener('click', (e) => {
    e.preventDefault();
    const home = document.getElementById('home');
    if (home) {
      home.scrollIntoView({ behavior: 'smooth' });
      setActiveNav('#home');
    }
    // Close mobile menu
    mainNav?.classList.remove('open');
    mobileMenuBtn?.classList.remove('active');
  });

  // ---- Team Slider ----
  const teamSlider = document.getElementById('team-slider');
  const prevBtn = document.querySelector('.team-slider-prev');
  const nextBtn = document.querySelector('.team-slider-next');

  if (teamSlider && prevBtn && nextBtn) {
    const getScrollAmount = () => {
      const card = teamSlider.querySelector('.team-card');
      return card ? card.offsetWidth + 20 : 280; // card width + gap
    };

    prevBtn.addEventListener('click', () => {
      teamSlider.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      teamSlider.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
    });
  }

  // ---- Game Media Slider ----
  const gameTrack = document.getElementById('game-slider-track');
  const gameDots = document.getElementById('game-slider-dots');
  const gamePrev = document.querySelector('.game-slider-prev');
  const gameNext = document.querySelector('.game-slider-next');

  if (gameTrack && gameDots) {
    const slides = gameTrack.querySelectorAll('.game-slide');
    let currentSlide = 0;

    // Create dot indicators
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'game-slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `슬라이드 ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      gameDots.appendChild(dot);
    });

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      currentSlide = index;
      gameTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      // Update dots
      gameDots.querySelectorAll('.game-slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    }

    gamePrev?.addEventListener('click', () => goToSlide(currentSlide - 1));
    gameNext?.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      const gameSection = document.getElementById('game');
      if (!gameSection) return;
      const rect = gameSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (!inView) return;
      if (e.key === 'ArrowLeft') goToSlide(currentSlide - 1);
      if (e.key === 'ArrowRight') goToSlide(currentSlide + 1);
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    const viewport = gameTrack.parentElement;

    viewport.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    viewport.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToSlide(currentSlide + 1);
        else goToSlide(currentSlide - 1);
      }
    }, { passive: true });
  }

});
