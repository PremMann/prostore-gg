export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import { getAllProducts } from "@/lib/actions/product.actions";
import SearchFilters from "@/components/ui/shared/search/search-filters";
import ProductCard from '@/components/ui/shared/product/product-card';
import Link from 'next/link';

type RawSearchParams = Record<string, string | string[] | undefined>;

const SearchPage = async ({ searchParams }: { searchParams: Promise<RawSearchParams> }) => {
    const sp = await searchParams;
    const category = typeof sp.category === 'string' ? sp.category : Array.isArray(sp.category) ? sp.category[0] ?? '' : '';
    const search = typeof sp.search === 'string' ? sp.search : Array.isArray(sp.search) ? sp.search[0] ?? '' : '';
    const sortBy = (typeof sp.sortBy === 'string' ? sp.sortBy : Array.isArray(sp.sortBy) ? sp.sortBy[0] : undefined) || 'createdAt';
    const page = Number(typeof sp.page === 'string' ? sp.page : Array.isArray(sp.page) ? sp.page[0] : undefined) || 1;

    // Fetch products with filters
    const result = await getAllProducts({
        category,
        search,
        sortBy: sortBy as 'name' | 'price' | 'rating' | 'createdAt',
        page,
        limit: 12,
    });

    const products = result.success && result.data ? result.data.products : [];
    const pagination = result.success && result.data ? result.data.pagination : null;

    // Get display title
    const getPageTitle = () => {
        if (search) return `Search Results`;
        if (category) {
            return category.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
        }
        return 'All Products';
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Header Section */}
            <div className="border-b border-zinc-200 dark:border-zinc-800">
                <div className="max-w-[1600px] mx-auto px-8 lg:px-16 py-12 lg:py-16">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-tight text-black dark:text-white">
                        {getPageTitle()}
                    </h1>
                    {search && (
                        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                            Showing results for &quot;{search}&quot;
                        </p>
                    )}
                    {pagination && (
                        <p className="mt-2 text-xs tracking-wide uppercase text-zinc-500 dark:text-zinc-500">
                            {pagination.total} {pagination.total === 1 ? 'Product' : 'Products'}
                        </p>
                    )}
                </div>
            </div>

            {/* Main Content - Sidebar + Grid */}
            <div className="max-w-[1600px] mx-auto px-8 lg:px-16">
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 py-12 lg:py-16">
                    {/* Sidebar Filters - Sticky on Desktop */}
                    <aside className="lg:w-[280px] lg:flex-shrink-0">
                        <div className="lg:sticky lg:top-8">
                            <Suspense fallback={
                                <div className="space-y-4">
                                    <div className="h-10 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                                    <div className="h-40 bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                                </div>
                            }>
                                <SearchFilters
                                    currentCategory={category}
                                    currentSearch={search}
                                />
                            </Suspense>
                        </div>
                    </aside>

                    {/* Products Grid */}
                    <main className="flex-1 min-w-0">
                        {products.length > 0 ? (
                            <>
                                {/* Product Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                                    {products.map((product) => (
                                        <ProductCard key={product.slug} product={product} />
                                    ))}
                                </div>

                                {/* Minimal Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="mt-20 pt-12 border-t border-zinc-200 dark:border-zinc-800">
                                        <div className="flex justify-center items-center gap-1">
                                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                <Link
                                                    key={pageNum}
                                                    href={`/search?${new URLSearchParams({
                                                        ...(category && { category }),
                                                        ...(search && { search }),
                                                        page: pageNum.toString(),
                                                    }).toString()}`}
                                                    className={`min-w-[40px] h-10 flex items-center justify-center text-sm transition-all ${
                                                        pageNum === page
                                                            ? 'text-black dark:text-white font-medium border-b-2 border-black dark:border-white'
                                                            : 'text-zinc-400 dark:text-zinc-600 hover:text-black dark:hover:text-white'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Premium Empty State
                            <div className="text-center py-32">
                                <div className="max-w-md mx-auto space-y-6">
                                    <h3 className="text-2xl font-light tracking-tight text-black dark:text-white">
                                        No Results Found
                                    </h3>
                                    <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                                        We couldn&apos;t find any products matching your criteria.
                                        <br />
                                        Try adjusting your filters or explore our full collection.
                                    </p>
                                    <div className="pt-4">
                                        <Link
                                            href="/search"
                                            className="inline-block text-xs tracking-wide uppercase text-black dark:text-white hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors border-b border-black dark:border-white hover:border-zinc-600 dark:hover:border-zinc-400 pb-1"
                                        >
                                            Clear Filters
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
