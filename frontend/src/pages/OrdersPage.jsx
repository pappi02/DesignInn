import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiSearch, FiFilter, FiEye, FiDownload } from 'react-icons/fi'
import { useAuthStore } from '../../stores'

/**
 * OrdersPage - User order history and management
 * Features:
 * - Display all user orders
 * - Order filtering (status, date range)
 * - Order search
 * - Order details view
 * - Download invoice
 * - Order status tracking
 */
function OrdersPage() {
  const navigate = useNavigate()
  const { token } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')

  // Mock orders data
  const [orders] = useState(MOCK_ORDERS)

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = [...orders]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter)
    }

    // Sort
    if (sortBy === 'date-desc') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortBy === 'date-asc') {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortBy === 'total-high') {
      filtered.sort((a, b) => b.total - a.total)
    } else if (sortBy === 'total-low') {
      filtered.sort((a, b) => a.total - b.total)
    }

    return filtered
  }, [orders, searchQuery, statusFilter, sortBy])

  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`)
  }

  const handleDownloadInvoice = (orderId) => {
    // TODO: Implement invoice download
    console.log('Download invoice for order:', orderId)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (!token) {
    navigate('/auth/login')
    return null
  }

  return (
    <div className="bg-white min-h-screen">
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black mb-4">My Orders</h1>
          <p className="text-gray-600">
            You have {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="total-high">Highest Total</option>
            <option value="total-low">Lowest Total</option>
          </select>
        </div>

        {/* Orders List */}
        {filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  {/* Order ID */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order ID</p>
                    <p className="font-semibold text-black">{order.id}</p>
                  </div>

                  {/* Date */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Date</p>
                    <p className="font-semibold text-black">
                      {new Date(order.date).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  {/* Total */}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="font-semibold text-black text-lg">${order.total.toFixed(2)}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-end space-x-2">
                    <button
                      onClick={() => handleViewOrder(order.id)}
                      className="flex-1 flex items-center justify-center space-x-1 bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-800 transition text-sm font-semibold"
                    >
                      <FiEye size={16} />
                      <span>View</span>
                    </button>
                    <button
                      onClick={() => handleDownloadInvoice(order.id)}
                      className="flex items-center justify-center space-x-1 bg-gray-100 text-black py-2 px-3 rounded-lg hover:bg-gray-200 transition text-sm font-semibold"
                    >
                      <FiDownload size={16} />
                    </button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="flex flex-wrap gap-2">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="bg-gray-50 px-3 py-1 rounded text-sm text-gray-700">
                        {item.name} ({item.quantity})
                      </span>
                    ))}
                    {order.items.length > 3 && (
                      <span className="bg-gray-50 px-3 py-1 rounded text-sm text-gray-700">
                        +{order.items.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-4">No orders found</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Start Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ORD-001234',
    date: '2024-01-15',
    status: 'completed',
    total: 1599.99,
    items: [
      { name: 'Premium Marble Desk', quantity: 1 },
      { name: 'Ergonomic Office Chair', quantity: 1 },
    ],
  },
  {
    id: 'ORD-001233',
    date: '2024-01-10',
    status: 'completed',
    total: 349.95,
    items: [
      { name: 'Abstract Wall Art Set', quantity: 1 },
      { name: 'Ceramic Vase Collection', quantity: 1 },
    ],
  },
  {
    id: 'ORD-001232',
    date: '2024-01-05',
    status: 'processing',
    total: 249.99,
    items: [{ name: 'Modern LED Pendant Light', quantity: 1 }],
  },
  {
    id: 'ORD-001231',
    date: '2023-12-28',
    status: 'completed',
    total: 879.99,
    items: [
      { name: 'Luxury Sectional Sofa', quantity: 1 },
      { name: 'Coffee Table - Wood', quantity: 1 },
    ],
  },
  {
    id: 'ORD-001230',
    date: '2023-12-20',
    status: 'cancelled',
    total: 199.99,
    items: [{ name: 'Minimalist Wall Mirror', quantity: 1 }],
  },
]

export default OrdersPage
