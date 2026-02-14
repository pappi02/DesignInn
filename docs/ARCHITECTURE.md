# DesignInn System Architecture

## High-Level Overview

DesignInn is a full-stack web application built with modern technologies, featuring a React.js frontend and Django REST API backend, connected to PostgreSQL database with Cloudinary for file storage.

## Architecture Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │  React SPA (Vite)                                  │  │
│  │  - Pages, Components, Hooks                        │  │
│  │  - Axios for API calls                             │  │
│  │  - Zustand for state management                    │  │
│  │  - Tailwind CSS for styling                        │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
              ↓ HTTPS / REST API ↑
┌──────────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                        │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Django + Django REST Framework                    │  │
│  │  - Serializers & Validation                        │  │
│  │  - ViewSets & Permissions                          │  │
│  │  - URL Routing (api/v1/*)                          │  │
│  │  - Authentication (Token/JWT)                      │  │
│  │  - Error Handling & Logging                        │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Business Logic Layer                              │  │
│  │  - Users App (customer & staff)                    │  │
│  │  - Products App (merchandise)                      │  │
│  │  - Orders App (order management)                   │  │
│  │  - Quotes App (quote requests)                     │  │
│  │  - Portfolio App (showcase)                        │  │
│  │  - Services App (service definitions)              │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
    ↓ ORM (Django ORM) ↑        ↓ File Operations ↑
┌──────────────────┐            ┌──────────────────┐
│  PostgreSQL DB   │            │   Cloudinary    │
│  - Users         │            │   - Images      │
│  - Products      │            │   - Documents   │
│  - Orders        │            │   - Files       │
│  - Portfolio     │            └──────────────────┘
└──────────────────┘
```

## 🗂️ Component Architecture

### Frontend (React + Vite)

#### Page Structure
```
/
├── / (Homepage)
│   ├── Hero Section
│   ├── Services Preview
│   ├── Featured Products
│   ├── Portfolio Preview
│   ├── Testimonials
│   └── CTA Sections
├── /services (Services Overview)
├── /shop (Product Listing)
│   ├── Filters (Category, Price)
│   └── Product Grid
├── /product/:id (Product Detail)
├── /cart (Shopping Cart)
├── /checkout (Order Checkout)
├── /order (Order Form)
├── /orders (Bulk Orders)
├── /quotes (Quote Request)
├── /track (Order Tracking)
├── /portfolio (Portfolio)
├── /about (About Page)
├── /contact (Contact Page)
└── /admin/* (Admin Routes - Protected)
```

#### Component Hierarchy
```
<App>
  ├── <Layout>
  │   ├── <Navbar>
  │   ├── <Routes>
  │   │   ├── <HomePage>
  │   │   ├── <ShopPage>
  │   │   ├── <CartPage>
  │   │   ├── <CheckoutPage>
  │   │   ├── <QuoteRequestPage>
  │   │   ├── <PortfolioPage>
  │   │   ├── <TrackerPage>
  │   │   └── <AdminDashboard>
  │   ├── <Footer>
  │   └── <WhatsAppButton>
  └── <ToastContainer>
```

### Backend (Django)

#### App Structure
```
core/
├── settings.py (Configuration)
├── urls.py (Main routing)
├── wsgi.py (Production server)
│
├── users/
│   ├── models.py → User
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── products/
│   ├── models.py
│   │   ├── Category
│   │   ├── Product
│   │   └── ProductVariant
│   ├── serializers.py
│   ├── views.py
│   ├── filters.py
│   └── urls.py
│
├── orders/
│   ├── models.py
│   │   ├── Order
│   │   ├── OrderItem
│   │   └── OrderStatusLog
│   ├── serializers.py
│   ├── views.py
│   ├── signals.py
│   └── urls.py
│
├── quotes/
│   ├── models.py → Quote
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── portfolio/
│   ├── models.py
│   │   ├── PortfolioProject
│   │   └── PortfolioImage
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
├── services/
│   ├── models.py → Service
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
│
└── common/
    ├── permissions.py
    ├── pagination.py
    ├── validators.py
    ├── storage.py
    └── utils.py
```

## 🔄 Data Flow

### Order Creation Flow
```
1. User selects products → React State (Cart)
2. User completes checkout form
3. React POSTs to /api/v1/orders/
4. Django validates data
5. Create Order + OrderItems
6. Upload design files to Cloudinary
7. Return order_number & confirmation
8. React displays confirmation page
9. Store order_number in localStorage
10. Backend sends confirmation email
```

### Quote Request Flow
```
1. User fills quote form
2. React POSTs to /api/v1/quotes/
3. Django validates data
4. Upload file to Cloudinary
5. Create Quote record
6. Return quote_number
7. React displays quote reference
8. Admin reviews in dashboard
9. Admin adds quote amount & status
10. Customer can track via phone/quote number
```

### Admin Order Update Flow
```
1. Admin logs into dashboard
2. Fetches orders from /api/v1/orders/ (admin only)
3. Clicks order to view details
4. Admin updates status (design → printing → ready → delivered)
5. Admin uploads preview image
6. Admin adds notes/message
7. PATCHes /api/v1/orders/:id/status/
8. Django updates order + creates log entry
9. System sends email notification to customer
10. Customer sees updated status when tracking
```

## 🔐 Security Layers

### Authentication & Authorization
```
Public Endpoints (No Auth)
├── GET /products/
├── GET /portfolio/
├── GET /services/
└── POST /orders/ (any user)

Protected Endpoints (Admin Auth Only)
├── PATCH /orders/:id/status/
├── GET /orders/ (list all)
├── POST /products/ (create)
├── PATCH /quotes/:id/status/
└── Admin dashboard APIs
```

### Data Validation
```
Frontend                 → Backend
Input Validation        → Serializer Validation
Type Checking           → Model Validation
File Size Check         → File Validators
Format Validation       → Custom Validators
```

## 🗄️ Database Schema Overview

### Core Tables
- **User** - Customer/staff information
- **Product** - Merchandise catalog
- **ProductVariant** - Size/color variations
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Items in orders
- **OrderStatusLog** - Order history
- **Quote** - Quote requests
- **PortfolioProject** - Showcase projects
- **PortfolioImage** - Project images
- **Service** - Service definitions

### Relationships
```
User (1) ─── (M) Order
User (1) ─── (M) Quote

Order (1) ─── (M) OrderItem
OrderItem (M) ─── (1) Product

Product (M) ─── (1) Category
Product (1) ─── (M) ProductVariant

PortfolioProject (1) ─── (M) PortfolioImage
```

## 📡 API Structure

### RESTful Endpoints
```
/api/v1/
├── /products/
│   ├── GET list all
│   ├── GET :id detail
│   ├── POST create (admin)
│   ├── PATCH :id update (admin)
│   └── DELETE :id destroy (admin)
├── /orders/
│   ├── POST create
│   ├── GET :id detail
│   ├── PATCH :id/status/ update
│   └── GET track/ tracking
├── /quotes/
│   ├── POST create
│   ├── GET :id detail
│   └── PATCH :id/status/ (admin)
├── /portfolio/
│   ├── GET list
│   ├── GET :id detail
│   └── GET filter/ by category
└── /services/
    └── GET list
```

## 🔄 Request/Response Pattern

### Standard Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2024-02-14T12:00:00Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": { ... },
  "timestamp": "2024-02-14T12:00:00Z"
}
```

## 🚀 Deployment Architecture

### Development
```
localhost:3000/5173  →  localhost:8000  →  PostgreSQL
(React Dev Server)       (Django Dev)
```

### Production
```
Frontend (Vercel/Netlify)  ←→  Nginx  ←→  Django (Gunicorn)
         (Static + SPA)         Reverse      (API Server)
                                Proxy
                                  ↓
                            PostgreSQL
                            (Managed DB)
                                  ↓
                            Cloudinary
                            (File Storage)
```

## 🔧 Technology Decisions

### Why React + Vite?
- **React**: Industry standard, large ecosystem, component reusability
- **Vite**: Lightning-fast build, instant HMR, modern bundling

### Why Django REST?
- Rapid development, built-in features, strong ORM
- Excellent documentation, security out-of-the-box
- Perfect for API-first architecture

### Why PostgreSQL?
- Reliable, ACID compliant, advanced features
- Great Django integration, excellent performance

### Why Cloudinary?
- Serverless file management, automatic optimization
- Global CDN, cost-effective, easy integration

## 📊 Performance Considerations

### Frontend Optimization
- Code splitting (lazy load components)
- Image optimization (Cloudinary transforms)
- Memoization (React.memo for components)
- Virtual lists for product listings

### Backend Optimization
- Database indexing on frequently queried fields
- Select_related for foreign keys
- Pagination for large datasets
- Response caching where appropriate
- Async tasks for file uploads

### Caching Strategy
```
Static Assets    → CDN (1 year cache)
Product Images   → Cloudinary (1 month)
API Responses    → Browser/Server (5-10 min)
```

## 🔍 Monitoring & Logging

### Backend Logging
- Django logger for application events
- Error tracking with Sentry
- Request/response logging
- File upload tracking

### Frontend Monitoring
- Browser console for dev errors
- Sentry for production errors
- Google Analytics for user behavior
- Performance metrics

---

This architecture ensures scalability, maintainability, and professional-grade reliability for DesignInn.
