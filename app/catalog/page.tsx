
import { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/actions/product.actions';
import CatalogProductCard from '@/components/ui/shared/product/catalog-product-card';
import CatalogFilter from '@/components/catalog/catalog-filter';
import { Product } from '@/types';
import { FavoritesProvider } from '@/components/catalog/favorites-context';
import CatalogFloatingButton from '@/components/catalog/catalog-floating-button';

export const metadata: Metadata = {
    title: 'Product Catalog | Best Deals',
    description: 'Explore our wide range of premium products. Best prices, high quality, and fast shipping.',
    openGraph: {
        title: 'Premium Product Catalog',
        description: 'Discover our exclusive collection of high-quality products. Shop now for the best deals!',
        images: ['/images/catalog-og.jpg'], // Assuming a default or dynamic image
        type: 'website',
    },
};

export default async function CatalogPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
    const { q, category, price, page } = await props.searchParams;

    const productsData = await getAllProducts({
        search: q,
        category,
        price,
        page: Number(page) || 1,
        limit: 12, // Show 12 products per page
    });

    const categoriesData = await getAllCategories();
    const categories = categoriesData.success ? (categoriesData.data as string[]) : [];
    const products = productsData.success ? (productsData?.data?.products as Product[]) : [];

    return (
        <FavoritesProvider>
            <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
                {/* Header */}
                <div className="mb-8 text-center space-y-2">
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Our Collection
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto">
                        Browse our premium selection of products designed for quality and performance.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filter */}
                    <aside className="lg:w-1/4">
                        <CatalogFilter categories={categories} />
                    </aside>

                    {/* Product Grid */}
                    <div className="lg:w-3/4 flex-1">
                        {products.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <div key={product.id} className="h-full">
                                        <CatalogProductCard product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                                <h3 className="text-lg font-medium text-zinc-900">No products found</h3>
                                <p className="text-zinc-500">Try adjusting your filters or search criteria.</p>
                            </div>
                        )}
                    </div>
                </div>

                <CatalogFloatingButton />
            </div>
        </FavoritesProvider>
    );
}
