// Reports Section - Financial Reports

let currentReport = 'sales';
let reportFilters = {
    startDate: '',
    endDate: '',
    status: 'all'
};

function renderReports() {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    reportFilters.startDate = firstDayOfMonth;
    reportFilters.endDate = today;

    return `
        <div class="content-header">
            <h2><i class="fas fa-chart-bar me-2"></i>Financial Reports</h2>
        </div>

        <!-- Report Tabs -->
        <ul class="nav nav-tabs mb-4" id="reportTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="sales-tab" data-bs-toggle="tab" data-bs-target="#sales"
                    type="button" role="tab" onclick="switchReport('sales')">
                    <i class="fas fa-shopping-cart me-1"></i>Sales Report
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="daybook-tab" data-bs-toggle="tab" data-bs-target="#daybook"
                    type="button" role="tab" onclick="switchReport('daybook')">
                    <i class="fas fa-book me-1"></i>Day Book
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="transactions-tab" data-bs-toggle="tab" data-bs-target="#transactions"
                    type="button" role="tab" onclick="switchReport('transactions')">
                    <i class="fas fa-exchange-alt me-1"></i>Transactions Report
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="profitloss-tab" data-bs-toggle="tab" data-bs-target="#profitloss"
                    type="button" role="tab" onclick="switchReport('profitloss')">
                    <i class="fas fa-chart-line me-1"></i>Profit & Loss
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="bank-tab" data-bs-toggle="tab" data-bs-target="#bank"
                    type="button" role="tab" onclick="switchReport('bank')">
                    <i class="fas fa-university me-1"></i>Bank Statement
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="cash-tab" data-bs-toggle="tab" data-bs-target="#cash"
                    type="button" role="tab" onclick="switchReport('cash')">
                    <i class="fas fa-money-bill-wave me-1"></i>Cash in Hand
                </button>
            </li>
        </ul>

        <!-- Date Filter (Common for all reports) -->
        <div class="card mb-4">
            <div class="card-body">
                <div class="row align-items-end">
                    <div class="col-md-3">
                        <label class="form-label">Start Date</label>
                        <input type="date" class="form-control" id="reportStartDate" value="${firstDayOfMonth}">
                    </div>
                    <div class="col-md-3">
                        <label class="form-label">End Date</label>
                        <input type="date" class="form-control" id="reportEndDate" value="${today}">
                    </div>
                    <div class="col-md-3">
                        <button class="btn btn-primary" onclick="applyReportFilters()">
                            <i class="fas fa-filter me-1"></i>Apply Filter
                        </button>
                        <button class="btn btn-secondary" onclick="resetReportFilters()">
                            <i class="fas fa-redo me-1"></i>Reset
                        </button>
                    </div>
                    <div class="col-md-3 text-end">
                        <button class="btn btn-success" onclick="exportReport()">
                            <i class="fas fa-file-excel me-1"></i>Export
                        </button>
                        <button class="btn btn-info" onclick="printReport()">
                            <i class="fas fa-print me-1"></i>Print
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Tab Content -->
        <div class="tab-content" id="reportTabsContent">
            <!-- Sales Report -->
            <div class="tab-pane fade show active" id="sales" role="tabpanel">
                <div id="salesReportContent">
                    ${renderSalesReport()}
                </div>
            </div>

            <!-- Day Book -->
            <div class="tab-pane fade" id="daybook" role="tabpanel">
                <div id="daybookReportContent">
                    ${renderDayBookReport()}
                </div>
            </div>

            <!-- Transactions Report -->
            <div class="tab-pane fade" id="transactions" role="tabpanel">
                <div id="transactionsReportContent">
                    ${renderTransactionsReport()}
                </div>
            </div>

            <!-- Profit & Loss -->
            <div class="tab-pane fade" id="profitloss" role="tabpanel">
                <div id="profitlossReportContent">
                    ${renderProfitLossReport()}
                </div>
            </div>

            <!-- Bank Statement -->
            <div class="tab-pane fade" id="bank" role="tabpanel">
                <div id="bankReportContent">
                    ${renderBankStatementReport()}
                </div>
            </div>

            <!-- Cash in Hand -->
            <div class="tab-pane fade" id="cash" role="tabpanel">
                <div id="cashReportContent">
                    ${renderCashInHandReport()}
                </div>
            </div>
        </div>
    `;
}

// Sales Report
function renderSalesReport() {
    return `
        <div class="table-container">
            <h4 class="mb-3"><i class="fas fa-shopping-cart me-2"></i>Sales Report</h4>

            <!-- Summary Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stats-card bg-success">
                        <h6>Total Sales</h6>
                        <h3 id="salesTotalAmount">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card bg-info">
                        <h6>Total Transactions</h6>
                        <h3 id="salesTotalCount">0</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card bg-warning">
                        <h6>Pending Amount</h6>
                        <h3 id="salesPendingAmount">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card bg-primary">
                        <h6>Received Amount</h6>
                        <h3 id="salesReceivedAmount">$0.00</h3>
                    </div>
                </div>
            </div>

            <!-- Sales Table -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Invoice No</th>
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Amount</th>
                            <th>Received</th>
                            <th>Balance</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="salesReportTable">
                        <tr>
                            <td colspan="8" class="text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Day Book Report
function renderDayBookReport() {
    return `
        <div class="table-container">
            <h4 class="mb-3"><i class="fas fa-book me-2"></i>Day Book - All Transactions</h4>

            <!-- Summary Cards -->
            <div class="row mb-4">
                <div class="col-md-3">
                    <div class="stats-card bg-success">
                        <h6>Total Receipts</h6>
                        <h3 id="daybookTotalReceipts">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card bg-danger">
                        <h6>Total Payments</h6>
                        <h3 id="daybookTotalPayments">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card bg-info">
                        <h6>Net Cash Flow</h6>
                        <h3 id="daybookNetCashFlow">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="stats-card bg-primary">
                        <h6>Total Entries</h6>
                        <h3 id="daybookTotalEntries">0</h3>
                    </div>
                </div>
            </div>

            <!-- Day Book Table -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Particulars</th>
                            <th>Type</th>
                            <th>Reference No</th>
                            <th>Receipts</th>
                            <th>Payments</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody id="daybookReportTable">
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
    `;
}

// Transactions Report
function renderTransactionsReport() {
    return `
        <div class="table-container">
            <h4 class="mb-3"><i class="fas fa-exchange-alt me-2"></i>Transactions Report</h4>

            <!-- Type Filter -->
            <div class="mb-3">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary active" onclick="filterTransactionType('all')">All</button>
                    <button type="button" class="btn btn-outline-success" onclick="filterTransactionType('sales')">Sales</button>
                    <button type="button" class="btn btn-outline-danger" onclick="filterTransactionType('purchase')">Purchase</button>
                    <button type="button" class="btn btn-outline-warning" onclick="filterTransactionType('expense')">Expense</button>
                    <button type="button" class="btn btn-outline-info" onclick="filterTransactionType('payment')">Payment</button>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="row mb-4">
                <div class="col-md-4">
                    <div class="stats-card bg-success">
                        <h6>Total Inflow</h6>
                        <h3 id="transactionsTotalInflow">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stats-card bg-danger">
                        <h6>Total Outflow</h6>
                        <h3 id="transactionsTotalOutflow">$0.00</h3>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="stats-card bg-primary">
                        <h6>Net Amount</h6>
                        <h3 id="transactionsNetAmount">$0.00</h3>
                    </div>
                </div>
            </div>

            <!-- Transactions Table -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Transaction ID</th>
                            <th>Type</th>
                            <th>Party Name</th>
                            <th>Description</th>
                            <th>Payment Method</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="transactionsReportTable">
                        <tr>
                            <td colspan="8" class="text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Profit & Loss Report
function renderProfitLossReport() {
    return `
        <div class="table-container">
            <h4 class="mb-3"><i class="fas fa-chart-line me-2"></i>Profit & Loss Statement</h4>

            <!-- P&L Summary -->
            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-success text-white">
                            <h5 class="mb-0">Income</h5>
                        </div>
                        <div class="card-body">
                            <table class="table table-sm mb-0">
                                <tr>
                                    <td>Sales Revenue</td>
                                    <td class="text-end" id="plSalesRevenue">$0.00</td>
                                </tr>
                                <tr>
                                    <td>Other Income</td>
                                    <td class="text-end" id="plOtherIncome">$0.00</td>
                                </tr>
                                <tr class="fw-bold">
                                    <td>Total Income</td>
                                    <td class="text-end" id="plTotalIncome">$0.00</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header bg-danger text-white">
                            <h5 class="mb-0">Expenses</h5>
                        </div>
                        <div class="card-body">
                            <table class="table table-sm mb-0">
                                <tr>
                                    <td>Cost of Goods Sold</td>
                                    <td class="text-end" id="plCOGS">$0.00</td>
                                </tr>
                                <tr>
                                    <td>Operating Expenses</td>
                                    <td class="text-end" id="plOperatingExpenses">$0.00</td>
                                </tr>
                                <tr class="fw-bold">
                                    <td>Total Expenses</td>
                                    <td class="text-end" id="plTotalExpenses">$0.00</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Net Profit/Loss -->
            <div class="card">
                <div class="card-body text-center" id="plNetProfitCard">
                    <h3 class="mb-2">Net Profit/Loss</h3>
                    <h1 class="display-4" id="plNetProfit">$0.00</h1>
                    <p class="text-muted mb-0">For the selected period</p>
                </div>
            </div>

            <!-- Detailed Breakdown -->
            <div class="mt-4">
                <h5>Detailed Breakdown</h5>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Description</th>
                                <th class="text-end">Amount</th>
                            </tr>
                        </thead>
                        <tbody id="plDetailedTable">
                            <tr>
                                <td colspan="3" class="text-center">
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
    `;
}

// Bank Statement Report
function renderBankStatementReport() {
    return `
        <div class="table-container">
            <h4 class="mb-3"><i class="fas fa-university me-2"></i>Bank Statement</h4>

            <!-- Bank Info -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="stats-card bg-primary">
                                <h6>Opening Balance</h6>
                                <h3 id="bankOpeningBalance">$0.00</h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stats-card bg-success">
                                <h6>Total Deposits</h6>
                                <h3 id="bankTotalDeposits">$0.00</h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stats-card bg-danger">
                                <h6>Total Withdrawals</h6>
                                <h3 id="bankTotalWithdrawals">$0.00</h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stats-card bg-info">
                                <h6>Closing Balance</h6>
                                <h3 id="bankClosingBalance">$0.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bank Transactions -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Reference No</th>
                            <th>Cheque No</th>
                            <th class="text-end">Deposits</th>
                            <th class="text-end">Withdrawals</th>
                            <th class="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody id="bankStatementTable">
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
    `;
}

// Cash in Hand Report
function renderCashInHandReport() {
    return `
        <div class="table-container">
            <h4 class="mb-3"><i class="fas fa-money-bill-wave me-2"></i>Cash in Hand Statement</h4>

            <!-- Cash Summary -->
            <div class="card mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-3">
                            <div class="stats-card bg-primary">
                                <h6>Opening Balance</h6>
                                <h3 id="cashOpeningBalance">$0.00</h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stats-card bg-success">
                                <h6>Cash Received</h6>
                                <h3 id="cashTotalReceived">$0.00</h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stats-card bg-danger">
                                <h6>Cash Paid</h6>
                                <h3 id="cashTotalPaid">$0.00</h3>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div class="stats-card bg-info">
                                <h6>Cash in Hand</h6>
                                <h3 id="cashInHand">$0.00</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Cash Transactions -->
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Particulars</th>
                            <th>Voucher No</th>
                            <th>Type</th>
                            <th class="text-end">Cash In</th>
                            <th class="text-end">Cash Out</th>
                            <th class="text-end">Balance</th>
                        </tr>
                    </thead>
                    <tbody id="cashStatementTable">
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
    `;
}

// Switch Report
window.switchReport = function(reportType) {
    currentReport = reportType;
    loadReportData(reportType);
}

// Apply Filters
window.applyReportFilters = function() {
    reportFilters.startDate = document.getElementById('reportStartDate').value;
    reportFilters.endDate = document.getElementById('reportEndDate').value;
    loadReportData(currentReport);
}

// Reset Filters
window.resetReportFilters = function() {
    const today = new Date().toISOString().split('T')[0];
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    reportFilters.startDate = firstDayOfMonth;
    reportFilters.endDate = today;

    document.getElementById('reportStartDate').value = firstDayOfMonth;
    document.getElementById('reportEndDate').value = today;

    loadReportData(currentReport);
}

// Filter Transaction Type
window.filterTransactionType = function(type) {
    // Update button states
    document.querySelectorAll('#transactions .btn-group button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    // Reload data
    reportFilters.status = type;
    loadReportData('transactions');
}

// Export Report
window.exportReport = function() {
    alert('Export functionality will be implemented with backend integration');
}

// Print Report
window.printReport = function() {
    window.print();
}

// Load Report Data
async function loadReportData(reportType) {
    try {
        switch(reportType) {
            case 'sales':
                await loadSalesReportData();
                break;
            case 'daybook':
                await loadDayBookReportData();
                break;
            case 'transactions':
                await loadTransactionsReportData();
                break;
            case 'profitloss':
                await loadProfitLossReportData();
                break;
            case 'bank':
                await loadBankStatementData();
                break;
            case 'cash':
                await loadCashInHandData();
                break;
        }
    } catch (error) {
        console.error('Error loading report data:', error);
    }
}

// Load Sales Report Data
async function loadSalesReportData() {
    try {
        const data = await apiService.getSalesReport(reportFilters.startDate, reportFilters.endDate);

        // Update summary cards
        document.getElementById('salesTotalAmount').textContent = formatCurrency(data.totalAmount || 0);
        document.getElementById('salesTotalCount').textContent = data.totalCount || 0;
        document.getElementById('salesPendingAmount').textContent = formatCurrency(data.pendingAmount || 0);
        document.getElementById('salesReceivedAmount').textContent = formatCurrency(data.receivedAmount || 0);

        // Update table
        const tbody = document.getElementById('salesReportTable');
        if (!data.sales || data.sales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No sales data available</td></tr>';
            return;
        }

        tbody.innerHTML = data.sales.map(sale => `
            <tr>
                <td>${formatDate(sale.date)}</td>
                <td>${sale.invoiceNo || 'N/A'}</td>
                <td>${sale.customerName || 'N/A'}</td>
                <td>${sale.itemCount || 0}</td>
                <td>${formatCurrency(sale.totalAmount)}</td>
                <td>${formatCurrency(sale.receivedAmount)}</td>
                <td>${formatCurrency(sale.balance)}</td>
                <td><span class="badge bg-${sale.status === 'paid' ? 'success' : 'warning'}">${sale.status}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading sales report:', error);
        document.getElementById('salesReportTable').innerHTML =
            '<tr><td colspan="8" class="text-center text-danger">Error loading data</td></tr>';
    }
}

// Load Day Book Report Data
async function loadDayBookReportData() {
    try {
        const data = await apiService.getDayBookReport(reportFilters.startDate, reportFilters.endDate);

        // Update summary
        document.getElementById('daybookTotalReceipts').textContent = formatCurrency(data.totalReceipts || 0);
        document.getElementById('daybookTotalPayments').textContent = formatCurrency(data.totalPayments || 0);
        document.getElementById('daybookNetCashFlow').textContent = formatCurrency(data.netCashFlow || 0);
        document.getElementById('daybookTotalEntries').textContent = data.totalEntries || 0;

        // Update table
        const tbody = document.getElementById('daybookReportTable');
        if (!data.entries || data.entries.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No entries available</td></tr>';
            return;
        }

        let runningBalance = data.openingBalance || 0;
        tbody.innerHTML = data.entries.map(entry => {
            runningBalance += (entry.receipts || 0) - (entry.payments || 0);
            return `
                <tr>
                    <td>${formatDate(entry.date)}</td>
                    <td>${entry.particulars || 'N/A'}</td>
                    <td><span class="badge bg-info">${entry.type}</span></td>
                    <td>${entry.referenceNo || '-'}</td>
                    <td class="text-success">${entry.receipts ? formatCurrency(entry.receipts) : '-'}</td>
                    <td class="text-danger">${entry.payments ? formatCurrency(entry.payments) : '-'}</td>
                    <td class="fw-bold">${formatCurrency(runningBalance)}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading day book report:', error);
        document.getElementById('daybookReportTable').innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>';
    }
}

// Load Transactions Report Data
async function loadTransactionsReportData() {
    try {
        const data = await apiService.getTransactionsReport(reportFilters.startDate, reportFilters.endDate, reportFilters.status);

        // Update summary
        document.getElementById('transactionsTotalInflow').textContent = formatCurrency(data.totalInflow || 0);
        document.getElementById('transactionsTotalOutflow').textContent = formatCurrency(data.totalOutflow || 0);
        document.getElementById('transactionsNetAmount').textContent = formatCurrency(data.netAmount || 0);

        // Update table
        const tbody = document.getElementById('transactionsReportTable');
        if (!data.transactions || data.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No transactions available</td></tr>';
            return;
        }

        tbody.innerHTML = data.transactions.map(txn => `
            <tr>
                <td>${formatDate(txn.date)}</td>
                <td>${txn.transactionId || 'N/A'}</td>
                <td><span class="badge bg-${getTypeColor(txn.type)}">${txn.type}</span></td>
                <td>${txn.partyName || 'N/A'}</td>
                <td>${txn.description || '-'}</td>
                <td>${txn.paymentMethod || '-'}</td>
                <td>${formatCurrency(txn.amount)}</td>
                <td><span class="badge bg-${txn.status === 'completed' ? 'success' : 'warning'}">${txn.status}</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading transactions report:', error);
        document.getElementById('transactionsReportTable').innerHTML =
            '<tr><td colspan="8" class="text-center text-danger">Error loading data</td></tr>';
    }
}

// Load Profit & Loss Report Data
async function loadProfitLossReportData() {
    try {
        const data = await apiService.getProfitLossReport(reportFilters.startDate, reportFilters.endDate);

        // Update income
        document.getElementById('plSalesRevenue').textContent = formatCurrency(data.salesRevenue || 0);
        document.getElementById('plOtherIncome').textContent = formatCurrency(data.otherIncome || 0);
        document.getElementById('plTotalIncome').textContent = formatCurrency(data.totalIncome || 0);

        // Update expenses
        document.getElementById('plCOGS').textContent = formatCurrency(data.cogs || 0);
        document.getElementById('plOperatingExpenses').textContent = formatCurrency(data.operatingExpenses || 0);
        document.getElementById('plTotalExpenses').textContent = formatCurrency(data.totalExpenses || 0);

        // Update net profit/loss
        const netProfit = (data.totalIncome || 0) - (data.totalExpenses || 0);
        document.getElementById('plNetProfit').textContent = formatCurrency(netProfit);

        const card = document.getElementById('plNetProfitCard');
        card.className = `card-body text-center ${netProfit >= 0 ? 'bg-success-subtle' : 'bg-danger-subtle'}`;

        // Update detailed table
        const tbody = document.getElementById('plDetailedTable');
        if (!data.details || data.details.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-muted">No detailed data available</td></tr>';
            return;
        }

        tbody.innerHTML = data.details.map(item => `
            <tr>
                <td>${item.category}</td>
                <td>${item.description}</td>
                <td class="text-end">${formatCurrency(item.amount)}</td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading profit & loss report:', error);
        document.getElementById('plDetailedTable').innerHTML =
            '<tr><td colspan="3" class="text-center text-danger">Error loading data</td></tr>';
    }
}

// Load Bank Statement Data
async function loadBankStatementData() {
    try {
        const data = await apiService.getBankStatement(reportFilters.startDate, reportFilters.endDate);

        // Update summary
        document.getElementById('bankOpeningBalance').textContent = formatCurrency(data.openingBalance || 0);
        document.getElementById('bankTotalDeposits').textContent = formatCurrency(data.totalDeposits || 0);
        document.getElementById('bankTotalWithdrawals').textContent = formatCurrency(data.totalWithdrawals || 0);
        document.getElementById('bankClosingBalance').textContent = formatCurrency(data.closingBalance || 0);

        // Update table
        const tbody = document.getElementById('bankStatementTable');
        if (!data.transactions || data.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No bank transactions available</td></tr>';
            return;
        }

        let runningBalance = data.openingBalance || 0;
        tbody.innerHTML = data.transactions.map(txn => {
            runningBalance += (txn.deposits || 0) - (txn.withdrawals || 0);
            return `
                <tr>
                    <td>${formatDate(txn.date)}</td>
                    <td>${txn.description || 'N/A'}</td>
                    <td>${txn.referenceNo || '-'}</td>
                    <td>${txn.chequeNo || '-'}</td>
                    <td class="text-end text-success">${txn.deposits ? formatCurrency(txn.deposits) : '-'}</td>
                    <td class="text-end text-danger">${txn.withdrawals ? formatCurrency(txn.withdrawals) : '-'}</td>
                    <td class="text-end fw-bold">${formatCurrency(runningBalance)}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading bank statement:', error);
        document.getElementById('bankStatementTable').innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>';
    }
}

// Load Cash in Hand Data
async function loadCashInHandData() {
    try {
        const data = await apiService.getCashInHandStatement(reportFilters.startDate, reportFilters.endDate);

        // Update summary
        document.getElementById('cashOpeningBalance').textContent = formatCurrency(data.openingBalance || 0);
        document.getElementById('cashTotalReceived').textContent = formatCurrency(data.totalReceived || 0);
        document.getElementById('cashTotalPaid').textContent = formatCurrency(data.totalPaid || 0);
        document.getElementById('cashInHand').textContent = formatCurrency(data.cashInHand || 0);

        // Update table
        const tbody = document.getElementById('cashStatementTable');
        if (!data.transactions || data.transactions.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No cash transactions available</td></tr>';
            return;
        }

        let runningBalance = data.openingBalance || 0;
        tbody.innerHTML = data.transactions.map(txn => {
            runningBalance += (txn.cashIn || 0) - (txn.cashOut || 0);
            return `
                <tr>
                    <td>${formatDate(txn.date)}</td>
                    <td>${txn.particulars || 'N/A'}</td>
                    <td>${txn.voucherNo || '-'}</td>
                    <td><span class="badge bg-info">${txn.type}</span></td>
                    <td class="text-end text-success">${txn.cashIn ? formatCurrency(txn.cashIn) : '-'}</td>
                    <td class="text-end text-danger">${txn.cashOut ? formatCurrency(txn.cashOut) : '-'}</td>
                    <td class="text-end fw-bold">${formatCurrency(runningBalance)}</td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading cash in hand statement:', error);
        document.getElementById('cashStatementTable').innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Error loading data</td></tr>';
    }
}

// Helper Functions
function formatCurrency(value) {
    const num = parseFloat(value) || 0;
    return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
}

function getTypeColor(type) {
    const colors = {
        'sales': 'success',
        'purchase': 'danger',
        'expense': 'warning',
        'payment': 'info',
        'receipt': 'primary'
    };
    return colors[type?.toLowerCase()] || 'secondary';
}

// Initialize Reports Section
function initReportsSection() {
    loadReportData('sales');
}
