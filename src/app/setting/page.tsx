import { auth, signOut } from '@/auth';
import { ROUTES } from '@/route';
import React from 'react';

async function SettingPage() {
  const session = await auth();
  return (
    <div>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <form
        action={async () => {
          'use server';
          await signOut({ redirectTo: ROUTES.LOGIN });
        }}
      >
        <button>Sign out</button>
      </form>
    </div>
  );
}

export default SettingPage;
