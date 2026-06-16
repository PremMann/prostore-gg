'use client';
import { useState, useRef } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductImagesProps {
  images: string[];
  overrideImage?: string;
  onThumbnailClick?: (index: number) => void;
}

const ProductImages = ({ images, overrideImage, onThumbnailClick }: ProductImagesProps) => {
  const [current, setCurrent] = useState(0);

  // Which image to show in the main viewer
  const displayImage = overrideImage ?? images[current];

  // Which thumbnail index to highlight (-1 when color imageUrl isn't in the images array)
  const highlightedIndex = overrideImage
    ? images.indexOf(overrideImage)
    : current;
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      const newScrollLeft = scrollContainerRef.current.scrollLeft +
        (direction === 'left' ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className='space-y-4'>
      <div className='relative w-full aspect-square overflow-hidden rounded-none border border-zinc-200 dark:border-zinc-800 bg-muted'>
        <Image
          src={displayImage}
          alt='product image'
          fill
          className='object-contain'
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {images.length > 1 && (
        <div className='relative group'>
          {/* Left Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Thumbnail Container */}
          <div
            ref={scrollContainerRef}
            className='flex gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-hide px-8'
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((image, index) => (
              <button
                key={image}
                onClick={() => {
                  setCurrent(index);
                  onThumbnailClick?.(index);
                }}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 border rounded-none overflow-hidden cursor-pointer hover:border-black dark:hover:border-white transition-colors',
                  highlightedIndex === index ? 'border-black dark:border-white' : 'border-zinc-200 dark:border-zinc-800'
                )}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className='object-cover'
                  sizes="100px"
                />
              </button>
            ))}
          </div>

          {/* Right Arrow */}
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 rounded-none opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductImages;