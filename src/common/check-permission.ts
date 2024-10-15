import { UserRole } from '@prisma/client';
import { Session } from 'next-auth';

export const checkRolePermission = (
  session: Session | null,
  role: UserRole
) => {
  if (!session) return false;

  // If user is 'Super Admin' role
  if (session.user.role === UserRole.SUPER_ADMIN) return true;

  if (session.user.role === UserRole.ADMIN && role === 'ADMIN') return true;

  return false;
};
