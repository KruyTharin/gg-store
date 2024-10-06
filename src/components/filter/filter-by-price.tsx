'use client';

import { useState } from 'react';
import { Slider } from '../ui/slider';
import { cn } from '@/lib/utils';

export function FilterByPrice() {
  const [localValues, setLocalValues] = useState([0, 1000]);

  const handleValueChange = (newValues: any) => {
    setLocalValues(newValues);
  };

  return (
    <div className="grid gap-4 p-4 w-full max-w-80 bg-white border border-[#14424C]/20 rounded-[12px]">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        Preço
      </label>
      <Slider
        defaultValue={[0, 100]}
        minStepsBetweenThumbs={1000}
        max={3000}
        min={0}
        step={1}
        onValueChange={handleValueChange}
        className={cn('w-full')}
      />
      <div className="flex gap-2 flex-wrap">
        <ol className="flex items-center w-full gap-3">
          {localValues.map((_, index) => (
            <li
              key={index}
              className="flex items-center justify-between w-full border px-3 h-10 rounded-md"
            >
              <span>USD</span>
              <span>{localValues[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
