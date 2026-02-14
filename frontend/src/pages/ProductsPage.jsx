import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore } from '../../stores'

/**
 * ProductsPage - Product catalog with filtering and search
 * Features:
 * - Product grid with responsive layout
 * - Category filtering
 * - Price range filtering
 * - Rating filtering
 * - Search functionality
 * - Sorting options
 * - Pagination
 * - Add to cart functionality
 */
function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAuthStore()

  // Filter states
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [products] = useState(MOCK_PRODUCTS) // Replace with API call
  const [loading, setLoading] = useState(false)

  // Search and filter values from URL
  const searchQuery = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || 'all'
  const selectedSort = searchParams.get('sort') || 'name'
  const priceRange = searchParams.get('price') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1')

  // Filter and search products
  const filteredProducts = useMemo(() => {
    let filtered = [...products]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    // Price filter
    if (priceRange !== 'all') {
      filtered = filtered.filter((p) => {
        const [min, max] = priceRange.split('-').map(Number)
        return p.price >= min && (max ? p.price <= max : true)
      })
    }

    // Sort
    if (selectedSort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price)
    } else if (selectedSort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price)
    } else if (selectedSort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating)
    } else if (selectedSort === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return filtered
  }, [products, searchQuery, selectedCategory, priceRange, selectedSort])

  // Pagination
  const itemsPerPage = 12
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleSearch = (value) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('search', value)
    } else {
      newParams.delete('search')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleCategoryChange = (category) => {
    const newParams = new URLSearchParams(searchParams)
    if (category !== 'all') {
      newParams.set('category', category)
    } else {
      newParams.delete('category')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
    setMobileFilterOpen(false)
  }

  const handlePriceChange = (range) => {
    const newParams = new URLSearchParams(searchParams)
    if (range !== 'all') {
      newParams.set('price', range)
    } else {
      newParams.delete('price')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams)
    if (sort !== 'name') {
      newParams.set('sort', sort)
    } else {
      newParams.delete('sort')
    }
    newParams.set('page', '1')
    setSearchParams(newParams)
  }

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', page)
    setSearchParams(newParams)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleAddToCart = (product) => {
    toast.success(`${product.name} added to cart!`)
    // TODO: Integrate with cart store
  }

  const handleViewProduct = (productId) => {
    navigate(`/products/${productId}`)
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-black mb-4">Products</h1>
        <p className="text-gray-600">
          Showing {paginatedProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to{' '}
          {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2">
            <FiSearch className="text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters - Desktop */}
          <div className="hidden lg:block">
            <FilterPanel
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceOptions={PRICE_OPTIONS}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              sortOptions={SORT_OPTIONS}
              selectedSort={selectedSort}
              onSortChange={handleSortChange}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex justify-between items-center">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg"
              >
                <FiFilter size={20} />
                <span>Filters</span>
              </button>
              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Panel */}
            {mobileFilterOpen && (
              <div className="lg:hidden mb-6 bg-gray-50 p-4 rounded-lg">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="absolute top-4 right-4"
                >
                  <FiX size={24} />
                </button>
                <FilterPanel
                  categories={CATEGORIES}
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                  priceOptions={PRICE_OPTIONS}
                  priceRange={priceRange}
                  onPriceChange={handlePriceChange}
                  sortOptions={SORT_OPTIONS}
                  selectedSort={selectedSort}
                  onSortChange={handleSortChange}
                />
              </div>
            )}

            {/* Products Grid */}
            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onViewDetails={handleViewProduct}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-12">
                    {currentPage > 1 && (
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Previous
                      </button>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          page === currentPage
                            ? 'bg-black text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {currentPage < totalPages && (
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Next
                      </button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">No products found matching your filters.</p>
                <button
                  onClick={() => {
                    setSearchParams({})
                    setMobileFilterOpen(false)
                  }}
                  className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * FilterPanel Component - Sidebar filters
 */
function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  priceOptions,
  priceRange,
  onPriceChange,
  sortOptions,
  selectedSort,
  onSortChange,
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.value}
                checked={selectedCategory === category.value}
                onChange={() => onCategoryChange(category.value)}
                className="w-4 h-4 text-yellow-600"
              />
              <span className="ml-2 text-gray-700">{category.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Price Range</h3>
        <div className="space-y-2">
          {priceOptions.map((option) => (
            <label key={option.value} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="price"
                value={option.value}
                checked={priceRange === option.value}
                onChange={() => onPriceChange(option.value)}
                className="w-4 h-4 text-yellow-600"
              />
              <span className="ml-2 text-gray-700">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div>
        <h3 className="text-lg font-semibold text-black mb-4">Sort By</h3>
        <select
          value={selectedSort}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

/**
 * ProductCard Component - Individual product display
 */
function ProductCard({ product, onViewDetails, onAddToCart }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div
        className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer group"
        onClick={() => onViewDetails(product.id)}
      >
        <div className="text-center group-hover:scale-110 transition-transform">
          <p className="text-gray-500">{product.name}</p>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
          {product.category}
        </div>

        {/* Name */}
        <h3
          className="font-semibold text-black mb-2 cursor-pointer hover:text-yellow-600 transition"
          onClick={() => onViewDetails(product.id)}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-black">${product.price.toFixed(2)}</p>
          {product.originalPrice && (
            <p className="text-sm text-gray-500 line-through">${product.originalPrice.toFixed(2)}</p>
          )}
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onViewDetails(product.id)}
            className="w-full bg-white border-2 border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition font-semibold"
          >
            View Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock data - Replace with API call
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Premium Marble Desk',
    description: 'Elegant marble top desk with steel frame',
    category: 'furniture',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.5,
    reviews: 124,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: 2,
    name: 'Modern LED Pendant Light',
    description: 'Contemporary pendant lighting for any space',
    category: 'lighting',
    price: 249.99,
    rating: 4.8,
    reviews: 89,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Minimalist Wall Mirror',
    description: 'Sleek wall-mounted mirror with frame',
    category: 'decor',
    price: 179.99,
    rating: 4.3,
    reviews: 56,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    id: 4,
    name: 'Wooden Flooring Sample Pack',
    description: 'Premium hardwood samples with 4 options',
    category: 'flooring',
    price: 89.99,
    rating: 4.6,
    reviews: 42,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: 5,
    name: 'Luxury Sectional Sofa',
    description: 'Spacious sectional with premium upholstery',
    category: 'furniture',
    price: 2499.99,
    originalPrice: 2999.99,
    rating: 4.7,
    reviews: 203,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
  {
    id: 6,
    name: 'Crystal Chandelier',
    description: 'Elegant crystal chandelier for dining rooms',
    category: 'lighting',
    price: 599.99,
    rating: 5.0,
    reviews: 78,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: 7,
    name: 'Abstract Wall Art Set',
    description: 'Set of 3 modern abstract paintings',
    category: 'decor',
    price: 349.99,
    originalPrice: 449.99,
    rating: 4.4,
    reviews: 67,
    createdAt: new Date(),
  },
  {
    id: 8,
    name: 'Luxury Tile Collection',
    description: 'Premium porcelain tiles in multiple finishes',
    category: 'flooring',
    price: 129.99,
    rating: 4.5,
    reviews: 93,
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
  },
  {
    id: 9,
    name: 'Ergonomic Office Chair',
    description: 'Comfortable chair with lumbar support',
    category: 'furniture',
    price: 449.99,
    rating: 4.6,
    reviews: 156,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: 10,
    name: 'Smart Ceiling Light',
    description: 'IoT enabled ceiling light with color options',
    category: 'lighting',
    price: 199.99,
    rating: 4.2,
    reviews: 45,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
  },
  {
    id: 11,
    name: 'Decorative Floor Lamp',
    description: 'Modern arc floor lamp with dimming',
    category: 'lighting',
    price: 279.99,
    originalPrice: 349.99,
    rating: 4.7,
    reviews: 112,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: 12,
    name: 'Ceramic Vase Collection',
    description: 'Set of 4 handcrafted ceramic vases',
    category: 'decor',
    price: 199.99,
    rating: 4.9,
    reviews: 34,
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
  },
  {
    id: 13,
    name: 'Coffee Table - Wood',
    description: 'Rustic wooden coffee table with storage',
    category: 'furniture',
    price: 399.99,
    rating: 4.5,
    reviews: 78,
    createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
  },
  {
    id: 14,
    name: 'Vinyl Flooring Roll',
    description: 'Waterproof vinyl with modern design',
    category: 'flooring',
    price: 79.99,
    rating: 4.3,
    reviews: 61,
    createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
  },
]

const CATEGORIES = [
  { label: 'All Categories', value: 'all' },
  { label: 'Furniture', value: 'furniture' },
  { label: 'Lighting', value: 'lighting' },
  { label: 'Decor & Accessories', value: 'decor' },
  { label: 'Flooring', value: 'flooring' },
]

const PRICE_OPTIONS = [
  { label: 'All Prices', value: 'all' },
  { label: 'Under $100', value: '0-100' },
  { label: '$100 - $500', value: '100-500' },
  { label: '$500 - $1000', value: '500-1000' },
  { label: '$1000+', value: '1000-999999' },
]

const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Price: Low to High', value: 'price-low' },
  { label: 'Price: High to Low', value: 'price-high' },
  { label: 'Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
]

export default ProductsPage
