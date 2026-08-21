/* ============================================
   ALHAZ MARINE - SCRIPT.JS
   Single Page Navigation with Loader
   Version: 2.0 (Complete)
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
  // DROPDOWN - Hover to show/hide
  // ===============================
  const navDropdown = document.querySelector('.nav-dropdown');
  let dropdownTimeout = null;
  let isHovering = false;

  if (navDropdown) {
    navDropdown.addEventListener('mouseenter', function(e) {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
        dropdownTimeout = null;
      }
      isHovering = true;
      if (window.innerWidth > 768) {
        this.classList.add('active');
      }
    });
    
    navDropdown.addEventListener('mouseleave', function(e) {
      isHovering = false;
      if (window.innerWidth > 768) {
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
  // MESSENGER BUTTON (Draggable)
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
      this.classList.toggle('active');
      nav.classList.toggle('active');
      
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
        document.body.style.overflow = '';
        if (navDropdown) navDropdown.classList.remove('active');
      });
    });
    
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        if (!navbar.contains(e.target) && nav.classList.contains('active')) {
          nav.classList.remove('active');
          hamburger.classList.remove('active');
          document.body.style.overflow = '';
          if (navDropdown) navDropdown.classList.remove('active');
        }
      }
    });
    
    window.addEventListener('resize', function() {
      if (window.innerWidth > 768) {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        document.body.style.overflow = '';
        if (navDropdown) navDropdown.classList.remove('active');
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
});

// ============================================
// FIXED GALLERY AUTO-PLAY COURSEL LOGIC
// ============================================
const galleryData = [
  { src: 'assets/images/hero.png', title: 'Marine Vessel', desc: 'Commercial ship at sea' },
  { src: 'assets/images/engine.jpg', title: 'Ship Engine', desc: 'High-performance marine engine' },
  { src: 'assets/images/cleaning.jpg', title: 'Boat Docking', desc: 'Vessel at port' },
  { src: 'assets/images/underwater.jpg', title: 'Propeller System', desc: 'Marine propeller repair' },
  { src: 'assets/images/crane.jpg', title: 'Heavy Lift', desc: 'Industrial crane operations' },
  { src: 'assets/images/automation.jpg', title: 'Electrical Systems', desc: 'Marine electrical wiring' },
  { src: 'assets/images/compressor.jpg', title: 'Navigation Bridge', desc: 'Ship control room' },
  { src: 'assets/images/safety.jpg', title: 'Safety Equipment', desc: 'Marine fire safety gear' }
];

let currentGalleryIndex = 0;
let galleryInterval = null;
let galleryAutoPlay = true;

// Function to initialize gallery thumbnails
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

// Function to show specific gallery slide
function showGallerySlide(index) {
  const mainGalleryImage = document.getElementById('mainGalleryImage');
  const galleryCaption = document.getElementById('galleryCaption');
  const galleryThumbs = document.getElementById('galleryThumbs');
  
  if (!mainGalleryImage || !galleryCaption || !galleryThumbs) return;
  
  currentGalleryIndex = index;
  
  // Wrap around
  if (currentGalleryIndex >= galleryData.length) currentGalleryIndex = 0;
  if (currentGalleryIndex < 0) currentGalleryIndex = galleryData.length - 1;
  
  // Fade out
  mainGalleryImage.style.opacity = '0';
  
  setTimeout(() => {
    // Update main image
    mainGalleryImage.src = galleryData[currentGalleryIndex].src;
    mainGalleryImage.alt = galleryData[currentGalleryIndex].title;
    
    // Update caption
    galleryCaption.querySelector('h4').textContent = galleryData[currentGalleryIndex].title;
    galleryCaption.querySelector('p').textContent = galleryData[currentGalleryIndex].desc;
    
    // Fade in
    mainGalleryImage.style.opacity = '1';
    
    // Update thumbnails
    const thumbs = document.querySelectorAll('#galleryThumbs .gallery-thumb-wrapper');
    thumbs.forEach((thumb, i) => {
      thumb.classList.remove('active');
      if (i === currentGalleryIndex) thumb.classList.add('active');
    });
  }, 300);
}

// Function to change gallery slide (for arrows)
function changeGallerySlide(direction) {
  showGallerySlide(currentGalleryIndex + direction);
}

// Auto-play function
function startGalleryAutoPlay() {
  if (galleryInterval) clearInterval(galleryInterval);
  
  galleryInterval = setInterval(() => {
    if (galleryAutoPlay) {
      showGallerySlide(currentGalleryIndex + 1);
    }
  }, 3000);
}

// Stop auto-play
function stopGalleryAutoPlay() {
  if (galleryInterval) {
    clearInterval(galleryInterval);
    galleryInterval = null;
  }
}

// Initialize gallery
function initializeGallery() {
  const mainGalleryImage = document.getElementById('mainGalleryImage');
  
  if (!mainGalleryImage) return;
  
  initGallery();
  startGalleryAutoPlay();
  
  // Pause on hover
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
  }
  
  // Touch swipe support for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  
  galleryMainView.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  galleryMainView.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swiped right - go to previous
        changeGallerySlide(-1);
      } else {
        // Swiped left - go to next
        changeGallerySlide(1);
      }
    }
  }
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      changeGallerySlide(-1);
    } else if (e.key === 'ArrowRight') {
      changeGallerySlide(1);
    }
  });
}

// ============================================
// FIXED SERVICE PAGE NAVIGATION
// ============================================

// Override the switchPage function for better service page handling
const originalSwitchPage = window.switchPage;

// Create a new switchPage function
window.switchPage = function(pageId) {
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
        initializeGallery();
      }
    }, 100);

    setTimeout(() => {
      if (pageChangeLoader) {
        pageChangeLoader.classList.remove('active');
      }
      isChangingPage = false;
    }, 400);

  }, 500);
};

// ============================================
// FIX FOR MESSENGER BUTTON DRAGGING
// ============================================

// Override messenger button click handler
const messengerBtn = document.getElementById('messengerBtn');
if (messengerBtn) {
  // Remove old click handler
  const oldMessengerClick = messengerBtn.onclick;
  messengerBtn.onclick = null;
  
  // Add new click handler
  messengerBtn.addEventListener('click', function(e) {
    if (isDragging) {
      e.preventDefault();
      isDragging = false;
      return;
    }
    
    // Navigate to contact page
    if (getCurrentPage() !== 'contact') {
      window.switchPage('contact');
    }
  });
}

// ============================================
// FIX FOR DROPDOWN LINKS
// ============================================

// Update dropdown link click handlers
document.querySelectorAll('.dropdown-menu a[data-page]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const pageId = this.getAttribute('data-page');
    
    if (pageId) {
      const nav = document.querySelector('.nav');
      const hamburger = document.querySelector('.hamburger-menu');
      if (nav) nav.classList.remove('active');
      if (hamburger) hamburger.classList.remove('active');
      if (navDropdown) {
        navDropdown.classList.remove('active');
        if (dropdownTimeout) {
          clearTimeout(dropdownTimeout);
          dropdownTimeout = null;
        }
      }
      document.body.style.overflow = '';
      window.switchPage(pageId);
    }
  });
});

// ============================================
// FIX FOR SERVICE LIST LINKS
// ============================================

// Update service list link click handlers
document.querySelectorAll('.service-list-link[data-page]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const pageId = this.getAttribute('data-page');
    if (pageId) {
      window.switchPage(pageId);
    }
  });
});

// ============================================
// FIX FOR SERVICE CARD LINKS
// ============================================

// Update service card link click handlers
document.querySelectorAll('.service-link[data-page]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const pageId = this.getAttribute('data-page');
    if (pageId) {
      window.switchPage(pageId);
    }
  });
});

// ============================================
// FIX FOR CTA BUTTONS
// ============================================

// Update CTA button click handlers
document.querySelectorAll('.btn[data-page]').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const pageId = this.getAttribute('data-page');
    if (pageId) {
      window.switchPage(pageId);
    }
  });
});

// ============================================
// FIX FOR LOGO CLICK
// ============================================

// Update logo click handler
const logoLink = document.getElementById('logoLink');
if (logoLink) {
  logoLink.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const pageId = this.getAttribute('data-page');
    if (pageId && pageId !== getCurrentPage()) {
      window.switchPage(pageId);
    } else if (pageId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ============================================
// INITIALIZE GALLERY ON PAGE LOAD
// ============================================

// Call initializeGallery after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  // Check if gallery is present and initialize
  if (document.getElementById('mainGalleryImage')) {
    setTimeout(() => {
      initializeGallery();
    }, 2500); // Wait for page loader to finish
  }
  
  // Also check if gallery is loaded via hash
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash === 'gallery' || currentHash === '') {
    setTimeout(() => {
      initializeGallery();
    }, 3000);
  }
});

// ============================================
// FIX FOR URL HASH NAVIGATION
// ============================================

// Override handleHashOnLoad
function handleHashOnLoadFixed() {
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
    
    // Initialize gallery if on gallery page
    if (hash === 'gallery') {
      setTimeout(() => {
        initializeGallery();
      }, 500);
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

// Replace old handleHashOnLoad with fixed version
window.handleHashOnLoad = handleHashOnLoadFixed;

// ============================================
// FIX FOR INITIAL LOAD
// ============================================

// Override the initialization
const originalInit = window.addEventListener('DOMContentLoaded', function() {
  handleHashOnLoad();
  setTimeout(revealOnScroll, 500);
});

// Add our fixes
document.addEventListener('DOMContentLoaded', function() {
  // Initialize gallery if present
  if (document.getElementById('mainGalleryImage')) {
    setTimeout(() => {
      initializeGallery();
    }, 3000);
  }
  
  console.log('✅ Gallery Auto-Play Initialized');
  console.log('✅ Service Page Navigation Fixed');
});

// ============================================
// GLOBAL ERROR HANDLING
// ============================================

window.addEventListener('error', function(e) {
  console.log('⚠️ Error: ' + e.message);
});

// ============================================
// FINAL CONSOLE LOG
// ============================================

console.log('🚢 ALHAZ MARINE - Updated JavaScript Loaded');
console.log('📸 Gallery Auto-Play: Active');
console.log('🔄 Service Navigation: Fixed');
console.log('💡 Hover on Gallery to pause auto-play');