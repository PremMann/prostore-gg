'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from './language-context';

export default function CatalogFilter({ categories }: { categories: string[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useLanguage();

    const [priceRange, setPriceRange] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isOpen, setIsOpen] = useState(false);

    // Sync state with URL params
    useEffect(() => {
        const cat = searchParams.get('category') || 'all';
        const price = searchParams.get('price') || 'all';
        setSelectedCategory(cat);
        setPriceRange(price);
    }, [searchParams]);

    // Create a new query string function
    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value === 'all' || value === '') {
                params.delete(name);
            } else {
                params.set(name, value);
            }
            // Reset page on filter change
            params.delete('page');
            return params.toString();
        },
        [searchParams]
    );

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category);
        router.push(`?${createQueryString('category', category)}`);
    };

    const handlePriceChange = (value: string) => {
        setPriceRange(value);
        router.push(`?${createQueryString('price', value)}`);
    };

    const clearFilters = () => {
        setSelectedCategory('all');
        setPriceRange('all');
        router.push('/catalog');
    };

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    {t('filter.categories')}
                </h3>
                <div className="flex flex-col gap-2">
                    <button
                        onClick={() => handleCategoryChange('all')}
                        className={cn(
                            "text-left text-sm py-1 transition-colors hover:text-blue-600",
                            selectedCategory === 'all' ? "font-semibold text-blue-600" : "text-zinc-600 dark:text-zinc-400"
                        )}
                    >
                        {t('filter.all_categories')}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryChange(cat)}
                            className={cn(
                                "text-left text-sm py-1 transition-colors hover:text-blue-600 capitalize",
                                selectedCategory === cat ? "font-semibold text-blue-600" : "text-zinc-600 dark:text-zinc-400"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                    {t('filter.price_range')}
                </h3>
                <div className="flex flex-col gap-3">
                    {[
                        { value: 'all', label: t('filter.price.all') },
                        { value: '0-50', label: t('filter.price.under50') },
                        { value: '50-100', label: t('filter.price.50to100') },
                        { value: '100-200', label: t('filter.price.100to200') },
                        { value: '200-500', label: t('filter.price.200to500') },
                        { value: '500-100000', label: t('filter.price.over500') },
                    ].map((range) => (
                        <div key={range.value} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`price-${range.value}`}
                                name="price"
                                value={range.value}
                                checked={priceRange === range.value}
                                onChange={(e) => handlePriceChange(e.target.value)}
                                className="w-4 h-4 text-blue-600 bg-white border-zinc-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-zinc-800 focus:ring-2 dark:bg-zinc-700 dark:border-zinc-600"
                            />
                            <Label
                                htmlFor={`price-${range.value}`}
                                className="text-sm font-normal text-zinc-600 dark:text-zinc-400 cursor-pointer"
                            >
                                {range.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            <Button
                variant="outline"
                className="w-full text-zinc-600 dark:text-zinc-300 hover:text-red-500 hover:border-red-200 dark:hover:border-red-900 dark:hover:bg-red-900/10"
                onClick={clearFilters}
            >
                <X className="w-4 h-4 mr-2" />
                {t('filter.clear')}
            </Button>
        </div>
    );

    return (
        <>
            {/* Mobile Trigger */}
            <div className="lg:hidden mb-4">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Filter className="w-4 h-4 mr-2" />
                            {t('filter.filters')}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                        <SheetHeader>
                            <SheetTitle>{t('filter.filters')}</SheetTitle>
                            <SheetDescription className="sr-only">
                                Filter products by category and price
                            </SheetDescription>
                        </SheetHeader>
                        <div className="mt-8">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block sticky top-24 border-r border-zinc-200 dark:border-zinc-800 pr-8">
                <FilterContent />
            </div>
        </>
    );
}
