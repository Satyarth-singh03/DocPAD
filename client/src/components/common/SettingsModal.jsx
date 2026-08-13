import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Phone, Calendar, Mail, Shield, Check } from 'lucide-react';

export const calculateAgeFromDOB = (dobString) => {
  if (!dobString) return null;
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
};

export const SettingsModal = ({ isOpen, onClose }) => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    department: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob || '1990-05-15',
        department: user.department || ''
      });
    }
  }, [user, isOpen]);

  const computedAge = calculateAgeFromDOB(formData.dob);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      // Update profile info
      const res = await api.updateProfile({
        name: formData.name,
        phone: formData.phone,
        dob: formData.dob,
        age: computedAge,
        department: formData.department
      });

      if (res.success) {
        setUser(res.user);
        setSuccessMsg('Profile settings updated successfully.');
        setTimeout(() => {
          onClose();
          setSuccessMsg(null);
        }, 1200);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile settings');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account Settings & Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div className="bg-sky-50 border border-sky-200 rounded-md p-3 flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-black block">{user.name}</span>
            <span className="text-gray-600 font-mono">{user.email}</span>
          </div>
          <span className="font-bold uppercase font-mono px-2 py-0.5 bg-white text-black border border-sky-300 rounded">
            {user.role}
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">Full Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">Phone / Mobile Number</label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 555-0199"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black font-mono"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Date of Birth (DOB)</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Calculated Age</label>
            <div className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md font-bold text-black font-mono">
              {computedAge !== null ? `${computedAge} Years Old` : 'Select DOB'}
            </div>
            <p className="text-[10px] text-gray-500 mt-1 italic">* Dynamically calculated from Date of Birth</p>
          </div>
        </div>

        {user.role !== 'patient' && (
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Department / Specialty</label>
            <input
              type="text"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              placeholder="e.g. Cardiology, Emergency, Neurology"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
            />
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-bold text-white bg-black rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
