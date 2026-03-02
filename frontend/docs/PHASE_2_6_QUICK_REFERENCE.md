# Phase 2.6: API Service Enhancement - Quick Reference

## Overview
Phase 2.6 enhances the API service layer with retry logic, error handling, and comprehensive API services for Products and Orders.

---

## Quick Navigation

| Service | Methods | Status |
|---------|---------|--------|
| productsAPI | list, getDetail, getFeatured, search, etc. | ✅ |
| ordersAPI | create, getMyOrders, getDetail, cancel, etc. | ✅ |
| authAPI | login, register, getProfile, logout | ✅ |
| errorHandler | parseAPIError, safeAPICall, retryAPICall | ✅ |
| loadingState | Global loading state management | ✅ |
| useAPILoading | Hook to track API loading state | ✅ |

---

## File Locations

```
frontend/src/
├── api/
│   ├── client.js              - Enhanced API client
│   ├── products.api.js        - Products API service
│   ├── orders.api.js          - Orders API service
│   ├── errorHandler.js        - Error handling utilities
│   ├── auth.api.js            - Authentication API
│   ├── endpoints.js           - Endpoint definitions
│   └── index.js               - Centralized exports

├── hooks/
│   └── useAPILoading.js       - Loading state hook

└── components/Loading/
    └── GlobalLoadingIndicator.jsx - Loading UI components
```

---

## Import Statements

```javascript
// Import API services
import { productsAPI, ordersAPI, authAPI } from '@/api'

// Import error utilities
import { 
  safeAPICall, 
  retryAPICall, 
  parseAPIError,
  extractValidationErrors 
} from '@/api'

// Import hooks
import { useAPILoading } from '@/hooks/useAPILoading'

// Import components
import GlobalLoadingIndicator, { 
  LoadingBar, 
  LoadingSkeleton, 
  LoadingSpinner 
} from '@/components/Loading/GlobalLoadingIndicator'
```

---

## Most Common Examples

### Example 1: Fetch Products with Error Handling
```javascript
const { success, data, error } = await safeAPICall(
  () => productsAPI.list({ page: 1, limit: 12 }),
  { showToast: true }
)
```

### Example 2: Show Loading Indicator in Component
```javascript
function ProductPage() {
  const { isLoading } = useAPILoading()
  
  return isLoading ? <LoadingSpinner /> : <Products />
}
```

### Example 3: Fetch Data with Hook
```javascript
const { data, isLoading, error, refetch } = useAPIData(
  () => ordersAPI.getMyOrders(),
  []
)
```

### Example 4: Create Order with Retry
```javascript
try {
  const result = await retryAPICall(
    () => ordersAPI.create(orderData),
    3, // Max retries
    1000 // Initial delay
  )
} catch (error) {
  console.error(error.getUserMessage())
}
```

### Example 5: Extract Validation Errors
```javascript
const { success, error } = await safeAPICall(
  () => authAPI.register(data)
)

if (!success && error.isValidationError()) {
  const fieldErrors = extractValidationErrors(error)
  // fieldErrors = { email: 'Already exists', password: 'Too short' }
}
```

---

## API Services Quick Reference

### productsAPI

```javascript
// List products with filters
await productsAPI.list({
  page: 1,
  limit: 12,
  search: 'design',
  category: 'graphic-design',
  minPrice: 100,
  maxPrice: 1000,
  sortBy: 'created_at',
  sortOrder: 'desc'
})

// Get single product
await productsAPI.getDetail('product-slug')

// Get featured products
await productsAPI.getFeatured(8)

// Get newest products
await productsAPI.getNewest(8)

// Get bestsellers
await productsAPI.getBestsellers(8)

// Get related products
await productsAPI.getRelated('product-slug', 5)

// Get all categories
await productsAPI.getCategories()

// Search products
await productsAPI.search({
  query: 'design',
  categories: ['graphic-design'],
  minPrice: 100,
  maxPrice: 1000,
  sortBy: 'created_at',
  page: 1
})
```

### ordersAPI

```javascript
// Create order
await ordersAPI.create({
  items: [...],
  shipping_address: '...',
  billing_address: '...',
  payment_method: 'credit_card',
  notes: 'Optional notes'
})

// Get user's orders
await ordersAPI.getMyOrders({
  page: 1,
  limit: 10,
  status: 'completed', // or 'pending', 'processing', 'cancelled'
  sortBy: 'created_at',
  sortOrder: 'desc'
})

// Get order detail
await ordersAPI.getDetail(123)

// Track order
await ordersAPI.track(123)

// Cancel order
await ordersAPI.cancel(123, 'Changed my mind')

// Submit feedback
await ordersAPI.submitFeedback(123, {
  rating: 5,
  comment: 'Great product!'
})

// Update order status (admin)
await ordersAPI.updateStatus(123, 'completed')

// Mark as shipped (admin)
await ordersAPI.markShipped(123, {
  trackingNumber: 'ABC123',
  carrier: 'FedEx',
  notes: 'Shipped!'
})
```

### authAPI

```javascript
// Register user
await authAPI.register({
  email: 'user@example.com',
  password: 'secure_password',
  first_name: 'John',
  last_name: 'Doe'
})

// Login user
await authAPI.login('user@example.com', 'password')

// Get current user profile
await authAPI.getProfile()

// Update profile
await authAPI.updateProfile({
  first_name: 'Jane',
  phone: '555-1234'
})

// Change password
await authAPI.changePassword('oldpass', 'newpass', 'newpass')

// Verify token
await authAPI.verifyToken()
```

---

## Error Handling Patterns

### Pattern: Check Error Type
```javascript
const { success, error } = await safeAPICall(...)

if (!success) {
  if (error.isAuthError()) {
    // Handle auth error
  } else if (error.isValidationError()) {
    // Handle validation error
    const fields = extractValidationErrors(error)
  } else if (error.isRetryable()) {
    // Error can be retried
  } else {
    // Generic error
  }
}
```

### Pattern: Custom Error Handling
```javascript
const { execute } = useAPIOperationLoading()

const handleSave = async () => {
  execute(async () => {
    return await productsAPI.update(id, data)
  }).catch(err => {
    const apiError = parseAPIError(err)
    console.error(apiError.getDetails())
  })
}
```

---

## Loading State Patterns

### Pattern: Global Loading Indicator
```jsx
// In App.jsx
import GlobalLoadingIndicator from '@/components/Loading/GlobalLoadingIndicator'

function App() {
  return (
    <>
      <GlobalLoadingIndicator />
      <Routes>...</Routes>
    </>
  )
}
```

### Pattern: Loading Bar (Minimal)
```jsx
import { LoadingBar } from '@/components/Loading/GlobalLoadingIndicator'

function App() {
  return (
    <>
      <LoadingBar />
      <Routes>...</Routes>
    </>
  )
}
```

### Pattern: Skeleton Loading
```jsx
const { data, isLoading } = useAPIData(
  () => productsAPI.list(),
  []
)

return isLoading ? <LoadingSkeleton rows={5} /> : <ProductList data={data} />
```

---

## Configuration

### Client Configuration
```javascript
// In client.js
const API_CONFIG = {
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 10000,          // Request timeout (ms)
  maxRetries: 3,          // Max retry attempts
  retryDelay: 1000        // Initial retry delay (ms)
}
```

### Environment Variables
```env
# .env
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| API requests failing | Check `VITE_API_URL` in .env |
| No loading indicator | Add `<GlobalLoadingIndicator />` to App |
| Validation errors not showing | Use `extractValidationErrors(error)` |
| Token expired error | 401 errors clear token automatically |
| Duplicate requests | Deduplication only works for GET requests |
| Retry not working | Check if error status is retryable (5xx, 408, 429) |

---

## Best Practices

1. ✅ Always use `safeAPICall()` for error handling
2. ✅ Use `useAPIData()` hook in components
3. ✅ Put `GlobalLoadingIndicator` in main App
4. ✅ Handle validation errors with `extractValidationErrors()`
5. ✅ Check `error.isRetryable()` before retrying
6. ✅ Use toast notifications for user feedback
7. ✅ Extract validation errors for form display
8. ✅ Log errors for debugging in dev mode

---

## Phase Links

- [PHASE_2_6_COMPLETE.md](./PHASE_2_6_COMPLETE.md) - Full documentation
- [FRONTEND_PROGRESS.md](./FRONTEND_PROGRESS_PHASES_2_1_TO_2_6.md) - Overall progress
- [Previous Phase (2.5)](./PHASE_2_5_COMPLETE.md)

---

**Status:** ✅ Phase 2.6 Complete  
**Frontend Progress:** 55% (Phases 2.1-2.6)  
**Next Phase:** 2.7 (Connect Pages to APIs)
