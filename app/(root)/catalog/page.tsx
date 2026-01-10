import { Metadata } from 'next';
import { getAllProducts, getAllCategories } from '@/lib/actions/product.actions';
import { Product } from '@/types';
import CatalogClientWrapper from '@/components/catalog/catalog-client-wrapper';

export const metadata: Metadata = {
    title: 'Product Catalog | Best Deals',
    description: 'Explore our wide range of premium products. Best prices, high quality, and fast shipping.',
    openGraph: {
        title: 'Premium Product Catalog',
        description: 'Discover our exclusive collection of high-quality products. Shop now for the best deals!',
        images: ['/images/catalog-og.jpg'],
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
        limit: 12,
    });

    const categoriesData = await getAllCategories();
    const categories = categoriesData.success ? (categoriesData.data as string[]) : [];
    const products = productsData.success ? (productsData?.data?.products as Product[]) : [];

    return (
        <CatalogClientWrapper
            categories={categories}
            products={products}
        />
    );
}
