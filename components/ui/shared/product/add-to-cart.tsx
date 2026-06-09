'use client';

import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Loader, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCart } from '@/components/cart/cart-context';

export default function AddToCart({ product }: { product: Product }) {
    const { addItem } = useCart();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0]?.name || '');

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
            image: product.images[0],
            size: selectedSize || undefined,
            color: selectedColor || undefined,
        });

        if (result.success) {
            toast.success(result.message);
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
                                        "px-4 py-2 text-sm border rounded-md transition-all hover:border-black dark:hover:border-white",
                                        selectedSize === size ? "border-black dark:border-white bg-secondary/50 font-medium" : "border-input"
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
                                        onClick={() => setSelectedColor(color.name)}
                                        className={cn(
                                            "px-4 py-2 text-sm border rounded-md transition-all hover:border-black dark:hover:border-white",
                                            selectedColor === color.name ? "border-black dark:border-white bg-secondary/50 font-medium" : "border-input"
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
                    className="w-full h-12 text-lg cursor-pointer"
                    onClick={handleAddToCart}
                    disabled={isLoading || product.stock < 1}
                >
                    {isLoading ? (
                        <Loader className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Plus className="w-5 h-5 mr-2" />
                    )}
                    {product.stock < 1 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </div>
        </div>
    );
}