'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, ChevronRight, ChevronDown, Filter, Home } from 'lucide-react';
import { useState } from 'react';
import { PRODUCT_CATEGORIES, getSubcategories, getParentCategory, isMainCategory } from '@/lib/constants';

interface SearchFiltersProps {
    categories: string[];
    currentCategory?: string;
    currentSearch?: string;
}

const SearchFilters = ({ categories, currentCategory, currentSearch }: SearchFiltersProps) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchInput, setSearchInput] = useState(currentSearch || '');
    const [isFiltersOpen, setIsFiltersOpen] = useState(true);
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
        // Check main categories
        const mainCat = PRODUCT_CATEGORIES.find(cat => cat.value === categoryValue);
        if (mainCat) return mainCat.name;

        // Check subcategories
        for (const mainCat of PRODUCT_CATEGORIES) {
            const subCat = mainCat.subcategories?.find(sub => sub.value === categoryValue);
            if (subCat) return subCat.name;
        }

        // Fallback to formatted value
        return categoryValue.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    return (
        <div className="space-y-6">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden">
                <Button
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                    variant="outline"
                    className="w-full justify-between"
                >
                    <span className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        Filters
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} />
                </Button>
            </div>

            <div className={`space-y-6 ${!isFiltersOpen ? 'hidden lg:block' : ''}`}>
                {/* Search Box */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                        <h3 className="font-semibold text-lg">Search Products</h3>
                    </div>
                    <form onSubmit={handleSearch} className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search products..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 h-11 font-medium"
                        >
                            Search
                        </Button>
                    </form>
                </div>

                {/* Breadcrumb Navigation */}
                {currentCategory && (
                    <div className="bg-gradient-to-r from-violet-50 to-fuchsia-50 dark:from-violet-950/20 dark:to-fuchsia-950/20 border border-violet-200 dark:border-violet-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-sm flex-wrap">
                            <button
                                onClick={() => handleCategoryClick('')}
                                className="flex items-center gap-1 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                All
                            </button>
                            {currentMainCategory && currentMainCategory !== currentCategory && (
                                <>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                    <button
                                        onClick={() => handleCategoryClick(currentMainCategory)}
                                        className="text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                                    >
                                        {getCategoryDisplayName(currentMainCategory)}
                                    </button>
                                </>
                            )}
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium text-violet-700 dark:text-violet-300">
                                {getCategoryDisplayName(currentCategory)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Categories Filter */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-md flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-sm" />
                        </div>
                        <h3 className="font-semibold text-lg">Categories</h3>
                    </div>

                    <div className="space-y-2">
                        {/* Show All Products Option */}
                        <button
                            onClick={() => handleCategoryClick('')}
                            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between group ${!currentCategory
                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                                    : 'bg-muted/50 hover:bg-muted text-foreground hover:border-violet-300 dark:hover:border-violet-700 border border-transparent'
                                }`}
                        >
                            <span>All Products</span>
                            {!currentCategory && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                        </button>

                        {/* Main Categories with Subcategories */}
                        {PRODUCT_CATEGORIES.map((mainCat) => {
                            const isExpanded = expandedCategories.includes(mainCat.value) || currentMainCategory === mainCat.value;
                            const isActive = currentCategory === mainCat.value;
                            const hasActiveSubcategory = currentMainCategory === mainCat.value && currentCategory !== mainCat.value;

                            return (
                                <div key={mainCat.value} className="space-y-1">
                                    {/* Main Category */}
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleCategoryClick(mainCat.value)}
                                            className={`flex-1 text-left px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-between group ${isActive
                                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                                                    : hasActiveSubcategory
                                                        ? 'bg-violet-100 dark:bg-violet-950/30 text-violet-700 dark:text-violet-300 border border-violet-300 dark:border-violet-700'
                                                        : 'bg-muted/50 hover:bg-muted text-foreground hover:border-violet-300 dark:hover:border-violet-700 border border-transparent'
                                                }`}
                                        >
                                            <span>{mainCat.name}</span>
                                            {isActive && (
                                                <div className="w-2 h-2 bg-white rounded-full" />
                                            )}
                                        </button>
                                        {mainCat.subcategories && mainCat.subcategories.length > 0 && (
                                            <button
                                                onClick={() => toggleCategory(mainCat.value)}
                                                className={`p-3 rounded-lg transition-all ${isExpanded
                                                        ? 'bg-violet-100 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400'
                                                        : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                                                    }`}
                                            >
                                                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                                            </button>
                                        )}
                                    </div>

                                    {/* Subcategories */}
                                    {isExpanded && mainCat.subcategories && mainCat.subcategories.length > 0 && (
                                        <div className="ml-4 pl-4 border-l-2 border-violet-200 dark:border-violet-800 space-y-1 py-1">
                                            {mainCat.subcategories.map((subCat) => {
                                                const isSubActive = currentCategory === subCat.value;
                                                return (
                                                    <button
                                                        key={subCat.value}
                                                        onClick={() => handleCategoryClick(subCat.value)}
                                                        className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${isSubActive
                                                                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm'
                                                                : 'hover:bg-violet-50 dark:hover:bg-violet-950/20 text-muted-foreground hover:text-foreground'
                                                            }`}
                                                    >
                                                        <span>{subCat.name}</span>
                                                        {isSubActive && (
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
                                                        )}
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

                {/* Active Filters Display */}
                {hasActiveFilters && (
                    <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 dark:from-violet-950/20 dark:via-purple-950/20 dark:to-fuchsia-950/20 border border-violet-200 dark:border-violet-800 rounded-xl p-6 space-y-3">
                        <h3 className="font-semibold text-sm text-violet-900 dark:text-violet-100 flex items-center gap-2">
                            <div className="w-2 h-2 bg-violet-600 rounded-full animate-pulse" />
                            Active Filters
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {currentCategory && (
                                <button
                                    onClick={() => handleCategoryClick(currentCategory)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-violet-900/30 border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 text-sm font-medium hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors group"
                                >
                                    {getCategoryDisplayName(currentCategory)}
                                    <X className="w-3 h-3 group-hover:text-red-500" />
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
                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors group"
                                >
                                    &quot;{currentSearch}&quot;
                                    <X className="w-3 h-3 group-hover:text-red-500" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Clear All Filters */}
                {hasActiveFilters && (
                    <Button
                        onClick={handleClearFilters}
                        variant="outline"
                        className="w-full border-2 hover:border-red-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all h-11 font-medium"
                    >
                        <X className="w-4 h-4 mr-2" />
                        Clear All Filters
                    </Button>
                )}
            </div>
        </div>
    );
};

export default SearchFilters;
