'use client';

import { Button } from '@/components/ui/button';
import { useCardStore } from '@/stores/useCard';
import { useEffect } from 'react';

export default function PaymentFailed() {
  const cardStore = useCardStore();

  useEffect(() => {
    cardStore.removeAllItems();
  }, []);
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <CircleXIcon className="mx-auto h-12 w-12 text-red-500" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Payment Failed
        </h1>
        <p className="mt-4 text-muted-foreground">
          Oops, there was an issue processing your payment. Please try again.
        </p>
        <div className="mt-6">
          <Button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}

function CircleXIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m15 9-6 6" />
      <path d="m9 9 6 6" />
    </svg>
  );
}
