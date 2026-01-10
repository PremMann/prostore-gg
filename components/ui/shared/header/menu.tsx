'use client';

import { Button } from '@/components/ui/button';
import ModeToggle from './mode-toggle';
import Link from 'next/link';
import { ShoppingCart, Menu as MenuIcon } from 'lucide-react'; // Changed icon for better UX
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LanguageToggle from './language-toggle';
import { useLanguage } from '@/components/catalog/language-context';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

const categories = PRODUCT_CATEGORIES.map(cat => ({
  name: cat.name,
  slug: cat.value
}));

const Menu = ({ userButton }: { userButton: React.ReactNode }) => {
  const { t } = useLanguage();
  return (
    <div className='flex justify-end gap-3'>
      {/* Desktop Menu */}
      <nav className='hidden md:flex w-full max-w-xs gap-1 items-center'>
        <LanguageToggle />
        <ModeToggle />
        <Button asChild variant={"ghost"}>
          <Link href='/cart'>
            <ShoppingCart className="mr-2 h-4 w-4" /> {t('header.cart')}
          </Link>
        </Button>
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

            {/* Mobile Actions */}
            <div className="flex gap-2 mb-6 w-full">
              <LanguageToggle />
              <ModeToggle />
            </div>

            {/* Main Links */}
            <div className="flex flex-col gap-4 w-full border-b border-zinc-200 dark:border-zinc-800 pb-6 mb-6">
              <Button asChild variant="ghost" className="justify-start text-base font-medium">
                <Link href='/cart'>
                  <ShoppingCart className="mr-2 h-5 w-5" /> {t('header.cart')}
                </Link>
              </Button>
              <div className="px-4 py-2">
                {userButton}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-2 w-full">
              <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider px-4 mb-2">
                {t('header.catalog')}
              </h4>

              <Button asChild variant="ghost" className="justify-start w-full">
                <Link href="/catalog">
                  {t('header.catalog')}
                </Link>
              </Button>

              {categories.map((cat) => (
                <Button key={cat.slug} asChild variant="ghost" className="justify-start w-full pl-8 font-light text-zinc-600 dark:text-zinc-400">
                  <Link href={`/search?category=${cat.slug}`}>
                    {cat.name}
                  </Link>
                </Button>
              ))}
            </div>

            <SheetDescription className="opacity-0">Navigation Menu</SheetDescription>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
};

export default Menu;