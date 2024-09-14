import { z } from 'zod';

export const CreateConfigSchema = z.object({
  phoneNumber: z.string().min(2, {
    message: 'phoneNumber must be at least 2 characters.',
  }),

  slogan: z.string().min(2, {
    message: 'slogan must be at least 2 characters.',
  }),

  location: z.string().min(2, {
    message: 'location must be at least 2 characters.',
  }),
  locationUrl: z.string().min(2, {
    message: 'locationUrl must be at least 2 characters.',
  }),
  facebookUrl: z.string().min(2, {
    message: 'facebookUrl must be at least 2 characters.',
  }),
  telegramUrl: z.string().min(2, {
    message: 'facebookUrl must be at least 2 characters.',
  }),
  email: z.string().email(),
});

export type CreateConfigSchemaType = z.infer<typeof CreateConfigSchema>;
