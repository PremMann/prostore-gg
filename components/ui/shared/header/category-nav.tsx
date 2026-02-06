'use client';

import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

import { useLanguage } from '@/components/catalog/language-context';
import { en } from '@/i18n/locales/en';

const CategoryNav = () => {
    const { t } = useLanguage();

    return (
        <nav className="hidden md:flex items-center gap-8">
            {PRODUCT_CATEGORIES.map((category) => (
                <Link
                    key={category.value}
                    href={`/search?category=${category.value}`}
                    className="text-xs font-medium tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                >
                    {t(`category.${category.value}` as keyof typeof en)}
                </Link>
            ))}
        </nav>
    );
};

export default CategoryNav;
