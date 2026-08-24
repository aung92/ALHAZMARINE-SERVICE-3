/* ============================================
   ALHAZ MARINE - SCRIPT.JS
   Single Page Navigation with Loader
   Version: 2.1 (Fully Responsive)
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ===============================
  // PAGE LOADER
  // ===============================
  const pageLoader = document.getElementById('pageLoader');
  const pageChangeLoader = document.getElementById('pageChangeLoader');

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

  // ===============================
  // DROPDOWN - Hover to show/hide (Desktop) / Click (Mobile)
  // ===============================
  const navDropdown = document.querySelector('.nav-dropdown');
  let dropdownTimeout = null;
  let isHovering = false;

  if (navDropdown) {
    navDropdown.addEventListener('mouseenter', function(e) {
      if (window.innerWidth > 768) {
        if (dropdownTimeout) {
          clearTimeout(dropdownTimeout);
          dropdownTimeout = null;
        }
        isHovering = true;
        this.classList.add('active');
      }
    });
    
    navDropdown.addEventListener('mouseleave', function(e) {
      if (window.innerWidth > 768) {
        isHovering = false;
        dropdownTimeout = setTimeout(() => {
          if (!isHovering && !navDropdown.matches(':hover')) {
            navDropdown.classList.remove('active');
          }
          dropdownTimeout = null;
        }, 200);
      }
    });
    
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          e.stopPropagation();
          navDropdown.classList.toggle('active');
        }
      });
    }
    
    // Close dropdown when clicking outside (mobile)
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (navDropdown && !navDropdown.contains(e.target)) {
          navDropdown.classList.remove('active');
        }
      }
    });
  }

  // ===============================
  // DROPDOWN LINKS - Click to navigate
  // ===============================
  document.querySelectorAll('.dropdown-menu a[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      
      if (pageId) {
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.hamburger-menu');
        if (nav) nav.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        if (navDropdown) {
          navDropdown.classList.remove('active');
          if (dropdownTimeout) {
            clearTimeout(dropdownTimeout);
            dropdownTimeout = null;
          }
        }
        document.body.style.overflow = '';
        switchPage(pageId);
      }
    });
  });

  // ===============================
  // SERVICE CARD LINKS
  // ===============================
  document.querySelectorAll('.service-link[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
      }
    });
  });

  // ===============================
  // SERVICE LIST LINKS
  // ===============================
  document.querySelectorAll('.service-list-link[data-page]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      if (pageId) {
        switchPage(pageId);
      }
    });
  });

  // ===============================
  // Switch Page Function
  // ===============================
  function switchPage(pageId) {
    if (isChangingPage) return;
    
    const isServicePage = pageId.startsWith('service-');
    
    if (pageId === getCurrentPage()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    isChangingPage = true;

    if (pageChangeLoader) {
      pageChangeLoader.classList.add('active');
    }

    allPages.forEach(page => {
      page.classList.remove('active');
    });

    setTimeout(() => {
      const targetPage = document.getElementById(pageId);
      if (targetPage) {
        targetPage.classList.add('active');
      }

      if (pageId === 'gallery' && targetPage) {
        const brochureGallery = targetPage.querySelector('.brochure-gallery-section');
        if (brochureGallery) {
          brochureGallery.classList.remove('animate-brochure');
          void brochureGallery.offsetWidth;
          brochureGallery.classList.add('animate-brochure');
        }
      }

      if (heroSection) {
        if (pageId === 'home') {
          heroSection.classList.remove('hidden');
        } else {
          heroSection.classList.add('hidden');
        }
      }

      if (history.pushState) {
        history.pushState(null, null, '#' + pageId);
      }

      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
          link.classList.add('active');
        }
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        const reveals = targetPage ? targetPage.querySelectorAll('.reveal-up, .reveal-left, .reveal-right') : [];
        reveals.forEach(el => {
          const elementTop = el.getBoundingClientRect().top;
          const windowHeight = window.innerHeight;
          if (elementTop < windowHeight - 100) {
            el.classList.add('active');
          }
        });
        
        // Re-initialize gallery if on gallery page
        if (pageId === 'gallery') {
          setTimeout(initializeGallery, 300);
        }
      }, 100);

      setTimeout(() => {
        if (pageChangeLoader) {
          pageChangeLoader.classList.remove('active');
        }
        isChangingPage = false;
      }, 400);

    }, 500);
  }

  // ===============================
  // Get Current Page
  // ===============================
  function getCurrentPage() {
    let current = 'home';
    navLinks.forEach(link => {
      if (link.classList.contains('active')) {
        current = link.getAttribute('data-page');
      }
    });
    allPages.forEach(page => {
      if (page.classList.contains('active') && page.id.startsWith('service-')) {
        current = page.id;
      }
    });
    return current;
  }

  // ===============================
  // Nav link click handler
  // ===============================
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      if (pageId) {
        if (pageId === 'services' && window.innerWidth <= 768) {
          if (navDropdown) navDropdown.classList.remove('active');
        }
        // Close mobile menu
        const nav = document.querySelector('.nav');
        const hamburger = document.querySelector('.hamburger-menu');
        if (nav) nav.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        switchPage(pageId);
      }
    });
  });

  // ===============================
  // Handle CTA button clicks
  // ===============================
  document.querySelectorAll('[data-page]').forEach(el => {
    if (el.tagName === 'A' && el.getAttribute('data-page')) {
      el.addEventListener('click', function(e) {
        const pageId = this.getAttribute('data-page');
        if (pageId && this.getAttribute('href')?.startsWith('#')) {
          e.preventDefault();
          switchPage(pageId);
            const scrollTarget = this.getAttribute('data-scroll-target');
            if (scrollTarget) {
              setTimeout(() => {
                const target = document.getElementById(scrollTarget);
                if (target) {
                  target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 700);
            }
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
      if (hash === 'gallery' && targetPage) {
        const brochureGallery = targetPage.querySelector('.brochure-gallery-section');
        if (brochureGallery) brochureGallery.classList.add('animate-brochure');
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
      
      // Initialize gallery if on gallery page
      if (hash === 'gallery') {
        setTimeout(initializeGallery, 500);
      }
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

  // ===============================
  // Handle browser back/forward
  // ===============================
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
  // MESSENGER BUTTON - Mobile Only
  // ===============================
  const messengerBtn = document.getElementById('messengerBtn');
  let isDragging = false;
  let initialX = 0, initialY = 0;
  let xOffset = 0, yOffset = 0;

  if (messengerBtn) {
    // Only initialize drag functionality on mobile
    function initMessengerDrag() {
      if (window.innerWidth > 768) {
        // On desktop, hide and disable drag
        messengerBtn.style.display = 'none';
        return;
      }
      
      // On mobile, show and enable drag
      messengerBtn.style.display = 'flex';
      
      // Set initial position
      messengerBtn.style.position = 'fixed';
      messengerBtn.style.left = '18px';
      messengerBtn.style.bottom = '18px';
      messengerBtn.style.top = 'auto';
      messengerBtn.style.right = 'auto';

      const rect = messengerBtn.getBoundingClientRect();
      xOffset = rect.left;
      yOffset = rect.top;

      function dragStart(e) {
        return;
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
        const maxX = window.innerWidth - btnRect.width - 10;
        const maxY = window.innerHeight - btnRect.height - 10;
        
        newX = Math.max(10, Math.min(newX, maxX));
        newY = Math.max(10, Math.min(newY, maxY));
        
        xOffset = newX;
        yOffset = newY;
        
        messengerBtn.style.position = 'fixed';
        messengerBtn.style.left = newX + 'px';
        messengerBtn.style.top = newY + 'px';
        messengerBtn.style.bottom = 'auto';
        messengerBtn.style.right = 'auto';
      }

      function dragEnd() {
        if (isDragging) {
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

      // Restore saved position
      try {
        const savedLeft = localStorage.getItem('messengerLeft');
        const savedTop = localStorage.getItem('messengerTop');
        if (savedLeft && savedTop) {
          const rect2 = messengerBtn.getBoundingClientRect();
          let left = parseFloat(savedLeft);
          let top = parseFloat(savedTop);
          const maxX = window.innerWidth - rect2.width - 10;
          const maxY = window.innerHeight - rect2.height - 10;
          left = Math.max(10, Math.min(left, maxX));
          top = Math.max(10, Math.min(top, maxY));
          messengerBtn.style.left = left + 'px';
          messengerBtn.style.top = top + 'px';
          messengerBtn.style.bottom = 'auto';
          messengerBtn.style.right = 'auto';
          xOffset = left;
          yOffset = top;
        }
      } catch (err) {}

      // Fix messenger position on resize
      function fixMessengerPosition() {
        const btnRect = messengerBtn.getBoundingClientRect();
        const maxX = window.innerWidth - btnRect.width - 10;
        const maxY = window.innerHeight - btnRect.height - 10;
        
        let left = parseFloat(messengerBtn.style.left) || 18;
        let top = parseFloat(messengerBtn.style.top) || (window.innerHeight - 80);
        
        if (left > maxX) left = maxX;
        if (top > maxY) top = maxY;
        if (left < 10) left = 10;
        if (top < 10) top = 10;
        
        messengerBtn.style.left = left + 'px';
        messengerBtn.style.top = top + 'px';
        xOffset = left;
        yOffset = top;
      }

      let resizeTimer;
      window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
          // Check if we should show/hide based on screen size
          if (window.innerWidth > 768) {
            messengerBtn.style.display = 'none';
          } else {
            messengerBtn.style.display = 'flex';
            fixMessengerPosition();
          }
          handleResize();
        }, 250);
      });
    }

    // Initialize on load
    initMessengerDrag();

    // Re-initialize on resize
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        messengerBtn.style.display = 'none';
      } else {
        messengerBtn.style.display = 'flex';
      }
    });
  }

  // ===============================
  // MOBILE HAMBURGER MENU
  // ===============================
  const navbar = document.querySelector('.navbar');
  const nav = document.querySelector('.nav');
  
  if (navbar && nav) {
    let hamburger = document.querySelector('.hamburger-menu');
    
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
    
    hamburger.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('active');
      this.classList.toggle('active', isOpen);
      this.setAttribute('aria-expanded', String(isOpen));
      
      if (navDropdown) navDropdown.classList.remove('active');
      
      if (nav.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    });
    
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (navDropdown) navDropdown.classList.remove('active');
      });
    });
    
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (!navbar.contains(e.target) && nav.classList.contains('active')) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
          if (navDropdown) navDropdown.classList.remove('active');
        }
      }
    });
  }

  // ===============================
  // Handle window resize
  // ===============================
  function handleResize() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger-menu');
    const dropdown = document.querySelector('.nav-dropdown');
    
    if (window.innerWidth > 768) {
      if (nav) nav.classList.remove('active');
      if (hamburger) hamburger.classList.remove('active');
      if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
      if (dropdown) dropdown.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  window.addEventListener('resize', handleResize);

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
  // GALLERY AUTO-PLAY
  // ===============================
  const galleryData = [
    { src: 'assets/images/hero.png', title: 'Marine Vessel', desc: 'Commercial ship at sea' },
    { src: 'assets/images/Main Engine & Generator Repairs.jpg', title: 'Ship Engine', desc: 'High-performance marine engine' },
    { src: 'assets/images/Cleaning Service.jpg', title: 'Boat Docking', desc: 'Vessel at port' },
    { src: 'assets/images/Underwater Services.jpg', title: 'Propeller System', desc: 'Marine propeller repair' },
    { src: 'assets/images/Crane & Deck Machinery Repair.jpg', title: 'Heavy Lift', desc: 'Industrial crane operations' },
    { src: 'assets/images/Electrical & Automation Services.jpg', title: 'Electrical Systems', desc: 'Marine electrical wiring' },
    { src: 'assets/images/Compressor Repair & Maintenance.jpg', title: 'Navigation Bridge', desc: 'Ship control room' },
    { src: 'assets/images/Safety Equipment Supply & Service.jpg', title: 'Safety Equipment', desc: 'Marine fire safety gear' }
  ];

  let currentGalleryIndex = 0;
  let galleryInterval = null;
  let galleryAutoPlay = true;

  function initGallery() {
    const galleryThumbs = document.getElementById('galleryThumbs');
    if (!galleryThumbs) return;
    
    galleryThumbs.innerHTML = '';
    
    galleryData.forEach((item, index) => {
      const thumbWrapper = document.createElement('div');
      thumbWrapper.className = 'gallery-thumb-wrapper';
      thumbWrapper.onclick = () => showGallerySlide(index);
      
      const thumb = document.createElement('img');
      thumb.src = item.src;
      thumb.alt = item.title;
      
      thumbWrapper.appendChild(thumb);
      galleryThumbs.appendChild(thumbWrapper);
      
      if (index === currentGalleryIndex) {
        thumbWrapper.classList.add('active');
      }
    });
  }

  function showGallerySlide(index) {
    const mainGalleryImage = document.getElementById('mainGalleryImage');
    const galleryCaption = document.getElementById('galleryCaption');
    const galleryThumbs = document.getElementById('galleryThumbs');
    
    if (!mainGalleryImage || !galleryCaption || !galleryThumbs) return;
    
    currentGalleryIndex = index;
    
    if (currentGalleryIndex >= galleryData.length) currentGalleryIndex = 0;
    if (currentGalleryIndex < 0) currentGalleryIndex = galleryData.length - 1;
    
    mainGalleryImage.style.opacity = '0';
    
    setTimeout(() => {
      mainGalleryImage.src = galleryData[currentGalleryIndex].src;
      mainGalleryImage.alt = galleryData[currentGalleryIndex].title;
      
      galleryCaption.querySelector('h4').textContent = galleryData[currentGalleryIndex].title;
      galleryCaption.querySelector('p').textContent = galleryData[currentGalleryIndex].desc;
      
      mainGalleryImage.style.opacity = '1';
      
      const thumbs = document.querySelectorAll('#galleryThumbs .gallery-thumb-wrapper');
      thumbs.forEach((thumb, i) => {
        thumb.classList.remove('active');
        if (i === currentGalleryIndex) thumb.classList.add('active');
      });
    }, 300);
  }

  function changeGallerySlide(direction) {
    showGallerySlide(currentGalleryIndex + direction);
  }

  function startGalleryAutoPlay() {
    if (galleryInterval) clearInterval(galleryInterval);
    
    galleryInterval = setInterval(() => {
      if (galleryAutoPlay) {
        showGallerySlide(currentGalleryIndex + 1);
      }
    }, 3000);
  }

  function stopGalleryAutoPlay() {
    if (galleryInterval) {
      clearInterval(galleryInterval);
      galleryInterval = null;
    }
  }

  function initializeGallery() {
    const mainGalleryImage = document.getElementById('mainGalleryImage');
    if (!mainGalleryImage) return;
    
    initGallery();
    startGalleryAutoPlay();
    
    const galleryMainView = document.querySelector('.gallery-main-view');
    if (galleryMainView) {
      galleryMainView.addEventListener('mouseenter', () => {
        galleryAutoPlay = false;
        stopGalleryAutoPlay();
      });
      
      galleryMainView.addEventListener('mouseleave', () => {
        galleryAutoPlay = true;
        startGalleryAutoPlay();
      });
      
      // Touch support for mobile
      let touchStartX = 0;
      let touchEndX = 0;
      let isTouching = false;
      
      galleryMainView.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        isTouching = true;
        galleryAutoPlay = false;
        stopGalleryAutoPlay();
      }, { passive: true });
      
      galleryMainView.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        isTouching = false;
        handleSwipe();
        setTimeout(() => {
          if (!isTouching) {
            galleryAutoPlay = true;
            startGalleryAutoPlay();
          }
        }, 5000);
      }, { passive: true });
      
      function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX - touchStartX;
        
        if (Math.abs(diff) > swipeThreshold) {
          if (diff > 0) {
            changeGallerySlide(-1);
          } else {
            changeGallerySlide(1);
          }
        }
      }
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (document.getElementById('gallery')?.classList.contains('active')) {
        if (e.key === 'ArrowLeft') {
          changeGallerySlide(-1);
        } else if (e.key === 'ArrowRight') {
          changeGallerySlide(1);
        }
      }
    });
  }

  // ===============================
  // FIX SERVICE IMAGES
  // ===============================
  function fixServiceImages() {
    const serviceImages = document.querySelectorAll('.service-detail-hero img');
    serviceImages.forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
      });
    });
  }

  // ===============================
  // INITIALIZE
  // ===============================
  handleHashOnLoad();
  setTimeout(revealOnScroll, 500);
  fixServiceImages();

  // Initialize gallery if present
  if (document.getElementById('mainGalleryImage')) {
    setTimeout(initializeGallery, 3000);
  }

  console.log('🚢 ALHAZ MARINE - Single Page App Loaded');
  console.log('📅 ' + new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }));
  console.log('📋 Services Available: 23+ Independent Pages');
  console.log('💡 Hover on "Services" menu to see dropdown');
  console.log('💡 Click on any service to view its dedicated page');
  console.log('✅ All responsive fixes applied');
});

// ============================================
// GLOBAL ERROR HANDLING
// ============================================
window.addEventListener('error', function(e) {
  console.log('⚠️ Error: ' + e.message);
});

console.log('🚢 ALHAZ MARINE - Complete JavaScript Loaded');
console.log('📸 Gallery Auto-Play: Active');
console.log('🔄 Service Navigation: Fixed');
console.log('📱 Fully Responsive: Yes');
