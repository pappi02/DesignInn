import { useState, useEffect } from 'react'

/**
 * Hook for PWA install prompt functionality
 * Handles the beforeinstallprompt event and provides install triggering
 */
export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Check if running on iOS
    const ua = navigator.userAgent
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !window.MSStream)

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault()
      setInstallPrompt(e)
      setIsInstallable(true)
    }

    // Listen for successful app install
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const triggerInstall = async () => {
    if (!installPrompt) return false

    installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
      setIsInstallable(false)
      setInstallPrompt(null)
      return true
    }

    return false
  }

  return {
    installPrompt,
    isInstallable,
    isInstalled,
    isIOS,
    triggerInstall,
  }
}

/**
 * Hook for checking online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

/**
 * Hook for checking screen size breakpoints
 */
export function useResponsive() {
  const [screen, setScreen] = useState({
    isMobile: window.innerWidth < 640,
    isTablet: window.innerWidth >= 640 && window.innerWidth < 1024,
    isDesktop: window.innerWidth >= 1024,
    width: window.innerWidth,
  })

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      setScreen({
        isMobile: width < 640,
        isTablet: width >= 640 && width < 1024,
        isDesktop: width >= 1024,
        width,
      })
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return screen
}

/**
 * Hook for device orientation
 */
export function useOrientation() {
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  )

  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
      )
    }

    window.addEventListener('orientationchange', handleOrientationChange)
    window.addEventListener('resize', handleOrientationChange)

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange)
      window.removeEventListener('resize', handleOrientationChange)
    }
  }, [])

  return orientation
}

/**
 * Hook for safe bottom spacing on notch devices (iPhone)
 */
export function useSafeArea() {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  })

  useEffect(() => {
    const root = document.documentElement

    // Get safe area values from CSS environment variables
    const top = parseInt(
      getComputedStyle(root).getPropertyValue('env(safe-area-inset-top)') || '0'
    )
    const bottom = parseInt(
      getComputedStyle(root).getPropertyValue('env(safe-area-inset-bottom)') || '0'
    )
    const left = parseInt(
      getComputedStyle(root).getPropertyValue('env(safe-area-inset-left)') || '0'
    )
    const right = parseInt(
      getComputedStyle(root).getPropertyValue('env(safe-area-inset-right)') || '0'
    )

    setSafeArea({ top, bottom, left, right })
  }, [])

  return safeArea
}

export default {
  usePWAInstall,
  useOnlineStatus,
  useResponsive,
  useOrientation,
  useSafeArea,
}
