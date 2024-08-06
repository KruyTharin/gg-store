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

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create billboard.' };
  }

  await db.color.create({
    data: {
      name,
      value,
    },
  });

  revalidatePath('/color', 'page');

  return { success: 'Color created successfully!' };
};

export async function ColorDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.color.delete({
      where: { id },
    });

    revalidatePath('/color', 'page');

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

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to create color.' };
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

  revalidatePath('/color', 'page');

  return { success: 'Color updated successfully!' };
};
