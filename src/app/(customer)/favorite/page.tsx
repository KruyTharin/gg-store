import { ProductCard } from '@/components/customer/product-card';
import { db } from '@/lib/db';

const ProductList = async () => {
  const products = await db.product.findMany({
    where: {
      isFavarited: true,
    },

    include: {
      color: true,
      size: true,
      images: true,
    },
  });

  return (
    <div className="mt-12 container">
      <h3 className="text-2xl font-bold my-5">Your favorite product</h3>

      {/* Card List */}
      <div className="grid md:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-5">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price as any}
            images={product.images}
            colors={product?.color.value}
            isFavarited={product.isFavarited}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
