"use strict";

const CART_KEY = "zitopyCart";

// --- Cart Management ---
const getCart = () => {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartUI();
  renderCartPreview();
};

const addToCart = (coursePlan) => {
  const cart = getCart();
  // A user can only enroll in one course at a time.
  // Check if the course (identified by id) is already in the cart.
  const existingItem = cart.find((item) => item.id === coursePlan.id);

  if (existingItem) {
    showNotification(
      `'${coursePlan.name}' is already in your cart. To choose a different plan, please remove it first.`,
      "info"
    );
    return;
  }

  cart.push(coursePlan);
  saveCart(cart);
  showNotification(
    `'${coursePlan.name} (${coursePlan.planName})' added to cart!`,
    "success"
  );

  const cartPreview = document.getElementById("cart-preview");
  if (cartPreview && !cartPreview.classList.contains("active")) {
    cartPreview.classList.add("active");
  }
};

const removeFromCart = (courseId) => {
  let cart = getCart();
  const courseName =
    cart.find((item) => item.id === courseId)?.name || "Course";
  cart = cart.filter((item) => item.id !== courseId);
  saveCart(cart);
  showNotification(`'${courseName}' removed from cart.`, "info");

  // If on checkout page, re-render the summary
  if (document.getElementById("summary-items-container")) {
    renderCheckoutSummary();
  }
};

// --- UI Updates ---
const updateCartUI = () => {
  const cart = getCart();
  const cartBadges = document.querySelectorAll(".cart-badge");
  cartBadges.forEach((badge) => {
    badge.textContent = cart.length;
    badge.style.display = cart.length > 0 ? "flex" : "none";
  });
};

const recalculateTotal = () => {
  const totalEl = document.getElementById("summary-total-price");
  const cartItemsInput = document.getElementById("cart-items-input");
  const placeOrderBtn = document.getElementById("place-order-btn");

  if (!totalEl || !cartItemsInput || !placeOrderBtn) return;

  const cart = getCart();
  const grandTotal = cart.reduce((total, item) => total + item.price, 0);

  // Update Grand Total and Form Input
  totalEl.textContent = `₦${grandTotal.toLocaleString()}`;
  cartItemsInput.value = JSON.stringify(cart);

  if (cart.length > 0) {
    placeOrderBtn.disabled = false;
  } else {
    placeOrderBtn.disabled = true;
    totalEl.textContent = "₦0";
  }
};

const renderCheckoutSummary = () => {
  const container = document.getElementById("summary-items-container");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `
      <p class="empty-cart-message">
        Your cart is empty. 
        <a href="${window.location.origin}/#courses">Add a program</a> to continue.
      </p>`;
  } else {
    cart.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "summary-item";
      itemEl.dataset.courseId = item.id;

      const priceText =
        item.duration === "per month"
          ? `₦${item.price.toLocaleString()}/mo`
          : `₦${item.price.toLocaleString()}`;

      itemEl.innerHTML = `
        <div class="item-details">
          <span class="item-title">${item.name}</span>
          <span class="item-plan">${item.planName} (${item.duration})</span>
        </div>
        <span class="item-price">${priceText}</span>
        <button class="remove-item-btn" data-course-id="${item.id}" title="Remove Item">×</button>
      `;
      container.appendChild(itemEl);
    });
  }
  recalculateTotal();
};

const renderCartPreview = () => {
  const previewBox = document.getElementById("cart-preview");
  const itemsContainer = document.getElementById("cart-preview-items");
  const totalPriceEl = document.getElementById("cart-preview-total-price");

  if (!previewBox || !itemsContainer || !totalPriceEl) return;

  const cart = getCart();
  itemsContainer.innerHTML = "";

  if (cart.length === 0) {
    itemsContainer.innerHTML =
      '<p class="empty-message">Your cart is empty.</p>';
    totalPriceEl.textContent = "₦0";
    if (previewBox.classList.contains("active")) {
      previewBox.classList.remove("active");
    }
  } else {
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    cart.forEach((item) => {
      const itemEl = document.createElement("div");
      itemEl.className = "cart-preview-item";
      const priceText = item.duration === "per month" ? "/mo" : "total";

      itemEl.innerHTML = `
        <div class="cart-preview-item-details">
            <span class="cart-preview-item-name">${item.name}</span>
            <span class="cart-preview-item-plan">${item.planName}</span>
        </div>
        <span class="item-price">₦${item.price.toLocaleString()}${priceText}</span>
      `;
      itemsContainer.appendChild(itemEl);
    });
    totalPriceEl.textContent = `₦${total.toLocaleString()}`;
  }
};

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  // Add-to-cart buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const coursePlan = {
        id: parseInt(e.currentTarget.dataset.courseId, 10),
        name: e.currentTarget.dataset.courseName,
        planName: e.currentTarget.dataset.planName,
        price: parseInt(e.currentTarget.dataset.planPrice, 10),
        duration: e.currentTarget.dataset.planDuration,
      };
      addToCart(coursePlan);
    });
  });

  // Global click listener for remove buttons
  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("remove-item-btn")) {
      const courseId = parseInt(e.target.dataset.courseId, 10);
      removeFromCart(courseId);
    }
  });

  // Close cart preview
  const closeCartPreviewBtn = document.getElementById("close-cart-preview");
  if (closeCartPreviewBtn) {
    closeCartPreviewBtn.addEventListener("click", () => {
      const previewBox = document.getElementById("cart-preview");
      if (previewBox) {
        previewBox.classList.remove("active");
      }
    });
  }

  // Checkout form submission
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      const cart = getCart();
      if (cart.length === 0) {
        e.preventDefault();
        showNotification("Cannot place an order with an empty cart.", "error");
        return;
      }
      // Clear the cart on successful submission to prevent re-ordering
      localStorage.removeItem(CART_KEY);
    });
  }

  // --- Initialization ---
  updateCartUI();
  renderCartPreview();
  if (document.querySelector(".checkout-section")) {
    renderCheckoutSummary();
  }
});

// --- Helper Functions ---
function showNotification(message, type = "info") {
  const container = document.querySelector(".flash-messages");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `client-flash-message ${type}`;
  notification.textContent = message;
  container.insertBefore(notification, container.firstChild);

  setTimeout(() => {
    notification.style.opacity = 1;
    notification.style.transform = "translateY(0)";
  }, 10);

  setTimeout(() => {
    notification.style.opacity = 0;
    notification.style.transform = "translateY(-20px)";
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}
