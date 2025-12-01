// API Service Module
class ApiService {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
    }

    // Get authentication headers
    getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Handle API response
    async handleResponse(response) {
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Request failed' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }
        return response.json();
    }

    // Login
    async login(username, password, userType) {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, userType })
        });
        return this.handleResponse(response);
    }

    // Get dashboard statistics
    async getDashboardStats() {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.DASHBOARD_STATS}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get recent activity
    async getRecentActivity() {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.ACTIVITY}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get contacts
    async getContacts(type = null) {
        const url = type
            ? `${this.baseURL}${API_CONFIG.ENDPOINTS.CONTACTS}?type=${type}`
            : `${this.baseURL}${API_CONFIG.ENDPOINTS.CONTACTS}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Create contact
    async createContact(contactData) {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.CONTACTS}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(contactData)
        });
        return this.handleResponse(response);
    }

    // Get inventory
    async getInventory() {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.INVENTORY}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Create inventory item
    async createInventoryItem(itemData) {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.INVENTORY}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(itemData)
        });
        return this.handleResponse(response);
    }

    // Update inventory item
    async updateInventoryItem(id, itemData) {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.INVENTORY}/${id}`, {
            method: 'PUT',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(itemData)
        });
        return this.handleResponse(response);
    }

    // Get transactions
    async getTransactions(type = null, limit = 50) {
        let url = `${this.baseURL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}?limit=${limit}`;
        if (type) url += `&type=${type}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Create transaction
    async createTransaction(transactionData) {
        const response = await fetch(`${this.baseURL}${API_CONFIG.ENDPOINTS.TRANSACTIONS}`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            body: JSON.stringify(transactionData)
        });
        return this.handleResponse(response);
    }

    // Get Sales Report
    async getSalesReport(startDate, endDate) {
        const response = await fetch(`${this.baseURL}/api/reports/sales?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get Day Book Report
    async getDayBookReport(startDate, endDate) {
        const response = await fetch(`${this.baseURL}/api/reports/daybook?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get Transactions Report
    async getTransactionsReport(startDate, endDate, status = 'all') {
        const response = await fetch(`${this.baseURL}/api/reports/transactions?startDate=${startDate}&endDate=${endDate}&status=${status}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get Profit & Loss Report
    async getProfitLossReport(startDate, endDate) {
        const response = await fetch(`${this.baseURL}/api/reports/profitloss?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get Bank Statement
    async getBankStatement(startDate, endDate) {
        const response = await fetch(`${this.baseURL}/api/reports/bank?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }

    // Get Cash in Hand Statement
    async getCashInHandStatement(startDate, endDate) {
        const response = await fetch(`${this.baseURL}/api/reports/cash?startDate=${startDate}&endDate=${endDate}`, {
            method: 'GET',
            headers: this.getAuthHeaders()
        });
        return this.handleResponse(response);
    }
}

// Create singleton instance
const apiService = new ApiService();
