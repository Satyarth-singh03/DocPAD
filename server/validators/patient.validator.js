import { z } from 'zod';

export const patientSchema = z.object({
  patient_id: z.string().min(3, 'Patient ID must be at least 3 characters'),
  name: z.string().min(2, 'Name is required'),
  age: z.coerce.number().min(0, 'Age must be 0 or greater').max(130, 'Age is out of realistic range'),
  gender: z.enum(['Male', 'Female', 'Other'], { required_error: 'Gender is required' }),
  contact: z.string().min(5, 'Contact number/email is required'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  reason_for_visit: z.string().min(3, 'Reason for visit is required'),
  disease: z.string().optional(),
  last_visit: z.string().optional(),
  password: z.string().optional()
});

export const updatePatientSchema = patientSchema.partial();
