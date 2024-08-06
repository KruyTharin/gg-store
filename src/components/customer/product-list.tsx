import ProductCard from './product-card';

const ProductList = async () => {
  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap container">
      <h3>Feature Products</h3>

      {/* Card List */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        <ProductCard />
        <ProductCard />
        <ProductCard />
        <ProductCard />
      </div>

      {/* Pagination */}
    </div>
  );
};

export default ProductList;
