# Phase 2.5: Quick Reference Guide

## Overview
Phase 2.5 implements 4 user account management pages with protected routes and form validation.

## Quick Navigation

| Page | Route | Purpose | Auth Required |
|------|-------|---------|----------------|
| ProfilePage | `/profile` | View/edit user profile | ✅ Yes |
| OrdersPage | `/orders` | View order history | ✅ Yes |
| SettingsPage | `/settings` | Account settings | ✅ Yes |
| AddressBookPage | `/addresses` | Manage addresses | ✅ Yes |

## File Locations

```
frontend/src/pages/
├── ProfilePage.jsx          280+ LOC
├── OrdersPage.jsx           260+ LOC
├── SettingsPage.jsx         320+ LOC
└── AddressBookPage.jsx      280+ LOC
```

## Component Imports

```jsx
// In App.jsx
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import SettingsPage from './pages/SettingsPage'
import AddressBookPage from './pages/AddressBookPage'
```

## Core Hooks Used

```javascript
// useAuthStore - Authentication state
import { useAuthStore } from './stores/authStore'
const { user, token, logout } = useAuthStore()

// useForm - Form management
import { useForm } from './hooks'
const form = useForm({ field1: '', field2: '' })

// React hooks
useState, useMemo, useEffect
```

## Common Patterns

### Protected Routes
```jsx
<Route path="/profile" element={
  <MainLayout>
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  </MainLayout>
} />
```

### useForm Usage
```jsx
const form = useForm({ firstName: '', lastName: '' })

// Bind to input
<input {...form.bind('firstName')} />

// Get value
console.log(form.values.firstName)
```

### Toast Notifications
```jsx
import { toast } from 'react-toastify'

toast.success('Profile saved!')
toast.error('Error occurred')
```

### Conditional Rendering
```jsx
{isEditing ? (
  <EditForm />
) : (
  <ViewMode />
)}
```

## Mock Data

### ProfilePage Mock
```javascript
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@designinn.com',
  phone: '+1 (555) 123-4567',
  company: 'Design Studio Pro',
  industry: 'Creative Design',
  bio: 'Passionate about design...'
}
```

### OrdersPage Mock (5 orders)
- ORD-001234 - Pending - $450.00
- ORD-001231 - Processing - $1,200.00
- ORD-001230 - Completed - $320.00
- ORD-001229 - Completed - $580.00
- ORD-001225 - Cancelled - $400.00

### AddressBookPage Mock (2 addresses)
- Home: 123 Main Street, New York, NY 10001
- Office: 456 Business Avenue, New York, NY 10002

## Key Features

### ProfilePage
- ✅ View/edit toggle
- ✅ Profile sections
- ✅ Avatar with initials
- ✅ Form validation

### OrdersPage
- ✅ Search by ID/product
- ✅ Filter by status
- ✅ Sort by date/total
- ✅ Download invoice button

### SettingsPage
- ✅ Security tab (password change)
- ✅ Notifications tab (5 toggles)
- ✅ Privacy tab (3 settings)
- ✅ Account tab (logout/delete)

### AddressBookPage
- ✅ Add address
- ✅ Edit address
- ✅ Delete address
- ✅ Set as default

## Styling Constants

### Colors
```css
/* Primary */
Gold: #d4af37
Black: #000000

/* Status */
Success/Green: #10b981
Warning/Yellow: #fbbf24
Danger/Red: #ef4444
Info/Blue: #3b82f6
```

### Common Classes

**Button Primary (Black)**
```jsx
className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
```

**Button Secondary (Border)**
```jsx
className="bg-white border-2 border-black text-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition"
```

**Input/Form**
```jsx
className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
```

**Card Container**
```jsx
className="border-2 border-gray-200 rounded-lg p-6"
```

## Responsive Breakpoints

```css
/* Mobile: < 640px */
1 column, full width

/* Tablet: 640px - 1024px */
2 columns, condensed layout

/* Desktop: > 1024px */
3+ columns, full features
```

## Testing Quick Checks

```javascript
// Check auth
useAuthStore().user?.email

// Check form binding
<input {...form.bind('email')} />

// Check mock data loads
console.log(MOCK_ADDRESSES.length)

// Check toast appears
toast.success('Test')

// Check navigation
navigate('/profile')
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Page doesn't load | Check auth with ProtectedRoute |
| Form not updating | Verify useForm binding |
| No data showing | Check mock data initialization |
| Styling off | Verify Tailwind CSS classes |
| Navigation broken | Check routes in App.jsx |

## Phase Progress

- ✅ Phase 2.1: Foundation
- ✅ Phase 2.2: Authentication Pages
- ✅ Phase 2.3: Layout & Navigation
- ✅ Phase 2.4: Product Pages
- ✅ Phase 2.5: User Account Pages (CURRENT)

**Overall: 50% Complete**

## Next Steps

Phase 2.6 will focus on:
- API integration
- Real backend data
- Enhanced filtering
- File uploads
- Order management

---

Created: Phase 2.5 Session  
Last Updated: Current Session  
Status: ✅ Complete
