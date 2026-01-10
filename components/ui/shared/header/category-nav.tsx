'use client';

import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

const categories = PRODUCT_CATEGORIES.map(cat => ({
    name: cat.name,
    slug: cat.value
}));

import { useLanguage } from '@/components/catalog/language-context';

const CategoryNav = () => {
    const { t } = useLanguage();
    return (
        <nav className='hidden md:flex items-center gap-6'>
            <Link
                href='/catalog'
                className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group'
            >
                {t('header.catalog')}
                <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:w-full transition-all duration-300' />
            </Link>
            {categories.map((category) => (
                <Link
                    key={category.slug}
                    href={`/search?category=${category.slug}`}
                    className='text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group'
                >
                    {category.name}
                    <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 group-hover:w-full transition-all duration-300' />
                </Link>
            ))}
        </nav>
    );
};

export default CategoryNav;
