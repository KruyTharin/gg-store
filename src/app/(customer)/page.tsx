import CategoryList from '@/components/customer/categories';
import ProductList from '@/components/customer/product-list';
import { Billboard } from '@/components/customer/slider';
import { db } from '@/lib/db';

export default async function Home() {
  const sliders = await db.billboard.findMany({
    take: 5,
    skip: 0,
  });

  return (
    <div>
      <Billboard data={sliders} />
      <ProductList />
      <CategoryList />
    </div>
  );
}
