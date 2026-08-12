import jwt from 'jsonwebtoken';
import { DbService } from '../services/db.service.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication token missing. Please log in.' });
    }

    const secret = process.env.JWT_SECRET || 'aidocpad_super_secret_jwt_key_2026_healthcare';
    const decoded = jwt.verify(token, secret);

    const user = await DbService.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session invalid or user not found.' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      patient_id: user.patient_id || null
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token. Please log in again.' });
  }
};
