/**
 * AdminDashboard Component
 * Main admin dashboard with metrics, charts, and recent activity
 * Features:
 * - KPI cards (revenue, orders, users, products)
 * - Chart for sales trends
 * - Recent orders list
 * - Quick actions
 */

import { useState, useEffect } from 'react'
import { FiTrendingUp, FiShoppingCart, FiUsers, FiPackage, FiArrowRight } from 'react-icons/fi'
import { useAuthStore } from '../../stores'
import { ordersAPI, settingsAPI } from '../../api'
import { toast } from 'react-toastify'

/**
 * Admin Dashboard Component
 */
function AdminDashboard() {
  const { user } = useAuthStore()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    revenueChange: 0,
    totalOrders: 0,
    ordersChange: 0,
    totalUsers: 0,
    usersChange: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    avgOrderValue: 0,
    conversionRate: 0,
    avgRating: 0,
  })
  const [chartData, setChartData] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true)
      try {
        // Fetch recent orders
        const ordersResponse = await ordersAPI.list({ page: 1, limit: 5 })
        if (ordersResponse.success && ordersResponse.data) {
          const orders = ordersResponse.data
          setRecentOrders(orders)

          // Calculate stats from orders
          const totalRevenue = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
          const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0
          
          setStats((prev) => ({
            ...prev,
            totalRevenue: Math.round(totalRevenue),
            totalOrders: orders.length,
            avgOrderValue: avgOrderValue,
          }))

          // Generate chart data from orders (last 7 days)
          const chartByDay = {}
          orders.forEach((order) => {
            const date = new Date(order.created_at)
            const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][date.getDay()]
            if (!chartByDay[dayName]) {
              chartByDay[dayName] = 0
            }
            chartByDay[dayName] += order.total_amount || 0
          })

          const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
          const generatedChartData = daysOfWeek.map((day) => ({
            day,
            sales: chartByDay[day] || 0,
          }))
          setChartData(generatedChartData)
        } else {
          toast.error('Failed to load orders')
        }

        // Fetch system stats
        const statsResponse = await settingsAPI.getSystemStats()
        if (statsResponse.success && statsResponse.data) {
          const systemStats = statsResponse.data
          setStats((prev) => ({
            ...prev,
            revenueChange: systemStats.revenueChange || 0,
            ordersChange: systemStats.ordersChange || 0,
            totalUsers: systemStats.totalUsers || 0,
            usersChange: systemStats.usersChange || 0,
            totalProducts: systemStats.totalProducts || 0,
            lowStockProducts: systemStats.lowStockProducts || 0,
            conversionRate: systemStats.conversionRate || 0,
            avgRating: systemStats.avgRating || 0,
          }))
        }
      } catch (error) {
        toast.error('Error loading dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-12 text-gray-600">
          <p>Loading dashboard data...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-black to-gray-800 rounded-lg p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Welcome back, {user?.first_name || 'Admin'}! 👋</h3>
            <p className="text-gray-300">Here's what's happening with your business today.</p>
          </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon={FiTrendingUp}
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          change={`${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}% from last month`}
          trend={stats.revenueChange >= 0 ? 'up' : 'down'}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <KPICard
          icon={FiShoppingCart}
          label="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          change={`${stats.ordersChange} new orders`}
          trend="up"
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <KPICard
          icon={FiUsers}
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          change={`+${stats.usersChange} new users`}
          trend="up"
          bgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
        <KPICard
          icon={FiPackage}
          label="Products"
          value={stats.totalProducts.toLocaleString()}
          change={`${stats.lowStockProducts} low stock`}
          trend="warning"
          bgColor="bg-amber-50"
          iconColor="text-amber-600"
        />
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-black mb-4">Sales Trends (Last 7 Days)</h3>
          {chartData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-gray-600">
              <p>No sales data available</p>
            </div>
          ) : (
            <div className="h-64 flex items-end justify-between gap-2">
              {chartData.map((data, idx) => (
                <div key={idx} className="flex-1 group cursor-pointer">
                  <div
                    className="bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-lg transition-all group-hover:from-yellow-700 group-hover:to-yellow-500 relative"
                    style={{ height: `${chartData.length > 0 && Math.max(...chartData.map(d => d.sales)) > 0 ? (data.sales / Math.max(...chartData.map(d => d.sales)) * 100) : 5}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                      ${data.sales}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">{data.day}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Average Order Value */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-2">Avg Order Value</p>
            <p className="text-2xl font-bold text-black">${stats.avgOrderValue}</p>
            <p className="text-xs text-green-600 mt-2">↑ 5.2% increase</p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-2">Conversion Rate</p>
            <p className="text-2xl font-bold text-black">{stats.conversionRate}%</p>
            <p className="text-xs text-green-600 mt-2">↑ 1.2% increase</p>
          </div>

          {/* Customer Satisfaction */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-600 mb-2">Avg Rating</p>
            <p className="text-2xl font-bold text-black">{stats.avgRating}/5</p>
            <div className="flex mt-2">
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.floor(stats.avgRating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                  ★
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-black">Recent Orders</h3>
          <a href="/admin/orders" className="flex items-center space-x-1 text-yellow-600 hover:text-yellow-700 font-semibold text-sm">
            <span>View All</span>
            <FiArrowRight size={16} />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-600">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-semibold text-black">#{order.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-700">{order.customer_name}</td>
                    <td className="py-3 px-4 text-sm font-semibold text-black">${order.total_amount}</td>
                    <td className="py-3 px-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{new Date(order.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
        </>
      )}
    </div>
  )
}

/**
 * KPI Card Component
 */
function KPICard({ icon: Icon, label, value, change, trend, bgColor, iconColor }) {
  return (
    <div className={`${bgColor} border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 font-medium">{label}</p>
          <p className="text-3xl font-bold text-black mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg bg-white ${iconColor}`}>
          <Icon size={24} />
        </div>
      </div>
      <p className={`text-xs font-semibold ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-amber-600'}`}>
        {change}
      </p>
    </div>
  )
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-700'
    case 'Pending':
      return 'bg-yellow-100 text-yellow-700'
    case 'Processing':
      return 'bg-blue-100 text-blue-700'
    case 'Cancelled':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

// Mock data - replaced with API calls above
// const MOCK_STATS = {...}
// const MOCK_CHART_DATA = [...]
// const MOCK_RECENT_ORDERS = [...]

export default AdminDashboard
