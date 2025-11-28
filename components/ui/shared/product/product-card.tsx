import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import ProductPrice from './product-price';
import { Product } from '@/types';

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Card className='w-full h-full flex flex-col'>
      <CardHeader className='p-0 items-center overflow-hidden'>
        <Link href={`/product/${product.slug}`} className="w-full">
          <div className="relative w-full aspect-square">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className='p-4 flex flex-col gap-3 flex-1'>
        <div className='text-xs text-muted-foreground'>{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className='text-sm font-medium line-clamp-2 hover:underline'>{product.name}</h2>
        </Link>
        <div className='flex-between gap-4 mt-auto'>
          <p className='text-xs text-muted-foreground'>{product.rating} Stars</p>
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <p className='text-destructive text-sm'>Out Of Stock</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;