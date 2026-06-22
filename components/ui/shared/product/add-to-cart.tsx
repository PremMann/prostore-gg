'use client';

import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Loader, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart/cart-context';
import { trackMetaEvent } from '@/lib/meta-pixel';

export default function AddToCart({
    product,
    onColorChange,
}: {
    product: Product;
    onColorChange?: (color: { name: string; imageUrl: string }) => void;
}) {
    const { addItem } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
    const [selectedColor, setSelectedColor] = useState<{ name: string; imageUrl: string } | null>(
        product.colors?.[0] ?? null
    );

    const handleColorSelect = (color: { name: string; imageUrl: string }) => {
        setSelectedColor(color);
        onColorChange?.(color);
    };

    const handleAddToCart = async () => {
        if (product.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }
        if (product.colors.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        setIsLoading(true);

        // Add item to guest cart (localStorage)
        const result = addItem({
            productId: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price.toString(),
            qty: 1,
            // Use the color-specific image if a color is selected, otherwise fall back to first product image
            image: selectedColor?.imageUrl || product.images[0],
            size: selectedSize || undefined,
            color: selectedColor?.name || undefined,
        });

        if (result.success) {
            toast.success(result.message);
            trackMetaEvent('AddToCart', {
                content_name: product.name,
                content_category: product.category,
                content_ids: [product.id],
                content_type: 'product',
                value: Number(product.price),
                currency: 'USD',
            });
        } else {
            toast.error(result.message);
        }

        setIsLoading(false);
    };

    return (
        <div className="space-y-4">
            {/* Selectors */}
            <div className="space-y-3">
                {product.sizes.length > 0 && (
                    <div className="flex items-center gap-4">
                        <span className="font-semibold w-14">Size:</span>
                        <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    type="button"
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "px-4 py-2 text-xs uppercase tracking-widest border rounded-none transition-all hover:border-black dark:hover:border-white cursor-pointer",
                                        selectedSize === size ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-semibold" : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {product.colors.length > 0 && (
                    <div className="flex items-center gap-4">
                        <span className="font-semibold w-14">Color:</span>
                        <div className="flex flex-wrap gap-2">
                            {(product.colors as { name: string; imageUrl: string }[]).map((color) => (
                                <button
                                    key={color.name}
                                    type="button"
                                    onClick={() => handleColorSelect(color)}
                                    className={cn(
                                        "px-4 py-2 text-xs uppercase tracking-widest border rounded-none transition-all hover:border-black dark:hover:border-white cursor-pointer",
                                        selectedColor?.name === color.name ? "bg-black text-white dark:bg-white dark:text-black border-black dark:border-white font-semibold" : "border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
                                    )}
                                >
                                    {color.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="product-add-action">
                <Button
                    className="w-full h-12 rounded-none uppercase tracking-[0.25em] text-xs font-semibold cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={isLoading || product.stock < 1}
                >
                    {isLoading ? (
                        <Loader className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                        <Plus className="w-4 h-4 mr-2" />
                    )}
                    {product.stock < 1 ? 'OUT OF STOCK' : 'ADD TO BAG'}
                </Button>
            </div>
        </div>
    );
}