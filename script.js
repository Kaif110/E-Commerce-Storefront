// 1. Product Data (Array of Objects)
const products = [
  {
    id: 1,
    name: "Wireless Noise-Cancelling Headphones",
    price: 2499,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
  },
  {
    id: 2,
    name: "Canvas Everyday Backpack",
    price: 1599,
    category: "bags",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80"
  },
  {
    id: 3,
    name: "Minimalist Wooden Desk Lamp",
    price: 1199,
    category: "desk",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&q=80"
  },
  {
    id: 4,
    name: "Insulated Steel Water Bottle",
    price: 699,
    category: "lifestyle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&q=80"
  },
  {
    id: 5,
    name: "Compact Mechanical Keyboard",
    price: 3299,
    category: "electronics",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&q=80"
  },
  {
    id: 6,
    name: "Leather Laptop Sleeve (15-inch)",
    price: 999,
    category: "bags",
    image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500&q=80"
  },
  {
    id: 7,
    name: "Ceramic Coffee Pour-Over Mug",
    price: 549,
    category: "lifestyle",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&q=80"
  },
  {
    id: 8,
    name: "Aluminum Laptop Stand",
    price: 1399,
    category: "desk",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&q=80"
  }
];

// 2. App State
let cart = JSON.parse(localStorage.getItem("urbanshelf_cart")) || [];
let selectedCategory = "all";
let searchQuery = "";

// 3. Selecting HTML Elements
const productsGrid = document.getElementById("productsGrid");
const categoryButtons = document.getElementById("categoryButtons");
const searchInput = document.getElementById("searchInput");

const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");

const cartItemsContainer = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// 4. Show Products on Page
function renderProducts() {
  productsGrid.innerHTML = "";

  // Filter by category and search text
  const filteredProducts = products.filter((product) => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = "<p>No products found matching your search.</p>";
    return;
  }

  filteredProducts.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-title">${product.name}</h3>
        <div class="product-bottom">
          <span class="product-price">₹${product.price}</span>
          <button class="add-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      </div>
    `;

    productsGrid.appendChild(card);
  });
}

// 5. Add Product to Cart
function addToCart(productId) {
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    const product = products.find((p) => p.id === productId);
    cart.push({ ...product, quantity: 1 });
  }

  saveAndUpdateCart();
  openCart();
}

// 6. Change Item Quantity (+ or -)
function changeQuantity(productId, change) {
  const item = cart.find((item) => item.id === productId);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    removeFromCart(productId);
  } else {
    saveAndUpdateCart();
  }
}

// 7. Remove Item from Cart
function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  saveAndUpdateCart();
}

// 8. Save to LocalStorage & Update Cart UI
function saveAndUpdateCart() {
  localStorage.setItem("urbanshelf_cart", JSON.stringify(cart));
  renderCart();
}

function renderCart() {
  cartItemsContainer.innerHTML = "";

  // Update total item count in navbar
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    cartTotal.textContent = "₹0";
    return;
  }

  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;

    const cartItemDiv = document.createElement("div");
    cartItemDiv.className = "cart-item";

    cartItemDiv.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>₹${item.price} × ${item.quantity}</p>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItemDiv);
  });

  cartTotal.textContent = "₹" + totalPrice;
}

// 9. Open and Close Cart Drawer
function openCart() {
  cartDrawer.classList.add("open");
  overlay.classList.add("show");
}

function closeCart() {
  cartDrawer.classList.remove("open");
  overlay.classList.remove("show");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

// 10. Category Filter Clicks
categoryButtons.addEventListener("click", (e) => {
  if (e.target.classList.contains("filter-btn")) {
    document.querySelector(".filter-btn.active").classList.remove("active");
    e.target.classList.add("active");

    selectedCategory = e.target.getAttribute("data-category");
    renderProducts();
  }
});

// 11. Search Input
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderProducts();
});

// 12. Checkout Button
checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty! Add some items first.");
    return;
  }

  alert("Thank you! Your order has been placed successfully.");
  cart = [];
  saveAndUpdateCart();
  closeCart();
});

// Initial Page Load
renderProducts();
renderCart();
