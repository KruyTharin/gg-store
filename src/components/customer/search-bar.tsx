'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchBar() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    replace(`/filter?${params.toString()}`);
  }, 300);

  return (
    <div className="flex items-center justify-between gap-4 bg-gray-100 p-2 rounded-md flex-1">
      <input
        type="text"
        name="name"
        placeholder="Looking for products..."
        className="flex-1 bg-transparent outline-none"
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get('query')?.toString()}
      />
      <Search />
    </div>
  );
}
