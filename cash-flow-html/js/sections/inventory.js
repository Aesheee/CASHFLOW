// Inventory Section

let inventoryList = [];
let currentEditItemId = null; // <-- added to track edit mode

function renderInventory() {
    return `
        <div class="content-header">
            <h2><i class="fas fa-boxes me-2"></i>Inventory Management</h2>
        </div>

        <!-- Error/Success Alerts -->
        <div id="inventoryError" class="alert alert-danger" style="display: none;" role="alert"></div>
        <div id="inventorySuccess" class="alert alert-success" style="display: none;" role="alert"></div>

        <!-- Tabs -->
        <ul class="nav nav-tabs" id="inventoryTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="new-item-tab" data-bs-toggle="tab" data-bs-target="#newItem" type="button">
                    <i class="fas fa-plus me-2"></i>Add New Item
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="status-tab" data-bs-toggle="tab" data-bs-target="#inventoryStatus" type="button">
                    <i class="fas fa-chart-bar me-2"></i>Inventory Status
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content mt-3" id="inventoryTabContent">
            <!-- Add New Item Form -->
            <div class="tab-pane fade show active" id="newItem" role="tabpanel">
                <div class="form-container">
                    <h4 id="inventoryFormTitle">Add New Inventory Item</h4>
                    <form id="inventoryForm">
                        <div class="mb-3">
                            <label class="form-label">Item Name</label>
                            <input type="text" class="form-control" id="itemName" placeholder="Enter item name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Category</label>
                            <input type="text" class="form-control" id="itemCategory" placeholder="e.g., Electronics, Office Supplies" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Current Stock</label>
                            <input type="number" class="form-control" id="itemStock" min="0" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Price</label>
                            <input type="number" class="form-control" id="itemPrice" step="0.01" min="0" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Low Stock Alert</label>
                            <input type="number" class="form-control" id="itemLowStock" min="0" placeholder="Alert when stock falls below this number" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Description</label>
                            <textarea class="form-control" id="itemDescription" rows="2" placeholder="Optional description"></textarea>
                        </div>
                        <button type="submit" id="inventorySubmitBtn" class="btn btn-success">
                            <i class="fas fa-plus me-2"></i>Add Item
                        </button>
                        <button type="button" id="inventoryCancelEditBtn" class="btn btn-secondary ms-2" style="display:none;">
                            Cancel
                        </button>
                    </form>
                </div>
            </div>

            <!-- Inventory Status -->
            <div class="tab-pane fade" id="inventoryStatus" role="tabpanel">
                <!-- Summary Cards -->
                <div class="row mb-4">
                    <div class="col-md-3 mb-3">
                        <div class="stats-card bg-primary">
                            <h6>Total Items</h6>
                            <h3 id="totalItems">0</h3>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="stats-card bg-success">
                            <h6>In Stock</h6>
                            <h3 id="inStockItems">0</h3>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="stats-card bg-warning">
                            <h6>Low Stock</h6>
                            <h3 id="lowStockItems">0</h3>
                        </div>
                    </div>
                    <div class="col-md-3 mb-3">
                        <div class="stats-card bg-danger">
                            <h6>Out of Stock</h6>
                            <h3 id="outOfStockItems">0</h3>
                        </div>
                    </div>
                </div>

                <!-- Inventory Table -->
                <div class="table-container">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4>All Inventory Items</h4>
                        <button class="btn btn-primary btn-sm" onclick="loadInventoryList()">
                            <i class="fas fa-sync-alt me-1"></i>Refresh
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Item Name</th>
                                    <th>Category</th>
                                    <th>Stock</th>
                                    <th>Price</th>
                                    <th>Status</th>
                                    <th>Value</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="inventoryTableBody">
                                <tr>
                                    <td colspan="7" class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `;
}
// ...existing code...

// Initialize inventory section
async function initInventorySection() {
    // Setup form handler
    document.getElementById('inventoryForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleInventorySubmit();
    });

    // Cancel edit button
    document.getElementById('inventoryCancelEditBtn').addEventListener('click', () => {
        exitEditMode();
    });
}

// Handle inventory form submission
async function handleInventorySubmit() {
    try {
        const itemData = {
            name: document.getElementById('itemName').value.trim(),
            category: document.getElementById('itemCategory').value.trim(),
            stock: parseInt(document.getElementById('itemStock').value, 10),
            price: parseFloat(document.getElementById('itemPrice').value),
            low_stock_alert: parseInt(document.getElementById('itemLowStock').value, 10),
            description: document.getElementById('itemDescription').value || null
        };

        if (!currentEditItemId) {
            // Create new item
            await apiService.createInventoryItem(itemData);
            showSuccess('inventorySuccess', 'Item added successfully!');
        } else {
            // Update existing item
            const id = currentEditItemId;
            if (apiService.updateInventoryItem) {
                // prefer apiService if available
                await apiService.updateInventoryItem(id, itemData);
            } else {
                // fallback to direct fetch (PUT)
                const res = await fetch(`/api/inventory/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(itemData)
                });
                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    throw new Error(errBody.error || errBody.message || `Update failed: ${res.status}`);
                }
            }

            showSuccess('inventorySuccess', 'Item updated successfully!');
        }

        // Reset form and state
        document.getElementById('inventoryForm').reset();
        exitEditMode();

        // Refresh inventory list if viewing it
        if (document.getElementById('inventoryStatus').classList.contains('show')) {
            await loadInventoryList();
        }
    } catch (error) {
        console.error('Error adding/updating item:', error);
        showError('inventoryError', error.message || 'Failed to add/update item');
    }
}

// helper to exit edit mode and restore UI
function exitEditMode() {
    currentEditItemId = null;
    document.getElementById('inventoryFormTitle').textContent = 'Add New Inventory Item';
    const submitBtn = document.getElementById('inventorySubmitBtn');
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-success');
    submitBtn.innerHTML = '<i class="fas fa-plus me-2"></i>Add Item';
    document.getElementById('inventoryCancelEditBtn').style.display = 'none';
}

// Load inventory list
async function loadInventoryList() {
    try {
        inventoryList = await apiService.getInventory();
        updateInventoryStats();
        updateInventoryTable();
    } catch (error) {
        console.error('Error loading inventory:', error);
        showError('inventoryError', 'Failed to load inventory');
    }
}

// Update inventory stats
function updateInventoryStats() {
    const totalItems = inventoryList.length;
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventoryList.forEach(item => {
        if (item.stock === 0) {
            outOfStock++;
        } else if (item.stock <= item.low_stock_alert) {
            lowStock++;
        } else {
            inStock++;
        }
    });

    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('inStockItems').textContent = inStock;
    document.getElementById('lowStockItems').textContent = lowStock;
    document.getElementById('outOfStockItems').textContent = outOfStock;
}

// Update inventory table
function updateInventoryTable() {
    const tbody = document.getElementById('inventoryTableBody');

    if (!inventoryList || inventoryList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-muted">No inventory items found</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = inventoryList.map(item => {
        const value = (item.stock * item.price).toFixed(2);
        let statusBadge = '';

        if (item.stock === 0) {
            statusBadge = '<span class="badge bg-danger">Out of Stock</span>';
        } else if (item.stock <= item.low_stock_alert) {
            statusBadge = '<span class="badge bg-warning">Low Stock</span>';
        } else {
            statusBadge = '<span class="badge bg-success">In Stock</span>';
        }

        return `
            <tr>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td>${item.stock}</td>
                <td>${formatCurrency(item.price)}</td>
                <td>${statusBadge}</td>
                <td>${formatCurrency(value)}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editInventoryItem(${item.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Edit inventory item (implemented)
function editInventoryItem(itemId) {
    const item = inventoryList.find(i => i.id === itemId);
    if (!item) {
        showError('inventoryError', 'Item not found');
        return;
    }

    // populate form
    document.getElementById('itemName').value = item.name;
    document.getElementById('itemCategory').value = item.category;
    document.getElementById('itemStock').value = item.stock;
    document.getElementById('itemPrice').value = item.price;
    document.getElementById('itemLowStock').value = item.low_stock_alert;
    document.getElementById('itemDescription').value = item.description || '';

    // set edit state
    currentEditItemId = itemId;
    document.getElementById('inventoryFormTitle').textContent = 'Edit Inventory Item';
    const submitBtn = document.getElementById('inventorySubmitBtn');
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-warning');
    submitBtn.innerHTML = '<i class="fas fa-save me-2"></i>Save Changes';
    document.getElementById('inventoryCancelEditBtn').style.display = 'inline-block';

    // switch to Add New Item tab so user can edit
    const newItemTab = document.getElementById('new-item-tab');
    if (newItemTab) newItemTab.click();

    // focus first field
    document.getElementById('itemName').focus();
}

// Load inventory when tab is shown
document.addEventListener('shown.bs.tab', function (e) {
    if (e.target.id === 'status-tab') {
        loadInventoryList();
    }
});
