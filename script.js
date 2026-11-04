const tg = window.Telegram.WebApp;
tg.ready();
tg.expand();

// Данные о товарах (должны совпадать с базой в боте)
const products = [
    { id: 2, name: "Г.А.Ш.Ы.Ш", weights: [
        { w: "0.5", price: 0.00035, qty: 20 },
        { w: "1.0", price: 0.00057, qty: 15 },
        { w: "2.0", price: 0.00063, qty: 10 }
    ]}
];

let cart = [];
let total = 0;

function renderProducts() {
    const container = document.getElementById('products');
    container.innerHTML = '';
    products.forEach(p => {
        p.weights.forEach(w => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-info">
                    <h3>${p.name} — ${w.w}г</h3>
                    <p>${w.price} BTC | Осталось: ${w.qty} шт</p>
                </div>
                <button class="add-btn" onclick="addToCart(${p.id}, '${p.name}', '${w.w}', ${w.price})">+</button>
            `;
            container.appendChild(card);
        });
    });
}

function addToCart(pid, name, weight, price) {
    cart.push({ pid, name, weight, price });
    total += price;
    updateCart();
    tg.HapticFeedback.impactOccurred('light');
}

function updateCart() {
    const cartInfo = document.getElementById('cart-info');
    if (cart.length > 0) {
        cartInfo.classList.remove('hidden');
        document.getElementById('total-price').textContent = total.toFixed(8);
    } else {
        cartInfo.classList.add('hidden');
    }
}

function checkout() {
    const data = {
        action: 'create_order',
        items: cart,
        total: total
    };
    tg.sendData(JSON.stringify(data)); // Отправляет данные боту
    tg.close();
}

renderProducts();