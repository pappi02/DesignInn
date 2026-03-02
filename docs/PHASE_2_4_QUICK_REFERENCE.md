# Phase 2.4: Product Catalog - Quick Reference Guide

## 🚀 Quick Start

### Routes Added
```javascript
// In App.jsx
<Route path="/products" element={<MainLayout><ProductsPage /></MainLayout>} />
<Route path="/products/:productId" element={<MainLayout><ProductDetailPage /></MainLayout>} />
<Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
<Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
```

### Import Statements
```jsx
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
```

---

## 📄 Component Reference

### ProductsPage
**File:** `/frontend/src/pages/ProductsPage.jsx`  
**Component:** `ProductsPage` (Main Component)  
**Sub-components:** `FilterPanel`, `ProductCard`

**Usage:**
```jsx
<ProductsPage />
```

**Features:**
- Product grid with filtering
- Search functionality
- Sorting options
- Pagination
- Mobile-responsive

**Filter Options Available:**
```javascript
Categories: ['all', 'furniture', 'lighting', 'decor', 'flooring']
Price Ranges: ['all', '0-100', '100-500', '500-1000', '1000-999999']
Sort Options: ['name', 'price-low', 'price-high', 'rating', 'newest']
```

---

### ProductDetailPage
**File:** `/frontend/src/pages/ProductDetailPage.jsx`  
**Component:** `ProductDetailPage`

**Usage:**
```jsx
// Access via route with productId
<Route path="/products/:productId" element={<ProductDetailPage />} />
```

**Hooks Used:**
```jsx
const { productId } = useParams()
const navigate = useNavigate()
const { user, token } = useAuthStore()
```

**Features:**
- Product gallery
- Full specifications
- Customer reviews
- Related products
- Add to cart button
- Request quote button

**Tabs Available:**
1. **Details** - Description and features
2. **Specifications** - Technical specs table
3. **Reviews** - Customer testimonials

---

### CartPage
**File:** `/frontend/src/pages/CartPage.jsx`  
**Component:** `CartPage`  
**Sub-component:** `CartItem`

**Usage:**
```jsx
<CartPage />
```

**Store Integration:**
```jsx
const { items, removeItem, updateQuantity, total, itemCount, isEmpty } = useCartStore()
```

**Methods:**
- `removeItem(itemId)` - Remove from cart
- `updateQuantity(itemId, quantity)` - Change quantity
- `total()` - Get total price
- `itemCount()` - Get total items
- `isEmpty()` - Check if cart is empty

---

### CheckoutPage
**File:** `/frontend/src/pages/CheckoutPage.jsx`  
**Component:** `CheckoutPage`

**Usage:**
```jsx
<CheckoutPage />
```

**4-Step Process:**
1. **Shipping Information** - Address form
2. **Payment Method** - Credit card form
3. **Review Order** - Confirm details
4. **Confirmation** - Order success

**State Variables:**
```jsx
const [step, setStep] = useState(1)
const [sameAsShipping, setSameAsShipping] = useState(true)
const [paymentMethod, setPaymentMethod] = useState('card')
```

---

## 🛠️ Using Existing Components

### FilterPanel Component
**Used in:** ProductsPage  
**Props:**
```jsx
<FilterPanel
  categories={CATEGORIES}
  selectedCategory={selectedCategory}
  onCategoryChange={handleCategoryChange}
  priceOptions={PRICE_OPTIONS}
  priceRange={priceRange}
  onPriceChange={handlePriceChange}
  sortOptions={SORT_OPTIONS}
  selectedSort={selectedSort}
  onSortChange={handleSortChange}
/>
```

### ProductCard Component
**Used in:** ProductsPage, CartPage  
**Props:**
```jsx
<ProductCard
  product={product}
  onViewDetails={handleViewProduct}
  onAddToCart={handleAddToCart}
/>
```

### CartItem Component
**Used in:** CartPage  
**Props:**
```jsx
<CartItem
  item={item}
  onRemove={handleRemoveItem}
  onQuantityChange={handleQuantityChange}
/>
```

---

## 📦 State Management

### Using useCartStore
```jsx
import { useCartStore } from '../../stores'

function MyComponent() {
  const { 
    items,           // Array of cart items
    addItem,         // (product, quantity) => void
    removeItem,      // (itemId) => void
    updateQuantity,  // (itemId, qty) => void
    clearCart,       // () => void
    total,           // () => number
    itemCount,       // () => number
    isEmpty          // () => boolean
  } = useCartStore()
}
```

### Using useAuthStore (In Phase 2.4 Components)
```jsx
import { useAuthStore } from '../../stores'

function MyComponent() {
  const { user, token, logout } = useAuthStore()
  
  // Check if user is authenticated
  if (!token) {
    // User not logged in
  }
}
```

---

## 🎨 Styling Patterns Used in Phase 2.4

### Product Grid (Responsive)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
  {/* Products here */}
</div>
```

### Filter Sidebar (Hidden on Mobile)
```jsx
<div className="hidden lg:block">
  <FilterPanel {...props} />
</div>
```

### Mobile Filter Button
```jsx
<button
  onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
  className="lg:hidden flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg"
>
  <FiFilter size={20} />
  <span>Filters</span>
</button>
```

### Card Component Pattern
```jsx
<div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
  <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300"></div>
  <div className="p-4">
    {/* Content */}
  </div>
</div>
```

### Button Patterns
```jsx
// Primary (Black)
<button className="bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold">
  Primary Button
</button>

// Secondary (Border)
<button className="border-2 border-black text-black py-3 rounded-lg hover:bg-black hover:text-white transition font-semibold">
  Secondary Button
</button>

// Gold Accent
<button className="text-yellow-600 hover:text-yellow-700 font-semibold">
  Link Button
</button>
```

---

## 🔄 User Flows

### Product Discovery Flow
1. User navigates to `/products`
2. ProductsPage loads with all 14 mock products
3. User can:
   - Search by name/description
   - Filter by category
   - Filter by price range
   - Sort by preference
   - Page through results
4. Click on product card
5. Navigate to ProductDetailPage

### Add to Cart Flow
1. On ProductDetailPage, click "Add to Cart"
2. If not authenticated → Redirect to login
3. If authenticated → Add to `useCartStore`
4. Toast notification shows success
5. Cart badge updates in Header

### Checkout Flow
1. Navigate to `/cart`
2. Review items in CartPage
3. Click "Proceed to Checkout" → Step 1
4. Enter shipping address → Step 2
5. Enter payment info → Step 3
6. Review order → Step 4
7. Order confirmed → Redirect home

---

## 🧪 Mock Data Reference

### Sample Product Structure
```javascript
{
  id: 1,
  name: 'Premium Marble Desk',
  description: 'Elegant marble top desk with steel frame',
  category: 'furniture',
  price: 1299.99,
  originalPrice: 1499.99,
  rating: 4.5,
  reviews: 124,
  stock: 15,
  sku: 'PMD-001-WHT',
  images: ['image1', 'image2', 'image3', 'image4'],
  features: ['Genuine Italian marble', 'Steel frame', ...],
  specifications: [{label: 'Dimensions', value: '160cm x 80cm x 75cm'}, ...],
  reviews_list: [{author: 'John', rating: 5, comment: '...'}]
}
```

### Available Mock Products (14 Total)
| ID | Name | Category | Price | Rating |
|----|------|----------|-------|--------|
| 1 | Premium Marble Desk | furniture | $1,299.99 | 4.5 ⭐ |
| 2 | Modern LED Pendant Light | lighting | $249.99 | 4.8 ⭐ |
| 3 | Minimalist Wall Mirror | decor | $179.99 | 4.3 ⭐ |
| 4 | Wooden Flooring Sample | flooring | $89.99 | 4.6 ⭐ |
| 5 | Luxury Sectional Sofa | furniture | $2,499.99 | 4.7 ⭐ |
| 6 | Crystal Chandelier | lighting | $599.99 | 5.0 ⭐ |
| 7 | Abstract Wall Art Set | decor | $349.99 | 4.4 ⭐ |
| 8 | Luxury Tile Collection | flooring | $129.99 | 4.5 ⭐ |
| 9 | Ergonomic Office Chair | furniture | $449.99 | 4.6 ⭐ |
| 10 | Smart Ceiling Light | lighting | $199.99 | 4.2 ⭐ |
| 11 | Decorative Floor Lamp | lighting | $279.99 | 4.7 ⭐ |
| 12 | Ceramic Vase Collection | decor | $199.99 | 4.9 ⭐ |
| 13 | Coffee Table - Wood | furniture | $399.99 | 4.5 ⭐ |
| 14 | Vinyl Flooring Roll | flooring | $79.99 | 4.3 ⭐ |

---

## 🔌 API Integration Points

### Replace Mock Data
```javascript
// Current (Mock)
const [products] = useState(MOCK_PRODUCTS)

// Replace with API
const [products, setProducts] = useState([])
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products')
      setProducts(response.data.products)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    }
  }
  fetchProducts()
}, [])
```

### API Endpoints Needed
```
GET /api/products                    - List all products
GET /api/products/:id                - Get product details
GET /api/products/:id/related        - Get related products
GET /api/products/:id/reviews        - Get product reviews
POST /api/cart                       - Add to cart
DELETE /api/cart/:itemId             - Remove from cart
PUT /api/cart/:itemId                - Update cart quantity
POST /api/orders                     - Create order
GET /api/orders/:orderId             - Get order details
```

---

## 🐛 Debugging Tips

### Check Cart Content
```javascript
// In browser console
import { useCartStore } from './stores/cartStore'
const store = useCartStore.getState()
console.log(store.items)
console.log(store.total())
console.log(store.itemCount())
```

### Check Auth State
```javascript
// In browser console
import { useAuthStore } from './stores/authStore'
const auth = useAuthStore.getState()
console.log(auth.user)
console.log(auth.token)
```

### Test Navigation
```javascript
// Manually test routes
window.location.href = 'http://localhost:5173/products'
window.location.href = 'http://localhost:5173/products/1'
window.location.href = 'http://localhost:5173/cart'
window.location.href = 'http://localhost:5173/checkout'
```

---

## 📋 Common Tasks

### Task: Add New Filtering Option
1. Open ProductsPage.jsx
2. Add to CATEGORIES/PRICE_OPTIONS/SORT_OPTIONS
3. Update FilterPanel component
4. Test filtering

### Task: Change Product Grid Columns
1. Find grid line in ProductsPage: `grid-cols-1 sm:grid-cols-2 md:grid-cols-3`
2. Change `md:grid-cols-3` to desired columns
3. Test responsive layout

### Task: Modify Checkout Steps
1. Open CheckoutPage.jsx
2. Update `setStep()` calls
3. Add/remove step components
4. Update step indicator

### Task: Update Price Display
1. Find price formatting: `${price.toFixed(2)}`
2. Add currency prefix if needed
3. Consider useFormatter hook for consistency

---

## ✅ Quality Checklist

- [x] All components render without errors
- [x] Responsive on mobile (< 640px)
- [x] Responsive on tablet (640-1024px)
- [x] Responsive on desktop (> 1024px)
- [x] Search filtering works
- [x] Category filtering works
- [x] Price range filtering works
- [x] Sorting works
- [x] Pagination works
- [x] Product details load
- [x] Cart items display
- [x] Cart totals calculate correctly
- [x] Checkout form validates
- [x] All navigation works
- [x] All buttons functional
- [x] No console errors

---

## 📝 Notes for Future Development

### For Phase 2.5+
- Create UserStore for profile data
- Add addressStore for multiple addresses
- Implement order tracking page
- Add wishlist functionality
- Create quote management system

### Performance Improvements
- Add image lazy loading
- Implement product search caching
- Add page transition animations
- Optimize re-renders with React.memo

### Security Improvements
- Validate payment data server-side
- Implement CSRF protection
- Add rate limiting on search
- Sanitize user input

---

## 🎯 Phase 2.4 Statistics

| Metric | Value |
|--------|-------|
| **Files Created** | 4 pages + 6 docs |
| **Components** | 7 (4 pages + 3 sub-components) |
| **Lines of Code** | 1,200+ |
| **Features** | 30+ |
| **Mock Products** | 14 |
| **Filter Options** | 5 categories, 5 prices, 5 sorts |
| **Checkout Steps** | 4 |
| **Routes Added** | 4 |
| **Status** | ✅ 100% Complete |

---

**Phase 2.4 Complete! Ready for backend integration and Phase 2.5 development.**
