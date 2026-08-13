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
import { AddStaffModal } from '../components/common/AddStaffModal';
import { SettingsModal } from '../components/common/SettingsModal';
import { UsersManagementPage } from './UsersManagementPage';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffModalRole, setStaffModalRole] = useState('doctor');
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleSelectPatient = (patient) => {
    setSelectedPatientId(patient.id || patient.patient_id);
  };

  const handleBackToDirectory = () => {
    setSelectedPatientId(null);
  };

  const handleOpenAddDoctor = () => {
    setStaffModalRole('doctor');
    setShowAddStaffModal(true);
  };

  const handleOpenAddNurse = () => {
    setStaffModalRole('nurse');
    setShowAddStaffModal(true);
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
              onOpenAddDoctor={handleOpenAddDoctor}
              onOpenAddNurse={handleOpenAddNurse}
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

      case 'users':
        return <UsersManagementPage />;

      default:
        return (
          <AdminDashboard
            onSelectPatient={handleSelectPatient}
            onOpenAddPatient={() => setShowAddPatientModal(true)}
            onOpenAddDoctor={handleOpenAddDoctor}
            onOpenAddNurse={handleOpenAddNurse}
          />
        );
    }
  };

  // Sidebar is kept ONLY for Admin role when no single patient profile is open!
  const showSidebar = user?.role === 'admin' && !selectedPatientId;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onOpenSettings={() => setShowSettingsModal(true)} />

      <div className="flex-1 flex w-full">
        {showSidebar && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setSelectedPatientId(null);
              setActiveTab(tab);
            }}
            onOpenAddPatient={() => setShowAddPatientModal(true)}
            onOpenAddDoctor={handleOpenAddDoctor}
            onOpenAddNurse={handleOpenAddNurse}
          />
        )}

        {/* Content area expands to 100% full screen width when sidebar is absent (#11) */}
        <main className={`flex-1 p-6 bg-white overflow-y-auto ${showSidebar ? '' : 'w-full max-w-7xl mx-auto'}`}>
          {renderContent()}
        </main>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onPatientAdded={(newPatient) => {
          setSelectedPatientId(newPatient.id || newPatient.patient_id);
        }}
      />

      {/* Add Doctor / Add Nurse Staff Modal */}
      <AddStaffModal
        isOpen={showAddStaffModal}
        onClose={() => setShowAddStaffModal(false)}
        initialRole={staffModalRole}
        onStaffCreated={() => {
          if (activeTab === 'dashboard') setActiveTab('users');
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </div>
  );
};
