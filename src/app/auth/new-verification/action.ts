'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/services/user';
import { getVerificationTokenByToken } from '@/services/verification-token';

export const newVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Token not found!' };
  }

  const hasExpiredToken = new Date(existingToken.expires) < new Date();

  if (hasExpiredToken) {
    return { error: 'Token expired!' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'Email not found!' };
  }

  await db.user.update({
    where: { id: existingUser.id },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: { id: existingToken.id },
  });

  return { success: 'Email verified!' };
};
