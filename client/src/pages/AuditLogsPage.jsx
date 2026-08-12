import React, { useState, useEffect } from 'react';
import { Shield, Clock, User, Activity } from 'lucide-react';
import { api } from '../services/api';
import { Badge } from '../components/common/Badge';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AuditLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      try {
        const res = await api.getAuditLogs();
        if (res.success) setLogs(res.logs);
      } catch (err) {
        console.warn('Audit logs load error:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) return <LoadingSpinner label="Loading Security Audit Logs..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h1 className="text-xl font-bold text-black flex items-center gap-2">
          <Shield className="w-5 h-5 text-sky-800" />
          Clinical System Audit Logs
        </h1>
        <p className="text-xs text-gray-600">Comprehensive security compliance logging for patient record access and updates.</p>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-sky-50 text-black border-b border-sky-200 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 font-mono">Timestamp</th>
                <th className="px-4 py-3">User / Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Action Performed</th>
                <th className="px-4 py-3">Resource Target</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs font-medium">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="px-4 py-3 font-mono text-gray-600">
                    {new Date(log.created_at || Date.now()).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-bold text-black font-mono">
                    {log.user_email || 'system'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge role={log.user_role}>{log.user_role || 'system'}</Badge>
                  </td>
                  <td className="px-4 py-3 font-bold text-sky-900">
                    {log.action}
                  </td>
                  <td className="px-4 py-3 text-gray-700 font-mono">
                    {log.resource_type}: {log.resource_id || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
