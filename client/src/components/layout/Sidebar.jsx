import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ 
  activeTab, 
  setActiveTab, 
  onOpenAddPatient, 
  onOpenAddDoctor, 
  onOpenAddNurse 
}) => {
  const { user } = useAuth();

  // Sidebar is kept ONLY for Admin role per project specifications!
  if (!user || user.role !== 'admin') return null;

  const menuItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users Directory', icon: Users }
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-6">
        {/* Navigation Menu */}
        <div>
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-2 font-mono">
            Admin Menu
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

        {/* Quick Actions (Add Patient, Add Doctor, Add Nurse) */}
        <div className="pt-4 border-t border-gray-100 space-y-2">
          <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider px-3 mb-1 font-mono">
            Quick Actions
          </h4>
          <button
            onClick={onOpenAddPatient}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold bg-black text-white rounded-md hover:bg-gray-800 transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Patient</span>
          </button>
          <button
            onClick={onOpenAddDoctor}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold bg-sky-100 text-sky-900 border border-sky-300 rounded-md hover:bg-sky-200 transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Doctor</span>
          </button>
          <button
            onClick={onOpenAddNurse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold bg-gray-100 text-gray-800 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors shadow-2xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Add Nurse</span>
          </button>
        </div>
      </div>

      {/* Role Footer Badge */}
      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Active Role:</span>
          <span className="font-bold text-black uppercase font-mono">{user.role}</span>
        </div>
      </div>
    </aside>
  );
};
