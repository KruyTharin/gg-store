'use client';

import '../globals.css';

import Setting from '@/components/setting';
import { useSession } from 'next-auth/react';

function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <Setting user={session!.user} />
    </div>
  );
}

export default SettingsPage;
