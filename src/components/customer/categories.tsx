import Image from 'next/image';
import Link from 'next/link';

const CategoryList = async () => {
  return (
    <div className="mt-12 flex gap-x-8 gap-y-16 justify-between flex-wrap">
      <h3 className="container">Product Category</h3>

      {/* !TODO: make it scrollable */}
      <div className="px-4 overflow-x-scroll scrollbar-hide">
        <div className="flex gap-5 ">
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
          <CategoryCard />
        </div>
      </div>
    </div>
  );
};

const CategoryCard = () => {
  return (
    <Link
      href={`/list?cat=`}
      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
    >
      <div>
        <Image
          src="https://images.pexels.com/photos/2983364/pexels-photo-2983364.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="product"
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover aspect-[7/8]"
        />
      </div>
      <h1 className="mt-3 text-sm">TV & Phone</h1>
    </Link>
  );
};

export default CategoryList;
