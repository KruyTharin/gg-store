'use client';

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { CircleAlert, CircleCheck, CircleX } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Toaster() {
  const { toasts } = useToast();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <ToastProvider>
        {toasts.map(function ({
          id,
          title,
          description,
          action,
          variant,
          ...props
        }) {
          return (
            <Toast key={id} {...props}>
              <div className="grid gap-1">
                {title && (
                  <div
                    className={cn('flex gap-2 items-centers', {
                      'text-green-500':
                        variant === 'default' || variant === undefined,
                      'text-rose-500': variant === 'error',
                      'text-yellow-500': variant === 'waring',
                    })}
                  >
                    {variant === 'default' ||
                      (variant === undefined && <CircleCheck />)}
                    {variant === 'error' && <CircleX />}
                    {variant === 'waring' && <CircleAlert />}

                    <ToastTitle>{title}</ToastTitle>
                  </div>
                )}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
              {action}
              <ToastClose />
            </Toast>
          );
        })}
        <ToastViewport />
      </ToastProvider>
    )
  );
}
