import { z } from 'zod';

export const CreateSizeSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  value: z.string().min(1, {
    message: 'Value must be at least 1 characters.',
  }),
});

export type CreateSizeSchemaType = z.infer<typeof CreateSizeSchema>;
