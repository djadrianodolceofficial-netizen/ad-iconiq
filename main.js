/* =========================================
   AD ICONIQ PWA - main.js (Shopify-connected)
   - Loads REAL products from Shopify Storefront API
   - Builds REAL Shopify cart + redirects to REAL checkout
   ========================================= */

/* ---------- SHOPIFY CONFIG ---------- */
const SHOPIFY_DOMAIN = "xfkvxx-iz.myshopify.com";
const STOREFRONT_TOKEN = "639111507512d9723d5efdd3fd6a8152"; // public Storefront token
const STOREFRONT_API_VERSION = "2025-01";

/* ---------- GLOBAL STATE ---------- */
const AppState = {
  cart: safeJSONParse(localStorage.getItem("adiconiq-cart"), []),
  wishlist: safeJSONParse(localStorage.getItem("adiconiq-wishlist"), []),
  user: safeJSONParse(localStorage.getItem("adiconiq-user"), {}),
  products: [], // normalized Shopify products
  filters: {
    category: "all",
    collection: "all",
    priceRange: 99999,
    sizes: [],
    colors: []
  },
  searchTerm: "",
  currentPage: (window.location.pathname.split("/").pop() || "index.html").toLowerCase()
};

/* ---------- HELPERS ---------- */
function safeJSONParse(value, fallback) {
  try {
    return JSON.parse(value ?? "");
  } catch {
    return fallback;
  }
}

function saveCart() {
  localStorage.setItem("adiconiq-cart", JSON.stringify(AppState.cart));
}

function saveWishlist() {
  localStorage.setItem("adiconiq-wishlist", JSON.stringify(AppState.wishlist));
}

function money(n) {
  const num = Number(n || 0);
  return `$${num.toFixed(2)}`;
}

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ---------- NOTIFICATIONS ---------- */
function showNotification(message, type = "success") {
  const notification = document.createElement("div");
  notification.className =
    `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ` +
    (type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white");
  notification.textContent = message;

  document.body.appendChild(notification);

  // animate if anime.js exists
  if (typeof anime !== "undefined") {
    anime({
      targets: notification,
      translateX: [300, 0],
      opacity: [0, 1],
      duration: 250,
      easing: "easeOutCubic"
    });

    setTimeout(() => {
      anime({
        targets: notification,
        translateX: [0, 300],
        opacity: [1, 0],
        duration: 250,
        easing: "easeInCubic",
        complete: () => notification.remove()
      });
    }, 2500);
  } else {
    // fallback
    setTimeout(() => notification.remove(), 2500);
  }
}

/* ---------- SHOPIFY: STOREFRONT FETCH ---------- */
async function storefrontFetch(query, variables = {}) {
  const url = `https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.errors) {
    console.error("Storefront API error:", json.errors || json);
    throw new Error("Storefront API request failed");
  }

  return json.data;
}

/* ---------- SHOPIFY: LOAD PRODUCTS ---------- */
async function fetchShopifyProducts(first = 50) {
  const query = `
    query Products($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            description
            handle
            productType
            tags
            images(first: 3) {
              edges { node { url altText } }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price { amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await storefrontFetch(query, { first });

  return data.products.edges.map(({ node }) => {
    const images = node.images.edges.map(e => e.node.url).filter(Boolean);
    const variants = node.variants.edges.map(e => e.node).map(v => ({
      id: v.id,
      title: v.title || "Default",
      available: !!v.availableForSale,
      price: Number(v.price?.amount || 0),
      currency: v.price?.currencyCode || "USD"
    }));

    // pick first available variant, else first variant
    const defaultVariant = variants.find(v => v.available) || variants[0] || null;

    // crude option parsing from variant title "Size / Color"
    const parsedOptions = parseVariantOptions(variants);

    return {
      shopifyProductId: node.id,
      handle: node.handle,
      name: node.title,
      description: node.description || "",
      productType: node.productType || "",
      tags: node.tags || [],
      images,
      image: images[0] || "",
      variants,
      defaultVariantId: defaultVariant?.id || null,
      defaultPrice: defaultVariant?.price ?? 0,
      currency: defaultVariant?.currency ?? "USD",
      options: parsedOptions // { sizes:[], colors:[], map: { "Size||Color": variantId } }
    };
  });
}

function parseVariantOptions(variants) {
  const sizes = new Set();
  const colors = new Set();
  const map = {}; // key => variantId

  for (const v of variants) {
    const title = (v.title || "Default").trim();

    // Shopify default
    if (title.toLowerCase() === "default title") {
      map["Default||Default"] = v.id;
      continue;
    }

    const parts = title.split(" / ").map(s => s.trim());
    const size = parts[0] || "Default";
    const color = parts[1] || "Default";

    sizes.add(size);
    colors.add(color);
    map[`${size}||${color}`] = v.id;
  }

  return {
    sizes: Array.from(sizes),
    colors: Array.from(colors),
    map
  };
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  // PWA: service worker
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    });
  }

  setupEventListeners();
  updateCartBadge();

  // Load products for pages that need them
  const needsProducts =
    AppState.currentPage === "catalog.html" ||
    AppState.currentPage === "index.html" ||
    AppState.currentPage === "";

  if (needsProducts) {
    try {
      AppState.products = await fetchShopifyProducts(50);
    } catch (e) {
      console.error(e);
      showNotification("No pude cargar productos desde Shopify.", "error");
      AppState.products = [];
    }
  }

  // Page-specific render
  if (AppState.currentPage === "catalog.html") {
    applyUrlFilters();
    loadProducts();
  }

  if (AppState.currentPage === "cart.html") {
    loadCartItems();
    updateOrderSummary();
  }

  // If you have UI extras, try-init safely
  tryInitFancyStuff();
});

/* ---------- EVENT LISTENERS ---------- */
function setupEventListeners() {
  // Search input (catalog)
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener(
      "input",
      debounce(() => {
        AppState.searchTerm = String(searchInput.value || "").toLowerCase();
        loadProducts();
      }, 250)
    );
  }

  // Promo code (optional button)
  const promoBtn = document.getElementById("promo-apply-btn");
  if (promoBtn) promoBtn.addEventListener("click", applyPromoCode);

  // Checkout button (cart)
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) checkoutBtn.addEventListener("click", proceedToCheckout);
}

function tryInitFancyStuff() {
  // Keep your app from dying if libraries are missing
  try {
    if (AppState.currentPage === "index.html" || AppState.currentPage === "") {
      // Example: carousel if you have Splide element
      const carousel = document.getElementById("collections-carousel");
      if (carousel && typeof Splide !== "undefined") {
        new Splide(carousel, {
          type: "loop",
          perPage: 1,
          autoplay: true,
          interval: 4000,
          pauseOnHover: true,
          arrows: false,
          pagination: true
        }).mount();
      }
    }
  } catch {}
}

/* ---------- FILTERS ---------- */
function applyUrlFilters() {
  const urlParams = new URLSearchParams(window.location.search);
  const collection = urlParams.get("collection");
  const category = urlParams.get("category");

  if (collection) AppState.filters.collection = collection;
  if (category) AppState.filters.category = category;
}

function getFilteredProducts() {
  const list = Array.isArray(AppState.products) ? AppState.products : [];

  return list.filter(p => {
    // price
    if (Number(p.defaultPrice || 0) > Number(AppState.filters.priceRange || 99999)) return false;

    // category (we map to productType loosely)
    if (AppState.filters.category !== "all") {
      const t = String(p.productType || "").toLowerCase();
      const c = String(AppState.filters.category || "").toLowerCase();
      if (t && !t.includes(c)) return false;
    }

    // collection (soft match by tags/name)
    if (AppState.filters.collection !== "all") {
      const desired = String(AppState.filters.collection).toLowerCase();
      const name = String(p.name || "").toLowerCase();
      const tags = (p.tags || []).map(x => String(x).toLowerCase());
      const ok = name.includes(desired) || tags.some(t => t.includes(desired));
      if (!ok) return false;
    }

    // search term
    if (AppState.searchTerm) {
      const term = AppState.searchTerm;
      const hay =
        (String(p.name || "") + " " + String(p.description || "") + " " + (p.tags || []).join(" "))
          .toLowerCase();
      if (!hay.includes(term)) return false;
    }

    return true;
  });
}

/* ---------- WISHLIST ---------- */
function isWishlisted(handle) {
  return AppState.wishlist.includes(handle);
}

function toggleWishlist(handle) {
  if (isWishlisted(handle)) {
    AppState.wishlist = AppState.wishlist.filter(h => h !== handle);
    showNotification("Removed from wishlist");
  } else {
    AppState.wishlist.push(handle);
    showNotification("Saved to wishlist");
  }
  saveWishlist();
  if (AppState.currentPage === "catalog.html") loadProducts();
}

/* ---------- PRODUCTS GRID ---------- */
function loadProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const filtered = getFilteredProducts();

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="p-6 bg-white rounded-xl shadow-sm text-center col-span-full">
        <p class="text-gray-600">No products found.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered
    .map(p => {
      const wished = isWishlisted(p.handle);
      return `
      <div class="product-card fade-in relative" onclick="openProductModal('${escapeAttr(p.handle)}')">
        <button aria-label="Toggle wishlist"
          onclick="event.stopPropagation(); toggleWishlist('${escapeAttr(p.handle)}')"
          class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-2 rounded-full shadow">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="${wished ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
          </svg>
        </button>

        <img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" class="w-full h-48 object-cover">
        <div class="p-4">
          <h3 class="font-semibold text-sm mb-2 line-clamp-2">${escapeHtml(p.name)}</h3>
          <div class="flex justify-between items-center">
            <span class="font-bold text-lg">${money(p.defaultPrice)}</span>
            <button onclick="event.stopPropagation(); quickAddToCart('${escapeAttr(p.handle)}')"
              class="btn-primary text-xs px-3 py-1">
              Add to Cart
            </button>
          </div>
        </div>
      </div>`;
    })
    .join("");

  // animate if anime.js exists
  if (typeof anime !== "undefined") initializeAnimations();
}

function quickAddToCart(handle) {
  const p = AppState.products.find(x => x.handle === handle);
  if (!p) return;

  const variantId = p.defaultVariantId;
  if (!variantId) {
    showNotification("No variant available", "error");
    return;
  }

  addToCart(handle, variantId);
}

/* ---------- MODAL ---------- */
function openProductModal(handle) {
  const product = AppState.products.find(p => p.handle === handle);
  if (!product) {
    showNotification("Product not found", "error");
    return;
  }

  const modal = document.getElementById("product-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalContent = document.getElementById("modal-content");

  if (!modal || !modalTitle || !modalContent) return;

  modal.dataset.handle = handle;
  modal.dataset.selectedVariantId = product.defaultVariantId || "";
  modal.dataset.selectedSize = "Default";
  modal.dataset.selectedColor = "Default";

  modalTitle.textContent = product.name;

  const hasOptions =
    (product.options?.sizes?.length || 0) > 1 ||
    (product.options?.colors?.length || 0) > 1;

  const sizeButtons = (product.options?.sizes || ["Default"])
    .map(s => `<button class="filter-chip" onclick="selectSize(this, '${escapeAttr(s)}')">${escapeHtml(s)}</button>`)
    .join("");

  const colorButtons = (product.options?.colors || ["Default"])
    .map(c => `<button class="filter-chip" onclick="selectColor(this, '${escapeAttr(c)}')">${escapeHtml(c)}</button>`)
    .join("");

  modalContent.innerHTML = `
    <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" class="w-full h-64 object-cover rounded-lg mb-4">
    <p class="text-gray-600 mb-4">${escapeHtml(product.description || "")}</p>

    ${
      hasOptions
        ? `
      <div class="mb-4">
        <h4 class="font-semibold mb-2">Size</h4>
        <div class="flex flex-wrap gap-2">${sizeButtons}</div>
      </div>
      <div class="mb-6">
        <h4 class="font-semibold mb-2">Color</h4>
        <div class="flex flex-wrap gap-2">${colorButtons}</div>
      </div>
    `
        : `<div class="mb-6 text-sm text-gray-500">Default variant</div>`
    }

    <div class="flex justify-between items-center">
      <span class="font-bold text-2xl">${money(product.defaultPrice)}</span>
      <button onclick="addToCartFromModal()" class="btn-primary">Add to Cart</button>
    </div>
  `;

  modal.classList.add("active");
}

function closeModal() {
  const modal = document.getElementById("product-modal");
  if (modal) modal.classList.remove("active");
}

function selectSize(btn, size) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  // toggle active within the size group only
  btn.parentElement.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  modal.dataset.selectedSize = size;
  resolveVariantFromModal();
}

function selectColor(btn, color) {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  btn.parentElement.querySelectorAll(".filter-chip").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  modal.dataset.selectedColor = color;
  resolveVariantFromModal();
}

function resolveVariantFromModal() {
  const modal = document.getElementById("product-modal");
  const handle = modal?.dataset?.handle;
  if (!handle) return;

  const product = AppState.products.find(p => p.handle === handle);
  if (!product) return;

  const size = modal.dataset.selectedSize || "Default";
  const color = modal.dataset.selectedColor || "Default";

  const key = `${size}||${color}`;
  const variantId = product.options?.map?.[key] || product.defaultVariantId || "";

  modal.dataset.selectedVariantId = variantId;
}

function addToCartFromModal() {
  const modal = document.getElementById("product-modal");
  if (!modal) return;

  const handle = modal.dataset.handle;
  const variantId = modal.dataset.selectedVariantId;

  if (!handle || !variantId) {
    showNotification("Select options first", "error");
    return;
  }

  addToCart(handle, variantId);
  closeModal();
}

/* ---------- CART ---------- */
function addToCart(handle, variantId) {
  const product = AppState.products.find(p => p.handle === handle);
  if (!product) return;

  const variant = product.variants.find(v => v.id === variantId) || product.variants[0];
  if (!variant) {
    showNotification("Variant not found", "error");
    return;
  }

  const existing = AppState.cart.find(i => i.handle === handle && i.variantId === variantId);

  if (existing) {
    existing.quantity += 1;
  } else {
    AppState.cart.push({
      handle,
      variantId,
      name: product.name,
      image: product.image,
      price: variant.price,
      currency: variant.currency,
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  showNotification("Added to cart!");
}

function removeFromCart(handle, variantId) {
  AppState.cart = AppState.cart.filter(i => !(i.handle === handle && i.variantId === variantId));
  saveCart();
  updateCartBadge();

  if (AppState.currentPage === "cart.html") {
    loadCartItems();
    updateOrderSummary();
  }
}

function updateCartQuantity(handle, variantId, newQty) {
  const item = AppState.cart.find(i => i.handle === handle && i.variantId === variantId);
  if (!item) return;

  if (newQty <= 0) {
    removeFromCart(handle, variantId);
    return;
  }

  item.quantity = newQty;
  saveCart();
  updateCartBadge();

  if (AppState.currentPage === "cart.html") {
    loadCartItems();
    updateOrderSummary();
  }
}

function clearCart() {
  AppState.cart = [];
  saveCart();
  updateCartBadge();

  if (AppState.currentPage === "cart.html") {
    loadCartItems();
    updateOrderSummary();
  }
}

function updateCartBadge() {
  const count = AppState.cart.reduce((t, i) => t + (i.quantity || 0), 0);
  const badges = document.querySelectorAll("#cart-count");

  badges.forEach(b => {
    if (count > 0) {
      b.textContent = String(count);
      b.classList.remove("hidden");
    } else {
      b.classList.add("hidden");
    }
  });
}

/* ---------- CART PAGE RENDER ---------- */
function loadCartItems() {
  const cartContent = document.getElementById("cart-content");
  const emptyCart = document.getElementById("empty-cart");
  const orderSummary = document.getElementById("order-summary");

  if (!cartContent) return;

  if (!AppState.cart.length) {
    cartContent.classList.add("hidden");
    if (emptyCart) emptyCart.classList.remove("hidden");
    if (orderSummary) orderSummary.classList.add("hidden");
    return;
  }

  cartContent.classList.remove("hidden");
  if (emptyCart) emptyCart.classList.add("hidden");
  if (orderSummary) orderSummary.classList.remove("hidden");

  cartContent.innerHTML = AppState.cart
    .map(item => `
      <div class="cart-item">
        <div class="flex space-x-4">
          <img src="${escapeAttr(item.image)}" alt="${escapeAttr(item.name)}" class="w-20 h-20 object-cover rounded-lg">
          <div class="flex-1">
            <h3 class="font-semibold mb-1">${escapeHtml(item.name)}</h3>
            <p class="text-sm text-gray-600 mb-2">${escapeHtml(item.variantId ? "Variant selected" : "")}</p>
            <div class="flex items-center justify-between">
              <span class="font-bold text-lg">${money(item.price)}</span>
              <div class="flex items-center space-x-3">
                <button onclick="updateCartQuantity('${escapeAttr(item.handle)}','${escapeAttr(item.variantId)}', ${item.quantity - 1})" class="quantity-btn">-</button>
                <span class="font-semibold">${item.quantity}</span>
                <button onclick="updateCartQuantity('${escapeAttr(item.handle)}','${escapeAttr(item.variantId)}', ${item.quantity + 1})" class="quantity-btn">+</button>
              </div>
            </div>
          </div>
          <button onclick="removeFromCart('${escapeAttr(item.handle)}','${escapeAttr(item.variantId)}')" class="text-red-500 hover:text-red-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 0 0-1 1v3M4 7h16"/>
            </svg>
          </button>
        </div>
      </div>
    `)
    .join("");
}

function updateOrderSummary() {
  const subtotal = AppState.cart.reduce((t, i) => t + (Number(i.price) * Number(i.quantity || 0)), 0);
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal + shipping;

  const subtotalEl = document.getElementById("subtotal");
  const shippingEl = document.getElementById("shipping");
  const totalEl = document.getElementById("total");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (subtotalEl) subtotalEl.textContent = money(subtotal);
  if (shippingEl) shippingEl.textContent = shipping === 0 ? "Free" : money(shipping);
  if (totalEl) totalEl.textContent = money(total);
  if (checkoutBtn) checkoutBtn.disabled = AppState.cart.length === 0;
}

/* ---------- REAL SHOPIFY CHECKOUT ---------- */
async function proceedToCheckout() {
  if (!AppState.cart.length) return;

  try {
    showNotification("Sending to Shopify checkout…");

    const lines = AppState.cart.map(i => ({
      merchandiseId: i.variantId,
      quantity: i.quantity
    }));

    const mutation = `
      mutation CartCreate($lines: [CartLineInput!]!) {
        cartCreate(input: { lines: $lines }) {
          cart { checkoutUrl }
          userErrors { field message }
        }
      }
    `;

    const data = await storefrontFetch(mutation, { lines });

    const errs = data?.cartCreate?.userErrors || [];
    if (errs.length) {
      console.error(errs);
      showNotification(errs[0].message || "Checkout error", "error");
      return;
    }

    const url = data?.cartCreate?.cart?.checkoutUrl;
    if (!url) {
      showNotification("Checkout URL missing", "error");
      return;
    }

    // Real order happens on Shopify checkout
    window.location.href = url;
  } catch (e) {
    console.error(e);
    showNotification("Checkout failed", "error");
  }
}

/* ---------- PROMO (optional UI mock; Shopify discount happens on checkout) ---------- */
function applyPromoCode() {
  // You can’t apply real Shopify discounts from client-only Storefront
  // without using checkout URL parameters / discount code entry.
  const promoInput = document.getElementById("promo-code");
  const code = String(promoInput?.value || "").trim();
  if (!code) return showNotification("Enter a code", "error");

  showNotification("Promo codes are applied in Shopify checkout.");
}

/* ---------- ANIMATIONS (optional) ---------- */
function initializeAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in");
  if (!fadeElements.length) return;

  // If anime.js is present, animate
  fadeElements.forEach(el => {
    try {
      anime({
        targets: el,
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 450,
        easing: "easeOutCubic"
      });
    } catch {}
  });
}

/* ---------- HTML ESCAPING ---------- */
function escapeHtml(str) {
  return String(str ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttr(str) {
  // minimal attribute-safe escaping
  return escapeHtml(str).replaceAll("`", "&#096;");
}

/* ---------- EXPORT GLOBALS FOR HTML onclick ---------- */
window.loadProducts = loadProducts;
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.selectSize = selectSize;
window.selectColor = selectColor;
window.addToCartFromModal = addToCartFromModal;

window.addToCart = addToCart;
window.quickAddToCart = quickAddToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;

window.toggleWishlist = toggleWishlist;
window.applyPromoCode = applyPromoCode;
window.proceedToCheckout = proceedToCheckout;
window.showNotification = showNotification;
