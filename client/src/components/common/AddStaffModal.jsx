import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { api } from '../../services/api';
import { calculateAgeFromDOB } from './SettingsModal';

export const AddStaffModal = ({ isOpen, onClose, initialRole = 'doctor', onStaffCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'password123',
    role: initialRole,
    phone: '',
    dob: '1988-03-22',
    department: 'Cardiology'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      role: initialRole,
      department: initialRole === 'doctor' ? 'Cardiology' : 'Emergency & Triage'
    }));
  }, [initialRole, isOpen]);

  const computedAge = calculateAgeFromDOB(formData.dob);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.createUser({
        ...formData,
        age: computedAge
      });
      if (res.success) {
        if (onStaffCreated) onStaffCreated();
        onClose();
      }
    } catch (err) {
      setError(err.message || `Failed to register new ${formData.role}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Add New ${formData.role === 'doctor' ? 'Doctor' : 'Nurse'} Account`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">Account Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
          >
            <option value="doctor">Doctor</option>
            <option value="nurse">Nurse</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">Full Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder={formData.role === 'doctor' ? 'e.g. Dr. Sarah Jenkins, MD' : 'e.g. Nurse Emily Adams, RN'}
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
            placeholder={formData.role === 'doctor' ? 'doc345@docpad.in' : 'nurse345@docpad.in'}
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

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Phone Contact</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+1 555-0199"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-mono focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">Date of Birth</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-mono focus:border-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">Department / Specialty</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            placeholder="e.g. Cardiology, Neurology, Pediatrics"
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black"
          />
        </div>

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
            {loading ? 'Registering...' : `Create ${formData.role === 'doctor' ? 'Doctor' : 'Nurse'} Account`}
          </button>
        </div>
      </form>
    </Modal>
  );
};
