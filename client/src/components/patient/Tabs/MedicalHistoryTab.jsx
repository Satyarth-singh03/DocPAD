import React from 'react';
import { History, Stethoscope, Calendar, AlertCircle } from 'lucide-react';

export const MedicalHistoryTab = ({ patient }) => {
  const history = patient?.medicalHistory || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-black">Medical History & Diagnoses</h3>
          <p className="text-xs text-gray-600">Chronological history of recorded medical conditions and clinical evaluations.</p>
        </div>
      </div>

      {history.length > 0 ? (
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-sky-200">
          {history.map((record, index) => (
            <div key={record.id || index} className="relative bg-white border border-gray-200 rounded-lg p-4 space-y-2">
              <div className="absolute -left-8 top-4 w-4 h-4 rounded-full bg-black border-2 border-white ring-2 ring-sky-200" />
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <span className="text-sm font-bold text-black">{record.disease}</span>
                <span className="text-xs font-mono font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                  {record.diagnosis_date || 'Previous Visit'}
                </span>
              </div>
              <p className="text-xs text-gray-800 leading-relaxed">{record.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <History className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">Initial Medical Profile</p>
          <p className="text-xs text-gray-600 mt-1">
            Reason for initial visit: <span className="font-semibold text-black">"{patient.reason_for_visit}"</span>
          </p>
        </div>
      )}
    </div>
  );
};
