'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useState } from 'react';
import { PRODUCT_CATEGORIES } from '@/lib/constants';

interface SearchFiltersProps {
    currentCategory?: string;
    currentSearch?: string;
}

const SearchFilters = ({ currentCategory, currentSearch }: SearchFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchInput, setSearchInput] = useState(currentSearch || '');

    const handleCategoryClick = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (currentCategory === category) {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        params.delete('page'); // Reset to page 1

        router.push(`/search?${params.toString()}`);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());

        if (searchInput.trim()) {
            params.set('search', searchInput.trim());
        } else {
            params.delete('search');
        }
        params.delete('page');

        router.push(`/search?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        router.push('/search');
    };

    const hasActiveFilters = currentCategory || currentSearch;

    const getCategoryDisplayName = (categoryValue: string) => {
        const cat = PRODUCT_CATEGORIES.find(c => c.value === categoryValue);
        if (cat) return cat.name;

        return categoryValue.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="space-y-8">
            {/* Search Box - Minimal */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-500">
                    Search
                </h3>
                <form onSubmit={handleSearch} className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-600" />
                        <Input
                            type="text"
                            placeholder="Search..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-6 h-10 border-0 border-b border-zinc-200 dark:border-zinc-800 rounded-none bg-transparent focus:border-black dark:focus:border-white focus-visible:ring-0 text-sm"
                        />
                    </div>
                </form>
            </div>

            {/* Categories Filter - Premium Minimal */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-500">
                    Categories
                </h3>

                <div className="space-y-1">
                    {/* Show All Products Option */}
                    <button
                        onClick={() => handleCategoryClick('')}
                        className={`w-full text-left py-2 text-sm transition-all ${!currentCategory
                                ? 'text-black dark:text-white font-medium border-b border-black dark:border-white'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        All Products
                    </button>

                    {/* Simplified Categories */}
                    {PRODUCT_CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => handleCategoryClick(cat.value)}
                            className={`w-full text-left py-2 text-sm transition-all ${currentCategory === cat.value
                                    ? 'text-black dark:text-white font-medium border-b border-black dark:border-white'
                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Active Filters - Minimal Chips */}
            {hasActiveFilters && (
                <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
                    <h3 className="text-[10px] font-medium tracking-[0.2em] uppercase text-zinc-500 dark:text-zinc-500">
                        Active Filters
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {currentCategory && (
                            <button
                                onClick={() => handleCategoryClick(currentCategory)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group"
                            >
                                {getCategoryDisplayName(currentCategory)}
                                <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                        )}
                        {currentSearch && (
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    const params = new URLSearchParams(searchParams.toString());
                                    params.delete('search');
                                    router.push(`/search?${params.toString()}`);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors group"
                            >
                                &quot;{currentSearch}&quot;
                                <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                            </button>
                        )}
                    </div>
                    <button
                        onClick={handleClearFilters}
                        className="text-xs tracking-wide uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors border-b border-zinc-600 dark:border-zinc-400 hover:border-black dark:hover:border-white pb-1"
                    >
                        Clear All
                    </button>
                </div>
            )}
        </div>
    );
};

export default SearchFilters;
