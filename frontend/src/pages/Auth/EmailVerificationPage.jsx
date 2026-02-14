import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm } from '../../hooks'
import { apiClient } from '../../api'

/**
 * EmailVerificationPage - Email verification page
 * Features:
 * - Auto-verify from URL token
 * - Manual token input
 * - Resend verification email
 * - Loading states
 * - Error handling
 * - Success redirect to login
 */
function EmailVerificationPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [verificationEmail, setVerificationEmail] = useState('')

  const { formData, errors, handleChange, setFieldError } = useForm({
    token: '',
    email: '',
  })

  // Auto-verify if token is in URL
  useEffect(() => {
    const token = searchParams.get('token')
    const email = searchParams.get('email')

    if (token) {
      verifyEmail(token, email || '')
    }
  }, [searchParams])

  const verifyEmail = async (token, email = '') => {
    setIsLoading(true)
    try {
      await apiClient.post('/auth/verify-email/', {
        token: token,
        email: email || formData.email,
      })

      setIsVerified(true)
      setVerificationEmail(email || formData.email)
      toast.success('Email verified successfully!')

      // Auto-redirect after 3 seconds
      setTimeout(() => {
        navigate('/auth/login')
      }, 3000)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Verification failed. Please check the token and try again.'
      toast.error(message)
      setFieldError('token', message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.token) {
      setFieldError('token', 'Verification code is required')
      return
    }

    if (!formData.email) {
      setFieldError('email', 'Email is required')
      return
    }

    await verifyEmail(formData.token, formData.email)
  }

  const handleResend = async () => {
    if (!formData.email) {
      setFieldError('email', 'Email is required')
      return
    }

    setResendLoading(true)
    try {
      await apiClient.post('/auth/resend-verification/', {
        email: formData.email,
      })

      toast.success('Verification email sent! Check your inbox.')
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.error ||
        'Failed to resend verification email. Please try again.'
      toast.error(message)
      setFieldError('email', message)
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">DesignInn</h1>
          <p className="text-gray-400">Verify your email address</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {!isVerified ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verification</h2>
              <p className="text-gray-600 mb-6 text-sm">
                Enter your email and the verification code from your email to confirm your account.
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

                {/* Token/Code Field */}
                <div>
                  <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    id="token"
                    type="text"
                    name="token"
                    value={formData.token}
                    onChange={handleChange}
                    placeholder="Enter code from email"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 font-mono ${
                      errors.token ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.token && <p className="text-red-500 text-sm mt-1">{errors.token}</p>}
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
                  <p>
                    <strong>Tip:</strong> If you don't see the verification email, check your spam folder
                    or request a new one below.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                </button>
              </form>

              {/* Resend Button */}
              <button
                onClick={handleResend}
                disabled={resendLoading || !formData.email}
                className="w-full mt-3 bg-yellow-600 text-white py-2 rounded-lg font-semibold hover:bg-yellow-700 disabled:bg-gray-400 transition-colors"
              >
                {resendLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>

              {/* Links */}
              <p className="text-center text-sm text-gray-600 mt-6">
                <Link to="/auth/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">
                  Back to Login
                </Link>
              </p>
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

                <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
                <p className="text-gray-600 mb-6">
                  Your email has been successfully verified.
                  <br />
                  <span className="text-sm">{verificationEmail}</span>
                </p>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-700">
                  <p className="font-semibold mb-1">You're all set!</p>
                  <p>Redirecting to login page in a few seconds...</p>
                </div>

                {/* Manual Login Button */}
                <Link
                  to="/auth/login"
                  className="block w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center"
                >
                  Go to Login Now
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Need help? Contact our support team if you have any issues.
        </p>
      </div>
    </div>
  )
}

export default EmailVerificationPage
