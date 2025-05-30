"use strict";

// Modern Landing Page Interactive Features
class ModernLandingPage {
  constructor() {
    this.init();
  }

  init() {
    this.setupLoadingScreen();
    this.setupThemeToggle();
    this.setupMobileNavigation();
    this.setupScrollEffects();
    this.setupSmoothScrolling();
    this.setupParticleSystem();
    this.setupAnimations();
    this.setupFormHandling();
    this.setupCursorFollower();
    this.setupTiltEffects();
    this.setupTypewriterEffect();
    this.setupGlitchEffect();
    this.setupBackToTop();
    this.setupHeaderScrollEffect(); // Ensure this is called
    this.setupRevealAnimations();
  }

  // Loading Screen
  setupLoadingScreen() {
    // This part is fine, it creates the element and uses CSS for styling initially.
    const loadingScreen = document.createElement("div");
    loadingScreen.className = "loading-screen";
    loadingScreen.innerHTML = `
            <div class="loader"></div>
            <div class="loading-text">Loading Amazing Experience...</div>
        `;
    document.body.appendChild(loadingScreen);

    window.addEventListener("load", () => {
      setTimeout(() => {
        loadingScreen.classList.add("hidden");
        setTimeout(() => {
          loadingScreen.remove();
        }, 500);
      }, 1500); // Adjusted to see if it was too short
    });
  }

  // Theme Toggle
  setupThemeToggle() {
    const themeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-mode");
      themeToggle.className = "fas fa-sun";
    } else {
      // Ensure it's moon if light or no preference
      themeToggle.className = "fas fa-moon";
    }

    themeToggle.addEventListener("click", () => {
      body.classList.toggle("dark-mode");

      if (body.classList.contains("dark-mode")) {
        themeToggle.className = "fas fa-sun";
        localStorage.setItem("theme", "dark");
      } else {
        themeToggle.className = "fas fa-moon";
        localStorage.setItem("theme", "light");
      }
      // Manually trigger header background update if needed, or rely on observer
      this.updateHeaderStyles(); // Call a method to update header styles immediately
    });
  }

  // Mobile Navigation
  setupMobileNavigation() {
    const menuOpen = document.getElementById("menuOpen");
    const menuClose = document.getElementById("menuClose");
    const navLinks = document.getElementById("navLinks");

    if (!menuOpen || !menuClose || !navLinks) {
      console.error("Mobile navigation elements not found!");
      return;
    }
    const navLinksItems = navLinks.querySelectorAll("a");

    menuOpen.addEventListener("click", () => {
      navLinks.classList.add("active");
      document.body.style.overflow = "hidden";
    });

    menuClose.addEventListener("click", () => {
      navLinks.classList.remove("active");
      document.body.style.overflow = "auto";
    });

    // Close menu when clicking on a link
    navLinksItems.forEach((link) => {
      link.addEventListener("click", () => {
        if (navLinks.classList.contains("active")) {
          navLinks.classList.remove("active");
          document.body.style.overflow = "auto";
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener("click", (e) => {
      if (
        navLinks.classList.contains("active") &&
        !navLinks.contains(e.target) &&
        !menuOpen.contains(e.target)
      ) {
        navLinks.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }

  // Scroll Effects
  setupScrollEffects() {
    // Create scroll progress bar
    const scrollProgress = document.createElement("div");
    scrollProgress.className = "scroll-progress";
    document.body.appendChild(scrollProgress);

    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const maxHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      scrollProgress.style.width = progress + "%";
    });

    // Navbar scroll effect is handled by setupHeaderScrollEffect
  }

  // Method to update header styles (used by theme toggle and scroll)
  updateHeaderStyles() {
    const header = document.querySelector(".header");
    if (!header) return;

    const currentScrollY = window.scrollY;
    const isDarkMode = document.body.classList.contains("dark-mode");

    // Default states (top of page)
    let bg = isDarkMode
      ? "rgba(18, 18, 18, 0.95)"
      : "rgba(255, 255, 255, 0.95)";

    // Scrolled states
    if (currentScrollY > 100) {
      bg = isDarkMode ? "rgba(18, 18, 18, 0.85)" : "rgba(255, 255, 255, 0.85)";
    }

    header.style.background = bg;
    header.style.backdropFilter = "blur(20px)"; // Consistently applied
  }

  // Header Scroll Effect
  setupHeaderScrollEffect() {
    const header = document.querySelector(".header");
    if (!header) return;

    let lastScrollY = window.scrollY;

    // Initial style update
    this.updateHeaderStyles();

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY;

      this.updateHeaderStyles(); // Update background based on scroll and theme

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
    });

    // Observe body class changes for theme toggle
    const observer = new MutationObserver((mutationsList) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          this.updateHeaderStyles(); // Update header when body class (theme) changes
        }
      }
    });
    observer.observe(document.body, { attributes: true });
  }

  // Smooth Scrolling
  setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault();
        const targetId = this.getAttribute("href");
        // Fix for href="#" or href="#/" if used for top links
        const targetElement =
          targetId === "#" || targetId === "#/"
            ? document.body
            : document.querySelector(targetId);

        if (targetElement) {
          // For body, scroll to top
          if (targetElement === document.body) {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            targetElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }
      });
    });
  }

  // Particle System
  setupParticleSystem() {
    const hero = document.querySelector(".hero");
    if (!hero) return; // Guard clause
    const particles = document.createElement("div");
    particles.className = "particles";
    hero.appendChild(particles);

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 20 + "s";
      particle.style.animationDuration = Math.random() * 20 + 10 + "s"; // Corrected: was Math.random() * 20 + 10 + "s"
      particles.appendChild(particle);
    }
  }

  // Animations
  setupAnimations() {
    // Floating shapes animation enhancement
    const shapes = document.querySelectorAll(".shape");
    shapes.forEach((shape, index) => {
      shape.addEventListener("mouseenter", () => {
        shape.style.transform = "scale(1.2) rotate(45deg)";
        shape.style.opacity = "0.3";
      });

      shape.addEventListener("mouseleave", () => {
        shape.style.transform = "scale(1) rotate(0deg)"; // Reset to original animation state is better
        shape.style.opacity = "0.1";
      });
    });

    // Card hover effects (CSS handles this better with :hover and transitions)
    // The JS version here might conflict or be redundant with CSS :hover transforms.
    // If CSS handles it, remove this JS part. For now, keeping as it was.
    const cards = document.querySelectorAll(
      ".service-card, .course-card, .solution-card"
    );
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        // card.style.transform = "translateY(-15px) scale(1.02)"; // This will override CSS tilt
      });

      card.addEventListener("mouseleave", () => {
        // card.style.transform = "translateY(0) scale(1)"; // This will override CSS tilt
      });
    });
  }

  // // Form Handling
  // setupFormHandling() {
  //   const form = document.getElementById("contactForm");
  //   if (form) {
  //     form.addEventListener("submit", (e) => {
  //       e.preventDefault();

  //       // Get form data
  //       const formData = new FormData(form);
  //       const data = Object.fromEntries(formData);

  //       // Show success message (without AJAX)
  //       this.showNotification(
  //         "Message sent successfully! We'll get back to you soon.",
  //         "success"
  //       );

  //       // Reset form
  //       form.reset();

  //       // Remove floating labels by ensuring they revert to placeholder state
  //       const inputs = form.querySelectorAll("input, select, textarea");
  //       inputs.forEach((input) => {
  //         const label = input.nextElementSibling;
  //         if (label && label.tagName === "LABEL") {
  //           // Trigger blur to reset label if field is empty
  //           input.dispatchEvent(new Event("blur"));
  //         }
  //       });
  //     });

  //     // Form field animations (label floating)
  //     const inputs = form.querySelectorAll("input, select, textarea");
  //     inputs.forEach((input) => {
  //       const label = input.nextElementSibling; // Assuming label is always next sibling
  //       if (label && label.tagName === "LABEL") {
  //         input.addEventListener("focus", () => {
  //           label.style.top = "-0.5rem";
  //           label.style.fontSize = "0.8rem";
  //           label.style.color = "var(--primary-blue)";
  //         });

  //         input.addEventListener("blur", () => {
  //           if (
  //             (!input.value && input.tagName !== "SELECT") ||
  //             (input.tagName === "SELECT" && input.value === "")
  //           ) {
  //             label.style.top = "1rem";
  //             label.style.fontSize = "1rem"; // Ensure this matches the initial CSS state for the label
  //             label.style.color = "var(--text-secondary)";
  //           } else {
  //             // If has value, keep label floated
  //             label.style.top = "-0.5rem";
  //             label.style.fontSize = "0.8rem";
  //             label.style.color = "var(--primary-blue)";
  //           }
  //         });
  //         // Initial check for pre-filled values (e.g. on page refresh with form data preserved)
  //         if (
  //           (input.value && input.tagName !== "SELECT") ||
  //           (input.tagName === "SELECT" && input.value !== "")
  //         ) {
  //           label.style.top = "-0.5rem";
  //           label.style.fontSize = "0.8rem";
  //           label.style.color = "var(--primary-blue)";
  //         }
  //       }
  //     });
  //   }
  // }

  // Notification System
  showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${
                  type === "success" ? "check-circle" : "info-circle"
                }"></i>
                <span>${message}</span>
            </div>
        `;

    // Add notification styles (these are fine to be dynamic)
    notification.style.cssText = `
            position: fixed;
            top: 80px; /* Adjusted to be below fixed header */
            right: 20px;
            background: ${
              type === "success" ? "var(--primary-blue)" : "#f39c12"
            };
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: var(--card-shadow);
            z-index: 10000;
            transform: translateX(120%); /* Start further off-screen */
            transition: transform 0.3s ease-in-out;
        `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.style.transform = "translateX(0)";
    }, 100);

    // Animate out
    setTimeout(() => {
      notification.style.transform = "translateX(120%)";
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 5000);
  }

  // Cursor Follower
  setupCursorFollower() {
    const cursor = document.createElement("div");
    cursor.className = "cursor-follower";
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    const speed = 0.1; // Smoothing factor

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      const dx = mouseX - cursorX;
      const dy = mouseY - cursorY;

      cursorX += dx * speed;
      cursorY += dy * speed;

      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`; // Use translate3d and combine transforms

      requestAnimationFrame(updateCursor);
    }
    if (window.innerWidth >= 768) {
      // Only run if not on typical touch devices
      updateCursor();
    } else {
      cursor.style.display = "none";
    }
    window.addEventListener("resize", () => {
      if (window.innerWidth < 768) {
        cursor.style.display = "none";
        // Potentially cancel animation frame if active
      } else {
        cursor.style.display = "block"; // Or its original display
        // Potentially restart animation frame if previously cancelled
      }
    });
  }

  // Tilt Effects
  setupTiltEffects() {
    const tiltElements = document.querySelectorAll(
      ".hero-card, .service-card, .course-card" // Removed .solution-card if CSS handles it better
    );

    tiltElements.forEach((element) => {
      element.addEventListener("mousemove", (e) => {
        if (window.innerWidth < 1024) return; // Disable on smaller screens / tablets

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20; // Reduced intensity
        const rotateY = (centerX - x) / 20; // Reduced intensity

        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`; // Slightly reduced scale
      });

      element.addEventListener("mouseleave", () => {
        if (window.innerWidth < 1024) return;
        element.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
      });
    });
  }

  // Typewriter Effect
  setupTypewriterEffect() {
    const heroTitle =
      document.querySelector(".hero-title .text-gradient-blue")
        ?.parentElement || document.querySelector(".hero-title"); // Target the whole title
    if (heroTitle) {
      // Store original HTML to preserve spans
      const originalHTML = heroTitle.innerHTML;
      const textContentForTyping = heroTitle.textContent || ""; // Get text content for length calculation
      heroTitle.innerHTML = ""; // Clear it
      heroTitle.classList.add("typewriter"); // Add class for caret
      heroTitle.style.borderRightColor = "var(--primary-blue)"; // Set caret color via JS initially

      let charIndex = 0;
      function type() {
        if (charIndex < textContentForTyping.length) {
          // This is tricky: to restore HTML correctly char by char.
          // Simpler: type text then restore HTML, or type text only.
          // For now, let's type text content.
          heroTitle.textContent += textContentForTyping.charAt(charIndex);
          charIndex++;
          setTimeout(type, 50);
        } else {
          heroTitle.innerHTML = originalHTML; // Restore original HTML with spans
          heroTitle.style.borderRight = "none"; // Remove caret
          heroTitle.classList.remove("typewriter");
        }
      }
      // Delay typing to allow loading screen to finish
      setTimeout(type, 2000); // Start after loading screen
    }
  }

  // Glitch Effect
  setupGlitchEffect() {
    const techWords = document.querySelectorAll(
      ".text-gradient-blue, .text-gradient-yellow"
    );

    techWords.forEach((word) => {
      word.addEventListener("mouseenter", () => {
        word.classList.add("glitch");
        word.setAttribute("data-text", word.textContent);

        // Glitch effect in CSS is infinite, so it doesn't need JS to remove it after timeout
        // If you want it to stop, then use JS timeout to remove class.
        // For now, assuming CSS handles the animation loop.
      });
      word.addEventListener("mouseleave", () => {
        word.classList.remove("glitch"); // Remove glitch on mouse leave
      });
    });
  }

  // Back to Top Button
  setupBackToTop() {
    const backToTop = document.createElement("div");
    backToTop.className = "back-to-top"; // Class from CSS
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        backToTop.classList.add("visible");
      } else {
        backToTop.classList.remove("visible");
      }
    });

    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Reveal Animations
  setupRevealAnimations() {
    const reveals = document.querySelectorAll(
      ".service-card, .course-card, .solution-card, .zms-feature, .contact-item, .hero-text, .hero-visual, .section-header" // Added more elements for reveal
    );

    reveals.forEach((element) => {
      element.classList.add("reveal"); // Add class for initial state
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        // Added observer to unobserve
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target); // Unobserve after revealed
          }
        });
      },
      {
        threshold: 0.1, // Adjust as needed
        rootMargin: "0px 0px -50px 0px", // Start animation a bit before it's fully in view
      }
    );

    reveals.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  // Stats Counter Animation
  setupStatsCounter() {
    const stats = document.querySelectorAll(".stat-number");

    const countUp = (element, targetValueText) => {
      const target = parseInt(targetValueText.replace(/\D/g, "")); // Remove non-digits
      const suffix = targetValueText.replace(/\d/g, ""); // Get suffix like '+' or '%'

      let current = 0;
      const increment = Math.max(1, Math.ceil(target / 100)); // Ensure increment is at least 1

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target + suffix;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current) + suffix;
        }
      }, 20); // Adjust speed if needed
    };

    const statsObserver = new IntersectionObserver(
      (entries, observer) => {
        // Added observer to unobserve
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // const target = parseInt(entry.target.textContent.replace('+', '').replace('%', '')); // Get original number
            countUp(entry.target, entry.target.textContent); // Pass original text content
            observer.unobserve(entry.target); // Unobserve after animation starts
          }
        });
      },
      { threshold: 0.8 }
    ); // Trigger when 80% visible

    stats.forEach((stat) => {
      statsObserver.observe(stat);
    });
  }

  // Advanced Scroll Animations (Parallax for hero shapes)
  setupAdvancedScrollAnimations() {
    const heroShapes = document.querySelectorAll(".hero .shape"); // More specific selector

    window.addEventListener("scroll", () => {
      if (window.innerWidth < 768) return; // Disable on mobile for performance

      const scrolled = window.pageYOffset;

      heroShapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1; // Different speed for each shape
        // Modify the existing float animation by adding a scroll-dependent transform
        // This is complex as it interacts with existing CSS animations.
        // A simpler parallax would be to directly set transform based on scroll.
        // shape.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05 * (index % 2 === 0 ? 1 : -1)}deg)`;
        // The above would override the CSS float. A better way is to have separate parallax elements or adjust existing animation properties.
        // For now, let's keep it simple and not over-engineer if the CSS float is primary.
      });
    });
  }

  // Performance Optimization
  setupPerformanceOptimizations() {
    // Throttle scroll events for complex operations (if any beyond basic ones)
    // Basic scroll listeners like progress bar are usually fine.

    // Lazy load images (HTML needs data-src and a placeholder src)
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src"); // Remove data-src
          // img.classList.remove("lazy"); // If you have a .lazy class for styling
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const landingPage = new ModernLandingPage();

  // Initialize additional features that might depend on the main class setup
  landingPage.setupStatsCounter();
  landingPage.setupAdvancedScrollAnimations();
  landingPage.setupPerformanceOptimizations();

  // Add CSS styles dynamically for enhanced effects
  // CAREFUL: Many of these are already in home.css. Duplicating or overriding can cause issues.
  // The preloader color issue was caused by this block.
  const style = document.createElement("style");
  style.textContent = `
        /* REMOVED: Loading Screen, Loader, Loading Text CSS from here as it's in home.css and caused color issue */
        
        /* Scroll Progress Bar - Already in home.css, ensure consistency or remove from one place */
        /* .scroll-progress { ... } */
        
        /* Particles - Already in home.css */
        /* .particles { ... } */
        /* .particle { ... } */
        
        /* Cursor Follower - Already in home.css */
        /* .cursor-follower { ... } */
        
        /* Typewriter Effect - CSS for caret is in home.css */
        /* .typewriter { ... } */
        
        /* Glitch Effect - Already in home.css */
        /* .glitch { ... } */
        
        /* Back to Top Button - Already in home.css */
        /* .back-to-top { ... } */
        
        /* Reveal Animations - Already in home.css */
        /* .reveal { ... } */
        
        /* Notification - These styles are fine here as they are for JS-generated element */
        .notification {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification .notification-content { /* Added for better structure */
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }

        .notification.success { /* Example custom type, though JS sets background directly */
            /* background: linear-gradient(135deg, #28a745, #20c997); */
        }
        
        .notification.info {  /* Example custom type */
            /* background: linear-gradient(135deg, #17a2b8, #007bff); */
        }
        
        /* Enhanced Card Animations - Prefer CSS :hover for these for performance and simplicity */
        /* .service-card, .course-card, .solution-card { ... } */
        
        /* Responsive Enhancements - Already in home.css media queries */
        /* @media (max-width: 768px) { ... } */
        
        /* Dark Mode Enhancements - Already in home.css */
        /* .dark-mode .particle { ... } */
        
        /* Performance Optimizations (will-change) - Can be in home.css */
        /* * { will-change: auto; } */
        
        /* Smooth Transitions for header - Already in home.css */
        /* .header { ... } */
        
        /* Interactive Elements Enhancement (btn ripple) - JS now adds ripple, keyframes below */
        /* .btn::before { ... } */ /* Original btn::before is for shine effect, keep it */
        
        /* Form Enhancements (label float) - Already in home.css and handled by JS focus/blur */
        /* .form-group label { ... } */

        /* Ripple effect for interactive elements */
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none; /* Crucial */
        }

        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        /* Ensure dark mode scroll progress matches other dark mode elements if needed */
        .dark-mode .scroll-progress {
             background: linear-gradient(90deg, var(--primary-blue), var(--primary-yellow)); /* Or a specific dark mode gradient */
        }
    `;

  document.head.appendChild(style);

  // Add smooth entrance animation for page elements
  const animateOnLoad = () => {
    const elements = document.querySelectorAll(
      ".hero-content > *, .hero-visual"
    ); // Target children of hero-content
    elements.forEach((element, index) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = `all 0.6s ease ${index * 0.1}s`; // Staggered delay

      setTimeout(() => {
        // This timeout should align with the CSS transition delay
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 1600 + index * 100); // Start after loading screen (1500ms) + a bit
    });
  };

  // Initialize entrance animations
  // setTimeout(animateOnLoad, 100); // This was too early, let load event handle it better
  window.addEventListener("load", () => {
    setTimeout(animateOnLoad, 100); // Small delay after load
  });

  // Enhanced keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      // Close mobile menu
      const navLinks = document.getElementById("navLinks");
      const menuClose = document.getElementById("menuClose"); // Get the close button
      if (navLinks && navLinks.classList.contains("active") && menuClose) {
        menuClose.click(); // Simulate click on close button to ensure all cleanup happens
      }
    }
  });

  // Touch gesture support for mobile (Example - not fully implemented for actions)
  let touchStartY = 0;
  let touchEndY = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  ); // Passive for performance

  document.addEventListener(
    "touchend",
    (e) => {
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const swipeThreshold = 100; // Min distance for a swipe
    const diff = touchStartY - touchEndY;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe up
        // console.log("Swipe up detected");
      } else {
        // Swipe down
        // console.log("Swipe down detected");
      }
    }
  }

  // Easter egg - Konami code
  let konamiCode = "";
  const targetCode =
    "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA"; // String of e.code

  document.addEventListener("keydown", (e) => {
    konamiCode += e.code;
    // Trim konamiCode if it gets longer than targetCode
    if (konamiCode.length > targetCode.length) {
      konamiCode = konamiCode.substring(konamiCode.length - targetCode.length);
    }

    if (konamiCode === targetCode) {
      // Easter egg activated
      document.body.style.animation = "rainbowFilter 2s infinite"; // Use filter for broader compatibility
      landingPage.showNotification(
        "🎉 Konami Activated! Enjoy the colors!",
        "success"
      );

      // Add rainbow animation style
      const rainbowStyle = document.createElement("style");
      rainbowStyle.textContent = `
                @keyframes rainbowFilter {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
      if (!document.getElementById("rainbow-style")) {
        // Prevent multiple appends
        rainbowStyle.id = "rainbow-style";
        document.head.appendChild(rainbowStyle);
      }

      konamiCode = ""; // Reset code

      setTimeout(() => {
        document.body.style.animation = "";
        const existingRainbowStyle = document.getElementById("rainbow-style");
        if (existingRainbowStyle) existingRainbowStyle.remove();
      }, 10000); // Turn off after 10 seconds
    }
  });

  // Add visual feedback (ripple) for interactive elements
  const interactiveElements = document.querySelectorAll(
    "button, .btn, a.nav-link, .service-link, .social-link, .footer-social a, .theme-toggle, .back-to-top"
    // ".service-card, .course-card" // Ripples on large cards can be distracting
  );
  interactiveElements.forEach((element) => {
    // Ensure parent is positioned for absolute children if not already
    if (getComputedStyle(element).position === "static") {
      element.style.position = "relative";
    }
    element.style.overflow = "hidden"; // Contain ripple

    element.addEventListener("mousedown", function (e) {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple"); // Class for styling from JS-added CSS

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      // Calculate click position relative to the element
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      this.appendChild(ripple);

      // Clean up ripple element after animation
      ripple.addEventListener("animationend", () => {
        ripple.remove();
      });
    });
  });

  // Performance monitoring (optional)
  if ("performance" in window && "getEntriesByType" in performance) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        // Ensure all load events have fired
        const navEntries = performance.getEntriesByType("navigation");
        if (navEntries.length > 0) {
          const perfData = navEntries[0];
          if (perfData.loadEventEnd > 0 && perfData.fetchStart > 0) {
            console.log(
              "Page Load Time:",
              Math.round(perfData.loadEventEnd - perfData.fetchStart),
              "ms"
            );
          }
        }
      }, 0);
    });
  }
});
