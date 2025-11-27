// Home Section - Dashboard Overview

function renderHome() {
    return `
        <div class="content-header">
            <h2><i class="fas fa-home me-2"></i>Dashboard Overview</h2>
        </div>

        <!-- Statistics Cards -->
        <div class="row" id="statsContainer">
            <div class="col-md-4 col-lg-2 mb-3">
                <div class="stats-card bg-primary">
                    <h6>Total Balance</h6>
                    <h3 id="totalBalance">$0.00</h3>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-3">
                <div class="stats-card bg-success">
                    <h6>To Receive</h6>
                    <h3 id="toReceive">$0.00</h3>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-3">
                <div class="stats-card bg-warning">
                    <h6>To Give</h6>
                    <h3 id="toGive">$0.00</h3>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-3">
                <div class="stats-card bg-info">
                    <h6>Sales</h6>
                    <h3 id="totalSales">$0.00</h3>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-3">
                <div class="stats-card bg-danger">
                    <h6>Purchase</h6>
                    <h3 id="totalPurchases">$0.00</h3>
                </div>
            </div>
            <div class="col-md-4 col-lg-2 mb-3">
                <div class="stats-card bg-secondary">
                    <h6>Expenses</h6>
                    <h3 id="totalExpenses">$0.00</h3>
                </div>
            </div>
        </div>

        <!-- Recent Activity -->
        <div class="table-container mt-4">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h4><i class="fas fa-clock me-2"></i>Recent Activity</h4>
                <button class="btn btn-primary btn-sm" onclick="loadHomeData()">
                    <i class="fas fa-sync-alt me-1"></i>Refresh
                </button>
            </div>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody id="activityTableBody">
                        <tr>
                            <td colspan="5" class="text-center">
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

// Load home data (stats and activity)
async function loadHomeData() {
    try {
        // Load dashboard stats
        const stats = await apiService.getDashboardStats();
        updateDashboardStats(stats);

        // Load recent activity
        const activities = await apiService.getRecentActivity();
        updateActivityTable(activities);
    } catch (error) {
        console.error('Error loading home data:', error);
        showError('mainError', error.message || 'Failed to load dashboard data');
    }
}

// Update dashboard statistics
function updateDashboardStats(stats) {
    document.getElementById('totalBalance').textContent = formatCurrency(stats.totalBalance || 0);
    document.getElementById('toReceive').textContent = formatCurrency(stats.toReceive || 0);
    document.getElementById('toGive').textContent = formatCurrency(stats.toGive || 0);
    document.getElementById('totalSales').textContent = formatCurrency(stats.totalSales || 0);
    document.getElementById('totalPurchases').textContent = formatCurrency(stats.totalPurchases || 0);
    document.getElementById('totalExpenses').textContent = formatCurrency(stats.totalExpenses || 0);
}

// Update activity table
function updateActivityTable(activities) {
    const tbody = document.getElementById('activityTableBody');

    if (!activities || activities.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">No recent activity</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = activities.map(activity => {
        const date = new Date(activity.date || activity.created_at).toLocaleDateString();
        const type = activity.type || 'N/A';
        const description = activity.description || activity.name || 'N/A';
        const amount = activity.amount ? formatCurrency(activity.amount) : '-';
        const status = activity.status || 'completed';

        let statusBadge = '';
        if (status === 'completed') {
            statusBadge = '<span class="badge bg-success">Completed</span>';
        } else if (status === 'pending') {
            statusBadge = '<span class="badge bg-warning">Pending</span>';
        } else {
            statusBadge = '<span class="badge bg-secondary">' + status + '</span>';
        }

        return `
            <tr>
                <td>${date}</td>
                <td><span class="badge bg-info">${type}</span></td>
                <td>${description}</td>
                <td>${amount}</td>
                <td>${statusBadge}</td>
            </tr>
        `;
    }).join('');
}

// Format currency
function formatCurrency(value) {
    const num = parseFloat(value) || 0;
    return '$' + num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

// Initialize home section
function initHomeSection() {
    loadHomeData();
}
