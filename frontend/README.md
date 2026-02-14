# DesignInn Frontend - React Application

A modern, responsive React.js application for the DesignInn creative design studio. Built with cutting-edge technologies and designed for optimal performance and user experience.

## 🎨 Project Overview

**DesignInn Frontend** delivers a premium user experience for:
- Product browsing & shopping
- Order placement & tracking
- Quote request submission
- Portfolio showcase
- Service information
- Admin dashboard

**Tech Stack:**
- React 18+
- Vite (Lightning-fast build tool)
- Tailwind CSS (Modern utility-first styling)
- React Router v6 (Client-side routing)
- Axios (HTTP client)
- Zustand (State management)

**Design Theme:** Black (#000000) | White (#FFFFFF) | Gold (#D4AF37)

---

## 📋 Prerequisites

- Node.js 16+ or 18+
- npm 8+ or yarn
- Git

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
# Edit .env with your API URL and settings
```

### 3. Start Development Server
```bash
npm run dev
```

Access the app at: `http://localhost:5173`

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/                # Reusable React components
│   │   ├── common/               # Global shared components
│   │   │   ├── Button.jsx        # Button component (primary, secondary)
│   │   │   ├── Card.jsx          # Card container
│   │   │   ├── Modal.jsx         # Modal dialog
│   │   │   ├── Input.jsx         # Form input field
│   │   │   ├── FileUpload.jsx    # File picker & upload
│   │   │   ├── Loading.jsx       # Loading spinner
│   │   │   ├── ErrorMessage.jsx  # Error display
│   │   │   ├── Toast.jsx         # Notifications
│   │   │   └── WhatsAppButton.jsx # Floating WhatsApp button
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── Navbar.jsx        # Top navigation bar
│   │   │   ├── Footer.jsx        # Footer component
│   │   │   ├── Layout.jsx        # Main layout wrapper
│   │   │   └── Sidebar.jsx       # Admin sidebar
│   │   │
│   │   ├── home/                 # Homepage sections
│   │   │   ├── Hero.jsx          # Hero banner
│   │   │   ├── ServicesPreview.jsx # Services grid
│   │   │   ├── FeaturedMerchandise.jsx # Featured products
│   │   │   ├── BulkOrderPromo.jsx # Bulk order section
│   │   │   ├── PortfolioPreview.jsx # Portfolio showcase
│   │   │   ├── WhyChooseUs.jsx   # Value propositions
│   │   │   └── Testimonials.jsx  # Customer testimonials
│   │   │
│   │   ├── shop/                 # Shop components
│   │   │   ├── ProductCard.jsx   # Product card
│   │   │   ├── ProductFilters.jsx # Filter sidebar
│   │   │   ├── ProductSelectForm.jsx # Size/color selector
│   │   │   ├── CartItem.jsx      # Cart item row
│   │   │   └── RelatedProducts.jsx # Similar products
│   │   │
│   │   ├── orders/               # Order components
│   │   │   ├── CustomerForm.jsx  # Customer info form
│   │   │   ├── DeliveryOptions.jsx # Pickup/Delivery
│   │   │   ├── DesignUpload.jsx  # Design file upload
│   │   │   ├── TrackOrderForm.jsx # Order search
│   │   │   ├── OrderStatus.jsx   # Status timeline
│   │   │   └── BulkOrderForm.jsx # Bulk order form
│   │   │
│   │   ├── quotes/               # Quote components
│   │   │   ├── QuoteForm.jsx     # Quote request form
│   │   │   └── QuoteTracking.jsx # Quote status
│   │   │
│   │   ├── portfolio/            # Portfolio components
│   │   │   ├── PortfolioFilters.jsx # Category filter
│   │   │   └── ProjectCard.jsx   # Project card
│   │   │
│   │   ├── admin/                # Admin dashboard
│   │   │   ├── AdminLayout.jsx   # Admin wrapper
│   │   │   ├── AdminNav.jsx      # Admin menu
│   │   │   ├── AdminStats.jsx    # Dashboard stats
│   │   │   ├── OrdersTable.jsx   # Orders list
│   │   │   ├── QuotesTable.jsx   # Quotes list
│   │   │   └── ProductForm.jsx   # Product editor
│   │   │
│   │   └── contact/              # Contact components
│   │       ├── ContactForm.jsx   # Contact form
│   │       └── ContactInfo.jsx   # Contact details
│   │
│   ├── pages/                    # Full page components
│   │   ├── HomePage.jsx          # Home page
│   │   ├── ShopPage.jsx          # Product listing
│   │   ├── ProductDetailPage.jsx # Single product
│   │   ├── CartPage.jsx          # Shopping cart
│   │   ├── CheckoutPage.jsx      # Order checkout
│   │   ├── OrderConfirmation.jsx # Order success
│   │   ├── TrackOrderPage.jsx    # Order tracking
│   │   ├── QuoteRequestPage.jsx  # Quote submission
│   │   ├── PortfolioPage.jsx     # Portfolio listing
│   │   ├── ServicesPage.jsx      # Services overview
│   │   ├── AboutPage.jsx         # About page
│   │   ├── ContactPage.jsx       # Contact page
│   │   ├── AdminDashboard.jsx    # Admin overview
│   │   ├── OrdersAdmin.jsx       # Orders management
│   │   ├── QuotesAdmin.jsx       # Quotes management
│   │   ├── ProductsAdmin.jsx     # Products management
│   │   ├── PortfolioAdmin.jsx    # Portfolio management
│   │   ├── AdminLogin.jsx        # Admin login
│   │   └── NotFoundPage.jsx      # 404 page
│   │
│   ├── services/                 # API & service layer
│   │   ├── api.js               # Axios configuration
│   │   ├── productService.js    # Product API calls
│   │   ├── orderService.js      # Order API calls
│   │   ├── quoteService.js      # Quote API calls
│   │   ├── portfolioService.js  # Portfolio API calls
│   │   ├── service Service.js   # Service API calls
│   │   └── authService.js       # Authentication
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useCart.js          # Cart management
│   │   ├── useApi.js           # API calls wrapper
│   │   ├── useAuth.js          # Authentication state
│   │   ├── usePagination.js    # Pagination logic
│   │   └── useFormValidation.js # Form validation
│   │
│   ├── context/                 # Context API / Zustand stores
│   │   ├── CartContext.js      # Cart state
│   │   ├── AuthContext.js      # Auth state
│   │   └── appStore.js         # Global app state (Zustand)
│   │
│   ├── utils/                   # Helper functions
│   │   ├── formatters.js       # String & date formatting
│   │   ├── validators.js       # Input validation
│   │   ├── constants.js        # App constants
│   │   ├── errorHandler.js     # Error handling utilities
│   │   └── localStorage.js     # Storage helpers
│   │
│   ├── styles/                  # Global styles
│   │   ├── index.css           # Global CSS
│   │   ├── theme.js            # Theme configuration
│   │   └── tailwind.config.js  # Tailwind config
│   │
│   ├── assets/                  # Static assets
│   │   ├── images/             # Image files
│   │   ├── icons/              # Icon files
│   │   └── logos/              # Logo files
│   │
│   ├── App.jsx                  # Root app component
│   ├── App.css                  # App styles
│   └── main.jsx                 # Entry point
│
├── public/                      # Static files
│   └── favicon.ico
│
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS config
├── postcss.config.js           # PostCSS config
├── .env.example                # Environment template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies & scripts
├── README.md                   # This file
└── index.html                  # HTML template
```

---

## 🎨 Theme & Styling

### Colors
```css
/* Brand Colors */
--color-black: #000000;
--color-white: #FFFFFF;
--color-gold: #D4AF37;

/* Neutrals */
--color-gray-50: #F9FAFB;
--color-gray-700: #374151;
--color-gray-900: #111827;
```

### Tailwind Configuration
Located in `tailwind.config.js` with custom theme colors and typography.

---

## 🔌 API Integration

### Axios Instance
Located in `services/api.js`:
- Base URL configuration
- Request/response interceptors
- Error handling
- Auth token injection

### Example API Call
```javascript
// In service file
import api from './api';

export const getProducts = async () => {
  try {
    const response = await api.get('/products/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// In component
import { getProducts } from '../services/productService';

useEffect(() => {
  getProducts().then(setProducts);
}, []);
```

---

## 🛒 State Management

### Cart Context (Zustand)
```javascript
// useCart.js hook
const cart = useCart();
cart.addItem(product);
cart.removeItem(itemId);
cart.updateQuantity(itemId, qty);
```

---

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Watch Mode
```bash
npm run test:ui
```

### Coverage Report
```bash
npm run test:coverage
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

### Mobile-First Approach
All components built with mobile first, enhanced for larger screens.

---

## 🚀 Build & Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

Creates optimized build in `/dist` folder.

### Preview Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm i -g vercel
vercel
```

### Deploy to Netlify
```bash
npm run build
# Drag dist folder to Netlify
```

---

## 🔐 Environment Variables

See `.env.example`. Key variables:

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000/api/v1` |
| `VITE_APP_NAME` | App title | `DesignInn` |
| `VITE_WHATSAPP_NUMBER` | WhatsApp business | `1234567890` |
| `VITE_CONTACT_EMAIL` | Contact email | `info@designinn.com` |

---

## 📝 Code Style

### Format Code
```bash
npm run format
```

### Lint Code
```bash
npm run lint
```

---

## 🐛 Troubleshooting

### Blank Page
- Check browser console for errors
- Verify API URL in .env
- Check if backend is running

### API Connection Failed
- Ensure backend server running
- Check VITE_API_URL in .env
- Verify CORS settings on backend

### Build Fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Documentation

- [API Documentation](../docs/API.md)
- [Component Guide](../docs/COMPONENT_GUIDE.md)
- [Deployment Guide](../docs/DEPLOYMENT.md)

---

## 📞 Support & Contact

For issues or questions:
- Email: support@designinn.com
- WhatsApp: +1234567890

---

## 📄 License

This project is proprietary to DesignInn. All rights reserved.

---

## 👨‍💻 Development Team

Built with ❤️ for DesignInn Creative Studio

