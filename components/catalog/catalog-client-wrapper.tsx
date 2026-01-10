'use client';

import { Product } from '@/types';
import CatalogProductCard from '@/components/ui/shared/product/catalog-product-card';
import CatalogFilter from '@/components/catalog/catalog-filter';
import CatalogFloatingButton from '@/components/catalog/catalog-floating-button';
import { FavoritesProvider } from '@/components/catalog/favorites-context';
import { LanguageProvider, useLanguage } from '@/components/catalog/language-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

// Wrapper component to provide context to children
export default function CatalogClientWrapper({ categories, products }: { categories: string[], products: Product[] }) {
    return (
        <LanguageProvider>
            <FavoritesProvider>
                <CatalogContent categories={categories} products={products} />
            </FavoritesProvider>
        </LanguageProvider>
    );
}

// Inner component that consumes the language context
function CatalogContent({ categories, products }: { categories: string[], products: Product[] }) {
    const { t, language, toggleLanguage } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl pb-24">
            {/* Language Toggler */}
            <div className="flex justify-end mb-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 text-zinc-600 hover:text-black"
                >
                    <Globe className="w-4 h-4" />
                    <span className="font-medium">{language === 'en' ? 'ខ្មែរ' : 'English'}</span>
                </Button>
            </div>

            {/* Header */}
            <div className="mb-8 text-center space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                    {t('catalog.title')}
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-light">
                    {t('catalog.subtitle')}
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
                            <h3 className="text-lg font-medium text-zinc-900">{t('catalog.no_products')}</h3>
                            <p className="text-zinc-500">{t('catalog.try_filters')}</p>
                        </div>
                    )}
                </div>
            </div>

            <CatalogFloatingButton />
        </div>
    );
}
