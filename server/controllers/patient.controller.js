import { DbService } from '../services/db.service.js';
import { patientSchema } from '../validators/patient.validator.js';

export const getPatients = async (req, res, next) => {
  try {
    const { q, patient_id } = req.query;

    // Patients can ONLY search/view themselves!
    if (req.user.role === 'patient') {
      const p = await DbService.getPatientById(req.user.patient_id || req.user.id);
      return res.status(200).json({
        success: true,
        patients: p ? [p] : []
      });
    }

    const list = await DbService.getPatients({
      search: q,
      patientId: patient_id,
      role: req.user.role
    });

    res.status(200).json({
      success: true,
      count: list.length,
      patients: list
    });
  } catch (err) {
    next(err);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Enforce patient access restriction
    if (req.user.role === 'patient' && req.user.patient_id !== id && req.user.id !== id) {
      const selfPatient = await DbService.getPatientById(req.user.patient_id || req.user.id);
      if (!selfPatient || selfPatient.id !== id) {
        return res.status(403).json({ success: false, message: 'Forbidden. Patients can only access their own record.' });
      }
    }

    const patient = await DbService.getPatientById(id);
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient record not found.' });
    }

    // Fetch related components
    const notes = await DbService.getNotesByPatientId(patient.id);
    const reports = await DbService.getReportsByPatientId(patient.id);
    const prescriptions = await DbService.getPrescriptionsByPatientId(patient.id);
    const medicalHistory = await DbService.getMedicalRecordsByPatientId(patient.id);
    const aiSummary = await DbService.getAiSummaryByPatientId(patient.id);

    res.status(200).json({
      success: true,
      patient: {
        ...patient,
        notes,
        reports,
        prescriptions,
        medicalHistory,
        aiSummary: aiSummary ? aiSummary.summary : null
      }
    });
  } catch (err) {
    next(err);
  }
};

export const createPatient = async (req, res, next) => {
  try {
    // Zod validation
    const validated = patientSchema.parse(req.body);

    const newPatient = await DbService.createPatient(validated, req.user.id);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'PATIENT_CREATED',
      resource_type: 'patient',
      resource_id: newPatient.id,
      details: { patient_id: newPatient.patient_id, name: newPatient.name }
    });

    res.status(201).json({
      success: true,
      message: 'Patient profile created successfully.',
      patient: newPatient
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: err.errors[0].message, errors: err.errors });
    }
    next(err);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await DbService.updatePatient(id, req.body);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'PATIENT_UPDATED',
      resource_type: 'patient',
      resource_id: id,
      details: req.body
    });

    res.status(200).json({
      success: true,
      message: 'Patient record updated successfully.',
      patient: updated
    });
  } catch (err) {
    next(err);
  }
};

export const deactivatePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deactivated = await DbService.deactivatePatient(id);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'PATIENT_DEACTIVATED',
      resource_type: 'patient',
      resource_id: id
    });

    res.status(200).json({
      success: true,
      message: 'Patient profile deactivated successfully.',
      patient: deactivated
    });
  } catch (err) {
    next(err);
  }
};

export const deletePatientPermanent = async (req, res, next) => {
  try {
    const { id } = req.params;
    await DbService.deletePatientPermanent(id);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'PATIENT_PERMANENTLY_DELETED',
      resource_type: 'patient',
      resource_id: id
    });

    res.status(200).json({
      success: true,
      message: 'Patient profile permanently removed.'
    });
  } catch (err) {
    next(err);
  }
};
