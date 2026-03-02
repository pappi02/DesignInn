/**
 * AdminOrdersPage Component
 * Manage orders: list, filter, search, update status, view details
 * Features:
 * - Orders table with search and filtering
 * - Status management
 * - Order details modal
 * - Tracking integration
 */

import { useState, useEffect } from 'react'
import { FiEye, FiTruck, FiX, FiSearch, FiFilter, FiDownload } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { ordersAPI } from '../../api'

/**
 * AdminOrdersPage Component
 */
function AdminOrdersPage() {
  const [orders, setOrders] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const statuses = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled']

  // Fetch orders on mount
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true)
      try {
        const response = await ordersAPI.list({
          page: 1,
          limit: 100,
        })
        if (response.success) {
          setOrders(response.data || [])
        } else {
          toast.error('Failed to load orders')
          setOrders([])
        }
      } catch (error) {
        toast.error('Error loading orders')
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [])

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.id && order.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customer_name &&
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customer_email &&
        order.customer_email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailModalOpen(true)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await ordersAPI.updateStatus(orderId, {
        status: newStatus,
      })

      if (response.success) {
        setOrders(
          orders.map((o) =>
            o.id === orderId
              ? {
                  ...o,
                  status: newStatus,
                  updated_at: new Date().toLocaleDateString(),
                }
              : o
          )
        )

        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({
            ...selectedOrder,
            status: newStatus,
            updated_at: new Date().toLocaleDateString(),
          })
        }

        toast.success(`Order status updated to ${newStatus}`)
      } else {
        toast.error(response.error || 'Failed to update order')
      }
    } catch (error) {
      toast.error('Error updating order')
    }
  }

  const handleMarkShipped = async (orderId) => {
    const order = orders.find((o) => o.id === orderId)
    if (order && order.status !== 'shipped' && order.status !== 'delivered') {
      await handleUpdateStatus(orderId, 'shipped')
    }
  }

  const handleCancelOrder = async (orderId) => {
    const order = orders.find((o) => o.id === orderId)
    if (order && order.status !== 'delivered' && order.status !== 'cancelled') {
      if (window.confirm('Are you sure you want to cancel this order?')) {
        await handleUpdateStatus(orderId, 'cancelled')
      }
    }
  }

  const handleDownloadInvoice = (orderId) => {
    toast.info(`Invoice for ${orderId} will be downloaded`)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'pending').length
  const totalRevenue = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (parseFloat(o.total_amount) || 0), 0)

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-black">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Pending Orders</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-black">Orders Management</h1>
        <p className="text-gray-600 mt-1">
          {isLoading ? 'Loading...' : `${filteredOrders.length} orders found`}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <FiSearch className="text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <FiFilter size={18} className="text-gray-600" />
          <div className="flex flex-wrap gap-2">
            {statuses.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg transition font-semibold text-sm ${
                  statusFilter === status
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status === 'all' ? 'All Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Items</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Total</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm font-mono font-semibold text-black">{order.id}</td>
                    <td className="py-4 px-6 text-sm">
                      <div>
                        <p className="font-semibold text-black">{order.customer_name || 'N/A'}</p>
                        <p className="text-xs text-gray-600">{order.customer_email || 'N/A'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {order.items_count || order.order_items?.length || 0} items
                    </td>
                    <td className="py-4 px-6 text-sm font-bold text-black">
                      ${parseFloat(order.total_amount || 0).toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View details"
                        >
                          <FiEye size={16} />
                        </button>

                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleMarkShipped(order.id)}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded transition"
                            title="Mark as shipped"
                          >
                            <FiTruck size={16} />
                          </button>
                        )}

                        {order.status !== 'cancelled' && order.status !== 'delivered' && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Cancel order"
                          >
                            <FiX size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition"
                          title="Download invoice"
                        >
                          <FiDownload size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onStatusChange={handleUpdateStatus}
        />
      )}
    </div>
  )
}

/**
 * OrderDetailsModal Component
 */
function OrderDetailsModal({ order, isOpen, onClose, onStatusChange }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-96 overflow-y-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        {/* Order Header */}
        <div className="grid grid-cols-2 gap-6 border-b border-gray-200 pb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Order ID</p>
            <p className="font-mono font-bold text-black text-lg">{order.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Status</p>
            <select
              value={order.status}
              onChange={(e) => onStatusChange(order.id, e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-600 font-semibold"
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Customer Info */}
        <div>
          <h3 className="font-semibold text-black text-lg mb-3">Customer Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-black font-semibold">{order.customer_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-black">{order.customer_email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-black">{order.customer_phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Order Date</p>
              <p className="text-black">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <div className="flex justify-between">
            <p className="text-gray-700">Subtotal:</p>
            <p className="font-semibold text-black">${(parseFloat(order.total_amount) * 0.9).toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-700">Shipping:</p>
            <p className="font-semibold text-black">$10.00</p>
          </div>
          <div className="flex justify-between border-t border-gray-300 pt-3">
            <p className="font-semibold text-black">Total:</p>
            <p className="font-bold text-black text-lg">${parseFloat(order.total_amount || 0).toFixed(2)}</p>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default AdminOrdersPage
