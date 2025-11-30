import ProductCard from "./product-card";
import { Product } from '@/types';

const ProductList = ({ data, title, limit }: { data: Product[]; title?: string; limit?: number }) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <section id="products" className='py-16 md:py-20'>
      <div className="wrapper">
        {title && (
          <div className="text-center mb-12 space-y-4">
            <h2 className='text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 dark:from-violet-400 dark:via-purple-400 dark:to-fuchsia-400 bg-clip-text text-transparent'>
              {title}
            </h2>
            <div className="w-24 h-1 mx-auto bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-full" />
          </div>
        )}

        {data.length > 0 ? (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8'>
            {limitedData.map((product: Product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
              <svg className="w-10 h-10 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;