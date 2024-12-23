import { z } from "zod";

export const entrySchema = z.object({
  userId: z.string().nonempty("User ID is required."),
  calories: z.number().min(0, "Calories must be a positive number."),
  weight: z.number().min(0, "Weight must be a positive number."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)."),
});
