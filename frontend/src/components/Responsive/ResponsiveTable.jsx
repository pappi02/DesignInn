import { useResponsive } from '../../hooks/usePWA'

/**
 * ResponsiveTable Component
 * Displays data in table format on desktop, card format on mobile
 */
export function ResponsiveTable({
  columns,
  data,
  onRowClick,
  actions,
  isLoading,
  emptyMessage,
}) {
  const { isMobile } = useResponsive()

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">{emptyMessage || 'No data available'}</p>
      </div>
    )
  }

  // Mobile: Card layout
  if (isMobile) {
    return (
      <div className="space-y-4">
        {data.map((row, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
            onClick={() => onRowClick?.(row)}
          >
            {columns.map((col) => (
              <div key={col.key} className="flex justify-between items-start">
                <span className="font-semibold text-gray-700 text-sm">{col.label}</span>
                <span className="text-gray-900 font-medium text-right">
                  {typeof col.render === 'function'
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </span>
              </div>
            ))}
            {actions && (
              <div className="pt-3 border-t border-gray-200 flex gap-2 justify-end">
                {actions.map((action, aIdx) => (
                  <button
                    key={aIdx}
                    onClick={(e) => {
                      e.stopPropagation()
                      action.onClick(row)
                    }}
                    className={`px-3 py-2 rounded text-sm font-semibold transition ${
                      action.variant === 'danger'
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : action.variant === 'warning'
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Desktop: Table layout
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                style={{ width: col.width }}
              >
                {col.label}
              </th>
            ))}
            {actions && (
              <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className="border-b border-gray-200 hover:bg-gray-50 transition cursor-pointer"
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((col) => (
                <td key={col.key} className="px-6 py-4 text-sm text-gray-900">
                  {typeof col.render === 'function'
                    ? col.render(row[col.key], row)
                    : row[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-6 py-4 text-right space-x-2 flex gap-2 justify-end">
                  {actions.map((action, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={(e) => {
                        e.stopPropagation()
                        action.onClick(row)
                      }}
                      className={`px-3 py-2 rounded text-sm font-semibold transition ${
                        action.variant === 'danger'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : action.variant === 'warning'
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResponsiveTable
