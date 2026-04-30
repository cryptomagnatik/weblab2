const peopleMultipliers = {
    1: 1.2,
    2: 2,
    3: 2.85,
    4: 3.65,
    5: 4.45
};

const tours = [
    { id: "egypt", image: "images/egypt.png", country: "Єгипет", city: "Шарм-ель-Шейх", duration: "7 днів", price: 36000 },
    { id: "china", image: "images/china.jpeg", country: "Китай", city: "Пекін", duration: "8 днів", price: 72000 },
    { id: "turkey", image: "images/turkey.jpg", country: "Туреччина", city: "Анталія", duration: "7 днів", price: 39000 },
    { id: "albania", image: "images/albania.jpg", country: "Албанія", city: "Саранда", duration: "7 днів", price: 34000 },
    { id: "bulgaria", image: "images/bulgaria.jpeg", country: "Болгарія", city: "Сонячний берег", duration: "9 днів", price: 25000 },
    { id: "montenegro", image: "images/montenegro.jpg", country: "Чорногорія", city: "Будва", duration: "10 днів", price: 42000 }
];

const extraServices = [
    { id: "insurance", name: "Туристичне страхування", price: 1200, type: "insurance" },
    { id: "documents", name: "Допомога з документами", price: 2000, type: "fixed" },
    { id: "consultation", name: "Консультація щодо маршруту", price: 800, type: "fixed" },
    { id: "excursion", name: "Екскурсійна програма", price: 2500, type: "fixed" },
    { id: "guide", name: "Персональний гід", price: 3500, type: "fixed" },
    { id: "support", name: "Підтримка 24/7", price: 1000, type: "fixed" }
];

let cart = JSON.parse(localStorage.getItem("openworldCart")) || [];

cart.forEach(item => {
    if (!item.count) {
        item.count = item.people || item.quantity || 1;
    }
});

let toursList;
let extraServicesBlock;
let cartItemsBlock;
let cartTotalBlock;
let clearCartButton;
let orderButton;

function formatPrice(price) {
    return price.toLocaleString("uk-UA") + " грн";
}

function saveCart() {
    localStorage.setItem("openworldCart", JSON.stringify(cart));
}

function updateCart() {
    saveCart();
    renderCart();
}

function getItemTotal(item) {
    if (item.type === "tour") {
        return item.price * peopleMultipliers[item.count];
    }

    return item.price * item.count;
}

function getCartTotal() {
    let total = 0;

    cart.forEach(item => {
        total += getItemTotal(item);
    });

    return total;
}

function renderTours() {
    toursList.innerHTML = "";

    tours.forEach(tour => {
        toursList.innerHTML += `
            <tr>
                <td><img src="${tour.image}" alt="${tour.country}"></td>
                <td>${tour.country}</td>
                <td>${tour.city}</td>
                <td>${tour.duration}</td>
                <td>${formatPrice(tour.price)}</td>
                <td>
                    <select id="tour-${tour.id}" class="select-small">
                        <option value="1" selected>1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </td>
                <td>
                    <button class="add-btn" onclick="addTourToCart('${tour.id}')">
                        Додати
                    </button>
                </td>
            </tr>
        `;
    });
}

function renderExtraServices() {
    extraServicesBlock.innerHTML = "";

    extraServices.forEach(service => {
        let peopleSelect = "";

        if (service.type === "insurance") {
            peopleSelect = `
                <select id="service-${service.id}" class="select-small">
                    <option value="1" selected>1 людина</option>
                    <option value="2">2 людини</option>
                    <option value="3">3 людини</option>
                    <option value="4">4 людини</option>
                    <option value="5">5 людей</option>
                    <option value="6">6 людей</option>
                    <option value="7">7 людей</option>
                    <option value="8">8 людей</option>
                    <option value="9">9 людей</option>
                    <option value="10">10 людей</option>
                </select>
            `;
        }

        extraServicesBlock.innerHTML += `
            <div class="service-card">
                <h3>${service.name}</h3>
                ${service.type === "insurance" ? "<p>Ціна за одну людину</p>" : ""}
                <p class="service-price">${formatPrice(service.price)}</p>
                ${peopleSelect}
                <button class="add-btn" onclick="addServiceToCart('${service.id}')">
                    Додати
                </button>
            </div>
        `;
    });
}

function addTourToCart(id) {
    const tour = tours.find(tour => tour.id === id);
    const count = Number(document.getElementById("tour-" + id).value);
    const item = cart.find(item => item.id === id);

    if (item) {
        item.count = count;
    } else {
        cart.push({
            id: tour.id,
            type: "tour",
            name: tour.country + ", " + tour.city,
            price: tour.price,
            count: count
        });
    }

    updateCart();
}

function addServiceToCart(id) {
    const service = extraServices.find(service => service.id === id);
    const item = cart.find(item => item.id === id);

    let count = 1;

    if (service.type === "insurance") {
        count = Number(document.getElementById("service-" + id).value);
    }

    if (item) {
        if (service.type === "insurance") {
            item.count = count;
        } else {
            item.count++;
        }
    } else {
        cart.push({
            id: service.id,
            type: service.type,
            name: service.name,
            price: service.price,
            count: count
        });
    }

    updateCart();
}

function changeCount(index, number) {
    const item = cart[index];

    item.count += number;

    if (item.count < 1) {
        item.count = 1;
    }

    if (item.type === "tour" && item.count > 5) {
        item.count = 5;
    }

    if (item.type === "insurance" && item.count > 10) {
        item.count = 10;
    }

    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function renderCart() {
    cartItemsBlock.innerHTML = "";

    if (cart.length === 0) {
        cartItemsBlock.innerHTML = `<p class="empty-cart">Кошик порожній. Додайте тур або послугу.</p>`;
        cartTotalBlock.textContent = "0 грн";
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = getItemTotal(item);
        let details = "";

        if (item.type === "tour") {
            details = item.count + " люд. | ціна за 1 людину: " + formatPrice(item.price) +
                " | коефіцієнт: ×" + peopleMultipliers[item.count];
        } else if (item.type === "insurance") {
            details = item.count + " люд. × " + formatPrice(item.price);
        } else {
            details = item.count + " шт. × " + formatPrice(item.price);
        }

        cartItemsBlock.innerHTML += `
            <div class="cart-item">
                <div class="cart-info">
                    <h3>${item.name}</h3>
                    <p>${details}</p>
                </div>

                <div class="cart-actions">
                    <button class="qty-btn" onclick="changeCount(${index}, -1)">−</button>
                    <span>${item.count}</span>
                    <button class="qty-btn" onclick="changeCount(${index}, 1)">+</button>
                    <strong>${formatPrice(itemTotal)}</strong>
                    <button class="delete-btn" onclick="removeItem(${index})">Видалити</button>
                </div>
            </div>
        `;
    });

    cartTotalBlock.textContent = formatPrice(getCartTotal());
}

function orderCart() {
    if (cart.length === 0) {
        alert("Кошик порожній. Додайте тур або послугу перед оформленням замовлення.");
        return;
    }

    alert("Дякуємо за замовлення! Загальна сума: " + formatPrice(getCartTotal()));

    cart = [];
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
}

function startPage() {
    toursList = document.getElementById("tours-list");
    extraServicesBlock = document.getElementById("extra-services");
    cartItemsBlock = document.getElementById("cart-items");
    cartTotalBlock = document.getElementById("cart-total");
    clearCartButton = document.getElementById("clear-cart");
    orderButton = document.getElementById("order-btn");

    renderTours();
    renderExtraServices();
    renderCart();

    orderButton.addEventListener("click", orderCart);
    clearCartButton.addEventListener("click", clearCart);
}

window.addEventListener("DOMContentLoaded", startPage);