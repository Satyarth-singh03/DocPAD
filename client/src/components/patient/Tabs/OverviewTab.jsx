import React from 'react';
import { User, Activity, Calendar, FileText, Pill, Sparkles, CheckCircle2 } from 'lucide-react';

export const OverviewTab = ({ patient, onTabChange }) => {
  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-sky-300 font-bold text-sm">
            {patient.age}y
          </div>
          <div>
            <p className="text-xs text-gray-700 font-semibold uppercase">Demographics</p>
            <p className="text-sm font-bold text-black">{patient.gender}, {patient.age} Years Old</p>
            <p className="text-xs font-mono text-gray-700 mt-0.5">{patient.contact}</p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-sky-300">
            <Activity className="w-5 h-5 text-sky-800" />
          </div>
          <div>
            <p className="text-xs text-gray-700 font-semibold uppercase">Primary Condition</p>
            <p className="text-sm font-bold text-black line-clamp-1">{patient.disease || 'Initial Evaluation'}</p>
            <p className="text-xs text-gray-700 mt-0.5 line-clamp-1">{patient.reason_for_visit}</p>
          </div>
        </div>

        <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center border border-sky-300">
            <Calendar className="w-5 h-5 text-sky-800" />
          </div>
          <div>
            <p className="text-xs text-gray-700 font-semibold uppercase">Last Consultation</p>
            <p className="text-sm font-bold text-black font-mono">{patient.last_visit || 'Recent'}</p>
            <p className="text-xs text-gray-700 mt-0.5">Status: <span className="font-semibold text-emerald-800">Active Record</span></p>
          </div>
        </div>
      </div>

      {/* Overview AI Summary Banner */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-sky-700" />
            <h3 className="text-base font-bold text-black">AI Executive Patient Summary</h3>
          </div>
          <button
            onClick={() => onTabChange('ai-summary')}
            className="text-xs font-bold text-black hover:text-sky-800 underline uppercase tracking-wider"
          >
            View Full Clinical Synthesis →
          </button>
        </div>

        {patient.aiSummary ? (
          <div className="space-y-3 text-sm text-gray-800">
            <div className="bg-sky-50/70 p-3.5 rounded-md border border-sky-200">
              <p className="font-semibold text-black text-xs uppercase mb-1">Clinical Observation:</p>
              <p className="leading-relaxed">{patient.aiSummary.importantObservations || 'Patient records maintained cleanly.'}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="font-bold text-black block mb-1">Medical Background:</span>
                <p className="text-gray-700">{patient.aiSummary.importantMedicalHistory}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                <span className="font-bold text-black block mb-1">Active Medication Summary:</span>
                <p className="text-gray-700">{patient.aiSummary.currentPrescriptions}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center bg-gray-50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-700 mb-2">No AI summary generated yet for this patient record.</p>
            <button
              onClick={() => onTabChange('ai-summary')}
              className="px-3 py-1.5 text-xs font-semibold bg-black text-white rounded hover:bg-gray-800 transition-colors"
            >
              Generate AI Patient Summary Now
            </button>
          </div>
        )}
      </div>

      {/* Record Sections Quick Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          onClick={() => onTabChange('reports')} 
          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase font-mono">Reports</span>
            <FileText className="w-4 h-4 text-gray-600 group-hover:text-black" />
          </div>
          <p className="text-lg font-bold text-black">{patient.reports?.length || 0} Files</p>
          <p className="text-xs text-gray-600 mt-1">Uploaded diagnostic & lab tests</p>
        </div>

        <div 
          onClick={() => onTabChange('prescriptions')} 
          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase font-mono">Prescriptions</span>
            <Pill className="w-4 h-4 text-gray-600 group-hover:text-black" />
          </div>
          <p className="text-lg font-bold text-black">{patient.prescriptions?.length || 0} Prescriptions</p>
          <p className="text-xs text-gray-600 mt-1">OCR scanned & doctor recommendations</p>
        </div>

        <div 
          onClick={() => onTabChange('notes')} 
          className="p-4 bg-white border border-gray-200 rounded-lg hover:border-black transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-700 uppercase font-mono">Doctor Notes</span>
            <User className="w-4 h-4 text-gray-600 group-hover:text-black" />
          </div>
          <p className="text-lg font-bold text-black">{patient.notes?.length || 0} Notes</p>
          <p className="text-xs text-gray-600 mt-1">Clinical observations & updates</p>
        </div>
      </div>
    </div>
  );
};
