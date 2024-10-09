import React, { ChangeEvent, useEffect, useState } from 'react';
import { AccordionContent } from '../ui/accordion';
import { useRouter, useSearchParams } from 'next/navigation';
import { Size } from '@prisma/client';

function FilterBySize({ sizes }: { sizes: Size[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedCheckboxes, setSelectedCheckboxes] = useState<string[]>([]);

  // Parse initial URL params when component mounts
  useEffect(() => {
    const selected = searchParams.getAll('size'); // 'filters' is the query key
    setSelectedCheckboxes(selected);
  }, [searchParams]);

  // Handle checkbox change
  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    let updatedCheckboxes: string[];

    if (checked) {
      updatedCheckboxes = [...selectedCheckboxes, value];
    } else {
      updatedCheckboxes = selectedCheckboxes.filter((item) => item !== value);
    }

    setSelectedCheckboxes(updatedCheckboxes);

    // Update URL params
    const params = new URLSearchParams(window.location.search);
    params.delete('size'); // Clear existing 'size' values
    updatedCheckboxes.forEach((item) => params.append('size', item)); // Add new 'filters' values

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.push(newUrl); // Update the URL without reloading
  };

  return (
    <AccordionContent className="pt-6 animate-none">
      <ul className="space-y-4">
        {!!sizes?.length &&
          sizes.map((option: any, optionIdx: number) => (
            <li key={option.value} className="flex items-center">
              <input
                type="checkbox"
                id={`size-${optionIdx}`}
                onChange={handleCheckboxChange}
                value={option.value}
                checked={selectedCheckboxes.includes(option.value)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`size-${optionIdx}`}
                className="ml-3 text-sm text-gray-600"
              >
                {option.name}
              </label>
            </li>
          ))}
      </ul>
    </AccordionContent>
  );
}

export default FilterBySize;
