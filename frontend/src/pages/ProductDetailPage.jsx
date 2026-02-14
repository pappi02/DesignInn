import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiShoppingCart, FiStar, FiCheck, FiX } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore } from '../../stores'

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

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    // Mock data - Replace with API call
    setProduct(MOCK_PRODUCT_DETAIL)
    setLoading(false)
  }, [productId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Product not found</p>
        <button
          onClick={() => navigate('/products')}
          className="text-yellow-600 hover:text-yellow-700 font-semibold"
        >
          Back to Products
        </button>
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

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, quantity + value)
    if (newQuantity <= product.stock) {
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
              {product.images.map((_, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded cursor-pointer transition ${
                    selectedImage === index ? 'ring-2 ring-yellow-600' : ''
                  }`}
                />
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
                    <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.reviews} reviews)</span>
              </div>
              <div className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>
            </div>

            {/* Price */}
            <div className="mb-8 pb-8 border-b">
              <div className="flex items-baseline space-x-3">
                <span className="text-4xl font-bold text-black">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              {product.originalPrice && (
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
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <FiCheck className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
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
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center space-x-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                <FiShoppingCart />
                <span>Add to Cart</span>
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
              <div className="flex justify-between">
                <span className="text-gray-600">SKU:</span>
                <span className="font-semibold">{product.sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category:</span>
                <span className="font-semibold">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Availability:</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock} in stock
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
              <p className="text-gray-700 mb-4">{product.description}</p>
              <ul className="space-y-2 text-gray-700">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <FiCheck className="text-green-600" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div>
              <h3 className="font-semibold text-black mb-4">Specifications</h3>
              <div className="space-y-4">
                {product.specifications.map((spec, index) => (
                  <div key={index} className="flex justify-between py-3 border-b">
                    <span className="text-gray-600">{spec.label}</span>
                    <span className="font-semibold text-black">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <h3 className="font-semibold text-black mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {product.reviews_list.map((review) => (
                  <div key={review.id} className="pb-6 border-b">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-black">{review.author}</p>
                        <div className="flex text-yellow-400 text-sm">
                          {Array.from({ length: 5 }, (_, i) => (
                            <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-16 border-t">
          <h2 className="text-3xl font-bold text-black mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((related) => (
              <div
                key={related.id}
                className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => navigate(`/products/${related.id}`)}
              >
                <div className="h-40 bg-gradient-to-br from-gray-200 to-gray-300" />
                <div className="p-4">
                  <h4 className="font-semibold text-black mb-2">{related.name}</h4>
                  <p className="text-2xl font-bold text-black">${related.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Mock data - Replace with API call
const MOCK_PRODUCT_DETAIL = {
  id: 1,
  name: 'Premium Marble Desk',
  description:
    'An elegant marble top desk that combines luxury with functionality. Crafted with genuine Italian marble and a robust steel frame, this desk is perfect for high-end office spaces and executive environments.',
  category: 'Furniture',
  price: 1299.99,
  originalPrice: 1499.99,
  rating: 4.5,
  reviews: 124,
  sku: 'PMD-001-WHT',
  stock: 15,
  images: ['image1', 'image2', 'image3', 'image4'],
  features: [
    'Genuine Italian marble top surface',
    'Durable steel frame with anti-rust coating',
    'Spacious work surface (160cm x 80cm)',
    'Cable management system',
    'Adjustable foot pads for stability',
    '5-year warranty included',
  ],
  specifications: [
    { label: 'Dimensions', value: '160cm (W) x 80cm (D) x 75cm (H)' },
    { label: 'Material', value: 'Italian Marble & Steel' },
    { label: 'Weight', value: '150 kg' },
    { label: 'Color', value: 'White Marble' },
    { label: 'Assembly', value: 'Professional installation recommended' },
    { label: 'Warranty', value: '5 Years' },
  ],
  reviews_list: [
    {
      id: 1,
      author: 'John Smith',
      rating: 5,
      date: '2 weeks ago',
      comment:
        'Absolutely stunning desk! The marble is beautiful and the quality is exceptional. Worth every penny.',
    },
    {
      id: 2,
      author: 'Sarah Johnson',
      rating: 4,
      date: '1 month ago',
      comment: 'Great desk, though shipping took a bit longer than expected. The product itself is excellent.',
    },
    {
      id: 3,
      author: 'Mike Davis',
      rating: 5,
      date: '2 months ago',
      comment: 'Perfect for my executive office. The marble top feels incredibly luxurious.',
    },
  ],
}

const RELATED_PRODUCTS = [
  { id: 2, name: 'Steel Office Chair', price: 449.99 },
  { id: 3, name: 'Monitor Stand', price: 89.99 },
  { id: 4, name: 'Desk Lamp', price: 199.99 },
  { id: 5, name: 'File Cabinet', price: 299.99 },
]

export default ProductDetailPage
