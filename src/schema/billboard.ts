import { z } from 'zod';

export const CreateBillboardSchema = z.object({
  label: z.string().min(2, {
    message: 'Label must be at least 2 characters.',
  }),
  imageUrl: z.string().min(2, {
    message: 'Image is required!',
  }),
});

export type CreateBillboardSchemaType = z.infer<typeof CreateBillboardSchema>;
