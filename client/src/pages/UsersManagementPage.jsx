import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, UserPlus, Shield, Search, Mail, Phone } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: 'doctor',
    phone: '',
    department: 'Cardiology'
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      if (res.success) setUsers(res.users);
    } catch (err) {
      console.warn('Get users error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await api.createUser(formData);
      if (res.success) {
        setShowAddModal(false);
        setFormData({
          name: '',
          email: '',
          password: 'password123',
          role: 'doctor',
          phone: '',
          department: 'Cardiology'
        });
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || 'Failed to create user account');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Hospital Staff & Users..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-black">Hospital Staff & User Accounts</h1>
          <p className="text-xs text-gray-600">Authorized medical personnel accounts (Admins, Doctors, Nurses & Patients).</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <UserPlus className="w-4 h-4" />
          + Add Staff Member (Doctor/Nurse)
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sky-50 text-black border-b border-sky-200 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Full Name</th>
                <th className="px-4 py-3">Email / ID</th>
                <th className="px-4 py-3">Assigned Role</th>
                <th className="px-4 py-3">Department / Specialization</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3 text-right">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-3 font-bold text-black flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center text-xs font-bold border border-sky-200">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-gray-800">
                    {u.email}
                  </td>
                  <td className="px-4 py-3">
                    <Badge role={u.role}>{u.role}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-700">
                    {u.department || (u.role === 'patient' ? 'General Patient' : 'Medical Staff')}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                    {u.phone || 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-right text-xs text-gray-500 font-mono">
                    {new Date(u.created_at || Date.now()).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Register New Staff Account">
        <form onSubmit={handleAddUser} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Account Role *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
            >
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Dr. Robert Chen, MD"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. doc345@docpad.in"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-mono focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Initial Password *</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Department / Specialty</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Cardiology, Emergency, Pediatrics"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-bold text-white bg-black rounded-md hover:bg-gray-800"
            >
              {submitting ? 'Creating User...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
