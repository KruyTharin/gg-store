import React from 'react';
import { FormLabel } from './ui/form';

function CustomLabel({
  required = true,
  children,
}: {
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <FormLabel>
      {children}
      {required && <span className="text-rose-500">*</span>}
    </FormLabel>
  );
}

export default CustomLabel;
