import express from 'express';
import { getNotesByPatientId, createNote, updateNote } from '../controllers/note.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Get notes for a patient (All authenticated users can view)
router.get('/patient/:patientId', getNotesByPatientId);

// Add doctor note (Admin, Doctor, Nurse)
router.post('/patient/:patientId', authorizeRoles('admin', 'doctor', 'nurse'), createNote);

// Edit doctor note (Admin, Doctor, Nurse)
router.put('/:id', authorizeRoles('admin', 'doctor', 'nurse'), updateNote);

export default router;
