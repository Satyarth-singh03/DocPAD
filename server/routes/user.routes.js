import express from 'express';
import { getUsers, createUser, getDashboardStats } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Dashboard general stats
router.get('/stats', getDashboardStats);

// User management (Admin only)
router.get('/', authorizeRoles('admin'), getUsers);
router.post('/', authorizeRoles('admin'), createUser);

export default router;
