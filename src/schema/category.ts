import { z } from 'zod';

export const CreateCategorySchema = z.object({
  billboardId: z.string().cuid(),
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  imageUrl: z.string().min(2, {
    message: 'Image is required!',
  }),
});

export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
