
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';
import Menu from './menu';
import UserButton from './user-button';
import CartButton from '@/components/cart/cart-button';

const Header = () => {
  return (
    <header className='w-full bg-white text-black sticky top-0 z-50 uppercase font-bold text-sm'>
      {/* Announcement Bar */}
      <div className='w-full bg-black text-white text-[10px] tracking-widest text-center py-2'>
        FREE Worldwide Shipping on Orders Over $90 — U.S. Duties & Taxes Included
      </div>
      
      {/* Main Nav */}
      <div className='w-full px-4 lg:px-8 flex items-center justify-between h-14'>
        {/* Left Nav */}
        <div className='flex items-center gap-6 flex-1'>
          <div className='hidden md:block'>
            <Link href='/search' className='tracking-widest hover:opacity-70 transition-opacity'>
              MENU
            </Link>
          </div>
          <div className='md:hidden'>
            <Menu userButton={<UserButton />} />
          </div>
        </div>

        {/* Center Logo */}
        <div className='flex items-center justify-center flex-1'>
          <Link href='/' className='flex items-center tracking-[0.2em] text-xl font-bold'>
            {APP_NAME}
          </Link>
        </div>

        {/* Right Nav */}
        <div className='flex items-center justify-end gap-4 lg:gap-6 flex-1'>
          <div className='hidden md:flex items-center gap-6'>
            <Link href='/search' className='tracking-widest hover:opacity-70 transition-opacity'>
              SEARCH
            </Link>
            <UserButton />
          </div>
          <CartButton />
        </div>
      </div>
    </header>
  );
};

export default Header;
