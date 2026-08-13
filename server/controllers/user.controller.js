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
      dob: u.dob || null,
      age: u.age || null,
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

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await DbService.getUserById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patient_id: user.patient_id || null,
        phone: user.phone || null,
        dob: user.dob || null,
        age: user.age || null,
        department: user.department || null,
        created_at: user.created_at
      }
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

export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await DbService.updateUser(id, req.body);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'USER_ACCOUNT_UPDATED',
      resource_type: 'user',
      resource_id: id,
      details: req.body
    });

    res.status(200).json({
      success: true,
      message: 'User information updated successfully.',
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        patient_id: updated.patient_id || null,
        phone: updated.phone || null,
        dob: updated.dob || null,
        age: updated.age || null,
        department: updated.department || null
      }
    });
  } catch (err) {
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
