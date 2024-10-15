import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  images: z
    .object({
      url: z.string(),
    })
    .array(),
  price: z.coerce.number().min(1),
  stockCount: z.coerce.number().min(1),
  categoryId: z.string().min(1),
  colorId: z.string().min(1),
  sizeId: z.string().min(1),
  isFeatured: z.boolean().default(false),
  isArchived: z.boolean().default(false),
});

export type ProductSchemaType = z.infer<typeof ProductSchema>;
