const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('aidocpad_token');

  const headers = {
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // If payload is not FormData, default to application/json
  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
    if (typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => ({ success: false, message: 'Server returned unparseable response' }));

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Auth & Settings Profile
  login: (credentials) => request('/auth/login', { method: 'POST', body: credentials }),
  me: () => request('/auth/me'),
  updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: profileData }),

  // Patients
  getPatients: (search = '', patient_id = '') => {
    const params = new URLSearchParams();
    if (search) params.append('q', search);
    if (patient_id) params.append('patient_id', patient_id);
    return request(`/patients?${params.toString()}`);
  },
  getPatientById: (id) => request(`/patients/${id}`),
  createPatient: (patientData) => request('/patients', { method: 'POST', body: patientData }),
  updatePatient: (id, updateData) => request(`/patients/${id}`, { method: 'PUT', body: updateData }),
  deactivatePatient: (id) => request(`/patients/${id}`, { method: 'DELETE' }),
  deletePatientPermanent: (id) => request(`/patients/${id}/permanent`, { method: 'DELETE' }),

  // Notes
  getNotes: (patientId) => request(`/notes/patient/${patientId}`),
  createNote: (patientId, noteText) => request(`/notes/patient/${patientId}`, { method: 'POST', body: { note: noteText } }),
  updateNote: (id, noteText) => request(`/notes/${id}`, { method: 'PUT', body: { note: noteText } }),

  // Reports
  getReports: (patientId) => request(`/reports/patient/${patientId}`),
  uploadReport: (patientId, formData) => request(`/reports/patient/${patientId}`, { method: 'POST', body: formData }),
  analyzeReport: (id, patientId) => request(`/reports/${id}/analyze`, { method: 'POST', body: { patient_id: patientId } }),

  // Prescriptions
  getPrescriptions: (patientId) => request(`/prescriptions/patient/${patientId}`),
  uploadPrescription: (patientId, formData) => request(`/prescriptions/patient/${patientId}`, { method: 'POST', body: formData }),
  updateDoctorRecommendation: (id, recommendationText) => request(`/prescriptions/${id}/recommendation`, { method: 'PUT', body: { doctor_recommendation: recommendationText } }),

  // AI Summary
  getAiSummary: (patientId, force = false) => request(`/ai/patient-summary/${patientId}?forceRegenerate=${force}`),

  // Users & Admin Management
  getUsers: () => request('/users'),
  getUserById: (id) => request(`/users/${id}`),
  createUser: (userData) => request('/users', { method: 'POST', body: userData }),
  updateUser: (id, userData) => request(`/users/${id}`, { method: 'PUT', body: userData }),
  getStats: () => request('/users/stats'),

  // Audit Logs
  getAuditLogs: () => request('/audit')
};
