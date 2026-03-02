import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiShoppingCart, FiStar, FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore, useWishlistStore } from '../../stores'
import { productsAPI } from '../api'
import { useAPIData } from '../hooks/useAPILoading'
import { LoadingSpinner } from '../components/Loading/GlobalLoadingIndicator'
import Reviews from '../components/Reviews/Reviews'

/**
 * ProductDetailPage - Individual product detail view
 * Features:
 * - Product images/gallery
 * - Full product information
 * - Price and availability
 * - Add to cart functionality
 * - Request quote button
 * - Related products
 * - Reviews section
 */
function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const { isInWishlist, toggleItem, addToComparison, removeFromComparison, getComparisonProducts } = useWishlistStore()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('details')
  const [inWishlist, setInWishlist] = useState(false)
  const [inComparison, setInComparison] = useState(false)

  // Fetch product detail from API
  const { data: apiResponse, isLoading, error, refetch } = useAPIData(
    () => productsAPI.getDetail(productId),
    [productId]
  )

  const product = apiResponse?.data

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">
          {error ? `Error: ${error.message || 'Failed to load product'}` : 'Product not found'}
        </p>
        <div className="space-x-4">
          <button
            onClick={refetch}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold"
          >
            Retry
          </button>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 text-yellow-600 hover:text-yellow-700 font-semibold border border-yellow-600 rounded-lg"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!token) {
      toast.warning('Please login to add items to cart')
      navigate('/auth/login')
      return
    }
    toast.success(`${product.name} added to cart!`)
    // TODO: Integrate with cart store
  }

  const handleRequestQuote = () => {
    if (!token) {
      toast.warning('Please login to request a quote')
      navigate('/auth/login')
      return
    }
    toast.info('Quote request submitted. We will contact you soon.')
    // TODO: Integrate with quote submission
  }

  const handleToggleWishlist = () => {
    if (!product) return
    toggleItem({
      id: product.id,
      name: product.name,
      price: product.price,
      rating: product.rating || product.average_rating || 0,
      image: product.image || (product.images?.[0]),
      category: typeof product.category === 'object' ? product.category.name : product.category,
      slug: product.slug || productId,
    })
    setInWishlist(!inWishlist)
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist')
  }

  const handleToggleComparison = () => {
    if (!product) return
    const comparisonProducts = getComparisonProducts()
    const isCurrentlyInComparison = comparisonProducts.some(p => p.id === product.id)
    
    if (isCurrentlyInComparison) {
      removeFromComparison(product.id)
      setInComparison(false)
      toast.info('Removed from comparison')
    } else {
      if (comparisonProducts.length >= 4) {
        toast.warning('You can compare up to 4 products at a time')
        return
      }
      addToComparison({
        id: product.id,
        name: product.name,
        price: product.price,
        rating: product.rating || product.average_rating || 0,
        image: product.image || (product.images?.[0]),
        stock: product.stock || 0,
        category: typeof product.category === 'object' ? product.category.name : product.category,
        slug: product.slug || productId,
      })
      setInComparison(true)
      toast.success('Added to comparison')
    }
  }

  const handleQuantityChange = (value) => {
    const maxStock = product.stock || 0
    const newQuantity = Math.max(1, quantity + value)
    if (newQuantity <= maxStock) {
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="bg-white">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div>
            {/* Main Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg h-96 md:h-[500px] flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-gray-500 text-lg">{product.name}</p>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {(product.images || []).map((image, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded cursor-pointer transition ${
                    selectedImage === index ? 'ring-2 ring-yellow-600' : ''
                  }`}
                >
                  {image ? (
                    <img
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="w-full h-full object-cover rounded"
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            {/* Breadcrumb */}
            <div className="text-sm text-gray-600 mb-4">
              Home / Products / <span className="font-semibold">{product.category}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-black mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i}>{i < Math.round(product.rating || product.average_rating || 0) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({(product.reviews || product.review_count || 0)} reviews)</span>
              </div>
              <div className={`text-sm font-semibold ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(product.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-black">${parseFloat(product.price || 0).toFixed(2)}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">${parseFloat(product.originalPrice).toFixed(2)}</span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <p className="text-sm text-green-600 mt-2">
                  Save ${(product.originalPrice - product.price).toFixed(2)} (
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                </p>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 mb-8">{product.description}</p>

            {/* Key Features */}
            <div className="mb-8">
              <h3 className="font-semibold text-black mb-4">Key Features</h3>
              <ul className="space-y-2">
                {(product.features || []).length > 0 ? (
                  (product.features || []).map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <FiCheck className="text-green-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{typeof feature === 'string' ? feature : feature.name || feature}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-600">No features available</p>
                )}
              </ul>
            </div>

            {/* Quantity and CTA */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-6 py-2 text-center">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  className="px-4 py-2 hover:bg-gray-100"
                  disabled={quantity >= (product.stock || 0)}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={(product.stock || 0) === 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Wishlist and Comparison Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition border-2 ${
                  inWishlist
                    ? 'bg-red-500 text-white border-red-500'
                    : 'border-red-500 text-red-500 hover:bg-red-50'
                }`}
              >
                <span>{inWishlist ? '❤️' : '🤍'}</span>
                <span>Wishlist</span>
              </button>
              <button
                onClick={handleToggleComparison}
                className={`flex items-center justify-center space-x-2 py-3 rounded-lg font-semibold transition border-2 ${
                  inComparison
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-blue-600 text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>📊</span>
                <span>Compare</span>
              </button>
            </div>

            {/* Request Quote Button */}
            <button
              onClick={handleRequestQuote}
              className="w-full py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition font-semibold"
            >
              Request Quote
            </button>

            {/* Additional Info */}
            <div className="mt-8 pt-8 border-t space-y-4">
              {product.sku && (
                <div className="flex justify-between">
                  <span className="text-gray-600">SKU:</span>
                  <span className="font-semibold">{product.sku}</span>
                </div>
              )}
              {product.category && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{typeof product.category === 'object' ? product.category.name : product.category}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className={`font-semibold ${(product.stock || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock || 0} in stock
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">Free shipping over $100</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex space-x-8 border-b mb-8">
            {['details', 'specifications', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-semibold transition ${
                  activeTab === tab
                    ? 'text-black border-b-2 border-yellow-600'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="prose prose-sm max-w-none">
              <h3 className="font-semibold text-black mb-4">Product Details</h3>
              <p className="text-gray-700 mb-4">{product.description || 'No description available'}</p>
              {(product.features || []).length > 0 && (
                <ul className="space-y-2 text-gray-700">
                  {(product.features || []).map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FiCheck className="text-green-600" />
                      <span>{typeof feature === 'string' ? feature : feature.name || feature}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="font-semibold text-black mb-4">Specifications</h3>
              {(product.specifications || []).length > 0 ? (
                <div className="space-y-4">
                  {(product.specifications || []).map((spec, index) => (
                    <div key={index} className="flex justify-between py-3 border-b">
                      <span className="text-gray-600">{spec.label || spec.name || spec}</span>
                      <span className="font-semibold text-black">{spec.value || '-'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No specifications available</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <Reviews productSlug={product.slug || productId} productId={product.id} />
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-16 border-t">
          <h2 className="text-3xl font-bold text-black mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {(product.related || []).length > 0 ? (
              (product.related || []).map((related) => (
                <div
                  key={related.id || related.slug}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => navigate(`/products/${related.slug || related.id}`)}
                >
                  <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                    {related.image && (
                      <img
                        src={related.image}
                        alt={related.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-black mb-2 line-clamp-2">{related.name}</h4>
                    <p className="text-2xl font-bold text-black">${parseFloat(related.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="col-span-full text-gray-600 text-center py-8">No related products available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
