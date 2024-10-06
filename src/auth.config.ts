import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from './schema/login';
import bcrypt from 'bcryptjs';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { getUserByEmail } from './services/user';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Github({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),

    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),

    Credentials({
      async authorize(credentials) {
        const validationField = LoginSchema.safeParse(credentials);

        if (validationField.success) {
          const { email, password } = validationField.data;

          const user = await getUserByEmail(email);

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
