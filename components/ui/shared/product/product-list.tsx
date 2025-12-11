import ProductCard from "./product-card";
import { Product } from '@/types';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ProductListProps {
  data: Product[];
  title?: string;
  limit?: number;
  viewAllLink?: string;
  viewAllText?: string;
}

const ProductList = ({ data, title, limit, viewAllLink, viewAllText = "View All" }: ProductListProps) => {
  const limitedData = limit ? data.slice(0, limit) : data;
  return (
    <section id="products" className='py-16 md:py-20 bg-background dark:bg-[#0A0A0F]'>
      <div className="wrapper">
        {title && (
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className='text-2xl md:text-3xl font-bold text-foreground dark:text-white'>
                {title}
              </h2>
              <p className="text-muted-foreground dark:text-zinc-500 mt-2">
                Handpicked just for you
              </p>
            </div>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors group"
              >
                {viewAllText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {data.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {limitedData.map((product: Product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            {viewAllLink && (
              <div className="sm:hidden text-center mt-8">
                <Link
                  href={viewAllLink}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground dark:text-zinc-400 hover:text-foreground dark:hover:text-white transition-colors"
                >
                  {viewAllText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-20'>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted dark:bg-white/5 mb-4">
              <svg className="w-10 h-10 text-muted-foreground dark:text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground dark:text-white mb-2">No products found</h3>
            <p className="text-muted-foreground dark:text-zinc-500">Check back soon for new arrivals!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;