/**
 * AdminLayout Component
 * Master layout for admin dashboard pages
 * Features:
 * - Sidebar navigation with collapsible menu
 * - Top navbar with admin controls
 * - Role-based access control
 * - Fully responsive design for mobile/tablet/desktop
 * - Mobile drawer navigation
 * - Safe area support for notch devices
 */

import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiLogOut, FiUser, FiHome, FiPackage, FiShoppingCart, FiUsers, FiBarChart3, FiSettings } from 'react-icons/fi'
import { useAuthStore } from '../../stores'
import { toast } from 'react-toastify'
import { useResponsive, useSafeArea } from '../../hooks/usePWA'
import { PWAInstallPrompt } from '../PWA/PWAInstallPrompt'

/**
 * AdminLayout - Master layout for admin pages
 */
function AdminLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAdmin } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const { isMobile, isTablet, isDesktop } = useResponsive()
  const safeArea = useSafeArea()

  // Auto-collapse sidebar on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [isMobile])

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin || !user) {
      navigate('/auth/login')
      toast.error('Admin access required')
    }
  }, [user, isAdmin, navigate])

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout()
      navigate('/auth/login')
      toast.success('Logged out successfully')
    }
  }

  // Navigation items
  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FiBarChart3, label: 'Analytics', path: '/admin/analytics' },
    { icon: FiPackage, label: 'Products', path: '/admin/products' },
    { icon: FiShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: FiUsers, label: 'Users', path: '/admin/users' },
    { icon: FiSettings, label: 'Settings', path: '/admin/settings' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <div className="flex h-screen bg-gray-100" style={{ paddingTop: `${safeArea.top}px` }}>
      <PWAInstallPrompt />
      {/* Sidebar - Desktop */}
      {!isMobile && (
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-black text-white transition-all duration-300 ease-in-out overflow-hidden flex flex-col shadow-lg`}
        >
          <SidebarContent
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
            user={user}
            navItems={navItems}
            isActive={isActive}
            handleLogout={handleLogout}
          />
        </aside>
      )}

      {/* Mobile Drawer */}
      {isMobile && mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileDrawerOpen(false)}
        >
          <div
            className="fixed left-0 top-0 bottom-0 w-64 bg-black text-white shadow-lg flex flex-col overflow-auto z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent
              sidebarOpen={true}
              setSidebarOpen={() => setMobileDrawerOpen(false)}
              user={user}
              navItems={navItems}
              isActive={isActive}
              handleLogout={handleLogout}
              onNavigate={() => setMobileDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between" style={{ paddingRight: `${safeArea.right}px`, paddingLeft: `calc(1rem + ${safeArea.left}px)` }}>
          <div className="flex items-center space-x-4">
            {isMobile && (
              <button
                onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition md:hidden"
              >
                <FiMenu size={24} className="text-black" />
              </button>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-black">
                {getPageTitle(location.pathname)}
              </h2>
              {!isMobile && (
                <p className="text-sm text-gray-600 mt-1">{getPageDescription(location.pathname)}</p>
              )}
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition hidden sm:block">
              <FiUser size={20} className="text-gray-600" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto" style={{ paddingBottom: `${safeArea.bottom}px`, paddingRight: `${safeArea.right}px` }}>
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}

/**
 * SidebarContent Component
 * Shared sidebar content for desktop and mobile
 */
function SidebarContent({
  sidebarOpen,
  setSidebarOpen,
  user,
  navItems,
  isActive,
  handleLogout,
  onNavigate = () => {},
}) {
  return (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        {sidebarOpen && (
          <h1 className="text-2xl font-bold text-yellow-600">DesignInn</h1>
        )}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-800 rounded transition md:hidden"
            title={sidebarOpen ? 'Close' : 'Open'}
          >
            <FiX size={24} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition text-nowrap ${
                active
                  ? 'bg-yellow-600 text-black font-semibold'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User Section */}
      <div className="border-t border-gray-700 p-4 space-y-3">
        {sidebarOpen && (
          <div className="bg-gray-800 rounded-lg p-3">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold text-yellow-600 truncate">{user?.email}</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition font-semibold text-sm"
        >
          <FiLogOut size={18} />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </>
  )
}

/**
 * Get page title based on current path
 */
function getPageTitle(pathname) {
  const titles = {
    '/admin/dashboard': 'Dashboard',
    '/admin/analytics': 'Analytics',
    '/admin/products': 'Products Management',
    '/admin/orders': 'Orders Management',
    '/admin/users': 'Users Management',
    '/admin/settings': 'Admin Settings',
  }
  return titles[pathname] || 'Admin Panel'
}

/**
 * Get page description based on current path
 */
function getPageDescription(pathname) {
  const descriptions = {
    '/admin/dashboard': 'Overview of your business metrics and recent activity',
    '/admin/analytics': 'Detailed analytics and reporting',
    '/admin/products': 'Manage your product catalog and inventory',
    '/admin/orders': 'View and manage customer orders',
    '/admin/users': 'Manage user accounts and permissions',
    '/admin/settings': 'Configure admin settings and preferences',
  }
  return descriptions[pathname] || ''
}

export default AdminLayout
