import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm } from '../../hooks'
import { validateEmail } from '../../utils/validators'
import { apiClient } from '../../api'

/**
 * ForgotPasswordPage - Password reset request page
 * Features:
 * - Email validation
 * - Password reset request
 * - Success message display
 * - Link back to login
 * - Error handling
 */
function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const { formData, errors, handleChange, setFieldError } = useForm({
    email: '',
  })

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      Object.keys(newErrors).forEach((field) => {
        setFieldError(field, newErrors[field])
      })
      return
    }

    setIsLoading(true)
    try {
      await apiClient.post('/auth/forgot-password/', {
        email: formData.email,
      })

      setResetSent(true)
      toast.success('Password reset email sent! Check your inbox.')
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        'Failed to send reset email. Please try again.'
      toast.error(message)
      setFieldError('email', message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">DesignInn</h1>
          <p className="text-gray-400">Reset your password</p>
        </div>

        {/* Reset Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {!resetSent ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Forgot Password?</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Enter your email address and we'll send you a password reset link.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>

              {/* Links */}
              <div className="flex gap-2 justify-center text-sm mt-6">
                <Link to="/auth/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                  Back to Login
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/auth/register" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                  Create Account
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
                <p className="text-gray-600 mb-6">
                  We've sent a password reset link to:
                  <br />
                  <span className="font-semibold text-black">{formData.email}</span>
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-sm text-blue-700">
                  <p className="font-semibold mb-1">Next steps:</p>
                  <ul className="text-left space-y-1 ml-4">
                    <li>1. Check your email inbox</li>
                    <li>2. Click the reset link in the email</li>
                    <li>3. Set your new password</li>
                    <li>4. Sign in with your new password</li>
                  </ul>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>

                {/* Resend Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-gray-400 transition-colors mb-3"
                >
                  {isLoading ? 'Resending...' : 'Resend Reset Link'}
                </button>

                {/* Back to Login */}
                <Link
                  to="/auth/login"
                  className="block w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                >
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Reset link expires in 24 hours. Contact support if you need help.
        </p>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
