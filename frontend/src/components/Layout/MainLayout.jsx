import Header from './Header'
import Footer from './Footer'

/**
 * Layout Component - Main layout wrapper for all pages
 * Features:
 * - Header navigation
 * - Main content area
 * - Footer
 * - Consistent layout across all pages
 */
function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default Layout
