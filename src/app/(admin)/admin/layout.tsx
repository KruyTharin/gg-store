import AdminNavbar from '@/components/admin/navbar';

import '../../globals.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
}
