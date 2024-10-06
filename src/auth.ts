import NextAuth from 'next-auth';
import authConfig from './auth.config';

// in the middleware, the session is not extended with custom fields
// See: https://github.com/nextauthjs/next-auth/issues/9836#issuecomment-1929663381

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  ...authConfig,
});
