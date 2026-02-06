
import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import CategoryNav from './category-nav';
import UserButton from './user-button';

const Header = () => {
  return (
    <header className='w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-black/80 sticky top-0 z-50'>
      <div className='max-w-[1400px] mx-auto px-8 lg:px-16 flex items-center justify-between h-16 lg:h-20'>
        <div className='flex items-center gap-12'>
          <Link href='/' className='flex items-center'>
            <Image
              src='/images/gg.png'
              alt='PROMELODY Logo'
              height={40}
              width={40}
              priority={true}
              className='object-contain'
            />
            <span className='hidden lg:block font-light text-lg tracking-wider ml-3 uppercase text-black dark:text-white'>
              {APP_NAME}
            </span>
          </Link>

          {/* Category Navigation - Shirts, Pants, Accessories */}
          <CategoryNav />
        </div>

        {/* Menu - Cart and User */}
        <Menu userButton={<UserButton />} />
      </div>
    </header>
  );
};

export default Header;
