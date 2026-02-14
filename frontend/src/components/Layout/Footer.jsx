import { Link } from 'react-router-dom'
import { FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'

/**
 * Footer Component - Site footer with links and information
 * Features:
 * - Company information
 * - Quick links
 * - Product categories
 * - Social media links
 * - Contact information
 * - Newsletter signup
 * - Copyright
 */
function Footer() {
  return (
    <footer className="bg-black text-gray-300 mt-20">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-yellow-600 rounded px-2 py-1">
                <span className="font-bold text-black text-lg">D</span>
              </div>
              <span className="font-bold text-lg text-white">DesignInn</span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Creative design solutions for interior designers, architects, and businesses.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              <a href="#" className="hover:text-yellow-600 transition" title="Facebook">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-yellow-600 transition" title="Instagram">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-yellow-600 transition" title="Twitter">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-yellow-600 transition" title="LinkedIn">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products?category=furniture" className="hover:text-yellow-600 transition">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/products?category=lighting" className="hover:text-yellow-600 transition">
                  Lighting
                </Link>
              </li>
              <li>
                <Link to="/products?category=decor" className="hover:text-yellow-600 transition">
                  Decor & Accessories
                </Link>
              </li>
              <li>
                <Link to="/products?category=flooring" className="hover:text-yellow-600 transition">
                  Flooring
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-yellow-600 transition">
                  View All Products
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-yellow-600 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/portfolio" className="hover:text-yellow-600 transition">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-yellow-600 transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-yellow-600 transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-yellow-600 transition">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="hover:text-yellow-600 transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-yellow-600 transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-yellow-600 transition">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-yellow-600 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-yellow-600 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-2">
                <FiPhone size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2">
                <FiMail size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
                <a href="mailto:info@designinn.com" className="hover:text-yellow-600 transition">
                  info@designinn.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <FiMapPin size={16} className="mt-1 text-yellow-600 flex-shrink-0" />
                <span>123 Design St, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; 2026 DesignInn. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-yellow-600 transition">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-yellow-600 transition">
              Terms
            </Link>
            <Link to="/cookies" className="hover:text-yellow-600 transition">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
