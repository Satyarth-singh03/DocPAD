import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '../../services/api';
import { Badge } from './Badge';
import { User, Phone, Mail, Calendar, Edit2, Save, Check, Stethoscope, UserCheck } from 'lucide-react';
import { calculateAgeFromDOB } from './SettingsModal';

export const UserDetailModal = ({ isOpen, onClose, user, onUserUpdated }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dob: user.dob || '1985-06-15',
        department: user.department || ''
      });
      setIsEditing(false);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [user, isOpen]);

  if (!user) return null;

  const computedAge = calculateAgeFromDOB(formData.dob);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await api.updateUser(user.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        age: computedAge,
        department: formData.department
      });

      if (res.success) {
        setSuccessMsg('User profile updated successfully.');
        if (onUserUpdated) onUserUpdated(res.user);
        setTimeout(() => {
          setIsEditing(false);
          setSuccessMsg(null);
        }, 1000);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update user');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    if (role === 'doctor') return <Stethoscope className="w-5 h-5 text-sky-900" />;
    if (role === 'nurse') return <UserCheck className="w-5 h-5 text-sky-900" />;
    return <User className="w-5 h-5 text-sky-900" />;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${user.role.toUpperCase()} Profile Overview`}>
      <div className="space-y-4">
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-md font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
            {errorMsg}
          </div>
        )}

        {/* Profile Card Header */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white text-black border-2 border-sky-300 flex items-center justify-center font-bold text-lg">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-black">{user.name}</h3>
                <Badge role={user.role}>{user.role}</Badge>
              </div>
              <p className="text-xs text-gray-600 font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-xs font-bold text-black bg-white border border-sky-200 rounded hover:bg-sky-100 transition-colors flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Edit User Info
            </button>
          )}
        </div>

        {/* Form or Read-Only Mode */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:border-black"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:border-black font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">Phone / Contact</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:border-black font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:border-black font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-black uppercase mb-1">Dynamic Age</label>
                <div className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded font-bold text-black font-mono">
                  {computedAge !== null ? `${computedAge} yrs` : 'N/A'}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">Department / Specialty</label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Cardiology, Emergency"
                className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:border-black"
              />
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="font-bold text-gray-500 uppercase block mb-1">Department</span>
                <span className="font-bold text-black text-sm">{user.department || 'General Clinical Staff'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="font-bold text-gray-500 uppercase block mb-1">Phone Contact</span>
                <span className="font-bold text-black font-mono text-sm">{user.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="font-bold text-gray-500 uppercase block mb-1">Date of Birth</span>
                <span className="font-mono text-black">{user.dob || '1985-06-15'}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="font-bold text-gray-500 uppercase block mb-1">Current Calculated Age</span>
                <span className="font-bold text-black font-mono">{computedAge || user.age || 38} Years Old</span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-gray-500 font-mono border-t border-gray-100 flex justify-between">
              <span>Account Registered: {new Date(user.created_at || Date.now()).toLocaleDateString()}</span>
              <span>ID: {user.id}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
