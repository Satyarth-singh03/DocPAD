import React, { useState } from 'react';
import { FileText, Upload, Sparkles, AlertTriangle, CheckCircle2, Download, Eye, Loader2 } from 'lucide-react';
import { api } from '../../../services/api';
import { Badge } from '../../common/Badge';

export const ReportsTab = ({ patient, onReloadPatient, userRole }) => {
  const [uploading, setUploading] = useState(false);
  const [reportType, setReportType] = useState('Blood Test');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  const reports = patient?.reports || [];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF or image report file to upload.');
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('report_type', reportType);

      const res = await api.uploadReport(patient.id, formData);
      if (res.success) {
        setSelectedFile(null);
        if (onReloadPatient) onReloadPatient();
      }
    } catch (err) {
      setError(err.message || 'Report upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleReanalyze = async (reportId) => {
    setAnalyzingId(reportId);
    try {
      await api.analyzeReport(reportId, patient.id);
      if (onReloadPatient) onReloadPatient();
    } catch (err) {
      console.warn('Re-analyze error:', err.message);
    } finally {
      setAnalyzingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Upload Form for Authorized Roles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-black">Medical Lab & Diagnostic Reports</h3>
          <p className="text-xs text-gray-600">Uploaded clinical reports automatically processed with Google Gemini AI Vision.</p>
        </div>
      </div>

      {userRole !== 'patient' && (
        <form onSubmit={handleUpload} className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-3">
          <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4 h-4 text-sky-800" />
            Upload New Medical Report
          </h4>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Report Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-gray-300 rounded focus:border-black"
              >
                <option value="Blood Test">Blood Test / Lipid Panel</option>
                <option value="X-Ray / Scan">X-Ray / MRI / CT Scan</option>
                <option value="ECG / Cardiac">ECG / Cardiac Report</option>
                <option value="Pathology">Pathology Report</option>
                <option value="General Lab">General Lab Result</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Select File (PDF, JPG, PNG)</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="w-full text-xs text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 focus:border-black file:mr-2 file:py-0.5 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white"
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
                  <span>Uploading & AI Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-sky-300" />
                  <span>Upload & Analyze with Gemini AI</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Reports List */}
      {reports.length > 0 ? (
        <div className="space-y-4">
          {reports.map((report) => {
            const ai = report.ai_analysis;
            const isAnalyzing = analyzingId === report.id;

            return (
              <div key={report.id} className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 shadow-2xs">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-sky-100 text-sky-900 flex items-center justify-center border border-sky-200">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-black">{report.file_name}</h4>
                      <p className="text-xs text-gray-600 font-mono">
                        Type: <span className="font-semibold text-black">{report.report_type}</span> • Date: {report.report_date || 'Recent'} • Uploaded by: {report.uploader_name || 'Staff'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={report.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 text-xs font-medium text-black bg-gray-100 rounded hover:bg-gray-200 transition-colors flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View Document
                    </a>
                    {userRole !== 'patient' && (
                      <button
                        onClick={() => handleReanalyze(report.id)}
                        disabled={isAnalyzing}
                        className="px-3 py-1 text-xs font-medium text-sky-900 bg-sky-100 border border-sky-300 rounded hover:bg-sky-200 transition-colors flex items-center gap-1"
                      >
                        {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                        Re-Analyze
                      </button>
                    )}
                  </div>
                </div>

                {/* AI Structured Findings Box */}
                {ai ? (
                  <div className="bg-sky-50/60 border border-sky-200 rounded-md p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-sky-700" />
                        AI-Generated Medical Analysis
                      </span>
                      {ai.severityLevel && (
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-600">Severity:</span>
                          <Badge role={ai.severityLevel.toLowerCase()}>{ai.severityLevel}</Badge>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-800 font-medium leading-relaxed bg-white p-2.5 rounded border border-sky-100">
                      {ai.shortSummary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {ai.keyFindings && ai.keyFindings.length > 0 && (
                        <div className="bg-white p-3 rounded border border-gray-200">
                          <span className="font-bold text-black block mb-1 text-[11px] uppercase">Key Findings:</span>
                          <ul className="list-disc pl-4 space-y-1 text-gray-700">
                            {ai.keyFindings.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {ai.abnormalFindings && ai.abnormalFindings.length > 0 && (
                        <div className="bg-rose-50/80 p-3 rounded border border-rose-200">
                          <span className="font-bold text-rose-900 block mb-1 text-[11px] uppercase flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-700" />
                            Abnormal Observations:
                          </span>
                          <ul className="list-disc pl-4 space-y-1 text-rose-800 font-medium">
                            {ai.abnormalFindings.map((item, i) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Important Metric Table */}
                    {ai.importantValues && ai.importantValues.length > 0 && (
                      <div className="bg-white p-3 rounded border border-gray-200">
                        <span className="font-bold text-black block mb-2 text-[11px] uppercase">Key Metrics & Values:</span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {ai.importantValues.map((v, i) => (
                            <div key={i} className="p-2 bg-gray-50 rounded border border-gray-200 flex justify-between items-center text-xs">
                              <span className="font-semibold text-black">{v.metric}:</span>
                              <span className="font-mono text-gray-800">{v.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Disclaimer */}
                    <div className="text-[11px] text-gray-500 italic pt-1 flex items-center gap-1">
                      <span>* Medical Disclaimer: AI results are generated for decision-support and should be verified by a qualified physician.</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No AI analysis available for this document.</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">No Diagnostic Reports Uploaded</p>
          <p className="text-xs text-gray-600 mt-1">Upload lab results or diagnostic PDFs/images to view AI findings.</p>
        </div>
      )}
    </div>
  );
};
