'use server';

import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from '@/schema/reset-password';
import { sendResetPasswordEmail } from '@/services/mail';
import { generatePasswordResetToken } from '@/services/token';
import { getUserByEmail } from '@/services/user';

export const ResetPasswordAction = async (values: ResetPasswordSchemaType) => {
  const validationField = ResetPasswordSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { email } = validationField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  const newPasswordResetToken = await generatePasswordResetToken(email);
  await sendResetPasswordEmail(
    newPasswordResetToken.email,
    newPasswordResetToken.token
  );

  return { success: 'Reset password sent successfully!' };
};
