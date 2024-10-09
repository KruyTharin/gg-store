import CustomerFooter from '@/components/customer/footer';
import CustomerNavbar from '@/components/customer/navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CustomerNavbar />
      <main>{children}</main>
      <CustomerFooter />
    </>
  );
}
