import express from 'express';
import { getUsers, getUserById, createUser, updateUser, getDashboardStats } from '../controllers/user.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

router.use(authenticateToken);

// Dashboard general stats
router.get('/stats', getDashboardStats);

// User management (Admin only or self/authorized)
router.get('/', authorizeRoles('admin'), getUsers);
router.get('/:id', authorizeRoles('admin'), getUserById);
router.post('/', authorizeRoles('admin'), createUser);
router.put('/:id', authorizeRoles('admin'), updateUser);

export default router;
