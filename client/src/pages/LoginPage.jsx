import React, { useState } from 'react';
import { Stethoscope, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setError('Please fill in both Email / Patient ID and Password.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(identifier, password);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoId, demoPass) => {
    setIdentifier(demoId);
    setPassword(demoPass);
    setError(null);
    setLoading(true);
    try {
      await login(demoId, demoPass);
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Top Header Logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="mx-auto w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center shadow-xs">
          <Stethoscope className="w-8 h-8 text-sky-300" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-black font-mono">DocPad</h1>
      </div>

      {/* Main Form Container */}
      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-gray-200 py-8 px-6 shadow-md rounded-lg sm:px-10 space-y-6">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">
                Email / Patient ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. doc123@docpad.in or PT-101-01"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black uppercase mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-md transition-colors shadow-2xs flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                'Signing in...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Switcher */}
          <div className="pt-4 border-t border-gray-100 space-y-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center font-mono">
              Quick Demo Accounts
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin123@docpad.in', 'password123')}
                className="p-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-left font-medium transition-colors"
              >
                <span className="font-bold block text-black">Admin</span>
                <span className="text-[10px] text-gray-600 font-mono">admin123@docpad.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('doc123@docpad.in', 'password123')}
                className="p-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-left font-medium transition-colors"
              >
                <span className="font-bold block text-black">Doctor</span>
                <span className="text-[10px] text-gray-600 font-mono">doc123@docpad.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('nurse123@docpad.in', 'password123')}
                className="p-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-left font-medium transition-colors"
              >
                <span className="font-bold block text-black">Nurse</span>
                <span className="text-[10px] text-gray-600 font-mono">nurse123@docpad.in</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('PT-101-01', 'password123')}
                className="p-2 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded text-left font-medium transition-colors"
              >
                <span className="font-bold block text-black">Patient</span>
                <span className="text-[10px] text-gray-600 font-mono">PT-101-01</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
