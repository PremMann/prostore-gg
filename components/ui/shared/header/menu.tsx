'use client';

import { Menu as MenuIcon } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CartButton from '@/components/cart/cart-button';
import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';
import { useLanguage } from '@/components/catalog/language-context';
import { en } from '@/i18n/locales/en';

const Menu = ({ userButton }: { userButton: React.ReactNode }) => {
  const { t } = useLanguage();

  return (
    <div className='flex justify-end gap-3'>
      {/* Desktop Menu - Cart & User */}
      <nav className='hidden md:flex w-full max-w-xs gap-4 items-center justify-end'>
        <CartButton />
        {userButton}
      </nav>

      {/* Mobile Menu */}
      <nav className='md:hidden'>
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-sm tracking-widest font-bold hover:opacity-70 transition-opacity flex items-center gap-2">
              <MenuIcon className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className='flex flex-col items-start w-full sm:w-full overflow-y-auto bg-white dark:bg-black'>
            <SheetTitle className="mb-4 uppercase tracking-widest">{t('header.menu')}</SheetTitle>

            {/* Category Links */}
            <div className="flex flex-col gap-4 w-full border-b border-black/10 dark:border-white/10 pb-6 mb-6">
              {PRODUCT_CATEGORIES.map((category) => (
                <Link
                  key={category.value}
                  href={`/search?category=${category.value}`}
                  className="py-2 text-2xl font-bold uppercase tracking-widest text-black dark:text-white hover:opacity-70 transition-opacity"
                >
                  {t(`category.${category.value}` as keyof typeof en)}
                </Link>
              ))}
            </div>

            {/* Cart Link */}
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-xl font-bold uppercase tracking-widest">{t('header.cart')}</span>
              <CartButton />
            </div>

            {/* User Link */}
            <div className="flex items-center justify-between w-full border-t border-black/10 dark:border-white/10 pt-4">
              <span className="text-xl font-bold uppercase tracking-widest">{t('header.user')}</span>
              {userButton}
            </div>

            <SheetDescription className="opacity-0">Navigation Menu</SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;