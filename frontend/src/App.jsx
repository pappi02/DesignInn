import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './stores'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import { MainLayout } from './components/Layout'

// Auth Pages - Phase 2.2
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage'
import EmailVerificationPage from './pages/Auth/EmailVerificationPage'
import ProfileCompletionPage from './pages/Auth/ProfileCompletionPage'

// Main Pages - Phase 2.3+
import HomePage from './pages/HomePage'

// Product Pages - Phase 2.4
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'

// Account Pages - Phase 2.5
import ProfilePage from './pages/ProfilePage'
import OrdersPage from './pages/OrdersPage'
import SettingsPage from './pages/SettingsPage'
import AddressBookPage from './pages/AddressBookPage'

// Shopping Pages - Phase 2.9
import WishlistPage from './pages/WishlistPage'
import ProductComparisonPage from './pages/ProductComparisonPage'

// Admin Pages - Phase 2.10
import AdminLayout from './components/Layout/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProductsPage from './pages/admin/AdminProductsPage'
import AdminOrdersPage from './pages/admin/AdminOrdersPage'
import AdminUsersPage from './pages/admin/AdminUsersPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

// Admin Pages - Phase 2.11 Step 3
import AnalyticsPage from './pages/admin/AnalyticsPage'

/**
 * AdminProtectedRoute Component
 * Ensures user is authenticated and has admin role
 */
function AdminProtectedRoute({ children }) {
  const { user, token } = useAuthStore()

  if (!token) {
    return <LoginPage />
  }

  if (user?.role !== 'admin') {
    return <NotFoundPage />
  }

  return children
}

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    // Initialize auth from localStorage on app mount
    initializeAuth()
  }, [initializeAuth])

  return (
    <Routes>
      {/* Auth Pages - No Layout */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
      <Route path="/auth/complete-profile" element={<ProfileCompletionPage />} />

      {/* Main Pages - With Layout */}
      <Route
        path="/"
        element={
          <MainLayout>
            <HomePage />
          </MainLayout>
        }
      />

      {/* Product Pages - Phase 2.4 */}
      <Route
        path="/products"
        element={
          <MainLayout>
            <ProductsPage />
          </MainLayout>
        }
      />
      <Route
        path="/products/:productId"
        element={
          <MainLayout>
            <ProductDetailPage />
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <CartPage />
          </MainLayout>
        }
      />
      <Route
        path="/checkout"
        element={
          <MainLayout>
            <CheckoutPage />
          </MainLayout>
        }
      />

      {/* Account Pages - Phase 2.5 - Protected Routes */}
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
      <Route
        path="/orders"
        element={
          <MainLayout>
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <MainLayout>
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/addresses"
        element={
          <MainLayout>
            <ProtectedRoute>
              <AddressBookPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />

      {/* Shopping Pages - Phase 2.9 */}
      <Route
        path="/wishlist"
        element={
          <MainLayout>
            <ProtectedRoute>
              <WishlistPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/compare"
        element={
          <MainLayout>
            <ProductComparisonPage />
          </MainLayout>
        }
      />

      {/* Admin Pages - Phase 2.10 - Protected Routes with Admin Role Check */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminLayout>
            <AdminProtectedRoute>
              <AdminProductsPage />
            </AdminProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <AdminLayout>
            <AdminProtectedRoute>
              <AdminOrdersPage />
            </AdminProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <AdminProtectedRoute>
              <AdminUsersPage />
            </AdminProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <AdminLayout>
            <AdminProtectedRoute>
              <AdminSettingsPage />
            </AdminProtectedRoute>
          </AdminLayout>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <AdminLayout>
            <AdminProtectedRoute>
              <AnalyticsPage />
            </AdminProtectedRoute>
          </AdminLayout>
        }
      />

      {/* Protected Pages - To be created in Phase 2.5+ */}
      {/* <Route
        path="/products"
        element={
          <MainLayout>
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/products/:slug"
        element={
          <MainLayout>
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/cart"
        element={
          <MainLayout>
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
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
      <Route
        path="/orders"
        element={
          <MainLayout>
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          </MainLayout>
        }
      />
      <Route
        path="/quotes"
        element={
          <MainLayout>
            <ProtectedRoute>
              <QuotesPage />
            </ProtectedRoute>
          </MainLayout>
        }
      /> */}

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <MainLayout>
            <NotFoundPage />
          </MainLayout>
        }
      />
    </Routes>
  )
}

/**
 * NotFoundPage - 404 Error Page
 */
function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-black mb-4">404</h1>
        <p className="text-2xl text-gray-700 mb-4">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <a
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

export default App
