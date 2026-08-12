import express from 'express';
import { 
  getPatients, 
  getPatientById, 
  createPatient, 
  updatePatient, 
  deactivatePatient, 
  deletePatientPermanent 
} from '../controllers/patient.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// List/Search patients (Admin, Doctor, Nurse, Patient (restricted to self))
router.get('/', getPatients);

// Create new patient (Admin, Doctor, Nurse)
router.post('/', authorizeRoles('admin', 'doctor', 'nurse'), createPatient);

// Get patient profile details
router.get('/:id', getPatientById);

// Update patient details (Admin, Doctor, Nurse)
router.put('/:id', authorizeRoles('admin', 'doctor', 'nurse'), updatePatient);

// Deactivate patient (Admin, Doctor, Nurse)
router.delete('/:id', authorizeRoles('admin', 'doctor', 'nurse'), deactivatePatient);

// Permanent delete (Admin ONLY)
router.delete('/:id/permanent', authorizeRoles('admin'), deletePatientPermanent);

export default router;
