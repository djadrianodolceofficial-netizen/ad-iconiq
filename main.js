// === SHOPIFY CONFIG ===
const SHOPIFY_DOMAIN = "xfkvxx-iz.myshopify.com";
const STOREFRONT_TOKEN = "639111507512d9723d5efdd3fd6a8152";
const STOREFRONT_API_VERSION = "2026-01";
/ AD ICONIQ Mobile App - Main JavaScript

// Global state management
const AppState = {
    cart: JSON.parse(localStorage.getItem('adiconiq-cart') || '[]'),
    user: JSON.parse(localStorage.getItem('adiconiq-user') || '{}'),
    wishlist: JSON.parse(localStorage.getItem('adiconiq-wishlist') || '[]'),
    orders: JSON.parse(localStorage.getItem('adiconiq-orders') || '[]'),
    filters: {
        category: 'all',
        collection: 'all',
        priceRange: 200,
        sizes: [],
        colors: []
    },
    currentPage: window.location.pathname.split('/').pop() || 'index.html'
};

// Product data - Updated with actual AD ICONIQ products
const PRODUCTS = [
    {
        id: 1,
        name: "AD |CONIQ — La Flor Azul Zip Hoodie",
        price: 139,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/cairogyms.com/90b5f48a0f23c6760eaaeb84e5ae54b1e3849dd6.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "White"],
        description: "Premium floral-inspired athletic hoodie with moisture-wicking technology."
    },
    {
        id: 2,
        name: "AD |CONIQ VANTAGE MOTION SHORTS",
        price: 58,
        category: "mens",
        image: "https://kimi-web-img.moonshot.cn/img/www.luxurysocietyasia.com/9d860b4066f0a5cb75908ca4fba2f03340cf313c.jpeg",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray"],
        description: "Precision-cut, featherlight shorts built for maximum mobility."
    },
    {
        id: 3,
        name: "AD |CONIQ — La Flor Azul Sports Bra",
        price: 62,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/cdn.shopify.com/754adc1a5def10d9f20d5b67a060a9d299b3f291.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "White"],
        description: "Premium floral-inspired sports bra with high support."
    },
    {
        id: 4,
        name: "AD |CONIQ — La Flor Azul Men's Low Top Sneakers",
        price: 65,
        category: "footwear",
        image: "https://kimi-web-img.moonshot.cn/img/kingssleeve.com/f765f6f8f5fbf8bccbc85330df3cd3c2296d6415.jpeg",
        sizes: ["7", "8", "9", "10", "11"],
        colors: ["White", "Blue"],
        description: "Designer low-top sneakers with premium comfort."
    },
    {
        id: 5,
        name: "AD |CONIQ — La Flor Azul Clutch Bag",
        price: 59,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/m.media-amazon.com/2558cdfade2bb4faf125b388d8fd52b6b1cd4dcb.jpg",
        sizes: ["One Size"],
        colors: ["Blue", "White"],
        description: "Elegant clutch bag with floral-inspired design."
    },
    {
        id: 6,
        name: "AD |CONIQ — La Flor Azul Guard Top",
        price: 59,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/row.gymshark.com/8cc9e413758d0f97367fc27d40660a256f9c087d",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "White"],
        description: "Premium guard top with athletic fit and comfort."
    },
    {
        id: 7,
        name: "AD |CONIQ — La Flor Azul Joggers",
        price: 75,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/img.freepik.com/9cdbfe3d99c864086025a4b4836d83e326ae0b0f.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "White"],
        description: "Premium joggers with floral-inspired design."
    },
    {
        id: 8,
        name: "AD |CONIQ — VANTAGE ZIP HOODIE",
        price: 91,
        category: "mens",
        image: "https://kimi-web-img.moonshot.cn/img/cdn.shopify.com/d5171e8b56045f8f146f776047e71cadf4c26684.jpg",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray"],
        description: "Premium vantage zip hoodie with modern silhouette."
    },
    {
        id: 9,
        name: "AD |CONIQ AERO WEAVE SUMMER SHIRT",
        price: 59,
        category: "mens",
        image: "https://kimi-web-img.moonshot.cn/img/vader-prod.s3.amazonaws.com/61f726e147d8e3f501b4676ba75ac815df9e60fc.jpg",
        sizes: ["S", "M", "L", "XL"],
        colors: ["White", "Gray"],
        description: "Light, cool summer shirt built for brutal heat and sharp style."
    },
    {
        id: 10,
        name: "ICONIQ EQUUS Leather Shoulder Bag",
        price: 84,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/img.freepik.com/8fdc07ab3534c670f34b62b7cff0a589919b839c.jpg",
        sizes: ["One Size"],
        colors: ["Black", "Brown"],
        description: "Premium leather shoulder bag with equestrian-inspired design."
    },
    {
        id: 11,
        name: "AD ICONIQ Equestrian Silhouette Sports Duffel Bag",
        price: 87,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/img.freepik.com/6a125f027eeca5343c949ee1ed5c7b70505a251c.jpg",
        sizes: ["One Size"],
        colors: ["Black", "Navy"],
        description: "Premium sports duffel bag with equestrian silhouette design."
    },
    {
        id: 12,
        name: "AD |CONIQ — La Flor Azul CROSSBODY WAIST BAG",
        price: 46,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/www.darveys.com/776c252041693634243087e63ac11099a45f15bd.jpg",
        sizes: ["One Size"],
        colors: ["Blue", "White"],
        description: "Versatile crossbody waist bag with floral-inspired design."
    },
    {
        id: 13,
        name: "AD |CONIQ — La Flor Azul  Women's Thong",
        price: 32,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/d720be0c4997d04ef24a2a8856832abb58648c45.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "White"],
        description: "Premium women's thong with floral-inspired design."
    },
    {
        id: 14,
        name: "AD ICONIQ Equestrian Silhouette Tote Bag",
        price: 91,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/johngress.com/d22b9d98c9b77f1d0c3225278224e21ae6ff6265.jpg",
        sizes: ["One Size"],
        colors: ["Black", "Navy"],
        description: "Premium tote bag with equestrian silhouette design."
    },
    {
        id: 15,
        name: "AD |CONIQ — La Flor Azul TRACK PANTS",
        price: 59,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/johngress.com/c90603f629ee2348b8b25c81a04e54f6187a47fd.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Blue", "White"],
        description: "Premium track pants with floral-inspired design."
    },
    {
        id: 16,
        name: "AD |CONIQ Garden of Eyes Bloom Kimono Robe",
        price: 75,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/img.freepik.com/32cffc2e951a6e40302a660c113462e8af4bd263.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "White"],
        description: "Elegant kimono robe with garden of eyes bloom design."
    },
    {
        id: 17,
        name: "AD |CONIQ AURA SCULPT ONE-PIECE",
        price: 52,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/www.liveenhanced.com/6e85915f7e5defb883d0e9f3929751fc989bda03.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "Navy"],
        description: "Sleek, sculpting one-piece that works for every body."
    },
    {
        id: 18,
        name: "AD |CONIQ STRYKER LONG-LINE SPORTS BRA",
        price: 65,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/cdn.ecommercedns.uk/abae63f194162c40d561e76e4cbb730aabb868d3.png",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "White"],
        description: "Built for power, designed for style with long-line support."
    },
    {
        id: 19,
        name: "AD |CONIQ  LUMINA BANDEAU BIKINI SET",
        price: 59,
        category: "womens",
        image: "https://kimi-web-img.moonshot.cn/img/cdn.luxe.digital/ec5cad9dc5a5f9bae85eede664852505762b4954.jpg",
        sizes: ["XS", "S", "M", "L"],
        colors: ["Black", "White"],
        description: "Made for heat, movement, and unapologetic confidence."
    },
    {
        id: 20,
        name: "AD |CONIQ — La Flor Azul Magnetic Phone Case",
        price: 39,
        category: "accessories",
        image: "https://kimi-web-img.moonshot.cn/img/hips.hearstapps.com/802da5174d688d76cd3f7201419f2a4fff305a01.png",
        sizes: ["One Size"],
        colors: ["Blue", "White"],
        description: "Magnetic phone case with floral-inspired design."
    }
];

// Initialize app when DOM is loaded

// PWA: service worker registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadPageContent();
});

// Initialize application
function initializeApp() {
    updateCartBadge();
    initializeAnimations();
    
    // Initialize hero background effect on index page
    if (AppState.currentPage === 'index.html' || AppState.currentPage === '') {
        initializeHeroBackground();
        initializeCollectionsCarousel();
    }
    
    // Initialize catalog page
    if (AppState.currentPage === 'catalog.html') {
        loadProducts();
    }
    
    // Initialize cart page
    if (AppState.currentPage === 'cart.html') {
        loadCartItems();
    }
    
    // Initialize account page
    if (AppState.currentPage === 'account.html') {
        initializeAccountPage();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSignup);
    }
    
    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
    
    // Search input
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchProducts, 300));
    }
}

// Initialize animations
function initializeAnimations() {
    // Fade in animations for elements
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                anime({
                    targets: entry.target,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutCubic',
                    delay: anime.stagger(100)
                });
                observer.unobserve(entry.target);
            }
        });
    });
    
    fadeElements.forEach(el => observer.observe(el));
}

// Initialize hero background with PIXI.js
function initializeHeroBackground() {
    const heroPattern = document.getElementById('hero-pattern');
    if (!heroPattern) return;
    
    try {
        const app = new PIXI.Application({
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: 0x1a1a1a,
            transparent: true
        });
        
        heroPattern.appendChild(app.view);
        
        // Create flowing gradient effect
        const graphics = new PIXI.Graphics();
        app.stage.addChild(graphics);
        
        let time = 0;
        
        function animate() {
            time += 0.01;
            
            graphics.clear();
            
            // Create flowing shapes
            for (let i = 0; i < 5; i++) {
                const x = Math.sin(time + i) * 100 + window.innerWidth / 2;
                const y = Math.cos(time + i * 0.5) * 50 + window.innerHeight / 2;
                const radius = Math.sin(time + i) * 20 + 40;
                
                graphics.beginFill(0x404040, 0.1);
                graphics.drawCircle(x, y, radius);
                graphics.endFill();
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            app.renderer.resize(window.innerWidth, window.innerHeight);
        });
        
    } catch (error) {
        console.log('PIXI.js not available, using fallback background');
    }
}

// Initialize collections carousel
function initializeCollectionsCarousel() {
    const carousel = document.getElementById('collections-carousel');
    if (!carousel) return;
    
    try {
        new Splide(carousel, {
            type: 'loop',
            perPage: 1,
            perMove: 1,
            gap: '1rem',
            autoplay: true,
            interval: 4000,
            pauseOnHover: true,
            arrows: false,
            pagination: true,
            breakpoints: {
                768: {
                    perPage: 1
                }
            }
        }).mount();
    } catch (error) {
        console.log('Splide not available');
    }
}

// Cart management functions
function addToCart(productId, size = null, color = null) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = AppState.cart.find(item => 
        item.id === productId && 
        item.size === size && 
        item.color === color
    );
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        AppState.cart.push({
            ...product,
            size,
            color,
            quantity: 1,
            addedAt: new Date().toISOString()
        });
    }
    
    saveCart();
    updateCartBadge();
    showNotification('Added to cart!');
}

function removeFromCart(productId, size = null, color = null) {
    AppState.cart = AppState.cart.filter(item => 
        !(item.id === productId && item.size === size && item.color === color)
    );
    
    saveCart();
    updateCartBadge();
    
    if (AppState.currentPage === 'cart.html') {
        loadCartItems();
    }
}

function updateCartQuantity(productId, size, color, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId, size, color);
        return;
    }
    
    const item = AppState.cart.find(item => 
        item.id === productId && item.size === size && item.color === color
    );
    
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartBadge();
        
        if (AppState.currentPage === 'cart.html') {
            loadCartItems();
        }
    }
}

function clearCart() {
    AppState.cart = [];
    saveCart();
    updateCartBadge();
    
    if (AppState.currentPage === 'cart.html') {
        loadCartItems();
    }
}

function saveCart() {
    localStorage.setItem('adiconiq-cart', JSON.stringify(AppState.cart));
}

function saveOrders() {
    localStorage.setItem('adiconiq-orders', JSON.stringify(AppState.orders));
}


function saveWishlist() {
    localStorage.setItem('adiconiq-wishlist', JSON.stringify(AppState.wishlist));
}

function isWishlisted(productId) {
    return AppState.wishlist.includes(productId);
}

function toggleWishlist(productId) {
    if (isWishlisted(productId)) {
        AppState.wishlist = AppState.wishlist.filter(id => id !== productId);
        showNotification('Removed from wishlist');
    } else {
        AppState.wishlist.push(productId);
        showNotification('Saved to wishlist');
    }
    saveWishlist();

    // Refresh product grids if present
    if (AppState.currentPage === 'catalog.html') {
        loadProducts();
    }
}

function updateCartBadge() {
    const cartCount = AppState.cart.reduce((total, item) => total + item.quantity, 0);
    const badgeElements = document.querySelectorAll('#cart-count');
    
    badgeElements.forEach(badge => {
        if (cartCount > 0) {
            badge.textContent = cartCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    });
}

// Product display functions
function loadProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = getFilteredProducts();
    
    productsGrid.innerHTML = filteredProducts.map(product => {
        const wished = isWishlisted(product.id);
        return `
        <div class="product-card fade-in relative" onclick="openProductModal(${product.id})">
            <button aria-label="Toggle wishlist" 
                    onclick="event.stopPropagation(); toggleWishlist(${product.id})"
                    class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-2 rounded-full shadow">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
                </svg>
            </button>
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-sm mb-2 line-clamp-2">${product.name}</h3>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">$${product.price}</span>
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                            class="btn-primary text-xs px-3 py-1">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    
    // Re-initialize animations for new elements
    initializeAnimations();
}

function getFilteredProducts() {
    return PRODUCTS.filter(product => {
        // Collection filter (soft match by product name)
        if (AppState.filters.collection !== 'all') {
            const name = (product.name || '').toLowerCase();
            const desired = AppState.filters.collection.toLowerCase();
            // Basic mapping: treat collection names as substring matches
            if (!name.includes(desired)) {
                // Special cases
                const alt = {
                    'la flor azul': ['la flor azul', 'flor azul'],
                    'vantage': ['vantage'],
                    'essential': ['essential']
                };
                const acceptable = alt[desired] || [desired];
                const ok = acceptable.some(k => name.includes(k));
                if (!ok) return false;
            }
        }

        // Category filter
        if (AppState.filters.category !== 'all' && product.category !== AppState.filters.category) {
            return false;
        }
        
        // Price filter
        if (product.price > AppState.filters.priceRange) {
            return false;
        }
        
        // Size filter
        if (AppState.filters.sizes.length > 0) {
            const hasMatchingSize = AppState.filters.sizes.some(size => 
                product.sizes.includes(size)
            );
            if (!hasMatchingSize) return false;
        }
        
        // Color filter
        if (AppState.filters.colors.length > 0) {
            const hasMatchingColor = AppState.filters.colors.some(color => 
                product.colors.includes(color)
            );
            if (!hasMatchingColor) return false;
        }
        
        return true;
    });
}

function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;
    
    const filteredProducts = getFilteredProducts().filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm)
    );
    
    productsGrid.innerHTML = filteredProducts.map(product => {
        const wished = isWishlisted(product.id);
        return `
        <div class="product-card fade-in relative" onclick="openProductModal(${product.id})">
            <button aria-label="Toggle wishlist" 
                    onclick="event.stopPropagation(); toggleWishlist(${product.id})"
                    class="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-2 rounded-full shadow">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="${wished ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"/>
                </svg>
            </button>
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-sm mb-2 line-clamp-2">${product.name}</h3>
                <div class="flex justify-between items-center">
                    <span class="font-bold text-lg">$${product.price}</span>
                    <button onclick="event.stopPropagation(); addToCart(${product.id})" 
                            class="btn-primary text-xs px-3 py-1">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
    
    initializeAnimations();
}

function filterProducts(category, element = null) {
    AppState.filters.category = category;
    
    // Update active filter chip
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    const target = element || (typeof event !== 'undefined' ? event.target : null);
    if (target && target.classList) {
        target.classList.add('active');
    }
    
    loadProducts();
}

// Product modal functions
function openProductModal(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    modalTitle.textContent = product.name;
    modalContent.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover rounded-lg mb-4">
        <p class="text-gray-600 mb-4">${product.description}</p>
        <div class="mb-4">
            <h4 class="font-semibold mb-2">Size</h4>
            <div class="flex flex-wrap gap-2">
                ${product.sizes.map(size => `
                    <button class="filter-chip" onclick="selectSize(this, '${size}')">${size}</button>
                `).join('')}
            </div>
        </div>
        <div class="mb-6">
            <h4 class="font-semibold mb-2">Color</h4>
            <div class="flex flex-wrap gap-2">
                ${product.colors.map(color => `
                    <button class="filter-chip" onclick="selectColor(this, '${color}')">${color}</button>
                `).join('')}
            </div>
        </div>
        <div class="flex justify-between items-center">
            <span class="font-bold text-2xl">$${product.price}</span>
            <button onclick="addToCartFromModal(${product.id})" class="btn-primary">
                Add to Cart
            </button>
        </div>
    `;
    
    modal.classList.add('active');
    
    // Store selected options
    modal.dataset.productId = productId;
    modal.dataset.selectedSize = '';
    modal.dataset.selectedColor = '';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
}

function selectSize(element, size) {
    // Remove active class from all size buttons
    element.parentElement.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    element.classList.add('active');
    
    // Store selected size
    const modal = document.getElementById('product-modal');
    modal.dataset.selectedSize = size;
}

function selectColor(element, color) {
    // Remove active class from all color buttons
    element.parentElement.querySelectorAll('.filter-chip').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected button
    element.classList.add('active');
    
    // Store selected color
    const modal = document.getElementById('product-modal');
    modal.dataset.selectedColor = color;
}

function addToCartFromModal(productId) {
    const modal = document.getElementById('product-modal');
    const selectedSize = modal.dataset.selectedSize;
    const selectedColor = modal.dataset.selectedColor;

    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
        // If a product has multiple options, force a selection to avoid “mystery variants”
        if (product.sizes.length > 1 && !selectedSize) {
            showNotification('Select a size first', 'error');
            return;
        }
        if (product.colors.length > 1 && !selectedColor) {
            showNotification('Select a color first', 'error');
            return;
        }
    }
    
    addToCart(productId, selectedSize, selectedColor);
    closeModal();
}

// Filter modal functions
function toggleFilters() {
    const modal = document.getElementById('filter-modal');
    modal.classList.toggle('active');
}

function updatePriceFilter() {
    const range = document.getElementById('price-range');
    const maxPrice = document.getElementById('max-price');
    
    AppState.filters.priceRange = parseInt(range.value);
    maxPrice.textContent = range.value == 200 ? '$200+' : `$${range.value}`;
}

function toggleSizeFilter(element, size) {
    element.classList.toggle('active');
    
    if (AppState.filters.sizes.includes(size)) {
        AppState.filters.sizes = AppState.filters.sizes.filter(s => s !== size);
    } else {
        AppState.filters.sizes.push(size);
    }
}

function toggleColorFilter(element, color) {
    element.classList.toggle('active');
    
    if (AppState.filters.colors.includes(color)) {
        AppState.filters.colors = AppState.filters.colors.filter(c => c !== color);
    } else {
        AppState.filters.colors.push(color);
    }
}

function clearFilters() {
    AppState.filters = {
        category: 'all',
        collection: 'all',
        priceRange: 200,
        sizes: [],
        colors: []
    };
    
    // Reset UI
    document.getElementById('price-range').value = 200;
    document.getElementById('max-price').textContent = '$200+';
    document.querySelectorAll('.filter-chip.active').forEach(chip => {
        chip.classList.remove('active');
    });
    
    toggleFilters();
    loadProducts();
}

function applyFilters() {
    toggleFilters();
    loadProducts();
}

// Cart page functions
function loadCartItems() {
    const cartContent = document.getElementById('cart-content');
    const emptyCart = document.getElementById('empty-cart');
    const orderSummary = document.getElementById('order-summary');
    
    if (!cartContent) return;
    
    if (AppState.cart.length === 0) {
        cartContent.classList.add('hidden');
        emptyCart.classList.remove('hidden');
        orderSummary.classList.add('hidden');
        return;
    }
    
    cartContent.classList.remove('hidden');
    emptyCart.classList.add('hidden');
    orderSummary.classList.remove('hidden');
    
    cartContent.innerHTML = AppState.cart.map(item => `
        <div class="cart-item">
            <div class="flex space-x-4">
                <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg">
                <div class="flex-1">
                    <h3 class="font-semibold mb-1">${item.name}</h3>
                    <p class="text-sm text-gray-600 mb-2">
                        ${item.size ? `Size: ${item.size}` : ''} 
                        ${item.color ? `Color: ${item.color}` : ''}
                    </p>
                    <div class="flex items-center justify-between">
                        <span class="font-bold text-lg">$${item.price}</span>
                        <div class="flex items-center space-x-3">
                            <button onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', ${item.quantity - 1})" 
                                    class="quantity-btn">-</button>
                            <span class="font-semibold">${item.quantity}</span>
                            <button onclick="updateCartQuantity(${item.id}, '${item.size}', '${item.color}', ${item.quantity + 1})" 
                                    class="quantity-btn">+</button>
                        </div>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id}, '${item.size}', '${item.color}')" 
                        class="text-red-500 hover:text-red-700">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
    
    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = AppState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 10;
    const discount = parseFloat(document.getElementById('discount')?.textContent?.replace('-$', '') || 0);
    const total = subtotal + shipping - discount;
    
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = shipping === 0 ? 'Free' : `$${shipping}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = AppState.cart.length === 0;
}

function applyPromoCode() {
    const promoInput = document.getElementById('promo-code');
    const promoCode = promoInput.value.trim().toUpperCase();
    
    // Mock promo codes
    const promoCodes = {
        'WELCOME15': 0.15,
        'SAVE10': 0.10,
        'VIP20': 0.20
    };
    
    if (promoCodes[promoCode]) {
        const subtotal = AppState.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const discount = subtotal * promoCodes[promoCode];
        
        document.getElementById('discount').textContent = `-$${discount.toFixed(2)}`;
        document.getElementById('discount-row').style.display = 'flex';
        
        showNotification('Promo code applied!');
        promoInput.value = '';
        updateOrderSummary();
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

function proceedToCheckout() {
    if (AppState.cart.length === 0) return;
    
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('active');
}

function toggleCheckout() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.toggle('active');
}

function handleCheckout(event) {
    event.preventDefault();

    if (AppState.cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const form = event.target;
    const formData = new FormData(form);

    const shipping = {
        fullName: String(formData.get('fullName') || '').trim() || `${String(formData.get('firstName')||'').trim()} ${String(formData.get('lastName')||'').trim()}`.trim(),
        email: String(formData.get('email') || '').trim(),
        phone: String(formData.get('phone') || '').trim(),
        address: String(formData.get('address') || '').trim(),
        city: String(formData.get('city') || '').trim(),
        state: String(formData.get('state') || '').trim(),
        zip: String(formData.get('zip') || '').trim()
    };

    const required = ['fullName','email','address','city','state','zip'];
    for (const key of required) {
        if (!shipping[key]) {
            showNotification('Please complete all required fields', 'error');
            return;
        }
    }

    const subtotal = AppState.cart.reduce((t, i) => t + (i.price * i.quantity), 0);
    const shippingFee = subtotal > 100 ? 0 : 8.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shippingFee + tax;

    const now = new Date();
    const orderId = `AD-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

    const order = {
        id: orderId,
        createdAt: now.toISOString(),
        status: 'processing',
        items: AppState.cart.map(i => ({
            productId: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            size: i.size || null,
            color: i.color || null,
            image: i.image || null
        })),
        subtotal: Number(subtotal.toFixed(2)),
        shipping: Number(shippingFee.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
        shippingAddress: shipping
    };

    showNotification('Placing order...');

    setTimeout(() => {
        AppState.orders.unshift(order);
        saveOrders();

        clearCart();
        toggleCheckout();

        showNotification('Order placed successfully!');

        setTimeout(() => {
            window.location.href = `account.html?order=${encodeURIComponent(orderId)}`;
        }, 1200);
    }, 900);
}

// Account page functions
function initializeAccountPage() {
    renderOrders();

    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('order');
    if (orderId) {
        viewOrder(orderId);
    }

    // Initialize order tracking chart if ECharts is available
    if (typeof echarts !== 'undefined') {
        initializeOrderChart();
    }
}

function switchTab(tabName, element = null) {
    // Update tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const target = element || (typeof event !== 'undefined' ? event.target : null);
    if (target && target.classList) {
        target.classList.add('active');
    }
    
    // Update sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(`${tabName}-section`).classList.add('active');
}


function formatDateShort(iso) {
    try {
        return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return iso;
    }
}

function orderStatusLabel(status) {
    const s = String(status || '').toLowerCase();
    if (s === 'delivered') return { text: 'Delivered', cls: 'status-delivered' };
    if (s === 'shipped') return { text: 'Shipped', cls: 'status-shipped' };
    return { text: 'Processing', cls: 'status-processing' };
}

function renderOrders() {
    const container = document.querySelector('#orders-section .space-y-4');
    if (!container) return;

    if (!Array.isArray(AppState.orders) || AppState.orders.length === 0) {
        container.innerHTML = `
            <div class="p-6 bg-white rounded-xl shadow-sm text-center">
                <p class="text-gray-600 mb-4">No orders yet.</p>
                <a href="catalog.html" class="btn-primary inline-block" style="width:auto;">Shop the catalog</a>
            </div>
        `;
        return;
    }

    container.innerHTML = AppState.orders.map(order => {
        const status = orderStatusLabel(order.status);
        const itemsCount = Array.isArray(order.items) ? order.items.reduce((t, i) => t + (i.quantity || 0), 0) : 0;
        const total = typeof order.total === 'number' ? order.total : 0;
        const date = order.createdAt ? formatDateShort(order.createdAt) : '';
        return `
            <div class="order-card">
                <div class="flex justify-between items-start mb-3">
                    <div>
                        <h3 class="font-semibold">Order #${order.id}</h3>
                        <p class="text-sm text-gray-600">${date}</p>
                    </div>
                    <span class="order-status ${status.cls}">${status.text}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">${itemsCount} item${itemsCount === 1 ? '' : 's'}</span>
                    <span class="font-semibold">$${Number(total).toFixed(2)}</span>
                </div>
                <button onclick="viewOrder('${order.id}')" class="btn-secondary mt-3 text-sm py-2">
                    View Details
                </button>
            </div>
        `;
    }).join('');
}

function viewOrder(orderId) {
    const modal = document.getElementById('order-modal');
    const orderDetails = document.getElementById('order-details');

    const order = (AppState.orders || []).find(o => o.id === orderId);

    if (!order) {
        orderDetails.innerHTML = `
            <div class="space-y-4">
                <div class="flex justify-between">
                    <span class="font-semibold">Order ID:</span>
                    <span>${orderId}</span>
                </div>
                <p class="text-sm text-gray-600">Order not found on this device.</p>
            </div>
        `;
        modal.classList.add('active');
        return;
    }

    const status = orderStatusLabel(order.status);
    const itemsHtml = (order.items || []).map(i => `
        <div class="flex justify-between text-sm">
            <span class="text-gray-700">${i.name}${i.size ? ` • ${i.size}` : ''}${i.color ? ` • ${i.color}` : ''} × ${i.quantity}</span>
            <span class="text-gray-900">$${(i.price * i.quantity).toFixed(2)}</span>
        </div>
    `).join('');

    orderDetails.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between">
                <span class="font-semibold">Order ID:</span>
                <span>${order.id}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Placed:</span>
                <span>${formatDateShort(order.createdAt)}</span>
            </div>
            <div class="flex justify-between">
                <span class="font-semibold">Status:</span>
                <span class="order-status ${status.cls}">${status.text}</span>
            </div>

            <div class="border-t pt-3">
                <div class="font-semibold mb-2">Items</div>
                <div class="space-y-2">
                    ${itemsHtml}
                </div>
            </div>

            <div class="border-t pt-3 space-y-2 text-sm">
                <div class="flex justify-between"><span>Subtotal</span><span>$${Number(order.subtotal || 0).toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Shipping</span><span>$${Number(order.shipping || 0).toFixed(2)}</span></div>
                <div class="flex justify-between"><span>Tax</span><span>$${Number(order.tax || 0).toFixed(2)}</span></div>
                <div class="flex justify-between font-semibold text-base"><span>Total</span><span>$${Number(order.total || 0).toFixed(2)}</span></div>
            </div>
        </div>
    `;

    modal.classList.add('active');

    setTimeout(() => {
        initializeTrackingChart();
    }, 100);
}

function closeOrderModal() {
    const modal = document.getElementById('order-modal');
    modal.classList.remove('active');
}

function initializeTrackingChart() {
    const chartDom = document.getElementById('tracking-chart');
    if (!chartDom || typeof echarts === 'undefined') return;
    
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'Order Progress',
            left: 'center',
            textStyle: {
                fontSize: 14,
                fontWeight: 'normal'
            }
        },
        xAxis: {
            type: 'category',
            data: ['Ordered', 'Processing', 'Shipped', 'Delivered']
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: [{
            data: [1, 1, 1, 1],
            type: 'line',
            smooth: true,
            lineStyle: {
                color: '#1a1a1a',
                width: 3
            },
            itemStyle: {
                color: '#1a1a1a'
            },
            areaStyle: {
                color: 'rgba(26, 26, 26, 0.1)'
            }
        }]
    };
    
    myChart.setOption(option);
}

// Utility functions
function scrollToCollections() {
    const collectionsSection = document.getElementById('collections');
    if (collectionsSection) {
        collectionsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function viewCollection(collectionName) {
    // Redirect to catalog with collection filter
    window.location.href = `catalog.html?collection=${collectionName}`;
}

function handleNewsletterSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const email = formData.get('email') || document.getElementById('email').value;
    
    if (!email) {
        showNotification('Please enter your email address', 'error');
        return;
    }
    
    // Simulate API call
    showNotification('Subscribing...');
    
    setTimeout(() => {
        localStorage.setItem('adiconiq-newsletter', 'true');
        showNotification('Welcome! Check your email for 15% off discount code.');
        event.target.reset();
    }, 1000);
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    anime({
        targets: notification,
        translateX: [300, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
    });
    
    // Remove after delay
    setTimeout(() => {
        anime({
            targets: notification,
            translateX: [0, 300],
            opacity: [1, 0],
            duration: 300,
            easing: 'easeInCubic',
            complete: () => {
                document.body.removeChild(notification);
            }
        });
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Account page functions
function editProfile() {
    showNotification('Profile editing coming soon!');
}

function manageAddresses() {
    showNotification('Address management coming soon!');
}

function managePayments() {
    showNotification('Payment management coming soon!');
}

function toggleNotifications() {
    showNotification('Notification settings updated!');
}

function changePassword() {
    showNotification('Password change coming soon!');
}

function contactSupport() {
    showNotification('Support chat coming soon!');
}

function signOut() {
    localStorage.clear();
    showNotification('Signed out successfully!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function loadPageContent() {
    // Handle page-specific URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const collection = urlParams.get('collection');
    const category = urlParams.get('category');
    
    if (collection && AppState.currentPage === 'catalog.html') {
        // Filter by collection
        AppState.filters.collection = collection;
        AppState.filters.category = 'all';
        loadProducts();
    }
    
    if (category && AppState.currentPage === 'catalog.html') {
        // Filter by category
        AppState.filters.category = category;
        AppState.filters.collection = 'all';
        loadProducts();
        
        // Update active filter chip
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.classList.remove('active');
            if (chip.textContent.toLowerCase() === category) {
                chip.classList.add('active');
            }
        });
    }
}

// Export functions for global access
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.clearCart = clearCart;
window.toggleWishlist = toggleWishlist;
window.openProductModal = openProductModal;
window.closeModal = closeModal;
window.selectSize = selectSize;
window.selectColor = selectColor;
window.addToCartFromModal = addToCartFromModal;
window.toggleFilters = toggleFilters;
window.updatePriceFilter = updatePriceFilter;
window.toggleSizeFilter = toggleSizeFilter;
window.toggleColorFilter = toggleColorFilter;
window.clearFilters = clearFilters;
window.applyFilters = applyFilters;
window.filterProducts = filterProducts;
window.searchProducts = searchProducts;
window.scrollToCollections = scrollToCollections;
window.viewCollection = viewCollection;
window.applyPromoCode = applyPromoCode;
window.proceedToCheckout = proceedToCheckout;
window.toggleCheckout = toggleCheckout;
window.switchTab = switchTab;
window.viewOrder = viewOrder;
window.closeOrderModal = closeOrderModal;
window.editProfile = editProfile;
window.manageAddresses = manageAddresses;
window.managePayments = managePayments;
window.toggleNotifications = toggleNotifications;
window.changePassword = changePassword;
window.contactSupport = contactSupport;
window.signOut = signOut;
