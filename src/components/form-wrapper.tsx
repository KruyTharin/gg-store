import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

interface Props {
  className?: string;
}

export const FormWrapper: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
}) => {
  return (
    <div
      className={cn('w-full h-dvh flex justify-center items-center', className)}
    >
      {children}
    </div>
  );
};
