/**
 * MetricCard Component
 * Displays key performance indicator (KPI) in a card format
 * Features:
 * - Icon, label, value, and change percentage
 * - Trend indicator (up/down)
 * - Responsive design
 */

import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi'

/**
 * MetricCard Component
 * @param {Object} props
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.label - Metric label
 * @param {string|number} props.value - Metric value (formatted)
 * @param {number} props.change - Change percentage (-100 to 100)
 * @param {string} props.bgColor - Background color class
 * @param {string} props.textColor - Text color class
 * @param {Function} props.onClick - Click handler
 */
function MetricCard({
  icon: Icon,
  label,
  value,
  change = 0,
  bgColor = 'bg-blue-50',
  textColor = 'text-blue-600',
  onClick,
}) {
  const isPositive = change > 0
  const isNeutral = change === 0
  const TrendIcon = isPositive ? FiTrendingUp : isNeutral ? FiMinus : FiTrendingDown
  const trendColor = isPositive ? 'text-green-500' : isNeutral ? 'text-gray-500' : 'text-red-500'

  return (
    <div
      onClick={onClick}
      className={`${bgColor} rounded-lg p-6 cursor-pointer transition-all hover:shadow-lg hover:scale-105`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${textColor} text-2xl`}>
          <Icon />
        </div>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}>
            <TrendIcon size={16} />
            <span>{Math.abs(change)}%</span>
          </div>
        )}
      </div>
      <p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export default MetricCard
