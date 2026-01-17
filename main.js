const ADICONIQ_STORE = [
    {
        name: "EQUUS Leather Shoulder Bag",
        price: "$64.42",
        category: "Luxury Accessories",
        img: "https://adiconiq.com/cdn/shop/files/leather_bag_main.jpg"
    },
    {
        name: "VIVID MOTION Shorts",
        price: "$44.39",
        category: "Apparel",
        img: "https://adiconiq.com/cdn/shop/files/vivid_shorts.jpg"
    },
    {
        name: "La Flor Azul Track Pants",
        price: "$45.00",
        category: "Limited Edition",
        img: "https://adiconiq.com/cdn/shop/files/track_pants.jpg"
    }
];

const grid = document.getElementById('product-grid');

function initApp() {
    grid.innerHTML = ADICONIQ_STORE.map(item => `
        <div class="product-card">
            <img src="${item.img}" alt="${item.name}">
            <div class="product-info">
                <small style="text-transform: uppercase; opacity: 0.6;">${item.category}</small>
                <h2 style="font-size: 1.1rem; margin: 10px 0;">${item.name}</h2>
                <div class="price">${item.price}</div>
                <button class="buy-now" onclick="window.location.href='https://adiconiq.com'">Purchase</button>
            </div>
        </div>
    `).join('');
}

document.addEventListener('DOMContentLoaded', initApp);
