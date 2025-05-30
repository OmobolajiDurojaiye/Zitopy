"use strict";

// DOM Elements
const darkModeToggle = document.getElementById("dark-mode-toggle");
const menuOpenBtn = document.getElementById("menuOpen");
const menuCloseBtn = document.getElementById("menuClose");
const navLinks = document.getElementById("navLinks");
const header = document.querySelector("header");
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const testimonialSlider = document.getElementById("testimonialSlider");
const dots = document.querySelectorAll(".dot");
const countdownElement = document.getElementById("countdown");
const contactForm = document.getElementById("contactForm");

// Dark Mode Toggle
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeToggle.classList.replace("fa-moon", "fa-sun");
    localStorage.setItem("theme", "dark");
  } else {
    darkModeToggle.classList.replace("fa-sun", "fa-moon");
    localStorage.setItem("theme", "light");
  }
});

// Check saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.body.classList.add("dark-mode");
  darkModeToggle.classList.replace("fa-moon", "fa-sun");
}

// Mobile Menu
menuOpenBtn.addEventListener("click", () => {
  navLinks.classList.add("active");
});

menuCloseBtn.addEventListener("click", () => {
  navLinks.classList.remove("active");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  if (
    !navLinks.contains(e.target) &&
    !menuOpenBtn.contains(e.target) &&
    navLinks.classList.contains("active")
  ) {
    navLinks.classList.remove("active");
  }
});

// Dropdown functionality for mobile
const dropdowns = document.querySelectorAll(".dropdown");
dropdowns.forEach((dropdown) => {
  dropdown.addEventListener("click", function () {
    if (window.innerWidth <= 768) {
      this.classList.toggle("active");
      event.preventDefault();
    }
  });
});

// Header scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 100) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// Course Slider
let currentSlide = 0;
const courses = document.querySelectorAll(".course-card");

function showSlide(n) {
  if (window.innerWidth > 768) {
    // Do nothing for desktop - grid layout handles it
    return;
  }

  // For mobile, create a slideshow
  courses.forEach((course) => {
    course.style.display = "none";
  });

  currentSlide = (n + courses.length) % courses.length;
  courses[currentSlide].style.display = "block";
}

if (prevBtn && nextBtn) {
  prevBtn.addEventListener("click", () => {
    showSlide(currentSlide - 1);
  });

  nextBtn.addEventListener("click", () => {
    showSlide(currentSlide + 1);
  });
}

// Initialize course slider for mobile if needed
function initCoursesSlider() {
  if (window.innerWidth <= 768) {
    showSlide(0);
  } else {
    courses.forEach((course) => {
      course.style.display = "block";
    });
  }
}

window.addEventListener("resize", initCoursesSlider);
initCoursesSlider();

// Testimonial Slider
let currentTestimonial = 0;
const testimonials = document.querySelectorAll(".testimonial");

function showTestimonial(n) {
  testimonials.forEach((testimonial, index) => {
    testimonial.style.transform = `translateX(${(index - n) * 100}%)`;
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === n);
  });

  currentTestimonial = n;
}

if (dots.length > 0) {
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showTestimonial(index);
    });
  });
}

// Auto-rotate testimonials
let testimonialInterval;

function startTestimonialRotation() {
  testimonialInterval = setInterval(() => {
    showTestimonial((currentTestimonial + 1) % testimonials.length);
  }, 5000);
}

function resetTestimonialRotation() {
  clearInterval(testimonialInterval);
  startTestimonialRotation();
}

if (testimonialSlider) {
  showTestimonial(0);
  startTestimonialRotation();

  testimonialSlider.addEventListener("mouseenter", () => {
    clearInterval(testimonialInterval);
  });

  testimonialSlider.addEventListener("mouseleave", () => {
    resetTestimonialRotation();
  });
}

// Countdown Timer
function updateCountdown() {
  // Set the target date to June 1st of next year (summer camp)
  const currentYear = new Date().getFullYear();
  const targetDate = new Date(`June 1, ${currentYear + 1} 00:00:00`);
  const currentDate = new Date();
  const difference = targetDate - currentDate;

  if (difference <= 0) {
    if (countdownElement) {
      countdownElement.innerHTML = `
        <div class="countdown-item">
          <span>00</span>
          <span>Days</span>
        </div>
        <div class="countdown-item">
          <span>00</span>
          <span>Hours</span>
        </div>
        <div class="countdown-item">
          <span>00</span>
          <span>Minutes</span>
        </div>
        <div class="countdown-item">
          <span>00</span>
          <span>Seconds</span>
        </div>
      `;
    }
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  if (countdownElement) {
    document.getElementById("days").innerText = days
      .toString()
      .padStart(2, "0");
    document.getElementById("hours").innerText = hours
      .toString()
      .padStart(2, "0");
    document.getElementById("minutes").innerText = minutes
      .toString()
      .padStart(2, "0");
    document.getElementById("seconds").innerText = seconds
      .toString()
      .padStart(2, "0");
  }
}

if (countdownElement) {
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    if (
      this.getAttribute("href") === "#" ||
      this.parentElement.classList.contains("dropdown")
    )
      return;

    e.preventDefault();

    const targetId = this.getAttribute("href");
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      navLinks.classList.remove("active");

      window.scrollTo({
        top: targetElement.offsetTop - 100,
        behavior: "smooth",
      });
    }
  });
});

// Contact Form Submission
if (contactForm) {
  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get form values
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    // Basic form validation
    if (!name || !email || !message) {
      alert("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Here you would typically send the form data to a server
    // For demonstration, we'll just show a success message
    alert(
      `Thank you, ${name}! Your message has been received. We'll get back to you soon.`
    );
    contactForm.reset();
  });
}

// Handle animation on scroll
function revealOnScroll() {
  const elements = document.querySelectorAll(
    ".services-grid, .courses-slider, .solutions-grid, .testimonial, .summer-banner, .contact-wrapper"
  );

  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < window.innerHeight - elementVisible) {
      element.classList.add("visible");
    }
  });
}

// Add CSS for the reveal animation
const style = document.createElement("style");
style.textContent = `
  .services-grid, .courses-slider, .solutions-grid, .testimonial, .summer-banner, .contact-wrapper {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  
  .services-grid.visible, .courses-slider.visible, .solutions-grid.visible, 
  .testimonial.visible, .summer-banner.visible, .contact-wrapper.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;
document.head.appendChild(style);

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Initialize AOS (Animate on Scroll) like functionality
document.addEventListener("DOMContentLoaded", function () {
  // Stagger animations for grid items
  const staggeredItems = document.querySelectorAll(
    ".service-card, .course-card, .solution-card"
  );

  staggeredItems.forEach((item, index) => {
    item.style.transitionDelay = `${index * 0.1}s`;
  });

  revealOnScroll();
});
