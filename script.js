// 1. Product Catalog (Pulled directly from your Merchandise Plan!)
const products = [
  {
    id: 1,
    name: "Fast-Charging USB-C Cable (2m)",
    category: "Charging",
    price: 149,
    compat: "usbc",
    compatLabel: "✓ Fits iPhone 15/16, Android & USB-C",
    icon: "🔌"
  },
  {
    id: 2,
    name: "Wireless Earbuds (Base Series)",
    category: "Audio",
    price: 699,
    compat: "all",
    compatLabel: "✓ Universal Bluetooth 5.3",
    icon: "🎧"
  },
  {
    id: 3,
    name: "10,000mAh Slim Power Bank",
    category: "Charging",
    price: 899,
    compat: "all",
    compatLabel: "✓ Dual USB-C + Lightning Output",
    icon: "🔋"
  },
  {
    id: 4,
    name: "Shockproof Phone Case + Tempered Glass",
    category: "Phone",
    price: 199,
    compat: "lightning",
    compatLabel: "✓ Fits iPhone 11 / 12 / 13 / 14",
    icon: "📱"
  },
  {
    id: 5,
    name: "Wireless Silent Office Mouse",
    category: "Computer",
    price: 349,
    compat: "laptop",
    compatLabel: "✓ Windows, MacBook & USB-C Adapter",
    icon: "🖱️"
  },
  {
    id: 6,
    name: "30W GaN Fast Wall Adapter",
    category: "Charging",
    price: 449,
    compat: "usbc",
    compatLabel: "✓ Fast Charge for iPhone & Samsung",
    icon: "⚡"
  },
  {
    id: 7,
    name: "Grand Opening Student Bundle",
    category: "Bundles",
    price: 499,
    compat: "usbc",
    compatLabel: "✓ Includes 20W Adapter + USB-C Cable + Case",
    icon: "🎁"
  },
  {
    id: 8,
    name: "Foldable Aluminum Laptop Stand",
    category: "Computer",
    price: 549,
    compat: "laptop",
    compatLabel: "✓ Fits 11\" to 17\" Laptops",
    icon: "💻"
  }
];

// 2. App State
let cart = [];
let userPoints = 120; // Starting balance for Andrea Santos
let selectedCategory = "all";
let selectedDevice = "all";

// 3. Grab HTML Elements
const productGrid = document.getElementById("product-grid");
const deviceSelect = document.getElementById("device-select");
const filterBtns = document.querySelectorAll(".filter-btn");
const cartCountEl = document.getElementById("cart-count");
const userPointsEl = document.getElementById("user-points");

const cartModal = document.getElementById("cart-modal");
const openCartBtn = document.getElementById("open-cart-btn");
const closeCartBtn = document.getElementById("close-cart-btn");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const pointsEarnedEl = document.getElementById("points-earned");
const fulfillmentSelect = document.getElementById("fulfillment-select");
const paymentSelect = document.getElementById("payment-select");
const placeOrderBtn = document.getElementById("place-order-btn");

const receiptModal = document.getElementById("receipt-modal");
const receiptDetailsEl = document.getElementById("receipt-details");
const closeReceiptBtn = document.getElementById("close-receipt-btn");

// 4. Display Products on Screen
function renderProducts() {
  productGrid.innerHTML = "";

  const filtered = products.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesDevice = selectedDevice === "all" || item.compat === "all" || item.compat === selectedDevice;
    return matchesCategory && matchesDevice;
  });

  if (filtered.length === 0) {
    productGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b;">No matching products found for that filter.</p>`;
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <div>
        <div class="product-icon">${product.icon}</div>
        <div class="category-tag">${product.category}</div>
        <div class="product-title">${product.name}</div>
        <div class="compat-tag">${product.compatLabel}</div>
      </div>
      <div class="card-footer">
        <span class="price">₱${product.price.toLocaleString()}</span>
        <button class="add-btn" onclick="addToCart(${product.id})">+ Add</button>
      </div>
    `;
    productGrid.appendChild(card);
  });
}

// 5. Cart Functions
function addToCart(productId) {
  const item = products.find((p) => p.id === productId);
  cart.push(item);
  updateCartUI();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  cartCountEl.textContent = cart.length;
  cartItemsEl.innerHTML = "";

  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p style="color: #64748b; text-align: center;">Your cart is empty.</p>`;
    cartTotalEl.textContent = "₱0";
    pointsEarnedEl.textContent = "0";
    return;
  }

  let subtotal = 0;
  cart.forEach((item, index) => {
    subtotal += item.price;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <span>${item.name} — <strong>₱${item.price}</strong></span>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsEl.appendChild(row);
  });

  // Add ₱40 fee if Local Delivery is chosen
  const isDelivery = fulfillmentSelect.value.includes("Delivery");
  const total = isDelivery ? subtotal + 40 : subtotal;

  // Pulse Rewards rule: 1 point per ₱100 spent
  const earnedPoints = Math.floor(total / 100);

  cartTotalEl.textContent = `₱${total.toLocaleString()}`;
  pointsEarnedEl.textContent = earnedPoints;
}

// 6. Event Listeners
deviceSelect.addEventListener("change", (e) => {
  selectedDevice = e.target.value;
  renderProducts();
});

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCategory = btn.dataset.category;
    renderProducts();
  });
});

openCartBtn.addEventListener("click", () => {
  updateCartUI();
  cartModal.classList.add("show");
});

closeCartBtn.addEventListener("click", () => {
  cartModal.classList.remove("show");
});

fulfillmentSelect.addEventListener("change", updateCartUI);

placeOrderBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Please add at least one item to your cart first!");
    return;
  }

  const totalText = cartTotalEl.textContent;
  const earned = parseInt(pointsEarnedEl.textContent, 10);
  const fulfillment = fulfillmentSelect.value;
  const payment = paymentSelect.value;

  // Add earned points to Pulse Rewards
  userPoints += earned;
  userPointsEl.textContent = userPoints;

  // Show Digital E-Receipt (Sustainability + Omnichannel!)
  receiptDetailsEl.innerHTML = `
    Thank you for shopping at <strong>Pulse & Pixel</strong>!<br><br>
    <strong>Total Paid:</strong> ${totalText}<br>
    <strong>Method:</strong> ${fulfillment}<br>
    <strong>Payment:</strong> ${payment}<br><br>
    🌱 <em>Digital E-Receipt issued to reduce paper waste.</em><br>
    🏆 You earned <strong>+${earned} Pulse Rewards points</strong>!
  `;

  cart = [];
  updateCartUI();
  cartModal.classList.remove("show");
  receiptModal.classList.add("show");
});

closeReceiptBtn.addEventListener("click", () => {
  receiptModal.classList.remove("show");
});

// Load initial products on page open
renderProducts();
