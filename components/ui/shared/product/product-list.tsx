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
    <section id="products" className='py-20 md:py-28 bg-white dark:bg-black'>
      <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
        {title && (
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className='text-2xl md:text-3xl font-light tracking-tight uppercase text-black dark:text-white'>
                {title}
              </h2>
              <div className="h-px w-16 bg-black dark:bg-white mt-4" />
            </div>
            {viewAllLink && (
              <Link
                href={viewAllLink}
                className="hidden md:flex items-center gap-2 text-xs tracking-wide uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors group"
              >
                {viewAllText}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        )}

        {data.length > 0 ? (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10'>
              {limitedData.map((product: Product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            {viewAllLink && (
              <div className="md:hidden text-center mt-12">
                <Link
                  href={viewAllLink}
                  className="inline-flex items-center gap-2 text-xs tracking-wide uppercase text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  {viewAllText}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className='text-center py-20'>
            <h3 className="text-lg font-light tracking-wide uppercase text-black dark:text-white mb-2">No products found</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Check back soon for new arrivals</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductList;