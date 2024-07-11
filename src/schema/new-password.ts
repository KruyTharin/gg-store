import { z } from 'zod';

export const NewPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long') // Minimum length
      .trim(), // Removes leading/trailing whitespace
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long') // Minimum length
      .trim(), // Removes leading/trailing whitespace
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords did not match',
    path: ['confirmPassword'],
  });

export type NewPasswordSchemaType = z.infer<typeof NewPasswordSchema>;
