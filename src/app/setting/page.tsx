'use client';

import { RoleGate } from '@/components/role-gate';
import { UserRole } from '@prisma/client';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

function SettingPage() {
  // const session = await auth();
  const { data: session } = useSession();
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <button
        onClick={() =>
          signOut({
            callbackUrl: '/auth/login',
          })
        }
      >
        Sign out
      </button>
      <RoleGate role={UserRole.ADMIN}>
        <div>Hello</div>
      </RoleGate>
    </div>
  );
}

export default SettingPage;
