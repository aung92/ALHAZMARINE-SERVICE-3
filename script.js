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
// CONTACT FORM SUBMIT
// ===============================
const form = document.getElementById("creative-contact");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        alert("✅ Message Sent Successfully!");

        form.reset();
    });
}


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
// SIMPLE TESTIMONIAL SLIDER AUTO
// ===============================
const testimonials = document.querySelectorAll(".test-item");
let index = 0;

function showTestimonial() {
    testimonials.forEach(t => t.style.display = "none");
    if (testimonials[index]) {
        testimonials[index].style.display = "block";
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
    setInterval(nextTestimonial, 4000);
}