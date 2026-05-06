'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { useCart } from '@/components/cart/cart-context';
import { toast } from 'sonner';

const ProductCard = ({ product }: { product: Product }) => {
  const { addItem } = useCart();

  const handleAddSize = (e: React.MouseEvent, size: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return;

    const cartItem = {
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: product.images[0],
      price: product.price.toString(),
      qty: 1,
      size: size,
      color: product.colors?.[0] || undefined,
    };

    addItem(cartItem);
    toast.success('Item added to bag');
  };

  const hasSecondImage = product.images.length > 1;

  return (
    <div className="group w-full flex flex-col bg-white">
      <Link href={`/product/${product.slug}`} className="relative w-full aspect-square overflow-hidden mb-2 bg-gray-100 block">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-500 ease-in-out ${hasSecondImage ? 'group-hover:opacity-0' : ''}`}
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        {hasSecondImage && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate`}
            fill
            className="object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100 absolute inset-0"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        )}

        {product.stock <= 0 && (
          <div className="absolute top-2 left-2 bg-black text-white text-[10px] tracking-widest px-2 py-1 uppercase font-bold z-10">
            SOLD OUT
          </div>
        )}
      </Link>

      {/* Size Pills */}
      {product.stock > 0 && product.sizes && product.sizes.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={(e) => handleAddSize(e, size)}
              className="px-2 py-1 text-[10px] font-bold border border-black hover:bg-black hover:text-white transition-colors uppercase cursor-pointer"
            >
              {size}
            </button>
          ))}
        </div>
      )}
      {product.stock > 0 && (!product.sizes || product.sizes.length === 0) && (
        <div className="flex flex-wrap gap-1 mb-2">
            <button
              onClick={(e) => handleAddSize(e, '')}
              className="px-2 py-1 text-[10px] font-bold border border-black hover:bg-black hover:text-white transition-colors uppercase cursor-pointer"
            >
              ADD
            </button>
        </div>
      )}

      {/* Product Info */}
      <div className="flex flex-col gap-0.5">
        <Link href={`/product/${product.slug}`}>
          <h3 className="text-[13px] md:text-[15px] font-bold text-black uppercase tracking-widest leading-tight group-hover:opacity-70 transition-opacity">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs md:text-sm font-normal text-black">
          ${Number(product.price).toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default ProductCard;