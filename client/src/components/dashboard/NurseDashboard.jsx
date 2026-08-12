import React, { useState, useEffect } from 'react';
import { UserCheck, Plus, Search, Users, FileText, Upload } from 'lucide-react';
import { api } from '../../services/api';
import { SearchBar } from '../common/SearchBar';
import { PatientTable } from '../patient/PatientTable';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const NurseDashboard = ({ onSelectPatient, onOpenAddPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients();
      if (res.success) setPatients(res.patients);
    } catch (err) {
      console.warn('Nurse patients load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Nursing Triage Dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-50 border border-sky-200 rounded-lg p-5">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-sky-900" />
            <h1 className="text-xl font-bold text-black">Nursing Triage & Patient Care Dashboard</h1>
          </div>
          <p className="text-xs text-gray-700">Register new patient intake, search records, and upload diagnostic lab reports.</p>
        </div>

        <button
          onClick={onOpenAddPatient}
          className="px-4 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Plus className="w-4 h-4" />
          + Add New Patient Intake
        </button>
      </div>

      {/* Prominent Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3 shadow-2xs">
        <h3 className="text-sm font-bold text-black uppercase tracking-wider flex items-center gap-2">
          <Search className="w-4 h-4 text-sky-800" />
          Search Patient Record
        </h3>
        <p className="text-xs text-gray-600">Search by Patient ID or Name to open record and upload reports.</p>
        <SearchBar onSelectPatient={onSelectPatient} />
      </div>

      {/* Patient Directory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black">Triage Patient Queue</h3>
          <span className="text-xs font-mono text-gray-500">{patients.length} Registered Patients</span>
        </div>

        <PatientTable
          patients={patients}
          onSelectPatient={onSelectPatient}
          userRole="nurse"
        />
      </div>
    </div>
  );
};
