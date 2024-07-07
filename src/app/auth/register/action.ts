'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RegisterSchema, RegisterSchemaType } from '@/schema/register';

export const RegisterAction = async (values: RegisterSchemaType) => {
  const validationField = RegisterSchema.safeParse(values);

  if (!validationField.success) {
    return {
      error: 'invalid field',
    };
  }

  const { email, password, username } = validationField.data;
  const hashPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'User already exists' };
  }

  await db.user.create({
    data: {
      name: username,
      email,
      password: hashPassword,
    },
  });
  return { success: 'Successfully!' };
};
