import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { api } from '../../services/api';
import { calculateAgeFromDOB } from '../common/SettingsModal';
import { User, Calendar, Phone, Mail, FileText, Activity } from 'lucide-react';

export const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
  const [formData, setFormData] = useState({
    patient_id: `PT-${Math.floor(100 + Math.random() * 900)}-${Math.floor(10 + Math.random() * 90)}`,
    name: '',
    dob: '1995-04-10',
    gender: 'Male',
    contact: '',
    email: '',
    reason_for_visit: '',
    disease: '',
    password: 'password123'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const computedAge = calculateAgeFromDOB(formData.dob);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.createPatient({
        ...formData,
        age: computedAge
      });
      if (res.success) {
        onPatientAdded(res.patient);
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Failed to create patient profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Patient Record">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              Patient ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="patient_id"
              required
              value={formData.patient_id}
              onChange={handleChange}
              placeholder="e.g. PT-101-01"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-mono focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              Date of Birth (DOB) <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              required
              value={formData.dob}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-mono focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              Calculated Age
            </label>
            <div className="px-3 py-2 text-sm bg-gray-100 border border-gray-300 rounded-md font-bold text-black font-mono">
              {computedAge !== null ? `${computedAge} Years Old` : 'Select DOB'}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-black uppercase mb-1">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="contact"
              required
              value={formData.contact}
              onChange={handleChange}
              placeholder="e.g. +1 555-0199"
              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md font-mono focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">
            Reason for Visit <span className="text-red-500">*</span>
          </label>
          <textarea
            name="reason_for_visit"
            required
            rows="2"
            value={formData.reason_for_visit}
            onChange={handleChange}
            placeholder="Describe chief complaint or reason for consultation..."
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-black uppercase mb-1">Initial Diagnosis / Condition</label>
          <input
            type="text"
            name="disease"
            value={formData.disease}
            onChange={handleChange}
            placeholder="e.g. Essential Hypertension, Acute Bronchitis..."
            className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving Patient...' : 'Save Patient Profile'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
