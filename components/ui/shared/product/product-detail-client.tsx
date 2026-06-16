'use client';

import { useState } from 'react';
import { Product } from '@/types';
import ProductImages from './product-images';
import AddToCart from './add-to-cart';
import ProductPrice from './product-price';

export default function ProductDetailClient({ product }: { product: Product }) {
  // The imageUrl coming from the selected color variant (null = use normal gallery)
  const [colorImageUrl, setColorImageUrl] = useState<string | null>(
    product.colors?.[0]?.imageUrl || null
  );

  const handleColorChange = (color: { name: string; imageUrl: string }) => {
    setColorImageUrl(color.imageUrl || null);
  };

  // When the user manually picks a thumbnail, clear the color override
  const handleThumbnailClick = () => {
    setColorImageUrl(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Left Column – Product Images */}
      <div className="lg:pr-8">
        <ProductImages
          images={product.images}
          overrideImage={colorImageUrl ?? undefined}
          onThumbnailClick={handleThumbnailClick}
        />
      </div>

      {/* Right Column – Product Details */}
      <div className="space-y-6">
        {/* Brand & Category */}
        <div className="flex items-center gap-2 uppercase text-[10px] tracking-[0.2em] font-medium text-zinc-500">
          <span>{product.brand}</span>
          <span>•</span>
          <span>{product.category}</span>
        </div>

        {/* Product Name */}
        <h1 className="text-3xl lg:text-4xl font-light uppercase tracking-tight">
          {product.name}
        </h1>
        {product.nameKh && (
          <p className="text-lg text-muted-foreground mt-1">{product.nameKh}</p>
        )}

        {/* Product Code */}
        {product.productCode && (
          <div className="text-[10px] tracking-[0.1em] text-zinc-400 uppercase">
            SKU: <span className="font-mono">{product.productCode}</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <ProductPrice
            value={Number(product.price)}
            className="text-3xl lg:text-4xl font-bold"
          />
        </div>

        {/* Rating & Reviews */}
        <div className="text-[10px] tracking-[0.2em] uppercase font-medium text-zinc-600 dark:text-zinc-400">
          RATING: {Number(product.rating).toFixed(1)} / 5.0 ({product.numReviews} REVIEWS)
        </div>

        {/* Stock Status */}
        <div className="text-[10px] tracking-widest uppercase font-medium">
          STATUS:{' '}
          {product.stock > 0 ? (
            <span className="text-zinc-900 dark:text-zinc-100">IN STOCK</span>
          ) : (
            <span className="text-zinc-500">OUT OF STOCK</span>
          )}
        </div>

        <div className="border-t" />

        {/* Add to Cart */}
        {product.stock > 0 && (
          <div className="space-y-4">
            <AddToCart product={product} onColorChange={handleColorChange} />
          </div>
        )}

        {product.stock < 1 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">This product is currently out of stock.</p>
          </div>
        )}

        <div className="border-t" />

        {/* Description */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}
