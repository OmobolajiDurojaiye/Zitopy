"use strict";

// DOM Elements
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const themeText = themeToggle.querySelector("span");
const courseCards = document.querySelectorAll(".course-card");
const upcomingCards = document.querySelectorAll(".upcoming-card");
const achievementCards = document.querySelectorAll(".achievement-card");
const recommendedCards = document.querySelectorAll(".recommended-card");
const sidebarLinks = document.querySelectorAll(".sidebar-menu a");
const body = document.body;

// Theme Toggle Functionality
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");

  if (body.classList.contains("dark-mode")) {
    themeIcon.classList.replace("fa-moon", "fa-sun");
    if (themeText) themeText.textContent = "Light Mode";
    localStorage.setItem("zitopy-theme", "dark");
  } else {
    themeIcon.classList.replace("fa-sun", "fa-moon");
    if (themeText) themeText.textContent = "Dark Mode";
    localStorage.setItem("zitopy-theme", "light");
  }
});

// Check for saved theme preference
const savedTheme = localStorage.getItem("zitopy-theme");
if (savedTheme === "dark") {
  body.classList.add("dark-mode");
  themeIcon.classList.replace("fa-moon", "fa-sun");
  if (themeText) themeText.textContent = "Light Mode";
}

// Navigation Active State
sidebarLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    // Remove active class from all links
    sidebarLinks.forEach((link) => {
      link.parentElement.classList.remove("active");
    });

    // Add active class to clicked link
    this.parentElement.classList.add("active");
  });
});

// Add hover effects for cards
function addHoverEffects(cards) {
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = body.classList.contains("dark-mode")
        ? "0 12px 30px rgba(0, 0, 0, 0.4)"
        : "0 12px 30px rgba(0, 0, 0, 0.15)";
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = body.classList.contains("dark-mode")
        ? "0 8px 30px rgba(0, 0, 0, 0.3)"
        : "0 8px 30px rgba(0, 0, 0, 0.1)";
    });
  });
}

// Apply hover effects
addHoverEffects(courseCards);
addHoverEffects(upcomingCards);
addHoverEffects(achievementCards);
addHoverEffects(recommendedCards);

// Header profile dropdown
const headerProfile = document.querySelector(".header-profile");
if (headerProfile) {
  headerProfile.addEventListener("click", () => {
    // Create dropdown menu if it doesn't exist
    let dropdown = document.querySelector(".profile-dropdown");

    if (!dropdown) {
      dropdown = document.createElement("div");
      dropdown.className = "profile-dropdown";
      dropdown.innerHTML = `
        <ul>
          <li><a href="#"><i class="fas fa-user"></i> My Profile</a></li>
          <li><a href="#"><i class="fas fa-cog"></i> Settings</a></li>
          <li><a href="#"><i class="fas fa-question-circle"></i> Help Center</a></li>
          <li><a href="#" class="logout-option"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
        </ul>
      `;

      // Style the dropdown
      dropdown.style.position = "absolute";
      dropdown.style.top = "60px";
      dropdown.style.right = "2rem";
      dropdown.style.background = body.classList.contains("dark-mode")
        ? "#1e1e1e"
        : "#ffffff";
      dropdown.style.borderRadius = "10px";
      dropdown.style.boxShadow = body.classList.contains("dark-mode")
        ? "0 10px 30px rgba(0, 0, 0, 0.3)"
        : "0 10px 30px rgba(0, 0, 0, 0.1)";
      dropdown.style.minWidth = "200px";
      dropdown.style.zIndex = "100";
      dropdown.style.overflow = "hidden";
      dropdown.style.animation = "fadeIn 0.3s ease forwards";

      // Style the list
      const dropdownList = dropdown.querySelector("ul");
      dropdownList.style.listStyle = "none";
      dropdownList.style.padding = "0";
      dropdownList.style.margin = "0";

      // Style list items
      const listItems = dropdown.querySelectorAll("li");
      listItems.forEach((item) => {
        item.style.borderBottom = body.classList.contains("dark-mode")
          ? "1px solid #2d2d2d"
          : "1px solid #e0e0e0";

        const link = item.querySelector("a");
        link.style.display = "flex";
        link.style.alignItems = "center";
        link.style.padding = "1rem";
        link.style.textDecoration = "none";
        link.style.color = body.classList.contains("dark-mode")
          ? "#ffffff"
          : "#333333";
        link.style.transition = "background-color 0.3s ease";

        link.addEventListener("mouseenter", () => {
          link.style.backgroundColor = body.classList.contains("dark-mode")
            ? "rgba(255, 255, 255, 0.05)"
            : "rgba(0, 71, 165, 0.05)";
        });

        link.addEventListener("mouseleave", () => {
          link.style.backgroundColor = "transparent";
        });

        const icon = link.querySelector("i");
        icon.style.marginRight = "0.75rem";
      });

      // Style logout option
      const logoutOption = dropdown.querySelector(".logout-option");
      logoutOption.style.color = "#ff5555";

      document.querySelector(".dashboard-header").appendChild(dropdown);

      // Close dropdown when clicking outside
      document.addEventListener("click", (e) => {
        if (!headerProfile.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.remove();
        }
      });
    } else {
      dropdown.remove();
    }
  });
}

// Course Card Actions
courseCards.forEach((card) => {
  const continueBtn = card.querySelector(".continue-btn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      // This would typically navigate to the course content page
      // For demo purposes, we'll just show an alert
      alert("Continuing to course content...");
      // window.location.href = "/course/content-page.html";
    });
  }
});

// Notification bell action
const notificationBell = document.querySelector(".notification-bell");
if (notificationBell) {
  notificationBell.addEventListener("click", () => {
    // Create notifications panel if it doesn't exist
    let notificationsPanel = document.querySelector(".notifications-panel");

    if (!notificationsPanel) {
      notificationsPanel = document.createElement("div");
      notificationsPanel.className = "notifications-panel";
      notificationsPanel.innerHTML = `
        <div class="notifications-header">
          <h3>Notifications</h3>
          <button class="mark-all-read">Mark all as read</button>
        </div>
        <div class="notifications-list">
          <div class="notification-item unread">
            <div class="notification-icon"><i class="fas fa-bell"></i></div>
            <div class="notification-content">
              <p>New lesson available in <strong>Web Development Fundamentals</strong></p>
              <span class="notification-time">2 hours ago</span>
            </div>
          </div>
          <div class="notification-item unread">
            <div class="notification-icon"><i class="fas fa-trophy"></i></div>
            <div class="notification-content">
              <p>You've earned the <strong>7-Day Streak</strong> achievement!</p>
              <span class="notification-time">1 day ago</span>
            </div>
          </div>
          <div class="notification-item">
            <div class="notification-icon"><i class="fas fa-comment-alt"></i></div>
            <div class="notification-content">
              <p>Your instructor replied to your question in <strong>Blockchain Development</strong></p>
              <span class="notification-time">3 days ago</span>
            </div>
          </div>
        </div>
        <div class="notifications-footer">
          <a href="#">View all notifications</a>
        </div>
      `;

      // Style the panel
      notificationsPanel.style.position = "absolute";
      notificationsPanel.style.top = "60px";
      notificationsPanel.style.right = "2rem";
      notificationsPanel.style.background = body.classList.contains("dark-mode")
        ? "#1e1e1e"
        : "#ffffff";
      notificationsPanel.style.borderRadius = "10px";
      notificationsPanel.style.boxShadow = body.classList.contains("dark-mode")
        ? "0 10px 30px rgba(0, 0, 0, 0.3)"
        : "0 10px 30px rgba(0, 0, 0, 0.1)";
      notificationsPanel.style.width = "350px";
      notificationsPanel.style.maxHeight = "500px";
      notificationsPanel.style.overflowY = "auto";
      notificationsPanel.style.zIndex = "100";
      notificationsPanel.style.animation = "fadeIn 0.3s ease forwards";

      // Style the header
      const header = notificationsPanel.querySelector(".notifications-header");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.alignItems = "center";
      header.style.padding = "1rem";
      header.style.borderBottom = body.classList.contains("dark-mode")
        ? "1px solid #2d2d2d"
        : "1px solid #e0e0e0";

      header.querySelector("h3").style.margin = "0";
      header.querySelector("h3").style.fontSize = "1.1rem";

      const markAllBtn = header.querySelector(".mark-all-read");
      markAllBtn.style.background = "none";
      markAllBtn.style.border = "none";
      markAllBtn.style.color = "#0047a5";
      markAllBtn.style.cursor = "pointer";
      markAllBtn.style.fontSize = "0.85rem";

      // Style notifications list
      const notificationsList = notificationsPanel.querySelector(
        ".notifications-list"
      );
      notificationsList.style.padding = "0";

      // Style individual notifications
      const notifications =
        notificationsPanel.querySelectorAll(".notification-item");
      notifications.forEach((item) => {
        item.style.display = "flex";
        item.style.padding = "1rem";
        item.style.borderBottom = body.classList.contains("dark-mode")
          ? "1px solid #2d2d2d"
          : "1px solid #e0e0e0";
        item.style.transition = "background-color 0.3s ease";

        if (item.classList.contains("unread")) {
          item.style.backgroundColor = body.classList.contains("dark-mode")
            ? "rgba(0, 71, 165, 0.1)"
            : "rgba(0, 71, 165, 0.05)";
        }

        const icon = item.querySelector(".notification-icon");
        icon.style.width = "40px";
        icon.style.height = "40px";
        icon.style.borderRadius = "50%";
        icon.style.backgroundColor = "#0047a5";
        icon.style.display = "flex";
        icon.style.alignItems = "center";
        icon.style.justifyContent = "center";
        icon.style.marginRight = "1rem";
        icon.style.color = "white";

        const content = item.querySelector(".notification-content");
        content.style.flexGrow = "1";

        const time = item.querySelector(".notification-time");
        time.style.display = "block";
        time.style.fontSize = "0.8rem";
        time.style.color = "#6c757d";
        time.style.marginTop = "0.25rem";
      });

      // Style footer
      const footer = notificationsPanel.querySelector(".notifications-footer");
      footer.style.padding = "1rem";
      footer.style.textAlign = "center";

      const footerLink = footer.querySelector("a");
      footerLink.style.color = "#0047a5";
      footerLink.style.textDecoration = "none";
      footerLink.style.fontSize = "0.9rem";

      document
        .querySelector(".dashboard-header")
        .appendChild(notificationsPanel);

      // Add mark all as read functionality
      markAllBtn.addEventListener("click", () => {
        notifications.forEach((item) => {
          item.classList.remove("unread");
          item.style.backgroundColor = "transparent";
        });

        // Remove the notification indicator
        document.querySelector(".notification-indicator").style.display =
          "none";
      });

      // Close panel when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !notificationBell.contains(e.target) &&
          !notificationsPanel.contains(e.target)
        ) {
          notificationsPanel.remove();
        }
      });
    } else {
      notificationsPanel.remove();
    }
  });
}

// Join button functionality for upcoming sessions
const joinButtons = document.querySelectorAll(".join-btn");
joinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // This would typically navigate to the session page or launch a video call
    // For demo purposes, we'll just show an alert
    const sessionTitle = button
      .closest(".upcoming-card")
      .querySelector("h4").textContent;
    alert(`Joining session: ${sessionTitle}`);
  });
});

// Enroll button functionality
const enrollButtons = document.querySelectorAll(".enroll-btn");
enrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    // This would typically handle course enrollment
    // For demo purposes, we'll just show an alert
    const courseTitle = button
      .closest(".recommended-card")
      .querySelector("h3").textContent;
    alert(`Enrolling in: ${courseTitle}`);
  });
});

// Add staggered animation to cards
function animateWithDelay(elements, baseDelay = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.style.opacity = "0";
      element.style.transform = "translateY(20px)";

      setTimeout(() => {
        element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
        element.style.opacity = "1";
        element.style.transform = "translateY(0)";
      }, 50);
    }, index * baseDelay);
  });
}

// Initialize animations
document.addEventListener("DOMContentLoaded", () => {
  // Animate cards with staggered delay
  animateWithDelay(courseCards);
  animateWithDelay(upcomingCards, 150);
  animateWithDelay(achievementCards, 150);
  animateWithDelay(recommendedCards, 200);
});

// Handle responsive behavior for sidebar
const windowWidth = window.innerWidth;
if (windowWidth <= 768) {
  // Add functionality to show/hide sidebar on mobile
  const sidebarToggle = document.createElement("button");
  sidebarToggle.className = "sidebar-toggle";
  sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';

  // Style the toggle button
  sidebarToggle.style.position = "fixed";
  sidebarToggle.style.top = "20px";
  sidebarToggle.style.left = "20px";
  sidebarToggle.style.zIndex = "200";
  sidebarToggle.style.background = body.classList.contains("dark-mode")
    ? "#1e1e1e"
    : "#ffffff";
  sidebarToggle.style.border = "none";
  sidebarToggle.style.borderRadius = "50%";
  sidebarToggle.style.width = "40px";
  sidebarToggle.style.height = "40px";
  sidebarToggle.style.display = "flex";
  sidebarToggle.style.alignItems = "center";
  sidebarToggle.style.justifyContent = "center";
  sidebarToggle.style.boxShadow = body.classList.contains("dark-mode")
    ? "0 4px 12px rgba(0, 0, 0, 0.3)"
    : "0 4px 12px rgba(0, 0, 0, 0.1)";
  sidebarToggle.style.cursor = "pointer";

  document.body.appendChild(sidebarToggle);

  const sidebar = document.querySelector(".sidebar");

  sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-mobile-active");

    if (sidebar.classList.contains("sidebar-mobile-active")) {
      sidebar.style.transform = "translateX(0)";
      sidebar.style.boxShadow = "0 0 15px rgba(0, 0, 0, 0.2)";
    } else {
      sidebar.style.transform = "translateX(-100%)";
      sidebar.style.boxShadow = "none";
    }
  });

  // Add styles for mobile sidebar
  const style = document.createElement("style");
  style.textContent = `
    @media (max-width: 768px) {
      .sidebar {
        transform: translateX(-100%);
        z-index: 100;
      }
      
      .sidebar-mobile-active {
        transform: translateX(0) !important;
      }
      
      .main-content {
        margin-left: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Close sidebar when clicking a link
  sidebarLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("sidebar-mobile-active");
        sidebar.style.transform = "translateX(-100%)";
        sidebar.style.boxShadow = "none";
      }
    });
  });
}
