import express from 'express';
import { getOrGeneratePatientAiSummary } from '../controllers/ai.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Generate/Fetch AI Patient Summary
router.get('/patient-summary/:patientId', getOrGeneratePatientAiSummary);

export default router;
