'use server';

import { LoginSchema, LoginSchemaType } from '@/schema/login';
import { signIn } from '@/auth';
import { ROUTES } from '@/route';
import { AuthError } from 'next-auth';
import { generateVerificationToken } from '@/services/token';
import { getUserByEmail } from '@/services/user';
import { sendVerificationEmail } from '@/services/mail';

export const LoginAction = async (values: LoginSchemaType) => {
  const validationField = LoginSchema.safeParse(values);

  if (!validationField.success) {
    return { error: 'Invalid field!' };
  }

  const { password, email } = validationField.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: 'Email is not exist' };
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: 'Confirmation email sent!' };
  }

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: ROUTES.DEFAULT_LOGIN_REDIRECT_URL,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CallbackRouteError':
          return { error: 'Invalid credentials!' };
        default:
          return { error: 'Something when wrong!' };
      }
    }
    throw error;
  }

  return { success: 'Email crated successfully!' };
};
