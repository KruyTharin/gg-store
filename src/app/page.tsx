import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Home() {
  return (
    <Button asChild>
      <Link href={'/auth/login'}>Login</Link>
    </Button>
  );
}
