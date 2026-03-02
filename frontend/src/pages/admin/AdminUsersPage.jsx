/**
 * AdminUsersPage Component
 * Manage users: list, filter, search, edit roles, disable/enable accounts
 * Features:
 * - Users table with search and filtering
 * - Role management
 * - Account status toggle
 * - User details modal
 */

import { useState, useEffect } from 'react'
import { FiEdit2, FiTrash2, FiLock, FiUnlock, FiSearch, FiFilter } from 'react-icons/fi'
import { toast } from 'react-toastify'
import { usersAPI } from '../../api'

/**
 * AdminUsersPage Component
 */
function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const roles = ['all', 'customer', 'designer', 'admin']
  const statuses = ['all', 'active', 'inactive']

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        const response = await usersAPI.list({
          page: 1,
          limit: 100,
        })
        if (response.success) {
          setUsers(response.data || [])
        } else {
          toast.error('Failed to load users')
          setUsers([])
        }
      } catch (error) {
        toast.error('Error loading users')
        setUsers([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.first_name &&
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? user.is_active : !user.is_active)

    return matchesSearch && matchesRole && matchesStatus
  })

  const handleViewDetails = (user) => {
    setSelectedUser(user)
    setIsDetailModalOpen(true)
  }

  const handleToggleStatus = async (userId) => {
    const user = users.find((u) => u.id === userId)
    try {
      const response = await usersAPI.updateStatus(userId, !user.is_active)

      if (response.success) {
        setUsers(
          users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  is_active: !u.is_active,
                  updated_at: new Date().toLocaleDateString(),
                }
              : u
          )
        )

        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({
            ...selectedUser,
            is_active: !selectedUser.is_active,
            updated_at: new Date().toLocaleDateString(),
          })
        }

        toast.success(`User account ${!user.is_active ? 'enabled' : 'disabled'}`)
      } else {
        toast.error(response.error || 'Failed to update user')
      }
    } catch (error) {
      toast.error('Error updating user')
    }
  }

  const handleChangeRole = async (userId, newRole) => {
    try {
      const response = await usersAPI.updateRole(userId, newRole)

      if (response.success) {
        setUsers(
          users.map((u) =>
            u.id === userId
              ? {
                  ...u,
                  role: newRole,
                  updated_at: new Date().toLocaleDateString(),
                }
              : u
          )
        )

        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({
            ...selectedUser,
            role: newRole,
            updated_at: new Date().toLocaleDateString(),
          })
        }

        toast.success(`User role updated to ${newRole}`)
      } else {
        toast.error(response.error || 'Failed to update user')
      }
    } catch (error) {
      toast.error('Error updating user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user permanently?')) {
      try {
        const response = await usersAPI.delete(userId)
        if (response.success) {
          setUsers(users.filter((u) => u.id !== userId))
          setIsDetailModalOpen(false)
          toast.success('User deleted successfully')
        } else {
          toast.error(response.error || 'Failed to delete user')
        }
      } catch (error) {
        toast.error('Error deleting user')
      }
    }
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-700',
      designer: 'bg-blue-100 text-blue-700',
      customer: 'bg-green-100 text-green-700',
    }
    return colors[role] || 'bg-gray-100 text-gray-700'
  }

  const getStatusColor = (active) => {
    return active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
  }

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.is_active).length
  const adminUsers = users.filter((u) => u.role === 'admin').length

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Total Users</p>
          <p className="text-3xl font-bold text-black">{totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Active Users</p>
          <p className="text-3xl font-bold text-green-600">{activeUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600 mb-1">Admin Users</p>
          <p className="text-3xl font-bold text-red-600">{adminUsers}</p>
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Users Management</h1>
          <p className="text-gray-600 mt-1">
            {isLoading ? 'Loading...' : `${filteredUsers.length} users found`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
        {/* Search */}
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
          <FiSearch className="text-gray-600" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-700"
          />
        </div>

        {/* Role and Status Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <FiFilter size={18} className="text-gray-600" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role === 'all' ? 'All Roles' : role.charAt(0).toUpperCase() + role.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">User</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Role</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Joined</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Last Updated</th>
                <th className="text-left py-4 px-6 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-sm">
                          {(user.first_name?.[0] || '') + (user.last_name?.[0] || '')}
                        </div>
                        <p className="font-semibold text-black">
                          {user.first_name} {user.last_name}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{user.email}</td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(user.is_active)}`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-6 text-sm">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View details"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(user.id)}
                          className={`p-2 rounded transition ${
                            user.is_active
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          title={user.is_active ? 'Disable account' : 'Enable account'}
                        >
                          {user.is_active ? <FiLock size={16} /> : <FiUnlock size={16} />}
                        </button>

                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                            title="Delete user"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-600">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {isDetailModalOpen && selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          onRoleChange={handleChangeRole}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  )
}

/**
 * UserDetailsModal Component
 */
function UserDetailsModal({ user, isOpen, onClose, onRoleChange, onToggleStatus, onDelete }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        {/* User Avatar and Name */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {(user.first_name?.[0] || '') + (user.last_name?.[0] || '')}
          </div>
          <h3 className="text-xl font-bold text-black">
            {user.first_name} {user.last_name}
          </h3>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* User Information */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
          <div>
            <label className="text-sm text-gray-600 block mb-2">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Role</label>
            <select
              value={user.role}
              onChange={(e) => onRoleChange(user.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-semibold"
            >
              <option value="customer">Customer</option>
              <option value="designer">Designer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Status</label>
            <select
              value={user.is_active ? 'active' : 'inactive'}
              onChange={(e) => onToggleStatus(user.id)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-600 text-black font-semibold"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Joined Date</label>
            <input
              type="text"
              value={new Date(user.created_at).toLocaleDateString()}
              disabled
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-2">Last Updated</label>
            <input
              type="text"
              value={new Date(user.updated_at).toLocaleDateString()}
              disabled
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 text-black py-2 rounded-lg hover:bg-gray-300 transition font-semibold"
          >
            Done
          </button>
          {user.role !== 'admin' && (
            <button
              onClick={() => {
                onDelete(user.id)
                onClose()
              }}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminUsersPage
