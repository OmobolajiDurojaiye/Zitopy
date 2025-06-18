"use strict";

const recalculateTotal = () => {
  const totalEl = document.getElementById("summary-total-price");
  const cartItemsInput = document.getElementById("cart-items-input");
  const placeOrderBtn = document.getElementById("place-order-btn");
  const summaryItems = document.querySelectorAll(".summary-item");

  if (!totalEl || !cartItemsInput || !placeOrderBtn) return;

  let grandTotal = 0;
  const finalCartItems = [];

  summaryItems.forEach((itemEl) => {
    const courseId = parseInt(itemEl.dataset.courseId, 10);
    const basePrice = parseInt(itemEl.dataset.basePrice, 10);
    const duration = parseInt(itemEl.dataset.duration, 10);
    const courseName = itemEl.querySelector(".item-title").textContent;
    const priceDisplay = itemEl.querySelector(".item-price");

    // 1. Determine Monthly Price based on Pace
    const paceSelect = itemEl.querySelector(".payment-option-select");
    const isAccelerated = paceSelect.value === "accelerated";
    const monthlyPrice = Math.round(
      isAccelerated ? basePrice * 0.9 : basePrice
    );

    // 2. Determine Quantity based on Payment Plan
    const planRadio = itemEl.querySelector('input[type="radio"]:checked');
    let quantity = 1;
    let planText = "Pay Monthly";

    if (planRadio.value === "half") {
      quantity = Math.ceil(duration / 2);
      planText = `Pay First Half (${quantity} months)`;
    } else if (planRadio.value === "full") {
      quantity = duration;
      planText = `Pay in Full (${quantity} months)`;
    }

    // 3. Calculate Line Total
    const lineTotal = monthlyPrice * quantity;
    grandTotal += lineTotal;

    // 4. Update UI for this item
    priceDisplay.innerHTML = `
      <span class="price-total">₦${lineTotal.toLocaleString()}</span>
      <small class="price-breakdown">@ ₦${monthlyPrice.toLocaleString()}/mo</small>
    `;

    // 5. Prepare data for backend
    const paceText = isAccelerated ? "Accelerated Pace" : "Standard Pace";
    finalCartItems.push({
      id: courseId,
      name: courseName,
      monthly_price: monthlyPrice,
      quantity: quantity,
      option: `${paceText} - ${planText}`,
    });
  });

  // Update Grand Total and Form Input
  totalEl.textContent = `₦${grandTotal.toLocaleString()}`;
  cartItemsInput.value = JSON.stringify(finalCartItems);

  if (finalCartItems.length > 0) {
    placeOrderBtn.disabled = false;
    placeOrderBtn.style.opacity = "1";
  } else {
    placeOrderBtn.disabled = true;
    placeOrderBtn.style.opacity = "0.5";
    totalEl.textContent = "₦0";
  }
};

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
    renderCartPreview();
  };

  const addToCart = (course) => {
    const cart = getCart();
    const existingItem = cart.find((item) => item.id === course.id);

    if (existingItem) {
      showNotification(`'${course.name}' is already in your cart.`, "info");
      return;
    }

    cart.push(course);
    saveCart(cart);
    showNotification(`'${course.name}' added to cart!`, "success");

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
    saveCart(cart);
    showNotification(`'${courseName}' removed from cart.`, "info");

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

  const renderCheckoutSummary = () => {
    const container = document.getElementById("summary-items-container");
    if (!container) return;

    const cart = getCart();
    container.innerHTML = "";

    if (cart.length === 0) {
      container.innerHTML = `
        <p class="empty-cart-message">
          Your cart is empty. 
          <a href="${window.location.origin}/#courses">Add courses</a> to continue.
        </p>`;
    } else {
      cart.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "summary-item";
        itemEl.dataset.courseId = item.id;
        itemEl.dataset.basePrice = item.price;
        itemEl.dataset.duration = item.duration;

        itemEl.innerHTML = `
          <div class="item-details">
            <span class="item-title">${item.name}</span>
            
            <div class="checkout-option-group">
              <label class="checkout-option-label">1. Choose Your Learning Pace:</label>
              <select class="payment-option-select">
                <option value="standard">Standard Pace (Full Duration)</option>
                <option value="accelerated">Accelerated Pace (10% Off Monthly)</option>
              </select>
            </div>

            <div class="checkout-option-group">
              <label class="checkout-option-label">2. Choose Your Payment Plan:</label>
              <div class="payment-plan-radios">
                <label><input type="radio" name="plan-${
                  item.id
                }" value="monthly" checked> Pay Monthly</label>
                <label><input type="radio" name="plan-${
                  item.id
                }" value="half"> Pay for First Half (${Math.ceil(
          item.duration / 2
        )} months)</label>
                <label><input type="radio" name="plan-${
                  item.id
                }" value="full"> Pay in Full (${item.duration} months)</label>
              </div>
            </div>
          </div>

          <div class="item-pricing-actions">
            <div class="item-price">
              <!-- Populated by JS -->
            </div>
            <button class="remove-item-btn" data-course-id="${
              item.id
            }" title="Remove Item">×</button>
          </div>
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
      previewBox.classList.remove("active");
    } else {
      let total = 0;
      cart.forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "cart-preview-item";
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
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      const course = {
        id: parseInt(e.currentTarget.dataset.courseId, 10),
        name: e.currentTarget.dataset.courseName,
        price: parseInt(e.currentTarget.dataset.coursePrice, 10),
        duration: parseInt(e.currentTarget.dataset.courseDuration, 10),
      };
      addToCart(course);
    });
  });

  document.body.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("remove-item-btn")) {
      const courseId = parseInt(e.target.dataset.courseId, 10);
      removeFromCart(courseId);
    }
  });

  // Listen for changes on selects and radio buttons
  document.body.addEventListener("change", (e) => {
    if (
      e.target &&
      (e.target.classList.contains("payment-option-select") ||
        e.target.type === "radio")
    ) {
      recalculateTotal();
    }
  });

  const closeCartPreviewBtn = document.getElementById("close-cart-preview");
  if (closeCartPreviewBtn) {
    closeCartPreviewBtn.addEventListener("click", () => {
      const previewBox = document.getElementById("cart-preview");
      if (previewBox) {
        previewBox.classList.remove("active");
      }
    });
  }

  const checkoutForm = document.getElementById("checkout-form");
  if (checkoutForm) {
    checkoutForm.addEventListener("submit", (e) => {
      const cart = getCart();
      if (cart.length === 0) {
        e.preventDefault();
        showNotification("Cannot place an order with an empty cart.", "error");
        return;
      }
      recalculateTotal();
      localStorage.removeItem(CART_KEY);
    });
  }

  // --- Initialization ---
  updateCartUI();
  renderCartPreview();
  if (getCart().length > 0) {
    const cartPreview = document.getElementById("cart-preview");
    if (cartPreview) {
      cartPreview.classList.add("active");
    }
  }

  if (document.querySelector(".checkout-section")) {
    renderCheckoutSummary();
  }
});

function showNotification(message, type = "info") {
  const container = document.querySelector(".flash-messages");
  if (!container) return;

  const notification = document.createElement("div");
  notification.className = `client-flash-message ${type}`;
  notification.textContent = message;
  container.insertBefore(notification, container.firstChild);

  setTimeout(() => {
    notification.classList.add("visible");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("visible");
    setTimeout(() => notification.remove(), 500);
  }, 4000);
}
