'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import { CreateConfigSchema, CreateConfigSchemaType } from '@/schema/config';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';

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

export async function ConfigDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.config.delete({
      where: { id },
    });

    revalidatePath('/admin/config', 'page');

    return { success: 'config successfully deleted!' };
  } catch (error) {
    console.error('ConfigDeleteAction.error', error);
  }
}

export const EditConfigAction = async (
  values: CreateConfigSchemaType,
  id: string
) => {
  const validationField = CreateConfigSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  if (!id) {
    return { error: 'Missing config ID!' };
  }

  const session = await auth();

  if (!session) {
    return { error: 'unAuthorize!' };
  }

  if (session.user.role !== UserRole.ADMIN) {
    return { error: 'You are not allowed to edit config.' };
  }

  await db.config.update({
    where: {
      id,
    },
    data: validationField.data,
  });

  revalidatePath('/admin/config', 'page');

  return { success: 'Config updated successfully!' };
};
