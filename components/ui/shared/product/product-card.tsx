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
    <Card className="group w-full h-full flex flex-col overflow-hidden rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/20">
      {/* Image Container */}
      <Link href={`/product/${product.slug}`} className="relative w-full aspect-square overflow-hidden bg-zinc-900">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Quick Add button */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
          <Button
            size="sm"
            className="w-full bg-white/90 text-zinc-900 hover:bg-white backdrop-blur-sm text-sm font-medium rounded-lg"
          >
            <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
            Quick Add
          </Button>
        </div>

        {/* Stock badge */}
        {product.stock > 0 ? (
          product.stock < 10 && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-orange-500/90 backdrop-blur-sm text-white text-xs font-medium">
              {product.stock} left
            </div>
          )
        ) : (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium">
            Sold out
          </div>
        )}
      </Link>

      {/* Content */}
      <CardContent className="p-4 flex flex-col gap-2 flex-1 bg-transparent">
        {/* Brand */}
        <div className="text-xs font-medium text-violet-400 uppercase tracking-wider">
          {product.brand}
        </div>

        {/* Product Name */}
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-sm font-medium text-white line-clamp-2 hover:text-violet-400 transition-colors duration-200 leading-snug">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(Number(product.rating))
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-zinc-700 text-zinc-700'
                  }`}
              />
            ))}
          </div>
          <span className="text-xs text-zinc-500">
            ({product.rating})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mt-auto pt-2">
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} className="text-lg font-semibold text-white" />
          ) : (
            <p className="text-red-400 text-sm font-medium">Out of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;