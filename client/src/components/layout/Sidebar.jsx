import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  FileText, 
  FileCheck, 
  History, 
  Sparkles, 
  Shield, 
  Search,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ activeTab, setActiveTab, onOpenAddPatient }) => {
  const { user } = useAuth();
  if (!user) return null;

  const role = user.role;

  const getMenuItems = () => {
    switch (role) {
      case 'admin':
        return [
          { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
          { id: 'patients', label: 'Patient Directory', icon: Users },
          { id: 'users', label: 'User Accounts', icon: UserCheck },
          { id: 'audit', label: 'System Audit Logs', icon: Shield }
        ];

      case 'doctor':
        return [
          { id: 'dashboard', label: 'Doctor Dashboard', icon: LayoutDashboard },
          { id: 'patients', label: 'My Patients', icon: Users }
        ];

      case 'nurse':
        return [
          { id: 'dashboard', label: 'Nurse Dashboard', icon: LayoutDashboard },
          { id: 'patients', label: 'Patient Records', icon: Users }
        ];

      case 'patient':
        return [
          { id: 'dashboard', label: 'My Medical Dashboard', icon: LayoutDashboard },
          { id: 'profile', label: 'My Full Profile', icon: Users }
        ];

      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Navigation Section */}
        <div>
          <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider px-3 mb-2 font-mono">
            Navigation Menu
          </h4>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-sky-50 hover:text-black'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Actions (Admin, Doctor, Nurse) */}
        {role !== 'patient' && (
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider px-3 mb-2 font-mono">
              Quick Actions
            </h4>
            <button
              onClick={onOpenAddPatient}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-sky-100 text-sky-900 border border-sky-300 rounded-md hover:bg-sky-200 transition-colors shadow-2xs"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New Patient</span>
            </button>
          </div>
        )}
      </div>

      {/* Role Footer Badge */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Active Role:</span>
          <span className="font-bold text-black uppercase font-mono">{role}</span>
        </div>
      </div>
    </aside>
  );
};
