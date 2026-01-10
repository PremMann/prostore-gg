'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from 'lucide-react';

interface CatalogFilterProps {
    categories: string[];
}

const PRICE_RANGES = [
    { label: 'All', value: '' },
    { label: 'Under $50', value: '0-50' },
    { label: '$50 to $100', value: '50-100' },
    { label: '$100 to $200', value: '100-200' },
    { label: '$200 to $500', value: '200-500' },
    { label: 'Over $500', value: '500-100000' },
];

export default function CatalogFilter({ categories }: CatalogFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [category, setCategory] = useState(searchParams.get('category') || 'all');
    const [price, setPrice] = useState(searchParams.get('price') || '');

    // Update state when URL changes
    useEffect(() => {
        setCategory(searchParams.get('category') || 'all');
        setPrice(searchParams.get('price') || '');
    }, [searchParams]);

    const applyFilter = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }

        // Reset pagination when filtering
        params.delete('page');

        router.push(`/catalog?${params.toString()}`);
    };

    const FilterContent = () => (
        <div className="space-y-8">
            {/* Categories */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-900 dark:text-zinc-100">
                    Categories
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => applyFilter('category', 'all')}
                            className={`text-sm ${category === 'all' ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'} text-left`}
                        >
                            All Categories
                        </button>
                    </div>
                    {categories.map((c) => (
                        <div key={c} className="flex items-center space-x-2">
                            <button
                                onClick={() => applyFilter('category', c)}
                                className={`text-sm capitalize ${category === c ? 'font-bold text-black' : 'text-zinc-600 hover:text-black'} text-left`}
                            >
                                {c}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold tracking-wide uppercase text-zinc-900 dark:text-zinc-100">
                    Price Range
                </h3>
                <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                        <div key={range.value || 'all'} className="flex items-center space-x-2">
                            <input
                                type="radio"
                                id={`price-${range.value || 'all'}`}
                                name="price"
                                value={range.value}
                                checked={price === range.value}
                                onChange={(e) => applyFilter('price', e.target.value)}
                                className="h-4 w-4 border-zinc-300 text-black focus:ring-black"
                            />
                            <Label htmlFor={`price-${range.value || 'all'}`} className="text-sm cursor-pointer font-normal text-zinc-600">
                                {range.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {(category !== 'all' || price) && (
                <Button variant="outline" className="w-full" onClick={() => router.push('/catalog')}>
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 pr-8 border-r border-zinc-100 dark:border-zinc-800">
                <FilterContent />
            </div>

            {/* Mobile Filter Sheet */}
            <div className="lg:hidden mb-6">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="w-full">
                            <Filter className="w-4 h-4 mr-2" />
                            Filters
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left">
                        <div className="mt-6">
                            <FilterContent />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </>
    );
}
