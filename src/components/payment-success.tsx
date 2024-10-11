'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCardStore } from '@/stores/useCard';

export default function PaymentSuccess() {
  const cardStore = useCardStore();

  useEffect(() => {
    cardStore.removeAllItems();
  }, []);
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="animate-boom">
          <CircleCheckIcon className="mx-auto h-16 w-16 text-green-500" />
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Payment Successful!
        </h1>
        <p className="mt-4 text-muted-foreground">
          Thank you for your payment. We appreciate your business and look
          forward to serving you.
        </p>
        <div className="mt-6">
          <Link
            href="/order-history"
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            prefetch={false}
          >
            See your order
          </Link>
        </div>
      </div>
    </div>
  );
}

function CircleCheckIcon(props: any) {
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
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
