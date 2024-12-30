import { z } from "zod";

export const userRegistrationSchema = z.object({
  firebaseUid: z.string().min(1, "firebaseUid is required").optional(),
  name: z.string().min(1, "Name is required").trim(),
  email: z.string().email("Invalid email").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
  age: z.number().int().min(0, "Age must be a positive number"),
  weight: z.number().min(0, "Weight must be a positive number"),
  height: z.number().min(0, "Height must be a positive number"),
  sex: z.enum(["male", "female"], { required_error: "Sex is required" }),
  activityLevel: z.enum(
    ["sedentary", "light", "moderate", "active", "veryActive"],
    { required_error: "Activity level is required" }
  ),
});

export const userLoginSchema = z.object({
  firebaseUid: z.string().min(1, "firebaseUid is required").optional(),
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
