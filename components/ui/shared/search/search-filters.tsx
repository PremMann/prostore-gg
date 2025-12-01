'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchFiltersProps {
    categories: string[];
    currentCategory?: string;
    currentSearch?: string;
}

const SearchFilters = ({ categories, currentCategory, currentSearch }: SearchFiltersProps) => {
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
        params.delete('page'); // Reset to page 1

        router.push(`/search?${params.toString()}`);
    };

    const handleClearFilters = () => {
        setSearchInput('');
        router.push('/search');
    };

    const hasActiveFilters = currentCategory || currentSearch;

    return (
        <div className="space-y-6">
            {/* Search Box */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg">Search Products</h3>
                <form onSubmit={handleSearch} className="space-y-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search products..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
                        Search
                    </Button>
                </form>
            </div>

            {/* Categories Filter */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                <h3 className="font-semibold text-lg">Categories</h3>
                <div className="space-y-2">
                    {categories.map((category) => {
                        const isActive = currentCategory === category;
                        const displayName = category.split('-').map(word =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ');

                        return (
                            <button
                                key={category}
                                onClick={() => handleCategoryClick(category)}
                                className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all ${isActive
                                        ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md'
                                        : 'bg-muted/50 hover:bg-muted text-foreground'
                                    }`}
                            >
                                {displayName}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
                <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="w-full border-2 hover:border-destructive hover:text-destructive"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                </Button>
            )}

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Active Filters</h3>
                    <div className="flex flex-wrap gap-2">
                        {currentCategory && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium">
                                {currentCategory.split('-').map(word =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ')}
                            </span>
                        )}
                        {currentSearch && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                                &quot;{currentSearch}&quot;
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchFilters;
