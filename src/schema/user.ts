// app/api/users/route.ts
import { UserRole } from '@prisma/client';
import { z } from 'zod';

// Define the validation schema
export const userSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  image: z
    .string()
    .min(2, {
      message: 'Image is required!',
    })
    .optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long.' }),
});

export type UserSchemaSchemaType = z.infer<typeof userSchema>;

// Define the validation schema
export const updateUserSchema = z
  .object({
    name: z.string().min(1, { message: 'Name is required.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    image: z.string().optional(),
    role: z.enum([
      UserRole.ADMIN,
      UserRole.DELIVERY,
      UserRole.USER,
      UserRole.SUPER_ADMIN,
    ]),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .optional(), // Password is optional
    newPassword: z
      .string()
      .min(8, { message: 'New password must be at least 8 characters long.' })
      .optional(), // New password is also optional
  })
  .refine(
    (data) => {
      // Ensure both password and newPassword are provided together
      if (data.password && !data.newPassword) {
        return false; // Fail if password is provided but newPassword isn't
      }

      if (!data.password && data.newPassword) {
        return false; // Fail if newPassword is provided but password isn't
      }

      return true;
    },
    {
      message:
        'Both password and new password are required when updating passwords.',
      path: ['newPassword'], // Show error on the newPassword field
    }
  );

export type UpdateUserSchemaSchemaType = z.infer<typeof updateUserSchema>;
