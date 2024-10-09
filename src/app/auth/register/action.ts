'use server';

import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { RegisterSchema, RegisterSchemaType } from '@/schema/register';
import { generateVerificationToken } from '@/services/token';
import { sendVerificationEmail } from '@/services/mail';

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

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: 'Confirmation sent!' };
};
