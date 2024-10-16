'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateSizeSchema, CreateSizeSchemaType } from '@/schema/size';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const CreateSizeAction = async (values: CreateSizeSchemaType) => {
  const validationField = CreateSizeSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { name, value } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (
    session.user.role === UserRole.DELIVERY ||
    session.user.role === UserRole.USER
  ) {
    return { error: 'You are not allowed to create size.' };
  }

  await db.size.create({
    data: {
      name,
      value,
    },
  });

  revalidatePath('/admin/size', 'page');

  return { success: 'Size created successfully!' };
};

export async function SizeDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.SUPER_ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.size.delete({
      where: { id },
    });

    revalidatePath('/admin/size', 'page');

    return { success: 'Size successfully deleted!' };
  } catch (error) {
    console.error('SizeDeleteAction.error', error);
  }
}

export const EditSizeAction = async (
  values: CreateSizeSchemaType,
  id: string
) => {
  const validationField = CreateSizeSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  if (!id) {
    return { error: 'Missing size ID!' };
  }

  const { name, value } = validationField.data;

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (
    session.user.role === UserRole.DELIVERY ||
    session.user.role === UserRole.USER
  ) {
    return { error: 'You are not allowed to create sizes.' };
  }

  await db.size.update({
    where: {
      id,
    },
    data: {
      value,
      name,
    },
  });

  revalidatePath('/admin/size', 'page');

  return { success: 'Size updated successfully!' };
};
