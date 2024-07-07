import NextAuth from 'next-auth';
import authConfig from './auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { db } from './lib/db';
import { JWT } from 'next-auth/jwt';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: '/auth/login',
  },

  callbacks: {
    async jwt({ token }): Promise<JWT> {
      if (!token.sub) return token;

      const existingUser = await db.user.findFirst({
        where: { id: token.sub },
      });

      if (!existingUser) return token;

      token.password = existingUser.password;
      token.role = existingUser.role;

      return token;
    },

    async session({ session, token }) {
      session.user.password = token.password;
      session.user.role = token.role;

      return session;
    },
  },
  session: { strategy: 'jwt' },
  ...authConfig,
});
