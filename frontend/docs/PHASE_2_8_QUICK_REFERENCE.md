# Phase 2.8: Admin Dashboard - Quick Reference

## Overview
Phase 2.8 implements a complete admin dashboard with management interfaces for orders, products, users, and analytics.

---

## Quick Navigation

| Page | Route | Purpose | Features |
|------|-------|---------|----------|
| Dashboard | `/admin` | KPI overview | Metrics, charts, recent orders |
| Orders Mgmt | `/admin/orders` | Order management | List, filter, status update |
| Products Mgmt | `/admin/products` | Product management | CRUD, categories, stock |
| Users Mgmt | `/admin/users` | User administration | Ban, permissions, history |
| Analytics | `/admin/analytics` | Reports & data | Charts, exports, trends |

---

## File Locations

```
frontend/src/
├── components/Layout/
│   ├── AdminLayout.jsx         (200+ LOC)
│   └── AdminSidebar.jsx        (150+ LOC)

├── pages/Admin/
│   ├── AdminDashboard.jsx      (400+ LOC)
│   ├── OrdersManagement.jsx    (350+ LOC)
│   ├── ProductsManagement.jsx  (350+ LOC)
│   ├── UsersManagement.jsx     (300+ LOC)
│   └── AnalyticsPage.jsx       (300+ LOC)

├── api/
│   └── admin.api.js            (300+ LOC)

└── App.jsx                     (UPDATED)
```

---

## Import Statements

```javascript
// Admin components
import AdminLayout from '@/components/Layout/AdminLayout'
import AdminDashboard from '@/pages/Admin/AdminDashboard'
import OrdersManagement from '@/pages/Admin/OrdersManagement'
import ProductsManagement from '@/pages/Admin/ProductsManagement'
import UsersManagement from '@/pages/Admin/UsersManagement'
import AnalyticsPage from '@/pages/Admin/AnalyticsPage'

// Admin API
import { adminAPI } from '@/api'
```

---

## Admin Pages Overview

### AdminDashboard
**Purpose:** Main admin overview page with KPIs
**Features:**
- 4 Metric cards (Orders, Revenue, Users, Products)
- Order status breakdown
- Revenue trend chart
- Recent orders table
- User activity summary

**Key Components:**
```jsx
<MetricsGrid />      // 4 KPI cards
<StatusOverview />   // Order status breakdown
<RevenueChart />     // Monthly revenue
<RecentOrders />     // Last orders table
<UserActivity />     // User summary
```

### OrdersManagement
**Purpose:** Manage all orders
**Features:**
- Orders table with pagination
- Search, filter, sort
- Status update dropdown
- Mark as shipped
- Cancel order
- Export to CSV

**Key Controls:**
```javascript
Status Filter: All, Pending, Processing, Ready, Shipped, Delivered, Cancelled
Date Range: Last 7/30/90 days, Custom
Search: By order number
Sort: By date, amount, status
```

### ProductsManagement
**Purpose:** Manage product catalog
**Features:**
- Products table
- Add/edit/delete products
- Category filtering
- Stock level indicators
- Toggle featured/active
- Bulk actions

**Key Controls:**
```javascript
Category Filter: All categories
Status: Active, Inactive
Stock: In Stock, Low Stock, Out of Stock
Actions: Add, Edit, Delete, Toggle Featured
```

### UsersManagement
**Purpose:** Manage user accounts
**Features:**
- Users list with pagination
- Filter by status, role
- View user details
- Ban/unban user
- Reset password
- View order history
- Edit permissions

**Key Controls:**
```javascript
Status Filter: All, Active, Inactive, Banned
Role Filter: Admin, Customer, Seller, Support
Search: By name or email
Actions: View, Edit, Ban, Reset Password
```

### AnalyticsPage
**Purpose:** Analytics and reporting
**Features:**
- Revenue charts
- Order statistics
- Top products ranking
- User growth tracking
- Custom reports
- Export options

**Key Sections:**
```javascript
Revenue Analytics    // Monthly chart + category breakdown
Order Analytics      // Daily orders + status distribution
Product Analytics    // Top 10 products
User Analytics       // Growth + retention
Custom Reports       // Date range + export
```

---

## Admin API Methods

### Dashboard & Analytics
```javascript
// Get dashboard KPI metrics
await adminAPI.getDashboardMetrics()

// Get order statistics
await adminAPI.getOrdersStats()

// Get revenue data
await adminAPI.getRevenueData({ period: 'monthly' })

// Get user analytics
await adminAPI.getUsersStats()

// Get product analytics
await adminAPI.getProductsStats()
```

### Orders Management
```javascript
// Update single order status
await adminAPI.updateOrderStatus(orderId, 'shipped')

// Bulk update multiple orders
await adminAPI.bulkUpdateOrders({
  orderIds: [1, 2, 3],
  status: 'shipped',
  trackingNumber: 'ABC123'
})

// Mark order as shipped
await adminAPI.markOrderShipped(orderId, {
  trackingNumber: 'ABC123',
  carrier: 'FedEx'
})
```

### Products Management
```javascript
// Create product
await adminAPI.createProduct({
  name: 'New Product',
  price: 99.99,
  category: 'Design',
  stock: 50
})

// Update product
await adminAPI.updateProduct(productId, {
  name: 'Updated Name',
  price: 89.99
})

// Delete product
await adminAPI.deleteProduct(productId)

// Toggle featured
await adminAPI.toggleFeatured(productId)
```

### Users Management
```javascript
// Ban/unban user
await adminAPI.manageUser(userId, {
  action: 'ban' // or 'unban'
})

// Reset password
await adminAPI.resetPassword(userId)

// Update user role
await adminAPI.updateUserRole(userId, 'admin')
```

### Reports
```javascript
// Generate custom report
await adminAPI.generateReport({
  type: 'revenue',
  dateRange: { from: '2024-01-01', to: '2024-12-31' },
  format: 'csv' // or 'pdf'
})
```

---

## Status Colors

| Status | Color | Meaning |
|--------|-------|---------|
| Pending | Yellow | Awaiting confirmation |
| Processing | Blue | Being prepared |
| Ready | Purple | Ready for shipment |
| Shipped | Cyan | On the way |
| Delivered | Green | Delivered |
| Cancelled | Red | Cancelled |

---

## Common Code Patterns

### Pattern 1: Fetch Data on Mount
```javascript
useEffect(() => {
  const loadData = async () => {
    const data = await adminAPI.getDashboardMetrics()
    setMetrics(data)
  }
  loadData()
}, [])
```

### Pattern 2: Handle Table Pagination
```javascript
const [page, setPage] = useState(1)
const { data, total } = await adminAPI.getOrders({
  page,
  limit: 10
})
```

### Pattern 3: Filter and Search
```javascript
await adminAPI.getOrders({
  status: selectedStatus,
  dateFrom: startDate,
  dateTo: endDate,
  search: searchQuery
})
```

### Pattern 4: Bulk Actions
```javascript
const selectedIds = orders
  .filter(o => o.selected)
  .map(o => o.id)

await adminAPI.bulkUpdateOrders({
  orderIds: selectedIds,
  status: 'shipped'
})
```

### Pattern 5: Export Data
```javascript
await adminAPI.generateReport({
  type: 'orders',
  format: 'csv'
}).then(data => {
  // Trigger download
  const url = URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.download = 'orders.csv'
  link.click()
})
```

---

## Styling Constants

### Colors
```css
Primary Black: #000000
Accent Gold: #d4af37

Status Colors:
Pending:   #fbbf24 (yellow)
Processing: #3b82f6 (blue)
Ready:     #a855f7 (purple)
Shipped:   #06b6d4 (cyan)
Delivered: #10b981 (green)
Cancelled: #ef4444 (red)
```

### Common Classes
```jsx
// Card container
className="bg-white border border-gray-200 rounded-lg shadow p-6"

// Table header
className="bg-gray-50 px-6 py-3 text-left"

// Status badge
className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold"

// Button primary
className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"

// Button secondary
className="bg-white border-2 border-black text-black px-4 py-2 rounded hover:bg-black hover:text-white"
```

---

## Mock Data Examples

### Dashboard Metrics
```javascript
{
  totalOrders: 1245,
  totalRevenue: 45890.50,
  activeUsers: 342,
  totalProducts: 156,
  ordersGrowth: 12.5,
  revenueGrowth: 8.3,
  usersGrowth: 5.2
}
```

### Order Item
```javascript
{
  id: 1,
  orderNumber: 'ORD-001234',
  customerName: 'John Doe',
  status: 'shipped',
  totalAmount: 450.00,
  itemCount: 3,
  createdAt: '2024-02-10'
}
```

### Product Item
```javascript
{
  id: 1,
  name: 'Logo Design',
  category: 'Graphic Design',
  price: 99.99,
  cost: 30.00,
  stock: 5,
  featured: true,
  active: true,
  sku: 'LOGO-001'
}
```

### User Item
```javascript
{
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  role: 'customer',
  status: 'active',
  joinDate: '2024-01-15',
  ordersCount: 5,
  totalSpent: 1250.00
}
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Admin routes not showing | Check role in ProtectedRoute |
| Data not loading | Use mock data, verify API endpoints |
| Status colors not showing | Check Tailwind CSS configuration |
| Pagination not working | Verify total count and page calculation |
| Cannot update status | Check admin permissions in backend |
| Export not downloading | Verify CORS headers and blob creation |

---

## Best Practices

1. ✅ Always validate user is admin before rendering
2. ✅ Show loading spinners during data fetch
3. ✅ Confirm before delete operations
4. ✅ Display success/error toasts for actions
5. ✅ Implement pagination for large datasets
6. ✅ Use filters to reduce data load
7. ✅ Cache metrics for 5-10 minutes
8. ✅ Handle API errors gracefully

---

## Security Notes

- ⚠️ Admin routes require authentication + admin role
- ⚠️ Sensitive actions need confirmation dialogs
- ⚠️ Never expose internal IDs in URLs
- ⚠️ Validate all user input on backend
- ⚠️ Log all admin actions for audit trail
- ⚠️ Separate admin permissions from regular users

---

## Phase Links

- [PHASE_2_8_COMPLETE.md](./PHASE_2_8_COMPLETE.md) - Full documentation
- [PHASE_2_6_COMPLETE.md](./PHASE_2_6_COMPLETE.md) - API services
- [Overall Progress](./FRONTEND_PROGRESS_PHASES_2_1_TO_2_8.md)

---

**Status:** ✅ Phase 2.8 Complete  
**Frontend Progress:** 60% (Phases 2.1-2.8)  
**Next Phase:** 2.9 (Advanced Features)
