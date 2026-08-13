import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { DbService } from '../services/db.service.js';

export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please provide Email/Patient ID and Password.' });
    }

    const user = await DbService.getUserByEmailOrPatientId(identifier);

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
    }

    const secret = process.env.JWT_SECRET || 'aidocpad_super_secret_jwt_key_2026_healthcare';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, patient_id: user.patient_id },
      secret,
      { expiresIn: '24h' }
    );

    // Audit log
    await DbService.logAudit({
      user_id: user.id,
      user_email: user.email,
      user_role: user.role,
      action: 'USER_LOGIN',
      resource_type: 'auth',
      resource_id: user.id,
      details: { role: user.role }
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patient_id: user.patient_id || null,
        department: user.department || null,
        phone: user.phone || null,
        dob: user.dob || null,
        age: user.age || null
      }
    });
  } catch (err) {
    next(err);
  }
};

export const me = async (req, res, next) => {
  try {
    const user = await DbService.getUserById(req.user.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        patient_id: user.patient_id || null,
        department: user.department || null,
        phone: user.phone || null,
        dob: user.dob || null,
        age: user.age || null
      }
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, dob, department } = req.body;

    const updated = await DbService.updateUser(req.user.id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(dob !== undefined && { dob }),
      ...(department !== undefined && { department })
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        patient_id: updated.patient_id || null,
        department: updated.department || null,
        phone: updated.phone || null,
        dob: updated.dob || null,
        age: updated.age || null
      }
    });
  } catch (err) {
    next(err);
  }
};
