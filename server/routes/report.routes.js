import express from 'express';
import { uploadReport, getReportsByPatientId, analyzeReportWithAi } from '../controllers/report.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get reports for a patient
router.get('/patient/:patientId', getReportsByPatientId);

// Upload report (Admin, Doctor, Nurse)
router.post('/patient/:patientId', authorizeRoles('admin', 'doctor', 'nurse'), upload.single('file'), uploadReport);

// Re-trigger AI analysis on report
router.post('/:id/analyze', authorizeRoles('admin', 'doctor', 'nurse'), analyzeReportWithAi);

export default router;
