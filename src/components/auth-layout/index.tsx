'use client';

import React from 'react';
import { useSession } from 'next-auth/react';

function AuthLayout({ children }: { children: React.ReactNode }) {
  // if { required: true } is supplied, status can only be "loading" or "authenticated"
  const { status, data: session } = useSession({ required: true });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
}

export default AuthLayout;
