import React, { useState } from 'react';
import { Pill, Upload, Sparkles, Edit2, Save, FileText, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { Badge } from '../../common/Badge';

export const PrescriptionsTab = ({ patient, onReloadPatient, userRole }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [doctorRecommendation, setDoctorRecommendation] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState(null);

  const prescriptions = patient?.prescriptions || [];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a prescription image (JPG/PNG) or PDF.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('doctor_recommendation', doctorRecommendation);

      const res = await api.uploadPrescription(patient.id, formData);
      if (res.success) {
        setSelectedFile(null);
        setDoctorRecommendation('');
        if (onReloadPatient) onReloadPatient();
      }
    } catch (err) {
      setError(err.message || 'Prescription upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveRecommendation = async (rxId) => {
    try {
      const res = await api.updateDoctorRecommendation(rxId, editText);
      if (res.success) {
        setEditingId(null);
        if (onReloadPatient) onReloadPatient();
      }
    } catch (err) {
      console.warn('Save recommendation error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Form */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-black">Prescriptions & Medical Guidance</h3>
          <p className="text-xs text-gray-600">OCR scanned prescription details and doctor-entered clinical recommendations.</p>
        </div>
      </div>

      {userRole !== 'patient' && (
        <form onSubmit={handleUpload} className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-800" />
            Upload Doctor Prescription Document
          </h4>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Select Prescription File (JPG, PNG, PDF)</label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 focus:border-black file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Doctor Recommendation / Special Advice</label>
              <input
                type="text"
                value={doctorRecommendation}
                onChange={(e) => setDoctorRecommendation(e.target.value)}
                placeholder="e.g. Low sodium diet, take statin at bedtime..."
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded focus:border-black"
              />
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-black rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Scanning & OCR Extracting...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Upload & Run AI Prescription OCR</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Prescriptions List */}
      {prescriptions.length > 0 ? (
        <div className="space-y-4">
          {prescriptions.map((rx) => {
            const ai = rx.ai_analysis;
            const isEditing = editingId === rx.id;

            return (
              <div key={rx.id} className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-sky-100 text-sky-900 flex items-center justify-center border border-sky-200">
                      <Pill className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">{rx.file_name}</h4>
                      <p className="text-xs text-gray-600 font-mono">
                        Prescribed by: <span className="font-semibold text-black">{rx.doctor_name || 'Dr. Attending Physician'}</span> • {new Date(rx.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <a
                    href={rx.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 text-xs font-medium text-black bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    View Original
                  </a>
                </div>

                {/* 1. Doctor's Prescription (Extracted Text & AI Table) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-sky-700" />
                      AI-Generated Prescription Analysis
                    </h5>
                    <Badge variant="active">AI Extracted</Badge>
                  </div>

                  {/* Medicines Table */}
                  {ai && ai.medicines && ai.medicines.length > 0 ? (
                    <div className="overflow-x-auto border border-sky-200 rounded-md">
                      <table className="w-full text-left text-xs bg-white">
                        <thead className="bg-sky-50 text-black border-b border-sky-200 font-bold uppercase text-[10px]">
                          <tr>
                            <th className="px-3 py-2">Medicine Name</th>
                            <th className="px-3 py-2">Dosage</th>
                            <th className="px-3 py-2">Frequency</th>
                            <th className="px-3 py-2">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {ai.medicines.map((m, i) => (
                            <tr key={i} className="hover:bg-sky-50/50">
                              <td className="px-3 py-2 font-bold text-black">{m.name}</td>
                              <td className="px-3 py-2 font-mono text-gray-800">{m.dosage}</td>
                              <td className="px-3 py-2 text-gray-700">{m.frequency}</td>
                              <td className="px-3 py-2 text-gray-700">{m.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-700 bg-gray-50 p-3 rounded border border-gray-200 font-mono">
                      {rx.extracted_text || 'No transcribed text available.'}
                    </p>
                  )}
                </div>

                {/* 2. Doctor Recommendation Section (Clearly Separated & Editable by Doctor/Staff!) */}
                <div className="bg-sky-50/80 border border-sky-300 rounded-md p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-sky-900" />
                      Doctor Recommendation & Clinical Advice
                    </h5>
                    {userRole !== 'patient' && !isEditing && (
                      <button
                        onClick={() => {
                          setEditingId(rx.id);
                          setEditText(rx.doctor_recommendation || '');
                        }}
                        className="text-xs font-bold text-sky-900 hover:text-black flex items-center gap-1 underline"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit Recommendation
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        rows="2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full p-2 text-xs bg-white border border-gray-300 rounded focus:border-black"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveRecommendation(rx.id)}
                          className="px-3 py-1 text-xs font-bold text-white bg-black rounded hover:bg-gray-800"
                        >
                          Save Recommendation
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-black leading-relaxed">
                      {rx.doctor_recommendation || 'No manual recommendation entered by physician.'}
                    </p>
                  )}
                </div>

                {/* AI Medical Disclaimer */}
                <p className="text-[11px] text-gray-500 italic">
                  * Notice: AI-generated prescription analysis must be verified by a licensed pharmacist or physician before dispensing.
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <Pill className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">No Prescriptions On File</p>
          <p className="text-xs text-gray-600 mt-1">Upload a prescription document to run OCR and extract medication dosages.</p>
        </div>
      )}
    </div>
  );
};
