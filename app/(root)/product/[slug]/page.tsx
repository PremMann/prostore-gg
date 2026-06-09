import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import ProductPrice from "@/components/ui/shared/product/product-price";
import ProductImages from "@/components/ui/shared/product/product-images";
import AddToCart from "@/components/ui/shared/product/add-to-cart";
import TelegramChatButton from "@/components/ui/shared/product/telegram-chat-button";
import { Product } from "@/types";

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {

  const { slug } = await props.params;

  const product = await getProductBySlug(slug) as unknown as Product;

  if (!product) {
    return notFound();
  }


  return (
    <>
      <section className="py-8 lg:py-12">
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
          {/* Left Column - Product Images (60% on desktop) */}
          <div className='lg:pr-8'>
            <ProductImages images={product.images} />
          </div>

          {/* Right Column - Product Details (40% on desktop) */}
          <div className='space-y-6'>
            {/* Brand & Category */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{product.brand}</span>
              <span>•</span>
              <span>{product.category}</span>
            </div>

            {/* Product Name */}
            <h1 className='text-3xl lg:text-4xl font-bold tracking-tight'>{product.name}</h1>
            {product.nameKh && (
              <p className="text-lg text-muted-foreground mt-1">{product.nameKh}</p>
            )}

            {/* Product Code */}
            {product.productCode && (
              <div className="text-sm text-muted-foreground">
                SKU: <span className="font-mono">{product.productCode}</span>
              </div>
            )}

            {/* Price */}
            <div className='flex items-baseline gap-3'>
              <ProductPrice
                value={Number(product.price)}
                className='text-3xl lg:text-4xl font-bold'
              />
            </div>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-xl font-semibold">{product.rating}</span>
                <span className="text-yellow-500 text-xl">★</span>
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            {/* Stock Status */}
            <div className='flex items-center gap-3'>
              <span className="text-sm font-medium text-muted-foreground">Status:</span>
              {product.stock > 0 ? (
                <Badge variant='outline' className="bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                  In Stock ({product.stock} available)
                </Badge>
              ) : (
                <Badge variant='destructive'>Out Of Stock</Badge>
              )}
            </div>

            <div className="border-t" />

            {/* Add to Cart Section */}
            {product.stock > 0 && (
              <div className='space-y-4'>
                <AddToCart product={product} />
                <TelegramChatButton product={product} />
              </div>
            )}

            {product.stock < 1 && (
              <div className='space-y-4'>
                <TelegramChatButton product={product} />
              </div>
            )}

            <div className="border-t" />

            {/* Description */}
            <div className='space-y-3'>
              <h2 className='text-xl font-semibold'>Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;