// ===========================
// SHOPIFY CONFIG (EDIT THESE)
// ===========================
const SHOPIFY_DOMAIN = "xfkvxx-iz.myshopify.com";
const STOREFRONT_TOKEN = "639111507512d9723d5efdd3fd6a8152";
const STOREFRONT_API_VERSION = "2026-01";

// ===========================
// BASIC APP STATE
// ===========================
const STORAGE_KEY = "adiconiq_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch { return []; }
}
function setCart(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateCartBadges();
}
function cartCount() {
  return getCart().reduce((t, i) => t + (i.quantity || 0), 0);
}
function money(n) {
  const v = Number(n || 0);
  return `$${v.toFixed(2)}`;
}

// ===========================
// SHOPIFY STOREFRONT HELPERS
// ===========================
async function shopifyGraphQL(query, variables = {}) {
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
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  if (json.errors?.length) throw new Error(json.errors[0].message || "Shopify error");
  return json.data;
}

async function fetchProducts(first = 24) {
  const q = `
    query Products($first:Int!){
      products(first:$first, sortKey:BEST_SELLING){
        edges{
          node{
            id
            title
            handle
            description
            featuredImage{ url altText }
            variants(first:1){
              edges{
                node{
                  id
                  price{ amount currencyCode }
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyGraphQL(q, { first });
  const edges = data?.products?.edges || [];
  return edges.map(e => {
    const p = e.node;
    const v = p.variants.edges?.[0]?.node;
    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      description: p.description || "",
      image: p.featuredImage?.url || "",
      variantId: v?.id || null,
      price: Number(v?.price?.amount || 0),
      currency: v?.price?.currencyCode || "USD"
    };
  }).filter(p => p.variantId);
}

async function createCheckoutAndRedirect() {
  const items = getCart();
  if (!items.length) return;

  const lineItems = items.map(i => ({
    variantId: i.variantId,
    quantity: i.quantity
  }));

  const m = `
    mutation CheckoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout { webUrl }
        checkoutUserErrors { message field }
      }
    }
  `;
  const data = await shopifyGraphQL(m, { input: { lineItems } });
  const err = data?.checkoutCreate?.checkoutUserErrors?.[0]?.message;
  if (err) throw new Error(err);

  const webUrl = data?.checkoutCreate?.checkout?.webUrl;
  if (!webUrl) throw new Error("No checkout URL returned by Shopify.");

  // OPTIONAL: clear cart after sending them to Shopify checkout
  setCart([]);
  window.location.href = webUrl;
}

// ===========================
// UI RENDERING
// ===========================
function updateCartBadges() {
  const count = cartCount();
  const ids = ["cart-count", "cart-count-2"];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (count > 0) {
      el.textContent = String(count);
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}

function productCard(p) {
  const img = p.image || "";
  return `
    <div class="product">
      <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy">
      <div class="productBody">
        <div class="productTitle">${escapeHtml(p.title)}</div>
        <div class="productMeta">
          <div class="price">${money(p.price)}</div>
          <button class="btnPrimary" data-add="${p.variantId}" data-title="${escapeHtml(p.title)}" data-price="${p.price}" data-img="${img}">
            Add
          </button>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function addVariantToCart(variantId, title, price, image) {
  const items = getCart();
  const existing = items.find(i => i.variantId === variantId);
  if (existing) existing.quantity += 1;
  else items.push({ variantId, title, price: Number(price), image, quantity: 1 });
  setCart(items);
  toast("Added to cart");
}

function removeVariantFromCart(variantId) {
  const items = getCart().filter(i => i.variantId !== variantId);
  setCart(items);
}

function changeQty(variantId, delta) {
  const items = getCart();
  const it = items.find(i => i.variantId === variantId);
  if (!it) return;
  it.quantity += delta;
  if (it.quantity <= 0) {
    setCart(items.filter(x => x.variantId !== variantId));
  } else {
    setCart(items);
  }
}

function cartSubtotal() {
  return getCart().reduce((t, i) => t + (Number(i.price) * Number(i.quantity)), 0);
}

function renderCart() {
  const empty = document.getElementById("cart-empty");
  const wrap = document.getElementById("cart-wrap");
  const itemsEl = document.getElementById("cart-items");
  const subtotalEl = document.getElementById("subtotal");
  if (!itemsEl) return;

  const items = getCart();
  if (!items.length) {
    empty?.classList.remove("hidden");
    wrap?.classList.add("hidden");
    return;
  }

  empty?.classList.add("hidden");
  wrap?.classList.remove("hidden");

  itemsEl.innerHTML = items.map(i => `
    <div class="cartItem">
      <img src="${i.image || ""}" alt="${escapeHtml(i.title)}" loading="lazy">
      <div class="cartInfo">
        <div class="cartTitle">${escapeHtml(i.title)}</div>
        <div class="cartSub">${money(i.price)} each</div>
        <div class="qty">
          <button data-dec="${i.variantId}">-</button>
          <strong>${i.quantity}</strong>
          <button data-inc="${i.variantId}">+</button>
          <button class="btnGhost" style="margin-left:auto; padding:8px 10px" data-rm="${i.variantId}">Remove</button>
        </div>
      </div>
    </div>
  `).join("");

  subtotalEl.textContent = money(cartSubtotal());

  itemsEl.querySelectorAll("[data-dec]").forEach(b => b.addEventListener("click", () => { changeQty(b.dataset.dec, -1); renderCart(); }));
  itemsEl.querySelectorAll("[data-inc]").forEach(b => b.addEventListener("click", () => { changeQty(b.dataset.inc, 1); renderCart(); }));
  itemsEl.querySelectorAll("[data-rm]").forEach(b => b.addEventListener("click", () => { removeVariantFromCart(b.dataset.rm); renderCart(); }));

  const checkoutBtn = document.getElementById("checkoutBtn");
  const clearBtn = document.getElementById("clearBtn");
  const checkoutError = document.getElementById("checkoutError");

  checkoutBtn?.addEventListener("click", async () => {
    try {
      checkoutError?.classList.add("hidden");
      await createCheckoutAndRedirect();
    } catch (e) {
      checkoutError.textContent = String(e?.message || e);
      checkoutError.classList.remove("hidden");
    }
  });

  clearBtn?.addEventListener("click", () => {
    setCart([]);
    renderCart();
  });
}

function toast(msg) {
  const t = document.createElement("div");
  t.style.position = "fixed";
  t.style.right = "14px";
  t.style.top = "14px";
  t.style.zIndex = "9999";
  t.style.padding = "12px 14px";
  t.style.borderRadius = "14px";
  t.style.background = "rgba(255,255,255,.92)";
  t.style.color = "#000";
  t.style.fontWeight = "900";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1600);
}

// ===========================
// PAGE BOOTSTRAP
// ===========================
async function initHome() {
  const grid = document.getElementById("featured-grid");
  const loading = document.getElementById("featured-loading");
  const error = document.getElementById("featured-error");
  if (!grid) return;

  try {
    loading?.classList.remove("hidden");
    const products = await fetchProducts(8);
    grid.innerHTML = products.map(productCard).join("");
    bindAddButtons(grid);
  } catch (e) {
    error.textContent = `Could not load Shopify products: ${String(e?.message || e)}`;
    error.classList.remove("hidden");
  } finally {
    loading?.classList.add("hidden");
  }
}

async function initCatalog() {
  const grid = document.getElementById("products-grid");
  const loading = document.getElementById("products-loading");
  const error = document.getElementById("products-error");
  if (!grid) return;

  let products = [];
  try {
    loading?.classList.remove("hidden");
    products = await fetchProducts(36);
    render(products);
  } catch (e) {
    error.textContent = `Could not load Shopify products: ${String(e?.message || e)}`;
    error.classList.remove("hidden");
  } finally {
    loading?.classList.add("hidden");
  }

  const search = document.getElementById("search");
  const sort = document.getElementById("sort");

  function render(list) {
    grid.innerHTML = list.map(productCard).join("");
    bindAddButtons(grid);
  }

  function apply() {
    const term = (search?.value || "").toLowerCase().trim();
    let list = products.filter(p => p.title.toLowerCase().includes(term));

    const mode = sort?.value || "featured";
    if (mode === "price-asc") list = list.sort((a,b)=>a.price-b.price);
    if (mode === "price-desc") list = list.sort((a,b)=>b.price-a.price);
    if (mode === "title-asc") list = list.sort((a,b)=>a.title.localeCompare(b.title));

    render(list);
  }

  search?.addEventListener("input", apply);
  sort?.addEventListener("change", apply);
}

function bindAddButtons(root) {
  root.querySelectorAll("[data-add]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      addVariantToCart(
        btn.dataset.add,
        btn.dataset.title,
        btn.dataset.price,
        btn.dataset.img
      );
    });
  });
}

function initAccountLinks() {
  const ordersLink = document.getElementById("ordersLink");
  const accountLink = document.getElementById("accountLink");

  // Admin orders (for you). Customers won't access this.
  ordersLink && (ordersLink.href = `https://${SHOPIFY_DOMAIN}/admin/orders`);

  // Customer account portal (customers)
  // If you use the new customer accounts domain, this is often account.yourdomain.com
  // You can change it later to your real account domain.
  accountLink && (accountLink.href = `https://${SHOPIFY_DOMAIN}/account`);
}

// ===========================
// PWA INSTALL + SERVICE WORKER
// ===========================
let deferredPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("installBtn");
  if (btn) btn.style.display = "inline-block";
});
document.addEventListener("click", async (e) => {
  const btn = e.target?.id === "installBtn" ? e.target : null;
  if (!btn || !deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice.catch(()=>{});
  deferredPrompt = null;
  btn.style.display = "none";
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(()=>{});
  });
}

// ===========================
// RUN
// ===========================
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();

  // Page detection
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  if (path === "index.html" || path === "") initHome();
  if (path === "catalog.html") initCatalog();
  if (path === "cart.html") renderCart();
  if (path === "account.html") initAccountLinks();
});