/**
 * AdminSettingsPage Component
 * Admin settings and configuration
 * Features:
 * - System settings
 * - Email templates configuration
 * - API keys management
 * - Notification preferences
 */

import { useState, useEffect } from 'react'
import { FiSave, FiEye, FiEyeOff, FiTrash2, FiPlus, FiCopy } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { settingsAPI } from '../../api'

/**
 * AdminSettingsPage Component
 */
function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({})
  const [apiKeys, setApiKeys] = useState([])
  const [emailTemplates, setEmailTemplates] = useState([])
  const [showApiKey, setShowApiKey] = useState({})
  const [isLoading, setIsLoading] = useState(true)

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)
      try {
        // Fetch general settings
        const settingsResponse = await settingsAPI.get()
        if (settingsResponse.success) {
          setSettings(settingsResponse.data || {})
        } else {
          toast.error('Failed to load settings')
        }

        // Fetch email templates
        const templatesResponse = await settingsAPI.getEmailTemplates()
        if (templatesResponse.success) {
          setEmailTemplates(templatesResponse.data || [])
        } else {
          toast.error('Failed to load email templates')
        }

        // Fetch API keys
        const keysResponse = await settingsAPI.getAPIKeys()
        if (keysResponse.success) {
          setApiKeys(keysResponse.data || [])
        } else {
          toast.error('Failed to load API keys')
        }
      } catch (error) {
        toast.error('Error loading settings')
      } finally {
        setIsLoading(false)
      }
    }
    fetchSettings()
  }, [])

  // Tabs
  const tabs = [
    { id: 'general', label: 'General Settings' },
    { id: 'email', label: 'Email Templates' },
    { id: 'api', label: 'API Keys' },
    { id: 'notifications', label: 'Notifications' },
  ]

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      const response = await settingsAPI.update(settings)
      if (response.success) {
        toast.success('Settings saved successfully!')
      } else {
        toast.error(response.error || 'Failed to save settings')
      }
    } catch (error) {
      toast.error('Error saving settings')
    }
  }

  // Handle API Key copy
  const handleCopyApiKey = (key) => {
    navigator.clipboard.writeText(key)
    toast.success('API key copied to clipboard')
  }

  // Handle delete API Key
  const handleDeleteApiKey = async (id) => {
    if (window.confirm('Are you sure you want to delete this API key?')) {
      try {
        const response = await settingsAPI.deleteAPIKey(id)
        if (response.success) {
          setApiKeys(apiKeys.filter((k) => k.id !== id))
          toast.success('API key deleted')
        } else {
          toast.error(response.error || 'Failed to delete API key')
        }
      } catch (error) {
        toast.error('Error deleting API key')
      }
    }
  }

  // Handle generate new API key
  const handleGenerateNewKey = async () => {
    try {
      const response = await settingsAPI.generateAPIKey({ name: `API Key ${apiKeys.length + 1}` })
      if (response.success) {
        setApiKeys([...apiKeys, response.data])
        toast.success('New API key generated')
      } else {
        toast.error(response.error || 'Failed to generate API key')
      }
    } catch (error) {
      toast.error('Error generating API key')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-black">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your system configuration and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 bg-white rounded-t-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-4 font-semibold transition border-b-2 ${
              activeTab === tab.id
                ? 'text-black border-black'
                : 'text-gray-600 border-transparent hover:text-black'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-600">
            <p>Loading settings...</p>
          </div>
        ) : (
          <>
            {/* General Settings Tab */}
            {activeTab === 'general' && <GeneralSettingsTab settings={settings} setSettings={setSettings} onSave={handleSaveSettings} />}

            {/* Email Templates Tab */}
            {activeTab === 'email' && <EmailTemplatesTab templates={emailTemplates} setTemplates={setEmailTemplates} />}

            {/* API Keys Tab */}
            {activeTab === 'api' && (
              <APIKeysTab
                apiKeys={apiKeys}
                setApiKeys={setApiKeys}
                showApiKey={showApiKey}
                setShowApiKey={setShowApiKey}
                onCopy={handleCopyApiKey}
                onDelete={handleDeleteApiKey}
                onGenerateKey={handleGenerateNewKey}
              />
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && <NotificationsTab settings={settings} setSettings={setSettings} onSave={handleSaveSettings} />}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * GeneralSettingsTab Component
 */
function GeneralSettingsTab({ settings, setSettings, onSave }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold text-black">System Information</h2>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">Store Name</label>
          <input
            type="text"
            value={settings.storeName}
            onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">Store Email</label>
          <input
            type="email"
            value={settings.storeEmail}
            onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-black mb-2">Phone Number</label>
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-black mb-2">Support Email</label>
          <input
            type="email"
            value={settings.supportEmail}
            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-black mb-2">Store Address</label>
        <textarea
          value={settings.address}
          onChange={(e) => setSettings({ ...settings, address: e.target.value })}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-4">
        <h3 className="font-semibold text-black">Features</h3>
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-5 h-5 accent-yellow-600"
            />
            <span className="text-gray-700">Maintenance Mode</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.allowGuests}
              onChange={(e) => setSettings({ ...settings, allowGuests: e.target.checked })}
              className="w-5 h-5 accent-yellow-600"
            />
            <span className="text-gray-700">Allow Guest Checkout</span>
          </label>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enableReviews}
              onChange={(e) => setSettings({ ...settings, enableReviews: e.target.checked })}
              className="w-5 h-5 accent-yellow-600"
            />
            <span className="text-gray-700">Enable Product Reviews</span>
          </label>
        </div>
      </div>

      <button
        onClick={onSave}
        className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
      >
        <FiSave size={18} />
        <span>Save Settings</span>
      </button>
    </div>
  )
}

/**
 * EmailTemplatesTab Component
 */
function EmailTemplatesTab({ templates, setTemplates }) {
  const [selectedTemplate, setSelectedTemplate] = useState(templates?.[0] || null)
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdateTemplate = (field, value) => {
    const updated = { ...selectedTemplate, [field]: value }
    setSelectedTemplate(updated)
    setTemplates(templates.map((t) => (t.id === updated.id ? updated : t)))
  }

  const handleSaveTemplate = async () => {
    if (!selectedTemplate) return
    setIsSaving(true)
    try {
      const response = await settingsAPI.updateEmailTemplate(selectedTemplate.id, selectedTemplate)
      if (response.success) {
        toast.success('Email template saved successfully!')
        setSelectedTemplate(response.data)
      } else {
        toast.error(response.error || 'Failed to save template')
      }
    } catch (error) {
      toast.error('Error saving template')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <h2 className="text-lg font-bold text-black">Email Templates</h2>

      <div className="grid grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
            className={`p-4 rounded-lg transition border-2 text-left ${
              selectedTemplate.id === template.id
                ? 'border-black bg-black bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <h3 className="font-semibold text-black">{template.name}</h3>
            <p className="text-xs text-gray-600 mt-1">{template.event}</p>
          </button>
        ))}
      </div>

      {selectedTemplate && (
        <div className="space-y-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div>
            <label className="block text-sm font-semibold text-black mb-2">Subject Line</label>
            <input
              type="text"
              value={selectedTemplate.subject}
              onChange={(e) => handleUpdateTemplate('subject', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-black mb-2">Email Content</label>
            <textarea
              value={selectedTemplate.content}
              onChange={(e) => handleUpdateTemplate('content', e.target.value)}
              rows="8"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 font-mono text-sm"
            />
          </div>

          <div className="text-xs text-gray-600 bg-white rounded p-3 border border-gray-200">
            <p className="font-semibold mb-2">Available Variables:</p>
            <p>{selectedTemplate.variables.join(', ')}</p>
          </div>
        </div>
      )}

      <button
        onClick={handleSaveTemplate}
        disabled={isSaving}
        className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold disabled:bg-gray-600"
      >
        <FiSave size={18} />
        <span>{isSaving ? 'Saving...' : 'Save Template'}</span>
      </button>
    </div>
  )
}

/**
 * APIKeysTab Component
 */
function APIKeysTab({ apiKeys, setApiKeys, showApiKey, setShowApiKey, onCopy, onDelete, onGenerateKey }) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-black">API Keys</h2>
        <button
          onClick={onGenerateKey}
          className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition font-semibold text-sm"
        >
          <FiPlus size={16} />
          <span>Generate Key</span>
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((apiKey) => (
          <div key={apiKey.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-black">{apiKey.name}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">{apiKey.status}</span>
            </div>

            <div className="flex items-center space-x-2 bg-white rounded-lg p-3 border border-gray-300">
              <input
                type={showApiKey[apiKey.id] ? 'text' : 'password'}
                value={apiKey.key}
                disabled
                className="flex-1 bg-transparent outline-none text-gray-700 font-mono text-sm"
              />
              <button
                onClick={() => setShowApiKey({ ...showApiKey, [apiKey.id]: !showApiKey[apiKey.id] })}
                className="p-2 text-gray-600 hover:text-black"
              >
                {showApiKey[apiKey.id] ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
              <button
                onClick={() => onCopy(apiKey.key)}
                className="p-2 text-blue-600 hover:text-blue-700"
                title="Copy"
              >
                <FiCopy size={16} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <div>
                <p>Created: {apiKey.createdAt}</p>
                <p>Last Used: {apiKey.lastUsed}</p>
              </div>
              <button
                onClick={() => onDelete(apiKey.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition"
              >
                <FiTrash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {apiKeys.length === 0 && (
        <div className="text-center py-8 text-gray-600 bg-gray-50 rounded-lg border border-gray-200">
          <p>No API keys generated yet</p>
          <button
            onClick={onGenerateKey}
            className="mt-4 text-yellow-600 font-semibold hover:underline"
          >
            Create your first API key
          </button>
        </div>
      )}
    </div>
  )
}

/**
 * NotificationsTab Component
 */
function NotificationsTab({ settings, setSettings, onSave }) {
  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold text-black">Notification Preferences</h2>

      <div className="space-y-4 bg-gray-50 rounded-lg p-6 border border-gray-200">
        <h3 className="font-semibold text-black mb-4">Email Notifications</h3>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifyNewOrders}
            onChange={(e) => setSettings({ ...settings, notifyNewOrders: e.target.checked })}
            className="w-5 h-5 accent-yellow-600"
          />
          <div>
            <span className="text-gray-700 font-semibold">New Orders</span>
            <p className="text-xs text-gray-600">Receive notifications for new customer orders</p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifyReviews}
            onChange={(e) => setSettings({ ...settings, notifyReviews: e.target.checked })}
            className="w-5 h-5 accent-yellow-600"
          />
          <div>
            <span className="text-gray-700 font-semibold">Product Reviews</span>
            <p className="text-xs text-gray-600">Get notified when customers leave reviews</p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifyStockLow}
            onChange={(e) => setSettings({ ...settings, notifyStockLow: e.target.checked })}
            className="w-5 h-5 accent-yellow-600"
          />
          <div>
            <span className="text-gray-700 font-semibold">Low Stock Alerts</span>
            <p className="text-xs text-gray-600">Alert when product stock falls below threshold</p>
          </div>
        </label>

        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifySystemError}
            onChange={(e) => setSettings({ ...settings, notifySystemError: e.target.checked })}
            className="w-5 h-5 accent-yellow-600"
          />
          <div>
            <span className="text-gray-700 font-semibold">System Errors</span>
            <p className="text-xs text-gray-600">Get notified of critical system errors</p>
          </div>
        </label>
      </div>

      <button
        onClick={onSave}
        className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
      >
        <FiSave size={18} />
        <span>Save Preferences</span>
      </button>
    </div>
  )
}

// Mock data - for UI reference, actual data loaded from API
// const MOCK_SETTINGS = {...}
// const MOCK_API_KEYS = [...]
// const MOCK_EMAIL_TEMPLATES = [...]

export default AdminSettingsPage
