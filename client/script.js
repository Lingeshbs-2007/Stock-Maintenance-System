// ===== Navigation Elements =====
const dashboardSection = document.getElementById('dashboardSection');
const addProductSection = document.getElementById('addProductSection');
const viewProductSection = document.getElementById('viewProductSection');

const homeBtn = document.getElementById('homeBtn');
const addBtn = document.getElementById('addBtn');
const viewBtn = document.getElementById('viewBtn');

// ===== Form Elements =====
const productForm = document.getElementById('productForm');
const productName = document.getElementById('productName');
const category = document.getElementById('category');
const supplier = document.getElementById('supplier');
const quantity = document.getElementById('quantity');
const price = document.getElementById('price');

// ===== Table Body =====
const productTable = document.getElementById('productTable');

// ===== Search / Filter / Sort =====
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const sortProducts = document.getElementById('sortProducts');

// ===== Dashboard Elements =====
const totalProducts = document.getElementById('totalProducts');
const totalQuantity = document.getElementById('totalQuantity');
const inStock = document.getElementById('inStock');
const lowStock = document.getElementById('lowStock');
const outStock = document.getElementById('outStock');

// ===== Global Variables =====
let products = [];
let editId = null;
const API_URL = "http://localhost:5000/api/products";

// ===== Load Products from Backend =====
async function loadProducts() {
    try {

        const response = await fetch(API_URL);
        products = await response.json();

        displayProducts();
        updateDashboard();

    } catch (error) {

        console.error("Error loading products:", error);

    }
}

// ===== Section Navigation =====
function showSection(section) {
    dashboardSection.classList.add('hidden');
    addProductSection.classList.add('hidden');
    viewProductSection.classList.add('hidden');

    section.classList.remove('hidden');
}

homeBtn.addEventListener('click', () => {
    showSection(dashboardSection);
});

addBtn.addEventListener('click', () => {
    showSection(addProductSection);
});

viewBtn.addEventListener('click', () => {
    showSection(viewProductSection);
});




// ===== Add / Update Product =====
productForm.addEventListener('submit', async function (e)  {
    e.preventDefault();

    const name = productName.value.trim();
    const cat = category.value;
    const sup = supplier.value.trim();
    const qty = parseInt(quantity.value);
    const pr = parseFloat(price.value);

    // Validation
    if (!name || !cat || !sup || isNaN(qty) || isNaN(pr)) {
        alert('Please fill all fields.');
        return;
    }

    if (qty < 0 || pr < 0) {
        alert('Quantity and Price cannot be negative.');
        return;
    }


  try {

    if (editId) {

    const response = await fetch(`${API_URL}/${editId}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            productName: name,
            category: cat,
            supplier: sup,
            quantity: qty,
            price: pr

        })

    });

    const data = await response.json();

    alert(data.message);

    editId = null;

    document.getElementById("saveBtn").textContent = "Save Product";

} else {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                productName: name,
                category: cat,
                supplier: sup,
                quantity: qty,
                price: pr

            })

        });

        const data = await response.json();

        alert(data.message);

    }

    productForm.reset();

    loadProducts();

    showSection(viewProductSection);

} catch (error) {

    console.error(error);

    alert("Something went wrong.");

}
});
// ===== Display Products =====
// ===== Display Products =====
function displayProducts(list = products) {

    productTable.innerHTML = '';

    if (list.length === 0) {
        productTable.innerHTML = `
            <tr>
                <td colspan="9">No products found</td>
            </tr>
        `;
        return;
    }

    list.forEach(product => {

        const row = document.createElement('tr');

        let statusClass = '';

        if (product.stockStatus === 'In Stock')
            statusClass = 'inStock';

        if (product.stockStatus === 'Low Stock')
            statusClass = 'lowStock';

        if (product.stockStatus === 'Out of Stock')
            statusClass = 'outStock';

        row.innerHTML = `
            <td>${product.productId}</td>
            <td>${product.productName}</td>
            <td>${product.category}</td>
            <td>${product.supplier}</td>
            <td>${product.quantity}</td>
            <td>₹${product.price}</td>
            <td class="${statusClass}">${product.stockStatus}</td>
            <td>${new Date(product.dateAdded).toLocaleDateString()}</td>
            <td>
                <button class="editBtn" onclick="editProduct('${product._id}')">Edit</button>

                <button class="deleteBtn" onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        `;

        productTable.appendChild(row);

    });

}
// ===== Edit Product =====
// ===== Edit Product =====
function editProduct(id) {

    const product = products.find(p => p._id === id);

    productName.value = product.productName;
    category.value = product.category;
    supplier.value = product.supplier;
    quantity.value = product.quantity;
    price.value = product.price;

    editId = id;

    document.getElementById("saveBtn").textContent = "Update Product";

    showSection(addProductSection);

}

// ===== Delete Product =====
// ===== Delete Product =====
async function deleteProduct(id) {

    const confirmDelete = confirm("Are you sure you want to delete this product?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(`${API_URL}/${id}`, {

            method: "DELETE"

        });

        const data = await response.json();

        alert(data.message);
await loadProducts();

    } catch (error) {

        console.error(error);

        alert("Failed to delete product.");

    }

}
// ===== Update Dashboard =====
function updateDashboard() {
    totalProducts.textContent = products.length;

    const totalQty = products.reduce((sum, p) => sum + p.quantity, 0);
    totalQuantity.textContent = totalQty;

    inStock.textContent = products.filter(p => p.stockStatus === 'In Stock').length;
lowStock.textContent = products.filter(p => p.stockStatus === 'Low Stock').length;
outStock.textContent = products.filter(p => p.stockStatus === 'Out of Stock').length;
}
// ===== Apply Search / Filter / Sort =====
function applyFilters() {
    let filtered = [...products];

    // Search
    const search = searchInput.value.toLowerCase();

    filtered = filtered.filter(p =>
    p.productName.toLowerCase().includes(search) ||
    p.category.toLowerCase().includes(search) ||
    p.supplier.toLowerCase().includes(search)
);

    // Filter
    const status = filterStatus.value;

    if (status !== 'all') {
        filtered = filtered.filter(p => p.stockStatus === status);
    }

    // Sort
    switch (sortProducts.value) {
        case 'nameAsc':
            filtered.sort((a, b) => a.productName.localeCompare(b.productName));
            break;

        case 'nameDesc':
           filtered.sort((a, b) => b.productName.localeCompare(a.productName));
            break;

        case 'qtyAsc':
            filtered.sort((a, b) => a.quantity - b.quantity);
            break;

        case 'qtyDesc':
            filtered.sort((a, b) => b.quantity - a.quantity);
            break;

        case 'priceAsc':
            filtered.sort((a, b) => a.price - b.price);
            break;

        case 'priceDesc':
            filtered.sort((a, b) => b.price - a.price);
            break;
    }

    displayProducts(filtered);
}

// Event Listeners
searchInput.addEventListener('input', applyFilters);
filterStatus.addEventListener('change', applyFilters);
sortProducts.addEventListener('change', applyFilters);
// ===== Initial Load =====
loadProducts();
showSection(dashboardSection);