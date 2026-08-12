import React, { useState, useEffect } from 'react';
import { 
  User, 
  ArrowLeft, 
  Activity, 
  Calendar, 
  Phone, 
  Mail, 
  FileText, 
  Pill, 
  MessageSquare, 
  Sparkles, 
  History, 
  Power, 
  Trash2 
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { OverviewTab } from './Tabs/OverviewTab';
import { MedicalHistoryTab } from './Tabs/MedicalHistoryTab';
import { ReportsTab } from './Tabs/ReportsTab';
import { PrescriptionsTab } from './Tabs/PrescriptionsTab';
import { DoctorNotesTab } from './Tabs/DoctorNotesTab';
import { AISummaryTab } from './Tabs/AISummaryTab';

export const PatientProfile = ({ patientId, onBack, initialTab = 'overview' }) => {
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const fetchPatientDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getPatientById(patientId);
      if (res.success) {
        setPatient(res.patient);
      }
    } catch (err) {
      setError(err.message || 'Failed to load patient profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails();
    }
  }, [patientId]);

  const handleDeactivate = async () => {
    try {
      const res = await api.deactivatePatient(patient.id);
      if (res.success) {
        fetchPatientDetails();
      }
    } catch (err) {
      console.warn('Deactivate error:', err.message);
    }
  };

  const handleDeletePermanent = async () => {
    try {
      const res = await api.deletePatientPermanent(patient.id);
      if (res.success && onBack) {
        onBack();
      }
    } catch (err) {
      console.warn('Delete error:', err.message);
    }
  };

  if (loading) return <LoadingSpinner label="Loading Patient Record..." />;

  if (error || !patient) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-lg space-y-4">
        <p className="text-sm font-semibold text-red-600">{error || 'Patient profile not found.'}</p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 text-xs font-bold text-white bg-black rounded hover:bg-gray-800"
          >
            ← Back to Patient List
          </button>
        )}
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'history', label: 'Medical History', icon: History },
    { id: 'reports', label: `Reports (${patient.reports?.length || 0})`, icon: FileText },
    { id: 'prescriptions', label: `Prescriptions (${patient.prescriptions?.length || 0})`, icon: Pill },
    { id: 'notes', label: `Doctor Notes (${patient.notes?.length || 0})`, icon: MessageSquare },
    { id: 'ai-summary', label: 'AI Summary', icon: Sparkles }
  ];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-sky-50 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </button>
      )}

      {/* Main Top Header Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-900 border-2 border-sky-300 flex items-center justify-center font-bold text-xl">
              {patient.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-black">{patient.name}</h1>
                <span className="text-xs font-mono font-bold bg-sky-50 text-sky-900 px-2 py-0.5 rounded border border-sky-200">
                  {patient.patient_id}
                </span>
                <Badge variant={patient.is_active ? 'active' : 'inactive'}>
                  {patient.is_active ? 'Active Record' : 'Deactivated'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-1 font-medium">
                <span>Age: <strong>{patient.age} yrs</strong></span>
                <span>Gender: <strong>{patient.gender}</strong></span>
                <span>Contact: <strong>{patient.contact}</strong></span>
                <span>Last Visit: <strong className="font-mono">{patient.last_visit || 'N/A'}</strong></span>
              </div>
            </div>
          </div>

          {/* Action buttons (Deactivate / Delete for Admin/Doctor/Nurse) */}
          {user?.role !== 'patient' && (
            <div className="flex items-center gap-2">
              {patient.is_active && (
                <button
                  onClick={() => setShowDeactivateDialog(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded hover:bg-amber-100 transition-colors flex items-center gap-1"
                >
                  <Power className="w-3.5 h-3.5" />
                  Deactivate
                </button>
              )}

              {user?.role === 'admin' && (
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded hover:bg-red-100 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete Permanently
                </button>
              )}
            </div>
          )}
        </div>

        {/* Reason for visit & diagnosis banner */}
        <div className="bg-sky-50/60 p-3 rounded-md border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div>
            <span className="font-bold text-gray-700 uppercase font-mono mr-2">Reason for Visit:</span>
            <span className="font-semibold text-black">{patient.reason_for_visit}</span>
          </div>
          {patient.disease && (
            <div>
              <span className="font-bold text-gray-700 uppercase font-mono mr-2">Diagnosed Condition:</span>
              <span className="font-bold text-sky-900 bg-white px-2 py-0.5 rounded border border-sky-200">
                {patient.disease}
              </span>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 gap-1 pt-2">
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
                    : 'border-transparent text-gray-600 hover:text-black hover:border-gray-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Display */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-2xs">
        {activeTab === 'overview' && (
          <OverviewTab patient={patient} onTabChange={setActiveTab} />
        )}
        {activeTab === 'history' && (
          <MedicalHistoryTab patient={patient} />
        )}
        {activeTab === 'reports' && (
          <ReportsTab patient={patient} onReloadPatient={fetchPatientDetails} userRole={user?.role} />
        )}
        {activeTab === 'prescriptions' && (
          <PrescriptionsTab patient={patient} onReloadPatient={fetchPatientDetails} userRole={user?.role} />
        )}
        {activeTab === 'notes' && (
          <DoctorNotesTab patient={patient} onReloadPatient={fetchPatientDetails} userRole={user?.role} />
        )}
        {activeTab === 'ai-summary' && (
          <AISummaryTab patient={patient} onReloadPatient={fetchPatientDetails} />
        )}
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={showDeactivateDialog}
        onClose={() => setShowDeactivateDialog(false)}
        onConfirm={handleDeactivate}
        title="Deactivate Patient Profile"
        message={`Are you sure you want to deactivate patient record '${patient.name}' (${patient.patient_id})? The record will remain archived.`}
        confirmText="Deactivate Record"
        isDanger={false}
      />

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeletePermanent}
        title="Permanently Delete Patient Record"
        message={`CAUTION: Are you sure you want to permanently delete patient profile '${patient.name}' and all associated reports, prescriptions, notes, and AI summaries? This action cannot be undone.`}
        confirmText="Permanently Delete"
        isDanger={true}
      />
    </div>
  );
};
