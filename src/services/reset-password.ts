import { db } from '@/lib/db';

export const getPasswordResetByToken = async (token: string) => {
  try {
    const passwordToken = await db.resetPasswordToken.findUnique({
      where: { token },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
};

export const getPasswordResetByEmail = async (email: string) => {
  try {
    const passwordToken = await db.resetPasswordToken.findFirst({
      where: { email },
    });

    return passwordToken;
  } catch (error) {
    return null;
  }
};
