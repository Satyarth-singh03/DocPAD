import { DbService } from '../services/db.service.js';
import { GeminiService } from '../services/gemini.service.js';

export const getOrGeneratePatientAiSummary = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { forceRegenerate } = req.query;

    const patient = await DbService.getPatientById(patientId);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    let existingSummary = await DbService.getAiSummaryByPatientId(patient.id);

    if (existingSummary && !forceRegenerate) {
      return res.status(200).json({
        success: true,
        aiSummary: existingSummary.summary,
        generatedAt: existingSummary.generated_at
      });
    }

    // Fetch full patient medical record background
    const notes = await DbService.getNotesByPatientId(patient.id);
    const reports = await DbService.getReportsByPatientId(patient.id);
    const prescriptions = await DbService.getPrescriptionsByPatientId(patient.id);
    const medicalHistory = await DbService.getMedicalRecordsByPatientId(patient.id);

    const generatedSummary = await GeminiService.generatePatientSummary({
      patient,
      medicalHistory,
      notes,
      reports,
      prescriptions
    });

    const savedRecord = await DbService.saveAiSummary(patient.id, generatedSummary);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'AI_PATIENT_SUMMARY_GENERATED',
      resource_type: 'ai_summary',
      resource_id: patient.id
    });

    res.status(200).json({
      success: true,
      message: 'AI Patient Summary generated successfully.',
      aiSummary: savedRecord.summary,
      generatedAt: savedRecord.generated_at
    });
  } catch (err) {
    next(err);
  }
};
