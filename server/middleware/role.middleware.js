export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized access.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Role '${req.user.role}' is not authorized to access this resource.` 
      });
    }

    next();
  };
};

/**
 * Patient Scope Middleware: Ensures patient role can ONLY access their own records!
 */
export const enforcePatientScope = (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized.' });

  if (req.user.role === 'patient') {
    const targetPatientId = req.params.id || req.query.patient_id || req.body.patient_id;
    
    // If target patient ID is supplied, check if it matches patient's own ID or patient_id string
    if (targetPatientId && targetPatientId !== req.user.patient_id && targetPatientId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Patients can only access their own medical records.'
      });
    }
  }

  next();
};
