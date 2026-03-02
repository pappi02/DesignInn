/**
 * DateRangeFilter Component
 * Allows users to select custom date ranges for analytics
 * Features:
 * - Preset ranges (Today, This Week, This Month, etc.)
 * - Custom date picker
 * - Responsive design
 */

import { useState } from 'react'
import { FiCalendar, FiChevronDown } from 'react-icons/fi'

/**
 * DateRangeFilter Component
 * @param {Object} props
 * @param {Function} props.onRangeChange - Callback when range changes: (startDate, endDate)
 * @param {string} props.defaultRange - Default range (today, week, month, quarter, year, custom)
 */
function DateRangeFilter({ onRangeChange, defaultRange = 'month' }) {
  const today = new Date()
  const [selectedRange, setSelectedRange] = useState(defaultRange)
  const [showCustom, setShowCustom] = useState(false)
  const [customStart, setCustomStart] = useState('')
  const [customEnd, setCustomEnd] = useState('')

  const getRangeDate = (range) => {
    const end = new Date(today)
    const start = new Date(today)

    switch (range) {
      case 'today':
        start.setHours(0, 0, 0, 0)
        end.setHours(23, 59, 59, 999)
        break
      case 'week':
        start.setDate(today.getDate() - today.getDay())
        end.setHours(23, 59, 59, 999)
        break
      case 'month':
        start.setDate(1)
        end.setHours(23, 59, 59, 999)
        break
      case 'quarter': {
        const quarter = Math.floor(today.getMonth() / 3)
        start.setMonth(quarter * 3)
        start.setDate(1)
        end.setHours(23, 59, 59, 999)
        break
      }
      case 'year':
        start.setMonth(0)
        start.setDate(1)
        end.setHours(23, 59, 59, 999)
        break
      case 'last7':
        start.setDate(today.getDate() - 7)
        end.setHours(23, 59, 59, 999)
        break
      case 'last30':
        start.setDate(today.getDate() - 30)
        end.setHours(23, 59, 59, 999)
        break
      case 'last90':
        start.setDate(today.getDate() - 90)
        end.setHours(23, 59, 59, 999)
        break
      default:
        break
    }

    return [start, end]
  }

  const handlePresetClick = (range) => {
    setSelectedRange(range)
    setShowCustom(false)
    const [start, end] = getRangeDate(range)
    onRangeChange(
      start.toISOString().split('T')[0],
      end.toISOString().split('T')[0]
    )
  }

  const handleCustomApply = () => {
    if (customStart && customEnd) {
      onRangeChange(customStart, customEnd)
      setSelectedRange('custom')
      setShowCustom(false)
    }
  }

  const presets = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Quarter', value: 'quarter' },
    { label: 'This Year', value: 'year' },
    { label: 'Last 7 Days', value: 'last7' },
    { label: 'Last 30 Days', value: 'last30' },
    { label: 'Last 90 Days', value: 'last90' },
  ]

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          <FiCalendar size={18} />
          <span>Date Range</span>
        </div>
        <button
          onClick={() => setShowCustom(!showCustom)}
          className="text-sm text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50"
        >
          {showCustom ? '✕' : '+'}
        </button>
      </div>

      {/* Preset Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => handlePresetClick(preset.value)}
            className={`px-3 py-2 text-sm rounded-md font-medium transition-all ${
              selectedRange === preset.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom Date Picker */}
      {showCustom && (
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={customStart}
                onChange={(e) => setCustomStart(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={customEnd}
                onChange={(e) => setCustomEnd(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleCustomApply}
            disabled={!customStart || !customEnd}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
          >
            Apply Range
          </button>
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
