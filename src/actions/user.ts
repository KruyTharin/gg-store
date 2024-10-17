'use server';

import { auth } from '@/auth';
import { db } from '@/lib/db';
import {
  UpdateUserSchemaSchemaType,
  userSchema,
  UserSchemaSchemaType,
} from '@/schema/user';
import { UserRole } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { generateVerificationToken } from '@/services/token';
import { sendVerificationEmail } from '@/services/mail';
import { getUserByEmail, getUserById } from '@/services/user';

export const CreateUserAction = async (values: UserSchemaSchemaType) => {
  const validationField = userSchema.safeParse(values);

  if (!validationField.success) {
    return {
      error: 'invalid field',
    };
  }

  const session = await auth();

  if (session?.user?.role !== UserRole.SUPER_ADMIN) {
    return { error: 'You are not allowed to create user.' };
  }

  const { email, password, name, image } = validationField.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'User already exists' };
  }

  await db.user.create({
    data: {
      name,
      email,
      password: hashPassword,
      image,
    },
  });

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token,
    password
  );

  revalidatePath('/admin/user', 'page');

  return { success: 'User created successfully!' };
};

export async function UserDeleteAction(id: string) {
  const session = await auth();
  const { role } = session?.user || {};

  if (role !== UserRole.SUPER_ADMIN) {
    return { error: 'You do not have permission to delete!' };
  }

  try {
    await db.user.delete({
      where: { id },
    });

    revalidatePath('/admin/user', 'page');

    return { success: 'User successfully deleted!' };
  } catch (error) {
    console.error('UserDeleteAction.error', error);
  }
}

export const EditUserAction = async (
  values: UpdateUserSchemaSchemaType,
  id: string
) => {
  if (!id) {
    return { error: 'Missing user ID!' };
  }

  const session = await auth();
  if (!session) {
    return { error: 'unAuthorize!' };
  }

  const existingUser = await getUserById(id);

  if (!existingUser) {
    return { error: 'User not found!' };
  }

  if (session.user.role !== UserRole.SUPER_ADMIN) {
    return { error: 'You are not allowed to edit user.' };
  }

  if (values.email) {
    const existingUserEmail = await getUserByEmail(values.email);

    if (existingUserEmail && existingUserEmail.id !== existingUser.id) {
      return { error: 'Email already in use!' };
    }
  }

  if (values.password && values.newPassword && existingUser.password) {
    const passwordMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    );

    if (!passwordMatch) {
      return { error: 'Incorrect password!' };
    }

    const hashPassword = await bcrypt.hash(values.password, 10);
    values.password = hashPassword;
    values.newPassword = undefined;
  }

  if (values.role === 'SUPER_ADMIN') {
    return { error: 'Not allowed to change role to SUPER_ADMIN!' };
  }

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      ...values,
      emailVerified: values.email ? new Date() : existingUser.emailVerified,
    },
  });

  revalidatePath('/admin/user', 'page');

  return { success: 'User updated successfully!' };
};
