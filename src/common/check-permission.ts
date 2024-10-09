import { UserRole } from '@prisma/client';
import { Session } from 'next-auth';

export const checkRolePermission = (
  session: Session | null,
  role: UserRole
) => {
  if (!session) return false;

  // If the single given permission exist in any of user permissions
  return session.user.role === role || false;
};
