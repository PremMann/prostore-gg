'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProductPrice from './product-price';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check, Heart } from 'lucide-react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useFavorites } from '@/components/catalog/favorites-context';
import { useLanguage } from '@/components/catalog/language-context';

const CatalogProductCard = ({ product }: { product: Product }) => {
    const { favorites, toggleFavorite } = useFavorites();
    const { t } = useLanguage();
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const isFavorite = favorites.includes(product.slug);
    const hasColors = product.colors && product.colors.length > 0;

    const scrollImage = (direction: 'left' | 'right') => {
        if (!scrollContainerRef.current) return;

        const container = scrollContainerRef.current;
        const width = container.offsetWidth;
        const scrollAmount = direction === 'left' ? -width : width;

        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const index = Math.round(container.scrollLeft / container.offsetWidth);
        setCurrentImageIndex(index);
    };

    return (
        <Card className={cn(
            "group w-full h-full flex flex-col overflow-hidden border bg-white dark:bg-zinc-950 shadow-sm hover:shadow-md transition-all duration-300 rounded-lg",
            isFavorite ? "border-blue-500 ring-1 ring-blue-500" : "border-zinc-200 dark:border-zinc-800"
        )}>

            {/* Interactive Image Carousel */}
            <div className="relative w-full aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 overflow-hidden group/image">

                {/* Images Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    onScroll={handleScroll}
                    className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {product.images.map((img, idx) => (
                        <div key={idx} className="flex-shrink-0 w-full h-full relative snap-center">
                            <Link href={`/product/${product.slug}`} className="w-full h-full block">
                                <Image
                                    src={img}
                                    alt={`${product.name} - Image ${idx + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                    priority={idx === 0}
                                />
                            </Link>
                        </div>
                    ))}
                </div>

                {/* Carousel Navigation Arrows */}
                {product.images.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.preventDefault(); scrollImage('left'); }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-white dark:hover:bg-black"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-4 h-4 text-black dark:text-white" />
                        </button>
                        <button
                            onClick={(e) => { e.preventDefault(); scrollImage('right'); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 dark:bg-black/60 shadow-sm opacity-0 group-hover/image:opacity-100 transition-opacity z-10 hover:bg-white dark:hover:bg-black"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-4 h-4 text-black dark:text-white" />
                        </button>

                        {/* Dots Indicator */}
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
                            {product.images.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "w-1.5 h-1.5 rounded-full transition-all shadow-sm",
                                        currentImageIndex === idx ? "bg-white w-3 scale-110" : "bg-white/50"
                                    )}
                                />
                            ))}
                        </div>
                    </>
                )}

                {/* Stock Status Badges */}
                {product.stock <= 0 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 text-white text-xs font-medium uppercase tracking-wider rounded z-20 pointer-events-none">
                        {t('product.sold_out')}
                    </div>
                )}
            </div>

            {/* Content */}
            <CardContent className="p-4 flex flex-col gap-3 flex-1">
                <div className="text-xs font-medium text-zinc-900 dark:text-zinc-100 uppercase tracking-wide">
                    {product.brand}
                </div>

                <div className="mt-auto space-y-3">
                    <div className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        <ProductPrice value={Number(product.price)} />
                    </div>

                    {hasColors && (
                        <div className="flex flex-wrap gap-2">
                            {(product.colors as { name: string; imageUrl: string }[]).map((color) => (
                                <button
                                    key={color.name}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedColor(color.name);
                                    }}
                                    className={cn(
                                        "w-6 h-6 rounded-full border border-zinc-200 dark:border-zinc-700 flex items-center justify-center transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black dark:focus:ring-white",
                                        selectedColor === color.name ? "ring-2 ring-offset-1 ring-black dark:ring-white scale-110" : ""
                                    )}
                                    style={{ backgroundColor: color.name.toLowerCase() }}
                                    title={color.name}
                                >
                                    {selectedColor === color.name && (
                                        <Check className="w-3 h-3 text-white mix-blend-difference" />
                                    )}
                                    <span className="sr-only">{color.name}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Actions */}
            <CardFooter className="p-4 pt-0 w-full">
                <Button
                    variant="outline"
                    className={cn(
                        "w-full h-10 text-sm font-medium transition-all",
                        isFavorite ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400" : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    )}
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(product.slug);
                    }}
                >
                    <Heart className={cn("w-4 h-4 mr-2", isFavorite ? "fill-current" : "")} />
                    {isFavorite ? t('product.liked') : t('product.like')}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default CatalogProductCard;
