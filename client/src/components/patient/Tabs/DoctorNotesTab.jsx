import React, { useState } from 'react';
import { User, Plus, Edit2, Save, Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

export const DoctorNotesTab = ({ patient, onReloadPatient, userRole }) => {
  const { user } = useAuth();
  const [noteText, setNoteText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');
  const [error, setError] = useState(null);

  const notes = patient?.notes || [];

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      setError('Please enter note text before saving.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const res = await api.createNote(patient.id, noteText);
      if (res.success) {
        setNoteText('');
        if (onReloadPatient) onReloadPatient();
      }
    } catch (err) {
      setError(err.message || 'Failed to add doctor note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateNote = async (noteId) => {
    if (!editNoteText.trim()) return;

    try {
      const res = await api.updateNote(noteId, editNoteText);
      if (res.success) {
        setEditingNoteId(null);
        if (onReloadPatient) onReloadPatient();
      }
    } catch (err) {
      console.warn('Update note error:', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <h3 className="text-base font-bold text-black">Doctor Notes & Clinical Progress Notes</h3>
          <p className="text-xs text-gray-600">Documented doctor notes, observations, and progress logs recorded for this patient.</p>
        </div>
      </div>

      {/* Add Note Form for Doctor/Nurse/Admin */}
      {userRole !== 'patient' && (
        <form onSubmit={handleAddNote} className="bg-sky-50 border border-sky-200 rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-black uppercase tracking-wider flex items-center gap-2">
              <Plus className="w-4 h-4 text-sky-800" />
              Write New Doctor Note
            </h4>
            <span className="text-[10px] text-gray-600 font-mono">
              Posting as: <strong className="text-black">{user?.name}</strong> ({userRole})
            </span>
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

          <textarea
            rows="3"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Type doctor note, clinical findings, symptoms, or progress observations..."
            className="w-full p-3 text-xs bg-white border border-gray-300 rounded-md focus:border-black focus:ring-1 focus:ring-black placeholder-gray-400"
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !noteText.trim()}
              className="px-4 py-2 text-xs font-bold text-white bg-black rounded-md hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving Note...' : 'Save Doctor Note'}
            </button>
          </div>
        </form>
      )}

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-4">
          {notes.map((note) => {
            const isEditing = editingNoteId === note.id;
            const dateObj = new Date(note.created_at || Date.now());
            const formattedDate = dateObj.toLocaleDateString();
            const formattedTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={note.id} className="bg-white border border-gray-200 rounded-lg p-5 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs">
                      {note.doctor_name ? note.doctor_name.charAt(0) : 'D'}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-black">{note.doctor_name || 'Dr. Medical Staff'}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {formattedDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formattedTime}
                    </span>

                    {userRole !== 'patient' && !isEditing && (
                      <button
                        onClick={() => {
                          setEditingNoteId(note.id);
                          setEditNoteText(note.note);
                        }}
                        className="text-gray-500 hover:text-black p-1"
                        title="Edit note"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      rows="3"
                      value={editNoteText}
                      onChange={(e) => setEditNoteText(e.target.value)}
                      className="w-full p-2 text-xs bg-white border border-gray-300 rounded focus:border-black"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNoteId(null)}
                        className="px-2 py-1 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleUpdateNote(note.id)}
                        className="px-3 py-1 text-xs font-bold text-white bg-black rounded hover:bg-gray-800"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-gray-800 leading-relaxed bg-sky-50/40 p-3 rounded border border-sky-100">
                    {note.note}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-lg">
          <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-black">No Doctor Notes Logged</p>
          <p className="text-xs text-gray-600 mt-1">Authorized medical staff can record notes above.</p>
        </div>
      )}
    </div>
  );
};
