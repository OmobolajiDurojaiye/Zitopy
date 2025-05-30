"use strict";

document.addEventListener("DOMContentLoaded", function () {
  // Theme toggle functionality
  const darkModeToggle = document.getElementById("dark-mode-toggle");
  const body = document.body;

  // Check for saved theme preference or respect OS theme
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = localStorage.getItem("theme");

  if (currentTheme === "dark" || (!currentTheme && prefersDarkScheme.matches)) {
    body.classList.add("dark-mode");
  }

  darkModeToggle.addEventListener("click", function () {
    body.classList.toggle("dark-mode");

    // Save preference to localStorage
    if (body.classList.contains("dark-mode")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });

  // Tab switching functionality
  const tabs = document.querySelectorAll(".tab");
  const forms = document.querySelectorAll(".auth-form");

  tabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      const target = this.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      // Show corresponding form
      forms.forEach((form) => {
        form.classList.remove("active");
        if (form.id === `${target}-form`) {
          form.classList.add("active");
        }
      });
    });
  });

  // Password visibility toggle
  const togglePasswordButtons = document.querySelectorAll(".toggle-password");

  togglePasswordButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const input = this.previousElementSibling;

      // Toggle password visibility
      if (input.type === "password") {
        input.type = "text";
        this.classList.replace("fa-eye-slash", "fa-eye");
      } else {
        input.type = "password";
        this.classList.replace("fa-eye", "fa-eye-slash");
      }
    });
  });

  // Form validation and submission
  const signupForm = document.getElementById("signup-form");
  const loginForm = document.getElementById("login-form");

  if (signupForm) {
    signupForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Basic validation
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirm-password").value;

      if (password !== confirmPassword) {
        showError("confirm-password", "Passwords do not match");
        return;
      }

      // Show success message and simulate submission
      showSuccess(
        "signup-form",
        "Account created successfully! Redirecting..."
      );

      // In a real application, you would send the form data to your server
      setTimeout(() => {
        console.log("Signup form submitted");
        // Redirect to dashboard or show welcome message
      }, 2000);
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // Show success message and simulate login
      showSuccess("login-form", "Login successful! Redirecting...");

      // In a real application, you would authenticate with your server
      setTimeout(() => {
        console.log("Login form submitted");
        // Redirect to dashboard
      }, 2000);
    });
  }

  // Utility functions for form validation
  function showError(inputId, message) {
    const input = document.getElementById(inputId);
    const formGroup = input.closest(".form-group");

    // Remove any existing error message
    const existingError = formGroup.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create and append error message
    const errorElement = document.createElement("div");
    errorElement.className = "error-message";
    errorElement.textContent = message;
    errorElement.style.color = "var(--error-color)";
    errorElement.style.fontSize = "12px";
    errorElement.style.marginTop = "5px";

    formGroup.appendChild(errorElement);

    // Highlight input
    input.style.borderColor = "var(--error-color)";

    // Remove error after 3 seconds
    setTimeout(() => {
      if (errorElement.parentNode) {
        errorElement.remove();
        input.style.borderColor = "";
      }
    }, 3000);
  }

  function showSuccess(formId, message) {
    const form = document.getElementById(formId);

    // Create and append success message
    const successElement = document.createElement("div");
    successElement.className = "success-message";
    successElement.textContent = message;
    successElement.style.color = "var(--success-color)";
    successElement.style.fontSize = "14px";
    successElement.style.padding = "10px";
    successElement.style.backgroundColor = body.classList.contains("dark-mode")
      ? "#1a2e1a"
      : "#e8f5e9";
    successElement.style.borderRadius = "8px";
    successElement.style.marginTop = "10px";
    successElement.style.textAlign = "center";

    form.appendChild(successElement);
  }

  // Animation on page load
  const authContainer = document.querySelector(".auth-container");

  setTimeout(() => {
    authContainer.style.opacity = "1";
    authContainer.style.transform = "translateY(0)";
  }, 100);

  // Additional interactive effects
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      const icon = this.previousElementSibling;
      if (icon && icon.tagName === "I") {
        icon.style.color = body.classList.contains("dark-mode")
          ? "var(--primary-yellow)"
          : "var(--primary-blue)";
      }
    });

    input.addEventListener("blur", function () {
      const icon = this.previousElementSibling;
      if (icon && icon.tagName === "I") {
        icon.style.color = "#999";
      }
    });
  });

  // Social buttons hover effect
  const socialButtons = document.querySelectorAll(".btn-social");

  socialButtons.forEach((button) => {
    button.addEventListener("mouseenter", function () {
      const icon = this.querySelector("i");
      icon.style.transition = "transform 0.3s ease";
      icon.style.transform = "scale(1.2)";
    });

    button.addEventListener("mouseleave", function () {
      const icon = this.querySelector("i");
      icon.style.transform = "scale(1)";
    });
  });

  // Animate background shapes
  const shapes = document.querySelectorAll(".shape");

  function animateShapes() {
    shapes.forEach((shape, index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const duration = 3 + index;

      shape.style.animation = `floatAnimation${index} ${duration}s infinite alternate ease-in-out`;

      // Create keyframe animation
      const keyframes = `
                @keyframes floatAnimation${index} {
                    0% {
                        transform: translate(0, 0) rotate(0deg);
                    }
                    100% {
                        transform: translate(${direction * 10}px, ${
        5 + index * 2
      }px) rotate(${direction * 5}deg);
                    }
                }
            `;

      // Add animation to document
      const styleSheet = document.createElement("style");
      styleSheet.textContent = keyframes;
      document.head.appendChild(styleSheet);
    });
  }

  animateShapes();
});
