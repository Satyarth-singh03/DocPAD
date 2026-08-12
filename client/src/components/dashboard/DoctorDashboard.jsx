import React, { useState, useEffect } from 'react';
import { Stethoscope, Plus, Search, Users, Activity, FileText, Pill } from 'lucide-react';
import { api } from '../../services/api';
import { SearchBar } from '../common/SearchBar';
import { PatientTable } from '../patient/PatientTable';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const DoctorDashboard = ({ onSelectPatient, onOpenAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients();
      if (res.success) setPatients(res.patients);
    } catch (err) {
      console.warn('Doctor patients load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Doctor Clinical Workspace..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-50 border border-sky-200 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-sky-900" />
            <h1 className="text-xl font-bold text-black">Doctor Clinical Dashboard</h1>
          </div>
          <p className="text-xs text-gray-700">Manage patient consultations, medical notes, reports, prescriptions, and AI summaries.</p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="px-4 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          + Add New Patient
        </button>
      </div>

      {/* Prominent Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 shadow-2xs">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-sky-800" />
          Quick Patient Record Lookup
        </h3>
        <p className="text-xs text-gray-600">Type Patient ID (e.g. PT-123-43, pati123) or Patient Name to instantly open profile.</p>
        <SearchBar onSelectPatient={onSelectPatient} />
      </div>

      {/* Active Patients Directory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black">My Active Patients Directory</h3>
          <span className="text-xs font-mono text-gray-500">{patients.length} Assigned Records</span>
        </div>

        <PatientTable
          patients={patients}
          onSelectPatient={onSelectPatient}
          userRole="doctor"
        />
      </div>
    </div>
  );
};
