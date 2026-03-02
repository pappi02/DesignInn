import { useState, useEffect, useMemo, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { FiFilter, FiSearch, FiX, FiChevronDown } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore } from '../../stores'
import { productsAPI } from '../../api'
import { useAPIData } from '../../hooks/useAPILoading'
import { LoadingSkeleton, LoadingSpinner } from '../../components/Loading/GlobalLoadingIndicator'

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

  // Search and filter values from URL
  const searchQuery = searchParams.get('search') || ''
  const selectedCategory = searchParams.get('category') || 'all'
  const selectedSort = searchParams.get('sort') || 'created_at'
  const priceRange = searchParams.get('price') || 'all'
  const currentPage = parseInt(searchParams.get('page') || '1')

  // Parse price range for API
  const getPriceParams = useCallback(() => {
    if (priceRange === 'all') return { minPrice: '', maxPrice: '' }
    const [min, max] = priceRange.split('-').map(Number)
    return {
      minPrice: min,
      maxPrice: max === 999999 ? '' : max,
    }
  }, [priceRange])

  // Fetch products from API
  const { data: apiResponse, isLoading, error, refetch } = useAPIData(
    () =>
      productsAPI.list({
        page: currentPage,
        limit: 12,
        search: searchQuery,
        category: selectedCategory !== 'all' ? selectedCategory : '',
        sortBy: selectedSort,
        ...getPriceParams(),
      }),
    [currentPage, searchQuery, selectedCategory, selectedSort, priceRange]
  )

  // Extract products and pagination info from API response
  const products = apiResponse?.data || apiResponse || []
  const totalCount = apiResponse?.totalCount || 0
  const totalPages = apiResponse?.totalPages || 1
  const paginatedProducts = Array.isArray(products) ? products : []

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
        {error ? (
          <p className="text-red-600">Error loading products. Please try again.</p>
        ) : (
          <p className="text-gray-600">
            {isLoading
              ? 'Loading products...'
              : `Showing ${paginatedProducts.length > 0 ? (currentPage - 1) * 12 + 1 : 0} to ${Math.min(currentPage * 12, totalCount)} of ${totalCount} products`}
          </p>
        )}
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
            {isLoading ? (
              <div>
                <LoadingSkeleton rows={2} columns={3} />
                <div className="mt-4">
                  <LoadingSkeleton rows={1} columns={5} />
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-red-600 text-lg mb-4">
                  Failed to load products. Please try again.
                </p>
                <button
                  onClick={() => refetch()}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Retry
                </button>
              </div>
            ) : paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id || product.slug}
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

                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
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
  // Handle both mock data and API data
  const productId = product.id || product.slug
  const productName = product.name || product.title || 'Unnamed Product'
  const price = product.price || 0
  const rating = product.rating || product.average_rating || 0
  const reviews = product.reviews || product.review_count || 0
  const category = product.category || 'General'
  const description = product.description || ''

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition">
      {/* Image */}
      <div
        className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center cursor-pointer group"
        onClick={() => onViewDetails(productId)}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
          />
        ) : (
          <div className="text-center group-hover:scale-110 transition-transform">
            <p className="text-gray-500 text-sm">{productName}</p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category Badge */}
        <div className="inline-block bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded mb-2">
          {typeof category === 'object' ? category.name : category}
        </div>

        {/* Name */}
        <h3
          className="font-semibold text-black mb-2 cursor-pointer hover:text-yellow-600 transition line-clamp-2"
          onClick={() => onViewDetails(productId)}
        >
          {productName}
        </h3>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-3">
          <div className="flex text-yellow-400 text-sm">
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i}>{i < Math.round(rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-sm text-gray-600">({reviews})</span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <p className="text-2xl font-bold text-black">${parseFloat(price).toFixed(2)}</p>
        </div>

        {/* Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onViewDetails(productId)}
            className="w-full bg-white border-2 border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition font-semibold text-sm"
          >
            View Details
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold text-sm"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

// Mock data - Replace with API call
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
