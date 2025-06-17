"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const CART_KEY = "zitopyCart";

  // --- Cart Management ---
  const getCart = () => {
    const cart = localStorage.getItem(CART_KEY);
    return cart ? JSON.parse(cart) : [];
  };

  const saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartUI();
    renderCartPreview(); // Update preview box whenever cart is saved
  };

  const addToCart = (course) => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === course.id);

    if (existingItem) {
      // Course is already in the cart
      showNotification(`'${course.name}' is already in your cart.`, "info");
      return;
    }

    cart.push(course);
    saveCart(cart);
    showNotification(`'${course.name}' added to cart!`, "success");

    // Explicitly show the preview box on add
    const cartPreview = document.getElementById("cart-preview");
    if (cartPreview) {
      cartPreview.classList.add("active");
    }
  };

  const removeFromCart = (courseId) => {
    let cart = getCart();
    const courseName =
      cart.find((item) => item.id === courseId)?.name || "Course";
    cart = cart.filter((item) => item.id !== courseId);
    saveCart(cart); // This will call renderCartPreview()
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
    if (cartBadges.length > 0) {
      cartBadges.forEach((badge) => {
        badge.textContent = cart.length;
        badge.style.display = cart.length > 0 ? "flex" : "none";
      });
    }
  };

  const renderCheckoutSummary = () => {
    const container = document.getElementById("summary-items-container");
    const totalEl = document.getElementById("summary-total-price");
    const placeOrderBtn = document.getElementById("place-order-btn");
    const cartItemsInput = document.getElementById("cart-items-input");
    const cart = getCart();

    if (!container || !totalEl || !placeOrderBtn || !cartItemsInput) return;

    container.innerHTML = ""; // Clear previous content

    if (cart.length === 0) {
      container.innerHTML = `
                <p class="empty-cart-message">
                    Your cart is empty. 
                    <a href="${window.location.origin}/#courses">Add courses</a> to continue.
                </p>`;
      placeOrderBtn.disabled = true;
      placeOrderBtn.style.opacity = "0.5";
      totalEl.textContent = `₦0`;
    } else {
      let total = 0;
      cart.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "summary-item";
        itemEl.innerHTML = `
                    <div class="item-details">
                        <span class="item-title">${item.name}</span>
                        <span class="item-price">₦${item.price.toLocaleString()}</span>
                    </div>
                    <button class="remove-item-btn" data-course-id="${
                      item.id
                    }" title="Remove Item">×</button>
                `;
        container.appendChild(itemEl);
        total += item.price;
      });
      totalEl.textContent = `₦${total.toLocaleString()}`;
      placeOrderBtn.disabled = false;
      placeOrderBtn.style.opacity = "1";
    }

    // Update hidden form input with current cart data
    cartItemsInput.value = JSON.stringify(
      cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
      }))
    );
  };

  // --- NEW: Cart Preview Box Logic ---
  const renderCartPreview = () => {
    const previewBox = document.getElementById("cart-preview");
    const itemsContainer = document.getElementById("cart-preview-items");
    const totalPriceEl = document.getElementById("cart-preview-total-price");

    // Guard clause: if the elements don't exist, do nothing.
    if (!previewBox || !itemsContainer || !totalPriceEl) {
      return;
    }

    const cart = getCart();

    itemsContainer.innerHTML = ""; // Clear old items

    if (cart.length === 0) {
      itemsContainer.innerHTML =
        '<p class="empty-message">Your cart is empty.</p>';
      totalPriceEl.textContent = "₦0";
      // Hide the box if cart is empty
      previewBox.classList.remove("active");
    } else {
      let total = 0;
      cart.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-preview-item";
        // Use more specific class names to avoid style conflicts
        itemEl.innerHTML = `
          <span class="cart-preview-item-name">${item.name}</span>
          <span class="cart-preview-item-price">₦${item.price.toLocaleString()}</span>
        `;
        itemsContainer.appendChild(itemEl);
        total += item.price;
      });
      totalPriceEl.textContent = `₦${total.toLocaleString()}`;
    }
  };

  // --- Event Listeners ---

  // For "Add to Cart" buttons on the main page
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const course = {
        id: parseInt(e.currentTarget.dataset.courseId, 10),
        name: e.currentTarget.dataset.courseName,
        price: parseInt(e.currentTarget.dataset.coursePrice, 10),
      };
      addToCart(course);
    });
  });

  // For "Remove from Cart" buttons on the checkout page (using event delegation)
  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("remove-item-btn")) {
      const courseId = parseInt(e.target.dataset.courseId, 10);
      removeFromCart(courseId);
    }
  });

  // NEW: Event listener for closing the cart preview
  const closeCartPreviewBtn = document.getElementById("close-cart-preview");
  if (closeCartPreviewBtn) {
    closeCartPreviewBtn.addEventListener("click", () => {
      const previewBox = document.getElementById("cart-preview");
      if (previewBox) {
        previewBox.classList.remove("active");
      }
    });
  }

  // For checkout form submission
  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      const cartItemsInput = document.getElementById("cart-items-input");
      const cart = getCart();
      if (cart.length === 0) {
        e.preventDefault();
        showNotification("Cannot place an order with an empty cart.", "error");
        return;
      }
      // Ensure the hidden input is up-to-date just before submission
      cartItemsInput.value = JSON.stringify(
        cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        }))
      );
      // Clear cart after successful submission assumption
      localStorage.removeItem(CART_KEY);
    });
  }

  // --- Initialization ---
  updateCartUI();
  renderCartPreview(); // Render preview on page load (it will be hidden if cart is empty)
  // If cart has items from a previous session, show the preview box on load.
  if (getCart().length > 0) {
    const cartPreview = document.getElementById("cart-preview");
    if (cartPreview) {
      cartPreview.classList.add("active");
    }
  }

  // If on the checkout page, render the summary.
  if (document.querySelector(".checkout-section")) {
    renderCheckoutSummary();
  }
});

// Simple Notification Function (can be enhanced)
function showNotification(message, type = "info") {
  const notificationContainer = document.querySelector(".flash-messages");
  if (!notificationContainer) return;

  const notification = document.createElement("div");
  // Use a different class to distinguish from server-flashed messages
  notification.className = `client-flash-message ${type}`;
  notification.textContent = message;
  notification.style.opacity = "0"; // Start invisible for fade-in

  notificationContainer.insertBefore(
    notification,
    notificationContainer.firstChild
  );

  // Animate in
  setTimeout(() => {
    notification.style.opacity = "1";
  }, 10);

  // Animate out
  setTimeout(() => {
    notification.style.opacity = "0";
    setTimeout(() => notification.remove(), 500); // Remove from DOM after fade
  }, 4000);
}
