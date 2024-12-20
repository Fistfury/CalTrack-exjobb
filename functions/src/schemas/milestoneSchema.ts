import {z} from 'zod';

export const milestoneSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  description: z
      .string()
      .optional()
      .transform((val) => (val ? val.trim() : val)),
  goalDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

export type MilestoneData = z.infer<typeof milestoneSchema>;
