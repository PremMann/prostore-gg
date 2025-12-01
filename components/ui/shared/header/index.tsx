
import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoryNav from './category-nav';

const Header = () => {
  return (
    <header className='w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50'>
      <div className='wrapper flex-between'>
        <div className='flex-start gap-8'>
          <Link href='/' className='flex-start'>
            <Image
              src='/images/main.png'
              alt={`${APP_NAME} logo`}
              height={64}
              width={64}
              priority={true}
              className='object-contain'
            />
            <span className='hidden lg:block font-bold text-2xl ml-3'>
              {APP_NAME}
            </span>
          </Link>

          {/* Category Navigation */}
          <CategoryNav />
        </div>

        <Menu />
      </div>
    </header>
  );
};

export default Header;
