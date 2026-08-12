import { DbService } from '../services/db.service.js';
import { GeminiService } from '../services/gemini.service.js';
import { supabase } from '../config/supabase.js';

export const uploadReport = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { report_type, report_date } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Please attach a medical report file (PDF, JPG, PNG).' });
    }

    let filePath = `/uploads/reports/${Date.now()}_${file.originalname}`;

    // Upload to Supabase Storage if configured
    if (supabase) {
      try {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${patientId}/${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('medical-reports')
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('medical-reports').getPublicUrl(fileName);
          filePath = urlData.publicUrl;
        }
      } catch (storageErr) {
        console.warn('Supabase storage upload error:', storageErr.message);
      }
    }

    // Auto-analyze report with Gemini AI Multimodal Vision
    const aiAnalysis = await GeminiService.analyzeMedicalReport({
      buffer: file.buffer,
      mimeType: file.mimetype,
      filename: file.originalname
    });

    const newReport = await DbService.createReport({
      patient_id: patientId,
      uploaded_by: req.user.id,
      uploader_name: req.user.name,
      file_name: file.originalname,
      file_path: filePath,
      report_type: report_type || 'Diagnostic Report',
      report_date: report_date || new Date().toISOString().split('T')[0],
      ai_analysis: aiAnalysis
    });

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'MEDICAL_REPORT_UPLOADED',
      resource_type: 'report',
      resource_id: newReport.id,
      details: { file_name: file.originalname, report_type }
    });

    res.status(201).json({
      success: true,
      message: 'Medical report uploaded and analyzed by AI successfully.',
      report: newReport
    });
  } catch (err) {
    next(err);
  }
};

export const getReportsByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const reports = await DbService.getReportsByPatientId(patientId);

    res.status(200).json({
      success: true,
      reports
    });
  } catch (err) {
    next(err);
  }
};

export const analyzeReportWithAi = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reports = await DbService.getReportsByPatientId(req.body.patient_id);
    const report = reports.find(r => r.id === id);

    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    const aiAnalysis = await GeminiService.analyzeMedicalReport({
      buffer: null,
      filename: report.file_name
    });

    const updated = await DbService.updateReportAiAnalysis(id, aiAnalysis);

    res.status(200).json({
      success: true,
      message: 'Report re-analyzed by AI successfully.',
      report: updated
    });
  } catch (err) {
    next(err);
  }
};
