import React from 'react';
import { Stethoscope, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from '../common/Badge';

export const Navbar = ({ onOpenSettings }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-sky-100 border-b border-sky-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shadow-xs">
            <Stethoscope className="w-6 h-6 text-sky-300" />
          </div>
          <div>
            <span className="font-bold text-lg text-black tracking-tight font-mono">DocPad</span>
          </div>
        </div>

        {/* User Info & Actions */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3 bg-white px-3 py-1.5 rounded-md border border-sky-200 shadow-2xs">
              <div className="w-7 h-7 rounded-full bg-sky-100 text-black flex items-center justify-center font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-black leading-tight">{user.name}</p>
                <p className="text-[10px] text-gray-600 leading-none font-mono">{user.email}</p>
              </div>
              <Badge role={user.role}>{user.role}</Badge>
            </div>

            {/* Settings Button */}
            <button
              onClick={onOpenSettings}
              title="Profile & Settings"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-black bg-white hover:bg-sky-50 border border-sky-200 rounded-md transition-colors shadow-2xs"
            >
              <Settings className="w-4 h-4 text-gray-600" />
              <span className="hidden md:inline">Settings</span>
            </button>

            <button
              onClick={logout}
              title="Logout from DocPad"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-black bg-white hover:bg-sky-50 border border-sky-200 rounded-md transition-colors shadow-2xs"
            >
              <LogOut className="w-4 h-4 text-gray-600" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
