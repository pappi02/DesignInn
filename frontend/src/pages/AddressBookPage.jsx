import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { useForm } from '../../hooks'

/**
 * AddressBookPage - Manage multiple delivery addresses
 * Features:
 * - Display all saved addresses
 * - Add new address
 * - Edit existing address
 * - Delete address
 * - Set default address
 */
function AddressBookPage() {
  const navigate = useNavigate()
  const [addresses, setAddresses] = useState(MOCK_ADDRESSES)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  const addressForm = useForm({
    label: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    isDefault: false,
  })

  const handleStartAdd = () => {
    addressForm.resetForm()
    setIsAddingNew(true)
    setEditingId(null)
  }

  const handleStartEdit = (address) => {
    addressForm.setValues({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phone: address.phone,
      isDefault: address.isDefault,
    })
    setEditingId(address.id)
    setIsAddingNew(false)
  }

  const handleSaveAddress = async (e) => {
    e.preventDefault()

    if (!addressForm.values.label.trim()) {
      toast.error('Please enter an address label')
      return
    }

    if (!addressForm.values.firstName.trim() || !addressForm.values.address.trim()) {
      toast.error('Please fill all required fields')
      return
    }

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      if (editingId) {
        // Update existing
        setAddresses(
          addresses.map((addr) =>
            addr.id === editingId
              ? { ...addr, ...addressForm.values, updatedAt: new Date().toISOString() }
              : addressForm.values.isDefault ? { ...addr, isDefault: false } : addr
          )
        )
        toast.success('Address updated successfully!')
      } else {
        // Add new
        const newAddress = {
          id: Date.now().toString(),
          ...addressForm.values,
          createdAt: new Date().toISOString(),
        }
        setAddresses([...addresses, newAddress])
        toast.success('Address added successfully!')
      }

      handleCancel()
    } catch (error) {
      toast.error('Failed to save address')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((addr) => addr.id !== id))
      toast.success('Address deleted')
    }
  }

  const handleSetDefault = (id) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, isDefault: true } : { ...addr, isDefault: false }
      )
    )
    toast.success('Default address updated')
  }

  const handleCancel = () => {
    setIsAddingNew(false)
    setEditingId(null)
    addressForm.resetForm()
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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-black">Address Book</h1>
          {!isAddingNew && !editingId && (
            <button
              onClick={handleStartAdd}
              className="flex items-center space-x-2 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <FiPlus size={20} />
              <span>Add Address</span>
            </button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(isAddingNew || editingId) && (
          <form onSubmit={handleSaveAddress} className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-black mb-6">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>

            <div className="space-y-4">
              {/* Label */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Address Label *
                </label>
                <input
                  type="text"
                  {...addressForm.bind('label')}
                  placeholder="e.g., Home, Office, Showroom"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    {...addressForm.bind('firstName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...addressForm.bind('lastName')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  {...addressForm.bind('address')}
                  placeholder="Street address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* City, State, Zip */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">City</label>
                  <input
                    type="text"
                    {...addressForm.bind('city')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">State</label>
                  <input
                    type="text"
                    {...addressForm.bind('state')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Zip Code</label>
                  <input
                    type="text"
                    {...addressForm.bind('zipCode')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...addressForm.bind('phone')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
                />
              </div>

              {/* Default Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...addressForm.bind('isDefault')}
                  className="w-4 h-4"
                  id="isDefault"
                />
                <label htmlFor="isDefault" className="text-sm font-semibold text-black">
                  Set as default address
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition font-semibold disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-white border-2 border-black text-black py-2 rounded-lg hover:bg-black hover:text-white transition font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Addresses List */}
        <div className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map((address) => (
              <div
                key={address.id}
                className={`border-2 rounded-lg p-6 transition ${
                  address.isDefault ? 'border-yellow-600 bg-yellow-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    {address.isDefault && (
                      <div className="flex items-center space-x-1 bg-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        <FiCheck size={14} />
                        <span>Default</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-black">{address.label}</h3>
                      <p className="text-gray-600">
                        {address.firstName} {address.lastName}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleStartEdit(address)}
                      className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition"
                      title="Edit"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Delete"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Address Details */}
                <div className="text-gray-700 space-y-1">
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  {address.phone && <p>Phone: {address.phone}</p>}
                </div>

                {/* Set as Default Button */}
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="mt-4 text-yellow-600 hover:text-yellow-700 font-semibold text-sm"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No addresses saved yet</p>
              <button
                onClick={handleStartAdd}
                className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition font-semibold"
              >
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Mock addresses
const MOCK_ADDRESSES = [
  {
    id: '1',
    label: 'Home',
    firstName: 'John',
    lastName: 'Doe',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    phone: '555-123-4567',
    isDefault: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    label: 'Office',
    firstName: 'John',
    lastName: 'Doe',
    address: '456 Business Avenue',
    city: 'New York',
    state: 'NY',
    zipCode: '10002',
    phone: '555-987-6543',
    isDefault: false,
    createdAt: '2024-01-05',
  },
]

export default AddressBookPage
