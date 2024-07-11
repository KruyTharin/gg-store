'use server';

import { db } from '@/lib/db';
import {
  NewPasswordSchema,
  NewPasswordSchemaType,
} from '@/schema/new-password';
import { getPasswordResetByToken } from '@/services/reset-password';
import { getUserByEmail } from '@/services/user';
import bcrypt from 'bcryptjs';

export const NewPasswordAction = async (
  values: NewPasswordSchemaType,
  token: string
) => {
  const validationField = NewPasswordSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { password } = validationField.data;

  console.log('called');
  const existingToken = await getPasswordResetByToken(token);

  console.log(existingToken, '====>');

  if (!existingToken) {
    return { error: 'Invalid token!' };
  }

  const hashExpired = new Date(existingToken.expires) < new Date();

  if (hashExpired) {
    return { error: 'Token expired' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  await db.user.update({
    where: {
      id: existingUser.id,
    },

    data: {
      password: hashPassword,
    },
  });

  await db.resetPasswordToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Password Updated!' };
};
