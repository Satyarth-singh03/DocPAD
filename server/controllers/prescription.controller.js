import { DbService } from '../services/db.service.js';
import { GeminiService } from '../services/gemini.service.js';
import { supabase } from '../config/supabase.js';

export const uploadPrescription = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const { doctor_recommendation } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: 'Please upload a prescription document (JPG, PNG, PDF).' });
    }

    let filePath = `/uploads/prescriptions/${Date.now()}_${file.originalname}`;

    // Upload to Supabase Storage if configured
    if (supabase) {
      try {
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${patientId}/${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('prescriptions')
          .upload(fileName, file.buffer, { contentType: file.mimetype });

        if (!error && data) {
          const { data: urlData } = supabase.storage.from('prescriptions').getPublicUrl(fileName);
          filePath = urlData.publicUrl;
        }
      } catch (storageErr) {
        console.warn('Supabase prescription upload warning:', storageErr.message);
      }
    }

    // Run Gemini Vision OCR analysis on prescription image/PDF
    const geminiResult = await GeminiService.analyzePrescription({
      buffer: file.buffer,
      mimeType: file.mimetype,
      filename: file.originalname
    });

    const newPrescription = await DbService.createPrescription({
      patient_id: patientId,
      doctor_id: req.user.id,
      doctor_name: req.user.name,
      file_name: file.originalname,
      file_path: filePath,
      extracted_text: geminiResult.extractedText,
      doctor_recommendation: doctor_recommendation || 'Follow daily dosage instructions carefully as prescribed.',
      ai_analysis: geminiResult.aiAnalysis
    });

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'PRESCRIPTION_UPLOADED_AND_ANALYZED',
      resource_type: 'prescription',
      resource_id: newPrescription.id,
      details: { file_name: file.originalname }
    });

    res.status(201).json({
      success: true,
      message: 'Prescription uploaded and analyzed by AI successfully.',
      prescription: newPrescription
    });
  } catch (err) {
    next(err);
  }
};

export const getPrescriptionsByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await DbService.getPrescriptionsByPatientId(patientId);

    res.status(200).json({
      success: true,
      prescriptions
    });
  } catch (err) {
    next(err);
  }
};

export const updateDoctorRecommendation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { doctor_recommendation } = req.body;

    if (!doctor_recommendation) {
      return res.status(400).json({ success: false, message: 'Doctor recommendation cannot be blank.' });
    }

    const updated = await DbService.updatePrescriptionRecommendation(id, doctor_recommendation);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'DOCTOR_RECOMMENDATION_UPDATED',
      resource_type: 'prescription',
      resource_id: id
    });

    res.status(200).json({
      success: true,
      message: 'Doctor recommendation updated successfully.',
      prescription: updated
    });
  } catch (err) {
    next(err);
  }
};
