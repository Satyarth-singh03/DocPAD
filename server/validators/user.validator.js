import { z } from 'zod';

export const userSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Full name is required'),
  role: z.enum(['admin', 'doctor', 'nurse', 'patient'], { required_error: 'Role is required' }),
  patient_id: z.string().optional(),
  phone: z.string().optional(),
  department: z.string().optional()
});
