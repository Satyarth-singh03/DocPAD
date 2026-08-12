-- AI DOCPAD Medical Patient Record Management System Schema
-- Supabase PostgreSQL Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users or standalone auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'doctor', 'nurse', 'patient')),
  patient_id VARCHAR(100),
  phone VARCHAR(50),
  department VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT NOT NULL,
  gender VARCHAR(20) NOT NULL CHECK (gender IN ('Male', 'Female', 'Other')),
  contact VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  reason_for_visit TEXT NOT NULL,
  disease VARCHAR(255),
  last_visit DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.profiles(id),
  disease VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  diagnosis_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. DOCTOR NOTES TABLE
CREATE TABLE IF NOT EXISTS public.doctor_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.profiles(id),
  doctor_name VARCHAR(255) NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES public.profiles(id),
  uploader_name VARCHAR(255),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  report_type VARCHAR(100) NOT NULL,
  report_date DATE DEFAULT CURRENT_DATE,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  doctor_id UUID REFERENCES public.profiles(id),
  doctor_name VARCHAR(255),
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  extracted_text TEXT,
  doctor_recommendation TEXT,
  ai_analysis JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. AI SUMMARIES TABLE
CREATE TABLE IF NOT EXISTS public.ai_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID UNIQUE REFERENCES public.patients(id) ON DELETE CASCADE,
  summary JSONB NOT NULL,
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  user_email VARCHAR(255),
  user_role VARCHAR(50),
  action VARCHAR(255) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id VARCHAR(255),
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES FOR FAST SEARCH
CREATE INDEX IF NOT EXISTS idx_patients_patient_id ON public.patients(patient_id);
CREATE INDEX IF NOT EXISTS idx_patients_name ON public.patients(name);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_patient_id ON public.doctor_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_reports_patient_id ON public.reports(patient_id);
CREATE INDEX IF NOT EXISTS idx_prescriptions_patient_id ON public.prescriptions(patient_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read/write if using anon key with backend validation or service role key
CREATE POLICY "Allow service role all" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow service role patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow service role notes" ON public.doctor_notes FOR ALL USING (true);
CREATE POLICY "Allow service role reports" ON public.reports FOR ALL USING (true);
CREATE POLICY "Allow service role prescriptions" ON public.prescriptions FOR ALL USING (true);
CREATE POLICY "Allow service role ai_summaries" ON public.ai_summaries FOR ALL USING (true);
CREATE POLICY "Allow service role audit_logs" ON public.audit_logs FOR ALL USING (true);

-- STORAGE BUCKETS SETUP INSTRUCTIONS:
-- In Supabase Console -> Storage -> Buckets:
-- Create bucket "medical-reports" (public/authenticated read)
-- Create bucket "prescriptions" (public/authenticated read)
