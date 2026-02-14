import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../stores'
import { FiArrowRight, FiCheck, FiSmartphone, FiAward, FiTrendingUp } from 'react-icons/fi'

/**
 * HomePage - Main landing page
 * Features:
 * - Hero section
 * - Feature highlights
 * - Call to action
 * - Featured products (placeholder)
 * - Why choose us section
 */
function HomePage() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()

  const handleShopNow = () => {
    if (token) {
      navigate('/products')
    } else {
      navigate('/auth/login')
    }
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-black to-gray-900 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Creative Design Solutions for Your Space
              </h1>
              <p className="text-lg text-gray-300">
                Discover thousands of premium design products, from furniture to lighting and décor. Connect with designers and architects worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleShopNow}
                  className="bg-yellow-600 text-black px-8 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition flex items-center justify-center space-x-2"
                >
                  <span>Shop Now</span>
                  <FiArrowRight />
                </button>
                <Link
                  to="/portfolio"
                  className="border-2 border-yellow-600 text-yellow-600 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-600 hover:text-black transition text-center"
                >
                  View Portfolio
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="hidden md:block">
              <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-600/5 rounded-lg h-96 flex items-center justify-center">
                <div className="text-center">
                  <FiAward size={80} className="mx-auto text-yellow-600 mb-4" />
                  <p className="text-gray-400 text-sm">Premium Design Marketplace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose DesignInn?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiTrendingUp className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Trending Products</h3>
              <p className="text-gray-600">
                Access the latest and trending design products from top brands and suppliers worldwide.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiAward className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Verified Sellers</h3>
              <p className="text-gray-600">
                All our sellers are verified and trusted, ensuring quality products and reliable service.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
              <div className="bg-yellow-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FiSmartphone className="text-yellow-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-black">Easy to Use</h3>
              <p className="text-gray-600">
                Intuitive interface makes it simple to find products, create quotes, and manage orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Products</h2>
            <Link
              to="/products"
              className="text-yellow-600 hover:text-yellow-700 font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <FiArrowRight />
            </Link>
          </div>

          {/* Product Grid - Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <p className="text-gray-500">Product {item}</p>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-black mb-2">Premium Design Item {item}</h3>
                  <p className="text-sm text-gray-600 mb-4">High-quality design product</p>
                  <button
                    onClick={handleShopNow}
                    className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition font-semibold"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">For Designers & Architects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Get Custom Quotes</h3>
                  <p className="text-gray-400">Request quotes from suppliers with detailed specifications</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Build Your Portfolio</h3>
                  <p className="text-gray-400">Showcase your projects and connect with clients</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Manage Orders</h3>
                  <p className="text-gray-400">Track and manage all your orders in one place</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Bulk Discounts</h3>
                  <p className="text-gray-400">Get special pricing on bulk orders and wholesale purchases</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Expert Support</h3>
                  <p className="text-gray-400">Get help from our design consultants and support team</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FiCheck className="text-yellow-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold mb-1">Global Network</h3>
                  <p className="text-gray-400">Access products and suppliers from around the world</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-yellow-50 to-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-black">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8">
            Join hundreds of designers and architects using DesignInn to find the perfect products for their projects.
          </p>
          {token ? (
            <button
              onClick={() => navigate('/products')}
              className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition inline-flex items-center space-x-2"
            >
              <span>Browse Products</span>
              <FiArrowRight />
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/auth/login"
                className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition inline-flex items-center justify-center space-x-2"
              >
                <span>Sign In</span>
                <FiArrowRight />
              </Link>
              <Link
                to="/auth/register"
                className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition inline-flex items-center justify-center space-x-2"
              >
                <span>Create Account</span>
                <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default HomePage
