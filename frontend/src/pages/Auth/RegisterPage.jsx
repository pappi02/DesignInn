import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuthStore } from '../../stores'
import { useForm } from '../../hooks'
import {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
} from '../../utils/validators'

/**
 * RegisterPage - User registration page with multi-step form
 * Features:
 * - Email validation
 * - Password strength validation
 * - Phone number validation
 * - Form state management
 * - Loading indicators
 * - Error handling
 * - Link to login page
 */
function RegisterPage() {
  const navigate = useNavigate()
  const { register, isLoading } = useAuthStore()
  const [step, setStep] = useState(1) // Step 1: Account, Step 2: Profile

  const { formData, errors, handleChange, setFieldError, reset } = useForm({
    // Account Info
    email: '',
    password: '',
    confirmPassword: '',
    // Profile Info
    firstName: '',
    lastName: '',
    phone: '',
    companyName: '',
  })

  const validateAccountStep = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with letters, numbers, and symbols'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    return newErrors
  }

  const validateProfileStep = () => {
    const newErrors = {}

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required'
    } else if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name must be at least 2 characters'
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required'
    } else if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name must be at least 2 characters'
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    return newErrors
  }

  const handleNextStep = (e) => {
    e.preventDefault()

    const newErrors = validateAccountStep()
    if (Object.keys(newErrors).length > 0) {
      Object.keys(newErrors).forEach((field) => {
        setFieldError(field, newErrors[field])
      })
      return
    }

    setStep(2)
  }

  const handlePreviousStep = () => {
    setStep(1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateProfileStep()
    if (Object.keys(newErrors).length > 0) {
      Object.keys(newErrors).forEach((field) => {
        setFieldError(field, newErrors[field])
      })
      return
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone || null,
        company_name: formData.companyName || null,
      })

      toast.success('Account created successfully! Please log in.')
      reset()
      navigate('/auth/login')
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        'Registration failed. Please try again.'
      toast.error(message)
      setFieldError('email', message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">DesignInn</h1>
          <p className="text-gray-400">Create your account</p>
        </div>

        {/* Registration Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                step >= 1 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              1
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-yellow-600' : 'bg-gray-300'}`}></div>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold ${
                step >= 2 ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
              }`}
            >
              2
            </div>
          </div>

          <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="space-y-6">
            {/* Step 1: Account Information */}
            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h2>

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

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                  <p className="text-xs text-gray-500 mt-1">
                    At least 8 characters with letters, numbers, and symbols
                  </p>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Profile Information */}
            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>

                {/* First Name Field */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.firstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                {/* Last Name Field */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.lastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                {/* Phone Field (Optional) */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Company Name Field (Optional) */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name (Optional)
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors ${
                  step === 1 ? '' : ''
                }`}
              >
                {isLoading ? 'Processing...' : step === 1 ? 'Next' : 'Create Account'}
              </button>
            </div>
          </form>

          {/* Links */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-yellow-600 hover:text-yellow-700 font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          By registering, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
