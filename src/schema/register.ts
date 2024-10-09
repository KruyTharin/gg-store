import { z } from 'zod';

export const RegisterSchema = z.object({
  username: z.string().min(2, {
    message: 'Password must be at least 2 characters.',
  }),
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
