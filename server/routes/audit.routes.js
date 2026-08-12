import express from 'express';
import { getAuditLogs } from '../controllers/audit.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', authorizeRoles('admin'), getAuditLogs);

export default router;
