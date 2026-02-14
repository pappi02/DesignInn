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

/**
 * HomePage - Temporary landing page showing app status
 * To be replaced in Phase 2.3 with real landing page
 */
function HomePage() {
  const { user, token } = useAuthStore()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900">
      <div className="text-center text-white p-8">
        <h1 className="text-5xl font-bold mb-6 text-yellow-600">DesignInn</h1>
        <p className="text-xl mb-8 text-gray-300">Creative Design Solutions</p>

        {token ? (
          <div className="space-y-4">
            <p className="text-lg">Welcome back, {user?.first_name || 'User'}!</p>
            <p className="text-gray-400 mb-6">Authentication verified. Product pages coming next.</p>
            <div className="loader mx-auto mb-6"></div>
            <a href="/auth/verify-email" className="text-yellow-600 hover:text-yellow-500 text-sm">
              Complete your email verification
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-gray-400 mb-8">
              Welcome to DesignInn. Authentication system is ready.
            </p>
            <div className="space-x-4">
              <a href="/auth/login" className="btn-primary inline-block">Login</a>
              <a href="/auth/register" className="btn-secondary inline-block">Register</a>
            </div>
          </div>
        )}

        <div className="mt-12 text-gray-500 text-sm space-y-1">
          <p>✅ Phase 2.1: Foundation (API, Stores, Hooks)</p>
          <p>✅ Phase 2.2: Authentication Pages (Login, Register, Forgot Password, Email Verification, Profile Completion)</p>
          <p>🚀 Phase 2.3: Layout & Navigation (Header, Footer, MainLayout)</p>
        </div>
      </div>
    </div>
  )
}

export default App
