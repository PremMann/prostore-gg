export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import ProductList from "@/components/ui/shared/product/product-list";
import { getAllProducts } from "@/lib/actions/product.actions";
import SearchFilters from "@/components/ui/shared/search/search-filters";

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


    return (
        <div className="min-h-screen">


            {/* Filters and Products */}
            <div className="wrapper py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Filters */}
                    <aside className="lg:col-span-1">
                        <Suspense fallback={<div>Loading filters...</div>}>
                            <SearchFilters
                                currentCategory={category}
                                currentSearch={search}
                            />
                        </Suspense>
                    </aside>

                    {/* Products Grid */}
                    <main className="lg:col-span-3">
                        {products.length > 0 ? (
                            <>
                                <ProductList data={products} />

                                {/* Pagination */}
                                {pagination && pagination.totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-12">
                                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                                            <a
                                                key={pageNum}
                                                href={`/search?${new URLSearchParams({
                                                    ...(category && { category }),
                                                    ...(search && { search }),
                                                    page: pageNum.toString(),
                                                }).toString()}`}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all ${pageNum === page
                                                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg'
                                                    : 'bg-card border border-border hover:border-purple-500'
                                                    }`}
                                            >
                                                {pageNum}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                                    <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                                <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                                <a
                                    href="/search"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium hover:shadow-lg transition-all"
                                >
                                    View All Products
                                </a>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default SearchPage;
