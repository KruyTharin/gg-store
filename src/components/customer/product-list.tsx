import { db } from '@/lib/db';
import { ProductCard } from './product-card';

const ProductList = async () => {
  const products = await db.product.findMany({
    where: {
      isFeatured: true,
      isFavarited: false,
    },

    include: {
      color: true,
      size: true,
      images: true,
    },
  });

  console.log(products);

  return (
    <div className="mt-12 container">
      <h3 className="text-2xl font-bold my-5">Feature Products</h3>

      {/* Card List */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price as any}
            images={product.images}
            colors={product.color!.name}
            isFavarited={product.isFavarited}
            stockCount={product.stockCount as any}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
