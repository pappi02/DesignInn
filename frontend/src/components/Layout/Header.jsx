import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuthStore, useCartStore } from '../../stores'
import { toast } from 'react-toastify'
import { FiMenu, FiX, FiLogOut, FiUser, FiShoppingCart } from 'react-icons/fi'

/**
 * Header Component - Navigation and user menu
 * Features:
 * - Logo and brand name
 * - Navigation menu (authenticated vs public)
 * - User dropdown menu
 * - Mobile hamburger menu
 * - Shopping cart icon with item count
 * - Logout functionality
 */
function Header() {
  const navigate = useNavigate()
  const { user, token, logout } = useAuthStore()
  const { itemCount } = useCartStore()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      setUserDropdownOpen(false)
      toast.success('Logged out successfully')
      navigate('/auth/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  return (
    <header className="bg-black text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
          <div className="bg-yellow-600 rounded px-2 py-1">
            <span className="font-bold text-black text-lg">D</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">DesignInn</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {token ? (
            <>
              <Link to="/products" className="hover:text-yellow-600 transition">
                Products
              </Link>
              <Link to="/quotes" className="hover:text-yellow-600 transition">
                Quotes
              </Link>
              <Link to="/portfolio" className="hover:text-yellow-600 transition">
                Portfolio
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="relative hover:text-yellow-600 transition">
                <FiShoppingCart size={24} />
                {itemCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-yellow-600 text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {itemCount()}
                  </span>
                )}
              </Link>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 hover:text-yellow-600 transition"
                >
                  <FiUser size={20} />
                  <span className="text-sm truncate">{user?.first_name || 'Account'}</span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-lg shadow-xl py-2 border border-gray-800">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-gray-800 hover:text-yellow-600 transition text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 hover:bg-gray-800 hover:text-yellow-600 transition text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-4 py-2 hover:bg-gray-800 hover:text-yellow-600 transition text-sm"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-800 hover:text-red-500 transition text-sm flex items-center space-x-2"
                    >
                      <FiLogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/auth/login" className="hover:text-yellow-600 transition">
                Login
              </Link>
              <Link
                to="/auth/register"
                className="bg-yellow-600 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-700 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden hover:text-yellow-600 transition"
        >
          {mobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800">
          <div className="px-4 py-4 space-y-3">
            {token ? (
              <>
                <Link
                  to="/products"
                  className="block py-2 hover:text-yellow-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
                <Link
                  to="/quotes"
                  className="block py-2 hover:text-yellow-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quotes
                </Link>
                <Link
                  to="/portfolio"
                  className="block py-2 hover:text-yellow-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Portfolio
                </Link>
                <Link
                  to="/cart"
                  className="block py-2 hover:text-yellow-600 transition flex items-center justify-between"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Cart</span>
                  {itemCount() > 0 && (
                    <span className="bg-yellow-600 text-black text-xs px-2 py-1 rounded-full font-bold">
                      {itemCount()}
                    </span>
                  )}
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 hover:text-yellow-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left py-2 hover:text-red-500 transition flex items-center space-x-2"
                >
                  <FiLogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="block py-2 hover:text-yellow-600 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  className="block bg-yellow-600 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-700 transition text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
