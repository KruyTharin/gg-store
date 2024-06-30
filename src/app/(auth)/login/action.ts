'use server';

import { LoginSchema, LoginSchemaType } from '@/schema/login';
import bcrypt from 'bcrypt';
import { db } from '@/lib/db';

export const LoginAction = async (values: LoginSchemaType) => {
  const validationField = LoginSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { password, email } = validationField.data;

  const hasPassword = await bcrypt.hash(password, 10);

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'User already exists' };
  }

  await db.user.create({
    data: {
      password: hasPassword,
      email,
    },
  });

  return { success: 'Email crated successfully!' };
};
