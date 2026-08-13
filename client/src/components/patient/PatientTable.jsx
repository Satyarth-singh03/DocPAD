import React from 'react';
import { Eye, Trash2, Power, AlertCircle } from 'lucide-react';
import { Badge } from '../common/Badge';
import { calculateAgeFromDOB } from '../common/SettingsModal';

export const PatientTable = ({ patients, onSelectPatient, onDeactivate, onDelete, userRole }) => {
  if (!patients || patients.length === 0) {
    return (
      <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-black">No Patient Records Found</h4>
        <p className="text-xs text-gray-500 mt-1">Try adjusting your search criteria or add a new patient record.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-2xs overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-sky-50 text-black border-b border-sky-200 text-xs font-bold uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 font-mono">Patient ID</th>
              <th className="px-4 py-3">Patient Name</th>
              <th className="px-4 py-3">Age / Gender</th>
              <th className="px-4 py-3">Condition / Reason</th>
              <th className="px-4 py-3">Last Visit</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-medium">
            {patients.map((patient) => {
              const displayAge = patient.dob ? calculateAgeFromDOB(patient.dob) : patient.age;

              return (
                <tr 
                  key={patient.id} 
                  className="hover:bg-sky-50/50 transition-colors group cursor-pointer"
                  onClick={() => onSelectPatient(patient)}
                >
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-sky-900">
                    {patient.patient_id}
                  </td>
                  <td className="px-4 py-3 font-bold text-black group-hover:text-sky-900">
                    {patient.name}
                  </td>
                  <td className="px-4 py-3 text-gray-700 text-xs">
                    {displayAge || 30} yrs • {patient.gender}
                  </td>
                  <td className="px-4 py-3 text-gray-800 text-xs max-w-xs truncate">
                    {patient.disease || patient.reason_for_visit}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs font-mono">
                    {patient.last_visit || 'N/A'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={patient.is_active ? 'active' : 'inactive'}>
                      {patient.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onSelectPatient(patient)}
                        title="Open Complete Patient Profile"
                        className="px-2.5 py-1 text-xs font-semibold bg-black text-white rounded hover:bg-gray-800 transition-colors"
                      >
                        View Profile
                      </button>

                      {userRole !== 'patient' && onDeactivate && patient.is_active && (
                        <button
                          onClick={() => onDeactivate(patient)}
                          title="Deactivate Patient"
                          className="p-1 text-amber-700 hover:bg-amber-100 rounded transition-colors"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}

                      {userRole === 'admin' && onDelete && (
                        <button
                          onClick={() => onDelete(patient)}
                          title="Permanently Delete Record"
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
