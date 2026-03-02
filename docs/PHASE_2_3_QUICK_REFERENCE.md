# Phase 2.3 - Layout & Navigation Quick Reference

## Components Overview

### Header Component
**Import**:
```jsx
import { Header } from './components/Layout'
```

**Props**: None (uses Zustand stores internally)

**Features**:
- Responsive navigation
- User dropdown menu
- Mobile hamburger menu
- Shopping cart icon
- Authentication-aware UI

**Internal Logic**:
```jsx
const { user, token, logout } = useAuthStore()
const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const [userDropdownOpen, setUserDropdownOpen] = useState(false)
```

**Navigation Structure**:
```
If user is authenticated:
  - Products link
  - Quotes link
  - Portfolio link
  - Cart icon
  - User dropdown menu

If user is not authenticated:
  - Login link
  - Register button
```

---

### Footer Component
**Import**:
```jsx
import { Footer } from './components/Layout'
```

**Props**: None (static component)

**Features**:
- Brand information
- Product categories
- Company links
- Support links
- Contact information
- Social media links
- Copyright and policies

**Structure**:
```jsx
<footer>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
    {/* 5 sections */}
  </div>
  <div className="bottom footer">
    {/* Copyright and policy links */}
  </div>
</footer>
```

---

### MainLayout Component
**Import**:
```jsx
import { MainLayout } from './components/Layout'
```

**Props**:
- `children` (React.ReactNode) - Page content

**Usage**:
```jsx
<MainLayout>
  <HomePage />
</MainLayout>
```

**Structure**:
```jsx
<div className="flex flex-col min-h-screen">
  <Header />
  <main className="flex-1">
    {children}
  </main>
  <Footer />
</div>
```

**Features**:
- Flex layout for full-height page
- Header at top
- Content flexes to fill space
- Footer at bottom
- Works on all screen sizes

---

## Usage Patterns

### Basic Page with Layout
```jsx
// In App.jsx
<Route
  path="/products"
  element={
    <MainLayout>
      <ProductsPage />
    </MainLayout>
  }
/>
```

### Protected Page with Layout
```jsx
// For authenticated-only pages
<Route
  path="/profile"
  element={
    <MainLayout>
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    </MainLayout>
  }
/>
```

### Page without Layout (Auth Pages)
```jsx
// Auth pages don't use layout
<Route path="/auth/login" element={<LoginPage />} />
```

---

## Styling Classes

### Header Styling
```css
.sticky          /* Header sticks to top */
.z-50           /* High z-index for dropdown menus */
.h-16           /* Height = 64px */
.md:flex        /* Visible on medium+ screens */
```

### Footer Styling
```css
.bg-black       /* Black background */
.text-gray-300  /* Light gray text */
.grid-cols-5    /* 5 columns on desktop */
.gap-8          /* Large gaps between columns */
```

### MainLayout Styling
```css
.flex flex-col min-h-screen    /* Full height layout */
.flex-1                        /* Content expands */
```

---

## Responsive Breakpoints

```jsx
// Header Navigation
<div className="hidden md:flex">  {/* Hidden on mobile */}
<button className="md:hidden">    {/* Visible only on mobile */}

// Footer Grid
<div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
  {/* 1 column on mobile, 2 on tablet, 5 on desktop */}

// HomePage Sections
<div className="grid grid-cols-1 md:grid-cols-3">
  {/* 1 column on mobile, 3 on desktop */}
```

---

## User Authentication in Header

### Logged-In User
**Shows**:
- Products link
- Quotes link
- Portfolio link
- Shopping cart icon with count
- User name in dropdown
- Profile, Orders, Settings, Logout options

**Logout**:
```jsx
const handleLogout = async () => {
  try {
    await logout()  // Calls useAuthStore.logout()
    toast.success('Logged out successfully')
    navigate('/auth/login')
  } catch (error) {
    toast.error('Logout failed')
  }
}
```

### Public User
**Shows**:
- Login link
- Register button

---

## Navigation Links

### Header Links
```jsx
Products     → /products
Quotes       → /quotes
Portfolio    → /portfolio
Cart         → /cart
Profile      → /profile
Orders       → /orders
Settings     → /settings
```

### Footer Links
**Products**:
- Furniture → /products?category=furniture
- Lighting → /products?category=lighting
- Decor → /products?category=decor
- Flooring → /products?category=flooring
- View All → /products

**Company**:
- About → /about
- Portfolio → /portfolio
- Blog → /blog
- Careers → /careers
- Contact → /contact

**Support**:
- Help Center → /help
- FAQ → /faq
- Shipping & Returns → /shipping
- Privacy Policy → /privacy
- Terms of Service → /terms

---

## Mobile Menu Behavior

### Opening Menu
```jsx
<button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
  {mobileMenuOpen ? <FiX /> : <FiMenu />}
</button>
```

### Menu Items
```jsx
{mobileMenuOpen && (
  <div className="md:hidden bg-gray-900">
    {/* All navigation items */}
    {/* Links close menu on click */}
  </div>
)}
```

---

## Customization Guide

### Change Header Colors
```jsx
// In Header.jsx
<header className="bg-black">           {/* Change to bg-blue-900 */}
<nav className="px-4 sm:px-6 lg:px-8">

// Logo background
<div className="bg-yellow-600">         {/* Change to bg-red-600 */}
```

### Change Footer Sections
```jsx
// In Footer.jsx - Add new section to grid
<div>
  <h3 className="text-white font-semibold mb-4">New Section</h3>
  <ul className="space-y-2 text-sm">
    {/* Add new links */}
  </ul>
</div>
```

### Change MainLayout Layout
```jsx
// Change flex direction
<div className="flex flex-col">     {/* or flex-row */}
  <Header />
  <main className="flex-1">         {/* or w-full */}
    {children}
  </main>
  <Footer />
</div>
```

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Header overlapping content | Add `pt-16` to main or use sticky positioning |
| Footer not at bottom | Use flex layout with `flex-1` on main |
| Mobile menu not working | Check `md:hidden` classes |
| Dropdown closed on scroll | Consider using fixed positioning |
| Links not navigating | Verify routes in App.jsx exist |
| Icons not showing | Ensure react-icons is installed |

---

## Performance Tips

1. **Lazy load images** in featured products
2. **Use React.memo** for Footer (static content)
3. **Debounce** mobile menu toggle
4. **Cache** authenticated user data
5. **Minify** CSS for production

---

## Accessibility Features

✅ **Header**:
- Semantic `<header>` element
- `<nav>` for navigation
- Proper heading hierarchy
- Icon + text labels

✅ **Footer**:
- Semantic structure
- Descriptive link text
- Icon + text combinations
- Color contrast

✅ **MainLayout**:
- Proper document structure
- `<main>` for primary content
- Skip navigation links (optional)

---

## Integration with Other Components

### Using Header in Protected Routes
```jsx
<Route
  path="/protected"
  element={
    <MainLayout>
      <ProtectedRoute>
        <ProtectedPage />  {/* Header already included via MainLayout */}
      </ProtectedRoute>
    </MainLayout>
  }
/>
```

### Header Access to Auth
```jsx
// Header automatically has access to:
const { user, token, logout } = useAuthStore()
const { navigate } = useNavigate()
const { toast } = useToastify()
```

### Footer Static Content
```jsx
// Footer content can be made dynamic:
// 1. Pull from CMS
// 2. Pull from backend API
// 3. Make links configurable
```

---

## Testing Layout Components

### Test Header
- [ ] Logo clickable to home
- [ ] Navigation links work
- [ ] Dropdown toggles
- [ ] Logout works
- [ ] Mobile menu works
- [ ] Authentication state affects UI

### Test Footer
- [ ] All links are present
- [ ] Links navigate correctly
- [ ] Responsive layout
- [ ] Social icons display

### Test MainLayout
- [ ] Header shows
- [ ] Footer shows
- [ ] Content displays between them
- [ ] Full-page height works
- [ ] No layout shifting

---

## Next Components to Build (Phase 2.4+)

- ProductsPage (with Header & Footer)
- ProductDetailPage
- CartPage
- SearchPage
- FilterPanel
- ProductCard component
- PaginationComponent

---

**Quick Reference Created**: Phase 2.3 Layout & Navigation  
**For**: Developers building on Phase 2.3
