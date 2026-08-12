import { DbService } from '../services/db.service.js';
import { noteSchema } from '../validators/note.validator.js';

export const getNotesByPatientId = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const notes = await DbService.getNotesByPatientId(patientId);

    res.status(200).json({
      success: true,
      notes
    });
  } catch (err) {
    next(err);
  }
};

export const createNote = async (req, res, next) => {
  try {
    const { patientId } = req.params;
    const validated = noteSchema.parse(req.body);

    const newNote = await DbService.createNote({
      patient_id: patientId,
      doctor_id: req.user.id,
      doctor_name: req.user.name,
      note: validated.note
    });

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'DOCTOR_NOTE_CREATED',
      resource_type: 'doctor_note',
      resource_id: newNote.id,
      details: { patient_id: patientId }
    });

    res.status(201).json({
      success: true,
      message: 'Doctor note recorded successfully.',
      note: newNote
    });
  } catch (err) {
    if (err.name === 'ZodError') {
      return res.status(400).json({ success: false, message: err.errors[0].message });
    }
    next(err);
  }
};

export const updateNote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    if (!note || note.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Note text cannot be empty.' });
    }

    const updatedNote = await DbService.updateNote(id, note);

    await DbService.logAudit({
      user_id: req.user.id,
      user_email: req.user.email,
      user_role: req.user.role,
      action: 'DOCTOR_NOTE_UPDATED',
      resource_type: 'doctor_note',
      resource_id: id
    });

    res.status(200).json({
      success: true,
      message: 'Doctor note updated successfully.',
      note: updatedNote
    });
  } catch (err) {
    next(err);
  }
};
