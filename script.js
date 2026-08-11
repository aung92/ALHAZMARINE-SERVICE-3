// ===============================
// SCROLL REVEAL ANIMATION
// ===============================
const reveals = document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right");

function revealOnScroll() {
    const windowHeight = window.innerHeight;

    reveals.forEach((el) => {
        const elementTop = el.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);


// ===============================
// SMOOTH SCROLL NAVIGATION
// ===============================
document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});


// ===============================
// STICKY HEADER EFFECT
// ===============================
const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
        header.style.background = "rgba(0, 48, 73, 0.9)";
        header.style.backdropFilter = "blur(10px)";
        header.style.padding = "15px 0";
    } else {
        header.style.background = "transparent";
        header.style.backdropFilter = "none";
        header.style.padding = "30px 0";
    }
});


// ===============================
// BACK TO TOP BUTTON
// ===============================
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        backToTop.classList.add("show");
    } else {
        backToTop.classList.remove("show");
    }
});


// ===============================
// PARALLAX EFFECT (EXTRA SMOOTH)
// ===============================
const hero = document.querySelector(".hero-parallax");

window.addEventListener("scroll", () => {
    if (hero) {
        const scrollY = window.scrollY;
        hero.style.backgroundPositionY = scrollY * 0.5 + "px";
    }
});


// ===============================
// TESTIMONIAL SLIDER WITH 5 REVIEWERS
// ===============================
const testimonials = document.querySelectorAll(".test-item");
let index = 0;
let intervalId = null;

function showTestimonial() {
    if (!testimonials.length) return;
    testimonials.forEach(t => t.style.display = "none");
    if (testimonials[index]) {
        testimonials[index].style.display = "block";
        testimonials[index].style.animation = 'none';
        testimonials[index].offsetHeight;
        testimonials[index].style.animation = 'fadeSlide 0.5s ease-out';
    }
}

function nextTestimonial() {
    if (testimonials.length > 0) {
        index = (index + 1) % testimonials.length;
        showTestimonial();
    }
}

if (testimonials.length > 0) {
    showTestimonial();
    intervalId = setInterval(nextTestimonial, 4000);
}

const sliderContainer = document.querySelector(".testimonials-slider");
if (sliderContainer && testimonials.length > 0) {
    sliderContainer.addEventListener("mouseenter", () => {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    });
    sliderContainer.addEventListener("mouseleave", () => {
        if (!intervalId) {
            intervalId = setInterval(nextTestimonial, 4000);
        }
    });
}


// ===============================
// CONTACT FORM HANDLING (No PHP Required)
// ===============================
const contactForm = document.getElementById('creative-contact');
const formStatus = document.getElementById('formStatus');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        // Show status message while submitting
        const submitBtn = this.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        formStatus.className = 'form-status';
        formStatus.style.display = 'none';
        
        // The form will submit normally to FormSubmit.co
        // We'll show success message after form submission
        // Note: FormSubmit.co redirects to the _next URL
        
        // Since FormSubmit.co redirects, we can't use AJAX here.
        // Instead, we'll let the form submit normally.
        // The user will be redirected to the success page.
        
        // Show a brief status before redirect
        formStatus.className = 'form-status success';
        formStatus.textContent = '✅ Sending your message... Please wait.';
        formStatus.style.display = 'block';
        
        // Re-enable button after 3 seconds (in case of issues)
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 3000);
        
        // The form will naturally submit to FormSubmit.co
        // No need to prevent default
    });
}


// ===============================
// PHONE NUMBER FORMATTING (Optional)
// ===============================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function() {
        // Remove all non-numeric characters except +
        this.value = this.value.replace(/[^\d+]/g, '');
    });
}


// ===============================
// FLOATING MESSENGER BUTTON (DRAGGABLE)
// ===============================
const messengerBtn = document.getElementById('messengerBtn');
let isDragging = false;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

if (messengerBtn) {
    const rect = messengerBtn.getBoundingClientRect();
    xOffset = rect.left;
    yOffset = rect.top;
    
    messengerBtn.addEventListener('mousedown', dragStart);
    messengerBtn.addEventListener('touchstart', dragStart, { passive: false });
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    
    messengerBtn.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            isDragging = false;
            return;
        }
        
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
}

function dragStart(e) {
    if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    
    if (e.target === messengerBtn || messengerBtn.contains(e.target)) {
        isDragging = true;
        messengerBtn.classList.add('dragging');
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        let clientX, clientY;
        
        if (e.type === 'touchmove') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        let newX = clientX - initialX;
        let newY = clientY - initialY;
        
        const btnRect = messengerBtn.getBoundingClientRect();
        const maxX = window.innerWidth - btnRect.width;
        const maxY = window.innerHeight - btnRect.height;
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        xOffset = newX;
        yOffset = newY;
        
        messengerBtn.style.position = 'fixed';
        messengerBtn.style.left = `${newX}px`;
        messengerBtn.style.top = `${newY}px`;
        messengerBtn.style.bottom = 'auto';
        messengerBtn.style.right = 'auto';
    }
}

function dragEnd(e) {
    isDragging = false;
    messengerBtn.classList.remove('dragging');
    
    if (messengerBtn.style.left) {
        localStorage.setItem('messengerLeft', messengerBtn.style.left);
        localStorage.setItem('messengerTop', messengerBtn.style.top);
    }
}

window.addEventListener('load', () => {
    if (messengerBtn) {
        const savedLeft = localStorage.getItem('messengerLeft');
        const savedTop = localStorage.getItem('messengerTop');
        
        if (savedLeft && savedTop && window.innerWidth <= 768) {
            messengerBtn.style.position = 'fixed';
            messengerBtn.style.left = savedLeft;
            messengerBtn.style.top = savedTop;
            messengerBtn.style.bottom = 'auto';
            messengerBtn.style.right = 'auto';
            
            const rect = messengerBtn.getBoundingClientRect();
            xOffset = rect.left;
            yOffset = rect.top;
        }
    }
});

let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (messengerBtn && window.innerWidth <= 768) {
            const btnRect = messengerBtn.getBoundingClientRect();
            const maxX = window.innerWidth - btnRect.width;
            const maxY = window.innerHeight - btnRect.height;
            
            let newLeft = parseFloat(messengerBtn.style.left);
            let newTop = parseFloat(messengerBtn.style.top);
            
            if (isNaN(newLeft)) newLeft = 30;
            if (isNaN(newTop)) newTop = window.innerHeight - 80;
            
            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));
            
            messengerBtn.style.left = `${newLeft}px`;
            messengerBtn.style.top = `${newTop}px`;
            
            xOffset = newLeft;
            yOffset = newTop;
        }
    }, 100);
});


// ===============================
// TOP BAR - ADJUST HEADER POSITION
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    const topBar = document.querySelector('.top-bar');
    const header = document.querySelector('.header');
    
    if (topBar && header) {
        const topBarHeight = topBar.offsetHeight;
        header.style.top = topBarHeight + 'px';
        
        window.addEventListener('resize', function() {
            const newTopBarHeight = topBar.offsetHeight;
            header.style.top = newTopBarHeight + 'px';
        });
    }
});