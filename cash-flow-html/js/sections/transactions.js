// Transactions Section

let transactionsContacts = [];
let transactionsInventory = [];

function renderTransactions() {
    return `
        <div class="content-header">
            <h2><i class="fas fa-exchange-alt me-2"></i>Transactions</h2>
        </div>

        <!-- Error/Success Alerts -->
        <div id="transactionError" class="alert alert-danger" style="display: none;" role="alert"></div>
        <div id="transactionSuccess" class="alert alert-success" style="display: none;" role="alert"></div>

        <!-- Tabs -->
        <ul class="nav nav-tabs" id="transactionTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="payment-tab" data-bs-toggle="tab" data-bs-target="#payment" type="button">
                    <i class="fas fa-money-bill-wave me-2"></i>Payment In
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="sale-tab" data-bs-toggle="tab" data-bs-target="#sale" type="button">
                    <i class="fas fa-shopping-cart me-2"></i>New Sale
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="purchase-tab" data-bs-toggle="tab" data-bs-target="#purchase" type="button">
                    <i class="fas fa-shopping-bag me-2"></i>Purchase
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content mt-3" id="transactionTabContent">
            <!-- Payment In Form -->
            <div class="tab-pane fade show active" id="payment" role="tabpanel">
                <div class="form-container">
                    <h4>Record Payment Received</h4>
                    <form id="paymentForm">
                        <div class="mb-3">
                            <label class="form-label">Choose Contact</label>
                            <select class="form-select" id="paymentContact" required>
                                <option value="">Select customer...</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Receipt Number</label>
                            <input type="text" class="form-control" id="paymentReceipt" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input type="date" class="form-control" id="paymentDate" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Amount Received</label>
                            <input type="number" class="form-control" id="paymentAmount" step="0.01" required>
                        </div>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-check me-2"></i>Record Payment
                        </button>
                    </form>
                </div>
            </div>

            <!-- New Sale Form -->
            <div class="tab-pane fade" id="sale" role="tabpanel">
                <div class="form-container">
                    <h4>Record New Sale</h4>
                    <form id="saleForm">
                        <div class="mb-3">
                            <label class="form-label">Choose Contact</label>
                            <select class="form-select" id="saleContact" required>
                                <option value="">Select customer...</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Receipt Number</label>
                            <input type="text" class="form-control" id="saleReceipt" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input type="date" class="form-control" id="saleDate" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Select Items</label>
                            <select class="form-select mb-2" id="saleItem">
                                <option value="">Select item...</option>
                            </select>
                            <div id="selectedItems"></div>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Total Amount</label>
                            <input type="number" class="form-control" id="saleAmount" step="0.01" required>
                        </div>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-check me-2"></i>Submit Sale
                        </button>
                    </form>
                </div>
            </div>

            <!-- Purchase Form -->
            <div class="tab-pane fade" id="purchase" role="tabpanel">
                <div class="form-container">
                    <h4>Record Purchase</h4>
                    <form id="purchaseForm">
                        <div class="mb-3">
                            <label class="form-label">Choose Supplier</label>
                            <select class="form-select" id="purchaseSupplier" required>
                                <option value="">Select supplier...</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Invoice Number</label>
                            <input type="text" class="form-control" id="purchaseInvoice" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Date</label>
                            <input type="date" class="form-control" id="purchaseDate" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Items Purchased</label>
                            <textarea class="form-control" id="purchaseItems" rows="3" placeholder="Enter items purchased..." required></textarea>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Total Amount</label>
                            <input type="number" class="form-control" id="purchaseAmount" step="0.01" required>
                        </div>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-check me-2"></i>Submit Purchase
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
}

// Initialize transactions section
async function initTransactionsSection() {
    // Set default dates to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('paymentDate').value = today;
    document.getElementById('saleDate').value = today;
    document.getElementById('purchaseDate').value = today;

    // Load contacts and inventory
    await loadTransactionsData();

    // Setup form handlers
    setupTransactionForms();
}

// Load contacts and inventory
async function loadTransactionsData() {
    try {
        // Load contacts
        transactionsContacts = await apiService.getContacts();
        populateContactSelects();

        // Load inventory
        transactionsInventory = await apiService.getInventory();
        populateInventorySelect();
    } catch (error) {
        console.error('Error loading transactions data:', error);
        showError('transactionError', 'Failed to load contacts and inventory');
    }
}

// Populate contact select dropdowns
function populateContactSelects() {
    const customers = transactionsContacts.filter(c => c.type === 'customer');
    const suppliers = transactionsContacts.filter(c => c.type === 'supplier');

    // Payment and Sale contacts (customers)
    const paymentSelect = document.getElementById('paymentContact');
    const saleSelect = document.getElementById('saleContact');

    const customerOptions = customers.map(c =>
        `<option value="${c.id}">${c.name}</option>`
    ).join('');

    paymentSelect.innerHTML = '<option value="">Select customer...</option>' + customerOptions;
    saleSelect.innerHTML = '<option value="">Select customer...</option>' + customerOptions;

    // Purchase contacts (suppliers)
    const purchaseSelect = document.getElementById('purchaseSupplier');
    const supplierOptions = suppliers.map(s =>
        `<option value="${s.id}">${s.name}</option>`
    ).join('');

    purchaseSelect.innerHTML = '<option value="">Select supplier...</option>' + supplierOptions;
}

// Populate inventory select
function populateInventorySelect() {
    const saleItemSelect = document.getElementById('saleItem');
    const itemOptions = transactionsInventory.map(item =>
        `<option value="${item.id}">${item.name} - $${item.price} (Stock: ${item.stock})</option>`
    ).join('');

    saleItemSelect.innerHTML = '<option value="">Select item...</option>' + itemOptions;
}

// Setup transaction form handlers
function setupTransactionForms() {
    // Payment Form
    document.getElementById('paymentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handlePaymentSubmit();
    });

    // Sale Form
    document.getElementById('saleForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleSaleSubmit();
    });

    // Purchase Form
    document.getElementById('purchaseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handlePurchaseSubmit();
    });
}

// Handle payment submission
async function handlePaymentSubmit() {
    try {
        const transactionData = {
            type: 'payment_in',
            contact_id: document.getElementById('paymentContact').value,
            receipt_number: document.getElementById('paymentReceipt').value,
            amount: parseFloat(document.getElementById('paymentAmount').value),
            date: document.getElementById('paymentDate').value,
            description: 'Payment received',
            status: 'completed'
        };

        await apiService.createTransaction(transactionData);
        showSuccess('transactionSuccess', 'Payment recorded successfully!');
        document.getElementById('paymentForm').reset();
        document.getElementById('paymentDate').value = new Date().toISOString().split('T')[0];
    } catch (error) {
        console.error('Error submitting payment:', error);
        showError('transactionError', error.message || 'Failed to record payment');
    }
}

// Handle sale submission
async function handleSaleSubmit() {
    try {
        const transactionData = {
            type: 'sale',
            contact_id: document.getElementById('saleContact').value,
            receipt_number: document.getElementById('saleReceipt').value,
            amount: parseFloat(document.getElementById('saleAmount').value),
            date: document.getElementById('saleDate').value,
            description: 'Product sale',
            status: 'completed'
        };

        await apiService.createTransaction(transactionData);
        showSuccess('transactionSuccess', 'Sale recorded successfully!');
        document.getElementById('saleForm').reset();
        document.getElementById('saleDate').value = new Date().toISOString().split('T')[0];
    } catch (error) {
        console.error('Error submitting sale:', error);
        showError('transactionError', error.message || 'Failed to record sale');
    }
}

// Handle purchase submission
async function handlePurchaseSubmit() {
    try {
        const transactionData = {
            type: 'purchase',
            contact_id: document.getElementById('purchaseSupplier').value,
            receipt_number: document.getElementById('purchaseInvoice').value,
            amount: parseFloat(document.getElementById('purchaseAmount').value),
            date: document.getElementById('purchaseDate').value,
            description: document.getElementById('purchaseItems').value,
            status: 'completed'
        };

        await apiService.createTransaction(transactionData);
        showSuccess('transactionSuccess', 'Purchase recorded successfully!');
        document.getElementById('purchaseForm').reset();
        document.getElementById('purchaseDate').value = new Date().toISOString().split('T')[0];
    } catch (error) {
        console.error('Error submitting purchase:', error);
        showError('transactionError', error.message || 'Failed to record purchase');
    }
}
