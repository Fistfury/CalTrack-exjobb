import {z} from 'zod';

export const userRegistrationSchema = z.object({
  name: z.string().min(1, 'Name is required').trim(),
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
  age: z.number().int().min(0, 'Age must be a positive number'),
  weight: z.number().min(0, 'Weight must be a positive number'),
  length: z.number().min(0, 'Length must be a positive number'),
  fitnessGoals: z.string().min(1, 'Fitness goals are required').trim(),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email').trim(),
  password: z.string().min(6, 'Password must be at least 6 characters').trim(),
});

export type UserRegistrationData = z.infer<typeof userRegistrationSchema>;
export type UserLoginData = z.infer<typeof userLoginSchema>;
