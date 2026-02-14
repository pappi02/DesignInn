import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiLock, FiBell, FiShield, FiLogOut, FiTrash2 } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useAuthStore } from '../../stores'
import { useForm } from '../../hooks'

/**
 * SettingsPage - User account settings and preferences
 * Features:
 * - Password management
 * - Notification preferences
 * - Privacy settings
 * - Account deletion
 * - Logout functionality
 */
function SettingsPage() {
  const navigate = useNavigate()
  const { logout } = useAuthStore()
  const [activeTab, setActiveTab] = useState('security')
  const [loading, setLoading] = useState(false)

  // Password form
  const passwordForm = useForm({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // Preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true,
    newsletter: true,
  })

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (!passwordForm.values.currentPassword) {
      toast.error('Please enter current password')
      return
    }

    if (passwordForm.values.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (passwordForm.values.newPassword !== passwordForm.values.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Password changed successfully!')
      passwordForm.resetForm()
    } catch (error) {
      toast.error('Failed to change password')
    } finally {
      setLoading(false)
    }
  }

  const handlePreferenceChange = (key) => {
    setPreferences({ ...preferences, [key]: !preferences[key] })
    toast.success('Preference updated')
  }

  const handleLogout = async () => {
    try {
      await logout()
      toast.success('Logged out successfully')
      navigate('/auth/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    )) {
      toast.success('Account deletion initiated')
      // TODO: Implement account deletion
    }
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-black transition"
        >
          <FiArrowLeft />
          <span>Back</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-black mb-8">Settings</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="space-y-2 bg-gray-50 rounded-lg p-4">
              {SETTINGS_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === tab.id
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {tab.icon}
                  <span className="font-semibold">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-black mb-6">Security Settings</h2>

                  {/* Change Password */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Change Password</h3>
                    <form onSubmit={handleChangePassword} className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Current Password
                        </label>
                        <input
                          type="password"
                          {...passwordForm.bind('currentPassword')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          {...passwordForm.bind('newPassword')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-black mb-2">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          {...passwordForm.bind('confirmPassword')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="bg-gray-50 rounded-lg p-6 mt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-black mb-2">
                          Two-Factor Authentication
                        </h3>
                        <p className="text-gray-600">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Active Sessions */}
                  <div className="bg-gray-50 rounded-lg p-6 mt-6">
                    <h3 className="text-lg font-semibold text-black mb-4">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-3 border-b">
                        <div>
                          <p className="font-semibold text-black">Current Session</p>
                          <p className="text-sm text-gray-600">Chrome on Windows</p>
                        </div>
                        <span className="text-sm text-green-600 font-semibold">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black mb-6">Notification Preferences</h2>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  {[
                    {
                      key: 'emailNotifications',
                      label: 'Email Notifications',
                      description: 'Receive notifications via email',
                    },
                    {
                      key: 'smsNotifications',
                      label: 'SMS Notifications',
                      description: 'Receive notifications via text message',
                    },
                    {
                      key: 'marketingEmails',
                      label: 'Marketing Emails',
                      description: 'Receive promotional offers and updates',
                    },
                    {
                      key: 'orderUpdates',
                      label: 'Order Updates',
                      description: 'Get notifications about your orders',
                    },
                    {
                      key: 'newsletter',
                      label: 'Newsletter',
                      description: 'Subscribe to our monthly newsletter',
                    },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between py-4 border-b last:border-0">
                      <div>
                        <p className="font-semibold text-black">{pref.label}</p>
                        <p className="text-sm text-gray-600">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[pref.key]}
                          onChange={() => handlePreferenceChange(pref.key)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-yellow-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black mb-6">Privacy Settings</h2>

                <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                  <div className="py-4 border-b">
                    <h3 className="font-semibold text-black mb-2">Profile Visibility</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Control who can see your profile information
                    </p>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600">
                      <option>Private - Only you can see</option>
                      <option>Friends - Only connections can see</option>
                      <option>Public - Everyone can see</option>
                    </select>
                  </div>

                  <div className="py-4 border-b">
                    <h3 className="font-semibold text-black mb-2">Search Visibility</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Allow your profile to appear in search results
                    </p>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="w-4 h-4" />
                      <span className="text-gray-700">Show profile in search results</span>
                    </label>
                  </div>

                  <div className="py-4">
                    <h3 className="font-semibold text-black mb-2">Data Download</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Download a copy of your data
                    </p>
                    <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition">
                      Download My Data
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-black mb-6">Account Management</h2>

                {/* Logout */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">Logout</h3>
                      <p className="text-gray-600">Sign out from this device</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>

                {/* Delete Account */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Account</h3>
                      <p className="text-gray-600">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
                    >
                      <FiTrash2 />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SETTINGS_TABS = [
  { id: 'security', label: 'Security', icon: <FiLock size={20} /> },
  { id: 'notifications', label: 'Notifications', icon: <FiBell size={20} /> },
  { id: 'privacy', label: 'Privacy', icon: <FiShield size={20} /> },
  { id: 'account', label: 'Account', icon: <FiLogOut size={20} /> },
]

export default SettingsPage
