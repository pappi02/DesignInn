/**
 * AdminProductsPage Component
 * Manage products: list, create, edit, delete, bulk actions
 * Features:
 * - Product table with search and filtering
 * - Bulk edit and delete actions
 * - Create/edit modal forms
 * - Stock management
 * - Featured/active status toggle
 */

import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiChevronDown, FiStar, FiEye } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { productsAPI } from '../../api'

/**
 * AdminProductsPage Component
 */
function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [stockFilter, setStockFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState(EMPTY_PRODUCT)
  const [isLoading, setIsLoading] = useState(true)
  const [categories, setCategories] = useState([])

  const stockOptions = ['all', 'in-stock', 'low-stock', 'out-of-stock']

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch products
        const productsRes = await productsAPI.list({
          page: 1,
          limit: 100,
        })

        if (productsRes.success) {
          setProducts(productsRes.data || [])
        } else {
          toast.error('Failed to load products')
          setProducts([])
        }

        // Fetch categories
        const categoriesRes = await productsAPI.getCategories()
        if (categoriesRes.success) {
          setCategories(['all', ...categoriesRes.data.map((c) => c.name)])
        }
      } catch (error) {
        toast.error('Error loading products')
        setProducts([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    const matchesStock =
      stockFilter === 'all' ||
      (stockFilter === 'in-stock' && product.stock > 10) ||
      (stockFilter === 'low-stock' && product.stock > 0 && product.stock <= 10) ||
      (stockFilter === 'out-of-stock' && product.stock === 0)

    return matchesSearch && matchesCategory && matchesStock
  })

  const handleAddProduct = () => {
    setEditingProduct(null)
    setFormData(EMPTY_PRODUCT)
    setIsModalOpen(true)
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData(product)
    setIsModalOpen(true)
  }

  const handleSaveProduct = async () => {
    if (!formData.name || !formData.sku || !formData.price) {
      toast.error('Please fill all required fields')
      return
    }

    try {
      if (editingProduct) {
        const response = await productsAPI.update(editingProduct.slug, formData)
        if (response.success) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? formData : p)))
          toast.success('Product updated successfully!')
        } else {
          toast.error(response.error || 'Failed to update product')
        }
      } else {
        const response = await productsAPI.create(formData)
        if (response.success) {
          setProducts([...products, response.data])
          toast.success('Product created successfully!')
        } else {
          toast.error(response.error || 'Failed to create product')
        }
      }

      setIsModalOpen(false)
    } catch (error) {
      toast.error('Error saving product')
    }
  }

  const handleDeleteProduct = async (id, slug) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await productsAPI.delete(slug)
        if (response.success) {
          setProducts(products.filter((p) => p.id !== id))
          toast.success('Product deleted successfully!')
        } else {
          toast.error(response.error || 'Failed to delete product')
        }
      } catch (error) {
        toast.error('Error deleting product')
      }
    }
  }

  const handleToggleFeatured = async (id, slug) => {
    try {
      const response = await productsAPI.toggleFeatured(slug)
      if (response.success) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, featured: !p.featured } : p
          )
        )
        toast.success('Product featured status updated!')
      } else {
        toast.error(response.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Error updating product')
    }
  }

  const handleToggleActive = async (id, slug) => {
    try {
      const response = await productsAPI.toggleStatus(slug)
      if (response.success) {
        setProducts(
          products.map((p) =>
            p.id === id ? { ...p, active: !p.active } : p
          )
        )
        toast.success('Product status updated!')
      } else {
        toast.error(response.error || 'Failed to update product')
      }
    } catch (error) {
      toast.error('Error updating product')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Products Management</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `${filteredProducts.length} products found`}
          </p>
        </div>
        <button
          onClick={handleAddProduct}
          disabled={isLoading}
          className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
        >
          <FiPlus size={20} />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <FiSearch className="text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by product name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Category and Stock Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <FiFilter size={18} className="text-gray-600" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            {stockOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt === 'all'
                  ? 'All Stock Levels'
                  : opt === 'in-stock'
                  ? 'In Stock (>10)'
                  : opt === 'low-stock'
                  ? 'Low Stock (1-10)'
                  : 'Out of Stock'}
              </option>
            ))}
          </select>

          <div className="text-sm text-gray-600 py-2">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Product</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">SKU</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Category</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Price</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Stock</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center space-x-3">
                        <img
                          src={product.image || 'https://via.placeholder.com/40'}
                          alt={product.name}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold text-black">{product.name}</p>
                          <p className="text-xs text-gray-600">{product.description || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700 font-mono">{product.sku || '-'}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{product.category || '-'}</td>
                    <td className="py-4 px-6 text-sm font-semibold text-black">${product.price}</td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 10
                            ? 'bg-green-100 text-green-700'
                            : product.stock > 0
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleToggleFeatured(product.id, product.slug)}
                          className={`p-2 rounded transition ${
                            product.featured
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                          }`}
                          title="Toggle featured"
                        >
                          <FiStar size={16} />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id, product.slug)}
                          className={`p-2 rounded transition ${
                            product.active
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                          }`}
                          title="Toggle active"
                        >
                          <FiEye size={16} />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.slug)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add/Edit Product */}
      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveProduct}
          onClose={() => setIsModalOpen(false)}
          isEdit={!!editingProduct}
        />
      )}
    </div>
  )
}

/**
 * ProductModal Component
 */
function ProductModal({ isOpen, formData, setFormData, onSave, onClose, isEdit }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-4">
        <h2 className="text-2xl font-bold text-black">{isEdit ? 'Edit Product' : 'Add Product'}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Product Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">SKU *</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="e.g., SKU-001"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Price *</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Stock</label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              <option value="">Select category</option>
              <option value="Logo Design">Logo Design</option>
              <option value="Branding">Branding</option>
              <option value="Web Design">Web Design</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>
        </div>

        <div className="flex space-x-4 pt-4">
          <button
            onClick={onSave}
            className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
          >
            {isEdit ? 'Update' : 'Create'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// Empty product template
const EMPTY_PRODUCT = {
  id: null,
  name: '',
  sku: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  slug: '',
  image: '',
  featured: false,
  active: true,
}

export default AdminProductsPage
