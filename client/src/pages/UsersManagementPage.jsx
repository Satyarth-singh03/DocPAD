import React, { useState, useEffect } from 'react';
import { UserCheck, UserPlus, Search, Edit2 } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { UserDetailModal } from '../components/common/UserDetailModal';
import { AddStaffModal } from '../components/common/AddStaffModal';

export const UsersManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

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

  const handleUserClick = (userItem) => {
    setSelectedUser(userItem);
    setShowDetailModal(true);
  };

  if (loading) return <LoadingSpinner label="Loading Hospital Users Directory..." />;

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
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
          + Add Staff Member
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
                <th className="px-4 py-3 text-right font-mono">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {users.map((u) => (
                <tr 
                  key={u.id} 
                  onClick={() => handleUserClick(u)}
                  className="hover:bg-sky-50/60 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-bold text-black group-hover:text-sky-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center text-xs font-bold border border-sky-200">
                      {u.name.charAt(0)}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono font-semibold text-gray-800">
                    {u.patient_id || u.email}
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
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleUserClick(u)}
                      className="px-3 py-1 text-xs font-bold text-black bg-gray-100 hover:bg-black hover:text-white rounded transition-colors flex items-center gap-1 ml-auto"
                    >
                      <Edit2 className="w-3 h-3" />
                      View & Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onStaffCreated={() => fetchUsers()}
      />

      {/* User Detail & Edit Modal */}
      <UserDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        user={selectedUser}
        onUserUpdated={() => fetchUsers()}
      />
    </div>
  );
};
