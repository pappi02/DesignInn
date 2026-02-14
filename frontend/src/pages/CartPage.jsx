import { useNavigate } from 'react-router-dom'
import { FiX, FiArrowRight, FiTrendingUp } from 'react-icons/fi'
import { useCartStore } from '../../stores'
import { useAuthStore } from '../../stores'

/**
 * CartPage - Shopping cart view
 * Features:
 * - Display cart items
 * - Update quantities
 * - Remove items
 * - Apply promo codes
 * - Proceed to checkout
 * - Suggest related products
 */
function CartPage() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const { items, removeItem, updateQuantity, total, itemCount, isEmpty } = useCartStore()

  const handleCheckout = () => {
    if (!token) {
      navigate('/auth/login')
      return
    }
    navigate('/checkout')
  }

  const handleRemoveItem = (itemId) => {
    removeItem(itemId)
  }

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(itemId, newQuantity)
    }
  }

  if (isEmpty()) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <FiTrendingUp className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-3xl font-bold text-black mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added anything to your cart yet. Let's fix that!
            </p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-black mb-8">Shopping Cart ({itemCount()} items)</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={handleRemoveItem}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>

            {/* Continue Shopping */}
            <button
              onClick={() => navigate('/products')}
              className="mt-8 flex items-center space-x-2 text-yellow-600 hover:text-yellow-700 font-semibold"
            >
              <span>Continue Shopping</span>
              <FiArrowRight />
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              <h2 className="text-2xl font-bold text-black mb-6">Order Summary</h2>

              {/* Subtotal */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold text-black">${(total() / 1.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-semibold text-black">${(total() - total() / 1.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mb-8">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-black">Total</span>
                  <span className="text-2xl font-bold text-black">${total().toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold mb-4"
              >
                Proceed to Checkout
              </button>

              {/* Login Prompt */}
              {!token && (
                <div className="text-center text-sm text-gray-600">
                  <p>Need an account?</p>
                  <button
                    onClick={() => navigate('/auth/register')}
                    className="text-yellow-600 hover:text-yellow-700 font-semibold"
                  >
                    Sign up now
                  </button>
                </div>
              )}

              {/* Benefits */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="font-semibold text-black mb-4">Why shop with us?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Free shipping on orders over $100</li>
                  <li>✓ 30-day return guarantee</li>
                  <li>✓ Expert interior design advice</li>
                  <li>✓ Premium quality products</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Suggested Products */}
        <div className="mt-16 pt-16 border-t">
          <h2 className="text-3xl font-bold text-black mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {SUGGESTED_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="p-4">
                  <h4 className="font-semibold text-black mb-2">{product.name}</h4>
                  <p className="text-xl font-bold text-black">${product.price.toFixed(2)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // TODO: Add to cart
                    }}
                    className="w-full mt-4 bg-black text-white py-2 rounded text-sm hover:bg-gray-800 transition font-semibold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * CartItem Component - Individual cart item
 */
function CartItem({ item, onRemove, onQuantityChange }) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
      {/* Image */}
      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded flex-shrink-0" />

      {/* Details */}
      <div className="flex-1">
        <h3 className="font-semibold text-black text-lg">{item.name}</h3>
        <p className="text-gray-600">${item.price.toFixed(2)} each</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center border border-gray-300 rounded-lg">
        <button
          onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          className="px-3 py-1 hover:bg-gray-200"
        >
          −
        </button>
        <span className="px-4 py-1">{item.quantity}</span>
        <button
          onClick={() => onQuantityChange(item.id, item.quantity + 1)}
          className="px-3 py-1 hover:bg-gray-200"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="w-20 text-right">
        <p className="font-bold text-black text-lg">${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(item.id)}
        className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded transition"
      >
        <FiX size={20} />
      </button>
    </div>
  )
}

const SUGGESTED_PRODUCTS = [
  { id: 101, name: 'Desk Organizer', price: 49.99 },
  { id: 102, name: 'Monitor Stand', price: 79.99 },
  { id: 103, name: 'Desk Lamp', price: 129.99 },
  { id: 104, name: 'Office Rug', price: 199.99 },
]

export default CartPage
