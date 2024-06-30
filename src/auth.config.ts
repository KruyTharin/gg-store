import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { LoginSchema } from './schema/login';
import { db } from './lib/db';
import bcrypt from 'bcryptjs';

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validationField = LoginSchema.safeParse(credentials);

        if (validationField.success) {
          const { email, password } = validationField.data;

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.password) return null;

          const passwordMatch = await bcrypt.compare(password, user.password);

          if (passwordMatch) return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
