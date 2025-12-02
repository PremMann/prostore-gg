import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/ui/shared/product/product-price";
import ProductImages from "@/components/ui/shared/product/product-images";
import AddToCart from "@/components/ui/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { ColorSwatchList } from "@/components/ui/color-swatch";

import { Product } from "@/types";

const ProductDetailsPage = async (props: { params: Promise<{ slug: string }> }) => {

  const { slug } = await props.params;

  const product = await getProductBySlug(slug) as unknown as Product;

  if (!product) {
    return notFound();
  }

  const cart = await getMyCart();
  return (
    <>
      <section className="py-6">
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
          {/* Images Column */}
          <div className='lg:col-span-2'>
            <ProductImages images={product.images} />
          </div>

          {/* Details Column */}
          <div className='lg:col-span-2 space-y-6'>
            <div className='flex flex-col gap-4'>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{product.brand}</span>
                <span>•</span>
                <span>{product.category}</span>
              </div>

              <h1 className='h2-bold'>{product.name}</h1>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-semibold">{product.rating}</span>
                  <span className="text-muted-foreground">★</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>

              <div className='flex flex-col sm:flex-row sm:items-center gap-3'>
                <ProductPrice
                  value={Number(product.price)}
                  className='text-2xl font-bold'
                />
              </div>

              {product.sizes && product.sizes.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">Sizes:</span>
                  <div className="flex gap-2">
                    {product.sizes.map((size: string) => (
                      <Badge key={size} variant="outline">{size}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && product.colors.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="font-semibold">Colors:</span>
                  <ColorSwatchList colors={product.colors} size="md" showLabels={true} />
                </div>
              )}
            </div>

            <div className='border-t pt-6'>
              <h2 className='font-semibold text-lg mb-3'>Description</h2>
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* Action Column */}
          <div className='lg:col-span-1'>
            <Card className="sticky top-4">
              <CardContent className='p-6 space-y-4'>
                <div className='flex justify-between items-center'>
                  <span className="text-muted-foreground">Price</span>
                  <ProductPrice value={Number(product.price)} className="text-xl font-bold" />
                </div>

                <div className='flex justify-between items-center'>
                  <span className="text-muted-foreground">Status</span>
                  {product.stock > 0 ? (
                    <Badge variant='outline' className="bg-green-50 text-green-700 border-green-200">
                      In Stock ({product.stock})
                    </Badge>
                  ) : (
                    <Badge variant='destructive'>Out Of Stock</Badge>
                  )}
                </div>

                {product.stock > 0 && (
                  <div className='pt-4 border-t'>
                    <AddToCart
                      cart={cart}
                      item={{
                        productId: product.id,
                        name: product.name,
                        slug: product.slug,
                        price: product.price,
                        qty: 1,
                        image: product.images![0],
                      }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default ProductDetailsPage;