import { DbService } from '../services/db.service.js';
import { userSchema } from '../validators/user.validator.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await DbService.getAllUsers();
    // Exclude password hashes from list response
    const sanitized = users.map(u => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      patient_id: u.patient_id || null,
      phone: u.phone || null,
      department: u.department || null,
      created_at: u.created_at
    }));

    res.status(200).json({
      success: true,
      users: sanitized
    });
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const validated = userSchema.parse(req.body);

    const existing = await DbService.getUserByEmailOrPatientId(validated.email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'User with this email already exists.' });
    }

    const newUser = await DbService.createUser(validated);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'USER_ACCOUNT_CREATED',
      resource_type: 'user',
      resource_id: newUser.id,
      details: { email: newUser.email, role: newUser.role }
    });

    res.status(201).json({
      success: true,
      message: `${validated.role.toUpperCase()} account created successfully.`,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    next(err);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await DbService.getDashboardStats();
    res.status(200).json({
      success: true,
      stats
    });
  } catch (err) {
    next(err);
  }
};
