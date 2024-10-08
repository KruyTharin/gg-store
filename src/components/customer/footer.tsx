import { FaFacebook, FaTelegram } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';

const CustomerFooter = async () => {
  const config = await db.config.findFirst({});

  const routes = [
    {
      href: `/filter`,
      label: 'Filter',
    },

    {
      href: `/favorite`,
      label: 'Favorite',
    },

    {
      href: `/order-history`,
      label: 'Order History',
    },
  ];
  return (
    <div className="py-24 bg-gray-100 text-sm mt-24">
      <div className="grid md:grid-cols-3 grid-cols-1 gap-8 container">
        <div className="flex flex-col gap-3 ">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="product"
              width={70}
              height={70}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </Link>
          <div className="max-w-xs">
            <Link href={config?.location ?? '/'} target="_blank">
              <p>{config?.location}</p>
            </Link>
          </div>
          <span className="font-semibold">{config?.email}</span>
          <span className="font-semibold">{config?.phoneNumber}</span>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Shop</h3>
          <ul className="space-y-2 flex flex-col">
            {routes.map((route) => (
              <Link key={route.label} href={route.href}>
                {route.label}
              </Link>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lg mb-4">Social Media</h3>
          <ul className="space-y-2 flex flex-col">
            <span>{config?.slogan}</span>

            <div className="flex gap-2 ">
              <Link href={config?.facebookUrl ?? '/'} target="_blank">
                <FaFacebook className="w-6 h-6" />
              </Link>

              <Link href={config?.telegramUrl ?? '/'} target="_blank">
                <FaTelegram className="w-6 h-6" />
              </Link>
            </div>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-center">
        <p className="text-center w-full">
          © {new Date().getFullYear()} GGStore. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default CustomerFooter;
