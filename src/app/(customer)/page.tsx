import CategoryList from '@/components/customer/categories';
import ProductList from '@/components/customer/product-list';
import Slider from '@/components/customer/slider';

export default async function Home() {
  return (
    <div>
      <Slider />
      <ProductList />
      <CategoryList />
    </div>
  );
}
