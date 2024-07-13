import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),

  code: z.optional(z.string()),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;
