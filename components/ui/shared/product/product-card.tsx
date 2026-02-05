'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from './product-price';
import { Product } from '@/types';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '@/components/cart/cart-context';
import { toast } from 'sonner';

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    // Add with default size and color if available
    const cartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price.toString(),
      qty: 1,
      size: product.sizes?.[0] || undefined,
      color: product.colors?.[0] || undefined,
    };

    addItem(cartItem);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Card className="group w-full h-full flex flex-col overflow-hidden border-0 bg-transparent shadow-none">
      {/* Image Container - Sharp, Minimal */}
      <Link href={`/product/${product.slug}`} className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-4">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-all duration-500" />

        {/* Stock badge - Minimal */}
        {product.stock > 0 ? (
          product.stock < 10 && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-medium tracking-wider uppercase">
              {product.stock} left
            </div>
          )
        ) : (
          <div className="absolute top-3 right-3 px-2 py-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-medium tracking-wider uppercase">
            Sold out
          </div>
        )}

        {/* Add to Cart Button - Desktop: Show on hover / Mobile: Always visible */}
        {product.stock > 0 && (
          <button
            onClick={handleAddToCart}
            className="
              absolute bottom-3 left-3 right-3
              flex items-center justify-center gap-2
              py-3 px-4
              bg-black/90 dark:bg-white/90
              text-white dark:text-black
              text-xs font-medium tracking-wider uppercase
              backdrop-blur-sm
              transition-all duration-300 ease-out
              
              /* Mobile: Always visible */
              opacity-100
              
              /* Desktop: Show on hover with slide-up animation */
              md:opacity-0 md:translate-y-2
              md:group-hover:opacity-100 md:group-hover:translate-y-0
              
              hover:bg-black dark:hover:bg-white
              active:scale-[0.98]
              cursor-pointer
            "
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
            <Plus className="w-3 h-3" />
          </button>
        )}
      </Link>

      {/* Content - Ultra Minimal */}
      <CardContent className="p-0 flex flex-col gap-2 flex-1">
        {/* Brand - Uppercase, Tracked */}
        <div className="text-[10px] font-medium text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.15em]">
          {product.brand}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-light text-black dark:text-white line-clamp-2 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors duration-300 leading-relaxed">
            {product.name}
          </h3>
        </Link>

        {/* Price - Prominent but Minimal */}
        <div className="flex items-center justify-between mt-auto pt-3">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="text-base font-light text-black dark:text-white" />
          ) : (
            <p className="text-zinc-400 dark:text-zinc-600 text-sm font-light">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;