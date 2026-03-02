/**
 * ExportData Component
 * Provides export functionality for analytics data
 * Features:
 * - Export to CSV
 * - Export to PDF
 * - Export to JSON
 * - Date range parameters
 */

import { useState } from 'react'
import { FiDownload, FiChevronDown } from 'react-icons/fi'
import { analyticsAPI } from '../../api'
import { toast } from 'react-toastify'

/**
 * ExportData Component
 * @param {Object} props
 * @param {string} props.startDate - Start date for export (YYYY-MM-DD)
 * @param {string} props.endDate - End date for export (YYYY-MM-DD)
 * @param {string} props.exportType - Type of export (metrics, revenue, orders, users, all)
 */
function ExportData({ startDate = '', endDate = '', exportType = 'all' }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleExport = async (format) => {
    setIsLoading(true)
    try {
      const result = await analyticsAPI.exportData(format, {
        startDate,
        endDate,
        type: exportType,
      })

      if (result.success) {
        // Handle file download
        if (format === 'pdf') {
          const url = window.URL.createObjectURL(result.data)
          const link = document.createElement('a')
          link.href = url
          link.download = `analytics-${new Date().toISOString().split('T')[0]}.pdf`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } else if (format === 'csv') {
          const csv = result.data
          if (typeof csv === 'string') {
            const blob = new Blob([csv], { type: 'text/csv' })
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        } else if (format === 'json') {
          const json = JSON.stringify(result.data, null, 2)
          const blob = new Blob([json], { type: 'application/json' })
          const url = window.URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }

        toast.success(`Exported to ${format.toUpperCase()}`)
        setIsOpen(false)
      } else {
        toast.error(result.error || 'Export failed')
      }
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export data')
    } finally {
      setIsLoading(false)
    }
  }

  const exportFormats = [
    { label: 'CSV', value: 'csv', icon: '📄', description: 'Excel compatible' },
    { label: 'PDF', value: 'pdf', icon: '📑', description: 'Print friendly' },
    { label: 'JSON', value: 'json', icon: '{}', description: 'Raw data' },
  ]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-all disabled:bg-gray-400"
      >
        <FiDownload size={18} />
        <span>Export</span>
        <FiChevronDown size={16} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-3 border-b border-gray-200">
            <p className="text-sm font-semibold text-gray-700">Export Analytics</p>
            {startDate && endDate && (
              <p className="text-xs text-gray-500 mt-1">
                {startDate} to {endDate}
              </p>
            )}
          </div>

          <div className="p-2">
            {exportFormats.map((format) => (
              <button
                key={format.value}
                onClick={() => handleExport(format.value)}
                disabled={isLoading}
                className="w-full p-3 text-left hover:bg-gray-50 rounded-md transition-all disabled:opacity-50"
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{format.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{format.label}</p>
                    <p className="text-xs text-gray-500">{format.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="px-3 py-2 border-t border-gray-200">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-sm text-gray-600 hover:text-gray-900 py-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default ExportData
