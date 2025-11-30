'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import ProductPrice from './product-price';
import { Product } from '@/types';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className="group w-full h-full flex flex-col overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-card/50 backdrop-blur-sm">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Quick view button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
          <Button
            size="sm"
            className="bg-white/90 dark:bg-black/90 text-foreground hover:bg-white dark:hover:bg-black backdrop-blur-sm shadow-lg"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Quick View
          </Button>
        </div>

        {/* Stock badge */}
        {product.stock > 0 ? (
          product.stock < 10 && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-orange-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
              Only {product.stock} left
            </div>
          )
        ) : (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium shadow-lg">
            Out of Stock
          </div>
        )}
      </Link>

      {/* Content */}
      <CardContent className="p-5 flex flex-col gap-3 flex-1">
        {/* Brand */}
        <div className="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          {product.brand}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-base font-semibold line-clamp-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(Number(product.rating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            ({product.rating})
          </span>
        </div>

        {/* Price and Stock */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="text-xl font-bold" />
          ) : (
            <p className="text-destructive text-sm font-medium">Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;