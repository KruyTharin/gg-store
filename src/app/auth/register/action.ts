'use server';

import { db } from '@/lib/db';
import { RegisterSchema, RegisterSchemaType } from '@/schema/register';

export const RegisterAction = async (values: RegisterSchemaType) => {
  const validationField = RegisterSchema.safeParse(values);

  if (!validationField.success) {
    return {
      error: 'invalid field',
    };
  }

  const { email, password, username } = validationField.data;

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { error: 'User already exists' };
  }
  return { success: 'Successfully!' };
};
