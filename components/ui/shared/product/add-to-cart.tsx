'use client';

import { Button } from '@/components/ui/button';
import { addToCart } from '@/lib/actions/cart.actions';
import { CartItem, Product } from '@/types';
import { Loader, Plus } from 'lucide-react';
import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function AddToCart({ product }: { product: Product }) {
    const [isPending, startTransition] = useTransition();
    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
    const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || '');

    // Check if item exists in cart (requires fetching cart on client or passing it)
    // For simplicity in this specialized component, we'll optimistically assume Add mode 
    // UNLESS we fetch cart. 
    // To keep it responsive, simple "Add to Cart" is best.
    // If the user matches size/color, we could show +/-. 
    // Let's implement simple Add first. A robust e-commerce usually just adds (+) or shows error.

    // Actually, to show toast "Success", we just call action.

    const handleAddToCart = () => {
        if (product.sizes.length > 0 && !selectedSize) {
            toast.error('Please select a size');
            return;
        }
        if (product.colors.length > 0 && !selectedColor) {
            toast.error('Please select a color');
            return;
        }

        startTransition(async () => {
            const item: CartItem = {
                productId: product.id,
                name: product.name,
                slug: product.slug,
                price: product.price.toString(), // Convert Decimal to string
                qty: 1,
                image: product.images[0],
                size: selectedSize || undefined,
                color: selectedColor || undefined,
            };

            const res = await addToCart(item);
            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        });
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
                            {product.colors.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    onClick={() => setSelectedColor(color)}
                                    className={cn(
                                        "px-4 py-2 text-sm border rounded-md transition-all hover:border-black dark:hover:border-white",
                                        selectedColor === color ? "border-black dark:border-white bg-secondary/50 font-medium" : "border-input"
                                    )}
                                >
                                    {color}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="product-add-action">
                <Button
                    className="w-full h-12 text-lg"
                    onClick={handleAddToCart}
                    disabled={isPending || product.stock < 1}
                >
                    {isPending ? (
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