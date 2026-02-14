import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useForm } from '../../hooks'
import { useAuthStore, useUserStore } from '../../stores'
import { validatePhone } from '../../utils/validators'
import { apiClient } from '../../api'

/**
 * ProfileCompletionPage - Complete user profile information
 * Features:
 * - Company information
 * - Business address
 * - Business type
 * - Preferences
 * - Multi-step form
 * - Auto-redirect to products after completion
 * - Validation
 */
function ProfileCompletionPage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { updateProfile } = useUserStore()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  const { formData, errors, handleChange, setFieldError } = useForm({
    // Company Info
    companyName: '',
    businessType: '',
    companyPhone: '',
    companyWebsite: '',
    // Address Info
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    // Preferences
    communicationPreference: 'email',
    marketingEmails: false,
    newsletter: false,
  })

  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      navigate('/auth/login')
    }
  }, [user, navigate])

  const validateCompanyStep = () => {
    const newErrors = {}

    if (!formData.companyName) {
      newErrors.companyName = 'Company name is required'
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters'
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Business type is required'
    }

    if (formData.companyPhone && !validatePhone(formData.companyPhone)) {
      newErrors.companyPhone = 'Please enter a valid phone number'
    }

    if (formData.companyWebsite) {
      try {
        new URL(formData.companyWebsite)
      } catch {
        newErrors.companyWebsite = 'Please enter a valid website URL'
      }
    }

    return newErrors
  }

  const validateAddressStep = () => {
    const newErrors = {}

    if (!formData.street) {
      newErrors.street = 'Street address is required'
    }

    if (!formData.city) {
      newErrors.city = 'City is required'
    }

    if (!formData.state) {
      newErrors.state = 'State/Province is required'
    }

    if (!formData.zipCode) {
      newErrors.zipCode = 'Postal code is required'
    }

    if (!formData.country) {
      newErrors.country = 'Country is required'
    }

    return newErrors
  }

  const handleNextStep = (e) => {
    e.preventDefault()

    let newErrors = {}
    if (step === 1) {
      newErrors = validateCompanyStep()
    } else if (step === 2) {
      newErrors = validateAddressStep()
    }

    if (Object.keys(newErrors).length > 0) {
      Object.keys(newErrors).forEach((field) => {
        setFieldError(field, newErrors[field])
      })
      return
    }

    setStep(step + 1)
  }

  const handlePreviousStep = () => {
    setStep(step - 1)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const profileData = {
        company_name: formData.companyName,
        business_type: formData.businessType,
        company_phone: formData.companyPhone || null,
        company_website: formData.companyWebsite || null,
        street_address: formData.street,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        country: formData.country,
        communication_preference: formData.communicationPreference,
        marketing_emails: formData.marketingEmails,
        newsletter: formData.newsletter,
        profile_completed: true,
      }

      // Update user profile
      await apiClient.put(`/users/${user.id}/`, profileData)

      // Update Zustand store
      updateProfile(profileData)

      toast.success('Profile completed successfully!')

      // Redirect to products page
      setTimeout(() => {
        navigate('/products')
      }, 1500)
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.street_address?.[0] ||
        'Failed to save profile. Please try again.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black to-gray-900 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-yellow-600 mb-2">DesignInn</h1>
          <p className="text-gray-400">Complete your profile</p>
        </div>

        {/* Profile Completion Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${
                    step >= num ? 'bg-yellow-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {num}
                </div>
                {num < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${step > num ? 'bg-yellow-600' : 'bg-gray-300'}`}
                  ></div>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={step === 3 ? handleSubmit : handleNextStep} className="space-y-6">
            {/* Step 1: Company Information */}
            {step === 1 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h2>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Your Company Name"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.companyName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.companyName && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
                  )}
                </div>

                {/* Business Type */}
                <div>
                  <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                    Business Type
                  </label>
                  <select
                    id="businessType"
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.businessType ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a business type</option>
                    <option value="interior_designer">Interior Designer</option>
                    <option value="architect">Architect</option>
                    <option value="contractor">Contractor</option>
                    <option value="developer">Real Estate Developer</option>
                    <option value="retailer">Retailer</option>
                    <option value="manufacturer">Manufacturer</option>
                    <option value="distributor">Distributor</option>
                    <option value="hospitality">Hospitality</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.businessType && (
                    <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                  )}
                </div>

                {/* Company Phone */}
                <div>
                  <label htmlFor="companyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Phone (Optional)
                  </label>
                  <input
                    id="companyPhone"
                    type="tel"
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.companyPhone ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.companyPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyPhone}</p>
                  )}
                </div>

                {/* Company Website */}
                <div>
                  <label htmlFor="companyWebsite" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Website (Optional)
                  </label>
                  <input
                    id="companyWebsite"
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.companyWebsite ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.companyWebsite && (
                    <p className="text-red-500 text-sm mt-1">{errors.companyWebsite}</p>
                  )}
                </div>
              </>
            )}

            {/* Step 2: Business Address */}
            {step === 2 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Address</h2>

                {/* Street */}
                <div>
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <input
                    id="street"
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="123 Main Street"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                      errors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="New York"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                        errors.city ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <input
                      id="state"
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="NY"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                        errors.state ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Zip Code */}
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Postal Code
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="10001"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                        errors.zipCode ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                    )}
                  </div>

                  {/* Country */}
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="United States"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 ${
                        errors.country ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.country && (
                      <p className="text-red-500 text-sm mt-1">{errors.country}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Step 3: Preferences */}
            {step === 3 && (
              <>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Communication Preferences</h2>

                {/* Communication Preference */}
                <div>
                  <label htmlFor="communicationPreference" className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Contact Method
                  </label>
                  <select
                    id="communicationPreference"
                    name="communicationPreference"
                    value={formData.communicationPreference}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  >
                    <option value="email">Email</option>
                    <option value="phone">Phone</option>
                    <option value="sms">SMS</option>
                  </select>
                </div>

                {/* Marketing Emails */}
                <div className="flex items-center">
                  <input
                    id="marketingEmails"
                    type="checkbox"
                    name="marketingEmails"
                    checked={formData.marketingEmails}
                    onChange={(e) =>
                      handleChange({
                        target: { name: 'marketingEmails', value: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-600"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 text-sm text-gray-700">
                    Send me exclusive deals and promotions
                  </label>
                </div>

                {/* Newsletter */}
                <div className="flex items-center">
                  <input
                    id="newsletter"
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={(e) =>
                      handleChange({
                        target: { name: 'newsletter', value: e.target.checked },
                      })
                    }
                    className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-600"
                  />
                  <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                    Subscribe to our monthly newsletter
                  </label>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
                  <p>
                    <strong>Ready to start?</strong> Complete your profile to unlock all features and explore our product catalog.
                  </p>
                </div>
              </>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
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
                className={`flex-1 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 disabled:bg-gray-400 transition-colors`}
              >
                {isLoading ? 'Saving...' : step === 3 ? 'Complete Profile' : 'Next'}
              </button>
            </div>
          </form>
        </div>

        {/* Progress Info */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Step {step} of 3 • This helps us personalize your experience
        </p>
      </div>
    </div>
  )
}

export default ProfileCompletionPage
