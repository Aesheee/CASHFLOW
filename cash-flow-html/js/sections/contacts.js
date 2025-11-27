// Contacts Section

let contactsList = [];

function renderContacts() {
    return `
        <div class="content-header">
            <h2><i class="fas fa-address-book me-2"></i>Contacts</h2>
        </div>

        <!-- Error/Success Alerts -->
        <div id="contactsError" class="alert alert-danger" style="display: none;" role="alert"></div>
        <div id="contactsSuccess" class="alert alert-success" style="display: none;" role="alert"></div>

        <!-- Tabs -->
        <ul class="nav nav-tabs" id="contactsTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="new-contact-tab" data-bs-toggle="tab" data-bs-target="#newContact" type="button">
                    <i class="fas fa-user-plus me-2"></i>Create New Contact
                </button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="list-contact-tab" data-bs-toggle="tab" data-bs-target="#listContact" type="button">
                    <i class="fas fa-list me-2"></i>Contact List
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content mt-3" id="contactsTabContent">
            <!-- New Contact Form -->
            <div class="tab-pane fade show active" id="newContact" role="tabpanel">
                <div class="form-container">
                    <h4>Add New Contact</h4>
                    <form id="contactForm">
                        <div class="mb-3">
                            <label class="form-label">Contact Name</label>
                            <input type="text" class="form-control" id="contactName" placeholder="Enter name" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Type</label>
                            <select class="form-select" id="contactType" required>
                                <option value="">Select type...</option>
                                <option value="customer">Customer</option>
                                <option value="supplier">Supplier</option>
                            </select>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="contactEmail" placeholder="email@example.com">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Phone</label>
                            <input type="tel" class="form-control" id="contactPhone" placeholder="(123) 456-7890">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Address</label>
                            <textarea class="form-control" id="contactAddress" rows="2" placeholder="Enter address"></textarea>
                        </div>
                        <button type="submit" class="btn btn-success">
                            <i class="fas fa-plus me-2"></i>Add Contact
                        </button>
                    </form>
                </div>
            </div>

            <!-- Contact List -->
            <div class="tab-pane fade" id="listContact" role="tabpanel">
                <div class="table-container">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h4>All Contacts</h4>
                        <button class="btn btn-primary btn-sm" onclick="loadContactsList()">
                            <i class="fas fa-sync-alt me-1"></i>Refresh
                        </button>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="contactsTableBody">
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
            </div>
        </div>
    `;
}

// Initialize contacts section
async function initContactsSection() {
    // Setup form handler
    document.getElementById('contactForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await handleContactSubmit();
    });

    // Load contacts list (will be loaded when tab is clicked)
}

// Handle contact form submission
async function handleContactSubmit() {
    try {
        const contactData = {
            name: document.getElementById('contactName').value,
            type: document.getElementById('contactType').value,
            email: document.getElementById('contactEmail').value || null,
            phone: document.getElementById('contactPhone').value || null,
            address: document.getElementById('contactAddress').value || null
        };

        await apiService.createContact(contactData);
        showSuccess('contactsSuccess', 'Contact added successfully!');
        document.getElementById('contactForm').reset();

        // Refresh contacts list if viewing it
        if (document.getElementById('listContact').classList.contains('show')) {
            await loadContactsList();
        }
    } catch (error) {
        console.error('Error adding contact:', error);
        showError('contactsError', error.message || 'Failed to add contact');
    }
}

// Load contacts list
async function loadContactsList() {
    try {
        contactsList = await apiService.getContacts();
        updateContactsTable();
    } catch (error) {
        console.error('Error loading contacts:', error);
        showError('contactsError', 'Failed to load contacts list');
    }
}

// Update contacts table
function updateContactsTable() {
    const tbody = document.getElementById('contactsTableBody');

    if (!contactsList || contactsList.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">No contacts found</td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = contactsList.map(contact => {
        const typeBadge = contact.type === 'customer'
            ? '<span class="badge bg-primary">Customer</span>'
            : '<span class="badge bg-warning">Supplier</span>';

        return `
            <tr>
                <td>${contact.name}</td>
                <td>${typeBadge}</td>
                <td>${contact.email || '-'}</td>
                <td>${contact.phone || '-'}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editContact(${contact.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteContact(${contact.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Edit contact (placeholder - not fully implemented)
function editContact(contactId) {
    const contact = contactsList.find(c => c.id === contactId);
    if (contact) {
        alert('Edit functionality: ' + contact.name + '\n(Not fully implemented in this version)');
    }
}

// Delete contact (placeholder - not fully implemented)
function deleteContact(contactId) {
    const contact = contactsList.find(c => c.id === contactId);
    if (contact && confirm('Are you sure you want to delete ' + contact.name + '?')) {
        alert('Delete functionality: ' + contact.name + '\n(Not fully implemented in this version)');
    }
}

// Load contacts when tab is shown
document.addEventListener('shown.bs.tab', function (e) {
    if (e.target.id === 'list-contact-tab') {
        loadContactsList();
    }
});
