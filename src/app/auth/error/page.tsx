import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

function ErrorPage() {
  return (
    <div className="flex flex-col w-full h-dvh items-center justify-center text-center">
      <span>Oop! something when wrong</span>
      <Button asChild>
        <Link href="/auth/login">Go go login!</Link>
      </Button>
    </div>
  );
}

export default ErrorPage;
