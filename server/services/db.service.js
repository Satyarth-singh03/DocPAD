import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../config/supabase.js';

// Pre-seeded Demo Data for Instant Execution
const mockDb = {
  users: [
    {
      id: 'usr-admin-01',
      email: 'admin123@docpad.in',
      password: bcrypt.hashSync('password123', 10),
      name: 'Dr. Admin User',
      role: 'admin',
      phone: '+1 555-0100',
      department: 'Hospital Administration',
      created_at: new Date('2026-01-01').toISOString()
    },
    {
      id: 'usr-doc-01',
      email: 'doc123@docpad.in',
      password: bcrypt.hashSync('password123', 10),
      name: 'Dr. Robert Chen, MD',
      role: 'doctor',
      phone: '+1 555-0101',
      department: 'Cardiology',
      created_at: new Date('2026-01-02').toISOString()
    },
    {
      id: 'usr-doc-02',
      email: 'doc234@docpad.in',
      password: bcrypt.hashSync('password123', 10),
      name: 'Dr. Sarah Jenkins, MD',
      role: 'doctor',
      phone: '+1 555-0102',
      department: 'Neurology',
      created_at: new Date('2026-01-03').toISOString()
    },
    {
      id: 'usr-nurse-01',
      email: 'nurse123@docpad.in',
      password: bcrypt.hashSync('password123', 10),
      name: 'Nurse Emily Adams, RN',
      role: 'nurse',
      phone: '+1 555-0103',
      department: 'Emergency & Triage',
      created_at: new Date('2026-01-04').toISOString()
    },
    {
      id: 'usr-patient-01',
      email: 'patient123@docpad.in',
      password: bcrypt.hashSync('password123', 10),
      name: 'John Doe',
      role: 'patient',
      patient_id: 'pati123',
      phone: '+1 555-0199',
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'usr-patient-02',
      email: 'eleanor@docpad.in',
      password: bcrypt.hashSync('password123', 10),
      name: 'Eleanor Vance',
      role: 'patient',
      patient_id: 'PT-987-12',
      phone: '+1 555-0198',
      created_at: new Date('2026-01-12').toISOString()
    }
  ],
  patients: [
    {
      id: 'p-001',
      patient_id: 'pati123',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      contact: '+1 555-0199',
      email: 'patient123@docpad.in',
      reason_for_visit: 'Chest Pain, Fatigue & Occasional Shortness of Breath',
      disease: 'Essential Hypertension & Mild Angina',
      last_visit: '2026-08-01',
      is_active: true,
      created_by: 'usr-doc-01',
      created_at: new Date('2026-01-10').toISOString(),
      updated_at: new Date('2026-08-01').toISOString()
    },
    {
      id: 'p-002',
      patient_id: 'PT-987-12',
      name: 'Eleanor Vance',
      age: 32,
      gender: 'Female',
      contact: '+1 555-0198',
      email: 'eleanor@docpad.in',
      reason_for_visit: 'Recurring Severe Left-sided Migraines & Photosensitivity',
      disease: 'Chronic Migraine without Aura',
      last_visit: '2026-08-05',
      is_active: true,
      created_by: 'usr-doc-02',
      created_at: new Date('2026-01-12').toISOString(),
      updated_at: new Date('2026-08-05').toISOString()
    },
    {
      id: 'p-003',
      patient_id: 'PT-456-78',
      name: 'Michael Scott',
      age: 50,
      gender: 'Male',
      contact: '+1 555-0197',
      email: 'michael.scott@docpad.in',
      reason_for_visit: 'Routine Type 2 Diabetes Monitoring & HbA1c Followup',
      disease: 'Type 2 Diabetes Mellitus',
      last_visit: '2026-07-28',
      is_active: true,
      created_by: 'usr-doc-01',
      created_at: new Date('2026-02-01').toISOString(),
      updated_at: new Date('2026-07-28').toISOString()
    }
  ],
  medical_records: [
    {
      id: 'mr-001',
      patient_id: 'p-001',
      doctor_id: 'usr-doc-01',
      disease: 'Essential Hypertension',
      description: 'Patient presented with resting BP of 145/92 mmHg. Initiated lifestyle changes and daily ACE inhibitor regimen.',
      diagnosis_date: '2026-01-10',
      created_at: new Date('2026-01-10').toISOString()
    },
    {
      id: 'mr-002',
      patient_id: 'p-002',
      doctor_id: 'usr-doc-02',
      disease: 'Chronic Migraine',
      description: 'Neurological exam normal. MRI ordered to rule out structural anomalies.',
      diagnosis_date: '2026-01-12',
      created_at: new Date('2026-01-12').toISOString()
    }
  ],
  doctor_notes: [
    {
      id: 'dn-001',
      patient_id: 'p-001',
      doctor_id: 'usr-doc-01',
      doctor_name: 'Dr. Robert Chen, MD',
      note: 'Patient reports steady improvement in chest discomfort after taking Amlodipine 5mg. Instructed to maintain low-sodium diet and monitor morning blood pressure daily.',
      created_at: new Date('2026-08-01T10:30:00Z').toISOString(),
      updated_at: new Date('2026-08-01T10:30:00Z').toISOString()
    },
    {
      id: 'dn-002',
      patient_id: 'p-002',
      doctor_id: 'usr-doc-02',
      doctor_name: 'Dr. Sarah Jenkins, MD',
      note: 'Migraine frequency reduced from 4 times/week to once per week. Continue Sumatriptan 50mg PRN at symptom onset.',
      created_at: new Date('2026-08-05T14:15:00Z').toISOString(),
      updated_at: new Date('2026-08-05T14:15:00Z').toISOString()
    }
  ],
  reports: [
    {
      id: 'rep-001',
      patient_id: 'p-001',
      uploaded_by: 'usr-nurse-01',
      uploader_name: 'Nurse Emily Adams, RN',
      file_name: 'Comprehensive_Lipid_&_ECG_Report.pdf',
      file_path: '/uploads/demo-reports/lipid_ecg_john_doe.pdf',
      report_type: 'Blood Test & ECG',
      report_date: '2026-08-01',
      ai_analysis: {
        keyFindings: [
          'Sinus rhythm with mild left ventricular hypertrophy pattern',
          'Total Cholesterol: 228 mg/dL (Elevated)',
          'LDL Cholesterol: 145 mg/dL (Elevated)',
          'Triglycerides: 160 mg/dL (Borderline High)'
        ],
        abnormalFindings: [
          'Elevated LDL cholesterol levels requiring dietary management',
          'Borderline high triglycerides'
        ],
        importantValues: [
          { metric: 'BP', value: '142/88 mmHg', status: 'Elevated' },
          { metric: 'LDL', value: '145 mg/dL', status: 'High' },
          { metric: 'HbA1c', value: '5.6%', status: 'Normal' }
        ],
        severityLevel: 'Medium',
        shortSummary: 'Cardiovascular assessment indicates mild Stage 1 hypertension and hyperlipidemia. Cardiac rhythm is stable without acute ischemic changes.'
      },
      created_at: new Date('2026-08-01T09:00:00Z').toISOString()
    }
  ],
  prescriptions: [
    {
      id: 'rx-001',
      patient_id: 'p-001',
      doctor_id: 'usr-doc-01',
      doctor_name: 'Dr. Robert Chen, MD',
      file_name: 'Cardiology_Prescription_Aug2026.png',
      file_path: '/uploads/demo-prescriptions/prescription_john_doe.png',
      extracted_text: 'Rx: Amlodipine 5mg PO once daily. Atorvastatin 20mg PO at bedtime. Nitroglycerin 0.4mg SL as needed for acute chest tightness.',
      doctor_recommendation: 'Strict restriction of sodium intake (< 2g/day). Perform light aerobic walking 30 minutes daily. Follow up in 4 weeks with fresh lipid panel.',
      ai_analysis: {
        medicines: [
          { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
          { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (bedtime)', duration: '30 days' },
          { name: 'Nitroglycerin', dosage: '0.4mg', frequency: 'As needed (Sublingual)', duration: 'PRN' }
        ],
        doctorInstructions: 'Take Atorvastatin at bedtime. Keep Nitroglycerin easily accessible.',
        confidence: 'High'
      },
      created_at: new Date('2026-08-01T11:00:00Z').toISOString()
    }
  ],
  ai_summaries: [
    {
      id: 'ais-001',
      patient_id: 'p-001',
      summary: {
        patientName: 'John Doe',
        age: 45,
        lastVisit: '2026-08-01',
        knownCondition: 'Essential Hypertension & Mild Angina',
        importantMedicalHistory: 'Diagnosed with Stage 1 Hypertension in Jan 2026. Responding positively to calcium channel blocker therapy.',
        recentReports: 'Lipid panel shows total cholesterol 228 mg/dL and LDL 145 mg/dL. ECG demonstrates normal sinus rhythm.',
        currentPrescriptions: 'Amlodipine 5mg daily, Atorvastatin 20mg QHS, Nitroglycerin 0.4mg SL PRN.',
        importantObservations: 'Blood pressure improved to 142/88. Patient advised on sodium restriction and statin adherence. Overall prognosis is stable.',
        generatedAt: new Date('2026-08-01T11:30:00Z').toISOString()
      },
      generated_at: new Date('2026-08-01T11:30:00Z').toISOString(),
      updated_at: new Date('2026-08-01T11:30:00Z').toISOString()
    }
  ],
  audit_logs: [
    {
      id: 'log-001',
      user_id: 'usr-admin-01',
      user_email: 'admin123@docpad.in',
      user_role: 'admin',
      action: 'SYSTEM_INITIALIZATION',
      resource_type: 'system',
      resource_id: 'sys-01',
      details: { note: 'AI DOCPAD medical management initialized with default demo dataset' },
      created_at: new Date().toISOString()
    }
  ]
};

export const DbService = {
  // --- USER PROFILES ---
  async getUserByEmailOrPatientId(identifier) {
    const term = identifier.trim().toLowerCase();
    
    // Check mock data first
    let user = mockDb.users.find(u => 
      u.email.toLowerCase() === term || 
      (u.patient_id && u.patient_id.toLowerCase() === term)
    );

    if (user) return user;

    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').or(`email.eq.${term},patient_id.eq.${term}`).maybeSingle();
      if (data) return data;
    }

    return null;
  },

  async getUserById(id) {
    const user = mockDb.users.find(u => u.id === id);
    if (user) return user;
    if (supabase) {
      const { data } = await supabase.from('profiles').select('*').eq('id', id).maybeSingle();
      return data;
    }
    return null;
  },

  async getAllUsers() {
    return mockDb.users;
  },

  async createUser(userData) {
    const newUser = {
      id: `usr-${uuidv4().slice(0, 8)}`,
      ...userData,
      password: bcrypt.hashSync(userData.password || 'password123', 10),
      created_at: new Date().toISOString()
    };

    mockDb.users.push(newUser);

    if (supabase) {
      try {
        await supabase.from('profiles').insert([{
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          patient_id: newUser.patient_id || null,
          phone: newUser.phone || null,
          department: newUser.department || null
        }]);
      } catch (err) {
        console.warn('Supabase insert user error:', err.message);
      }
    }

    return newUser;
  },

  // --- PATIENTS ---
  async getPatients({ search, role, patientId }) {
    let list = [...mockDb.patients];

    // Filter active unless admin or specific match
    if (role !== 'admin') {
      list = list.filter(p => p.is_active);
    }

    if (patientId) {
      list = list.filter(p => p.patient_id === patientId || p.id === patientId);
    } else if (search) {
      const s = search.trim().toLowerCase();
      list = list.filter(p => 
        p.patient_id.toLowerCase().includes(s) || 
        p.name.toLowerCase().includes(s) ||
        (p.disease && p.disease.toLowerCase().includes(s))
      );
    }

    return list;
  },

  async getPatientById(id) {
    const patient = mockDb.patients.find(p => p.id === id || p.patient_id === id);
    if (patient) return patient;
    if (supabase) {
      const { data } = await supabase.from('patients').select('*').or(`id.eq.${id},patient_id.eq.${id}`).maybeSingle();
      return data;
    }
    return null;
  },

  async createPatient(patientData, createdByUserId) {
    // Check patient ID uniqueness
    const exists = mockDb.patients.some(p => p.patient_id.toLowerCase() === patientData.patient_id.toLowerCase());
    if (exists) {
      throw new Error(`Patient ID '${patientData.patient_id}' already exists.`);
    }

    const newPatient = {
      id: `p-${uuidv4().slice(0, 8)}`,
      patient_id: patientData.patient_id,
      name: patientData.name,
      age: Number(patientData.age),
      gender: patientData.gender,
      contact: patientData.contact,
      email: patientData.email || `${patientData.patient_id.toLowerCase()}@docpad.in`,
      reason_for_visit: patientData.reason_for_visit,
      disease: patientData.disease || 'Initial Evaluation',
      last_visit: patientData.last_visit || new Date().toISOString().split('T')[0],
      is_active: true,
      created_by: createdByUserId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockDb.patients.unshift(newPatient);

    // Also auto-create patient account user profile so patient can log in!
    const patientAccount = {
      id: `usr-${newPatient.id}`,
      email: newPatient.email,
      password: bcrypt.hashSync(patientData.password || 'password123', 10),
      name: newPatient.name,
      role: 'patient',
      patient_id: newPatient.patient_id,
      phone: newPatient.contact,
      created_at: new Date().toISOString()
    };
    mockDb.users.push(patientAccount);

    if (supabase) {
      try {
        await supabase.from('patients').insert([newPatient]);
        await supabase.from('profiles').insert([patientAccount]);
      } catch (err) {
        console.warn('Supabase create patient warning:', err.message);
      }
    }

    return newPatient;
  },

  async updatePatient(id, updateData) {
    const idx = mockDb.patients.findIndex(p => p.id === id || p.patient_id === id);
    if (idx === -1) throw new Error('Patient not found');

    mockDb.patients[idx] = {
      ...mockDb.patients[idx],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    if (supabase) {
      try {
        await supabase.from('patients').update(updateData).eq('id', mockDb.patients[idx].id);
      } catch (err) {
        console.warn('Supabase update patient warning:', err.message);
      }
    }

    return mockDb.patients[idx];
  },

  async deactivatePatient(id) {
    const idx = mockDb.patients.findIndex(p => p.id === id || p.patient_id === id);
    if (idx === -1) throw new Error('Patient not found');

    mockDb.patients[idx].is_active = false;
    mockDb.patients[idx].updated_at = new Date().toISOString();

    if (supabase) {
      try {
        await supabase.from('patients').update({ is_active: false }).eq('id', mockDb.patients[idx].id);
      } catch (err) {
        console.warn('Supabase deactivate patient warning:', err.message);
      }
    }

    return mockDb.patients[idx];
  },

  async deletePatientPermanent(id) {
    const target = mockDb.patients.find(p => p.id === id || p.patient_id === id);
    if (!target) throw new Error('Patient not found');

    const pid = target.id;
    mockDb.patients = mockDb.patients.filter(p => p.id !== pid);
    mockDb.doctor_notes = mockDb.doctor_notes.filter(n => n.patient_id !== pid);
    mockDb.reports = mockDb.reports.filter(r => r.patient_id !== pid);
    mockDb.prescriptions = mockDb.prescriptions.filter(rx => rx.patient_id !== pid);
    mockDb.ai_summaries = mockDb.ai_summaries.filter(s => s.patient_id !== pid);
    mockDb.medical_records = mockDb.medical_records.filter(m => m.patient_id !== pid);

    if (supabase) {
      try {
        await supabase.from('patients').delete().eq('id', pid);
      } catch (err) {
        console.warn('Supabase delete patient warning:', err.message);
      }
    }

    return true;
  },

  // --- DOCTOR NOTES ---
  async getNotesByPatientId(patientId) {
    return mockDb.doctor_notes
      .filter(n => n.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createNote({ patient_id, doctor_id, doctor_name, note }) {
    const newNote = {
      id: `dn-${uuidv4().slice(0, 8)}`,
      patient_id,
      doctor_id,
      doctor_name: doctor_name || 'Dr. Medical Staff',
      note,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    mockDb.doctor_notes.unshift(newNote);

    if (supabase) {
      try {
        await supabase.from('doctor_notes').insert([newNote]);
      } catch (err) {
        console.warn('Supabase create note warning:', err.message);
      }
    }

    return newNote;
  },

  async updateNote(noteId, noteText) {
    const idx = mockDb.doctor_notes.findIndex(n => n.id === noteId);
    if (idx === -1) throw new Error('Doctor note not found');

    mockDb.doctor_notes[idx].note = noteText;
    mockDb.doctor_notes[idx].updated_at = new Date().toISOString();

    return mockDb.doctor_notes[idx];
  },

  // --- REPORTS ---
  async getReportsByPatientId(patientId) {
    return mockDb.reports
      .filter(r => r.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createReport(reportData) {
    const newReport = {
      id: `rep-${uuidv4().slice(0, 8)}`,
      ...reportData,
      report_date: reportData.report_date || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };

    mockDb.reports.unshift(newReport);

    if (supabase) {
      try {
        await supabase.from('reports').insert([newReport]);
      } catch (err) {
        console.warn('Supabase create report warning:', err.message);
      }
    }

    return newReport;
  },

  async updateReportAiAnalysis(reportId, aiAnalysis) {
    const idx = mockDb.reports.findIndex(r => r.id === reportId);
    if (idx === -1) throw new Error('Report not found');

    mockDb.reports[idx].ai_analysis = aiAnalysis;
    return mockDb.reports[idx];
  },

  // --- PRESCRIPTIONS ---
  async getPrescriptionsByPatientId(patientId) {
    return mockDb.prescriptions
      .filter(p => p.patient_id === patientId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createPrescription(rxData) {
    const newRx = {
      id: `rx-${uuidv4().slice(0, 8)}`,
      ...rxData,
      created_at: new Date().toISOString()
    };

    mockDb.prescriptions.unshift(newRx);

    if (supabase) {
      try {
        await supabase.from('prescriptions').insert([newRx]);
      } catch (err) {
        console.warn('Supabase create prescription warning:', err.message);
      }
    }

    return newRx;
  },

  async updatePrescriptionRecommendation(rxId, doctorRecommendation) {
    const idx = mockDb.prescriptions.findIndex(p => p.id === rxId);
    if (idx === -1) throw new Error('Prescription not found');

    mockDb.prescriptions[idx].doctor_recommendation = doctorRecommendation;
    return mockDb.prescriptions[idx];
  },

  async updatePrescriptionAiAnalysis(rxId, { extractedText, aiAnalysis }) {
    const idx = mockDb.prescriptions.findIndex(p => p.id === rxId);
    if (idx === -1) throw new Error('Prescription not found');

    if (extractedText) mockDb.prescriptions[idx].extracted_text = extractedText;
    if (aiAnalysis) mockDb.prescriptions[idx].ai_analysis = aiAnalysis;
    return mockDb.prescriptions[idx];
  },

  // --- MEDICAL RECORDS ---
  async getMedicalRecordsByPatientId(patientId) {
    return mockDb.medical_records.filter(m => m.patient_id === patientId);
  },

  async createMedicalRecord(recordData) {
    const newRecord = {
      id: `mr-${uuidv4().slice(0, 8)}`,
      ...recordData,
      created_at: new Date().toISOString()
    };
    mockDb.medical_records.unshift(newRecord);
    return newRecord;
  },

  // --- AI SUMMARIES ---
  async getAiSummaryByPatientId(patientId) {
    return mockDb.ai_summaries.find(s => s.patient_id === patientId) || null;
  },

  async saveAiSummary(patientId, summaryData) {
    const idx = mockDb.ai_summaries.findIndex(s => s.patient_id === patientId);
    const summaryRecord = {
      id: idx !== -1 ? mockDb.ai_summaries[idx].id : `ais-${uuidv4().slice(0, 8)}`,
      patient_id: patientId,
      summary: summaryData,
      generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (idx !== -1) {
      mockDb.ai_summaries[idx] = summaryRecord;
    } else {
      mockDb.ai_summaries.unshift(summaryRecord);
    }

    return summaryRecord;
  },

  // --- AUDIT LOGS ---
  async logAudit({ user_id, user_email, user_role, action, resource_type, resource_id, details }) {
    const logEntry = {
      id: `log-${uuidv4().slice(0, 8)}`,
      user_id: user_id || null,
      user_email: user_email || 'system',
      user_role: user_role || 'system',
      action,
      resource_type,
      resource_id: resource_id || null,
      details: details || {},
      created_at: new Date().toISOString()
    };

    mockDb.audit_logs.unshift(logEntry);

    if (supabase) {
      try {
        await supabase.from('audit_logs').insert([logEntry]);
      } catch (err) {
        console.warn('Supabase audit log insert error:', err.message);
      }
    }

    return logEntry;
  },

  async getAuditLogs() {
    return mockDb.audit_logs;
  },

  // Stats for Dashboards
  async getDashboardStats() {
    const totalPatients = mockDb.patients.filter(p => p.is_active).length;
    const totalDoctors = mockDb.users.filter(u => u.role === 'doctor').length;
    const totalNurses = mockDb.users.filter(u => u.role === 'nurse').length;
    const totalReports = mockDb.reports.length;
    const totalPrescriptions = mockDb.prescriptions.length;

    return {
      totalPatients,
      totalDoctors,
      totalNurses,
      totalReports,
      totalPrescriptions,
      recentPatients: mockDb.patients.slice(0, 5)
    };
  }
};
