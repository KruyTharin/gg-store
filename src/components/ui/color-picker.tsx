'use client';

import { forwardRef, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { cn } from '@/lib/utils';
import type { ButtonProps } from '@/components/ui/button';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { useForwardedRef } from '@/lib/use-forward-ref';

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, 'value' | 'onChange' | 'onBlur'> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || '#000';
    }, [value]);

    return (
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
          <div className="flex gap-3 items-center">
            <span>({value || '#000'})</span>
            <Button
              {...props}
              className={cn('block', className)}
              name={name}
              onClick={() => {
                setOpen(true);
              }}
              type="button"
              size="icon"
              style={{
                backgroundColor: parsedValue,
              }}
              variant="outline"
            >
              <div />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-full">
          <HexColorPicker color={parsedValue} onChange={onChange} />
          <Input
            maxLength={7}
            onChange={(e) => {
              onChange(e?.currentTarget?.value);
            }}
            ref={ref}
            value={parsedValue}
          />
        </PopoverContent>
      </Popover>
    );
  }
);
ColorPicker.displayName = 'ColorPicker';

export { ColorPicker };
