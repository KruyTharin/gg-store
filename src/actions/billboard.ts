'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
  CreateBillboardSchema,
  CreateBillboardSchemaType,
} from '@/schema/billboard';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export async function BillboardDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.SUPER_ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.billboard.delete({
      where: { id },
    });

    revalidatePath('/admin/billboard', 'page');

    return { success: 'Billboard successfully deleted!' };
  } catch (error) {
    console.error('BillboardDeleteAction.error', error);
  }
}

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

  if (
    session.user.role === UserRole.USER ||
    session.user.role === UserRole.DELIVERY
  ) {
    return { error: 'You are not allowed to create billboard.' };
  }

  await db.billboard.create({
    data: {
      label,
      imageUrl,
    },
  });

  revalidatePath('/admin/billboard', 'page');

  return { success: 'Billboard created successfully!' };
};

export const EditBillboardAction = async (
  values: CreateBillboardSchemaType,
  id: string
) => {
  const validationField = CreateBillboardSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  if (!id) {
    return { error: 'Missing billboard ID!' };
  }

  const { imageUrl, label } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (
    session.user.role === UserRole.USER ||
    session.user.role === UserRole.DELIVERY
  ) {
    return { error: 'You are not allowed to update billboard.' };
  }

  await db.billboard.update({
    where: {
      id,
    },
    data: {
      label,
      imageUrl,
    },
  });

  revalidatePath('/admin/billboard', 'page');

  return { success: 'Billboard updated successfully!' };
};
