'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateColorSchema, CreateColorSchemaType } from '@/schema/color';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const CreateColorAction = async (values: CreateColorSchemaType) => {
  const validationField = CreateColorSchema.safeParse(values);

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
    return { error: 'You are not allowed to create color.' };
  }

  await db.color.create({
    data: {
      name,
      value,
    },
  });

  revalidatePath('/admin/color', 'page');

  return { success: 'Color created successfully!' };
};

export async function ColorDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.SUPER_ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.color.delete({
      where: { id },
    });

    revalidatePath('/admin/color', 'page');

    return { success: 'Color successfully deleted!' };
  } catch (error) {
    console.error('ColorDeleteAction.error', error);
  }
}

export const EditColorAction = async (
  values: CreateColorSchemaType,
  id: string
) => {
  const validationField = CreateColorSchema.safeParse(values);

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
    session.user.role === UserRole.USER ||
    session.user.role === UserRole.DELIVERY
  ) {
    return { error: 'You are not allowed to update color.' };
  }

  await db.color.update({
    where: {
      id,
    },
    data: {
      value,
      name,
    },
  });

  revalidatePath('/admin/color', 'page');

  return { success: 'Color updated successfully!' };
};
