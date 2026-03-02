import { usePWAInstall, useOnlineStatus } from '../../hooks/usePWA'
import { FiDownload, FiWifiOff, FiX } from 'react-icons/fi'
import { useState } from 'react'

/**
 * PWAInstallPrompt Component
 * Shows install prompt for PWA installation on supported browsers
 */
export function PWAInstallPrompt() {
  const { isInstallable, isInstalled, isIOS, triggerInstall } = usePWAInstall()
  const isOnline = useOnlineStatus()
  const [showOfflineNotice, setShowOfflineNotice] = useState(false)
  const [installPromptDismissed, setInstallPromptDismissed] = useState(false)

  if (isInstalled || installPromptDismissed) {
    return null
  }

  // Show install prompt (only on supportive browsers)
  if (isInstallable && !isIOS) {
    return (
      <div className="fixed bottom-4 right-4 bg-black text-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-up z-40">
        <div className="flex items-start space-x-3">
          <FiDownload size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Install DesignInn</h3>
            <p className="text-sm text-gray-300 mb-3">
              Install our app for faster access and offline support
            </p>
            <div className="flex gap-2">
              <button
                onClick={async () => {
                  await triggerInstall()
                }}
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded transition text-sm"
              >
                Install
              </button>
              <button
                onClick={() => setInstallPromptDismissed(true)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition text-sm"
              >
                Dismiss
              </button>
            </div>
          </div>
          <button
            onClick={() => setInstallPromptDismissed(true)}
            className="p-1 hover:bg-gray-800 rounded transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    )
  }

  // iOS installation instructions
  if (isIOS && !isInstalled) {
    return (
      <div className="fixed bottom-4 right-4 bg-black text-white rounded-lg shadow-lg p-4 max-w-sm animate-slide-up z-40">
        <div className="flex items-start space-x-3">
          <FiDownload size={24} className="text-yellow-600 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-semibold text-white mb-1">Install DesignInn</h3>
            <p className="text-sm text-gray-300 mb-3">
              Tap Share button, then "Add to Home Screen" to install
            </p>
            <button
              onClick={() => setInstallPromptDismissed(true)}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-semibold py-2 px-4 rounded transition text-sm"
            >
              Got It
            </button>
          </div>
          <button
            onClick={() => setInstallPromptDismissed(true)}
            className="p-1 hover:bg-gray-800 rounded transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    )
  }

  // Offline notice
  if (!isOnline && !showOfflineNotice) {
    return (
      <div className="fixed top-4 left-4 right-4 bg-red-600 text-white rounded-lg shadow-lg p-4 animate-slide-down z-40">
        <div className="flex items-center space-x-3">
          <FiWifiOff size={20} className="flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">You are offline</p>
            <p className="text-sm text-red-100">Some features may be limited</p>
          </div>
          <button
            onClick={() => setShowOfflineNotice(true)}
            className="p-1 hover:bg-red-700 rounded transition"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default PWAInstallPrompt
