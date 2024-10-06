import AdminNavbar from '@/components/admin/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNavbar />
      <main>{children}</main>
    </>
  );
}
