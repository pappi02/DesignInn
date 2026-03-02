/**
 * Global API Loading Indicator Component
 * Shows loading spinner during API requests
 * 
 * Usage:
 * Place this in your main App layout, it will automatically
 * show/hide based on API activity
 */

import { useAPILoading } from '../../hooks/useAPILoading';

/**
 * Global Loading Indicator
 * Displays spinner and overlay during API calls
 */
function GlobalLoadingIndicator() {
  const { isLoading } = useAPILoading();

  if (!isLoading) {
    return null;
  }

  return (
    <>
      {/* Loading Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-20 z-40" aria-hidden="true" />

      {/* Loading Spinner Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50" role="status">
        {/* Spinner */}
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4">
          {/* Animated Spinner */}
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-600 border-r-yellow-600 animate-spin"
              style={{
                animation: 'spin 0.8s linear infinite',
              }}
            ></div>
          </div>

          {/* Loading Text */}
          <p className="text-gray-700 font-semibold">Loading...</p>

          {/* Inline Loading Spinner SVG (alternative) */}
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    </>
  );
}

/**
 * Minimal Loading Bar (alternative to modal)
 * Useful for unobtrusive loading indication
 */
export function LoadingBar() {
  const { isLoading } = useAPILoading();

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 to-black ${
        isLoading ? 'opacity-100' : 'opacity-0'
      } transition-all duration-300 z-50`}
      role="status"
      aria-hidden={!isLoading}
    />
  );
}

/**
 * Loading Skeleton Component
 * Use while data is loading
 */
export function LoadingSkeleton({ rows = 3, columns = 4, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <div
              key={colIdx}
              className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Loading Spinner (standalone component)
 * Can be used in any component independently
 */
export function LoadingSpinner({ size = 'md', color = 'yellow-600' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div
      className={`${sizeClasses[size]} border-gray-200 rounded-full animate-spin border-t-${color}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default GlobalLoadingIndicator;
