import { DbService } from '../services/db.service.js';

export const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await DbService.getAuditLogs();
    res.status(200).json({
      success: true,
      logs
    });
  } catch (err) {
    next(err);
  }
};
