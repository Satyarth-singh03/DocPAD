import express from 'express';
import { 
  uploadPrescription, 
  getPrescriptionsByPatientId, 
  updateDoctorRecommendation 
} from '../controllers/prescription.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get prescriptions for a patient
router.get('/patient/:patientId', getPrescriptionsByPatientId);

// Upload prescription & auto AI vision analysis (Doctor, Admin, Nurse)
router.post('/patient/:patientId', authorizeRoles('admin', 'doctor', 'nurse'), upload.single('file'), uploadPrescription);

// Update doctor recommendation (Doctor, Admin, Nurse)
router.put('/:id/recommendation', authorizeRoles('admin', 'doctor', 'nurse'), updateDoctorRecommendation);

export default router;
