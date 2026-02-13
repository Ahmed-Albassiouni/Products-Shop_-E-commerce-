const productGrid = document.getElementById('productGrid');
const statusMessage = document.getElementById('statusMessage');
const categoryFilter = document.getElementById('categoryFilter');
const sortOrder = document.getElementById('sortOrder');
const searchInput = document.getElementById('searchInput');

let allProducts = [];

async function fetchProducts() {
    showStatus('Loading...');
    try {
        const response = await fetch('https://fakestoreapi.com/products');

        if (!response.ok) throw new Error('Failed to fetch products');

        allProducts = await response.json();

        if (allProducts.length === 0) {
            showStatus('Empty: No products found.', true);
        } else {
            populateCategories(allProducts);
            renderProducts(allProducts);
            showStatus('');
        }
    } catch (error) {
        showStatus(`Error: ${error.message}`, true);
    }
}

function renderProducts(products) {
    productGrid.innerHTML = '';

    if (products.length === 0) {
        productGrid.innerHTML = '<p>No products match your criteria.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h3>${product.title}</h3>
            <p class="category">${product.category}</p>
            <p class="price">$${product.price}</p>
        `;
        productGrid.appendChild(card);
    });
}

function updateUI() {
    let filtered = [...allProducts];

    const searchTerm = searchInput.value.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm));

    const category = categoryFilter.value;
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }

    const sort = sortOrder.value;
    if (sort === 'low-high') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sort === 'high-low') {
        filtered.sort((a, b) => b.price - a.price);
    }

    renderProducts(filtered);
}

function populateCategories(products) {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    categoryFilter.innerHTML = categories.map(cat =>
        `<option value="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</option>`
    ).join('');
}

function showStatus(msg, isError = false) {
    statusMessage.textContent = msg;
    statusMessage.style.color = isError ? 'red' : 'inherit';
}

categoryFilter.addEventListener('change', updateUI);
sortOrder.addEventListener('change', updateUI);
searchInput.addEventListener('input', updateUI);

fetchProducts();