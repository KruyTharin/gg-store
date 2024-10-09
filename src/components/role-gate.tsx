'use client';

import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React, { PropsWithChildren } from 'react';
interface Props {
  role: keyof typeof UserRole;
}

export const RoleGate: React.FC<PropsWithChildren<Props>> = ({
  role,
  children,
}) => {
  const { data: session } = useSession();

  if (session?.user.role !== role) {
    return <div>Not allowed to access this</div>;
  }

  return <>{children}</>;
};
