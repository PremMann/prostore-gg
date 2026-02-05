'use client';

import Link from 'next/link';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

const CategoryNav = () => {
    return (
        <nav className="hidden md:flex items-center gap-8">
            {PRODUCT_CATEGORIES.map((category) => (
                <Link
                    key={category.value}
                    href={`/search?category=${category.value}`}
                    className="text-xs font-medium tracking-wider uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-200"
                >
                    {category.name}
                </Link>
            ))}
        </nav>
    );
};

export default CategoryNav;
