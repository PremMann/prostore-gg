const ProductListSkeleton = () => {
    return (
        <section className="py-20 md:py-28 bg-white dark:bg-black">
            <div className="max-w-[1400px] mx-auto px-8 lg:px-16">
                {/* Title skeleton */}
                <div className="flex items-end justify-between mb-16">
                    <div className="space-y-4">
                        <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                        <div className="h-px w-16 bg-zinc-200 dark:bg-zinc-800" />
                    </div>
                </div>

                {/* Product grid skeleton */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="overflow-hidden">
                            {/* Image skeleton */}
                            <div className="aspect-[3/4] bg-zinc-100 dark:bg-zinc-900 animate-pulse mb-4" />
                            
                            {/* Content skeleton */}
                            <div className="space-y-2">
                                <div className="h-3 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                                <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                                <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
                                <div className="h-5 w-16 bg-zinc-200 dark:bg-zinc-800 animate-pulse mt-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductListSkeleton;
