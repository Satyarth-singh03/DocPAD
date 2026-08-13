import React, { useState, useEffect } from 'react';
import { User, FileText, Pill, MessageSquare, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { OverviewTab } from '../patient/Tabs/OverviewTab';
import { MedicalHistoryTab } from '../patient/Tabs/MedicalHistoryTab';
import { ReportsTab } from '../patient/Tabs/ReportsTab';
import { PrescriptionsTab } from '../patient/Tabs/PrescriptionsTab';
import { DoctorNotesTab } from '../patient/Tabs/DoctorNotesTab';
import { AISummaryTab } from '../patient/Tabs/AISummaryTab';

export const PatientDashboard = () => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchOwnRecord = async () => {
    setLoading(true);
    setError(null);
    try {
      const pid = user?.patient_id || user?.id;
      const res = await api.getPatientById(pid);
      if (res.success) {
        setPatient(res.patient);
      }
    } catch (err) {
      setError(err.message || 'Failed to load personal health record');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOwnRecord();
    }
  }, [user]);

  if (loading) return <LoadingSpinner label="Loading Your Medical Dashboard..." />;

  if (error || !patient) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-lg space-y-4 max-w-7xl mx-auto">
        <p className="text-sm font-semibold text-red-600">{error || 'Personal medical record not found.'}</p>
        <p className="text-xs text-gray-500">Please contact clinic administration to link your Patient ID.</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'history', label: 'Medical History', icon: User },
    { id: 'reports', label: `My Reports (${patient.reports?.length || 0})`, icon: FileText },
    { id: 'prescriptions', label: `My Prescriptions (${patient.prescriptions?.length || 0})`, icon: Pill },
    { id: 'notes', label: `Doctor Notes (${patient.notes?.length || 0})`, icon: MessageSquare },
    { id: 'ai-summary', label: 'AI Summary', icon: Sparkles }
  ];

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Patient Header Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 space-y-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-white text-black border-2 border-sky-300 flex items-center justify-center font-bold text-xl">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-black">{patient.name}</h1>
                <span className="text-xs font-mono font-bold bg-white text-sky-900 px-2 py-0.5 rounded border border-sky-300">
                  ID: {patient.patient_id}
                </span>
              </div>
              <p className="text-xs text-gray-700 font-medium mt-1">
                {patient.gender}, {patient.age} Yrs • Contact: {patient.contact}
              </p>
            </div>
          </div>

          <div className="bg-white px-3.5 py-2 rounded-md border border-sky-200 text-xs flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-800" />
            <div>
              <span className="font-bold text-black block">Protected Health Record</span>
              <span className="text-[10px] text-gray-600">Read-Only Patient View</span>
            </div>
          </div>
        </div>

        <div className="border-t border-sky-200/60 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-gray-700 font-mono uppercase mr-2">Reason for Visit:</span>
            <span className="font-semibold text-black">{patient.reason_for_visit}</span>
          </div>
          <div>
            <span className="font-bold text-gray-700 font-mono uppercase mr-2">Condition:</span>
            <span className="font-bold text-sky-900">{patient.disease || 'Under Evaluation'}</span>
          </div>
        </div>
      </div>

      {/* Tabs Menu & Content Container (Full Width) */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xs">
        <div className="flex overflow-x-auto border-b border-gray-200 gap-1 p-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${
                  isActive
                    ? 'border-black text-black bg-sky-50/50'
                    : 'border-transparent text-gray-600 hover:text-black'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && <OverviewTab patient={patient} onTabChange={setActiveTab} />}
          {activeTab === 'history' && <MedicalHistoryTab patient={patient} />}
          {activeTab === 'reports' && <ReportsTab patient={patient} userRole="patient" />}
          {activeTab === 'prescriptions' && <PrescriptionsTab patient={patient} userRole="patient" />}
          {activeTab === 'notes' && <DoctorNotesTab patient={patient} userRole="patient" />}
          {activeTab === 'ai-summary' && <AISummaryTab patient={patient} />}
        </div>
      </div>
    </div>
  );
};
