import { z } from 'zod';

export const noteSchema = z.object({
  note: z.string().min(2, 'Note content cannot be empty')
});
