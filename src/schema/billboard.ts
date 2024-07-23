import { z } from 'zod';

export const CreateBillboardSchema = z.object({
  label: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  imageUrl: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export type CreateBillboardSchemaType = z.infer<typeof CreateBillboardSchema>;
