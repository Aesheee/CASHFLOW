# Cash Flow Management System - HTML/JS/Bootstrap Version

This is a vanilla HTML, JavaScript, and Bootstrap CSS version of the Cash Flow Management System. It provides the same functionality as the React version but without any framework dependencies.

## Features

- **Dual Login System**: Separate login pages for Employee and Admin users
- **Dashboard Overview**: View statistics and recent activity
- **Transactions Management**: Record payments, sales, and purchases
- **Contacts Management**: Manage customers and suppliers
- **Inventory Management**: Track stock levels and item information
- **Responsive Design**: Works on desktop and mobile devices

## Project Structure

```
cash-flow-html/
├── index.html              # Employee login page (landing page)
├── admin-login.html        # Admin login page
├── dashboard.html          # Main dashboard with sidebar navigation
├── css/
│   └── styles.css         # Custom styles
├── js/
│   ├── config.js          # API configuration
│   ├── api.js             # API service layer
│   ├── auth.js            # Authentication utilities
│   ├── dashboard.js       # Dashboard controller
│   └── sections/
│       ├── home.js        # Home dashboard section
│       ├── transactions.js # Transactions section
│       ├── contacts.js    # Contacts section
│       └── inventory.js   # Inventory section
└── README.md              # This file
```

## Prerequisites

1. **Backend Server**: The backend API must be running on `http://localhost:5000`
2. **Web Server**: You need to serve the HTML files through a web server (not just opening files directly)

## Installation & Setup

### 1. Start the Backend Server

First, ensure the backend server is running:

```bash
cd ../cash-flow-backend
npm install
node server.js
```

The backend should start on `http://localhost:5000`

### 2. Serve the HTML Files

You have several options to serve the HTML files:

#### Option A: Using Python (Recommended)

```bash
# Navigate to the cash-flow-html folder
cd cash-flow-html

# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

Then open your browser to: `http://localhost:8080`

#### Option B: Using Node.js http-server

```bash
# Install http-server globally (if not already installed)
npm install -g http-server

# Navigate to the cash-flow-html folder
cd cash-flow-html

# Start the server
http-server -p 8080
```

Then open your browser to: `http://localhost:8080`

#### Option C: Using Live Server (VS Code Extension)

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Usage

### Login Credentials

**Employee Login:**
- Username: `employee1`
- Password: `emp123`

**Admin Login:**
- Username: `admin`
- Password: `admin123`

### Navigation

1. Open `http://localhost:8080` in your browser
2. Login using employee or admin credentials
3. Use the sidebar to navigate between sections:
   - **HOME**: View dashboard statistics and recent activity
   - **TRANSACTIONS**: Record payments, sales, and purchases
   - **CONTACTS**: Manage customers and suppliers
   - **INVENTORY**: Track inventory items and stock levels

### Key Differences from React Version

1. **No Build Process**: No npm build required - just serve the files
2. **Multiple HTML Files**: Separate files for each page instead of SPA routing
3. **Vanilla JavaScript**: Pure JavaScript instead of React components
4. **Direct DOM Manipulation**: Uses `innerHTML` and `addEventListener` instead of React hooks
5. **Bootstrap CDN**: Loads Bootstrap from CDN instead of npm package

## Features by Section

### 1. Home Dashboard
- View 6 key statistics (Total Balance, To Receive, To Give, Sales, Purchases, Expenses)
- See recent activity in a table format
- Refresh data with a button click

### 2. Transactions
- **Payment In**: Record customer payments
- **New Sale**: Record product sales
- **Purchase**: Record supplier purchases
- All forms validate and submit to the backend API

### 3. Contacts
- **Create New Contact**: Add customers or suppliers
- **Contact List**: View all contacts with type badges
- Edit and delete functionality (placeholders)

### 4. Inventory
- **Add New Item**: Create inventory items with stock tracking
- **Inventory Status**: View all items with stock status badges
- **Summary Cards**: Total items, In Stock, Low Stock, Out of Stock counts
- Color-coded status badges (Green: In Stock, Yellow: Low Stock, Red: Out of Stock)

## API Endpoints Used

All API calls go to `http://localhost:5000/api`:

- `POST /login` - User authentication
- `GET /dashboard/stats` - Dashboard statistics
- `GET /activity` - Recent activity
- `GET /contacts` - Get all contacts
- `POST /contacts` - Create new contact
- `GET /inventory` - Get all inventory items
- `POST /inventory` - Create new inventory item
- `GET /transactions` - Get transactions
- `POST /transactions` - Create new transaction

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Security Notes

1. JWT tokens are stored in localStorage
2. All protected routes check for valid authentication
3. API calls include Bearer token in Authorization header
4. Users are redirected to login if not authenticated

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
- Make sure the backend server is running
- Ensure you're accessing the HTML files through a web server (not `file://`)

### API Connection Failed
- Check that the backend is running on `http://localhost:5000`
- Verify the API_CONFIG.BASE_URL in `js/config.js` matches your backend URL

### Login Not Working
- Check the browser console for errors
- Verify the backend database has the correct user credentials
- Check that JWT_SECRET is consistent between frontend and backend

## Development Notes

- All JavaScript files are loaded as separate scripts (no module bundling)
- Bootstrap 5.3.0 is loaded from CDN
- Font Awesome 6.4.0 is loaded from CDN for icons
- No transpilation or compilation needed
- Changes to files are reflected immediately (just refresh browser)

## License

This project is part of the Cash Flow Management System.
