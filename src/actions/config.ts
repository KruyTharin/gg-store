'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateConfigSchema, CreateConfigSchemaType } from '@/schema/config';
import { UserRole } from '@prisma/client';

export const CreateConfigAction = async (values: CreateConfigSchemaType) => {
  const validationField = CreateConfigSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create config.' };
  }

  await db.config.create({
    data: validationField.data,
  });

  return { success: 'Config created successfully!' };
};
