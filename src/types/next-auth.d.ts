import NextAuth, { type DefaultSession } from 'next-auth';

export interface UserSession {
  password: string;
  role: string;
  isTwoFactorEnabled: boolean;
}

declare module 'next-auth' {
  interface Session {
    user: UserSession;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    password: string;
    isTwoFactorEnabled: boolean;
    role: 'USER' | 'ADMIN';
  }
}
