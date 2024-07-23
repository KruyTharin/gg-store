'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
  CreateBillboardSchema,
  CreateBillboardSchemaType,
} from '@/schema/billboard';
import { UserRole } from '@prisma/client';

export const CreateBillboardAction = async (
  values: CreateBillboardSchemaType
) => {
  const validationField = CreateBillboardSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { imageUrl, label } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create billboard.' };
  }

  await db.billboard.create({
    data: {
      label,
      imageUrl,
    },
  });

  return { success: 'Billboard created successfully!' };
};
