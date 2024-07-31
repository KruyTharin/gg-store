import { checkRolePermission } from '@/common/check-permission';
import { UserRole } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

interface Props {
  role: UserRole;
}

export const AuthRender: React.FC<React.PropsWithChildren<Props>> = ({
  children,
  role,
}) => {
  const [isAllow, setAllow] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    setAllow(checkRolePermission(session, role));
  }, [role, session]);

  if (!isAllow) return null;

  return children;
};
