import React, { useState, useEffect } from 'react';
import { Users, Plus, Search } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SearchBar } from '../components/common/SearchBar';
import { PatientTable } from '../components/patient/PatientTable';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const PatientsPage = ({ onSelectPatient, onOpenAddPatient }) => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await api.getPatients();
      if (res.success) setPatients(res.patients);
    } catch (err) {
      console.warn('Patients load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Patient Records..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-black">Patient Records Directory</h1>
          <p className="text-xs text-gray-600">Search, manage, and inspect complete medical histories for registered patients.</p>
        </div>

        {user?.role !== 'patient' && (
          <button
            onClick={onOpenAddPatient}
            className="px-4 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            + Add New Patient
          </button>
        )}
      </div>

      {/* Instant Search Bar */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2 shadow-2xs">
        <span className="text-xs font-bold text-black uppercase tracking-wider font-mono">Patient Lookup</span>
        <SearchBar onSelectPatient={onSelectPatient} />
      </div>

      {/* Directory Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black">All Active Patients</h3>
          <span className="text-xs font-mono text-gray-500">{patients.length} Total Patients</span>
        </div>

        <PatientTable
          patients={patients}
          onSelectPatient={onSelectPatient}
          userRole={user?.role}
          onDeactivate={async (p) => {
            await api.deactivatePatient(p.id);
            fetchPatients();
          }}
          onDelete={async (p) => {
            await api.deletePatientPermanent(p.id);
            fetchPatients();
          }}
        />
      </div>
    </div>
  );
};
