/* ============================================
   ALHAZ MARINE - SCRIPT.JS
   Single Page Navigation with Loader
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ===============================
  // PAGE LOADER
  // ===============================
  const pageLoader = document.getElementById('pageLoader');
  const pageChangeLoader = document.getElementById('pageChangeLoader');

  // Hide page loader after 2.5 seconds
  setTimeout(function() {
    if (pageLoader) {
      pageLoader.classList.add('hidden');
    }
  }, 2500);

  // ===============================
  // PAGE NAVIGATION
  // ===============================
  const navLinks = document.querySelectorAll('.nav a[data-page]');
  const allPages = document.querySelectorAll('.page-section');
  const heroSection = document.getElementById('hero-section');
  const backToTop = document.getElementById('backToTop');
  const header = document.querySelector('.header');
  
  // ===============================
  // LOGO CLICK - GO TO HOME
  // ===============================
  const logoLink = document.getElementById('logoLink');
  if (logoLink) {
    logoLink.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      if (pageId && pageId !== getCurrentPage()) {
        switchPage(pageId);
      } else if (pageId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  let isChangingPage = false;

  // Function to switch page with loader
  function switchPage(pageId) {
    if (isChangingPage) return;
    if (pageId === getCurrentPage()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    isChangingPage = true;

    // Show page change loader
    if (pageChangeLoader) {
      pageChangeLoader.classList.add('active');
    }

    // Hide all pages
    allPages.forEach(page => {
      page.classList.remove('active');
    });

    // Show target page after delay
    setTimeout(() => {
      const targetPage = document.getElementById(pageId);
      if (targetPage) {
        targetPage.classList.add('active');
      }

      // Handle hero section separately
      if (heroSection) {
        if (pageId === 'home') {
          heroSection.classList.remove('hidden');
        } else {
          heroSection.classList.add('hidden');
        }
      }

      // Update URL hash
      if (history.pushState) {
        history.pushState(null, null, '#' + pageId);
      }

      // Update active nav link
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
          link.classList.add('active');
        }
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger reveal animations
      setTimeout(() => {
        const reveals = targetPage.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
        reveals.forEach(el => {
          const elementTop = el.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (elementTop < windowHeight - 100) {
            el.classList.add('active');
          }
        });
      }, 100);

      // Restart testimonial slider
      if (pageId === 'testimonials') {
        setTimeout(() => {
          if (typeof restartTestimonialSlider === 'function') {
            restartTestimonialSlider();
          }
        }, 300);
      }

      // Hide page change loader
      setTimeout(() => {
        if (pageChangeLoader) {
          pageChangeLoader.classList.remove('active');
        }
        isChangingPage = false;
      }, 400);

    }, 500);
  }

  // Get current active page
  function getCurrentPage() {
    let current = 'home';
    navLinks.forEach(link => {
      if (link.classList.contains('active')) {
        current = link.getAttribute('data-page');
      }
    });
    return current;
  }

  // Nav link click handler
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
      }
    });
  });

  // Handle CTA button clicks
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.tagName === 'A' && el.getAttribute('data-page')) {
      el.addEventListener('click', function(e) {
        const pageId = this.getAttribute('data-page');
        if (pageId && this.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          switchPage(pageId);
        }
      });
    }
  });

  // ===============================
  // HANDLE URL HASH ON LOAD
  // ===============================
  function handleHashOnLoad() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      allPages.forEach(page => {
        page.classList.remove('active');
      });
      const targetPage = document.getElementById(hash);
      if (targetPage) {
        targetPage.classList.add('active');
      }
      if (heroSection) {
        if (hash === 'home') {
          heroSection.classList.remove('hidden');
        } else {
          heroSection.classList.add('hidden');
        }
      }
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === hash) {
          link.classList.add('active');
        }
      });
    } else {
      allPages.forEach(page => {
        page.classList.remove('active');
      });
      const homePage = document.getElementById('home');
      if (homePage) {
        homePage.classList.add('active');
      }
      if (heroSection) {
        heroSection.classList.remove('hidden');
      }
    }
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function() {
    const hash = window.location.hash.replace('#', '');
    if (hash && document.getElementById(hash)) {
      switchPage(hash);
    } else {
      switchPage('home');
    }
  });

  // ===============================
  // STICKY HEADER
  // ===============================
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (backToTop) {
      if (scrollY > 300) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    }
  }, { passive: true });

  // ===============================
  // BACK TO TOP
  // ===============================
  if (backToTop) {
    backToTop.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ===============================
  // PARALLAX HERO
  // ===============================
  const hero = document.querySelector('.hero-parallax');

  window.addEventListener('scroll', function() {
    if (hero && !hero.classList.contains('hidden')) {
      hero.style.backgroundPositionY = window.scrollY * 0.5 + 'px';
    }
  }, { passive: true });

  // ===============================
  // SCROLL REVEAL
  // ===============================
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;
    reveals.forEach(el => {
      const elementTop = el.getBoundingClientRect().top;
      if (elementTop < windowHeight - 100) {
        el.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll, { passive: true });

  // ===============================
  // TESTIMONIAL SLIDER
  // ===============================
  let testimonials = document.querySelectorAll('.test-item');
  let dots = document.querySelectorAll('.dot');
  let prevBtn = document.querySelector('.slider-prev');
  let nextBtn = document.querySelector('.slider-next');
  let currentIndex = 0;
  let intervalId = null;

  function showTestimonial(index) {
    if (!testimonials.length) return;
    
    testimonials.forEach(t => t.style.display = 'none');
    if (testimonials[index]) {
      testimonials[index].style.display = 'block';
      testimonials[index].style.animation = 'none';
      testimonials[index].offsetHeight;
      testimonials[index].style.animation = 'fadeSlide 0.5s ease-out';
    }

    dots.forEach(d => d.classList.remove('active'));
    if (dots[index]) {
      dots[index].classList.add('active');
    }

    currentIndex = index;
  }

  function nextTestimonial() {
    if (testimonials.length > 0) {
      const nextIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(nextIndex);
    }
  }

  function prevTestimonial() {
    if (testimonials.length > 0) {
      const prevIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
      showTestimonial(prevIndex);
    }
  }

  function startSlider() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    if (testimonials.length > 1) {
      intervalId = setInterval(nextTestimonial, 4000);
    }
  }

  function restartTestimonialSlider() {
    testimonials = document.querySelectorAll('.test-item');
    dots = document.querySelectorAll('.dot');
    prevBtn = document.querySelector('.slider-prev');
    nextBtn = document.querySelector('.slider-next');
    
    if (testimonials.length > 0) {
      showTestimonial(0);
      startSlider();
    }
  }

  if (testimonials.length > 0) {
    showTestimonial(0);
    startSlider();
  }

  dots.forEach(dot => {
    dot.addEventListener('click', function() {
      const index = parseInt(this.getAttribute('data-index'));
      if (!isNaN(index) && testimonials[index]) {
        showTestimonial(index);
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        startSlider();
      }
    });
  });

  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      prevTestimonial();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      startSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      nextTestimonial();
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
      startSlider();
    });
  }

  const sliderContainer = document.querySelector('.testimonials-slider');
  if (sliderContainer && testimonials.length > 0) {
    sliderContainer.addEventListener('mouseenter', () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    });
    sliderContainer.addEventListener('mouseleave', () => {
      if (!intervalId) {
        startSlider();
      }
    });

    sliderContainer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevTestimonial();
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        startSlider();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextTestimonial();
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
        startSlider();
      }
    });
  }

  // ===============================
  // CONTACT FORM
  // ===============================
  const contactForm = document.getElementById('creative-contact');
  const formStatus = document.getElementById('formStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('.submit-btn');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;
      formStatus.className = 'form-status';
      formStatus.style.display = 'none';

      formStatus.className = 'form-status success';
      formStatus.textContent = '✅ Sending your message... Please wait.';
      formStatus.style.display = 'block';

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 5000);
    });
  }

  // ===============================
  // PHONE NUMBER FORMATTING
  // ===============================
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^\d+]/g, '');
    });
  }

  // ===============================
  // TOP BAR OFFSET
  // ===============================
  const topBar = document.querySelector('.top-bar');
  if (topBar && header) {
    function updateHeaderOffset() {
      header.style.top = topBar.offsetHeight + 'px';
    }
    updateHeaderOffset();
    window.addEventListener('resize', updateHeaderOffset);
  }

  // ===============================
  // MESSENGER BUTTON
  // ===============================
  const messengerBtn = document.getElementById('messengerBtn');
  let isDragging = false;
  let initialX = 0, initialY = 0;
  let xOffset = 0, yOffset = 0;

  if (messengerBtn) {
    const rect = messengerBtn.getBoundingClientRect();
    xOffset = rect.left;
    yOffset = rect.top;

    function dragStart(e) {
      const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
      initialX = clientX - xOffset;
      initialY = clientY - yOffset;
      isDragging = true;
      messengerBtn.classList.add('dragging');
      messengerBtn.style.cursor = 'grabbing';
    }

    function drag(e) {
      if (!isDragging) return;
      e.preventDefault();
      const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
      
      let newX = clientX - initialX;
      let newY = clientY - initialY;
      
      const btnRect = messengerBtn.getBoundingClientRect();
      newX = Math.max(0, Math.min(newX, window.innerWidth - btnRect.width));
      newY = Math.max(0, Math.min(newY, window.innerHeight - btnRect.height));
      
      xOffset = newX;
      yOffset = newY;
      
      messengerBtn.style.position = 'fixed';
      messengerBtn.style.left = newX + 'px';
      messengerBtn.style.top = newY + 'px';
      messengerBtn.style.bottom = 'auto';
      messengerBtn.style.right = 'auto';
    }

    function dragEnd() {
      isDragging = false;
      messengerBtn.classList.remove('dragging');
      messengerBtn.style.cursor = 'pointer';
      if (messengerBtn.style.left) {
        try {
          localStorage.setItem('messengerLeft', messengerBtn.style.left);
          localStorage.setItem('messengerTop', messengerBtn.style.top);
        } catch (err) {}
      }
    }

    messengerBtn.addEventListener('mousedown', dragStart);
    messengerBtn.addEventListener('touchstart', dragStart, { passive: false });
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);

    messengerBtn.addEventListener('click', function(e) {
      if (isDragging) {
        e.preventDefault();
        isDragging = false;
        return;
      }
      if (getCurrentPage() !== 'contact') {
        switchPage('contact');
      }
    });

    if (window.innerWidth <= 768) {
      try {
        const savedLeft = localStorage.getItem('messengerLeft');
        const savedTop = localStorage.getItem('messengerTop');
        if (savedLeft && savedTop) {
          messengerBtn.style.position = 'fixed';
          messengerBtn.style.left = savedLeft;
          messengerBtn.style.top = savedTop;
          messengerBtn.style.bottom = 'auto';
          messengerBtn.style.right = 'auto';
          const rect2 = messengerBtn.getBoundingClientRect();
          xOffset = rect2.left;
          yOffset = rect2.top;
        }
      } catch (err) {}
    }

    let resizeTimer;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function() {
        if (window.innerWidth <= 768) {
          const btnRect = messengerBtn.getBoundingClientRect();
          let newLeft = parseFloat(messengerBtn.style.left) || 30;
          let newTop = parseFloat(messengerBtn.style.top) || (window.innerHeight - 80);
          newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - btnRect.width));
          newTop = Math.max(0, Math.min(newTop, window.innerHeight - btnRect.height));
          messengerBtn.style.left = newLeft + 'px';
          messengerBtn.style.top = newTop + 'px';
          xOffset = newLeft;
          yOffset = newTop;
        }
      }, 100);
    });
  }

  // ===============================
  // MOBILE HAMBURGER MENU
  // ===============================
  const navbar = document.querySelector('.navbar');
  const nav = document.querySelector('.nav');
  
  if (navbar && nav) {
    let hamburger = document.querySelector('.hamburger-menu');
    
    // Create hamburger if not exists
    if (!hamburger) {
      hamburger = document.createElement('button');
      hamburger.className = 'hamburger-menu';
      hamburger.setAttribute('aria-label', 'Toggle navigation menu');
      hamburger.innerHTML = '<span></span><span></span><span></span>';
      
      const logo = navbar.querySelector('.logo');
      if (logo) {
        logo.after(hamburger);
      } else {
        navbar.prepend(hamburger);
      }
    }
    
    // Toggle menu on hamburger click
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      this.classList.toggle('active');
      nav.classList.toggle('active');
      
      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    // Close menu when clicking on a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (!navbar.contains(e.target) && nav.classList.contains('active')) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
        }
      }
    });
    
    // Close menu on window resize to desktop
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ===============================
  // INJECT HAMBURGER STYLES
  // ===============================
  if (!document.getElementById('hamburger-styles')) {
    const style = document.createElement('style');
    style.id = 'hamburger-styles';
    style.textContent = `
      .hamburger-menu {
        display: none;
        flex-direction: column;
        gap: 5px;
        cursor: pointer;
        padding: 8px 10px;
        z-index: 1001;
        background: none;
        border: none;
        align-items: center;
        justify-content: center;
      }
      
      .hamburger-menu span {
        display: block;
        width: 28px;
        height: 3px;
        background: white;
        border-radius: 3px;
        transition: all 0.3s ease;
        flex-shrink: 0;
      }
      
      .hamburger-menu.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 6px);
      }
      
      .hamburger-menu.active span:nth-child(2) {
        opacity: 0;
        transform: scaleX(0);
      }
      
      .hamburger-menu.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -6px);
      }
    `;
    document.head.appendChild(style);
  }

  // ===============================
  // INITIALIZE
  // ===============================
  handleHashOnLoad();
  setTimeout(revealOnScroll, 500);

  // ===============================
  // CONSOLE
  // ===============================
  console.log('🚢 ALHAZ MARINE - Single Page App Loaded');
  console.log('📅 ' + new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
});