import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { AdminDashboard } from '../components/dashboard/AdminDashboard';
import { DoctorDashboard } from '../components/dashboard/DoctorDashboard';
import { NurseDashboard } from '../components/dashboard/NurseDashboard';
import { PatientDashboard } from '../components/dashboard/PatientDashboard';
import { PatientProfile } from '../components/patient/PatientProfile';
import { AddPatientModal } from '../components/patient/AddPatientModal';
import { PatientsPage } from './PatientsPage';
import { UsersManagementPage } from './UsersManagementPage';
import { AuditLogsPage } from './AuditLogsPage';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  const handleSelectPatient = (patient) => {
    setSelectedPatientId(patient.id || patient.patient_id);
  };

  const handleBackToDirectory = () => {
    setSelectedPatientId(null);
  };

  const renderContent = () => {
    // If a patient is selected, open Patient Profile directly!
    if (selectedPatientId) {
      return (
        <PatientProfile
          patientId={selectedPatientId}
          onBack={user?.role !== 'patient' ? handleBackToDirectory : null}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        if (user?.role === 'admin') {
          return (
            <AdminDashboard
              onSelectPatient={handleSelectPatient}
              onOpenAddPatient={() => setShowAddPatientModal(true)}
              onNavigateTab={setActiveTab}
            />
          );
        }
        if (user?.role === 'doctor') {
          return (
            <DoctorDashboard
              onSelectPatient={handleSelectPatient}
              onOpenAddPatient={() => setShowAddPatientModal(true)}
            />
          );
        }
        if (user?.role === 'nurse') {
          return (
            <NurseDashboard
              onSelectPatient={handleSelectPatient}
              onOpenAddPatient={() => setShowAddPatientModal(true)}
            />
          );
        }
        return <PatientDashboard />;

      case 'patients':
        return (
          <PatientsPage
            onSelectPatient={handleSelectPatient}
            onOpenAddPatient={() => setShowAddPatientModal(true)}
          />
        );

      case 'users':
        return <UsersManagementPage />;

      case 'audit':
        return <AuditLogsPage />;

      case 'profile':
        return <PatientDashboard />;

      default:
        return <AdminDashboard onSelectPatient={handleSelectPatient} onOpenAddPatient={() => setShowAddPatientModal(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onSelectPatient={handleSelectPatient} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setSelectedPatientId(null);
            setActiveTab(tab);
          }}
          onOpenAddPatient={() => setShowAddPatientModal(true)}
        />

        <main className="flex-1 p-6 bg-white overflow-y-auto min-h-[calc(100vh-4rem)]">
          {renderContent()}
        </main>
      </div>

      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onPatientAdded={(newPatient) => {
          setSelectedPatientId(newPatient.id);
        }}
      />
    </div>
  );
};
