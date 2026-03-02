/**
 * SimpleLineChart Component
 * Basic line chart using SVG for analytics visualization
 * Features:
 * - Responsive SVG-based rendering
 * - No external dependencies required
 * - Easy to enhance with Recharts
 */

import { useMemo } from 'react'

/**
 * SimpleLineChart Component
 * @param {Object} props
 * @param {Array} props.data - Array of {label, value} objects
 * @param {string} props.title - Chart title
 * @param {string} props.color - Line color (hex or named)
 * @param {number} props.height - Chart height in pixels
 * @param {string} props.yLabel - Y-axis label
 */
function SimpleLineChart({
  data = [],
  title = 'Chart',
  color = '#3B82F6',
  height = 300,
  yLabel = 'Value',
}) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return []
    return data
  }, [data])

  const padding = { top: 20, right: 20, bottom: 40, left: 50 }
  const width = 800
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <p className="text-gray-500 text-center py-8">No data available</p>
      </div>
    )
  }

  // Find min and max values
  const values = chartData.map((d) => d.value)
  const maxValue = Math.max(...values)
  const minValue = 0
  const range = maxValue - minValue || 1

  // Calculate points
  const points = chartData.map((d, i) => {
    const x = padding.left + (i / (chartData.length - 1 || 1)) * chartWidth
    const y =
      padding.top +
      chartHeight -
      ((d.value - minValue) / range) * chartHeight
    return { x, y, ...d }
  })

  // Create path for line
  const pathData = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  // Format Y-axis labels
  const ySteps = 4
  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
    const value = maxValue - (i / ySteps) * range
    return Math.round(value)
  })

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="overflow-x-auto">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Grid lines */}
          {yLabels.map((_, i) => {
            const y = padding.top + (i / ySteps) * chartHeight
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeDasharray="5,5"
                />
              </g>
            )
          })}

          {/* Y-axis */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            stroke="#d1d5db"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={padding.left}
            y1={height - padding.bottom}
            x2={width - padding.right}
            y2={height - padding.bottom}
            stroke="#d1d5db"
            strokeWidth="2"
          />

          {/* Y-axis labels */}
          {yLabels.map((label, i) => {
            const y = padding.top + (i / ySteps) * chartHeight
            return (
              <text
                key={`y-label-${i}`}
                x={padding.left - 10}
                y={y + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {label}
              </text>
            )
          })}

          {/* Y-axis label */}
          <text
            x={15}
            y={padding.top - 10}
            fontSize="12"
            fill="#6b7280"
            fontWeight="500"
          >
            {yLabel}
          </text>

          {/* Line path */}
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <circle
              key={`point-${i}`}
              cx={p.x}
              cy={p.y}
              r="5"
              fill={color}
              stroke="white"
              strokeWidth="2"
            />
          ))}

          {/* X-axis labels */}
          {chartData.map((d, i) => {
            const p = points[i]
            return (
              <text
                key={`x-label-${i}`}
                x={p.x}
                y={height - padding.bottom + 20}
                textAnchor="middle"
                fontSize="12"
                fill="#6b7280"
              >
                {d.label}
              </text>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <div
            style={{ backgroundColor: color }}
            className="w-3 h-3 rounded-full"
          />
          <span className="text-sm text-gray-600">{yLabel}</span>
        </div>
      </div>
    </div>
  )
}

export default SimpleLineChart
