'use client';

import { httpClient } from '@/lib/axios';
import { Category } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';

export default function CategoryList() {
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await httpClient.get('/api/category');
      return response.data as Category[];
    },
  });

  console.log(categories, 'category list');

  return (
    <div className="mt-12 ">
      <h3 className="text-2xl font-bold my-5 container">Product Category</h3>

      {/* !TODO: make it scrollable */}
      <div className="px-4 overflow-x-scroll scrollbar-hide">
        <div className="flex gap-5 ">
          {!!categories?.length &&
            categories.map((cat) => (
              <CategoryCard
                key={cat.id}
                title={cat.name}
                imageUrl={cat.imageUrl}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

interface CategoryCardProps {
  title: string;
  imageUrl: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ imageUrl, title }) => {
  return (
    <Link
      href={`/filter?cat=${title}`}
      className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6"
    >
      <div className="aspect-w-4 aspect-h-5">
        <Image
          src={imageUrl}
          alt={title}
          width={500}
          height={500}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover aspect-[7/8]"
        />
      </div>
      <h1 className="mt-3 text-sm font-bold">{title}</h1>
    </Link>
  );
};
