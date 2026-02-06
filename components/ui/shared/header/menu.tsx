'use client';

import { Button } from '@/components/ui/button';
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
            <Button variant="outline" size="icon">
              <MenuIcon className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent className='flex flex-col items-start w-[300px] overflow-y-auto'>
            <SheetTitle className="mb-4">{t('header.menu')}</SheetTitle>

            {/* Category Links */}
            <div className="flex flex-col gap-4 w-full border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
              <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-4">{t('filter.categories')}</p>
              {PRODUCT_CATEGORIES.map((category) => (
                <Link
                  key={category.value}
                  href={`/search?category=${category.value}`}
                  className="px-4 py-2 text-base font-medium text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  {t(`category.${category.value}` as keyof typeof en)}
                </Link>
              ))}
            </div>

            {/* Cart Link */}
            <div className="flex items-center justify-between w-full px-4 mb-4">
              <span className="text-base font-medium">{t('header.cart')}</span>
              <CartButton />
            </div>

            {/* User Link */}
            <div className="flex items-center justify-between w-full px-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <span className="text-base font-medium">{t('header.user')}</span>
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