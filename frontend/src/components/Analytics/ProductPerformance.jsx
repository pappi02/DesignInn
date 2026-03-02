/**
 * ProductPerformance Component
 * Displays top performing products with sales metrics
 * Features:
 * - Product rankings
 * - Sales and revenue metrics
 * - Performance trends
 * - Responsive table/card layout
 */

import { useState, useEffect } from 'react'
import { FiTrendingUp, FiTrendingDown, FiLoader } from 'react-icons/fi'
import { analyticsAPI } from '../../api'
import { toast } from 'react-toastify'

/**
 * ProductPerformance Component
 * @param {Object} props
 * @param {string} props.period - Time period (7, 30, 90 days)
 * @param {number} props.limit - Number of products to show
 */
function ProductPerformance({ period = '30', limit = 10 }) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProductPerformance = async () => {
      setIsLoading(true)
      try {
        const response = await analyticsAPI.getProductPerformance({
          period,
          limit,
        })

        if (response.success && response.data) {
          setProducts(response.data)
        } else {
          // Mock data for demo
          setProducts(
            Array.from({ length: limit }, (_, i) => ({
              id: i + 1,
              name: `Product ${i + 1}`,
              sku: `SKU-${String(i + 1).padStart(5, '0')}`,
              sales: Math.floor(Math.random() * 500) + 50,
              revenue: Math.floor(Math.random() * 50000) + 5000,
              trend: Math.random() > 0.5 ? 1 : -1,
              trendPercent: Math.floor(Math.random() * 30) + 5,
            }))
          )
        }
      } catch (error) {
        console.error('Error fetching product performance:', error)
        toast.error('Failed to load product performance')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductPerformance()
  }, [period, limit])

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-center py-12">
          <FiLoader className="animate-spin text-blue-600" size={32} />
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 text-center py-8">No products data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Products</h3>
        <p className="text-sm text-gray-500 mt-1">Last {period} days</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">
                SKU
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                Sales
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700">
                Revenue
              </th>
              <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">
                Trend
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr
                key={product.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {index + 1}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  {product.sales}
                </td>
                <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                  ${product.revenue.toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-1">
                    {product.trend > 0 ? (
                      <>
                        <FiTrendingUp className="text-green-500" size={16} />
                        <span className="text-sm font-semibold text-green-500">
                          +{product.trendPercent}%
                        </span>
                      </>
                    ) : (
                      <>
                        <FiTrendingDown className="text-red-500" size={16} />
                        <span className="text-sm font-semibold text-red-500">
                          -{product.trendPercent}%
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {products.map((product, index) => (
          <div key={product.id} className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm flex-shrink-0">
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.sku}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Sales</p>
                <p className="font-semibold text-gray-900">{product.sales}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Revenue</p>
                <p className="font-semibold text-gray-900">
                  ${(product.revenue / 1000).toFixed(1)}k
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Trend</p>
                <div className="flex items-center gap-1">
                  {product.trend > 0 ? (
                    <>
                      <FiTrendingUp className="text-green-500" size={14} />
                      <span className="text-sm font-semibold text-green-500">
                        +{product.trendPercent}%
                      </span>
                    </>
                  ) : (
                    <>
                      <FiTrendingDown className="text-red-500" size={14} />
                      <span className="text-sm font-semibold text-red-500">
                        -{product.trendPercent}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductPerformance
