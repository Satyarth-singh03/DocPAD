# AI DOCPAD — Medical Patient Record Management System

**AI DOCPAD** is a full-stack, enterprise-grade medical record management application designed for **Doctors, Nurses, Admins, and Patients**. It allows authorized healthcare professionals to seamlessly manage patient records, clinical reports, prescriptions, doctor notes, and AI-generated summaries powered by **Google Gemini Multimodal AI**.

---

## 🌟 Demo Accounts & Credentials

The system comes pre-seeded with realistic healthcare demo accounts for testing:

| Role | Login Identifier / Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin123@docpad.in` | `password123` | Full access: Add staff/doctors/nurses/patients, manage users, view audit logs, deactivate/delete records |
| **Doctor** | `doc123@docpad.in` | `password123` | Patient lookup, write notes, upload reports/prescriptions, view AI summaries, edit recommendations |
| **Doctor** | `doc234@docpad.in` | `password123` | Patient lookup, write notes, upload reports/prescriptions, view AI summaries, edit recommendations |
| **Nurse** | `nurse123@docpad.in` | `password123` | Patient triage search, register new patient intake, upload lab reports |
| **Patient** | `pati123` *(or `patient123@docpad.in`)* | `password123` | Read-Only view restricted to own profile, medical history, reports, prescriptions, notes & AI summary |

---

## 🛠️ Technology Stack

- **Frontend**: React.js (v18), Javascript, Tailwind CSS (v4), Vite, Lucide Icons
- **Backend**: Node.js, Express.js REST APIs
- **Database**: Supabase PostgreSQL + Standalone/Embedded Fallback Engine
- **Authentication**: Supabase Auth / JWT Session Validation
- **File Storage**: Supabase Storage (`medical-reports` & `prescriptions` buckets)
- **AI Integration**: Google Gemini API (`@google/generative-ai`) for Vision OCR, report analysis, and clinical summaries
- **Validation**: Zod schema validation
- **Development**: Git, GitHub, VS Code

---

## 🏗️ Architecture & Folder Structure

```
AI DOCPAD/
├── .gitignore                  # Root Git ignore rule set
├── package.json                # Root package configuration
├── README.md                   # Complete documentation
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema, indexes & RLS policies
├── server/                     # Express REST API Server
│   ├── .env                    # Environment variables
│   ├── .gitignore
│   ├── package.json
│   ├── server.js               # Express entry file
│   ├── config/
│   │   ├── supabase.js         # Supabase client setup
│   │   └── gemini.js           # Google Gemini AI client setup
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── patient.controller.js
│   │   ├── note.controller.js
│   │   ├── report.controller.js
│   │   ├── prescription.controller.js
│   │   ├── ai.controller.js
│   │   ├── user.controller.js
│   │   └── audit.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   ├── upload.middleware.js
│   │   └── error.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── patient.routes.js
│   │   ├── note.routes.js
│   │   ├── report.routes.js
│   │   ├── prescription.routes.js
│   │   ├── ai.routes.js
│   │   ├── user.routes.js
│   │   └── audit.routes.js
│   ├── services/
│   │   ├── db.service.js       # Database abstraction layer with seed data
│   │   ├── gemini.service.js   # Multimodal document analysis & summaries
│   │   └── supabase.service.js
│   └── validators/
│       ├── patient.validator.js
│       ├── note.validator.js
│       ├── report.validator.js
│       └── user.validator.js
└── client/                     # React Frontend Web Application
    ├── .gitignore
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── index.css           # Tailwind CSS styling tokens
        ├── main.jsx
        ├── App.jsx
        ├── context/
        │   └── AuthContext.jsx # Global session & authorization state
        ├── services/
        │   └── api.js          # REST API HTTP client
        ├── components/
        │   ├── common/         # SearchBar, Toast, Modal, ConfirmDialog, Badge, LoadingSpinner
        │   ├── layout/         # Light-Blue Navbar, Sidebar navigation
        │   ├── patient/        # AddPatientModal, PatientTable, PatientProfile, Profile Tabs
        │   └── dashboard/      # AdminDashboard, DoctorDashboard, NurseDashboard, PatientDashboard
        └── pages/
            ├── LoginPage.jsx
            ├── DashboardPage.jsx
            ├── PatientsPage.jsx
            ├── UsersManagementPage.jsx
            └── AuditLogsPage.jsx
```

---

## ⚡ Local Setup & Quick Start

### 1. Install Dependencies

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

### 2. Set Up Environment Variables

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=aidocpad_super_secret_jwt_key_2026_healthcare

# Supabase Credentials (Optional for local execution, required for cloud PostgreSQL)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API Key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Run Application

```bash
# Terminal 1: Run Express Server (Port 5000)
cd server
npm run dev

# Terminal 2: Run React Frontend (Port 3000)
cd client
npm run dev
```

Navigate to `http://localhost:3000` in your web browser.

---

## 🗄️ Database & Storage Setup (Supabase Setup)

### 1. Database Schema Execution
Open your Supabase SQL Editor and execute `supabase/schema.sql`. This initializes:
- `profiles` table linked with user credentials
- `patients` table (Patient ID unique index)
- `medical_records` table
- `doctor_notes` table
- `reports` metadata table
- `prescriptions` metadata table
- `ai_summaries` table
- `audit_logs` table
- Row Level Security (RLS) policies

### 2. Storage Buckets Setup
In your Supabase Dashboard:
1. Navigate to **Storage** -> **Buckets**.
2. Create bucket named `medical-reports` (Public or Authenticated Read).
3. Create bucket named `prescriptions` (Public or Authenticated Read).

---

## 🤖 Google Gemini AI Multimodal Integration

The backend service (`server/services/gemini.service.js`) utilizes Gemini Vision models to automatically analyze medical documents:

1. **Prescription Analysis**:
   - Accepts image or PDF prescription files.
   - Extracts structured medicine details: *Name, Dosage, Frequency, Duration, Doctor Instructions*.
   - Clearly labels output as "AI-Generated Analysis" with medical verification disclaimers.

2. **Medical Report Analysis**:
   - Accepts lab results, X-rays, ECGs, or pathology scans.
   - Extracts: *Key Findings, Abnormal Observations, Important Metrics & Values, Severity Level (Low/Medium/High), Short Summary*.

3. **AI Comprehensive Patient Summary**:
   - Synthesizes patient demographics, medical history, lab reports, doctor notes, and prescriptions into an executive summary.

---

## 📡 REST API Documentation

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticate user via Email/Patient ID & password |
| `GET` | `/api/auth/me` | Authenticated | Verify active user token & details |
| `GET` | `/api/patients` | Admin, Doctor, Nurse, Patient (self) | List or search patients by ID/Name |
| `POST` | `/api/patients` | Admin, Doctor, Nurse | Register new patient profile (Zod validated) |
| `GET` | `/api/patients/:id` | All Authenticated | Get full patient profile with all 6 tabs |
| `PUT` | `/api/patients/:id` | Admin, Doctor, Nurse | Update patient information |
| `DELETE`| `/api/patients/:id` | Admin, Doctor, Nurse | Soft deactivate patient record (`is_active=false`) |
| `DELETE`| `/api/patients/:id/permanent` | Admin | Permanently delete patient record |
| `POST` | `/api/notes/patient/:patientId` | Admin, Doctor, Nurse | Record doctor clinical note |
| `PUT` | `/api/notes/:id` | Admin, Doctor, Nurse | Update existing doctor note |
| `POST` | `/api/reports/patient/:patientId` | Admin, Doctor, Nurse | Upload lab report & run Gemini Vision AI |
| `POST` | `/api/prescriptions/patient/:patientId` | Admin, Doctor, Nurse | Upload prescription & run Gemini OCR |
| `PUT` | `/api/prescriptions/:id/recommendation` | Admin, Doctor, Nurse | Edit Doctor Recommendation section |
| `GET` | `/api/ai/patient-summary/:patientId` | All Authenticated | Generate/Fetch AI Patient Summary |
| `GET` | `/api/users` | Admin | List all staff & user accounts |
| `POST` | `/api/users` | Admin | Register new doctor/nurse account |
| `GET` | `/api/audit` | Admin | Retrieve security audit logs |

---

## 🔒 Security & Compliance Notes

- **Password Safety**: Passwords are hashed using bcrypt with salt factor 10. Passwords are never stored in plain text.
- **Role Enforcement**: Middleware strictly blocks Patients from accessing Admin/Doctor/Nurse endpoints or other patients' records.
- **Input Validation**: All payloads validated with Zod schemas.
- **Audit Logs**: Every login, patient creation, file upload, note entry, and record deactivation is logged in `audit_logs`.
- **API Secrets**: Gemini API keys and Supabase Service Role keys are kept server-side in `.env` and never exposed to the client.

---

## 🚀 Deployment Instructions

- **Frontend Deployment**: Host the `client/` Vite application on Vercel or Netlify. Set proxy/API base URL to your backend endpoint.
- **Backend Deployment**: Host the `server/` Node/Express service on Render, Railway, or AWS App Runner. Provide `PORT`, `JWT_SECRET`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY` in environment variables.
- **Database & Storage**: Configured via Supabase Cloud Console.
