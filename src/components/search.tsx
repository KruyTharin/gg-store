import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from './ui/input';
import { useDebouncedCallback } from 'use-debounce';
import { cn } from '@/lib/utils';

interface Props {
  placeholder: string;
  className?: string;
}

export default function Search(props: Props) {
  const { placeholder, className } = props;

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const defaultSearchParams = searchParams.get('search')?.toString();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);

    // Reset page to default
    params.set('page', '1');
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <Input
      placeholder={placeholder}
      onChange={(e) => handleSearch(e.target.value)}
      className={cn('max-w-sm', className)}
      defaultValue={defaultSearchParams}
    />
  );
}
