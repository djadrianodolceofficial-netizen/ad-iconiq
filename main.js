const products = [
    {
        id: 1,
        name: "Luxury Motion Watch",
        price: "$2,499",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500" // Replace with your actual product URL
    },
    {
        id: 2,
        name: "Iconic Gold Frames",
        price: "$850",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=500" 
    },
    // Add all your products here
];

const container = document.getElementById('product-container');

function renderProducts() {
    container.innerHTML = products.map(product => `
        <div class="product-card glass-card">
            <img src="${product.image}" class="product-image" alt="${product.name}">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p style="color: #c5a059; font-weight: bold;">${product.price}</p>
                <button class="btn-buy" onclick="addToCart(${product.id})">Add to Collection</button>
            </div>
        </div>
    `).join('');
}

function addToCart(id) {
    const product = products.find(p => p.id === id);
    alert(`${product.name} has been added to your cart.`);
}

renderProducts();
