import { z } from "zod";

export const entrySchema = z.object({
  userId: z.string().optional(), // Mark as optional since it's derived in the backend
  calories: z.number().min(0, "Calories must be a positive number.").optional(), // Optional if not always sent
  weight: z.number().min(0, "Weight must be a positive number."), // Required
  caloriesMet: z.boolean().optional(), // Optional
  achieved: z.boolean().optional(), // Add achieved as optional
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)."), // Required
});

export const querySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});
