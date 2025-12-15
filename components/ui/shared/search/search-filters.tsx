'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { PRODUCT_CATEGORIES, getParentCategory, isMainCategory } from '@/lib/constants';

interface SearchFiltersProps {
    currentCategory?: string;
    currentSearch?: string;
}

const SearchFilters = ({ currentCategory, currentSearch }: SearchFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchInput, setSearchInput] = useState(currentSearch || '');
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);

    // Determine the current main category context
    const currentMainCategory = currentCategory
        ? (isMainCategory(currentCategory)
            ? currentCategory
            : getParentCategory(currentCategory)?.value)
        : undefined;

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
        params.delete('page'); // Reset to page 1

        router.push(`/search?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        router.push('/search');
    };

    const toggleCategory = (categoryValue: string) => {
        setExpandedCategories(prev =>
            prev.includes(categoryValue)
                ? prev.filter(c => c !== categoryValue)
                : [...prev, categoryValue]
        );
    };

    const hasActiveFilters = currentCategory || currentSearch;

    // Get display name for category
    const getCategoryDisplayName = (categoryValue: string) => {
        const mainCat = PRODUCT_CATEGORIES.find(cat => cat.value === categoryValue);
        if (mainCat) return mainCat.name;

        for (const mainCat of PRODUCT_CATEGORIES) {
            const subCat = mainCat.subcategories?.find(sub => sub.value === categoryValue);
            if (subCat) return subCat.name;
        }

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
                    {searchInput && (
                        <button
                            type="submit"
                            className="w-full h-10 bg-black dark:bg-white text-white dark:text-black text-xs tracking-wide uppercase transition-all hover:bg-zinc-800 dark:hover:bg-zinc-100"
                        >
                            Search
                        </button>
                    )}
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
                        className={`w-full text-left py-2 text-sm transition-all ${
                            !currentCategory
                                ? 'text-black dark:text-white font-medium border-b border-black dark:border-white'
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                        }`}
                    >
                        All Products
                    </button>

                    {/* Main Categories with Subcategories */}
                    {PRODUCT_CATEGORIES.map((mainCat) => {
                        const isExpanded = expandedCategories.includes(mainCat.value) || currentMainCategory === mainCat.value;
                        const isActive = currentCategory === mainCat.value;
                        const hasActiveSubcategory = currentMainCategory === mainCat.value && currentCategory !== mainCat.value;

                        return (
                            <div key={mainCat.value} className="space-y-1">
                                {/* Main Category */}
                                <div className="flex items-center justify-between group">
                                    <button
                                        onClick={() => handleCategoryClick(mainCat.value)}
                                        className={`flex-1 text-left py-2 text-sm transition-all ${
                                            isActive
                                                ? 'text-black dark:text-white font-medium border-b border-black dark:border-white'
                                                : hasActiveSubcategory
                                                    ? 'text-black dark:text-white'
                                                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                                        }`}
                                    >
                                        {mainCat.name}
                                    </button>
                                    {mainCat.subcategories && mainCat.subcategories.length > 0 && (
                                        <button
                                            onClick={() => toggleCategory(mainCat.value)}
                                            className="p-2 text-zinc-400 dark:text-zinc-600 hover:text-black dark:hover:text-white transition-colors"
                                        >
                                            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                        </button>
                                    )}
                                </div>

                                {/* Subcategories */}
                                {isExpanded && mainCat.subcategories && mainCat.subcategories.length > 0 && (
                                    <div className="ml-4 pl-3 border-l border-zinc-200 dark:border-zinc-800 space-y-1 py-1">
                                        {mainCat.subcategories.map((subCat) => {
                                            const isSubActive = currentCategory === subCat.value;
                                            return (
                                                <button
                                                    key={subCat.value}
                                                    onClick={() => handleCategoryClick(subCat.value)}
                                                    className={`w-full text-left py-1.5 text-xs transition-all ${
                                                        isSubActive
                                                            ? 'text-black dark:text-white font-medium'
                                                            : 'text-zinc-500 dark:text-zinc-500 hover:text-black dark:hover:text-white'
                                                    }`}
                                                >
                                                    {subCat.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
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
