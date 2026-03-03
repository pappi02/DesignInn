import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiEdit2, FiSave, FiX, FiCamera, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore } from '../stores'
import { useForm } from '../hooks'

/**
 * ProfilePage - User profile management
 * Features:
 * - Display user profile information
 * - Edit profile with form validation
 * - Profile picture upload (placeholder)
 * - Save changes functionality
 * - Account status and membership info
 */
function ProfilePage() {
  const navigate = useNavigate()
  const { user, token } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate('/auth/login')
    }
  }, [token, navigate])

  const profileForm = useForm({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
    industry: user?.industry || '',
    bio: user?.bio || '',
  })

  const handleSaveChanges = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Profile updated successfully!')
      setIsEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-black">My Profile</h1>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            {isEditing ? (
              <>
                <FiX size={18} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <FiEdit2 size={18} />
                <span>Edit Profile</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar - Profile Picture & Status */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-20">
              {/* Profile Picture */}
              <div className="mb-6">
                <div className="relative inline-block w-full">
                  <div className="w-full aspect-square bg-gradient-to-br from-yellow-600 to-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <p className="text-white text-6xl font-bold">
                        {user.first_name?.charAt(0)?.toUpperCase()}
                        {user.last_name?.charAt(0)?.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-full hover:bg-gray-800 transition">
                      <FiCamera size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* User Status */}
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Member Since</p>
                  <p className="font-semibold text-black">January 2024</p>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Account Status</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="font-semibold text-green-600">Active</span>
                  </div>
                </div>

                <div className="pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-1">Membership</p>
                  <p className="font-semibold text-black">Premium</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">Verified Email</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-sm text-gray-700">✓ Verified</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-8 border-t space-y-2">
                <button className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition text-sm font-semibold">
                  View Orders
                </button>
                <button className="w-full border border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition text-sm font-semibold">
                  Saved Items
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Profile Form */}
          <div className="lg:col-span-2">
            {!isEditing ? (
              // View Mode
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-6">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">First Name</p>
                      <p className="font-semibold text-black">{user.first_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Last Name</p>
                      <p className="font-semibold text-black">{user.last_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Email Address</p>
                      <p className="font-semibold text-black">{user.email || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Phone Number</p>
                      <p className="font-semibold text-black">{user.phone || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-6">Professional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Company</p>
                      <p className="font-semibold text-black">{user.company || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Industry</p>
                      <p className="font-semibold text-black">{user.industry || 'Not provided'}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-6">Bio</h2>
                  <p className="text-gray-700">{user.bio || 'No bio added yet'}</p>
                </div>

                {/* Account Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => navigate('/addresses')}
                    className="bg-white border-2 border-black text-black py-3 rounded-lg hover:bg-black hover:text-white transition font-semibold"
                  >
                    Manage Addresses
                  </button>
                  <button
                    onClick={() => navigate('/settings')}
                    className="bg-white border-2 border-black text-black py-3 rounded-lg hover:bg-black hover:text-white transition font-semibold"
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            ) : (
              // Edit Mode
              <form onSubmit={handleSaveChanges} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-6">Edit Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">First Name</label>
                      <input
                        type="text"
                        {...profileForm.bind('firstName')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Last Name</label>
                      <input
                        type="text"
                        {...profileForm.bind('lastName')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Email Address</label>
                      <input
                        type="email"
                        {...profileForm.bind('email')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Phone Number</label>
                      <input
                        type="tel"
                        {...profileForm.bind('phone')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-6">Edit Professional Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Company</label>
                      <input
                        type="text"
                        {...profileForm.bind('company')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-black mb-2">Industry</label>
                      <select
                        {...profileForm.bind('industry')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                      >
                        <option value="">Select Industry</option>
                        <option value="interior-design">Interior Design</option>
                        <option value="architecture">Architecture</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="retail">Retail</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-black mb-6">Edit Bio</h2>
                  <textarea
                    {...profileForm.bind('bio')}
                    placeholder="Tell us about yourself..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                  <p className="text-xs text-gray-600 mt-2">Maximum 500 characters</p>
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
                  >
                    <FiSave size={18} />
                    <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-white border-2 border-black text-black py-3 rounded-lg hover:bg-black hover:text-white transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
