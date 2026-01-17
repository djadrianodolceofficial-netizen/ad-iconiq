// =======================
// AD ICONIQ — MAIN
// Shopify Storefront + Luxury UI
// =======================

// IMPORTANT:
// Use ONLY the PUBLIC Storefront access token here (client-side).
// NEVER paste the private token into GitHub Pages.

const SHOPIFY_DOMAIN = "xfkvxx-iz.myshopify.com";
const STOREFRONT_TOKEN = "639111507512d9723d5efdd3fd6a8152";
const STOREFRONT_API_VERSION = "2026-01";

const LS_CART = "adiconiq-cart-v1";
const LS_ORDERS = "adiconiq-orders-v1";

const state = {
  products: [],
  cart: JSON.parse(localStorage.getItem(LS_CART) || "[]"),
  orders: JSON.parse(localStorage.getItem(LS_ORDERS) || "[]"),
};

function saveCart(){ localStorage.setItem(LS_CART, JSON.stringify(state.cart)); }
function saveOrders(){ localStorage.setItem(LS_ORDERS, JSON.stringify(state.orders)); }

function showToast(msg){
  const el = document.getElementById("toast");
  if(!el) return;
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=>el.classList.remove("show"), 1800);
}

function cartCount(){
  return state.cart.reduce((t,i)=>t + (i.qty || 0), 0);
}

function updateCartBadge(){
  const el = document.getElementById("cart-count");
  if(!el) return;
  const n = cartCount();
  el.textContent = n ? `(${n})` : "";
}

async function storefront(query, variables = {}){
  const res = await fetch(`https://${SHOPIFY_DOMAIN}/api/${STOREFRONT_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN
    },
    body: JSON.stringify({ query, variables })
  });

  if(!res.ok){
    throw new Error(`Storefront HTTP ${res.status}`);
  }
  const json = await res.json();
  if(json.errors){
    throw new Error(json.errors.map(e=>e.message).join(" | "));
  }
  return json.data;
}

async function loadProducts(){
  // Pull the first 24 products
  const q = `
    query Products($n:Int!) {
      products(first:$n) {
        edges {
          node {
            id
            title
            handle
            description
            featuredImage { url altText }
            variants(first:1) { edges { node { id price { amount currencyCode } } } }
          }
        }
      }
    }
  `;

  const data = await storefront(q, { n: 24 });
  const edges = data?.products?.edges || [];
  state.products = edges.map(e => {
    const p = e.node;
    const v = p.variants?.edges?.[0]?.node;
    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      desc: p.description || "",
      img: p.featuredImage?.url || "",
      price: v?.price?.amount ? Number(v.price.amount) : 0,
      currency: v?.price?.currencyCode || "USD",
      variantId: v?.id || null
    };
  });

  return state.products;
}

function money(n, c="USD"){
  try{
    return new Intl.NumberFormat(undefined, { style:"currency", currency:c }).format(n);
  }catch{
    return `$${n.toFixed(2)}`;
  }
}

function renderProducts(targetId="products-grid", list = state.products){
  const grid = document.getElementById(targetId);
  if(!grid) return;

  grid.innerHTML = list.map(p => `
    <div class="card" onclick="openProduct('${p.id}')">
      <img src="${p.img || "https://dummyimage.com/800x600/0b1022/ffffff&text=AD+ICONIQ"}" alt="${(p.title||"").replace(/"/g,"&quot;")}">
      <div class="card-body">
        <p class="card-name">${p.title}</p>
        <div class="price-row">
          <span class="price">${money(p.price, p.currency)}</span>
          <button class="smallbtn primary" onclick="event.stopPropagation(); addToCart('${p.id}')">Add</button>
        </div>
      </div>
    </div>
  `).join("");
}

function openProduct(productId){
  const p = state.products.find(x=>x.id === productId);
  if(!p) return;

  const modal = document.getElementById("product-modal");
  const title = document.getElementById("modal-title");
  const content = document.getElementById("modal-content");
  if(!modal || !title || !content) return;

  title.textContent = p.title;

  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
      <img style="width:100%;height:280px;object-fit:cover;border-radius:18px;border:1px solid rgba(255,255,255,.16)"
           src="${p.img || "https://dummyimage.com/800x600/0b1022/ffffff&text=AD+ICONIQ"}" alt="">
      <div>
        <div class="kicker" style="margin-bottom:12px"><span class="badge">GLASS</span><span>${money(p.price, p.currency)}</span></div>
        <p class="notice">${(p.desc || "No description.").slice(0, 260)}</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:14px">
          <button class="btn btn-primary" onclick="addToCart('${p.id}'); closeModal()">Add to cart</button>
          <button class="btn" onclick="closeModal()">Close</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add("active");
}

function closeModal(){
  const modal = document.getElementById("product-modal");
  if(modal) modal.classList.remove("active");
}

function addToCart(productId){
  const p = state.products.find(x=>x.id === productId);
  if(!p){
    showToast("Product not loaded yet");
    return;
  }
  const found = state.cart.find(i=>i.id === productId);
  if(found) found.qty += 1;
  else state.cart.push({ id: p.id, title: p.title, img: p.img, price: p.price, currency: p.currency, variantId: p.variantId, qty: 1 });
  saveCart();
  updateCartBadge();
  showToast("Added to cart");
  renderCart();
}

function removeFromCart(productId){
  state.cart = state.cart.filter(i=>i.id !== productId);
  saveCart();
  updateCartBadge();
  renderCart();
}

function renderCart(){
  const grid = document.getElementById("cart-grid");
  if(!grid) return;

  if(!state.cart.length){
    grid.innerHTML = `<div class="glass"><div class="glass-inner"><p class="notice">Cart is empty.</p></div></div>`;
    return;
  }

  grid.innerHTML = state.cart.map(i => `
    <div class="card" style="cursor:default">
      <img src="${i.img || "https://dummyimage.com/800x600/0b1022/ffffff&text=AD+ICONIQ"}" alt="">
      <div class="card-body">
        <p class="card-name">${i.title}</p>
        <div class="price-row">
          <span class="price">${money(i.price, i.currency)} × ${i.qty}</span>
          <button class="smallbtn" style="border-color:rgba(255,59,59,.35);color:#ffd0d0" onclick="removeFromCart('${i.id}')">Remove</button>
        </div>
      </div>
    </div>
  `).join("");
}

function renderOrders(){
  const grid = document.getElementById("orders-grid");
  if(!grid) return;

  if(!state.orders.length){
    grid.innerHTML = `<div class="glass"><div class="glass-inner"><p class="notice">No device orders yet.</p></div></div>`;
    return;
  }

  grid.innerHTML = state.orders.map(o => `
    <div class="card" style="cursor:default">
      <div class="card-body">
        <p class="card-name">Order ${o.id}</p>
        <div class="notice">Total: ${money(o.total, o.currency)}</div>
        <div class="notice">Items: ${o.itemsCount}</div>
        <div class="notice">Date: ${new Date(o.createdAt).toLocaleString()}</div>
      </div>
    </div>
  `).join("");
}

async function pingAPI(){
  const el = document.getElementById("api-status");
  try{
    await loadProducts();
    if(el) el.textContent = "Online";
    const count = document.getElementById("count-status");
    if(count) count.textContent = String(state.products.length);
  }catch(err){
    if(el) el.textContent = "Failed";
    showToast(String(err.message || err));
  }
}

async function init(){
  updateCartBadge();

  // Search filter on pages that have a grid
  const search = document.getElementById("search-input");
  if(search){
    search.addEventListener("input", () => {
      const q = (search.value || "").toLowerCase().trim();
      const list = !q ? state.products : state.products.filter(p =>
        (p.title||"").toLowerCase().includes(q) || (p.desc||"").toLowerCase().includes(q)
      );
      renderProducts("products-grid", list);
    });
  }

  // Load products and render if a products grid exists
  const grid = document.getElementById("products-grid");
  if(grid){
    await pingAPI();
    renderProducts("products-grid", state.products.slice(0, 8)); // home: featured
    // if catalog page, show more
    if(location.pathname.endsWith("catalog.html")){
      renderProducts("products-grid", state.products);
    }
  } else {
    // Still ping on home for status boxes if present
    if(document.getElementById("api-status")) await pingAPI();
  }

  // Cart page
  renderCart();

  // Account page
  renderOrders();
}

// Real Shopify checkout redirect (simple + safe)
// This uses the Online Store cart permalink add syntax.
// It’s not “fancy” but it works without a server.
function goToShopifyCheckout(){
  if(!state.cart.length){
    showToast("Cart is empty");
    return;
  }

  // Requires variantId for each item
  const missing = state.cart.some(i=>!i.variantId);
  if(missing){
    showToast("Some items missing variantId");
    return;
  }

  const lines = state.cart.map(i => {
    // Shopify cart/add expects numeric variant id.
    // GraphQL variantId looks like "gid://shopify/ProductVariant/123"
    const m = String(i.variantId).match(/ProductVariant\/(\d+)/);
    const vid = m ? m[1] : null;
    return vid ? `${vid}:${i.qty}` : null;
  }).filter(Boolean);

  if(!lines.length){
    showToast("Cannot build checkout link");
    return;
  }

  const url = `https://${SHOPIFY_DOMAIN}/cart/${lines.join(",")}`;
  window.location.href = url;
}

// expose for inline handlers
window.closeModal = closeModal;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.clearCart = () => { state.cart = []; saveCart(); updateCartBadge(); renderCart(); showToast("Cart cleared"); };
window.goToShopifyCheckout = goToShopifyCheckout;
window.openProduct = openProduct;
window.showToast = showToast;

document.addEventListener("DOMContentLoaded", init);