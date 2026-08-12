import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, UserCheck, FileText, Plus, Shield, Search } from 'lucide-react';
import { api } from '../../services/api';
import { SearchBar } from '../common/SearchBar';
import { PatientTable } from '../patient/PatientTable';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const AdminDashboard = ({ onSelectPatient, onOpenAddPatient, onNavigateTab }) => {
  const [stats, setStats] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, patientsRes] = await Promise.all([
        api.getStats(),
        api.getPatients()
      ]);
      if (statsRes.success) setStats(statsRes.stats);
      if (patientsRes.success) setPatients(patientsRes.patients);
    } catch (err) {
      console.warn('Admin stats load error:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Admin Hospital Dashboard..." />;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-sky-50 border border-sky-200 rounded-lg p-5">
        <div>
          <h1 className="text-xl font-bold text-black">Administrator Control Dashboard</h1>
          <p className="text-xs text-gray-700">Full system access to manage users, doctors, nurses, patients, and clinical audit logs.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAddPatient}
            className="px-4 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            + Add New Patient
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

      {/* Search Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-black">Instant Patient Search</h3>
            <p className="text-xs text-gray-600">Search by Patient ID (e.g. pati123) or Patient Name to access complete profile.</p>
          </div>
        </div>

        <SearchBar onSelectPatient={onSelectPatient} />
      </div>

      {/* Patient List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-black">All Hospital Patient Directory</h3>
          <span className="text-xs font-mono text-gray-500">{patients.length} Active Records</span>
        </div>

        <PatientTable
          patients={patients}
          onSelectPatient={onSelectPatient}
          userRole="admin"
          onDeactivate={async (p) => {
            await api.deactivatePatient(p.id);
            fetchData();
          }}
          onDelete={async (p) => {
            await api.deletePatientPermanent(p.id);
            fetchData();
          }}
        />
      </div>
    </div>
  );
};
