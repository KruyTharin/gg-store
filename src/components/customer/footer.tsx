import { FaFacebook, FaTelegram } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

const CustomerFooter = () => {
  return (
    <div className="py-24 bg-gray-100 text-sm mt-24">
      <div className="w-full flex justify-center">
        <div className="flex flex-col items-center gap-3 text-center justify-center">
          <Link href="/">
            <div className="flex justify-center">
              <Image
                src="/logo.png"
                alt="product"
                width={70}
                height={70}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />
            </div>
          </Link>
          <p>
            3252 Winding Way, Central Plaza, Willowbrook, CA 90210, United
            States
          </p>
          <span className="font-semibold">hello@gg.dev</span>
          <span className="font-semibold">+1 234 567 890</span>
          <div className="flex gap-2 mx-auto">
            <FaFacebook className="w-6 h-6" />
            <FaTelegram className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFooter;
