// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    ENDPOINTS: {
        LOGIN: '/login',
        DASHBOARD_STATS: '/dashboard/stats',
        ACTIVITY: '/activity',
        CONTACTS: '/contacts',
        INVENTORY: '/inventory',
        TRANSACTIONS: '/transactions'
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}
