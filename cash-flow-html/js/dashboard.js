// Dashboard Main Controller

let currentSection = 'home';
let currentUser = null;

// Initialize dashboard
function initDashboard() {
    // Protect the page
    protectPage();

    // Get current user
    currentUser = getCurrentUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }

    // Display user info
    displayUserInfo();

    // Setup sidebar navigation
    setupSidebarNavigation();

    // Setup logout button
    document.getElementById('logoutBtn').addEventListener('click', () => {
        logout();
    });

    // Load initial section
    loadSection('home');
}

// Display user information
function displayUserInfo() {
    document.getElementById('userName').textContent = currentUser.name || currentUser.username;
    document.getElementById('userType').textContent = currentUser.type || 'User';
}

// Setup sidebar navigation
function setupSidebarNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            loadSection(section);
        });
    });
}

// Load section
function loadSection(section) {
    // Update active nav link
    document.querySelectorAll('.nav-link[data-section]').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`.nav-link[data-section="${section}"]`).classList.add('active');

    // Get content area
    const contentArea = document.getElementById('contentArea');

    // Render section
    currentSection = section;
    let sectionHTML = '';

    switch (section) {
        case 'home':
            sectionHTML = renderHome();
            break;
        case 'transactions':
            sectionHTML = renderTransactions();
            break;
        case 'contacts':
            sectionHTML = renderContacts();
            break;
        case 'inventory':
            sectionHTML = renderInventory();
            break;
        case 'reports':
            sectionHTML = renderReports();
            break;
        default:
            sectionHTML = '<h2>Section not found</h2>';
    }

    contentArea.innerHTML = sectionHTML;

    // Initialize section
    setTimeout(() => {
        initSection(section);
    }, 100);
}

// Initialize section after rendering
function initSection(section) {
    switch (section) {
        case 'home':
            initHomeSection();
            break;
        case 'transactions':
            initTransactionsSection();
            break;
        case 'contacts':
            initContactsSection();
            break;
        case 'inventory':
            initInventorySection();
            break;
        case 'reports':
            initReportsSection();
            break;
    }
}

// Error/Success message helpers (global)
window.showError = function(elementId, message) {
    const errorDiv = document.getElementById(elementId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';

        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

window.showSuccess = function(elementId, message) {
    const successDiv = document.getElementById(elementId);
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';

        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }
}

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initDashboard();
});
