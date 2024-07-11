import { v4 as uuid4 } from 'uuid';
import { getVerificationTokenByEmail } from './verification-token';
import { db } from '@/lib/db';
import { getPasswordResetByEmail } from './reset-password';

export const generatePasswordResetToken = async (email: string) => {
  const token = uuid4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getPasswordResetByEmail(email);

  if (existingToken) {
    await db.resetPasswordToken.delete({
      where: { id: existingToken.id },
    });
  }

  const passwordResetToken = await db.resetPasswordToken.create({
    data: { email, expires, token },
  });

  return passwordResetToken;
};

export const generateVerificationToken = async (email: string) => {
  const token = uuid4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: { id: existingToken.id },
    });
  }

  const verification = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verification;
};
