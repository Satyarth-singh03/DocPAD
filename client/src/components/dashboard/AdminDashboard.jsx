import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, UserCheck, FileText, Plus, UserPlus, Search, Edit2 } from 'lucide-react';
import { api } from '../../services/api';
import { SearchBar } from '../common/SearchBar';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { UserDetailModal } from '../common/UserDetailModal';

export const AdminDashboard = ({ 
  onSelectPatient, 
  onOpenAddPatient, 
  onOpenAddDoctor, 
  onOpenAddNurse 
}) => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.getStats(),
        api.getUsers()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
    } catch (err) {
      console.warn('Admin stats load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserClick = (userItem) => {
    if (userItem.role === 'patient') {
      // Open patient profile directly!
      onSelectPatient({ id: userItem.patient_id || userItem.id });
    } else {
      // Open Doctor/Nurse detail & edit modal!
      setSelectedUser(userItem);
      setShowUserModal(true);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Admin Dashboard..." />;

  return (
    <div className="space-y-6 w-full">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-sky-50 border border-sky-200 rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-black">Administrator Control Dashboard</h1>
          <p className="text-xs text-gray-700">Central management portal for patients, doctors, and nurses.</p>
        </div>

        {/* Quick Actions — Add Patient, Add Doctor, Add Nurse (#5.1) */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddPatient}
            className="px-3 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            + Add New Patient
          </button>
          <button
            onClick={onOpenAddDoctor}
            className="px-3 py-2 text-xs font-bold text-sky-900 bg-white border border-sky-300 rounded-md hover:bg-sky-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            + Add Doctor
          </button>
          <button
            onClick={onOpenAddNurse}
            className="px-3 py-2 text-xs font-bold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-100 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            + Add Nurse
          </button>
        </div>
      </div>

      {/* Stats Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase font-mono">Total Patients</span>
            <p className="text-2xl font-bold text-black mt-1">{stats?.totalPatients || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center border border-sky-200">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase font-mono">Active Doctors</span>
            <p className="text-2xl font-bold text-black mt-1">{stats?.totalDoctors || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center border border-sky-200">
            <Stethoscope className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase font-mono">Nurses & Staff</span>
            <p className="text-2xl font-bold text-black mt-1">{stats?.totalNurses || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center border border-sky-200">
            <UserCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase font-mono">Clinical Reports</span>
            <p className="text-2xl font-bold text-black mt-1">{stats?.totalReports || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-900 flex items-center justify-center border border-sky-200">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Instant Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-2xs">
        <div>
          <h3 className="text-base font-bold text-black">Instant Patient & User Search</h3>
          <p className="text-xs text-gray-600">Search by Patient ID (e.g. PT-101-01) or Name to open complete record.</p>
        </div>
        <SearchBar onSelectPatient={onSelectPatient} />
      </div>

      {/* Hospital Users & Staff Directory (#5.3: Clicking ANY user opens their profile/dashboard & edit form) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black">All Hospital Users & Staff Directory</h3>
          <span className="text-xs font-mono text-gray-500">{users.length} Total Users</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-sky-50 text-black border-b border-sky-200 text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email / ID</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Department / Specialty</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3 text-right">Action</th>
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
                      <div className="w-7 h-7 rounded-full bg-sky-100 text-black flex items-center justify-center text-xs font-bold border border-sky-200">
                        {u.name.charAt(0)}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-gray-800">
                      {u.patient_id || u.email}
                    </td>
                    <td className="px-4 py-3">
                      <Badge role={u.role}>{u.role}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-700">
                      {u.department || (u.role === 'patient' ? 'General Patient' : 'Clinical Staff')}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 font-mono">
                      {u.phone || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleUserClick(u)}
                        className="px-3 py-1 text-xs font-bold text-black bg-gray-100 hover:bg-black hover:text-white rounded transition-colors"
                      >
                        {u.role === 'patient' ? 'Open Profile' : 'View & Edit'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* User Detail & Edit Modal */}
      <UserDetailModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={selectedUser}
        onUserUpdated={() => fetchData()}
      />
    </div>
  );
};
